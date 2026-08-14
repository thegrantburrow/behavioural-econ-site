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
