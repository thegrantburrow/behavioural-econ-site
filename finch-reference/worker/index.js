/*
 * Oscar Finch reference library, the only server side code in the project.
 *
 * Two jobs, and it is written so the site cannot be quietly left open by
 * forgetting one of them:
 *
 *   1. It is the gate. Cloudflare Access authenticates the visitor and stamps
 *      a header on the request. If ACCESS_EMAILS is not configured, this
 *      Worker serves nothing but a setup page, because an unconfigured gate
 *      is an open door and the library is meant to be private.
 *
 *   2. It is the only thing that talks to Google. The browser never gets a
 *      Drive token and never makes a request to a Google host. Photos come
 *      through /img and /thumb on this origin.
 *
 * `wrangler deploy` succeeds with no secrets at all. Nothing throws on a
 * missing binding, because this file runs in front of every request and
 * anything it throws takes the whole site rather than one endpoint.
 */

const DRIVE = 'https://www.googleapis.com/drive/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

/* Drive fields we ask for. imageMediaMetadata.time is the EXIF capture time,
   which is the date the photo was taken rather than the date it was uploaded. */
const FILE_FIELDS = 'id,name,mimeType,size,createdTime,modifiedTime,thumbnailLink,imageMediaMetadata(width,height,time,cameraMake,cameraModel)';

export default {
  async fetch(request, env, ctx) {
    try {
      return await route(request, env, ctx);
    } catch (err) {
      /* Never let a failure here take the whole site down silently. */
      return json({ error: 'worker_error', detail: String(err && err.message || err) }, 500);
    }
  }
};

async function route(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  /* ---- the gate -------------------------------------------------------- */
  const gate = checkAccess(request, env);
  if (!gate.ok) {
    if (path.startsWith('/api/') || path.startsWith('/img/') || path.startsWith('/thumb/')) {
      return json({ error: gate.reason, message: gate.message }, gate.status);
    }
    return html(setupPage(gate), gate.status);
  }

  if (path === '/api/whoami') {
    return json({ email: gate.email, drive: driveConfigured(env), store: !!env.TAGS });
  }
  if (path === '/api/library') return apiLibrary(request, env, ctx);
  if (path === '/api/export') return apiExport(env);
  if (path === '/api/taxonomy' && request.method === 'PUT') return apiPutTaxonomy(request, env);
  if (path.startsWith('/api/tags/')) return apiTags(request, env, decodeURIComponent(path.slice('/api/tags/'.length)));
  if (path.startsWith('/img/')) return apiImage(request, env, ctx, decodeURIComponent(path.slice('/img/'.length)));
  if (path.startsWith('/thumb/')) return apiThumb(request, env, ctx, decodeURIComponent(path.slice('/thumb/'.length)));

  /* Everything else is the static site. */
  if (env.ASSETS) return env.ASSETS.fetch(request);
  return html('<h1>Assets binding missing</h1><p>Run wrangler with the [assets] block from wrangler.toml.</p>', 500);
}

/* ---------------------------------------------------------------------- */
/* The gate                                                                */
/* ---------------------------------------------------------------------- */

/*
 * Fails closed on purpose. An unset ACCESS_EMAILS is not "allow everyone", it
 * is "this site is not protected yet, so serve nothing". The one alternative
 * considered was serving read only in that state, which is worse: a reference
 * library is the photos, so read only and wide open is the leak.
 */
function checkAccess(request, env) {
  const allowed = (env.ACCESS_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!allowed.length) {
    return { ok: false, status: 503, reason: 'not_configured',
      message: 'ACCESS_EMAILS is not set, so this Worker is serving nothing. See README, Setup step 4.' };
  }
  const email = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').toLowerCase();
  if (!email) {
    return { ok: false, status: 403, reason: 'no_access_header',
      message: 'No Cloudflare Access header on this request. Either Access is not in front of this route, or you reached the Worker directly.' };
  }
  if (allowed.indexOf(email) === -1) {
    return { ok: false, status: 403, reason: 'not_allowed', message: 'That account is not on the list.' };
  }
  return { ok: true, email: email };
}

/* ---------------------------------------------------------------------- */
/* Google, reached only from here                                          */
/* ---------------------------------------------------------------------- */

