/*
 * Reference library, client side.
 *
 * Every request this file makes is to its own origin. Photos arrive through
 * /thumb and /img, which the Worker proxies from Drive, so the browser never
 * makes a request to a Google host and never holds a Drive token. That also
 * means a thumbnail is same origin, so the colour reader below can put one on
 * a canvas without tainting it.
 */
(function () {
'use strict';

/* ---------------------------------------------------------------- theme */
var root = document.documentElement;
var THEME_KEY = 'ofref-theme';
(function () {
  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  else root.removeAttribute('data-theme');
  var btn = document.getElementById('theme');
  function paint() {
    var cur = root.getAttribute('data-theme');
    var dark = cur === 'dark' || (cur !== 'light' && window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
    btn.innerHTML = dark ? '&#9788;' : '&#9789;';
  }
  paint();
  btn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    var dark = cur === 'dark' || (cur !== 'light' && window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    paint();
  });
})();

/* ------------------------------------------------------------- colours */
var BUCKETS = [
  { k: 'red',    n: 'Red',    hex: '#C0392B' },
  { k: 'orange', n: 'Orange', hex: '#D2691E' },
  { k: 'yellow', n: 'Yellow', hex: '#E0A93A' },
  { k: 'green',  n: 'Green',  hex: '#4E9A5A' },
  { k: 'teal',   n: 'Teal',   hex: '#1F7A6C' },
  { k: 'blue',   n: 'Blue',   hex: '#4A6C99' },
  { k: 'purple', n: 'Purple', hex: '#7B4FA0' },
  { k: 'pink',   n: 'Pink',   hex: '#C8586B' },
  { k: 'brown',  n: 'Brown',  hex: '#7A5C3E' },
  { k: 'black',  n: 'Black',  hex: '#26282D' },
  { k: 'grey',   n: 'Grey',   hex: '#9A9DA1' },
  { k: 'white',  n: 'White',  hex: '#EFEFEA' }
];
var NEUTRAL = ['black', 'white', 'grey'];
var BUCKET_BY_KEY = {};
BUCKETS.forEach(function (b) { BUCKET_BY_KEY[b.k] = b; });

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2, d = mx - mn;
  if (d) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

/*
 * Buckets cut on hue, with the neutrals split on lightness.
 *
 * The earlier version sent ANY desaturated pixel below mid lightness to black,
 * which is most of an outdoor photograph: asphalt, foliage in shade, a dark
 * coat. Measured over Grant's twenty five, it called eighty percent of them
 * black, which made the filter useless.
 */
function bucketOf(r, g, b) {
  var hsl = rgbToHsl(r, g, b), h = hsl[0], s = hsl[1], l = hsl[2];
  if (s < 0.16) return l < 0.22 ? 'black' : (l > 0.78 ? 'white' : 'grey');
  if (h < 16 || h >= 340) return 'red';
  if (h < 42) return (l < 0.42 && s < 0.6) ? 'brown' : 'orange';
  if (h < 68) return (l < 0.38) ? 'brown' : 'yellow';
  if (h < 155) return 'green';
  if (h < 190) return 'teal';
  if (h < 255) return 'blue';
  if (h < 300) return 'purple';
  return 'pink';
}

function toHex(r, g, b) {
  return '#' + [r, g, b].map(function (v) {
    return ('0' + Math.round(v).toString(16)).slice(-2);
  }).join('');
}

function readColours(img) {
  var N = 72, cv = document.createElement('canvas');
  cv.width = N; cv.height = N;
  var cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0, N, N);
  var data;
  try { data = cx.getImageData(0, 0, N, N).data; } catch (e) { return null; }
  var bins = {}, order = [];
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 125) continue;
    var r = data[i], g = data[i + 1], b = data[i + 2];
    var key = (r >> 4) + '-' + (g >> 4) + '-' + (b >> 4);
    if (!bins[key]) { bins[key] = { n: 0, r: 0, g: 0, b: 0 }; order.push(key); }
    var bin = bins[key];
    bin.n++; bin.r += r; bin.g += g; bin.b += b;
  }
  var list = order.map(function (k) {
    var o = bins[k];
    return { n: o.n, r: o.r / o.n, g: o.g / o.n, b: o.b / o.n };
  }).sort(function (a, b) { return b.n - a.n; });
  if (!list.length) return null;
  /*
   * Two scores, because a colour and a neutral are different questions.
   *
   * A COLOUR qualifies on a weighted share, where a saturated mid tone pixel
   * counts for more than a pale wash: that is what finds the red on a watch
   * face and the teal in the water, both of which the plain count missed.
   *
   * A NEUTRAL qualifies on its raw share of the frame, because the only
   * interesting thing about black is how much of the picture it fills. Scoring
   * it the weighted way penalises darkness twice and loses it entirely.
   */
  var wt = {}, raw = {}, wtTotal = 0, rawTotal = 0;
  list.forEach(function (o) {
    var q = rgbToHsl(o.r, o.g, o.b), sat = q[1], lit = q[2];
    var mid = Math.max(0, 1 - Math.abs(lit - 0.5) * 1.9);
    var w = o.n * (0.12 + 0.88 * sat) * (0.15 + 0.85 * mid);
    var k = bucketOf(o.r, o.g, o.b);
    wt[k] = (wt[k] || 0) + w;   wtTotal += w;
    raw[k] = (raw[k] || 0) + o.n; rawTotal += o.n;
  });
  var keys = Object.keys(raw).filter(function (k) {
    return NEUTRAL.indexOf(k) !== -1
      ? raw[k] / rawTotal >= 0.34
      : (wt[k] || 0) / wtTotal >= 0.08;
  }).sort(function (a, b) {
    return ((wt[b] || 0) / wtTotal + raw[b] / rawTotal) - ((wt[a] || 0) / wtTotal + raw[a] / rawTotal);
  }).slice(0, 4);
  return {
    palette: list.slice(0, 6).map(function (o) { return toHex(o.r, o.g, o.b); }),
    colours: keys
  };
}

