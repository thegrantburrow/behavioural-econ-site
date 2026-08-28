/*!
 * Predictive Search — a small, dependency-free predictive/autocomplete
 * search box: ranks matches as you type and shows the best ones first,
 * instead of just filtering in whatever order the data happens to be in.
 *
 * Ranking (best to worst): exact match on the title field, title starts
 * with the query, query appears at a word boundary inside the title,
 * query appears anywhere in the title, query appears in the secondary
 * field (a description/blurb), no match. Ties fall back to original
 * array order.
 *
 * Fully keyboard-navigable (arrow keys, Enter, Escape) and wired with
 * the ARIA combobox/listbox pattern, so it's usable with a screen reader
 * and not just a mouse.
 *
 * No styling, no site-specific data, and no framework dependency —
 * ships blank and takes its data/labels/callback from whoever calls
 * PredictiveSearch.init(). See README.md for the full option list and
 * a wiring example.
 */
(function (global) {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Smart-quote apostrophes (iOS/macOS auto-correct turns a typed ' into
  // U+2019 as the user types) won't substring-match a straight ' baked
  // into indexed text like "Don't Say the E-Word". Both the query and the
  // indexed field get normalised through this before comparing, so an
  // apostrophe typed on any device matches either apostrophe form.
  function normalizeApostrophes(s) {
    return String(s).replace(/[‘’‛ʼ′´]/g, "'");
  }

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  function merge(base, extra) {
    var out = {};
    var k;
    for (k in base) { if (base.hasOwnProperty(k)) out[k] = base[k]; }
    if (extra) { for (k in extra) { if (extra.hasOwnProperty(k)) out[k] = extra[k]; } }
    return out;
  }

  /**
   * Default relevance scorer. Lower is better; 5 means "no match, drop it."
   * item: one row of your data. query: the lowercased, trimmed search string.
   * fields: { primary: 'title', secondary: 'description' } (field names on item).
   */
  function defaultRelevanceScore(item, query, fields) {
    var title = normalizeApostrophes(String(item[fields.primary] || '')).toLowerCase();
    var secondary = fields.secondary ? normalizeApostrophes(String(item[fields.secondary] || '')).toLowerCase() : '';
    var q = normalizeApostrophes(query);
    if (title === q) return 0;
    if (title.indexOf(q) === 0) return 1;
    if (new RegExp('\\b' + escapeRegExp(q)).test(title)) return 2;
    if (title.indexOf(q) !== -1) return 3;
    if (secondary && secondary.indexOf(q) !== -1) return 4;
    return 5;
  }

  /** Wraps the first match of `query` inside `text` in a <mark>. HTML-escaped either way. */
  function defaultHighlight(text, query) {
    var str = String(text == null ? '' : text);
    if (!query) return escapeHtml(str);
    var idx = normalizeApostrophes(str).toLowerCase().indexOf(normalizeApostrophes(query).toLowerCase());
    if (idx === -1) return escapeHtml(str);
    return (
      escapeHtml(str.slice(0, idx)) +
      '<mark>' + escapeHtml(str.slice(idx, idx + query.length)) + '</mark>' +
      escapeHtml(str.slice(idx + query.length))
    );
  }

  var idCounter = 0;

  /**
   * PredictiveSearch.init(options) wires one input into a live, ranked
   * suggestions dropdown. Returns a handle with .setData(), .close(),
   * and .destroy().
   *
   * Required:
   *   input          — an <input> element, or a selector string for one.
   *
   * One of these two (not both):
   *   data           — array of plain objects to search locally, e.g.
   *                     [{ title: 'Anchoring', description: '...', url: '/anchoring' }]
   *   search         — function(query) for remote/large datasets. Return
   *                     an array of items directly, a Promise of one, or
   *                     call the (items) callback passed as the 2nd arg.
   *                     You're responsible for ranking in this mode —
   *                     defaultRelevanceScore is only applied to `data`.
   *
   * Optional:
   *   list           — an existing <ul>/<ol> to render into (a selector
   *                     or element). If omitted, one is created and
   *                     inserted right after `input`.
   *   fields         — { primary, secondary } field names on each item
   *                     used for ranking/highlighting. Default:
   *                     { primary: 'title', secondary: 'description' }.
   *   maxResults     — how many suggestions to show at once. Default 7.
   *   minChars       — don't search until the query is at least this
   *                     long. Default 1.
   *   relevanceScore — function(item, query, fields) -> number, replaces
   *                     the default 5-tier scorer entirely.
   *   formatLabel    — function(item, query) -> HTML string for one row.
   *                     Default highlights the primary field.
   *   onSelect       — function(item) called when a suggestion is picked
   *                     (click, or Enter on the active row). Default
   *                     navigates to item.url if present.
   *   emptyMessage   — string shown when there are zero matches. Omit to
   *                     just close the dropdown on zero matches instead.
   *   classNames     — { list, item, active, empty, group } CSS class
   *                     overrides.
   *   groupBy        — field name (string) or function(item) -> key.
   *                     When set, results render as labelled groups (e.g.
   *                     one dataset spanning several content types on a
   *                     site, grouped the way the site's own nav already
   *                     categorises them) instead of one flat list.
   *                     Group headers are `role="presentation"`, not
   *                     selectable, and never count towards a result total.
   *                     Ranking still runs globally first, so the best
   *                     match within each group still sorts first inside
   *                     that group. Only applies to the local `data` path,
   *                     not `search`, same as `relevanceScore`.
   *   groupOrder     — array of group keys in the order they should
   *                     display. Any group present in the data but absent
   *                     from this list is appended after, in the order it
   *                     was first encountered. Omit to use first-seen
   *                     order entirely.
   *   groupLabel     — function(key) -> string shown in the group header.
   *                     Default: String(key) unchanged.
   *   maxResultsPerGroup — cap on rows shown per group. Default 4.
   *                     `maxResults` still applies as an overall cap
   *                     across every group combined; when `groupBy` is
   *                     set and `maxResults` isn't explicitly passed, it
   *                     defaults to unlimited so a real per-group cap
   *                     isn't silently cut in half by a low overall one.
   */
  function init(options) {
    if (!options || !options.input) {
      throw new Error('PredictiveSearch.init requires an `input` element.');
    }
    var input = typeof options.input === 'string' ? document.querySelector(options.input) : options.input;
    if (!input) throw new Error('PredictiveSearch.init: input element not found.');

    var data = options.data || [];
    var searchFn = options.search || null;
    var fields = merge({ primary: 'title', secondary: 'description' }, options.fields);
    var groupBy = options.groupBy || null;
    var groupOrder = options.groupOrder || null;
    var groupLabel = options.groupLabel || function (key) { return String(key); };
    var maxResultsPerGroup = options.maxResultsPerGroup || 4;
    var maxResults = options.maxResults || (groupBy ? Infinity : 7);
    var minChars = options.minChars || 1;
    var getScore = options.relevanceScore || defaultRelevanceScore;
    var emptyMessage = options.emptyMessage != null ? options.emptyMessage : null;
    var classNames = merge({
      list: 'ps-suggestions',
      item: 'ps-suggestion',
      active: 'active',
      empty: 'ps-suggestion ps-suggestion-empty',
      group: 'ps-group-label'
    }, options.classNames);

    var onSelect = options.onSelect || function (item) {
      if (item && item.url) window.location.href = item.url;
    };
    var formatLabel = options.formatLabel || function (item, query) {
      return defaultHighlight(item[fields.primary], query);
    };

    idCounter += 1;
    var uid = 'ps-' + idCounter;

    var list = options.list ? (typeof options.list === 'string' ? document.querySelector(options.list) : options.list) : null;
    var createdList = false;
    if (!list) {
      list = document.createElement('ul');
      input.insertAdjacentElement('afterend', list);
      createdList = true;
    }
    list.classList.add(classNames.list);
    if (!list.id) list.id = uid + '-listbox';
    list.setAttribute('role', 'listbox');
    list.hidden = true;

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-haspopup', 'listbox');
    if (!input.getAttribute('autocomplete')) input.setAttribute('autocomplete', 'off');

    var currentMatches = [];
    var activeIndex = -1;

    function close() {
      list.hidden = true;
      list.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      currentMatches = [];
      activeIndex = -1;
    }

    function setActive(i) {
      var items = toArray(list.querySelectorAll('[role="option"]'));
      items.forEach(function (el) {
        el.classList.remove(classNames.active);
        el.removeAttribute('aria-selected');
      });
      if (i >= 0 && i < items.length) {
        items[i].classList.add(classNames.active);
        items[i].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', items[i].id);
        activeIndex = i;
      } else {
        input.removeAttribute('aria-activedescendant');
        activeIndex = -1;
      }
    }

    function render(query, items, groupBreaks) {
      currentMatches = items;
      if (!items.length) {
        if (emptyMessage) {
          list.innerHTML = '<li class="' + classNames.empty + '" role="option" aria-disabled="true">' +
            escapeHtml(emptyMessage) + '</li>';
          list.hidden = false;
          input.setAttribute('aria-expanded', 'true');
        } else {
          close();
        }
        return;
      }
      var html = '';
      items.forEach(function (item, i) {
        if (groupBreaks && groupBreaks.hasOwnProperty(i)) {
          html += '<li class="' + classNames.group + '" role="presentation">' + escapeHtml(groupBreaks[i]) + '</li>';
        }
        html += '<li class="' + classNames.item + '" id="' + uid + '-opt' + i + '" role="option" data-idx="' + i + '">' +
          formatLabel(item, query) + '</li>';
      });
      list.innerHTML = html;
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      setActive(-1);
    }

    function runLocalSearch(query) {
      var scored = data
        .map(function (item) { return { item: item, score: getScore(item, query, fields) }; })
        .filter(function (s) { return s.score < 5; })
        .sort(function (a, b) { return a.score - b.score; });

      if (!groupBy) {
        render(query, scored.slice(0, maxResults).map(function (s) { return s.item; }));
        return;
      }

      var groups = {};
      var firstSeen = [];
      scored.forEach(function (s) {
        var key = typeof groupBy === 'function' ? groupBy(s.item) : s.item[groupBy];
        if (!groups[key]) { groups[key] = []; firstSeen.push(key); }
        if (groups[key].length < maxResultsPerGroup) groups[key].push(s.item);
      });

      var orderedKeys = (groupOrder || []).filter(function (k) { return groups[k] && groups[k].length; });
      firstSeen.forEach(function (k) { if (orderedKeys.indexOf(k) === -1) orderedKeys.push(k); });

      var flat = [];
      var breaks = {};
      orderedKeys.forEach(function (k) {
        breaks[flat.length] = groupLabel(k);
        flat = flat.concat(groups[k]);
      });

      if (flat.length > maxResults) flat = flat.slice(0, maxResults);
      render(query, flat, breaks);
    }

    function handleInput() {
      var raw = input.value.trim();
      var query = raw.toLowerCase();
      if (raw.length < minChars) { close(); return; }

      if (searchFn) {
        var result = searchFn(raw, function (items) {
          render(query, (items || []).slice(0, maxResults));
        });
        if (result && typeof result.then === 'function') {
          result.then(function (items) { render(query, (items || []).slice(0, maxResults)); });
        } else if (Array.isArray(result)) {
          render(query, result.slice(0, maxResults));
        }
      } else {
        runLocalSearch(query);
      }
    }

    function selectItem(item) {
      close();
      onSelect(item);
    }

    function handleKeydown(e) {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(Math.min(activeIndex + 1, currentMatches.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && currentMatches[activeIndex]) {
          e.preventDefault();
          selectItem(currentMatches[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        close();
      }
    }

    function handleListClick(e) {
      var li = e.target.closest ? e.target.closest('[data-idx]') : null;
      if (!li) return;
      var idx = Number(li.getAttribute('data-idx'));
      if (currentMatches[idx]) selectItem(currentMatches[idx]);
    }

    function handleDocClick(e) {
      if (!input.contains(e.target) && !list.contains(e.target)) close();
    }

    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeydown);
    list.addEventListener('click', handleListClick);
    document.addEventListener('click', handleDocClick);

    return {
      setData: function (newData) { data = newData || []; },
      close: close,
      destroy: function () {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('keydown', handleKeydown);
        list.removeEventListener('click', handleListClick);
        document.removeEventListener('click', handleDocClick);
        input.removeAttribute('role');
        input.removeAttribute('aria-autocomplete');
        input.removeAttribute('aria-expanded');
        input.removeAttribute('aria-controls');
        input.removeAttribute('aria-haspopup');
        input.removeAttribute('aria-activedescendant');
        if (createdList && list.parentNode) list.parentNode.removeChild(list);
      }
    };
  }

  global.PredictiveSearch = {
    init: init,
    defaultRelevanceScore: defaultRelevanceScore,
    defaultHighlight: defaultHighlight
  };
})(typeof window !== 'undefined' ? window : this);
