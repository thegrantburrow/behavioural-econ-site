# Field Notes — Project Brief

## What this is
A website about applied behavioural economics — showing how behavioural science
principles show up in real consumer moments (retail signage, app notifications,
subscription pricing, menus, shopfronts). Built from the owner's own photos of
real examples encountered in daily life, plus original research/case studies.

**Mission statement (hero copy, locked):**
> "You're already doing behavioural economics. Probably without knowing it.
> And probably doing it badly."
>
> Follow-up line: "This is a field guide to the forces already shaping how
> people decide — so you can use them deliberately, not by accident."

## Tech stack (decided, not yet built)
- **Framework:** Next.js, hosted on **Vercel** (auto-deploys from this GitHub repo)
- **CMS:** Sanity.io (free tier) — for managing posts/case studies/photos without code
- **Newsletter:** Beehiiv (free up to 2,500 subs) — better fit than ConvertKit for a
  polished, photo-led site
- **Repo:** github.com/thegrantburrow/behavioural-econ-site (created, cloned locally)

## Design system
- **Palette:** ink `#1C1A17` (not pure black), terracotta `#B2472B`, mustard
  `#D9A441`, teal `#2A6660`, cream `#F5F0E8`. Bellroy-inspired restraint — NOT neon,
  NOT gaudy. Bold colour used in confident blocks (Unloan-style), not just accents.
- **Type:** Georgia/serif for headlines (editorial, has character), system sans for
  body/UI. No monospace anywhere — earlier drafts used mono for labels, explicitly
  rejected as "typewriter/bad."
- **Aesthetic references:** Bellroy (restraint, photography-led, warm neutrals),
  Unloan (bold colour blocks, dynamic layout), Vox (editorial illustration),
  New Yorker cover illustration (flat/detailed vector scenes, NOT simple icons)

## Site is now two pages, not one (`index.html` + `principles.html`)

Every earlier iteration of the homepage (single icon-grid nav → categorised
Contents chips + inline lists → collapsed-by-default accordions) was still
fundamentally trying to make one page do two jobs: pitch the site *and*
be a comprehensive index of 36 things. No amount of compacting individual
rows fixes that — a page whose job is "list all 36 principles" will always
read as "a list of everything," collapsed rows or not. The actual fix was
to stop trying to do both on one page.

**`index.html` (homepage)** — a pitch, not an index:
1. Hero — mission statement
2. About/lede
3. Compact inline newsletter signup (`.newsletter-inline`)
4. **Featured** (`#featured`) — 6 hand-picked principles as preview cards
   (icon, title, one-line definition, link to the full entry on the
   archive page) — chosen for topic spread across all 6 themes and
   strength of content (real photos and/or Experiment Teardowns where
   possible): Anchoring, Decoy Effect, Zero Price Effect, Social Proof,
   Medium Maximization, Sludge
5. A search box (submits to `principles.html?q=...`, which pre-fills and
   auto-applies the filter on load) plus a plain "Browse all 36
   principles →" link — both lead to the archive page, they just serve
   people who already know what they want (search) vs. people who want to
   browse (browse-all)
6. **More ways in** (`#reports-row`) — the 3 special-report callouts,
   redesigned (see below)
7. Reading the Research / Ethics of Not Experimenting (full long-form
   content, unchanged, still live here) / Explore / About / full
   newsletter signup / footer

**`principles.html`** (new page) — the actual index, allowed to be long
because that's its whole job:
1. Page intro + a prominent search input (`#principlesSearch`, live
   client-side filter, no page reload)
2. Category filter chips — same visual language as the old Contents tabs
   (`.toc-tab`), now with an "All" option added (7 total, grid bumped to
   `repeat(4,1fr)` / `repeat(7,1fr)` at wider breakpoints to fit)
3. **One single list of all 36 principles** — each the same collapsed-by-
   default `.principle-details` accordion built earlier, now tagged with
   `data-theme="..."` for filtering. Critically, this is the *only*
   representation of the 36 principles left anywhere on the site — the
   old design had two (a compact Contents link + a full section further
   down); collapsing that duplication down to one list, filtered in place
   by search/category, is what actually killed the "menu lists so many
   things, then you have every single symbol and principle again" feeling.