function driveConfigured(env) {
  return !!(env.GOOGLE_SA_EMAIL && env.GOOGLE_SA_KEY && env.DRIVE_FOLDER_ID);
}

function b64url(buf) {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToPkcs8(pem) {
  const body = pem.replace(/-----BEGIN PRIVATE KEY-----/, '')
                  .replace(/-----END PRIVATE KEY-----/, '')
                  .replace(/\\n/g, '')
                  .replace(/\s+/g, '');
  const bin = atob(body);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

/*
 * Service account, not an OAuth refresh token, so there is no browser dance to
 * redo and nothing to re-consent every few months. Setup on your side is one
 * step: share the Drive folder with the service account's email, read only.
 */
let tokenCache = { value: null, expires: 0 };

async function driveToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache.value && tokenCache.expires > now + 60) return tokenCache.value;

  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const claim = b64url(new TextEncoder().encode(JSON.stringify({
    iss: env.GOOGLE_SA_EMAIL, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now
  })));
  const signingInput = header + '.' + claim;

  const key = await crypto.subtle.importKey(
    'pkcs8', pemToPkcs8(env.GOOGLE_SA_KEY),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  const assertion = signingInput + '.' + b64url(sig);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  });
  if (!res.ok) throw new Error('google token ' + res.status + ' ' + (await res.text()).slice(0, 300));
  const data = await res.json();
  tokenCache = { value: data.access_token, expires: now + (data.expires_in || 3600) };
  return tokenCache.value;
}

