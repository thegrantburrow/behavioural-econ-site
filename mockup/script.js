// Smart-quote apostrophes (iOS/macOS auto-correct turns a typed ' into
// U+2019 as you type) don't match a straight ' baked into a title like
// "Don't Say the E-Word" in a plain indexOf() comparison. Every search/
// filter box on the site normalizes both the query and the indexed text
// through this before comparing, so typing an apostrophe on any device
// matches a title with either apostrophe form.
function normalizeApostrophes(s) {
  return String(s).replace(/[‘’‛ʼ′´]/g, "'");
}

(function () {
  var btn = document.getElementById('menuToggle');
  var links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

(function () {
  // Nav expandable sub-lists: a small toggle reveals related links under a
  // nav item (dropdown on desktop, inline expansion on mobile), instead of
  // a new top-level item. Closed by default on every load. Multiple pairs
  // are supported (Principles, Field Sessions, Experiments, Reading the
  // Research each carry their own toggle + sublist).
  var pairs = Array.prototype.map.call(document.querySelectorAll('.nav-item-expandable'), function (item) {
    return { toggle: item.querySelector('.nav-expand-toggle'), sublist: item.querySelector('.nav-sublist') };
  }).filter(function (p) { return p.toggle && p.sublist; });
  if (!pairs.length) return;

  function closeAll(except) {
    pairs.forEach(function (p) {
      if (p === except) return;
      p.sublist.classList.remove('show');
      p.toggle.setAttribute('aria-expanded', 'false');
    });
  }

  pairs.forEach(function (pair) {
    pair.toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var showing = pair.sublist.classList.toggle('show');
      pair.toggle.setAttribute('aria-expanded', showing ? 'true' : 'false');
      if (showing) closeAll(pair);
    });
  });

  document.addEventListener('click', function (e) {
    var clickedInsideAny = pairs.some(function (p) {
      return p.toggle.contains(e.target) || p.sublist.contains(e.target);
    });
    if (!clickedInsideAny) closeAll();
  });
})();

(function () {
  // Every predictive search box on the site (the homepage's inline search,
  // its standalone search band, and the nav-bar search available on every
  // page) wired through the same portable ranked-suggestions component
  // (predictive-search.js) against SEARCH_INDEX (loaded via
  // search-index.js), which covers every real content type on the site,
  // not just principles, and groups results under the same category
  // labels the site's own nav menu already uses. No-ops per box on any
  // page missing its markup.
  if (typeof PredictiveSearch === 'undefined' || typeof SEARCH_INDEX === 'undefined') return;

  var CATEGORY_ORDER = ['Principles', 'The Science Behind', 'Field Sessions', 'Experiments', 'Reading the Research', 'Natural Experiments', 'Apply It'];

  [
    { input: 'homeSearch', list: 'homeSearchSuggestions' },
    { input: 'searchBandInput', list: 'searchBandSuggestions' },
    { input: 'navSearchInput', list: 'navSearchSuggestions' }
  ].forEach(function (box) {
    var input = document.getElementById(box.input);
    var list = document.getElementById(box.list);
    if (!input || !list) return;
    PredictiveSearch.init({
      input: input,
      list: list,
      data: SEARCH_INDEX,
      fields: { primary: 'title', secondary: 'blurb' },
      groupBy: 'category',
      groupOrder: CATEGORY_ORDER,
      maxResultsPerGroup: 3,
      classNames: { list: 'search-suggestions', item: 'search-suggestion', active: 'active', group: 'search-suggestion-group' }
    });
  });
})();

(function () {
  // Nav-bar search icon: a click-to-open panel available on every page
  // (the nav is the one element that's actually site-wide), independent
  // of the predictive-search dropdown's own open/close state above.
  var toggle = document.getElementById('navSearchToggle');
  var panel = document.getElementById('navSearchPanel');
  if (!toggle || !panel) return;
  var input = document.getElementById('navSearchInput');
  var backdrop = document.getElementById('navSearchBackdrop');

  function open() {
    panel.hidden = false;
    if (backdrop) backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (input) input.focus();
  }

  function close() {
    panel.hidden = true;
    if (backdrop) backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    if (panel.hidden) open(); else close();
  });

  if (backdrop) backdrop.addEventListener('click', close);

  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !toggle.contains(e.target)) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) close();
  });
})();

