#!/usr/bin/env node
/*
 * Pulls the live tags out of KV and writes them into the repository, which is
 * the half of this system that git is for. KV holds the copy the site reads
 * and writes; this file is the one with a history.
 *
 *   node scripts/export-archive.mjs --url https://ref.example.com --token <cf-access-token>
 *
 * The token is a Cloudflare Access service token, because the endpoint is
 * behind the same gate as everything else. Create one in the Cloudflare
 * dashboard under Access, Service Auth, then pass its id and secret.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).join(' ').split('--').filter(Boolean)
    .map(s => s.trim().split(/\s+/)).map(([k, ...v]) => [k, v.join(' ')])
);

const url = args.url || process.env.REFERENCE_URL;
if (!url) {
  console.error('Need --url https://your-site, or REFERENCE_URL in the environment.');
  process.exit(1);
}

const headers = { accept: 'application/json' };
if (args['client-id'] || process.env.CF_ACCESS_CLIENT_ID) {
  headers['CF-Access-Client-Id'] = args['client-id'] || process.env.CF_ACCESS_CLIENT_ID;
  headers['CF-Access-Client-Secret'] = args['client-secret'] || process.env.CF_ACCESS_CLIENT_SECRET;
}

const res = await fetch(new URL('/api/export', url), { headers });
if (!res.ok) {
  console.error('Export failed:', res.status, (await res.text()).slice(0, 400));
  process.exit(1);
}
const data = await res.json();

const out = resolve(process.cwd(), args.out || 'library.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(data, null, 2) + '\n');

const n = Object.keys(data.tags || {}).length;
console.log(`Wrote ${n} tagged ${n === 1 ? 'photo' : 'photos'} to ${out}`);
console.log('Commit it. That is the archive.');