async function driveList(env) {
  const token = await driveToken(env);
  const out = [];
  let pageToken = null;
  /* Folder ids may be a comma separated list, so one library can span folders. */
  const folders = env.DRIVE_FOLDER_ID.split(',').map(s => s.trim()).filter(Boolean);
  for (const folder of folders) {
    pageToken = null;
    do {
      const q = "'" + folder + "' in parents and mimeType contains 'image/' and trashed = false";
      const u = new URL(DRIVE + '/files');
      u.searchParams.set('q', q);
      u.searchParams.set('fields', 'nextPageToken,files(' + FILE_FIELDS + ')');
      u.searchParams.set('pageSize', '1000');
      u.searchParams.set('supportsAllDrives', 'true');
      u.searchParams.set('includeItemsFromAllDrives', 'true');
      if (pageToken) u.searchParams.set('pageToken', pageToken);
      const res = await fetch(u, { headers: { authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('drive list ' + res.status + ' ' + (await res.text()).slice(0, 300));
      const data = await res.json();
      (data.files || []).forEach(f => { f.folderId = folder; out.push(f); });
      pageToken = data.nextPageToken || null;
    } while (pageToken);
  }
  return out;
}

/* ---------------------------------------------------------------------- */
/* API                                                                     */
/* ---------------------------------------------------------------------- */

const DEFAULT_TAXONOMY = {
  groups: [
    { key: 'subject', label: 'Subject', values: ['Person', 'Face', 'Hands', 'Full figure', 'Object', 'Vehicle', 'Building', 'Interior', 'Street scene', 'Landscape', 'Animal', 'Texture'] },
    { key: 'why',     label: 'Saved for', values: ['Pose', 'Expression', 'Light', 'Colour', 'Texture', 'Composition', 'Detail', 'Whole mood'] },
    { key: 'angle',   label: 'Angle',   values: ['Front', 'Three quarter', 'Profile', 'Back', 'From above', 'From below'] },
    { key: 'light',   label: 'Light',   values: ['Overcast', 'Golden hour', 'Backlit', 'Harsh sun', 'Indoor', 'Night', 'Studio'] },
    { key: 'source',  label: 'Source',  values: ['My photo', 'Stock, licensed', 'Client supplied', 'Found, unlicensed'] }
  ]
};

async function readTaxonomy(env) {
  if (!env.TAGS) return DEFAULT_TAXONOMY;
  const raw = await env.TAGS.get('taxonomy');
  if (!raw) return DEFAULT_TAXONOMY;
  try { return JSON.parse(raw); } catch (e) { return DEFAULT_TAXONOMY; }
}

async function apiPutTaxonomy(request, env) {
  if (!env.TAGS) return json({ error: 'no_store', message: 'No KV namespace bound, so nothing can be saved.' }, 503);
  const body = await request.json();
  if (!body || !Array.isArray(body.groups)) return json({ error: 'bad_body' }, 400);
  await env.TAGS.put('taxonomy', JSON.stringify(body));
  return json({ ok: true });
}

async function readAllTags(env) {
  const tags = {};
  if (!env.TAGS) return tags;
  let cursor;
  do {
    const page = await env.TAGS.list({ prefix: 'tag:', cursor });
    for (const k of page.keys) {
      const raw = await env.TAGS.get(k.name);
      if (raw) { try { tags[k.name.slice(4)] = JSON.parse(raw); } catch (e) {} }
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return tags;
}

async function apiLibrary(request, env, ctx) {
  const taxonomy = await readTaxonomy(env);
  if (!driveConfigured(env)) {
    return json({ drive: false, store: !!env.TAGS, taxonomy, photos: [],
      message: 'Drive is not connected yet. See README, Setup steps 2 and 3.' });
  }
  let files;
  try { files = await driveList(env); }
  catch (err) { return json({ drive: true, error: 'drive_failed', message: String(err.message || err), taxonomy, photos: [] }, 502); }

  const tags = await readAllTags(env);
  const photos = files.map(f => {
    const t = tags[f.id] || {};
    const meta = f.imageMediaMetadata || {};
    return {
      id: f.id,
      name: f.name,
      mime: f.mimeType,
      bytes: Number(f.size || 0),
      width: meta.width || null,
      height: meta.height || null,
      /* Date taken beats date uploaded wherever the camera recorded one. */
      taken: meta.time || null,
      added: f.createdTime || null,
      camera: [meta.cameraMake, meta.cameraModel].filter(Boolean).join(' ') || null,
      folderId: f.folderId,
      facets: t.facets || {},
      colours: t.colours || [],
      palette: t.palette || [],
      rating: typeof t.rating === 'number' ? t.rating : 0,
      used: !!t.used,
      usedIn: t.usedIn || '',
      note: t.note || '',
      free: t.free || []
    };
  });
  photos.sort((a, b) => String(b.taken || b.added || '').localeCompare(String(a.taken || a.added || '')));
  return json({ drive: true, store: !!env.TAGS, taxonomy, photos, count: photos.length });
}

async function apiTags(request, env, id) {
  if (!id) return json({ error: 'no_id' }, 400);
  if (!env.TAGS) return json({ error: 'no_store', message: 'No KV namespace bound, so tags cannot be saved. See README, Setup step 5.' }, 503);
  if (request.method === 'GET') {
    const raw = await env.TAGS.get('tag:' + id);
    return json(raw ? JSON.parse(raw) : {});
  }
  if (request.method === 'PUT' || request.method === 'POST') {
    const body = await request.json();
    if (!body || typeof body !== 'object') return json({ error: 'bad_body' }, 400);
    const clean = {
      facets: body.facets && typeof body.facets === 'object' ? body.facets : {},
      colours: Array.isArray(body.colours) ? body.colours.slice(0, 12) : [],
      palette: Array.isArray(body.palette) ? body.palette.slice(0, 8) : [],
      rating: Number(body.rating) || 0,
      used: !!body.used,
      usedIn: String(body.usedIn || '').slice(0, 200),
      note: String(body.note || '').slice(0, 4000),
      free: Array.isArray(body.free) ? body.free.slice(0, 40).map(s => String(s).slice(0, 60)) : [],
      updated: new Date().toISOString()
    };
    await env.TAGS.put('tag:' + id, JSON.stringify(clean));
    return json({ ok: true, saved: clean });
  }
  if (request.method === 'DELETE') {
    await env.TAGS.delete('tag:' + id);
    return json({ ok: true });
  }
  return json({ error: 'bad_method' }, 405);
}

/*
 * The archive half of this. scripts/export-archive.mjs pulls this down and
 * commits it, so every tag you have ever written has a history in git even
 * though the live copy lives in KV.
 */
async function apiExport(env) {
  const taxonomy = await readTaxonomy(env);
  const tags = await readAllTags(env);
  return json({ exportedAt: new Date().toISOString(), taxonomy, tags }, 200, {
    'content-disposition': 'attachment; filename="library.json"'
  });
}

/* ---------------------------------------------------------------------- */
/* Images, proxied so the browser only ever talks to this origin           */
/* ---------------------------------------------------------------------- */

async function apiImage(request, env, ctx, id) {
  if (!driveConfigured(env)) return json({ error: 'drive_not_configured' }, 503);
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const token = await driveToken(env);
  const res = await fetch(DRIVE + '/files/' + encodeURIComponent(id) + '?alt=media&supportsAllDrives=true', {
    headers: { authorization: 'Bearer ' + token }
  });
  if (!res.ok) return json({ error: 'drive_fetch', status: res.status }, 502);

  const out = new Response(res.body, {
    status: 200,
    headers: {
      'content-type': res.headers.get('content-type') || 'image/jpeg',
      /* Drive ids are stable, so the bytes behind one never change. */
      'cache-control': 'private, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff'
    }
  });
  ctx.waitUntil(cache.put(cacheKey, out.clone()));
  return out;
}

/*
 * Grid thumbnails. Pulling a 13 MB original to draw a 240px tile is what makes
 * a Drive backed gallery feel slow, so this uses Drive's own thumbnail and asks
 * it for the size actually being drawn. Falls back to the full image when Drive
 * has not made a thumbnail yet, which happens for a few seconds after upload.
 */
const thumbLinks = new Map();

async function apiThumb(request, env, ctx, id) {
  if (!driveConfigured(env)) return json({ error: 'drive_not_configured' }, 503);
  const size = Math.min(2048, Math.max(64, parseInt(new URL(request.url).searchParams.get('s') || '480', 10)));
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const token = await driveToken(env);
  let link = thumbLinks.get(id);
  if (!link) {
    const metaRes = await fetch(DRIVE + '/files/' + encodeURIComponent(id) + '?fields=thumbnailLink&supportsAllDrives=true', {
      headers: { authorization: 'Bearer ' + token }
    });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      if (meta.thumbnailLink) { link = meta.thumbnailLink; thumbLinks.set(id, link); }
    }
  }
  let res;
  if (link) {
    res = await fetch(link.replace(/=s\d+$/, '=s' + size));
    if (!res.ok) { thumbLinks.delete(id); res = null; }
  }
  if (!res) {
    res = await fetch(DRIVE + '/files/' + encodeURIComponent(id) + '?alt=media&supportsAllDrives=true', {
      headers: { authorization: 'Bearer ' + token }
    });
    if (!res.ok) return json({ error: 'drive_fetch', status: res.status }, 502);
  }
  const out = new Response(res.body, {
    status: 200,
    headers: {
      'content-type': res.headers.get('content-type') || 'image/jpeg',
      'cache-control': 'private, max-age=604800',
      'x-content-type-options': 'nosniff'
    }
  });
  ctx.waitUntil(cache.put(cacheKey, out.clone()));
  return out;
}

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj, null, 2), {
    status: status || 200,
    headers: Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, extra || {})
  });
}

function html(body, status) {
  return new Response(body, {
    status: status || 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }
  });
}

function setupPage(gate) {
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Reference library, not open yet</title><style>' +
    'body{margin:0;background:#F5F6F5;color:#1B1E24;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
    '.w{max-width:34em;margin:0 auto;padding:14vh 22px;}' +
    'h1{font-family:Georgia,serif;font-size:26px;margin:0 0 10px;}' +
    'p{color:rgba(27,30,36,.7);}code{background:#EBECEC;padding:2px 6px;border-radius:4px;font-size:14px;}' +
    '.b{border-left:3px solid #C43E1F;padding-left:14px;margin:22px 0;}' +
    '@media (prefers-color-scheme:dark){body{background:#17191A;color:#EEEAE2;}p{color:rgba(238,234,226,.7);}code{background:#232628;}}' +
    '</style></head><body><div class="w">' +
    '<h1>This library is closed</h1>' +
    '<div class="b"><p>' + esc(gate.message) + '</p></div>' +
    '<p>The Worker refuses to serve the library until the gate in front of it is configured, because a reference library with no gate is a public photo album.</p>' +
    '<p>Setup is in <code>README.md</code> in the repository.</p>' +
    '</div></body></html>';
}