/* ---------------------------------------------------------------- state */
var LIB = { photos: [], taxonomy: { groups: [] }, drive: false, store: false, demo: false };
var active = {};       /* facet key  -> [values] */
var activeColours = [], activeFree = [];
var onlyUntagged = false, onlyCandidates = false, onlyDupes = false, query = '';
var viewIndex = -1, viewList = [];

var el = {
  grid: document.getElementById('grid'),
  filters: document.getElementById('filters'),
  notices: document.getElementById('notices'),
  count: document.getElementById('count'),
  brandcount: document.getElementById('brandcount'),
  search: document.getElementById('search'),
  viewer: document.getElementById('viewer'),
  stage: document.getElementById('stage'),
  stageimg: document.getElementById('stageimg'),
  side: document.getElementById('side')
};

/*
 * Product handles on the store are the title slugified, so naming the piece a
 * reference fed is enough to reach it and there is no id to copy around. Paste
 * a handle straight in and it survives unchanged.
 *
 * An ampersand is DROPPED, not spelled out. Checked against the live store:
 * "The Time Traveller & The Homo Sapiens Pen" is
 * /products/the-time-traveller-the-homo-sapiens-pen, while "The Heart and the
 * Wattle" keeps its written "and". Expanding & to "and" produced a handle that
 * looked plausible and 404ed.
 */
