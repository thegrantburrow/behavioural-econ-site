#!/usr/bin/env node
/*
 * The checks. Run before every commit:  node _check.mjs
 *
 * Four of them, and each exists because of a way this could go wrong quietly
 * rather than loudly.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let failures = 0;
function ok(name, detail) { console.log('  pass  ' + name + (detail ? '  (' + detail + ')' : '')); }
function bad(name, detail) { failures++; console.log('  FAIL  ' + name + '  ' + detail); }

const siteFiles = readdirSync('site').map(f => join('site', f));
const allFiles = siteFiles.concat(['worker/index.js', 'README.md', 'scripts/export-archive.mjs']);

/* 1. No em dashes. Standing rule across this owner's projects: a sentence gets
      the punctuation it actually needs, not a dash standing in for thought. */
{
  const hits = [];
  for (const f of allFiles) {
    const text = readFileSync(f, 'utf8');
    text.split('\n').forEach((line, i) => {
      if (/—|&mdash;|&#8212;/.test(line)) hits.push(f + ':' + (i + 1) + '  ' + line.trim().slice(0, 70));
    });
  }
  if (hits.length) bad('no em dashes', '\n        ' + hits.join('\n        '));
  else ok('no em dashes', allFiles.length + ' files');
}

/* 2. The browser talks to this site and nobody else. No CDN, no font host, no
      analytics, no embedded widget: nothing the page LOADS may come from
      somewhere else.

      One address is allowed and only as a place to navigate to: the shop, on a
      link the reader clicks. A link is not the browser fetching a third party,
      and naming the piece a reference fed is the whole point of the field it
      sits under. Any other absolute URL fails, and so does this one the moment
      it appears anywhere a browser would load rather than follow. */
{
  const NAV_ALLOWED = 'https://www.oscarfinch.com';
  /* An XML namespace is an identifier, not an address. No browser has ever
     fetched it, and a data: URI SVG is invalid without it. */
  const NOT_AN_ADDRESS = ['http://www.w3.org/2000/svg'];
  const hits = [];
  for (const f of siteFiles) {
    const text = readFileSync(f, 'utf8');
    text.split('\n').forEach((line, i) => {
      const urls = line.match(/https?:\/\/[^"'`\s)]+/g) || [];
      for (const u of urls) {
        const where = f + ':' + (i + 1);
        if (NOT_AN_ADDRESS.indexOf(u) !== -1) continue;
        const loads = /(?:\bsrc\b|<script|<link|<img|<iframe|fetch\(|import\(|url\()/i.test(line);
        if (u.startsWith(NAV_ALLOWED) && !loads) continue;   /* a link, allowed */
        hits.push(where + '  ' + (loads ? 'LOADS ' : '') + u.slice(0, 60));
      }
    });
  }
  if (hits.length) bad('nothing the page loads comes from somewhere else', '\n        ' + hits.join('\n        '));
  else ok('nothing the page loads comes from somewhere else', 'links to ' + NAV_ALLOWED + ' allowed');
}

/* 3. Every route the page asks for is a route the Worker answers. A renamed
      endpoint is otherwise a 404 nobody notices until the tool is in use. */
{
  const app = readFileSync('site/app.js', 'utf8');
  const worker = readFileSync('worker/index.js', 'utf8');
  const asked = new Set();
  (app.match(/["'`]\/(api|img|thumb)\/[a-z]*/gi) || []).forEach(s => {
    const p = s.slice(1).replace(/\/$/, '');
    asked.add(p.split('/').slice(0, 3).join('/'));
  });
  const missing = [...asked].filter(r => worker.indexOf("'" + r) === -1 && worker.indexOf('"' + r) === -1);
  if (missing.length) bad('worker answers every route the page calls', missing.join(', '));
  else ok('worker answers every route the page calls', [...asked].sort().join(' '));
}

/* 4. The gate fails closed. With no ACCESS_EMAILS the Worker must serve the
      setup page and no library, because an unconfigured gate is an open door
      and this is a private photo collection. Asserted by running it. */
{
  const mod = await import('./worker/index.js');
  const res = await mod.default.fetch(new Request('https://x.test/'), {}, { waitUntil() {} });
  const body = await res.text();
  const api = await mod.default.fetch(new Request('https://x.test/api/library'), {}, { waitUntil() {} });
  const apiBody = await api.json();

  const leaks = /photos|library|thumb/i.test(body) && !/not\s+configured|closed/i.test(body);
  if (res.status !== 503) bad('gate fails closed on a page request', 'got ' + res.status + ', wanted 503');
  else if (leaks) bad('gate fails closed on a page request', 'the setup page leaked library content');
  else ok('gate fails closed on a page request', '503 and a setup page');

  if (api.status !== 503 || apiBody.error !== 'not_configured') {
    bad('gate fails closed on the API', 'got ' + api.status + ' ' + JSON.stringify(apiBody).slice(0, 80));
  } else ok('gate fails closed on the API', '503 not_configured');

  /* And with a list set but no Access header in front, still closed. */
  const noHdr = await mod.default.fetch(new Request('https://x.test/api/library'), { ACCESS_EMAILS: 'a@b.com' }, { waitUntil() {} });
  if (noHdr.status !== 403) bad('gate rejects a request with no Access header', 'got ' + noHdr.status);
  else ok('gate rejects a request with no Access header', '403');

  /* And an authenticated address that is not on the list. */
  const wrong = await mod.default.fetch(
    new Request('https://x.test/api/library', { headers: { 'Cf-Access-Authenticated-User-Email': 'someone@else.com' } }),
    { ACCESS_EMAILS: 'a@b.com' }, { waitUntil() {} });
  if (wrong.status !== 403) bad('gate rejects an address not on the list', 'got ' + wrong.status);
  else ok('gate rejects an address not on the list', '403');
}

/* 5. An iPhone photo is HEIC and most browsers cannot draw it. Drive keeps a
      JPEG rendition, so /img must serve that instead of the raw bytes for those
      types and the original bytes for everything else. Asserted by running the
      Worker against a stubbed Drive, because the failure is a broken image icon
      with nothing in the console and it would only show up on a machine that is
      not a Mac. */
{
  const { generateKeyPairSync } = await import('node:crypto');
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

  const FILES = {
    heic: { mimeType: 'image/heif', thumbnailLink: 'https://lh3.example/abc=s220' },
    jpg:  { mimeType: 'image/jpeg', thumbnailLink: 'https://lh3.example/def=s220' }
  };
  const seen = [];
  const realFetch = globalThis.fetch;
  globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
  globalThis.fetch = async (input) => {
    const url = typeof input === 'string' ? input : input.url;
    seen.push(url);
    if (url.startsWith('https://oauth2.googleapis.com/token')) {
      return new Response(JSON.stringify({ access_token: 't', expires_in: 3600 }),
        { headers: { 'content-type': 'application/json' } });
    }
    const fieldsMatch = url.match(/files\/(\w+)\?fields=/);
    if (fieldsMatch) {
      return new Response(JSON.stringify(FILES[fieldsMatch[1]] || {}),
        { headers: { 'content-type': 'application/json' } });
    }
    if (url.includes('alt=media')) {
      return new Response('RAWBYTES', { headers: { 'content-type': 'image/heif' } });
    }
    return new Response('JPEGBYTES', { headers: { 'content-type': 'image/jpeg' } });
  };

  const mod2 = await import('./worker/index.js?heic');
  const env = {
    ACCESS_EMAILS: 'a@b.com', GOOGLE_SA_EMAIL: 'sa@x.iam', GOOGLE_SA_KEY: pem,
    DRIVE_FOLDER_ID: 'F'
  };
  const hdr = { 'Cf-Access-Authenticated-User-Email': 'a@b.com' };
  const ctx = { waitUntil() {} };

  seen.length = 0;
  const heicRes = await mod2.default.fetch(new Request('https://x.test/img/heic', { headers: hdr }), env, ctx);
  const heicType = heicRes.headers.get('content-type');
  const askedRendition = seen.some(u => u.includes('lh3.example/abc=s2048'));
  const askedRaw = seen.some(u => u.includes('files/heic?alt=media'));
  if (heicType !== 'image/jpeg' || !askedRendition || askedRaw) {
    bad('HEIC is served as something a browser can draw',
      'type ' + heicType + ', rendition ' + askedRendition + ', raw ' + askedRaw);
  } else ok('HEIC is served as something a browser can draw', 'Drive rendition at s2048, as image/jpeg');

  seen.length = 0;
  const jpgRes = await mod2.default.fetch(new Request('https://x.test/img/jpg', { headers: hdr }), env, ctx);
  const usedRaw = seen.some(u => u.includes('files/jpg?alt=media'));
  const usedRendition = seen.some(u => u.includes('lh3.example/def=s2048'));
  if (!usedRaw || usedRendition || jpgRes.status !== 200) {
    bad('a normal photo still serves its original bytes',
      'raw ' + usedRaw + ', rendition ' + usedRendition + ', status ' + jpgRes.status);
  } else ok('a normal photo still serves its original bytes', 'alt=media, untouched');

  globalThis.fetch = realFetch;
}

console.log(failures ? '\n' + failures + ' check(s) failed.' : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
