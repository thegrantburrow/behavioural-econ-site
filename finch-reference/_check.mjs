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
      analytics, no embedded widget. Everything the page needs ships with it. */
{
  const hits = [];
  for (const f of siteFiles) {
    const text = readFileSync(f, 'utf8');
    const m = text.match(/(?:src|href)\s*=\s*["']https?:\/\/[^"']+/gi) || [];
    m.forEach(s => hits.push(f + '  ' + s.slice(0, 70)));
    (text.match(/fetch\(\s*["']https?:\/\/[^"']+/gi) || []).forEach(s => hits.push(f + '  ' + s.slice(0, 70)));
  }
  if (hits.length) bad('no third party requests from the page', '\n        ' + hits.join('\n        '));
  else ok('no third party requests from the page');
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

console.log(failures ? '\n' + failures + ' check(s) failed.' : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
