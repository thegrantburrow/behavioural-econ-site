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

## Homepage structure (validated layout)
1. Hero — mission statement above
2. "See it in practice" — compact icon row linking to 5 principle sections (anchor
   links, same-page jump, not separate pages)
3. One detail section per principle: icon + one-line definition + illustration +
   caption naming the real photo it's based on
4. "More to explore" — Case Studies / Articles / Insights as secondary nav
5. Newsletter signup, footer

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

Applied so far: Zero Price Effect, Medium Maximization. Both linked from a
dedicated "Experiment Teardown" callout in the Contents section
(`#experiment-teardowns`, mustard-toned to match the pattern's own accent
colour) and from a top-nav link — promote more principles into that list as
they get the treatment, don't build a new index each time.

New principles get this by default going forward (per earlier scope
decision); the ~34 other existing articles keep their plain strength/weakness
format unless specifically flagged for a retrofit.

## Open decisions / next steps
- Get eachlabs style-transfer skill actually generating output on the gelato
  photo and the 6 principle photos
- Once illustration style is finalised, apply to all 5 principle photos
  consistently
- Scaffold the actual Next.js project (not yet started — only mockups exist so far)
- Set up Sanity + Beehiiv accounts when ready to go live