var STORE = 'https://www.oscarfinch.com';
function handleOf(text) {
  return String(text || '').toLowerCase().trim()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function productUrl(text) {
  var h = handleOf(text);
  return h ? STORE + '/products/' + h : '';
}

/*
 * Where a photograph's pixels come from. Normally the Worker's proxy, so the
 * browser never talks to Google. In a preview the whole set is embedded in the
 * page, which is how the real interface can be tried on a phone before any of
 * the Cloudflare and Drive setup exists.
 */
function imgSrc(p, size) {
  if (p.dataUri) return p.dataUri;
  if (p.demoTile) return p.demoTile;
  return size
    ? '/thumb/' + encodeURIComponent(p.id) + '?s=' + size
    : '/img/' + encodeURIComponent(p.id);
}

/*
 * Exact duplicates only, grouped on the checksum Drive already computed. The
 * same photograph reaching the library from two folders is worth spotting and
 * costs nothing to find.
 *
 * Four frames of one watch display are a different question and this does not
 * pretend to answer it. Perceptual hashing was tried on the real set and could
 * not: at 64, 256 and 1024 bits there were always unrelated photographs closer
 * together than the true pairs, so no threshold existed. The signal that works
 * is capture time, and that needs the dates Drive carries.
 */
function dupeGroups() {
  var bySig = {};
  LIB.photos.forEach(function (p) {
    if (!p.sig) return;
    (bySig[p.sig] = bySig[p.sig] || []).push(p.id);
  });
  var out = {};
  Object.keys(bySig).forEach(function (sig) {
    if (bySig[sig].length < 2) return;
    bySig[sig].forEach(function (id) { out[id] = bySig[sig]; });
  });
  return out;
}
var DUPES = {};

function singleGroup(key) {
  var g = (LIB.taxonomy.groups || []).filter(function (x) { return x.key === key; })[0];
  return !!(g && g.single);
}

/* His own words, gathered from what he has actually typed rather than from a
   list somebody guessed. "Rocket Espresso", "Sean", "fountain pen": the tags
   that make a photograph findable are usually the specific ones. */
function freeTagCounts() {
  var counts = {};
  LIB.photos.forEach(function (p) {
    (p.free || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
  });
  return Object.keys(counts).sort(function (a, b) {
    return counts[b] - counts[a] || a.localeCompare(b);
  }).map(function (t) { return { tag: t, n: counts[t] }; });
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

/* ----------------------------------------------------------------- load */
var PREVIEW_KEY = 'ofref-preview-tags';

/* A preview carries its photographs and its taxonomy inside the page and has no
   Worker behind it, so tagging is kept in this browser instead. It is the same
   interface either way: only where the pixels and the tags live changes. */
function bootEmbedded(data) {
  LIB.taxonomy = data.taxonomy;
  LIB.photos = data.photos;
  LIB.preview = true;
  LIB.store = true;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(PREVIEW_KEY) || '{}'); } catch (e) {}
  LIB.photos.forEach(function (p) {
    var t = saved[p.id];
    if (!t) return;
    p.facets = t.facets || p.facets; p.colours = t.colours || p.colours;
    p.palette = t.palette || p.palette; p.rating = t.rating || 0;
    p.note = t.note || ''; p.usedIn = t.usedIn || ''; p.free = t.free || [];
  });
  notice('This is a preview, and it is yours alone',
    'Your actual photographs, running the real interface. Tagging is kept in this browser rather than on a server, ' +
    'so it survives a reload on this device and goes nowhere else. Nothing here is shared, and the link is private to your account.');
  render();
}

function boot() {
  if (window.__LIBRARY__) return bootEmbedded(window.__LIBRARY__);
  fetch('/api/library', { headers: { accept: 'application/json' } })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
    .then(function (res) {
      var b = res.body || {};
      LIB.taxonomy = b.taxonomy && b.taxonomy.groups ? b.taxonomy : LIB.taxonomy;
      LIB.photos = b.photos || [];
      LIB.drive = !!b.drive;
      LIB.store = !!b.store;
      if (!res.ok || b.error || !LIB.photos.length) noticeFor(b, res.ok);
      render();
    })
    .catch(function () {
      LIB.demo = true;
      LIB.taxonomy = DEMO.taxonomy;
      LIB.photos = DEMO.photos;
      notice('Showing example rows',
        'The library could not be reached, so what is below is four made up entries to show the shape of the thing. ' +
        'Nothing here is yours. On the deployed site this panel is gone and these are your photographs.');
      render();
    });
}

function notice(title, body) {
  var d = document.createElement('div');
  d.className = 'notice';
  d.innerHTML = '<h3>' + esc(title) + '</h3><p>' + body + '</p>';
  el.notices.appendChild(d);
}

function noticeFor(b, ok) {
  if (b.error === 'drive_failed') {
    notice('Drive answered with an error',
      esc(b.message) + ' The gate and the site are fine, so this is the Google credential or the folder id.');
    return;
  }
  if (b.drive === false) {
    notice('Drive is not connected yet',
      'The site is up and the gate is working. Set <code>GOOGLE_SA_EMAIL</code>, <code>GOOGLE_SA_KEY</code> and ' +
      '<code>DRIVE_FOLDER_ID</code>, then share the folder with the service account. Setup steps 2 and 3 in the README.');
    return;
  }
  if (b.drive && !b.photos.length) {
    notice('The folder is empty',
      'Drive answered, and there are no images in that folder yet. Put some in and reload.');
  }
  if (b.drive && !b.store) {
    notice('Tags cannot be saved yet',
      'There is no KV namespace bound, so filtering works on what Drive already knows (date, size, name) ' +
      'but nothing you tag will survive a reload. Setup step 5 in the README.');
  }
  if (!ok && !b.error) notice('Something went wrong', esc(b.message || 'The library request failed.'));
}

/* --------------------------------------------------------------- filter */
function matches(p) {
  var groups = LIB.taxonomy.groups || [];
  for (var i = 0; i < groups.length; i++) {
    var k = groups[i].key;
    var want = active[k] || [];
    if (want.length) {
      var have = p.facets && p.facets[k];
      var haveList = Array.isArray(have) ? have : (have ? [have] : []);
      var any = want.some(function (v) { return haveList.indexOf(v) !== -1; });
      if (!any) return false;
    }
  }
  /* Colour chips stack: asking for red and green means both are in the photo. */
  for (var c = 0; c < activeColours.length; c++) {
    if ((p.colours || []).indexOf(activeColours[c]) === -1) return false;
  }
  for (var t = 0; t < activeFree.length; t++) {
    if ((p.free || []).indexOf(activeFree[t]) === -1) return false;
  }
  if (onlyUntagged && isTagged(p)) return false;
  /* The one question the library exists to answer: what am I actually
     considering drawing? */
  if (onlyCandidates && CANDIDATE.indexOf(statusOf(p)) === -1) return false;
  if (onlyDupes && !DUPES[p.id]) return false;
  if (query) {
    var hay = (p.name + ' ' + (p.note || '') + ' ' + (p.usedIn || '') + ' ' + (p.free || []).join(' ')).toLowerCase();
    if (hay.indexOf(query) === -1) return false;
  }
  return true;
}

var CANDIDATE = ['Maybe', 'Shortlist', 'Next up', 'Sketching'];
function statusOf(p) {
  var v = p.facets && p.facets.status;
  return Array.isArray(v) ? (v[0] || '') : (v || '');
}

function isTagged(p) {
  if (p.rating) return true;
  if (p.note) return true;
  if ((p.free || []).length) return true;
  var f = p.facets || {};
  return Object.keys(f).some(function (k) {
    var v = f[k];
    return Array.isArray(v) ? v.length > 0 : !!v;
  });
}

/* Counts are computed against everything else that is selected, so a chip
   showing zero really would empty the grid rather than looking available. */
function countFor(groupKey, value) {
  var save = active[groupKey];
  active[groupKey] = (save || []).concat([value]);
  var n = LIB.photos.filter(matches).length;
  if (save) active[groupKey] = save; else delete active[groupKey];
  return n;
}

function countForColour(k) {
  var save = activeColours.slice();
  if (activeColours.indexOf(k) === -1) activeColours = activeColours.concat([k]);
  var n = LIB.photos.filter(matches).length;
  activeColours = save;
  return n;
}

/* --------------------------------------------------------------- render */
function renderFilters() {
  var html = '';
  (LIB.taxonomy.groups || []).forEach(function (g) {
    html += '<div class="grp"><h2>' + esc(g.label) + '</h2><div class="chips">';
    (g.values || []).forEach(function (v) {
      var on = (active[g.key] || []).indexOf(v) !== -1;
      var n = countFor(g.key, v);
      html += '<button class="chip' + (n === 0 && !on ? ' dim' : '') + '" type="button" ' +
        'aria-pressed="' + (on ? 'true' : 'false') + '" data-g="' + esc(g.key) + '" data-v="' + esc(v) + '">' +
        esc(v) + '<span class="c">' + n + '</span></button>';
    });
    html += '</div></div>';
  });

  var freeTags = freeTagCounts();
  if (freeTags.length) {
    html += '<div class="grp"><h2>Your tags</h2><div class="chips">';
    freeTags.forEach(function (t) {
      var on = activeFree.indexOf(t.tag) !== -1;
      html += '<button class="chip" type="button" aria-pressed="' + (on ? 'true' : 'false') +
        '" data-ft="' + esc(t.tag) + '">' + esc(t.tag) + '<span class="c">' + t.n + '</span></button>';
    });
    html += '</div></div>';
  }

  html += '<div class="grp"><h2>Colour</h2><div class="swatches">';
  BUCKETS.forEach(function (b) {
    var on = activeColours.indexOf(b.k) !== -1;
    var n = countForColour(b.k);
    html += '<button class="sw' + (n === 0 && !on ? ' dim' : '') + '" type="button" ' +
      'aria-pressed="' + (on ? 'true' : 'false') + '" data-c="' + b.k + '" ' +
      'title="' + b.n + ', ' + n + '" aria-label="' + b.n + ', ' + n + ' photos" ' +
      'style="background:' + b.hex + '"></button>';
  });
  html += '</div></div>';
  el.filters.innerHTML = html;

  el.filters.querySelectorAll('[data-g]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var g = btn.dataset.g, v = btn.dataset.v;
      active[g] = active[g] || [];
      var i = active[g].indexOf(v);
      if (i === -1) active[g].push(v); else active[g].splice(i, 1);
      if (!active[g].length) delete active[g];
      render();
    });
  });
  el.filters.querySelectorAll('[data-ft]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var t = btn.dataset.ft;
      var i = activeFree.indexOf(t);
      if (i === -1) activeFree.push(t); else activeFree.splice(i, 1);
      render();
    });
  });
  el.filters.querySelectorAll('[data-c]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var k = btn.dataset.c;
      var i = activeColours.indexOf(k);
      if (i === -1) activeColours.push(k); else activeColours.splice(i, 1);
      render();
    });
  });
}