(function () {
  // Principles archive page: search box + category chips both filter the
  // same single list of principle rows (not two separate representations
  // of the 36 principles — that duplication was part of what made the
  // homepage feel like "everything, twice"). No-ops on any page that
  // doesn't have this markup (i.e. the homepage).
  var searchInput = document.getElementById('principlesSearch');
  var tabs = document.querySelectorAll('#principlesFilterTabs .toc-tab');
  var list = document.getElementById('principlesList');
  var rows = Array.prototype.slice.call(document.querySelectorAll('section.principle'));
  var emptyMsg = document.getElementById('principlesEmpty');
  if (!searchInput || !tabs.length || !rows.length) return;

  // Canonical (numbered) order, captured once, so clearing the search box
  // or ties in relevance always fall back to this instead of whatever
  // order the last search happened to leave things in.
  rows.forEach(function (row, i) { row.dataset.origOrder = i; });

  var activeCategory = 'all';

  function rowParts(row) {
    if (row.dataset.title === undefined) {
      var title = row.querySelector('h3');
      var def = row.querySelector('.definition');
      row.dataset.title = normalizeApostrophes((title ? title.textContent : '').trim().toLowerCase());
      row.dataset.def = normalizeApostrophes((def ? def.textContent : '').trim().toLowerCase());
    }
    return { title: row.dataset.title, def: row.dataset.def };
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Lower score = more relevant. A match on the principle's own name always
  // outranks a match merely mentioned somewhere in its body text, so
  // searching "claw" surfaces Clawback first instead of buried under every
  // other principle whose full definition happens to contain that
  // substring somewhere. This is what makes the list feel predictive as
  // it's typed, rather than just a fixed-order show/hide filter.
  function relevanceScore(row, query) {
    if (!query) return 0;
    var parts = rowParts(row);
    if (parts.title === query) return 0;
    if (parts.title.indexOf(query) === 0) return 1;
    if (new RegExp('\\b' + escapeRegExp(query)).test(parts.title)) return 2;
    if (parts.title.indexOf(query) !== -1) return 3;
    if (parts.def.indexOf(query) !== -1) return 4;
    return 5;
  }

  function applyFilter() {
    var query = normalizeApostrophes(searchInput.value.trim().toLowerCase());
    var visibleCount = 0;
    rows.forEach(function (row) {
      var parts = rowParts(row);
      var matchesCategory = activeCategory === 'all' || row.getAttribute('data-theme') === activeCategory;
      var matchesSearch = query === '' || parts.title.indexOf(query) !== -1 || parts.def.indexOf(query) !== -1;
      var visible = matchesCategory && matchesSearch;
      row.hidden = !visible;
      if (visible) visibleCount++;
    });
    if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;

    if (list) {
      rows.slice().sort(function (a, b) {
        var scoreDiff = relevanceScore(a, query) - relevanceScore(b, query);
        return scoreDiff !== 0 ? scoreDiff : Number(a.dataset.origOrder) - Number(b.dataset.origOrder);
      }).forEach(function (row) { list.appendChild(row); });
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activeCategory = tab.getAttribute('data-filter-target');
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      applyFilter();
    });
  });

  searchInput.addEventListener('input', applyFilter);

  function applyQuery(q) {
    searchInput.value = q || '';
    applyFilter();
  }

  var urlQuery = new URLSearchParams(window.location.search).get('q');
  if (urlQuery) applyQuery(urlQuery);

  var urlCategory = new URLSearchParams(window.location.search).get('category');
  if (urlCategory) {
    tabs.forEach(function (t) {
      if (t.getAttribute('data-filter-target') === urlCategory) t.click();
    });
  }

  // Exposed so a combined single-page preview can re-run this without a
  // real page load; unused by the real two-file site.
  window.__applySearchQuery = applyQuery;
})();

