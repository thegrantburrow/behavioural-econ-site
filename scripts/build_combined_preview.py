"""Combine mockup/index.html + mockup/principles.html into a single
self-contained HTML file for previewing as one Claude Artifact.

Why this exists: publishing the homepage and the principles archive as two
separate Artifacts means every link between them is cross-artifact
navigation, which the Artifact host treats as "leaving the page" (shows a
confirmation dialog, or worse, does a real reload that resets all JS
state). This script instead builds one document with both "pages" as
sibling view containers (#view-home / #view-principles) plus a small
client-side router appended after script.js that intercepts clicks meant
for the other page and switches views in place — no real navigation ever
happens. The real two-file site (mockup/index.html, mockup/principles.html)
is untouched by this and works normally when actually deployed.

Usage: python3 scripts/build_combined_preview.py [output_path]
"""
import sys
import pathlib

REPO = pathlib.Path(__file__).resolve().parent.parent / "mockup"
OUT = sys.argv[1] if len(sys.argv) > 1 else "combined-preview.html"

css = (REPO / "styles.css").read_text()
js = (REPO / "script.js").read_text()
home = (REPO / "index.html").read_text()
arch = (REPO / "principles.html").read_text()


def extract(html, start_marker, end_marker):
    start = html.index(start_marker) + len(start_marker)
    end = html.index(end_marker, start)
    return html[start:end]


# Shared nav + footer: use principles.html's versions, since every link in
# them is already fully-qualified (index.html#x / principles.html) and
# therefore correct regardless of which view is currently showing.
shared_nav = extract(arch, "<body>\n\n", "\n\n<section")
shared_footer = "<footer>" + extract(arch, "</section>\n\n<footer>", "<script")

# Home view: index.html's body content between its own nav and footer.
home_body = extract(home, "</nav>\n\n", "\n\n<footer>")

# Principles view: everything principles.html renders after its own nav,
# up to (not including) its footer — stage-view + search/filter + full list.
arch_body = extract(arch, "</nav>\n\n", "\n\n<footer>")

router_js = r"""
(function () {
  // Combined single-artifact preview only: two "pages" live in one document
  // as sibling view containers, and this router intercepts the same links
  // and form the real two-file site uses (principles.html?..., index.html#...)
  // and re-points them at view switches instead of real navigation — so nothing
  // ever looks like it's leaving the artifact. The real site (mockup/index.html
  // + mockup/principles.html) is unaffected by any of this; it just uses real
  // hrefs across two real files.
  var viewHome = document.getElementById('view-home');
  var viewPrinciples = document.getElementById('view-principles');
  if (!viewHome || !viewPrinciples) return;

  function goHome(hash) {
    viewPrinciples.hidden = true;
    viewHome.hidden = false;
    if (hash && window.__openTargetPrinciple) {
      window.__openTargetPrinciple(hash);
    } else {
      window.scrollTo(0, 0);
    }
  }

  function goPrinciples(search, hash) {
    viewHome.hidden = true;
    viewPrinciples.hidden = false;
    var params = new URLSearchParams(search || '');
    if (window.__activateStageView) window.__activateStageView(params.get('stage'), params.get('lens'));
    if (window.__applySearchQuery) window.__applySearchQuery(params.get('q') || '');
    if (hash && window.__openTargetPrinciple) {
      window.__openTargetPrinciple(hash);
    } else {
      window.scrollTo(0, 0);
    }
  }

  function splitHref(href) {
    var hashIdx = href.indexOf('#');
    var qIdx = href.indexOf('?');
    var hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
    var search = qIdx >= 0 ? href.slice(qIdx, hashIdx >= 0 ? hashIdx : undefined) : '';
    return { search: search, hash: hash };
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (href.indexOf('principles.html') === 0) {
      e.preventDefault();
      var p = splitHref(href);
      goPrinciples(p.search, p.hash);
      return;
    }
    if (href.indexOf('index.html') === 0) {
      e.preventDefault();
      var h = splitHref(href);
      goHome(h.hash);
      return;
    }
    if (href.charAt(0) === '#' && href.length > 1) {
      // Bare same-document fragment link (e.g. a cross-link from inside the
      // stage view to a specific principle). Never let real hash navigation
      // fire for these — resolve and jump entirely in JS instead, in
      // whichever view currently contains the target. Letting the browser's
      // own hash navigation run here was the actual bug: something in the
      // Artifact host's link handling was treating it as a real navigation
      // and reloading the document, which reset all view state back to the
      // default (home) view.
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      if (viewHome.contains(target)) {
        goHome(href);
      } else if (viewPrinciples.contains(target)) {
        goPrinciples('', href);
      }
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    var action = form.getAttribute('action');
    if (action !== 'principles.html') return;
    e.preventDefault();
    var input = form.querySelector('input[name="q"]');
    var q = input ? input.value.trim() : '';
    goPrinciples(q ? ('?q=' + encodeURIComponent(q)) : '', '');
  });

  // Bootstrap: if the artifact is opened directly with a hash that targets
  // a principle, land on the principles view already showing it, instead
  // of the default home view with a dead hash.
  if (window.location.hash) {
    var initial = document.getElementById(window.location.hash.slice(1));
    if (initial && viewPrinciples.contains(initial)) {
      goPrinciples('', window.location.hash);
    }
  }
})();
"""

combined = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#FBF9F4">
<title>Field Notes — a field guide to behavioural economics</title>
<style>
{css}
</style>
</head>
<body>

{shared_nav}

<div id="view-home">
{home_body}
</div>

<div id="view-principles" hidden>
{arch_body}
</div>

{shared_footer}

<script>
{js}
{router_js}
</script>
</body>
</html>
"""

pathlib.Path(OUT).write_text(combined)
print("combined bytes:", len(combined))

# Sanity checks
assert combined.count('id="view-home"') == 1
assert combined.count('id="view-principles"') == 1
assert combined.count("<nav") == 1, "expected exactly one shared nav"
assert combined.count("<footer") == 1, "expected exactly one shared footer"
print(f"OK: wrote {OUT}")