function fmtDate(iso) {
  if (!iso) return 'no date';
  var d = new Date(iso);
  if (isNaN(d)) return 'no date';
  var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
}

function renderGrid() {
  var shown = LIB.photos.filter(matches);
  viewList = shown;
  el.count.textContent = shown.length === LIB.photos.length
    ? shown.length + (shown.length === 1 ? ' photo' : ' photos')
    : shown.length + ' of ' + LIB.photos.length;
  el.brandcount.textContent = LIB.photos.length ? LIB.photos.length : '';

  if (!shown.length) {
    el.grid.innerHTML = '<div class="empty">' +
      (LIB.photos.length ? 'Nothing matches all of that. Drop a filter.' : 'No photos in the library yet.') +
      '</div>';
    return;
  }
  el.grid.innerHTML = shown.map(function (p, i) {
    var pal = (p.palette || []).length
      ? '<div class="pal">' + p.palette.map(function (h) { return '<i style="background:' + esc(h) + '"></i>'; }).join('') + '</div>'
      : '';
    var src = imgSrc(p, 480);
    return '<button class="tile" type="button" data-i="' + i + '">' +
      '<div class="im">' +
        '<img loading="lazy" decoding="async" alt="' + esc(p.name) + '" src="' + esc(src) + '" data-id="' + esc(p.id) + '">' +
        (isTagged(p) ? '' : '<span class="untag" title="Not tagged yet"></span>') +
        (DUPES[p.id] ? '<span class="badge dupe" title="The same file is in the library ' +
          DUPES[p.id].length + ' times">' + DUPES[p.id].length + ' copies</span>' : '') +
        (statusOf(p) && statusOf(p) !== 'New' ? '<span class="badge" data-s="' +
          esc(statusOf(p).toLowerCase().replace(/\s+/g, '-')) + '">' + esc(statusOf(p)) + '</span>' : '') +
      '</div>' + pal +
      '<div class="m"><b>' + esc(p.name) + '</b>' + fmtDate(p.taken || p.added) +
        (p.rating ? ' &middot; ' + '★'.repeat(p.rating) : '') + '</div>' +
    '</button>';
  }).join('');

  el.grid.querySelectorAll('.tile').forEach(function (t) {
    t.addEventListener('click', function () { openViewer(parseInt(t.dataset.i, 10)); });
  });
  el.grid.querySelectorAll('.tile img').forEach(function (img) {
    img.addEventListener('load', function () { maybeReadColours(img); });
  });
}