(function () {
  // Homepage journey selector: a lens toggle (customer journey / product)
  // switches an always-visible row of 5 icon nodes, each linking to
  // principles.html?stage=X&lens=Y. Grid layout, not a scroll strip — every
  // stage must fit without horizontal scrolling on a phone. No-ops on
  // principles.html, which doesn't have this markup.
  var buttons = document.querySelectorAll('#journey .lens-btn');
  var row = document.getElementById('stageRow');
  if (!buttons.length || !row) return;

  var ICONS = {
    awareness: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"></path><circle cx="12" cy="12" r="2.6"></circle></svg>',
    consideration: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="12" r="6.2"></circle><circle cx="15" cy="12" r="6.2"></circle></svg>',
    conversion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8 12.4l2.6 2.6L16.5 9"></path></svg>',
    retention: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13.9-5.4M20 12a8 8 0 0 1-13.9 5.4"></path><path d="M17 3.5V7h-3.5M7 20.5V17h3.5"></path></svg>',
    advocacy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16v10H9l-4 4v-4H4z"></path><path d="M8.6 10.3c0-.9.7-1.5 1.5-1.5.6 0 1 .3 1.3.7.3-.4.7-.7 1.3-.7.8 0 1.5.6 1.5 1.5 0 1.3-1.5 2.2-2.8 3-1.3-.8-2.8-1.7-2.8-3z" fill="currentColor" stroke="none"></path></svg>'
  };

  var STAGES = [
    { id: 'awareness', count: 10, marketing: 'Awareness', product: 'Acquisition', short: { marketing: 'Awareness', product: 'Acquire' } },
    { id: 'consideration', count: 24, marketing: 'Consideration', product: 'Activation', short: { marketing: 'Compare', product: 'Activate' } },
    { id: 'conversion', count: 32, marketing: 'Conversion', product: 'Conversion', short: { marketing: 'Convert', product: 'Convert' } },
    { id: 'retention', count: 28, marketing: 'Retention', product: 'Retention', short: { marketing: 'Retain', product: 'Retain' } },
    { id: 'advocacy', count: 6, marketing: 'Advocacy', product: 'Referral', short: { marketing: 'Advocate', product: 'Refer' } }
  ];

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>';

  function render(lens) {
    row.innerHTML = '';
    STAGES.forEach(function (stage, i) {
      if (i > 0) {
        var connector = document.createElement('span');
        connector.className = 'stage-connector';
        connector.setAttribute('aria-hidden', 'true');
        connector.innerHTML = ARROW;
        row.appendChild(connector);
      }
      var node = document.createElement('a');
      node.className = 'stage-node';
      node.href = 'principles.html?stage=' + stage.id + '&lens=' + lens;
      node.innerHTML = '<span class="stage-icon-wrap">' + ICONS[stage.id] + '</span>' +
        '<span class="stage-node-label">' + stage.short[lens] + '</span>' +
        '<span class="stage-node-count">' + stage.count + '</span>';
      row.appendChild(node);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      render(btn.getAttribute('data-lens'));
    });
  });

  render('marketing');
})();

(function () {
  // Principles archive page: land here via ?stage=X&lens=Y from the
  // homepage journey selector, and show the matching curated stage view
  // (grouped-by-outcome / sequence toggle) above the full searchable list.
  // No-ops on the homepage, which doesn't have this markup.
  var stageView = document.getElementById('stageView');
  if (!stageView) return;

  var STAGE_META = {
    awareness: { marketing: 'Awareness', product: 'Acquisition', desc: 'Getting noticed at all, before anyone’s comparing anything.' },
    consideration: { marketing: 'Consideration', product: 'Activation', desc: 'Weighing options — where the comparison itself gets shaped.' },
    conversion: { marketing: 'Conversion', product: 'Conversion', desc: 'The moment the price, the plan, the “yes” actually gets decided.' },
    retention: { marketing: 'Retention', product: 'Retention', desc: 'What keeps someone coming back, or quietly cancelling.' },
    advocacy: { marketing: 'Advocacy', product: 'Referral', desc: 'Whether the experience is good enough to repeat, out loud.' }
  };

  function wireToggle(content) {
    content.querySelectorAll('.view-btn').forEach(function (btn) {
      if (btn.dataset.wired) return;
      btn.dataset.wired = '1';
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-view-btn');
        content.querySelectorAll('.view-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
        var grouped = content.querySelector('.view-grouped');
        var sequence = content.querySelector('.view-sequence');
        if (grouped) grouped.hidden = view !== 'grouped';
        if (sequence) sequence.hidden = view !== 'sequence';
      });
    });
  }

  function activateStage(stageId, lens) {
    lens = lens === 'product' ? 'product' : 'marketing';
    var meta = stageId ? STAGE_META[stageId] : null;
    var content = stageId ? stageView.querySelector('.stage-content[data-stage-content="' + stageId + '"]') : null;
    stageView.querySelectorAll('.stage-content').forEach(function (c) { c.hidden = true; });
    if (!meta || !content) {
      stageView.hidden = true;
      return;
    }
    document.getElementById('stageViewLabel').textContent = lens === 'marketing' ? 'Journey stage' : 'Product stage';
    document.getElementById('stageViewTitle').textContent = meta[lens];
    document.getElementById('stageViewDesc').textContent = meta.desc;
    content.hidden = false;
    stageView.hidden = false;
    wireToggle(content);
  }

  var params = new URLSearchParams(window.location.search);
  activateStage(params.get('stage'), params.get('lens'));

  // Exposed so a combined single-page preview can re-run this without a
  // real page load; unused by the real two-file site.
  window.__activateStageView = activateStage;
})();

