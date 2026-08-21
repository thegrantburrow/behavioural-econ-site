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
  // Homepage persona picker: clicking a tile reveals 2 real example cards
  // for that role, so "this applies to you" is shown, not just claimed.
  // Single-select: clicking the active tile again collapses the panel.
  var tiles = document.querySelectorAll('.persona-tile');
  var panel = document.getElementById('personaPanel');
  if (!tiles.length || !panel) return;

  var personas = {
    'small-business': {
      headline: 'Built for a small retail business like yours.',
      cards: [
        {
          tag: 'Principle',
          title: 'Goal Gradient Effect',
          body: 'A loyalty card with two stamps already filled in gets used faster than a blank one, for the exact same reward.',
          why: 'Why it matters: your punch card or points program’s starting balance changes how fast people come back.',
          href: 'principles.html#goal-gradient'
        },
        {
          tag: 'Principle',
          title: 'Scarcity',
          body: 'A real classroom example: a “flash sale ends in 09:47, only 2 left” product card, shown alongside social proof and anchoring on the same slide.',
          why: 'Why it matters: this is the exact anatomy of a shelf sign or countdown banner that actually works.',
          href: 'principles.html#scarcity'
        }
      ],
      moreHref: 'principles.html',
      moreLabel: 'See all 57 principles'
    },
    'large-business': {
      headline: 'Built for a large organization like yours.',
      cards: [
        {
          tag: 'Experiment',
          title: 'Tradeoff Transparency, tested between products',
          body: 'The real Buell &amp; Choi (2025) field experiment, run inside Commonwealth Bank of Australia’s credit card funnel, raised spend and cut cancellations by showing drawbacks upfront.',
          why: 'Why it matters: a real bank-scale result, with the actual numbers, not a case study written after the fact.',
          href: 'experiments.html#product-comparison-tradeoff-transparency'
        },
        {
          tag: 'Experiment',
          title: 'Does explaining a fee rise change whether it feels fair?',
          body: 'Builds on Kahneman, Knetsch &amp; Thaler’s (1986) fairness research, applied to a real bank fee notice instead of their original hypothetical snow shovel.',
          why: 'Why it matters: a testable blueprint for the exact moment customers decide a price change is reasonable or sneaky.',
          href: 'experiments.html#fee-change-fairness-explanation'
        }
      ],
      moreHref: 'experiments.html',
      moreLabel: 'See the full experiment teardowns'
    },
    'product-manager': {
      headline: 'Blueprints you could actually run.',
      cards: [
        {
          tag: 'Experiment',
          title: 'Does naming a savings pocket keep the money there?',
          body: 'Builds on Mental Accounting and Salience: does &ldquo;Savings Pocket 2&rdquo; becoming &ldquo;Save for Phone&rdquo; change how much of it gets spent?',
          why: 'Why it matters: one label change, designed as a real testable product experiment, not a redesign.',
          href: 'experiments.html#named-pockets'
        },
        {
          tag: 'Experiment',
          title: 'Does tradeoff transparency work between products, not just within one?',
          body: 'The real CBA result compared credit cards to each other. This blueprint asks whether it holds comparing credit to other ways to pay entirely.',
          why: 'Why it matters: the natural next test once a first result like this ships.',
          href: 'experiments.html#product-comparison-tradeoff-transparency'
        }
      ],
      moreHref: 'experiments.html',
      moreLabel: 'See more testable blueprints'
    },
    researcher: {
      headline: 'How to weigh a study properly.',
      cards: [
        {
          tag: 'Field Guide',
          title: 'How strong is that evidence, actually?',
          body: 'A ranked ladder of causal evidence, from a genuine randomized trial down to two numbers that happened to move together on a dashboard.',
          why: 'Why it matters: a quick way to tell a real result apart from a coincidence dressed up as one.',
          href: 'evidence-strength.html'
        },
        {
          tag: 'Case study',
          title: 'Cheap Talk &amp; Hypothetical Bias',
          body: 'People reliably state a higher willingness to pay in hypothetical surveys than they actually pay when real money is on the line, even when warned about it.',
          why: 'Why it matters: a stated intention is not a prediction of behaviour, even from an honest respondent.',
          href: 'reading-the-research.html#cheap-talk'
        }
      ],
      moreHref: 'reading-the-research.html',
      moreLabel: 'Read the full field guide'
    },
    marketer: {
      headline: 'The 57 principles behind what people actually notice.',
      cards: [
        {
          tag: 'Principle',
          title: 'Salience',
          body: 'The option, number, or detail that visually or emotionally stands out gets weighted far more heavily in a decision than its actual importance justifies.',
          why: 'Why it matters: the bold number people remember is the one you made stand out, not the one that mattered most.',
          href: 'principles.html#salience'
        },
        {
          tag: 'Principle',
          title: 'Halo Effect',
          body: 'A single strong, positive trait quietly colours judgment of other, unrelated traits of the same brand, even ones nobody actually checked.',
          why: 'Why it matters: one strong first impression gets extended, unverified, to everything else about the brand.',
          href: 'principles.html#halo-effect'
        }
      ],
      moreHref: 'principles.html',
      moreLabel: 'See all 57 principles'
    }
  };

  function renderPanel(key) {
    var data = personas[key];
    if (!data) { panel.hidden = true; panel.innerHTML = ''; return; }
    var cardsHtml = data.cards.map(function (c) {
      return '<div class="persona-example-card">' +
        '<span class="ex-tag">' + c.tag + '</span>' +
        '<h4>' + c.title + '</h4>' +
        '<p>' + c.body + '</p>' +
        '<p class="why-line">' + c.why + '</p>' +
        '<a class="read-link" href="' + c.href + '">Read more &rsaquo;</a>' +
        '</div>';
    }).join('');
    panel.innerHTML =
      '<p class="persona-panel-headline">' + data.headline + '</p>' +
      '<div class="persona-panel-cards">' + cardsHtml + '</div>' +
      '<p class="persona-panel-more"><a href="' + data.moreHref + '">' + data.moreLabel + ' &rsaquo;</a></p>';
    panel.hidden = false;
  }

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      var key = tile.getAttribute('data-persona');
      var wasActive = tile.getAttribute('aria-pressed') === 'true';
      tiles.forEach(function (t) { t.setAttribute('aria-pressed', 'false'); });
      if (wasActive) {
        panel.hidden = true;
        panel.innerHTML = '';
        return;
      }
      tile.setAttribute('aria-pressed', 'true');
      renderPanel(key);
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
    { id: 'conversion', count: 17, marketing: 'Conversion', product: 'Conversion', short: { marketing: 'Convert', product: 'Convert' } },
    { id: 'retention', count: 17, marketing: 'Retention', product: 'Retention', short: { marketing: 'Retain', product: 'Retain' } },
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
  openTargetPrinciple(window.location.hash);
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
    var text = ((title ? title.textContent : '') + ' ' + (hook ? hook.textContent : '') + ' ' + (meta ? meta.textContent : '')).toLowerCase();
    card.dataset.searchText = text;
    return text;
  }

  function applyFilter() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
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
    var text = ((title ? title.textContent : '') + ' ' + (hook ? hook.textContent : '') + ' ' + (meta ? meta.textContent : '')).toLowerCase();
    article.dataset.searchText = text;
    return text;
  }

  function applyFilter() {
    var query = searchInput.value.trim().toLowerCase();
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
