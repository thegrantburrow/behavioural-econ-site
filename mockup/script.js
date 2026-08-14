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
  // Homepage intro: a live anchoring demo the reader clicks themselves,
  // instead of a stat about someone else's study.
  var toggle = document.getElementById('demoToggle');
  var old = document.getElementById('demoOld');
  var stage = document.getElementById('demoStage');
  var reveal = document.getElementById('demoReveal');
  if (!toggle || !old || !stage || !reveal) return;

  var anchorRemoved = false;
  toggle.addEventListener('click', function () {
    anchorRemoved = !anchorRemoved;
    old.hidden = anchorRemoved;
    stage.classList.toggle('anchor-removed', anchorRemoved);
    toggle.textContent = anchorRemoved ? 'Add the $40 back →' : 'Remove the $40 →';
    reveal.hidden = !anchorRemoved;
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

  var urlQuery = new URLSearchParams(window.location.search).get('q');
  if (urlQuery) {
    searchInput.value = urlQuery;
    applyFilter();
  }
})();

(function () {
  // Homepage journey selector: the fork question reveals one of two lenses'
  // 5 stages, each pill linking to principles.html?stage=X&lens=Y. No-ops
  // on principles.html, which doesn't have this markup.
  var buttons = document.querySelectorAll('#journey .fork-btn');
  var row = document.getElementById('stageRow');
  var hint = document.getElementById('lensHint');
  if (!buttons.length || !row || !hint) return;

  var STAGES = [
    { id: 'awareness', count: 5, marketing: 'Awareness', product: 'Acquisition' },
    { id: 'consideration', count: 13, marketing: 'Consideration', product: 'Activation' },
    { id: 'conversion', count: 14, marketing: 'Conversion', product: 'Conversion' },
    { id: 'retention', count: 11, marketing: 'Retention', product: 'Retention' },
    { id: 'advocacy', count: 3, marketing: 'Advocacy', product: 'Referral' }
  ];

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
      var lens = btn.getAttribute('data-lens');
      hint.textContent = lens === 'marketing'
        ? 'Marketing funnel: Awareness → Consideration → Conversion → Retention → Advocacy'
        : 'Product funnel: Acquisition → Activation → Conversion → Retention → Referral';
      row.innerHTML = '';
      STAGES.forEach(function (stage, i) {
        var pill = document.createElement('a');
        pill.className = 'stage-pill';
        pill.href = 'principles.html?stage=' + stage.id + '&lens=' + lens;
        pill.innerHTML = '<span class="sp-name">' + stage[lens] + '</span><span class="sp-count">' + stage.count + ' principles</span>';
        row.appendChild(pill);
        if (i < STAGES.length - 1) {
          var arrow = document.createElement('span');
          arrow.className = 'stage-arrow';
          arrow.setAttribute('aria-hidden', 'true');
          arrow.textContent = '→';
          row.appendChild(arrow);
        }
      });
      row.hidden = false;
    });
  });
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

  var params = new URLSearchParams(window.location.search);
  var stageId = params.get('stage');
  var lens = params.get('lens') === 'product' ? 'product' : 'marketing';
  var meta = stageId ? STAGE_META[stageId] : null;
  var content = stageId ? stageView.querySelector('.stage-content[data-stage-content="' + stageId + '"]') : null;
  if (!meta || !content) return;

  document.getElementById('stageViewLabel').textContent = lens === 'marketing' ? 'Journey stage' : 'Product stage';
  document.getElementById('stageViewTitle').textContent = meta[lens];
  document.getElementById('stageViewDesc').textContent = meta.desc;
  content.hidden = false;
  stageView.hidden = false;

  content.querySelectorAll('.view-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var view = btn.getAttribute('data-view-btn');
      content.querySelectorAll('.view-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
      var grouped = content.querySelector('.view-grouped');
      var sequence = content.querySelector('.view-sequence');
      if (grouped) grouped.hidden = view !== 'grouped';
      if (sequence) sequence.hidden = view !== 'sequence';
    });
  });
})();

(function () {
  // Principle sections are collapsed by default. Jumping to one via any
  // anchor link (Contents, practice grid, "see also" cross-links) should
  // land on it already open, not force a second click after the jump.
  function openTargetPrinciple() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    var details = target.matches('details.principle-details')
      ? target
      : target.querySelector('details.principle-details');
    if (details && !details.open) details.open = true;
  }
  openTargetPrinciple();
  window.addEventListener('hashchange', openTargetPrinciple);
})();
