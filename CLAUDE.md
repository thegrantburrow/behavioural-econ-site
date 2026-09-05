# Field Notes — behavioural-econ-site

A website about applied behavioural economics — real consumer moments (retail
signage, app notifications, subscription pricing, shopfronts) mapped to the
research behind them. Built from the owner's own photos of real examples,
plus original case studies. Full context: `PROJECT-BRIEF.md`.

- Working tree lives in `mockup/` (`index.html`, `principles.html`,
  `sessions.html`, `experiments.html`, `styles.css`, `script.js`,
  `mockup/images/`). Treat this as the site; there is no build step yet.
- Palette: ink `#1B1E24`, terracotta `#C43E1F`, mustard `#E0A93A`, teal
  `#1F7A6C`, paper `#F5F6F5`. This doc had drifted from the live tokens in
  `mockup/styles.css`'s own `:root` block for a while before being caught
  2026-08-31; always grep `styles.css` directly before hardcoding a hex value
  into a standalone artifact, don't trust this line on faith. Georgia/serif for headlines, system sans for
  body — no monospace.
- Skills exist for the site's recurring content types — use them instead of
  improvising structure: `behavioural-principle-article`, `field-session`,
  `experiment-blueprint`, `design-options-review`, `authentic-voice`,
  `principle-mechanism-diagram`.
- The site runs on more than a dozen distinct icon/illustration systems, not
  one — see `VISUAL-SYSTEMS.md` before building or reusing any icon,
  diagram, or mark, on the site or in an off-site artifact that's meant to
  represent the site's look. Confirm which system actually applies before
  writing SVG; don't default to whichever reference file is closest at
  hand.

## Standing policy: light/dark toggle on every HTML artifact

Any standalone HTML artifact built for this project (options-review pages,
research galleries, mockups) must include a visible light/dark mode toggle
control the user can click — not just automatic `prefers-color-scheme`
detection. Stamp `data-theme="light"` / `data-theme="dark"` on the root
element from the toggle, per the dark-mode token pattern already used across
these artifacts.

## Standing policy: no watermarked images, ever

