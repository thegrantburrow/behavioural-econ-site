# Oscar Finch reference library

A private, filterable library of the photographs you draw from. Photographs
live in Google Drive, tags and notes live in Cloudflare KV, and the whole thing
is served from your own Cloudflare Worker behind a login that only lets you in.

It is options C and D from the review page built as one system rather than two,
because they answer different halves of the same problem. Drive is where photos
go, which solves adding one from your phone and solves storage. The repository
and the Worker are how you reach them, which solves privacy, filtering and
having an archive that outlives any one service.

```
  your phone  ──►  Google Drive folder  ◄──  the Worker  ──►  your browser
   (camera,          (the photographs)      (the only thing     (never talks
    Drive app)                               with a Drive        to Google)
                                             credential)
                     Cloudflare KV  ◄────────────┘
                     (tags, notes, ratings, the taxonomy)
                            │
                            ▼
                     library.json in git
                     (the archive, written by scripts/export-archive.mjs)
```

## What is here

| Path | What it is |
| --- | --- |
| `worker/index.js` | The only server side code. The gate, the Drive client, the image proxy, the tags API. |
| `worker/wrangler.toml` | Deployment config. Every secret is a placeholder. |
| `site/` | The library itself: `index.html`, `app.js`, `styles.css`. No build step. |
| `scripts/export-archive.mjs` | Pulls the live tags into `library.json` so git has a copy. |
| `taxonomy-map.json` | Where each of the store's 46 product tags went, and why thirteen were left out. |
| `_check.mjs` | The checks. Run before every commit. |

## Two rules this is built on

**The gate fails closed.** With `ACCESS_EMAILS` unset the Worker serves a setup
page and nothing else: no library, no images, no API. An unconfigured gate is an
open door, and this is a private photo collection, so the failure mode is a site
that refuses to work rather than a site that quietly works for everybody.
`_check.mjs` asserts this by running the Worker with an empty environment.

**The browser talks to this site and nobody else.** No CDN, no font host, no
analytics, no embedded widget. The Worker holds the Google credential and
proxies every photograph through `/thumb` and `/img` on this origin, so your
browser never makes a request to a Google host and never holds a Drive token.
`_check.mjs` fails on any absolute URL in `site/`.

`npx wrangler deploy` succeeds with no secrets set at all. Nothing throws on a
missing binding, which matters because `run_worker_first` puts this file in
front of every request including the static ones.

## Setup

### 1. Put it in its own private repository

This folder is self contained and lifts out as it stands.

```
cp -r finch-reference ~/oscar-finch-reference
cd ~/oscar-finch-reference && git init && git add -A && git commit -m "Reference library"
```

Create the repository on GitHub as **private**, then push.

### 2. A Google service account, so nothing expires

A service account rather than an OAuth token, so there is no browser consent to
redo every few months and no refresh token to lose.

1. In the Google Cloud console, create a project (or reuse one).
2. Enable the **Google Drive API** for it.
3. Under **IAM and admin**, then **Service accounts**, create one. No roles are
   needed: it gets its access from the folder you share with it, not from IAM.
4. On that service account, **Keys**, **Add key**, **JSON**. A file downloads.
5. Out of that file you need two values: `client_email` and `private_key`.

### 3. Share the folder with it

1. Make a folder in Drive for your reference photographs.
2. Share it with the service account's `client_email`, as **Viewer**. Read only
   is deliberate: nothing in this system should ever be able to delete a photo.
3. The folder id is the last part of its URL:
   `https://drive.google.com/drive/folders/THIS_PART_HERE`

To span several folders, put their ids in `DRIVE_FOLDER_ID` separated by commas.

### 4. The gate

In the Cloudflare dashboard, under **Zero Trust**, then **Access**, then
**Applications**, add a self hosted application pointing at the hostname you
will serve this on. Give it a policy allowing your email address and nothing
else. Access then stamps every request with a header naming who you are, and
the Worker checks that header against `ACCESS_EMAILS`.

Set the same address in `wrangler.toml`:

```toml
[vars]
ACCESS_EMAILS = "you@example.com"
```

Until this is set, the site serves nothing. That is on purpose.

### 5. Somewhere to keep the tags

```
npx wrangler kv namespace create TAGS
```

It prints an id. Uncomment the `[[kv_namespaces]]` block in `wrangler.toml` and
paste it in. Without this the library still lists and still filters on what
Drive already knows, and nothing you tag survives a reload, which the site says
out loud rather than losing your work silently.

