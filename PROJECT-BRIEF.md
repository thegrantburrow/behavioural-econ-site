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

Applied so far: Zero Price Effect, Medium Maximization. Both linked from a
dedicated "Experiment Teardown" callout in the Contents section
(`#experiment-teardowns`, mustard-toned to match the pattern's own accent
colour) and from a top-nav link — promote more principles into that list as
they get the treatment, don't build a new index each time.

New principles get this by default going forward (per earlier scope
decision); the ~34 other existing articles keep their plain strength/weakness
format unless specifically flagged for a retrofit.

## "Article teaser" pattern — applied site-wide to all 36 principle articles

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
