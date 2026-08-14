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
  var tabsWrap = document.querySelector('.toc-tabs-wrap');
  var tabsEl = document.querySelector('.toc-tabs');
  var tabs = document.querySelectorAll('.toc-tab');
  var panels = document.querySelectorAll('.toc-panel');
  if (!tabs.length || !panels.length) return;

  function updateScrollFade() {
    if (!tabsWrap || !tabsEl) return;
    tabsWrap.classList.toggle('scrollable', tabsEl.scrollWidth > tabsEl.clientWidth + 2);
  }
  updateScrollFade();
  window.addEventListener('resize', updateScrollFade);
  if (tabsEl) tabsEl.addEventListener('scroll', function () {
    if (!tabsWrap) return;
    var atEnd = tabsEl.scrollLeft + tabsEl.clientWidth >= tabsEl.scrollWidth - 2;
    tabsWrap.classList.toggle('scrollable', !atEnd && tabsEl.scrollWidth > tabsEl.clientWidth + 2);
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-toc-target');
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function (p) {
        if (p.getAttribute('data-toc-panel') === target) {
          p.removeAttribute('hidden');
        } else {
          p.setAttribute('hidden', '');
        }
      });
      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });
})();