### 6. Deploy

```
cd worker
npx wrangler secret put GOOGLE_SA_KEY     # paste private_key from the JSON, newlines and all
npx wrangler deploy
```

`GOOGLE_SA_EMAIL` and `DRIVE_FOLDER_ID` go in `wrangler.toml` as vars. Only the
private key is a secret.

## Using it

Drop photographs into the Drive folder from any device. They appear in the
library on the next load.

The first time a photograph is ever drawn on screen, your browser reads its
colours, sorts them into named colours, and saves the result. It happens once
for the life of the photo, so no other visit and no other device pays for it.
The read is a starting point and it gets confused by a bright background, so
every colour it assigns can be changed by hand in the panel.

Click a photograph to open it:

| Key | What it does |
| --- | --- |
| `V` | Values only. Strips the colour so you can read the tone. |
| `G` | A thirds grid over the photograph. |
| `F` | Flips it, which is the old mirror trick for seeing your own errors. |
| Arrows | Previous and next, staying inside whatever you have filtered to. |
| `Esc` | Close. |

Filtering: chips in the same row widen the search, chips in different rows
narrow it, and colour chips stack, so asking for red and green means both are
in the photograph. Every chip carries the number of photographs it would leave
you with, counted against everything else already selected, so a chip showing
zero really would empty the grid.

### The vocabulary is the shop's own

The starting taxonomy is not invented. It is the live product tags from the
OscarFinch Shopify store, read on 2026-09-03, split into the parts that describe
a photograph:

| Group | Where it comes from |
| --- | --- |
| Subject | Store tags: People, Watches, Pens, Vehicles, Footwear and the rest. |
| Theme | Store tags: Status & Power, Fate, Fortune & Irony, Wealth, Work. |
| Series | Store tags: Time Traveller, Rocket Espresso, Collaboration. |
| Saved for, Angle, Light, Source | Not in the shop. These describe a photograph, not an artwork. |

So a reference tagged **Watches** and **Status & Power** is filed in the same
words the finished print will be, and the library and the shop never need
translating between them.

`taxonomy-map.json` records where all 46 store tags went, including the thirteen
deliberately left out with the reason for each. Open Edition and Small Format
Only describe how a print is sold. Newer Work and Earlier Era date the artwork,
and the photograph carries its own date. Leaving them listed means re-syncing
after you add a tag is mechanical rather than a fresh judgement call.

The taxonomy is still yours. It lives in KV under the key `taxonomy`, the Worker
serves whatever is there and falls back to the set above, and `PUT /api/taxonomy`
replaces it. Rewrite it once you have tagged fifty photographs and know.

### Which piece a reference fed

The **Drawn from this** field takes the title of the artwork, and the panel then
links straight to it on the shop. Handles are the title slugified, so nothing is
typed twice.

One rule caught by checking against the live store rather than assuming: an
ampersand is **dropped**, not spelled out. "The Time Traveller & The Homo Sapiens
Pen" is `/products/the-time-traveller-the-homo-sapiens-pen`, while "The Heart and
the Wattle" keeps its written "and". All twelve handles on the store were tested
against the rule. Paste a handle in directly and it passes through unchanged.

## The archive

KV holds the copy the site reads and writes. Git holds the copy with a history.

```
node scripts/export-archive.mjs --url https://your-host --client-id ID --client-secret SECRET
git add library.json && git commit -m "Archive tags"
```

The credentials are a Cloudflare Access **service token**, created in the
dashboard under Access, Service Auth, because `/api/export` sits behind the same
gate as everything else. Worth running on a schedule once you have tagged more
than you would want to redo.

## Before you commit

```
node _check.mjs
```

Four things, each there because of a way this could break quietly rather than
loudly: no em dashes in any prose, nothing the page loads comes from somewhere
else, every route the page calls is a route the Worker answers, and the gate
genuinely refuses to serve when it is not configured.

The second one allows exactly one outside address, `www.oscarfinch.com`, and
only as somewhere to navigate on a link you click. A link is not the browser
fetching a third party. The moment that address appears anywhere a browser would
load rather than follow, the check fails.

## What is deliberately not here

**No upload from inside the page.** Drive already has an app on your phone that
does this better than anything I would build, and adding an upload path would
mean giving the Worker write access to your Drive. It has read only access, so
this system can never delete one of your photographs.

**No sharing.** Every route is behind the gate, and there is no public link, no
share button and no expiring token. If you ever want to show somebody a
reference, that is a different feature and it should be built deliberately.