(function () {
  // Principle sections are collapsed by default. Jumping to one via any
  // anchor link (Contents, practice grid, "see also" cross-links) should
  // land on it already open, not force a second click after the jump.
  function openTargetPrinciple(hash) {
    hash = hash || window.location.hash;
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    var details = target.matches('details.principle-details')
      ? target
      : target.querySelector('details.principle-details');
    if (details && !details.open) details.open = true;
    target.scrollIntoView();
  }
  // Two rAFs, not one: the initial call can otherwise fire before layout has
  // settled (web fonts, the just-opened details' own content), landing the
  // scroll short and leaving the target's heading partially hidden behind
  // the sticky nav. hashchange navigation (already post-load) doesn't need
  // this and calls the function directly.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { openTargetPrinciple(window.location.hash); });
  });
  window.addEventListener('hashchange', function () { openTargetPrinciple(window.location.hash); });

  // Exposed so a combined single-page preview can re-run this without a
  // real page load; unused by the real two-file site.
  window.__openTargetPrinciple = openTargetPrinciple;
})();

(function () {
  // Digital & Product Experiments page: a search box and category chips
  // both filter the same TOC list and the full article below it, the same
  // combined-filter model the Principles page uses. An experiment can
  // carry more than one area (space-separated in data-industries), so the
  // category match is "any match", not Principles' exact-match single
  // category. No-ops on any page without this markup.
  var searchInput = document.getElementById('experimentsSearch');
  var tabs = document.querySelectorAll('#experimentsFilterTabs .toc-tab');
  var cards = document.querySelectorAll('article.experiment');
  var tocItems = document.querySelectorAll('#experimentsToc > li');
  var emptyMsg = document.getElementById('experimentsEmpty');
  if (!tabs.length || !cards.length) return;

  var activeCategory = 'all';

  function cardText(card) {
    if (card.dataset.searchText) return card.dataset.searchText;
    var title = card.querySelector('h2');
    var hook = card.querySelector('.salient-question');
    var meta = card.querySelector('.session-meta');
    var text = normalizeApostrophes(((title ? title.textContent : '') + ' ' + (hook ? hook.textContent : '') + ' ' + (meta ? meta.textContent : '')).toLowerCase());
    card.dataset.searchText = text;
    return text;
  }

  function applyFilter() {
    var query = searchInput ? normalizeApostrophes(searchInput.value.trim().toLowerCase()) : '';
    var visibleCount = 0;
    cards.forEach(function (card, i) {
      var areas = (card.getAttribute('data-industries') || '').split(/\s+/);
      var matchesCategory = activeCategory === 'all' || areas.indexOf(activeCategory) !== -1;
      var matchesSearch = query === '' || cardText(card).indexOf(query) !== -1;
      var visible = matchesCategory && matchesSearch;
      card.hidden = !visible;
      if (tocItems[i]) tocItems[i].hidden = !visible;
      if (visible) visibleCount++;
    });
    if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activeCategory = tab.getAttribute('data-filter-target');
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      applyFilter();
    });
  });

  if (searchInput) searchInput.addEventListener('input', applyFilter);

  var urlCategory = new URLSearchParams(window.location.search).get('category');
  if (urlCategory) {
    tabs.forEach(function (t) {
      if (t.getAttribute('data-filter-target') === urlCategory) t.click();
    });
  }
})();

(function () {
  // Field Sessions page: same combined search + single-category filter
  // model as Principles and Experiments, applied to the TOC list and the
  // full session articles below it. Sessions are heavy, so an <hr> often
  // separates two of them — hide the one that immediately follows a
  // hidden article so filtering doesn't leave a stray rule floating
  // between two other visible sessions. No-ops on any page without this
  // markup (the "Coming soon" upcoming list is left untouched — it's not
  // real content to search or filter).
  var searchInput = document.getElementById('sessionsSearch');
  var tabs = document.querySelectorAll('#sessionsFilterTabs .toc-tab');
  var articles = document.querySelectorAll('article.session');
  var tocItems = document.querySelectorAll('#sessionsToc > li');
  var emptyMsg = document.getElementById('sessionsEmpty');
  if (!searchInput || !tabs.length || !articles.length) return;

  var activeAudience = 'all';

  function articleText(article) {
    if (article.dataset.searchText) return article.dataset.searchText;
    var title = article.querySelector('h2, .session-headline h2, .session-headline');
    var hook = article.querySelector('.salient-question');
    var meta = article.querySelector('.session-meta');
    var text = normalizeApostrophes(((title ? title.textContent : '') + ' ' + (hook ? hook.textContent : '') + ' ' + (meta ? meta.textContent : '')).toLowerCase());
    article.dataset.searchText = text;
    return text;
  }

  function applyFilter() {
    var query = normalizeApostrophes(searchInput.value.trim().toLowerCase());
    var visibleCount = 0;
    articles.forEach(function (article, i) {
      var matchesAudience = activeAudience === 'all' || article.getAttribute('data-audience') === activeAudience;
      var matchesSearch = query === '' || articleText(article).indexOf(query) !== -1;
      var visible = matchesAudience && matchesSearch;
      article.hidden = !visible;
      var rule = article.nextElementSibling;
      if (rule && rule.tagName === 'HR') rule.hidden = !visible;
      if (tocItems[i]) tocItems[i].hidden = !visible;
      if (visible) visibleCount++;
    });
    if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activeAudience = tab.getAttribute('data-filter-target');
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      applyFilter();
    });
  });

  searchInput.addEventListener('input', applyFilter);

  var urlAudience = new URLSearchParams(window.location.search).get('category');
  if (urlAudience) {
    tabs.forEach(function (t) {
      if (t.getAttribute('data-filter-target') === urlAudience) t.click();
    });
  }
})();