/* Colours are read once, the first time a photo is ever drawn, then saved so
   no other visit and no other device pays for it again. */
var readingNow = {};
function maybeReadColours(img) {
  if (LIB.demo || !LIB.store) return;   /* preview sets store, so colours are read there too */
  var id = img.dataset.id;
  if (!id || readingNow[id]) return;
  var p = LIB.photos.filter(function (x) { return x.id === id; })[0];
  if (!p || (p.palette && p.palette.length)) return;
  readingNow[id] = true;
  var res = readColours(img);
  if (!res) return;
  p.palette = res.palette;
  p.colours = res.colours;
  saveTags(p, true);
}

function render() { DUPES = dupeGroups(); renderFilters(); renderGrid(); }

var renderTimer = null;
function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(render, 120);
}

/* --------------------------------------------------------------- viewer */
function openViewer(i) {
  if (i < 0 || i >= viewList.length) return;
  viewIndex = i;
  var p = viewList[i];
  el.stageimg.src = imgSrc(p, 0);
  el.stageimg.alt = p.name;
  el.viewer.dataset.open = 'true';
  renderSide(p);
  document.body.style.overflow = 'hidden';
}

function closeViewer() {
  el.viewer.dataset.open = 'false';
  el.stageimg.removeAttribute('src');
  document.body.style.overflow = '';
}

