#!/usr/bin/env bash
# Everything that can be scripted, in one run.
#
#   ./setup.sh ~/Downloads/service-account.json you@example.com <drive-folder-id>
#
# What it does NOT do, because it cannot: create your Google Cloud project or
# service account, and create your Cloudflare Access application. Those are two
# browser jobs and the README has them as steps 2 and 4.

set -euo pipefail
cd "$(dirname "$0")/worker"

KEYFILE="${1:-}"; EMAIL="${2:-}"; FOLDER="${3:-}"
if [ -z "$KEYFILE" ] || [ -z "$EMAIL" ] || [ -z "$FOLDER" ]; then
  echo "Usage: ./setup.sh <service-account.json> <your-email> <drive-folder-id>"
  exit 1
fi
[ -f "$KEYFILE" ] || { echo "No such file: $KEYFILE"; exit 1; }

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }

say "1. Reading the service account"
SA_EMAIL=$(node -e "process.stdout.write(require('$KEYFILE').client_email||'')")
[ -n "$SA_EMAIL" ] || { echo "That file has no client_email. Is it the JSON key?"; exit 1; }
echo "   service account: $SA_EMAIL"
echo "   Share the Drive folder with that address as Viewer if you have not already."

say "2. Signing in to Cloudflare"
npx --yes wrangler@4 whoami >/dev/null 2>&1 || npx --yes wrangler@4 login

say "3. Somewhere to keep the tags"
if grep -q '^\[\[kv_namespaces\]\]' wrangler.toml; then
  echo "   already configured, leaving it alone"
else
  OUT=$(npx --yes wrangler@4 kv namespace create TAGS)
  echo "$OUT"
  ID=$(echo "$OUT" | grep -oE '[0-9a-f]{32}' | head -1)
  [ -n "$ID" ] || { echo "Could not read the namespace id out of that. Paste it into wrangler.toml by hand."; exit 1; }
  printf '\n[[kv_namespaces]]\nbinding = "TAGS"\nid = "%s"\n' "$ID" >> wrangler.toml
  echo "   bound TAGS to $ID"
fi

say "4. Settings"
# Only the private key is a secret. The rest are plain vars.
sed -i.bak -E "s|^ACCESS_EMAILS = .*|ACCESS_EMAILS = \"$EMAIL\"|" wrangler.toml
sed -i.bak -E "s|^DRIVE_FOLDER_ID = .*|DRIVE_FOLDER_ID = \"$FOLDER\"|" wrangler.toml
sed -i.bak -E "s|^GOOGLE_SA_EMAIL = .*|GOOGLE_SA_EMAIL = \"$SA_EMAIL\"|" wrangler.toml
rm -f wrangler.toml.bak
echo "   ACCESS_EMAILS, DRIVE_FOLDER_ID and GOOGLE_SA_EMAIL written"

say "5. The private key, as a secret"
node -e "process.stdout.write(require('$KEYFILE').private_key||'')" | npx --yes wrangler@4 secret put GOOGLE_SA_KEY

say "6. Checks, then deploy"
cd ..; node _check.mjs; cd worker
npx --yes wrangler@4 deploy

say "Done"
cat <<'DONE'
One thing is still outstanding and the site will serve nothing until it is done:
Cloudflare Access has to be in front of the hostname. Zero Trust, Access,
Applications, add a self hosted application on this Worker's route, with a
policy allowing only your address.

That is deliberate. Until Access is stamping a header on requests, the Worker
refuses to serve the library rather than quietly serving it to everybody.
DONE