(function () {
  // Section rail: wayfinding for long articles (Experiments, Field
  // Sessions' full write-ups). Each [data-rail-root] wraps a .rail-scroll
  // box — its own overflow-y:auto scrollport — holding a .rail-nav
  // (sticky within that box, not the page) alongside the real content,
  // whose top-level chunks carry data-rail-section + data-rail-label.
  //
  // The rail intentionally scrolls inside its own box rather than
  // tracking the document's scroll. A rail sticky to the page only stays
  // pinned if the page itself is the thing scrolling — but viewed through
  // the Claude Artifact preview, the outer viewer stretches the page to
  // its full height and scrolls its own outer window instead, so a
  // document-sticky rail never sees any scroll to react to. Giving the
  // rail a real internal scroll container sidesteps that: it works the
  // same in the preview and once deployed, because it never depends on
  // what, if anything, is scrolling outside it.
  //
  // A section counts as "current" once it crosses into the top band of
  // the rail-scroll box (rootMargin trick, scoped to that box via the
  // observer's root), not merely once it's visible — otherwise several
  // short sections fit in the box at once and fight over which is
  // "active". Scoped per root, so a Field Session's rail only tracks
  // sections inside that same panel; when the panel is hidden (a toggle
  // switched away from "full"), its sections aren't in layout, so the
  // observer simply reports nothing and the rail sits idle until the
  // panel is shown again.
  document.querySelectorAll('[data-rail-root]').forEach(function (root) {
    var sections = Array.from(root.querySelectorAll('[data-rail-section]'));
    var scrollBox = root.querySelector('.rail-scroll');
    if (!sections.length || !scrollBox) return;

    var railSteps = Array.from(root.querySelectorAll('.rail-nav .rail-step'));

    function setActive(idx) {
      railSteps.forEach(function (step, i) {
        step.classList.toggle('active', i === idx);
        step.classList.toggle('done', i < idx);
      });
    }

    var current = 0;
    // Below 640px .rail-scroll is normal document flow (not its own
    // scrollport, see the CSS), so the root-margin trick needs the real
    // viewport as root there — using scrollBox as root would size the
    // "root intersection rectangle" to the whole ~multi-thousand-pixel
    // content block instead of one screen's worth, so the -55% margin
    // no longer trims it down to a screen-sized band and several
    // sections report intersecting at once on load. At 640px+ the box is
    // still a real internally-scrolling frame, so it stays the root.
    var mq = window.matchMedia('(min-width: 640px)');
    var observer;

    function makeObserver() {
      return new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var i = sections.indexOf(entry.target);
            if (i !== -1) current = i;
          }
        });
        setActive(current);
      }, { root: mq.matches ? scrollBox : null, rootMargin: '0px 0px -55% 0px', threshold: 0 });
    }

    observer = makeObserver();
    sections.forEach(function (s) { observer.observe(s); });
    setActive(0);

    // Rebuild with the correct root if the viewport crosses the 640px
    // breakpoint (window resize, tablet rotation) while the page is open.
    mq.addEventListener('change', function () {
      observer.disconnect();
      observer = makeObserver();
      sections.forEach(function (s) { observer.observe(s); });
    });

    railSteps.forEach(function (step, i) {
      step.addEventListener('click', function () {
        if (sections[i]) sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
})();

(function () {
  // Landing hub (nav-entry intro layer on Principles/Field Sessions/
  // Experiments): a view-toggle switches between category tiles and a flat
  // all-items index, reusing the existing .view-btn look. A category tile
  // doesn't duplicate any filter logic itself: it just activates the real
  // toc-tab for that category (already wired to filter the full list
  // further down the page) and scrolls there, so the hub and the archive
  // below it never fall out of sync with each other.
  document.querySelectorAll('.landing-hub').forEach(function (hub) {
    // The Science Behind page merges this hub with its search/filter
    // section into one block (too few entries yet to justify two separate
    // category browsers) and wires its own cat-tile clicks below instead.
    if (hub.querySelector('.sb-domain-btn')) return;

    hub.querySelectorAll('.view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-hub-view');
        hub.querySelectorAll('.view-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        hub.querySelectorAll('.hub-panel').forEach(function (p) {
          p.hidden = p.getAttribute('data-hub-panel') !== view;
        });
      });
    });

    hub.querySelectorAll('.cat-tile').forEach(function (tile) {
      tile.addEventListener('click', function () {
        var category = tile.getAttribute('data-hub-category');
        var tab = document.querySelector('#top .toc-tabs .toc-tab[data-filter-target="' + category + '"]');
        if (tab) tab.click();
        var archive = document.getElementById('top');
        if (archive) archive.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
})();

(function () {
  // Field Session pages: each session's toggle switches between full
  // alternate renderings of that same session (full write-up / condensed /
  // applied variants), not two small lists — so this reuses the
  // .view-toggle/.view-btn look but drives visibility of whole
  // .session-panel blocks instead. sessions.html can hold more than one
  // <article class="session">, each with its own toggle, so every toggle
  // is wired independently and scoped to its own article — a click in one
  // session must never touch another session's panels. No-ops elsewhere.
  document.querySelectorAll('.session-toggle').forEach(function (toggle) {
    var article = toggle.closest('.session') || document;
    var panels = article.querySelectorAll('.session-panel');
    toggle.querySelectorAll('.view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-view-btn');
        toggle.querySelectorAll('.view-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== view; });
      });
    });
  });
})();