Filtering logic (`script.js`): search text and the active category chip
combine (`AND`) over the same 36 rows — `row.hidden` toggled directly,
no swap-between-panels indirection. `?q=` in the URL (set by the
homepage's search form via a plain GET) is read on load and applied
immediately, so the homepage search box and the archive page's own search
box are really the same feature with two entry points.

Cross-page links: anywhere the homepage links into principle content, it's
`principles.html#slug`; anywhere the archive page links back to homepage-
only sections (nav, footer, "see also" references from the reports into
principles — wait, those go the other direction, from a report *on* the
homepage into a principle *on* the archive page, so those became
`principles.html#slug` too), it's `index.html#slug`. Same-page anchors
(a principle's own "see also" link to another principle) needed no change
since both sides moved to `principles.html` together.

**Special reports, redesigned as an equal row of 3** (`.reports-grid` >
`.report-card`): previously three different full-saturated-colour blocks
(teal / mustard-black / white) stacked vertically with no shared visual
logic — flagged directly as "look random." Fixed with the same card
template for all three (white background, same border/radius/padding) and
a thin colour-coded top border as the *only* differentiator (teal /
mustard / terracotta) — reuses the accent-bar language already established
for `.article-hook` and `.newsletter-inline` rather than inventing a new
treatment. Laid out as an actual 3-column grid at 760px+, stacked on
mobile.

~~Superseded~~: the "See it in practice" icon grid (removed once
redundant with Contents — see prior note in git history) and the 6-tab
Contents-chips-swap-inline-lists component (removed and replaced by the
archive page above) both no longer exist. `.toc-tab`/`.toc-tab-label`/
`.toc-tab-count` CSS survives and is reused for the archive page's filter
chips; `.toc-panel`, `.toc-list`, `.toc-extra*`, `.toc-changed-*`,
`.practice*` were all dead code after this change and have been removed
from `styles.css`.

## The 5 launch principles (final, precisely researched)
Originally 6 were drafted; two were merged after realising they illustrated the
same underlying mechanism. **Do not re-split these:**

1. **Anchoring** — real photo: "Super Deal" retail sign, $399.99 next to a
   struck-through $1,349.99 RRP.
2. **Sludge (Obstruction)** — real photo: a subscription cancellation flow showing
   a "before you go" retention offer. Precise terms: **Sludge** is Thaler &
   Sunstein's term for friction added against the user's interest; **Roach Motel**
   is the dark-pattern category (easy in, hard to leave); **Obstruction** is the
   specific mechanism (interrupting a cancellation with a retention offer) — this
   is one of six dark patterns the FTC charged Amazon with in its 2023 Prime
   lawsuit, and is now directly targeted by the FTC's "Click-to-Cancel" rule.
   NOT loss aversion — that was the original (wrong) label.
3. **Zero Price Effect** — real photo: app push notifications offering FREE items,
   not discounts.
4. **Decoy Effect (Asymmetric Dominance)** — TWO real photos in one section: (a) a
   subscription pricing screen where "Best Value" is actually the *cheapest*
   option, not the middle one (so it's not really "medium maximisation," which was
   the original wrong label), and (b) a gelato menu's scoop-size ladder
   (Single/Double/Triple). Academic source: Huber, Payne & Puto (1982). Classic
   illustration: Ariely's Economist subscription study.
5. **Operational Transparency** — real photo: a fry shop's fully open glass
   kitchen with "HAND CUT FRIES" signage — watching the work happen increases
   perceived value.

## Second expansion: 36 → 42 principles

Six more added in one pass: **Mental Accounting**, **Endowment Effect**, **IKEA
Effect**, **Ostrich Effect**, **Order Effect**, **Shooting the Messenger**
(breaking bad news). All follow the standard 7-section article structure and
were researched the same way as every other principle on this site — primary
source found and verified via search first, numbers only stated where they
could actually be confirmed.

**"Order Effect" is deliberately distinct from the existing "Ordering
Effects,"** not a duplicate — the two are cross-linked both directions so the
difference is explicit wherever either appears. **Ordering Effects** (Miller
&amp; Krosnick 1998, ballot position) is about which item gets *selected* from
a set by its position in it. **Order Effect** (Asch 1946, trait-list
reversal) is about how the order information *arrives in* changes the
*judgement* of a single target, independent of any choice between options.
Same underlying "position matters" family, different mechanism and different
underlying study — worth keeping separate rather than merging, unlike the
one deliberate 6→5 principle merge noted above.

**Only one of the six got a full Experiment Teardown: Mental Accounting**
(Kahneman &amp; Tversky 1984's lost-ticket-vs-lost-cash vignette, n=383,
46% vs. 88%). The other five hit the same wall documented below for the
original 36 — real, well-corroborated findings, but exact figures
(reservation-price gaps, willingness-to-pay means, login-frequency deltas,
likability ratings) sat behind sources this research pass couldn't reach:
- **Endowment Effect** (Kahneman, Knetsch &amp; Thaler 1990): the mug
  experiment's reservation-price gap is real and replicated, but the exact
  dollar figures varied across the paper's several internal trials rather
  than landing on one number — used the plain strength/weakness format and
  said so directly rather than picking one trial's number and presenting it
  as *the* finding.
- **IKEA Effect** (Norton, Mochon &amp; Ariely 2012): got one solid number
  pair (liking ratings, builders M=3.81 vs. non-builders M=2.50) but not
  exact willingness-to-pay figures — used what was verifiable, didn't invent
  the rest.
- **Ostrich Effect** (Karlsson, Loewenstein &amp; Seppi 2009) and **Shooting
  the Messenger** (John, Blunden &amp; Liu 2019): direction and mechanism are
  well corroborated across independent summaries; no specific percentages or
  rating values could be confirmed this pass, so none are stated.

All five say exactly this in their own methodology-critique "Weakness" field
— the site's honesty standard applies the same way to new principles as it
did to the original 19 that didn't qualify for a Teardown.

**Every count on the site that depended on 36 was propagated, not just
the principle list itself**: both pages' hero/heading copy, the search
placeholder and "browse all" link, the category filter chip counts
(Judgment &amp; Memory 10→12, Pricing &amp; Value 6→8, Social Influence
3→4, Motivation &amp; Goals 5→6 — Choice Architecture and Friction &amp;
Transparency unchanged), the five journey-stage counts in `script.js`
(awareness 5→6, consideration 13→15, conversion 14→16, retention 11→15,
advocacy 3→5), and the hand-curated grouped/sequence lists inside each of
the five stage-view panels — every new principle's `data-stages` tag was
individually threaded into the matching panel(s), not just counted. Verified
programmatically after editing (counting actual `data-stages`/`data-theme`
attributes in the rendered HTML) rather than trusting the arithmetic by eye.

## Third expansion: 42 → 43 — Symbolic Rewards

One more, on request, specifically built around the Wikipedia "barnstar"
field experiment plus a second corroborating study, per the same research
discipline as everything else on the site:

- **Primary study, full Experiment Teardown**: Restivo, M., &amp; van de
  Rijt, A. (2012), "Experimental Study of Informal Rewards in Peer
  Production," *PLOS ONE*, 7(3), e34358 — a randomised field experiment on
  200 real Wikipedia editors (100/100 split), none previously awarded a
  barnstar. Receiving one — a purely honorific badge, no monetary value —
  raised edit volume 60% over the following 90 days, and made recipients
  six times more likely to be awarded a further barnstar by someone else
  (12/100 vs. 2/100). Both figures are exact and independently
  corroborated across multiple sources, unlike most of the second-
  expansion principles above, so this one got the full Teardown treatment
  the others didn't.
- **Also worth citing** (the "and others" the request asked for): Kosfeld,
  M., &amp; Neckermann, S. (2011), "Getting More Work for Nothing? Symbolic
  Awards and Worker Performance," *American Economic Journal:
  Microeconomics*, 3(3), 86–99 — a field experiment with *paid* workers on
  a real data-entry task, told in advance that top performers would get a
  purely symbolic congratulatory card. Performance rose ~12%, corroborating
  the same mechanism in a compensated workplace rather than a volunteer
  community — deliberately a different population from the barnstar study,
  not a repeat of it.

**Deliberately distinguished from the existing Medium Maximization**, not
folded into it, and cross-linked both directions so the difference is
explicit wherever either principle appears: Medium Maximization is a token
that *stands in* for a real reward and gets over-optimised for its own sake
(the ice-cream/points study); Symbolic Rewards is a token with *no* exchange
value at all that still motivates purely through recognition. Same
"non-cash reward" family, different mechanism — same reasoning already
applied when keeping Order Effect separate from Ordering Effects.

Theme: Motivation &amp; Goals (6→7). Stages: retention (15→16), advocacy
(5→6). Propagated everywhere 42 appeared, plus a real gap caught and fixed
along the way: Mental Accounting's Teardown (added in the prior expansion)
had never actually been added to the homepage's Experiment Teardowns
report-card list or its proof-strip count — found by counting actual
`.flow-tag` occurrences in the rendered HTML rather than trusting the
number already on the card, which is exactly the kind of drift this
verify-programmatically habit exists to catch.

## Illustration approach — lessons learned (important, read before redoing work)
Several rounds of hand-coded SVG illustration were attempted and rejected:
- Pure icon/diagram style: rejected as "not real illustration"
- Painterly/photorealistic SVG: technically impossible with hand-coded vector
  graphics — this is a hard ceiling, not a skill issue
- Flat New Yorker-cover-style **invented scenes** (metaphorical, not tied to the
  actual photos): rejected — must be recognisably the actual photographed scene
- Flat New Yorker-style **faithful redraws** of the actual photos: accepted as
  the right direction, but hand-drawn human figures kept coming out anatomically
  wrong (self-intersecting SVG paths causing stray black shapes, unrecognisable
  proportions) even after 6 rounds of iterative fixing

**Current direction (in progress when this brief was written):** abandon manual
SVG tracing. Use **automated photo-stylisation filters** instead (OpenCV: bilateral
filtering + adaptive threshold edge detection + k-means colour quantisation,
similar to how Prisma-style apps work) applied directly to the real photos —
this preserves real human proportions/detail because it starts from the actual
photo. Three filter directions tested and liked in principle (classic cartoon,
posterised flat-colour, ink linework); vibrant colour version of the "classic
cartoon" variant (bilateral filter + edge overlay, saturation boosted on the
source before filtering) was the strongest result so far. The posterised and
ink-linework variants need their colour pipeline fixed (boost saturation
*before* k-means quantisation, not after, or they collapse toward sepia).

This is why the **eachlabs style-transfer skill** is being installed — to get
genuine AI-based style transfer rather than OpenCV approximations.

## Photos already collected (in original chat, need to be re-uploaded/sourced)
- Super Deal retail sign (anchoring)
- Subscription cancellation "before you go" screen (sludge)
- FREE item push notifications, KFC/McDonald's (zero price effect)
- Subscription pricing tiers screenshot (decoy effect, photo 1)
- Gelato shop menu board, scoop sizes (decoy effect, photo 2)
- Hand Cut Fries open-kitchen shopfront (operational transparency)
- A gelato counter interior shot (Lunetta) — used as the test subject for the
  illustration-style iteration work; two staff members serving, one with
  glasses/ponytail standing upright, one bent forward into a low tub, a
  sharp-focus hand reaching in from the foreground

## "Experiment Teardown" pattern — design rules (read before adding another)

A reusable component inside a principle's `.study-card`, showing exactly how the
underlying study was run — visually, not as prose. Named **"Experiment Teardown"**
(rejected names along the way: "How the study was actually run" as plain text,
"What Changed" — both read as too generic/prose-y once seen on the page).

Structure (`.flow-diagram` in styles.css), in order:
1. **Recruited** — one node, participant count, people icon.
2. **The split badge** (`.flow-split-badge`, mustard pill) — names the ONE
   manipulated variable in plain words, e.g. "Only a points system was added."
   This is stated before the branches so the reader knows what to look for
   going in, not just in hindsight.
3. **Two branches** (`.flow-path`, terracotta top-border for condition A / teal
   for condition B) — each a tag label + the exact stimuli shown to that group.
4. **Result** — a comparison table (`.result-table`), NOT grouped-by-condition
   bar stacks (tried that first, it forces the reader to jump between two
   separate blocks to compare the same product/outcome across conditions —
   rejected). Rows = the outcomes being compared (e.g. each product, or each
   measured behaviour); columns = condition A / arrow / condition B / swing.
   Condition-A numbers coloured terracotta, condition-B teal (matching the
   branch colours), and a mustard "swing" badge per row showing the delta
   (e.g. "+28") so the direction and size of the effect is legible at a
   glance without doing the subtraction yourself. Read exact numbers off the
   source paper/figure — never estimate or invent them. If only a test
   statistic is reported (e.g. a chi-square) and the source has a results
   figure, render the actual PDF page as an image (pymupdf `get_pixmap()`
   works even when poppler-utils isn't installed) and read the bar heights
   directly rather than leaving the finding unquantified.
5. **One bolded insight line** (`.flow-insight`) — a single sentence, not a
   paragraph.
6. **Two validity badges** (`.v-badge.internal` / `.v-badge.external`) — one
   sentence each, not the old paragraph-length strength/weakness writeup.

**Universal control/treatment symbols** (`.condition-icon`, 13x13, ALWAYS present —
this is the one that actually scales to every future teardown, unlike the
product-specific icons below which only apply when the study happens to have
nameable comparable items). Two fixed symbols, reused unchanged regardless of
topic:
- Control/baseline condition (path-a, terracotta): a plain outline circle.
- Treatment/manipulated condition (path-b, teal): the same circle with a
  small plus inside it — a "something was added" mark.
Place both inline before the label, everywhere that condition is named: the
branch's `.path-tag` AND the result table's column header (`th.col-a`/
`th.col-b`). `stroke="currentColor"` so each inherits its branch's colour
automatically from the existing `.path-a`/`.path-b`/`.col-a`/`.col-b` CSS —
don't hardcode the colour on the icon itself.

**Branches sit side-by-side even on phone width** — no vertical stacking
breakpoint. Within each branch, when a condition has a multi-part sequence
(e.g. task → medium → outcome), use CSS Grid (`.step-rows`, `display:contents`
on `.step-row` so its `<span>` children become direct grid items), with the
**same `grid-template-columns` definition shared by both conditions** — this
is what actually delivers "the thing that changed visually stands out": fixed
first/last columns keep the outer values (time, outcome) pinned to the same
x-position in both branches, and only the manipulated-variable column (fixed
width, but its content varies — a dash vs. a value) is where the eye lands on
a difference.

**This breaks on real phone widths (~375-390px) if not actively verified** —
squeezing two full condition cards plus a 3-5 column grid into that space is
tight enough that it broke twice while building it (content overflowing the
box edges; then, after fixing overflow, a long word like "pistachio" breaking
mid-word). Both were invisible in the desktop-width preview and only showed
up on an actual narrow render. **Don't ship a layout change to this component
on the strength of the desktop artifact preview alone** — render it
headless at ~390px and screenshot the specific section before pushing:
```python
# playwright is available; chromium lives at /opt/pw-browsers/chromium
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    page = b.new_page(viewport={'width': 390, 'height': 1200})
    page.goto('file:///path/to/built/preview.html')
    page.eval_on_selector('#some-principle details.article', 'el => el.open = true')  # it's collapsed by default
    page.locator('#some-principle .flow-diagram').screenshot(path='check.png')
```
Fixes that got it working at 390px: `min-width: 0` at every flex/grid
nesting level in the chain (`.flow-path`, `.flow-step`, `.step-rows`) —
flex/grid items default to a content-based minimum width that silently
overrides an ancestor's `flex: 1` and forces overflow; the last grid column
needs `minmax(0, 1fr)`, not bare `1fr`, for the same reason; and
`overflow-wrap: break-word` on the outcome cell as a safety net once space
is genuinely tight. Beyond the CSS fixes, actually reclaiming width mattered
just as much: drop decorative icons that aren't load-bearing at this size
(the leading tag icon inside a multi-row branch), abbreviate labels where
the full word isn't essential ("6 min" → "6m"), and trim padding/gaps
throughout the component — a few px removed from five different places adds
up faster than any single "big" fix.

**Micro-icons for the specific options being compared** (`.flavor-icon`, 14x14,
inline before the label, wherever that label appears — branch step text AND
table row-labels): every option/outcome in the study gets one small hand-drawn
icon, reused consistently everywhere its name shows up. Two sub-rules for
picking the icon itself:
- If the two options are the *same kind of thing* (two ice cream flavours,
  two sizes, two colours), draw ONE shape and vary only the fill colour —
  see vanilla/pistachio (cone+scoop shape, mustard vs. teal fill).
- If the two options are *different real objects* (a Hershey's Kiss vs. a
  Lindt truffle), draw two different simple silhouettes instead of forcing
  one shape — see Hershey's (teardrop/kiss shape) vs. Lindt (round truffle
  with twisted wrapper ends). Don't reuse the condition colours (terracotta/
  teal) for these — that pair is reserved for condition A/B throughout the
  diagram; product icons get a single neutral terracotta accent detail
  instead, consistent with the site's general icon convention (outline +
  one terracotta accent), so the two colour systems don't collide.

