/*
 * Drive originals -> something a preview page can carry. Decoded and resized in
 * a real browser, because there is no image library here and Chromium already
 * has every decoder that matters.
 *
 * The whole reason this file is careful: an iPhone almost never rotates the
 * pixels. It writes them as the sensor read them and sets an EXIF Orientation
 * tag saying how to turn it. Eleven of Grant's first fifteen carry one.
 *
 * The received wisdom is that a canvas ignores that tag so you must rotate by
 * hand. That is now WRONG in Chromium: naturalWidth and naturalHeight come back
 * already oriented, and drawImage draws it oriented. Rotating by hand on top of
 * that turns those eleven photographs through a second ninety degrees, which is
 * worse than doing nothing because it is then wrong in both directions.
 *
 * Measured rather than assumed. The first version of this file did the manual
 * rotation and the McDonald's photograph came out on its side facing the other
 * way, which is how the mistake was caught.
 *
 * So there is no transform here. The tag is still read, because the date is
 * worth having and because a non standard orientation is worth reporting.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const MAX = 1400, QUALITY = 0.72;
const MIME = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif' };

/* Minimal EXIF read: we want Orientation (0x0112) and DateTimeOriginal (0x9003). */
function exifOf(buf) {
  let out = { orientation: 1, taken: null };
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return out;
  let i = 2;
  while (i < buf.length - 1) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const m = buf[i + 1];
    if (m === 0xD8 || m === 0x01 || (m >= 0xD0 && m <= 0xD7)) { i += 2; continue; }
    if (m === 0xDA) break;                       /* start of scan, no more headers */
    const len = buf.readUInt16BE(i + 2);
    if (m === 0xE1 && buf.slice(i + 4, i + 10).toString('latin1') === 'Exif\0\0') {
      const t = buf.slice(i + 10, i + 2 + len);
      const be = t.slice(0, 2).toString('latin1') === 'MM';
      const u16 = o => be ? t.readUInt16BE(o) : t.readUInt16LE(o);
      const u32 = o => be ? t.readUInt32BE(o) : t.readUInt32LE(o);
      const walk = (dirOff) => {
        if (dirOff <= 0 || dirOff + 2 > t.length) return;
        const n = u16(dirOff);
        for (let k = 0; k < n; k++) {
          const p = dirOff + 2 + k * 12;
          if (p + 12 > t.length) break;
          const tag = u16(p), typ = u16(p + 4), cnt = u32(p + 6);
          if (tag === 0x0112) out.orientation = u16(p + 8) || 1;
          if (tag === 0x8769) walk(u32(p + 8));                /* the Exif sub-IFD */
          if (tag === 0x9003 && typ === 2) {                   /* DateTimeOriginal */
            const off = cnt > 4 ? u32(p + 8) : p + 8;
            const s = t.slice(off, off + 19).toString('latin1');
            const mm = s.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
            if (mm) out.taken = `${mm[1]}-${mm[2]}-${mm[3]}T${mm[4]}:${mm[5]}:${mm[6]}`;
          }
        }
      };
      walk(u32(4));
    }
    i += 2 + len;
  }
  return out;
}

const dir = process.argv[2] || 'inbox';
const files = readdirSync(dir).filter(f => MIME[extname(f).toLowerCase()]).sort();
if (!files.length) { console.log('nothing in ' + dir); process.exit(0); }

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('about:blank');
mkdirSync('resized', { recursive: true });

const out = [];
for (const f of files) {
  const buf = readFileSync(join(dir, f));
  const ex = exifOf(buf);
  const src = 'data:' + MIME[extname(f).toLowerCase()] + ';base64,' + buf.toString('base64');

  const res = await page.evaluate(async ({ src, MAX, QUALITY, orientation }) => {
    const im = new Image();
    const ok = await new Promise(r => { im.onload = () => r(true); im.onerror = () => r(false); im.src = src; });
    if (!ok) return { error: 'this browser could not decode it' };

    /* Already oriented by the browser. Do not rotate again. */
    const pw = im.naturalWidth, ph = im.naturalHeight;
    const scale = Math.min(1, MAX / Math.max(pw, ph));
    const w = Math.round(pw * scale), h = Math.round(ph * scale);
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    cv.getContext('2d').drawImage(im, 0, 0, w, h);
    return { w, h, pw, ph, dataUri: cv.toDataURL('image/jpeg', QUALITY) };
  }, { src, MAX, QUALITY, orientation: ex.orientation });

  if (res.error) { console.log('  SKIP  ' + f + '  ' + res.error); continue; }
  const kb = Math.round(res.dataUri.length * 0.75 / 1024);
  writeFileSync(join('resized', f.replace(/\.\w+$/, '.jpg')),
    Buffer.from(res.dataUri.split(',')[1], 'base64'));
  out.push({ file: f, w: res.w, h: res.h, kb, taken: ex.taken, orientation: ex.orientation, dataUri: res.dataUri });
  console.log('  ok    ' + f.slice(0, 14).padEnd(16) +
    (res.pw + '×' + res.ph).padEnd(11) + '-> ' + (res.w + '×' + res.h).padEnd(11) +
    'o=' + ex.orientation + '  ' + String(kb).padStart(4) + ' KB  ' + (ex.taken || 'no exif date'));
}
await browser.close();
writeFileSync('ingested.json', JSON.stringify(out));
const total = out.reduce((a, o) => a + o.kb, 0);
console.log('\n' + out.length + ' images, ' + (total / 1024).toFixed(1) + ' MB embedded (16 MB is the artifact ceiling)');
