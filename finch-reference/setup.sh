#!/usr/bin/env bash
# The command line path. There is a dashboard path too, and if you are already
# in the Cloudflare dashboard adding the Access policy it is the shorter one.
# The README has both.
#
#   ./setup.sh ~/Downloads/service-account.json you@example.com <drive-folder-id>
#
# What it does NOT do, because it cannot: create your Google Cloud project and
# service account, and create the Cloudflare Access application. Both are
# browser jobs on your own accounts. Access in particular is not a Workers
# setting at all, so no amount of wrangler reaches it.

set -euo pipefail
cd "$(dirname "$0")"

KEYFILE="${1:-}"; EMAIL="${2:-}"; FOLDER="${3:-}"
if [ -z "$KEYFILE" ] || [ -z "$EMAIL" ] || [ -z "$FOLDER" ]; then
  echo "Usage: ./setup.sh <service-account.json> <your-email> <drive-folder-id>"
  exit 1
fi
[ -f "$KEYFILE" ] || { echo "No such file: $KEYFILE"; exit 1; }

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }
WR="npx --yes wrangler@4"

say "1. Reading the service account"
SA_EMAIL=$(node -e "process.stdout.write(require('$KEYFILE').client_email||'')")
[ -n "$SA_EMAIL" ] || { echo "That file has no client_email. Is it the JSON key?"; exit 1; }
echo "   service account: $SA_EMAIL"
echo "   The Drive folder has to be shared with that address as Viewer."

say "2. Signing in to Cloudflare"
$WR whoami >/dev/null 2>&1 || $WR login

say "3. Somewhere to keep the tags"
if grep -q 'kv_namespaces' wrangler.jsonc; then
  echo "   already bound (oscar-finch-reference-TAGS), leaving it alone"
else
  OUT=$($WR kv namespace create TAGS)
  echo "$OUT"
  ID=$(echo "$OUT" | grep -oE '[0-9a-f]{32}' | head -1)
  [ -n "$ID" ] || { echo "Could not read the namespace id. Add the binding to wrangler.jsonc by hand."; exit 1; }
  node -e '
    const fs = require("fs"), f = "wrangler.jsonc";
    let s = fs.readFileSync(f, "utf8");
    // Insert the binding after the vars block, keeping the comments intact.
    s = s.replace(/(\n  \}\n)(\n  \/\/ Two things are set out of band)/,
      `$1\n  ,"kv_namespaces": [\n    { "binding": "TAGS", "id": "${process.argv[1]}" }\n  ]\n$2`);
    fs.writeFileSync(f, s);
  ' "$ID"
  echo "   bound TAGS to $ID"
fi

say "4. Settings"
node -e '
  const fs = require("fs"), f = "wrangler.jsonc";
  let s = fs.readFileSync(f, "utf8");
  const set = (k, v) => { s = s.replace(new RegExp(`("${k}": )"[^"]*"`), `$1${JSON.stringify(v)}`); };
  set("ACCESS_EMAILS", process.argv[1]);
  set("DRIVE_FOLDER_ID", process.argv[2]);
  set("GOOGLE_SA_EMAIL", process.argv[3]);
  fs.writeFileSync(f, s);
' "$EMAIL" "$FOLDER" "$SA_EMAIL"
echo "   ACCESS_EMAILS, DRIVE_FOLDER_ID and GOOGLE_SA_EMAIL written"

say "5. The private key, as a secret"
node -e "process.stdout.write(require('$KEYFILE').private_key||'')" | $WR secret put GOOGLE_SA_KEY

say "6. Checks, then deploy"
node _check.mjs
$WR deploy

say "Still to do, and the site serves nothing until it is done"
cat <<'DONE'
Cloudflare Access has to be in front of the hostname. Zero Trust, Access,
Applications, add a self hosted application on this Worker's route, with a
policy allowing only your address.

That is not an oversight. Until Access is stamping a header on requests the
Worker refuses to serve the library, rather than quietly serving it to
everybody.
DONE