Critical layout rule — **row parity**: the two condition branches must wrap
to the same shape. If one condition's content is inherently longer (e.g. a
medium/token condition has an extra step — task → token → outcome — that the
control condition skips), don't just append a parenthetical explaining the
absence; restructure BOTH sides into the same fixed-column row grid
(`.step-rows`/`.step-row`), using an em-dash (`.step-cell.dash`) as the
placeholder on the side that lacks that step. Same column count, same row
count, both sides — so the manipulated variable is not just named and
highlighted, but occupies the exact same visual position in both branches,
making the comparison scannable at a glance rather than read as two
differently-shaped paragraphs.

The manipulated variable gets highlighted (`.diff-highlight`, mustard) at
its exact location inside the branch that has it — never just described in
the badge alone. Three reinforcing layers: named in the split badge, marked
inline in the branch, shown as a bar in the result.

**Desktop/wide-viewport treatment — there is no "growing into desktop"
for this component.** `.article-body { max-width: 62ch; }` is a pre-existing
site-wide typography rule that caps `.flow-diagram`'s rendered width at
~518px permanently — confirmed by direct measurement, identical at 1100px
and 1600px viewport widths. So the approach is NOT "give the grid bigger
tracks at a wider breakpoint" (tried that first with a naive
`@media (min-width: 480px)` bump to `grid-template-columns`; re-measuring
the actual computed column widths afterward showed the outcome column
still resolved to ~35px — far too narrow for "pistachio" — because 5 grid
tracks plus 4 gaps is inherently too many discrete segments for a
permanently-capped ~518px width, no matter how generously each track is
sized). The real fix at any width is to reduce the *track count*, not
enlarge it: `.step-rows` went from 5 tracks (time / arrow / mid / arrow /
outcome) to 3 (time / mid / outcome), with each arrow moved from being its
own grid column to a `.cell-arrow` span living *inside* the time cell and
the mid cell (`.step-cell` is `display:flex` internally, so the arrow sits
right after that cell's content without needing its own track or gap).
That alone reclaimed enough width for the outcome column to comfortably
fit "pistachio" at both mobile and the 62ch desktop ceiling. What a wider
viewport *does* still buy this component: room to stop abbreviating ("6
min" instead of "6m", via a `.lbl-short`/`.lbl-full` pair toggled at
`min-width: 480px`) and more generous padding/font-size/icon-size — real
breathing room, just not a growing grid.

Applied so far (7 of 36): Zero Price Effect, Medium Maximization, Choice
Overload, Ordering Effects, Social Norm, Peak-End Rule, Tradeoff
Transparency. All linked from the "Experiment Teardowns" report card on the
homepage (`#experiment-teardowns`) and from a top-nav link — promote more
principles into that list as they get the treatment, don't build a new
index each time.

**Tradeoff Transparency's citation was replaced, not just supplemented.**
It originally cited Thaler, Sunstein & Balz (2013) — the RECAP disclosure
proposal, explicitly excluded from Teardown consideration above as "a policy
proposal chapter, not one experiment." That's still true of that source; it
was swapped for a real controlled field experiment that actually tests the
same idea: Buell, R. W., & Choi, M. (2025), "Improving Customer
Compatibility with Tradeoff Transparency," *Management Science*, 71(2),
1335–1355 — a randomised field experiment (n=393,036) run inside
Commonwealth Bank of Australia's real credit card acquisition funnel
("The Good and the Bad," also documented as HBS Case 619-018). Take-up was
statistically unchanged, but customers shown each card's drawbacks
alongside its benefits went on to spend 9.9% more per month, cancel 20.5%
less, and make late payments less often. The result table shows relative
swings only (no absolute baseline figures were available), so both
condition-A cells use an em-dash rather than an invented baseline number —
consistent with the site's own "never estimate, round loosely, or invent"
rule.

New principles get this by default going forward (per earlier scope
decision); the other 30 existing articles keep their plain strength/weakness
format unless specifically flagged for a retrofit.

### Why only 6 of the 25 structurally-eligible principles got one

Went through all 36 principles looking for more Teardown candidates. Two
separate filters apply, and it's worth keeping both explicit for next time:

**Filter 1 — does the study even have the right shape?** The Teardown
format depicts a controlled comparison: one population, split into two
conditions by a single manipulated variable, with a measurable outcome in
each. 9 principles were excluded here regardless of number availability,
because the underlying research isn't that shape and forcing it would
misrepresent what was actually done: Sludge (an audit/crawl, no control
group), Tradeoff Transparency (a policy proposal chapter, not one
experiment — true of the citation it had *then*; superseded by a real
field experiment, see below), Illusion of Explanatory Depth (single-group before/after, not
two conditions), Noise (test-retest reliability — no manipulation at all),
Salience (a theoretical model tested against existing data, not one field
experiment), Chunking (a synthesis of many older studies), Pain of Paying
(theoretical/synthesis paper), Survivorship Bias (historical reconstruction,
no participants), Take-the-Best Heuristic (a computer simulation, not human
participants).

**Filter 2 — can the exact numbers actually be verified?** Of the 25
remaining principles that do have the right experimental shape, real
numbers were pulled via 4 parallel research passes (WebSearch only — direct
PDF fetching was blocked for every academic domain tried: JCR, PNAS,
ScienceDirect, PMC, NBER, even Wikipedia, across all 4 attempts). Only 6
came back with numbers solid enough — consistent across independent
sources, not self-contradictory, not plausibly confused with a different
paper by the same authors — to meet this site's standing "never estimate,
round loosely, or invent" rule. The other 19 hit real, specific problems:
- **No number surfaced at all**, only qualitative direction: Framing Effect,
  Not Enough Choice, Illusory Truth Effect, Hindsight Bias, Zero Price
  Paradox, Translating Information.
- **Numbers found but flagged as likely belonging to a different paper**
  by the same or adjacent authors (a real misattribution risk, not just a
  minor gap): Goal Gradient (risk of conflation with Nunes & Drèze 2006),
  Compromise Effect (risk of conflation with Simonson & Tversky 1992),
  Decoy Effect (conflicting secondary numbers, unclear which experiment),
  Emergency Reserves (risk of conflation with a related 2019 paper by the
  same authors), Precision Effect (conflicting sample sizes across sources,
  possible wrong-paper attribution).
- **Only half the comparison verified** (one condition's number found, the
  other not): Illusion of Control ($8.67 confirmed for the chose-own-ticket
  condition; the assigned-ticket condition's figure could not be confirmed).
- **Directly conflicting numbers between independent sources** for the same
  figure: Choice Bracketing (48% vs. 50%), Social Proof (Gini coefficients
  simply not recoverable via search at all).
- **Structural mismatch discovered only after finding the numbers**:
  Default Effect had usable numbers (84% / 96%) but they come from two
  different natural experiments in the same paper, not two arms of one
  controlled comparison — using them side-by-side would overstate how
  clean the causal comparison is, so it was left out despite having real
  numbers in hand.
- Left Digit Bias, Operational Transparency, Behavioural Labels, and
  Similarity Effect all had partial/directional confirmation but gaps
  (exact threshold figure, exact means, or which-study attribution) large
  enough not to clear the bar.

None of this means these 19 studies lack real numbers — almost all of them
almost certainly report exact figures in their actual tables. It's a
tooling limit of this research pass (no PDF access), not a verdict on the
research. Revisit any of them if primary-source access becomes available
(institutional login, uploaded PDF, or a session with unrestricted
fetching) — the citations, conditions, and what to look for are already
captured in each principle's existing article text.

**One correction made along the way**: Peak-End Rule's Teardown required
splitting the citation. The "extended procedure with a milder ending"
condition — the actual RCT the Teardown depicts (n=682) — is a *separate*,
later paper (Redelmeier, Katz &amp; Kahneman, 2003) from the one originally
cited on this principle (Redelmeier &amp; Kahneman, 1996, which established
the foundational n=154/n=133 peak/end-vs-duration correlation but did not
itself contain a randomised "change the ending" trial). Fixed by making
the 2003 paper the Teardown's primary citation and moving 1996 to an
"Also worth citing" note explaining what it established. The site's own
excerpts had been describing the 2003 finding as if it were "a follow-up
condition" within the 1996 paper — worth flagging since it's exactly the
kind of same-authors-different-year mix-up this whole verification pass
was designed to catch.

**A layout bug the longer condition names exposed**: Peak-End Rule's
"Standard"/"Extended" condition labels plus its more verbose row labels
("Final-moments pain (0–10)", "Overall retrospective rating (0–10)") were
enough to overflow `.result-table-wrap`'s fixed width at mobile — the
Swing column got pushed out of view rather than clipped visibly, which is
worse than a wrapping label since nothing looks obviously broken until you
measure it. Fixed by shortening the row labels ("Final pain", "Overall
rating") rather than changing the table's CSS — the existing two Teardowns
had gotten away with longer condition words only because their row labels
happened to be short single words ("Hershey's", "Lindt"). Worth checking
`result-table-wrap` scrollWidth vs. clientWidth specifically (not just
eyeballing a screenshot) on any future Teardown with multi-word row labels.

## "Article teaser" pattern — applied site-wide to all 42 principle articles

Every `<details class="article">` (the collapsed "Read the research" section)
now shows a 4-line preview of its opening sentence before the reader clicks,
framed as one bordered card, instead of the toggle being the only visible
thing. Structure, inside `<summary>` (the only child of `<details>` that
stays visible while closed — this is why the teaser has to live there and
not in `.article-body`):
```html
<summary>
  <div class="article-hook">
    <div class="teaser-fade"><p class="teaser-text"><b>The psychology.</b> {first sentence(s) of the article's opening "The psychology" paragraph, verbatim}</p></div>
    <div class="summary-row"><span class="article-tag">Article</span> The full write-up — study, numbers, and caveats <span class="chev">›</span></div>
  </div>
</summary>
```
`.article-hook` wraps both pieces in one `.study-card`-style bordered box
(`background: var(--card); border: 1px solid var(--line); border-radius:
12px; padding: 16px 18px`) — this was a deliberate fix after an initial
version that put the fading text and the CTA row as loose siblings read as
two disconnected elements rather than one obvious "click to read more"
unit. `.teaser-fade` is `max-height: 6.4em` (4 lines) + `overflow: hidden`
with a `::after` linear-gradient fading to `var(--card)` (matches the hook
card's own background, not the page background, now that the teaser lives
inside a card) over the last 3em — deliberately tall/generous after an
initial 2-line/1.7em version read as too subtle to notice.
`.article[open] .teaser-fade { display: none; }` hides it once expanded so
the real paragraph (shown in full in `.article-body` right below) doesn't
appear twice; the card shrinks down to just the CTA row, which stays put
as the collapse control.

Decisions worth keeping if this gets touched again:
- **Gradient fade, not blur.** A blurred trailing clause was tried and
  rejected — the gradient reads as "there's more below," a blur reads as
  a rendering glitch.
- **Frame the hook as one card, not loose text + a toggle line.** Makes it
  unambiguous that the whole thing — preview text included — is the
  click target, and gives every collapsed article a consistent visual
  boundary against the page (this doubles as the "separate articles from
  each other" ask — no extra component needed, the hook card itself does
  it).
- **The CTA names something real, never a curiosity-gap tease.** Landed on
  "The full write-up — study, numbers, and caveats" over four other
  candidates (a generic "Continue reading," a "there's a real experiment
  behind this" hook, etc.) specifically because it's a concrete, honest
  preview of what's actually behind the click rather than manufactured
  suspense.

Applied via a script that pulled each article's existing first "The
psychology" paragraph verbatim into the teaser (not a separately-written
summary), so it's a real excerpt rather than paraphrased marketing copy.
It's a copy, not a live reference, though — if a psychology paragraph gets
edited later, its `.teaser-text` copy in the `<summary>` needs the same
edit or the preview will drift from the real opening line.

## Category filter chips — history (component now lives on principles.html)

This component went through several rounds before the underlying page
structure changed (see "Site is now two pages" above for the current
architecture — this section preserves *why* the chip design itself looks
the way it does, since that reasoning still applies on the archive page):
1. All 6 theme groups stacked vertically, always fully expanded — too
   much permanently-visible content.
2. Chips that `flex-wrap` onto multiple rows — rejected on a real phone:
   different-length labels produce a ragged, unaligned grid.
3. A horizontal scroll strip — fixed the raggedness, but requiring a
   swipe just to see the rest of the categories is itself bad UX.
4. **Landed on: an equal-width responsive grid, no scrolling.**
   `.toc-tabs` is `display:grid` with equal-width columns (real grid
   alignment, not content-sized flex items), and every chip carries a
   visible count badge (`.toc-tab-count`) so it's obvious there's real
   content behind each one, not just a label.

This grid/chip styling is what got reused directly for the archive page's
filter row (now 7 chips — All + 6 themes — see above), just with the
interaction changed from "swap which panel of links is showing" to
"filter the one shared list of full principle rows." The theme grouping
itself (vs. a customer-journey-stage grouping) was decided earlier and
still holds:
- Judgment, Memory &amp; Perception of Evidence (10)
- Choice Architecture &amp; Decision-Making (8)
- Pricing &amp; Value Perception (6)
- Social &amp; Normative Influence (3)
- Motivation &amp; Goal Pursuit (5)
- Friction &amp; Transparency (4)

Themes were kept over a journey-stage grouping (Awareness / Consideration
/ Checkout / Onboarding / Retention) because roughly 10 general judgment-
and-memory principles (Noise, Hindsight Bias, Illusion of Control,
Survivorship Bias, etc.) aren't tied to a specific funnel step and would
get force-fit into an artificial bucket. Themes give every principle an
unforced home.

## Principle sections — collapsed by default, expand in place on click

(Note: this pattern was built while all 36 principles still lived on the
homepage. That page has since split into `index.html` + `principles.html`
— see "Site is now two pages" above — and all 36 of these collapsed
sections now live on `principles.html`. The collapse/expand mechanics
below are unchanged and still exactly how each row behaves there.)

With 36 full principle sections always rendered open, the homepage was
~19,000px tall on mobile and jumping from Contents to any given principle
(via its anchor link) could mean scrolling past dozens of full sections —
both flagged directly ("too much scrolling when clicking the menu
options," "homepage is now super long"). Fix: every
`<section class="principle">` is now a `<details class="principle-details">`,
collapsed by default. What's visible in the collapsed row (lives inside
`<summary class="principle-summary">`, so it stays visible either way):
icon, number, title, and a 2-line-clamped definition. What only renders
once opened (`.principle-body`): the illustration/photo + caption, and the
already-separately-collapsed research article (`details.article`, the
teaser-card pattern documented above) — so a fully expanded principle is
two nested disclosures, each collapsed independently.

- **Auto-expand on navigation, not just anchor scroll.** A plain anchor
  jump to a closed `<details>` lands you at a collapsed row with nothing
  to read — you'd have to scroll there, then click again. `script.js` adds
  a `hashchange` listener (plus a check on initial load) that finds the
  target's `details.principle-details` and sets `.open = true` before/as
  the browser scrolls. This makes every existing anchor link into a
  principle (Contents, "see also" cross-references, etc.) land already
  open, with no dead click needed after the jump.
- **This is what actually fixed the "too much scrolling" complaint,
  more than the collapsing alone.** Collapsing shrinks each row from
  ~600-750px to ~90-110px, which shrinks the scroll *distance* too (since
  document position is cumulative) — from tens of thousands of px in the
  worst case down to under 5,000px Contents-to-last-principle. Removing
  the fully redundant "See it in practice" section (see homepage structure
  above) compounded this further, since it used to sit directly in the
  path between Contents and every principle.
- **Definition is line-clamped to 2 lines** (`-webkit-line-clamp: 2`) in
  the collapsed summary specifically so row height stays uniform
  regardless of how long an individual principle's one-liner runs —
  same reasoning as the article teaser's clamp, applied one level up.
- **The old 2-column `.principle-grid` (text | illustration side by side)
  was dropped, not preserved inside the revealed body.** Once title/
  definition permanently live in the always-visible summary, there's
  nothing left to pair the illustration against in a 2-column layout —
  revealed content (illustration + caption + article) now just stacks
  single-column, capped at `max-width: 620px` on desktop so it doesn't
  sprawl edge-to-edge once nothing else shares the row.

## Inline newsletter signup — a second, compact copy right after the hero

The full newsletter section (`.newsletter`, dark full-bleed, at the very
bottom of the page) still exists unchanged, but on a ~36-principle-long
page it's effectively unreachable without scrolling through everything or
using the nav link. Added `.newsletter-inline` — a compact bordered card
(mustard top accent, matching the site's existing card language) — right
after the About/hero section and before Contents, so subscribing doesn't
require scrolling past the entire principle list first. Same underlying
intent (email capture) and same non-functional `onsubmit="return false;"`
placeholder as the original (still awaiting real Beehiiv wiring — see
open decisions), just a second, earlier entry point with its own `id`
(`email-input-inline`) so it doesn't collide with the bottom form's
`email-input`.

## Open decisions / next steps
- Get eachlabs style-transfer skill actually generating output on the gelato
  photo and the 6 principle photos
- Once illustration style is finalised, apply to all 5 principle photos
  consistently
- Scaffold the actual Next.js project (not yet started — only mockups exist so far)
- Set up Sanity + Beehiiv accounts when ready to go live
