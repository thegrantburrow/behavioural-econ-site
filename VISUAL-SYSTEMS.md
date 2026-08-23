# Visual systems catalog

This site runs on more than a dozen distinct icon and illustration
languages, not one. They look similar at a glance (most are 24x24 line art
with a terracotta accent) but they are built for different jobs, at
different scales, in different files. Mixing them up produces content that
reads as off-brand even though every individual element is "on brand" in
isolation.

This file exists because that mistake actually happened: a request to add
"elegant iconography, the kind we've built across the site" to a new site
logo got built from `icons.py`, the code library for system #2 below (big
schematic mechanism diagrams), when the actual match was system #1 (the
small per-principle eyebrow tag icon). The result read as generic clip art
(a giant star, a giant checkmark) because that library is built to be read
from across a room, not to sit quietly next to a wordmark.

## Before building any icon, illustration, or diagram

1. Name what you're actually building: a principle article illustration? A
   field session's live-demo recap? An experiment blueprint's app mockup?
   Something that isn't on the live site at all (a logo, a favicon, an
   external one-off artifact)?
2. Match it against the table below. If there's a clear match, use that
   system's established conventions (its own skill, if it has one, governs
   the how; this file governs the which).
3. If there's no clear match, or the request describes the visual language
   in general terms ("elegant," "like what we've built," "the site's
   icons") rather than naming a specific page or content type, do not
   default to whichever code library or reference file happens to be open
   in the working directory. State which system you're borrowing from and
   why, or ask which one the user means, before writing any SVG.
4. When two systems could plausibly apply, ask rather than guess. Getting
   this wrong costs a full rebuild, not a tweak.

## The systems

| # | System | Where | Classes | Visual language | Scale / role |
|---|---|---|---|---|---|
| 1 | Principle eyebrow icon | `principles.html`, one per principle | `.principle-icon` | 24x24 viewBox, stroke-width 1.6, `currentColor` (ink), exactly one small `var(--terracotta)` accent (filled dot, highlighted line, faded second path at low opacity). Bespoke per principle, never a generic universal symbol. | Small tag icon inline with the principle's eyebrow label. Quiet, specific, doesn't compete with the heading. |
| 2 | Mechanism illustration diagrams | `principles.html`, one `.illustration` per principle | `.illustration`, built from `icons.py` (`star`, `dots_cluster`, `circle_check`, `price_tag`, `speech_bubble`, `bars`, `wheel`, `clock_wait`, `lock`, `maze_icon`, etc.) | Large schematic icon-plus-label-plus-arrow narrative chains, built to explain a study's causal mechanism at a glance from illustration scale. | The big illustration box above each principle's mechanism note. Meant to read from a distance, not to sit small next to text. |
| 3 | Brand mark | `favicon.svg`, homepage hero eyebrow only | `.eyebrow-icon` (homepage instance) | One fixed glyph: a circle plus a small angular 4-point spark filled solid terracotta. Not from a code library, the literal site mark, identical path data reused verbatim in both places. | Favicon scale and a 14px homepage hero tag. Exactly 2 usages site-wide, never a general-purpose icon. |
| 4 | Homepage credentials icons | `index.html` "About" section | `.icon` (`.credential-item .icon`) | 24x24, stroke-width 1.8 (slightly heavier than the 1.6 standard), ink + one terracotta accent, bespoke per credential (cap, tag, folder). | 22px inline before a credential line. 3 instances only. |
| 5 | Hero underline squiggle | `index.html` hero H1 | `.accent-underline` | A single hand-drawn squiggle path, animated draw-on underline beneath the word "behavioural." Decorative, not an icon. | Full width of the accented word. 1 instance. |
| 6 | Newsletter icons | `index.html` `#newsletter` | `.newsletter-icon`, `.newsletter-point-icon` | Header icon is solid terracotta (deliberate deviation, flags the callout). The 3 point-icons below are back to ink + one terracotta accent, bespoke per reassurance. | Small inline icons in a bordered callout card. 4 instances. |
| 7 | Case/trio card icons | `sessions.html`, inside `.case-grid.trio-grid` blocks | `.case-icon` | Same convention as #1 (24x24, stroke 1.6, ink + one terracotta accent, bespoke), but a different system: sits above a heading inside a 3-up summary grid, not an article eyebrow. One exception uses filled pie-wedge paths with no stroke (`sessions.html` "Heuristic" icon). | Card-icon scale inside `.case-card`. ~63 instances across every field session's recurring "three-up" component. |
| 8 | Live-demo flow diagram | `sessions.html` | `.flow-icon`, `.flow-step-icon`, `.flow-arrow-down` | Same 24x24 ink+terracotta-accent convention, arranged as a vertical narrative chain: start icon, arrow down, step icon, repeat, optional split badge, insight payoff line. The "teardown-style diagram" reconstructing a live talk demo. | Full-width reading-scale component, the centerpiece of most field session articles. |
| 9 | Condition marker | `sessions.html`, inside tags and comparison-table headers | `.condition-icon` | Tiny circle-based glyph (plain circle = condition A, circle+plus = condition B). | 13px inline, 4 instances, marks A/B split arms. |
| 10 | App/doc mockup chrome icons | `sessions.html` + `experiments.html` | `.app-mock-icon`, `.app-mock-banner-icon`, `.doc-mock-icon` | Same ink+terracotta-accent line-art convention, used as the single hero icon inside a fake phone-screen or document-card mockup. | Mockup/card scale, sits inside a phone bezel or doc-card header. The largest shared system between the two pages (experiments.html: 16 app-mock-icon + 6 doc-mock-icon, one set per experiment blueprint). |
| 11 | Outcome checklist badge | `experiments.html` | `.doc-mock-check` | Not SVG: a filled `border-radius:5px` teal square containing the literal `&check;` entity. | 16-18px badge, one per outcome metric bullet, ~4 per experiment. |
| 12 | Power-calc stat grid | `experiments.html` | `.power-calc`, `.power-stat` | No icon: label + large serif numeral + caption tiles, `.power-stat.accent` colored terracotta. A numeric/stat-tile system, not an icon system. | Once per experiment blueprint, "Sample size" section. |
| 13 | Tag/chip pills | `sessions.html` + `experiments.html` | `.field-note-tag`, `.case-tag`, `.exp-tag` | Text-only pills, color-coded by CSS class, no icon or glyph at all. | Header row of every field session and experiment blueprint. |
| 14 | Hand-coded data charts | `sessions.html` | `.be-chart-svg`, `.trend-chart-svg` | Real plotted SVG charts with axes, tick arrows, points, inline text labels. Not icons, not the mechanism-diagram schematic style. | Full-width article-body scale. 3 instances total. |
| 15 | Progress rail dots | `principles.html`, `sessions.html`, `experiments.html` | `.rail-nav`, `.rail-dot`, `.rail-line` | 8px circular dot per section, connected by a vertical line, terracotta when active, teal when done. A stepper UI element, not an illustrative icon. | One dot per `data-rail-section`, present on nearly every long-form article on 3 of the 5 pages. |
| 16 | `reading-the-research.html` | that page only | reuses `.case-grid`/`.case-tag` shell (system 7's shell) | No icons of its own. Its four case cards reuse the case-grid/case-tag markup unpopulated, text only. | No distinct visual system: confirm this stays true rather than assuming it inherited icons from system 7. |
| 17 | Landing-hub category tile | `principles.html`, `sessions.html`, `experiments.html`, one small intro section per page, right after the nav | `.cat-icon` (inside `.cat-tile`) | 24x24 viewBox, stroke-width 1.7, `currentColor` (ink) only, no per-icon terracotta accent. Bespoke per category, rendered small (~17-18px) inside a tile. Declared 2026-08-22 when the nav's "By category / All items" tab switcher pattern (reviewed as Option 2 of 3) was built for real; deliberately plainer than systems #1/#7 because a terracotta accent at this render size read as noise, not signal, in the reviewed mockup. | Small tile icon, top of a `.cat-tile` inside the landing hub's `.cat-grid`. Distinct from #1 (principle eyebrow, sits inline with a heading) and #7 (case-card icon, sits above a heading inside a 3-up grid) even though the underlying viewBox convention is shared. |
| 18 | Science Behind hero icon | `science-behind.html`, one per entry, top of the article | `.sb-hero-icon` | 24x24 viewBox, stroke-width 1.7, ink + one terracotta accent, same base convention as #1/#7, but rendered roughly 2x their scale (~44-48px). Must depict the literal real object the entry is about (a jean leg with a selvedge cuff, a portafilter, a ballot), never a generic stand-in category symbol, the same literal-object rule `principle-mechanism-diagram` already enforces for illustrations. Declared 2026-08-23 for the new "The Science Behind" content type, governed by the `science-behind-article` skill. | Sits at the top of the entry, beside the title, big enough to function as a masthead mark for that one piece, not a quiet inline tag like #1. |

## Things that are NOT on this list because they aren't part of the live site

Logo concepts, review-artifact chrome (rating buttons, comment boxes, the
copy-feedback mechanism), and any other one-off tool built to gather
feedback are governed by the `design-options-review` and `artifact-design`
skills, not by this file. But the moment such an artifact needs to
represent "the site's own iconography" inside it (a logo mark, a favicon
mock, a nav preview), the content it's representing must be matched
against this table like anything else, not improvised from whichever
reference happens to be nearby.