function renderSide(p) {
  var groups = LIB.taxonomy.groups || [];
  var html = '<div class="sidescroll">';
  html += '<h2>' + esc(p.name) + '</h2>';
  html += '<div class="facts">' +
    '<span>' + fmtDate(p.taken || p.added) + (p.taken ? ' taken' : ' added') + '</span>' +
    (p.width ? '<span>' + p.width + ' &times; ' + p.height + '</span>' : '') +
    (p.bytes ? '<span>' + (p.bytes / 1048576).toFixed(1) + ' MB</span>' : '') +
    (p.camera ? '<span>' + esc(p.camera) + '</span>' : '') +
  '</div>';

  if ((p.palette || []).length) {
    html += '<div><label>Palette</label><div class="pal" style="display:flex;height:26px;border-radius:6px;overflow:hidden;margin-top:5px;">' +
      p.palette.map(function (h) { return '<i style="flex:1;background:' + esc(h) + '"></i>'; }).join('') + '</div></div>';
  }

  html += '<div><label>Quality</label><div class="stars" id="stars">';
  for (var s = 1; s <= 5; s++) {
    html += '<button class="star" type="button" data-s="' + s + '" data-on="' + (p.rating >= s ? 'true' : 'false') +
      '" aria-label="' + s + ' stars">★</button>';
  }
  html += '</div></div>';

  groups.forEach(function (g) {
    var have = p.facets && p.facets[g.key];
    var list = Array.isArray(have) ? have : (have ? [have] : []);
    html += '<div><label>' + esc(g.label) + '</label><div class="chips" style="margin-top:5px;">';
    (g.values || []).forEach(function (v) {
      html += '<button class="chip" type="button" data-fg="' + esc(g.key) + '" data-fv="' + esc(v) + '" ' +
        'aria-pressed="' + (list.indexOf(v) !== -1 ? 'true' : 'false') + '">' + esc(v) + '</button>';
    });
    html += '</div></div>';
  });

  html += '<div><label>Colours read off the photo</label><div class="chips" style="margin-top:5px;">';
  BUCKETS.forEach(function (b) {
    html += '<button class="chip" type="button" data-cb="' + b.k + '" ' +
      'aria-pressed="' + ((p.colours || []).indexOf(b.k) !== -1 ? 'true' : 'false') + '">' + b.n + '</button>';
  });
  html += '</div></div>';

  /* No separate "used" toggle: the status group above already says Drawn, and
     two controls meaning the same thing drift apart. This is only the name of
     the piece, so the panel can link back to it. */
  html += '<div><label>If you drew it</label>' +
    '<input type="text" id="usedin" placeholder="Which piece, by its title" value="' + esc(p.usedIn) + '">' +
    '<a class="prodlink" id="prodlink" target="_blank" rel="noopener"' +
      (p.usedIn ? ' href="' + esc(productUrl(p.usedIn)) + '"' : ' hidden') + '>Open it on oscarfinch.com</a></div>';

  html += '<div><label>Your tags</label><div class="chips" id="freechips" style="margin-top:5px;"></div>' +
    '<input type="text" id="freeinput" style="margin-top:6px;" placeholder="Type a tag, press Enter"></div>';

  html += '<div><label>Notes</label><textarea id="note" placeholder="What you saved it for.">' + esc(p.note) + '</textarea></div>';

  html += '</div>';
  html += '<div class="savebar"><button class="btn primary" id="save" type="button">Save</button>' +
    '<span class="saved" id="savedmsg" data-on="false">Saved</span></div>';

  el.side.innerHTML = html;

  el.side.querySelectorAll('.star').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = parseInt(b.dataset.s, 10);
      p.rating = (p.rating === v) ? 0 : v;
      renderSide(p);
    });
  });
  el.side.querySelectorAll('[data-fg]').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.dataset.fg, v = b.dataset.fv;
      p.facets = p.facets || {};
      var cur = Array.isArray(p.facets[g]) ? p.facets[g] : (p.facets[g] ? [p.facets[g]] : []);
      var i = cur.indexOf(v);
      /* A photograph is at one place in the pipeline and is one size of job.
         Everything else can be several things at once. */
      if (singleGroup(g)) {
        p.facets[g] = (i === -1) ? [v] : [];
        el.side.querySelectorAll('[data-fg="' + g + '"]').forEach(function (o) {
          o.setAttribute('aria-pressed', 'false');
        });
        if (i === -1) b.setAttribute('aria-pressed', 'true');
      } else {
        if (i === -1) cur.push(v); else cur.splice(i, 1);
        p.facets[g] = cur;
        b.setAttribute('aria-pressed', i === -1 ? 'true' : 'false');
      }
    });
  });
  el.side.querySelectorAll('[data-cb]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.cb;
      p.colours = p.colours || [];
      var i = p.colours.indexOf(k);
      if (i === -1) p.colours.push(k); else p.colours.splice(i, 1);
      b.setAttribute('aria-pressed', i === -1 ? 'true' : 'false');
    });
  });
  function paintFree() {
    document.getElementById('freechips').innerHTML = (p.free || []).length
      ? p.free.map(function (t) {
          return '<button class="chip freetag" type="button" aria-pressed="true" data-del="' +
            esc(t) + '" title="Remove">' + esc(t) + '<span class="x">&times;</span></button>';
        }).join('')
      : '<span style="font-size:12.5px;color:var(--faint);">None yet.</span>';
    document.getElementById('freechips').querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        p.free = (p.free || []).filter(function (t) { return t !== b.dataset.del; });
        paintFree();
      });
    });
  }
  paintFree();
  var freeInput = document.getElementById('freeinput');
  freeInput.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    var v = freeInput.value.trim();
    if (!v) return;
    p.free = p.free || [];
    if (p.free.indexOf(v) === -1) p.free.push(v);
    freeInput.value = '';
    paintFree();
  });

  var usedIn = document.getElementById('usedin');
  var prodLink = document.getElementById('prodlink');
  function syncLink() {
    var u = productUrl(usedIn.value);
    if (u) { prodLink.href = u; prodLink.hidden = false; }
    else { prodLink.removeAttribute('href'); prodLink.hidden = true; }
  }
  usedIn.addEventListener('input', syncLink);

  document.getElementById('save').addEventListener('click', function () {
    p.note = document.getElementById('note').value;
    p.usedIn = document.getElementById('usedin').value;
    p.used = statusOf(p) === 'Drawn';
    saveTags(p);
  });
}