(function () {
  // Apply It (apply.html): an adaptive Q&A that walks a visitor from either
  // a principle or a real problem through to a copyable starter brief.
  // The diagnosis step (p2) shows plain, observable symptoms grouped by
  // journey stage, never a behavioural-science category name: each symptom
  // maps by hand to the 1-3 specific principles that actually explain it
  // (APPLY_SYMPTOMS in apply-data.js), so "principles that might explain
  // this" is a curated, accurate filter, not a lazy category match. No-ops
  // on any page without this markup, and on any page missing the data file.
  var toolRoot = document.getElementById('tool');
  if (!toolRoot || typeof APPLY_PRINCIPLES === 'undefined') return;

  var dotsEl = document.getElementById('applyDots');
  var cards = {};
  toolRoot.querySelectorAll('.apply-card').forEach(function (c) { cards[c.getAttribute('data-q')] = c; });

  var STEP_ORDER = ['door'];
  var history = [];
  var currentQ = 'door';
  var selectedSymptoms = [];
  var selectedPrinciples = [];
  var selectedPrincipleId = null;

  function renderDots() {
    dotsEl.innerHTML = '';
    var idx = STEP_ORDER.indexOf(currentQ);
    STEP_ORDER.forEach(function (id, i) {
      var d = document.createElement('div');
      d.className = 'apply-qdot' + (i === idx ? ' active' : (i < idx ? ' done' : ''));
      dotsEl.appendChild(d);
    });
  }

  function show(qid) {
    if (qid === 'door') STEP_ORDER = ['door'];
    Object.keys(cards).forEach(function (k) { cards[k].hidden = (k !== qid); });
    currentQ = qid;
    renderDots();
  }

  function goNext(qid) { history.push(currentQ); show(qid); }
  function goBack() { if (history.length) show(history.pop()); }

  toolRoot.querySelectorAll('[data-back]').forEach(function (b) { b.addEventListener('click', goBack); });

  toolRoot.querySelectorAll('[data-door]').forEach(function (b) {
    b.addEventListener('click', function () {
      selectedSymptoms = [];
      selectedPrinciples = [];
      selectedPrincipleId = null;
      if (b.getAttribute('data-door') === 'problem') {
        STEP_ORDER = ['door', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'brief'];
        renderSymptomChecklist();
        goNext('p1');
      } else {
        STEP_ORDER = ['door', 'c1', 'c2', 'c3', 'brief'];
        renderAllPrincipleChips('');
        goNext('c1');
      }
    });
  });

  function renderSymptomChecklist() {
    var wrap = document.getElementById('symptomChecklist');
    wrap.innerHTML = '';
    APPLY_SYMPTOMS.forEach(function (group) {
      var groupEl = document.createElement('div');
      groupEl.className = 'apply-checklist-group';
      var lbl = document.createElement('span');
      lbl.className = 'apply-checklist-lbl';
      lbl.textContent = group.group;
      groupEl.appendChild(lbl);
      group.items.forEach(function (item) {
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'apply-check-item';
        row.innerHTML = '<span class="box"></span><span>' + item.text + '</span>';
        row.addEventListener('click', function () {
          row.classList.toggle('selected');
          var idx = selectedSymptoms.indexOf(item.id);
          if (row.classList.contains('selected') && idx === -1) selectedSymptoms.push(item.id);
          if (!row.classList.contains('selected') && idx !== -1) selectedSymptoms.splice(idx, 1);
          document.getElementById('p2Next').disabled = selectedSymptoms.length === 0;
        });
        groupEl.appendChild(row);
      });
      wrap.appendChild(groupEl);
    });
  }

  document.querySelector('[data-next="p4"]').addEventListener('click', function () {
    var wrap = document.getElementById('principleChips');
    wrap.innerHTML = '';
    selectedPrinciples = [];
    document.getElementById('p4Next').disabled = true;
    var matchIds = [];
    APPLY_SYMPTOMS.forEach(function (group) {
      group.items.forEach(function (item) {
        if (selectedSymptoms.indexOf(item.id) === -1) return;
        item.principles.forEach(function (pid) {
          if (matchIds.indexOf(pid) === -1) matchIds.push(pid);
        });
      });
    });
    var matches = matchIds.map(function (pid) {
      return APPLY_PRINCIPLES.filter(function (p) { return p.id === pid; })[0];
    }).filter(Boolean);
    document.getElementById('p4Hint').textContent = 'Matched from what you picked, not a whole category.';
    matches.forEach(function (p) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'apply-chip';
      chip.innerHTML = '<span class="dot"></span>' + p.title;
      chip.addEventListener('click', function () {
        chip.classList.toggle('selected');
        var idx = selectedPrinciples.indexOf(p.id);
        if (chip.classList.contains('selected') && idx === -1) selectedPrinciples.push(p.id);
        if (!chip.classList.contains('selected') && idx !== -1) selectedPrinciples.splice(idx, 1);
        document.getElementById('p4Next').disabled = selectedPrinciples.length === 0;
      });
      wrap.appendChild(chip);
    });
  });

  function renderAllPrincipleChips(query) {
    var wrap = document.getElementById('allPrincipleChips');
    wrap.innerHTML = '';
    var q = normalizeApostrophes(query.trim().toLowerCase());
    var list = APPLY_PRINCIPLES.filter(function (p) { return !q || normalizeApostrophes(p.title.toLowerCase()).indexOf(q) !== -1; });
    list.forEach(function (p) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'apply-chip' + (p.id === selectedPrincipleId ? ' selected' : '');
      chip.innerHTML = '<span class="dot"></span>' + p.title;
      chip.addEventListener('click', function () {
        selectedPrincipleId = p.id;
        renderAllPrincipleChips(document.getElementById('principleSearch').value);
        document.getElementById('c1Next').disabled = false;
      });
      wrap.appendChild(chip);
    });
  }
  document.getElementById('principleSearch').addEventListener('input', function () {
    renderAllPrincipleChips(this.value);
  });

  document.querySelector('[data-next="c2"]').addEventListener('click', function () {
    var p = APPLY_PRINCIPLES.filter(function (x) { return x.id === selectedPrincipleId; })[0];
    document.getElementById('c2Title').textContent = 'Applying ' + (p ? p.title : 'this principle');
  });

  toolRoot.querySelectorAll('[data-next]').forEach(function (btn) {
    if (btn.id === 'buildBriefP' || btn.id === 'buildBriefC') return;
    btn.addEventListener('click', function () { goNext(btn.getAttribute('data-next')); });
  });

  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function principleLinksHtml(ids) {
    return ids.map(function (id) {
      var p = APPLY_PRINCIPLES.filter(function (x) { return x.id === id; })[0];
      return p ? '<a href="principles.html#' + p.id + '">' + p.title + '</a>' : '';
    }).join(', ');
  }

  function buildBrief() {
    var isProblem = STEP_ORDER.indexOf('p1') !== -1;
    var rows = [];
    if (isProblem) {
      rows.push(['Problem', esc(val('probStatement')) || '—']);
      rows.push(['Principles', principleLinksHtml(selectedPrinciples) || '—']);
      rows.push(['Target behaviour', esc(val('targetBehaviour')) || '—']);
      rows.push(['Proposed change', esc(val('proposedChange')) || '—']);
      rows.push(['Control', esc(val('controlDesc')) || '—']);
      rows.push(['Treatment', esc(val('treatmentDesc')) || '—']);
      rows.push(['Primary metric', esc(val('metricDesc')) || '—']);
    } else {
      var p = APPLY_PRINCIPLES.filter(function (x) { return x.id === selectedPrincipleId; })[0];
      rows.push(['Principle', p ? '<a href="principles.html#' + p.id + '">' + p.title + '</a>' : '—']);
      rows.push(['The moment', esc(val('ctxMoment')) || '—']);
      rows.push(['Currently', esc(val('ctxCurrent')) || '—']);
      rows.push(['Hypothesis', esc(val('ctxChange')) || '—']);
      rows.push(['Control', esc(val('controlDescC')) || '—']);
      rows.push(['Treatment', esc(val('treatmentDescC')) || '—']);
      rows.push(['Primary metric', esc(val('metricDescC')) || '—']);
    }
    rows.push(['Next', 'Launch, measure, and iterate on what you learn.']);

    var out = document.getElementById('briefOutput');
    var html = '<h4>Starter brief</h4>';
    rows.forEach(function (r) {
      html += '<div class="apply-brief-row"><b>' + r[0] + '</b><span>' + r[1] + '</span></div>';
    });
    html += '<div class="apply-brief-foot"><button type="button" class="apply-btn" id="copyBriefBtn">Copy brief</button><a class="apply-btn primary" href="experiments.html">See the full experiment-blueprint format &rarr;</a></div>';
    out.innerHTML = html;

    document.getElementById('copyBriefBtn').addEventListener('click', function () {
      var text = rows.map(function (r) { return r[0] + ': ' + r[1].replace(/<[^>]+>/g, ''); }).join('\n');
      var btn = this;
      function done() {
        btn.textContent = 'Copied ✓';
        setTimeout(function () { btn.textContent = 'Copy brief'; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopyApply(text, done); });
      } else {
        fallbackCopyApply(text, done);
      }
    });
  }

  function fallbackCopyApply(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    cb();
  }

  document.getElementById('buildBriefP').addEventListener('click', function () { buildBrief(); goNext('brief'); });
  document.getElementById('buildBriefC').addEventListener('click', function () { buildBrief(); goNext('brief'); });

  show('door');
})();

