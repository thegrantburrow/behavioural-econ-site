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
  // Principles archive page: search box + category chips both filter the
  // same single list of principle rows (not two separate representations
  // of the 36 principles — that duplication was part of what made the
  // homepage feel like "everything, twice"). No-ops on any page that
  // doesn't have this markup (i.e. the homepage).
  var searchInput = document.getElementById('principlesSearch');
  var tabs = document.querySelectorAll('#principlesFilterTabs .toc-tab');
  var rows = document.querySelectorAll('.principles-list > section.principle');
  var emptyMsg = document.getElementById('principlesEmpty');
  if (!searchInput || !tabs.length || !rows.length) return;

  var activeCategory = 'all';

  function rowText(row) {
    if (row.dataset.searchText) return row.dataset.searchText;
    var title = row.querySelector('h3');
    var def = row.querySelector('.definition');
    var text = ((title ? title.textContent : '') + ' ' + (def ? def.textContent : '')).toLowerCase();
    row.dataset.searchText = text;
    return text;
  }

  function applyFilter() {
    var query = searchInput.value.trim().toLowerCase();
    var visibleCount = 0;
    rows.forEach(function (row) {
      var matchesCategory = activeCategory === 'all' || row.getAttribute('data-theme') === activeCategory;
      var matchesSearch = query === '' || rowText(row).indexOf(query) !== -1;
      var visible = matchesCategory && matchesSearch;
      row.hidden = !visible;
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

  searchInput.addEventListener('input', applyFilter);

  function applyQuery(q) {
    searchInput.value = q || '';
    applyFilter();
  }

  var urlQuery = new URLSearchParams(window.location.search).get('q');
  if (urlQuery) applyQuery(urlQuery);

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
    { id: 'awareness', count: 6, marketing: 'Awareness', product: 'Acquisition', short: { marketing: 'Awareness', product: 'Acquire' } },
    { id: 'consideration', count: 15, marketing: 'Consideration', product: 'Activation', short: { marketing: 'Compare', product: 'Activate' } },
    { id: 'conversion', count: 16, marketing: 'Conversion', product: 'Conversion', short: { marketing: 'Convert', product: 'Convert' } },
    { id: 'retention', count: 15, marketing: 'Retention', product: 'Retention', short: { marketing: 'Retain', product: 'Retain' } },
    { id: 'advocacy', count: 5, marketing: 'Advocacy', product: 'Referral', short: { marketing: 'Advocate', product: 'Refer' } }
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
  openTargetPrinciple(window.location.hash);
  window.addEventListener('hashchange', function () { openTargetPrinciple(window.location.hash); });

  // Exposed so a combined single-page preview can re-run this without a
  // real page load; unused by the real two-file site.
  window.__openTargetPrinciple = openTargetPrinciple;
})();