Every image that goes into this site — now, and in every future session —
must be free of watermarks (stock-site marks, app/platform overlays,
screenshot chrome that isn't part of the actual content) before it's
committed to `mockup/images/` or embedded anywhere on the site.

- Check every new image visually before committing it. If a watermark is
  present, remove it before it goes in — don't ship it and fix it later.
- The user's preferred removal tool is `guillaumemeyer/watermarks-remover`
  on GitHub — attach it with `add_repo` if it isn't already available in the
  session, and use it for the removal step.
- This applies regardless of image source: the owner's own phone photos,
  screenshots, or anything pulled in for reference. Personal photos rarely
  carry watermarks, but check anyway rather than assuming.
- As of 2026-08-16, every image already in `mockup/images/` was checked and
  is clean (5 Airds High School field-session photos). Nothing currently on
  the live site needs remediation.

## Standing policy: no em dashes in site prose, ever

Never write an em dash (—, `&mdash;`, `&#8212;`, or a double hyphen used as
one) into any prose on the site: principle articles, field sessions,
experiment blueprints, captions, diagram labels, nav copy, meta
descriptions, everything a reader sees as a sentence. Write the sentence a
person would actually write instead. There is always a real option, chosen
for what the sentence is actually doing, not applied as a single blind
find-and-replace:

- Two independent clauses where the second is a pivot or reveal: a period,
  making two sentences.
- A clause introducing a list, an explanation, or a definition: a colon.
- A trailing appositive, or a clause before a coordinating conjunction
  (and/but/or/so): a comma.
- A parenthetical aside set off on both sides (`X — aside — Y`): a comma on
  both sides, or parentheses if the aside is a genuine side note.

This was a real defect, not a style nitpick: on 2026-08-19 the owner flagged
an em-dash-heavy passage as reading poorly, and a full audit found roughly
2,000 em dashes across every page on the site (index, principles, sessions,
experiments, reading-the-research), all rewritten with real, sentence-aware
punctuation rather than a mechanical substitution. Two things are not
prose and stay as em dashes: `&mdash;` used as a UI placeholder in an empty
data-table cell (an explicit "no value here" convention, e.g. `<td
class="pct a">&mdash;</td>`), and a `<span class="dash">&mdash;</span>`
flow-diagram connector glyph. Everything else a reader reads as a sentence
gets real punctuation. Before publishing any new page or artifact for this
site, grep it for `&mdash;`, `&#8212;`, and the em dash character itself and
fix anything that isn't one of those two UI exceptions.

## Standing policy: every new or edited page keeps `search-index.js` in sync

`search-index.js` is a separate, hand-maintained array (`SEARCH_INDEX`) that
feeds every predictive-search box on the site (the homepage inline search,
the homepage search band, and the nav-bar search available on every page,
all wired in `script.js`). It is not generated from the pages themselves
except for Principles, which it pulls live from `APPLY_PRINCIPLES`
(`apply-data.js`); every other content type (Science Behind, Field Sessions,
Experiments, Reading the Research, Natural Experiments) is a separate,
manually-added row. Nothing enforces that a new or edited page's entry gets
added here too, so it silently drifts, exactly like the `apply-data.js`
parity trap `behavioural-principle-article` already documents for
Principles, just one level up, across every other content type as well.

On 2026-09-04 the owner asked "Ensure every change means the predictive
search is finding etc" right after a new experiment blueprint shipped. A
parity check turned up 4 pre-existing experiments (`cashback-rank-vs-raw-rate`,
`loan-decline-benevolence-framing`, `printed-vs-digital-member-guide`,
`tax-refund-debt-payoff-spending`) that had been live on `experiments.html`
for a while but were never added to `search-index.js`, so predictive search
could never find them, not because of anything wrong with those pages
themselves, but because the separate index was never touched when they
shipped.

**The rule, going forward.** Whenever a page or artifact is added, renamed,
or given a new anchor id in any of the content types `search-index.js`
covers (a new principle, a new Science Behind entry, a new Field Session, a
new Experiment, a new Reading the Research report, a new Natural Experiment),
add or update its row in `search-index.js` in the same change, not as a
follow-up. A principle only needs its `apply-data.js` entry (`SEARCH_INDEX`
picks it up automatically); every other content type needs its own explicit
row: `{ title, category, url, blurb }`, `category` matching one of the exact
site nav labels (`'Principles'`, `'The Science Behind'`, `'Field Sessions'`,
`'Experiments'`, `'Reading the Research'`, `'Natural Experiments'`, `'Apply
It'`), `url` pointing at the real anchor, and `blurb` a real hook sentence,
not a restated title.

**The check.** Before calling any content addition finished, diff the ids:
for principles, the `section.principle` ids in `principles.html` against the
`id:` values in `apply-data.js` (already documented); for every other
content type, its real anchor ids (`article.sb-entry` in `science-behind.html`,
`article.experiment` in `experiments.html`, etc.) against the
`url: '<page>.html#...'` values in `search-index.js`. A one-line Python or
node diff of the two id sets catches a silent gap immediately; don't trust
memory that both were touched. Then verify at least one new/changed entry
live, by typing a real query into an actual predictive-search box (Playwright
is fine) and confirming the right result appears, not just that the array
entry exists syntactically.

**Adjacent/alternate terminology: the `keywords` field.** A blurb can only
literally contain a few words, but a reader can reasonably search using a
different real term for the same thing: the academic name versus the site's
own headline phrasing (`savings lottery` vs. `prize-linked savings`), a
product's real name (`Save to Win`, `PLSA`), or, for a multi-mechanism entry
like Science Behind (which decodes several principles at once, so the one
hook blurb can't name them all), any one of the specific principles it cites.
On 2026-09-04 the owner asked for exactly this ("adjacent terms so that can
find eg savings lottery vs prize-linked savings"), and an audit of the same
kind the parity check above already runs, this time checking whether each
entry's own cited principle name(s) appear anywhere in its indexed text,
found the gap was real and widespread: all 8 Science Behind entries and 19
Experiments were missing at least one of their own defining terms. Any entry
row in `search-index.js` may carry an optional `keywords: '...'` field
(space-separated terms, never rendered anywhere in the UI, only used for
matching) alongside its `blurb`; `script.js`'s `siteRelevanceScore` checks it
as a fallback at the same tier as a blurb match. Add it whenever an entry's
real, load-bearing alternate names, principle citations, or product names
aren't already substrings of its own title/blurb, rather than distorting the
blurb itself to cram every synonym in. Never invent a synonym that isn't
real, established site or academic terminology, this is the same
citation-honesty discipline as everywhere else on the site, just applied to
search terms instead of quotes.

## Standing policy: no AI writing tics, ever

On 2026-08-22 the owner flagged a sentence in a freshly written experiment
blueprint ("That's a proposed use, not a tested one") as reading like AI,
not like him. He was right: the negation added no information, only false
weight. See the `authentic-voice` skill for the full research (ten
documented hallmarks of AI-generated prose, not just this one), the exact
site audit that followed (102 raw hits reviewed one by one, most kept
because the distinction was load-bearing, five fixed because it wasn't),
and the four-question test to run before calling any sentence finished.
Load that skill before finishing any new prose on this site, the same way
`behavioural-principle-article` gets loaded before a new principle.

## Standing policy: every cross-page reference gets inline-linked in body prose, not just meta

On 2026-09-04 the owner flagged the `home-loan-prize-draw` experiment's own
Theory paragraph: it named &ldquo;Bankwest's real Interesting Rates
promotion&rdquo; and said &ldquo;Probability Weighting is the direct
mechanism&rdquo; as plain text, while the real `<a href>` to those two pages
only lived in `session-meta` and the closing `also-note`. A reader following
the actual argument had no way to click through to the thing being described
at the exact point it was named, only at the top of the page (before they
knew why it mattered) or the bottom (after they'd already read past it).

**The rule.** Whenever an experiment's or Science Behind entry's `Builds
on`/`session-meta` line or closing `also-note` cites another real page on
the site (a principle, a Science Behind entry, a special report), the first
mention of that same thing inside the body prose (Theory, Hypothesis,
Ethics, a `.sb-block`, wherever it's actually named) must carry the real
`<a href>` too, not just the meta line and the closing note. This mirrors
the `search-index.js` sync policy above: a citation living only at the
edges of the piece, never at the place a reader would actually want to
click, is the same class of defect as an entry search can't find, just
applied to navigation instead of discovery.

**The check.** `scripts/check_inline_references.py` (run from the repo
root, no arguments needed) diffs every experiment's and Science Behind
entry's `session-meta`/`also-note` hrefs against its own body prose and
reports any cross-page reference missing an inline link, exits non-zero if
it finds one. Run it before calling any new or edited experiment/Science
Behind entry finished. Running it for the first time found the identical
gap already live on 23 of the site's other 26 experiments (all 8 Science
Behind entries came back clean; `home-loan-prize-draw` was fixed the same
day this was written), a real, pre-existing backlog the script now makes
visible instead of relying on someone re-reading every piece by hand.

## Standing policy: anchor links land under the sticky nav via `:target`, never a new per-class `scroll-margin-top`

On 2026-09-04 the owner reported that anchor links "almost never" land in
the right place, flagging `science-behind.html#macca-golden-deal` as a
repeat offender even after an earlier fix that session. Root cause turned
out to be two separate defects, not one:

1. Every content-type class (`.principle`, `.session`, `.experiment`,
   `.sb-entry`, `.report`, etc.) carried its own hardcoded
   `scroll-margin-top: 136px`, copied from class to class as each new
   content type shipped. That constant was tuned once for the desktop nav's
   real height and never revisited for mobile (measured at 80px, not 136),
   and it depended on someone remembering to add it to every new
   class. `index.html`'s `#search-band`, `#newsletter`, `#find-your-start`,
   and `apply.html`'s `#tool` had no such rule at all.
2. `html { scroll-behavior: smooth }` was global. That applies to the
   browser's own native jump-to-fragment on a hash change, not just to
   explicit JS calls, so it raced this site's own corrective positioning in
   `script.js` (`openTargetPrinciple`). Instrumented testing (repeatedly
   navigating to the same in-page anchor and reading `getBoundingClientRect()`)
   found this landed on the wrong element roughly 3 times out of 5 on a
   same-page hash change (clicking a cross-link while already on the
   destination page, or a predictive-search result), while a fresh page load
   was mostly fine. Flakiness, not a clean reproducible failure, is exactly
   why it kept resurfacing across "fixes" that only ever tested page load.

**The fix.** `styles.css` now sets `[id]:target { scroll-margin-top:
var(--nav-h); }`, and `script.js` measures the sticky nav's real height on
load, resize, and orientation change and writes it to `--nav-h` on the
root element. `:target` matches whichever element the URL fragment
currently points at, so this applies correctly to every anchor destination
on the site, present and future, without a new content type ever needing
its own `scroll-margin-top` rule again, and without the constant ever
drifting from the nav's actual size on any device. `scroll-behavior:
smooth` was removed from `html` entirely; the two places that want an
animated scroll (the rail-nav step clicks, the landing-hub category jump)
already request `behavior: 'smooth'` explicitly on their own
`scrollIntoView()` calls, which is unaffected by the global default and
keeps working.

**The check.** Before trusting an anchor-link fix on this site, don't just
load the target URL once and eyeball it. Test a same-page hash change too
(navigate to the page, then set `location.hash` again to a different
anchor on it, the way a real cross-link click behaves), and run it several
times in a row. A race condition like this one passes most single
attempts and only shows up on repetition.

**A third, separate root cause, found the same day on a real phone.**
After the two fixes above shipped, the owner reported the exact same URL
(`science-behind.html#macca-golden-deal`) still landing wrong on a real
device, this time on a completely different article's content (Up Bank's
`sb-split` block, the entry immediately before macca-golden-deal), not
just a wrong offset within the right one. None of the site's 108 local
`<img>` tags carried `width`/`height` attributes, so the browser had no
reserved size for any of them before they loaded. `up-bank-teardown` alone
has 5 real screenshots above macca-golden-deal; a lazy-loaded image
finishing its load after the page had already jumped to the anchor pushes
everything below it down by its own height, which lands the viewport
short of the real target by roughly however much unloaded image height
sat above it. This could not be reproduced in this environment's Chromium
(its built-in scroll-anchoring quietly compensates for the shift even
under artificial network throttling), which is exactly why it wasn't
caught by the same-page hash-change test above and needed a real device to
surface. The fix: every local image's real pixel dimensions were read and
written into its own `width`/`height` attributes, site-wide, so the
browser reserves the correct box before the image loads and nothing
shifts under a landed anchor regardless of which browser's scroll-anchor
implementation is or isn't compensating for it. Any new image added to the
site should carry real `width`/`height` attributes from the start, not
rely on this being re-run later.

**A fourth defect, this attribute pass itself caused: any CSS rule that scales an image's width to a percentage needs an explicit `height: auto` alongside it, once every image on the site carries real `width`/`height` attributes.** Those attributes map to a low-specificity `height:<px>` hint in the browser's own stylesheet; without `height: auto` in this site's own CSS to override it, an image renders at its literal unscaled pixel height while its width shrinks to fit, a severe vertical stretch. `.spotted-item img` in `styles.css` had exactly this gap (`width: 100%` with no height rule), silently stretching every real-screenshot image on the site (GoDaddy, CommSec, Apple Returns, McDonald's, Up Bank, Bankwest) until the owner caught it on a real phone screenshot on 2026-09-04. `scripts/check_image_aspect_ratio.py` now lints every image-scaling CSS rule for this gap; run it after any change to `styles.css` that touches an image-bearing component, and see `spotted-in-the-wild`'s own failure-mode writeup for the full incident.

## Standing policy: never assume a component has "enough room" from viewport width alone, measure the actual container

On 2026-09-05 the owner flagged the "Experiment Teardown" flow-diagram (the Control-vs-Medium/Treatment condition comparison used across 18 places in `principles.html`, `sessions.html`, `savings-lottery.html`, `small-sample-big-claim.html`, and `the-fine-print-nobody-reads.html`) as "very crowded in mobile," with a real phone screenshot showing a `100 pts` badge running directly into `pistachio` with no space between them, and a result table's `MEDIUM`/`SWING` headers and percentage figures clipped at the right edge. `.flow-branches` (the CSS class laying the two condition cards side by side) had been `display: flex; flex-direction: row` since it was first written, at every viewport width, with no stacked mobile layout ever added. Measuring the actual rendered width live (Playwright `getBoundingClientRect()`, not a guess from the viewport size) found each condition card was rendering at **91.5px wide on a 393px phone, and only 114-137px wide even on a 1100px desktop window**: `.flow-branches` lives inside `.rail-content`, a deliberately narrow reading column (see the sticky-rail component) that stays roughly 190-380px wide regardless of viewport, because the whole rail-scroll layout is capped for readability, not because the browser window is narrow. A `min-width` media query keyed to viewport width would have been the wrong fix here, since the real constraint was the container's own width, which doesn't track viewport width in any simple way once a sidebar layout is in the mix.

**The check.** Before assuming a `min-width` media-query breakpoint will give a component "enough room" once the viewport passes some threshold, measure the actual container the component lives in at several real viewport widths (Playwright `getBoundingClientRect()` on the live rendered page, not CSS read statically), not just the viewport itself. A component nested inside a narrower parent (a rail-content column, a sidebar-adjacent grid cell, a modal) can be capped well below the viewport width at every breakpoint, in which case the fix is to stop trying to fit side-by-side content into it at all, not to tune a breakpoint number.

**The fix, in practice.** `.flow-branches` now stacks vertically (`flex-direction: column`) at every width, full stop, no responsive row layout, since no real viewport ever gave it genuine side-by-side room. The two condition cards read fine stacked, matching the flow-diagram's own already-vertical narrative (start, split, branches, result). Separately, the result table's decorative arrow column (a bare "→" between the two percentage columns, carrying no information the colour-coded columns and delta didn't already show) was permanently hidden, its condition-icons removed from the table header specifically (redundant with the header word's own colour), and its type sizes and paddings tightened, closing the crowding from 39px of real overflow down to roughly 15px, small enough that only the least-important column (the delta figure, already redundant with the two full percentages shown beside it) needs a short horizontal scroll on the narrowest real phones. Verified on all 5 affected files at 375px, 393px, and 1400px before shipping; see `scripts/check_image_aspect_ratio.py`'s sibling check for the img version of "don't trust a breakpoint number, measure the real container."