(function () {
  // The Science Behind page: two independent filter axes (domain, signal
  // type) plus search, all combined with AND logic against the same
  // article list and TOC. Distinct from every other page's single-category
  // filter model because this content type is deliberately tagged on two
  // orthogonal taxonomies at once (see the science-behind-article skill).
  // No-ops on any page without this markup.
  var searchInput = document.getElementById('sbSearch');
  var domainTabs = document.querySelectorAll('.sb-domain-btn');
  var signalTabs = document.querySelectorAll('#sbSignalTabs .toc-tab');
  var cards = document.querySelectorAll('article.sb-entry');
  var tocItems = document.querySelectorAll('#sbToc > li');
  var emptyMsg = document.getElementById('sbEmpty');
  if (!domainTabs.length || !cards.length) return;

  var activeDomain = 'all';
  var activeSignal = 'all';

  function cardText(card) {
    if (card.dataset.searchText) return card.dataset.searchText;
    var title = card.querySelector('h2');
    var lead = card.querySelector('.sb-lead');
    var text = normalizeApostrophes(((title ? title.textContent : '') + ' ' + (lead ? lead.textContent : '')).toLowerCase());
    card.dataset.searchText = text;
    return text;
  }

  function applyFilter() {
    var query = searchInput ? normalizeApostrophes(searchInput.value.trim().toLowerCase()) : '';
    var visibleCount = 0;
    cards.forEach(function (card, i) {
      var matchesDomain = activeDomain === 'all' || card.getAttribute('data-domain') === activeDomain;
      var matchesSignal = activeSignal === 'all' || card.getAttribute('data-signal') === activeSignal;
      var matchesSearch = query === '' || cardText(card).indexOf(query) !== -1;
      var visible = matchesDomain && matchesSignal && matchesSearch;
      card.hidden = !visible;
      if (tocItems[i]) tocItems[i].hidden = !visible;
      if (visible) visibleCount++;
    });
    if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
  }

  domainTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activeDomain = tab.getAttribute('data-filter-target');
      domainTabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      applyFilter();
    });
  });

  signalTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activeSignal = tab.getAttribute('data-filter-target');
      signalTabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      applyFilter();
    });
  });

  if (searchInput) searchInput.addEventListener('input', applyFilter);

  var urlCategory = new URLSearchParams(window.location.search).get('category');
  if (urlCategory) {
    domainTabs.forEach(function (t) {
      if (t.getAttribute('data-filter-target') === urlCategory) t.click();
    });
  }
})();