function saveTags(p, quiet) {
  if (LIB.preview) {
    var all = {};
    try { all = JSON.parse(localStorage.getItem(PREVIEW_KEY) || '{}'); } catch (e) {}
    all[p.id] = { facets: p.facets, colours: p.colours, palette: p.palette,
      rating: p.rating, note: p.note, usedIn: p.usedIn, free: p.free };
    try { localStorage.setItem(PREVIEW_KEY, JSON.stringify(all)); } catch (e) {}
    if (!quiet) flashSaved('Saved on this device');
    scheduleRender();
    return;
  }
  if (LIB.demo) { if (!quiet) flashSaved('Not saved, these are examples'); return; }
  if (!LIB.store) { if (!quiet) flashSaved('No store bound, nothing saved'); return; }
  fetch('/api/tags/' + encodeURIComponent(p.id), {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      facets: p.facets, colours: p.colours, palette: p.palette, rating: p.rating,
      used: p.used, usedIn: p.usedIn, note: p.note, free: p.free
    })
  }).then(function (r) {
    if (!quiet) flashSaved(r.ok ? 'Saved' : 'Save failed');
    /* The whole rail, not just the grid: a tag you just typed is a new filter,
       and the colour and facet counts beside every chip have moved. Coalesced
       because the first load fires one quiet save per photograph as its colours
       are read, and re-rendering the rail once per photo is wasted work. */
    if (r.ok) scheduleRender();
  }).catch(function () { if (!quiet) flashSaved('Save failed'); });
}

function flashSaved(text) {
  var m = document.getElementById('savedmsg');
  if (!m) return;
  m.textContent = text;
  m.dataset.on = 'true';
  setTimeout(function () { m.dataset.on = 'false'; }, 1800);
}

/* ---------------------------------------------------------- viewer chrome */
function bindStage(id, cls) {
  var b = document.getElementById(id);
  b.addEventListener('click', function () {
    var on = b.getAttribute('aria-pressed') === 'true';
    b.setAttribute('aria-pressed', on ? 'false' : 'true');
    el.stage.classList.toggle(cls, !on);
  });
}
bindStage('v-grey', 'grey');
bindStage('v-grid', 'gridon');
bindStage('v-flip', 'flip');

document.getElementById('close').addEventListener('click', closeViewer);
document.getElementById('v-next').addEventListener('click', function () { openViewer(viewIndex + 1); });
document.getElementById('v-prev').addEventListener('click', function () { openViewer(viewIndex - 1); });
document.getElementById('v-full').addEventListener('click', function () {
  var p = viewList[viewIndex];
  if (p) window.open(imgSrc(p, 0), '_blank', 'noopener');
});

document.addEventListener('keydown', function (e) {
  if (el.viewer.dataset.open !== 'true') return;
  if (e.key === 'Escape') closeViewer();
  else if (e.key === 'ArrowRight') openViewer(viewIndex + 1);
  else if (e.key === 'ArrowLeft') openViewer(viewIndex - 1);
  else if (e.key.toLowerCase() === 'v') document.getElementById('v-grey').click();
  else if (e.key.toLowerCase() === 'g') document.getElementById('v-grid').click();
  else if (e.key.toLowerCase() === 'f') document.getElementById('v-flip').click();
});

/* ----------------------------------------------------------------- bar */
document.getElementById('f-untagged').addEventListener('click', function () {
  onlyUntagged = !onlyUntagged;
  this.setAttribute('aria-pressed', onlyUntagged ? 'true' : 'false');
  render();
});
document.getElementById('f-candidates').addEventListener('click', function () {
  onlyCandidates = !onlyCandidates;
  this.setAttribute('aria-pressed', onlyCandidates ? 'true' : 'false');
  render();
});
document.getElementById('f-dupes').addEventListener('click', function () {
  onlyDupes = !onlyDupes;
  this.setAttribute('aria-pressed', onlyDupes ? 'true' : 'false');
  render();
});
document.getElementById('clear').addEventListener('click', function () {
  active = {}; activeColours = []; activeFree = []; query = '';
  onlyUntagged = false; onlyCandidates = false; onlyDupes = false;
  el.search.value = '';
  document.getElementById('f-untagged').setAttribute('aria-pressed', 'false');
  document.getElementById('f-candidates').setAttribute('aria-pressed', 'false');
  document.getElementById('f-dupes').setAttribute('aria-pressed', 'false');
  render();
});
var searchTimer;
el.search.addEventListener('input', function () {
  clearTimeout(searchTimer);
  var v = el.search.value.trim().toLowerCase();
  searchTimer = setTimeout(function () { query = v; render(); }, 140);
});

/* ------------------------------------------------------- example rows */
function tile(a, b, c) {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect width="100" height="100" fill="' + a + '"/>' +
    '<rect y="58" width="100" height="42" fill="' + b + '"/>' +
    '<circle cx="50" cy="42" r="21" fill="' + c + '"/></svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
var DEMO = {
  taxonomy: {
    groups: [
      { key: 'subject', label: 'Subject', values: ['Person', 'Face', 'Hands', 'Object', 'Vehicle', 'Street scene'] },
      { key: 'why', label: 'Saved for', values: ['Pose', 'Expression', 'Light', 'Colour', 'Texture', 'Composition'] },
      { key: 'light', label: 'Light', values: ['Overcast', 'Golden hour', 'Backlit', 'Indoor'] }
    ]
  },
  photos: [
    { id: 'x1', name: 'Example, man at bus stop', taken: '2026-08-14T08:10:00Z', width: 3024, height: 4032, bytes: 2900000,
      facets: { subject: ['Person'], why: ['Pose'], light: ['Overcast'] }, colours: ['grey', 'blue', 'brown'],
      palette: ['#8C8F94', '#4A6C99', '#7A5C3E'], rating: 4, used: false, usedIn: '', note: '', free: [],
      demoTile: tile('#8C8F94', '#4A6C99', '#7A5C3E') },
    { id: 'x2', name: 'Example, hands holding a cup', taken: '2026-08-02T17:40:00Z', width: 4032, height: 3024, bytes: 3400000,
      facets: { subject: ['Hands'], why: ['Light'], light: ['Golden hour'] }, colours: ['orange', 'brown', 'white'],
      palette: ['#D2691E', '#7A5C3E', '#EFEFEA'], rating: 5, used: true, usedIn: 'Prized possession', note: '', free: [],
      demoTile: tile('#D2691E', '#7A5C3E', '#EFEFEA') },
    { id: 'x3', name: 'Example, espresso machine detail', taken: '2026-07-21T11:05:00Z', width: 4032, height: 3024, bytes: 4100000,
      facets: { subject: ['Object'], why: ['Texture'], light: ['Indoor'] }, colours: ['grey', 'red', 'black'],
      palette: ['#9A9DA1', '#C0392B', '#26282D'], rating: 5, used: false, usedIn: '', note: '', free: [],
      demoTile: tile('#9A9DA1', '#C0392B', '#26282D') },
    { id: 'x4', name: 'Example, empty street, late light', taken: '2026-06-30T18:55:00Z', width: 4032, height: 2268, bytes: 2600000,
      facets: {}, colours: ['orange', 'grey', 'blue'],
      palette: ['#C4703F', '#9A9DA1', '#4A6C99'], rating: 0, used: false, usedIn: '', note: '', free: [],
      demoTile: tile('#C4703F', '#9A9DA1', '#4A6C99') }
  ]
};

boot();
})();
