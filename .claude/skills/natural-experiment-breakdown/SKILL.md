---
name: natural-experiment-breakdown
description: Use whenever the user asks to write, add, or expand an entry for the site's "Natural Experiments" page (natural-experiments.html), a piece breaking down how a real study proved a cause without a randomized controlled trial (a natural experiment, a quasi-experimental design, machine-learning controls standing in for random assignment, a regression discontinuity, a difference-in-differences design). Trigger on phrasing like "write a Natural Experiments piece on X", "add a causal-inference breakdown for X", "how did this study prove causation without an RCT", or any request to explain a real study's identification strategy when it wasn't a randomized trial. Distinct from behavioural-principle-article (the psychological mechanism itself, cited from its seminal study) and evidence-strength.html (the general ladder of causal evidence): this content type is method-first, one real study, walking through exactly how it substituted something else for random assignment and what that substitute can and can't prove.

---

# Natural Experiment Breakdown

## Why this exists

Founded 2026-08-26 alongside its flagship entry (a 2022 machine-learning study of geographic bias in the MLB draft), on direct instruction: "Search function should search all contents... USE ALL THE SKILLS WE'VE BUILT" while building a new site section for "causal inference where it's not an RCT." Every principle article on this site cites a real study, but most of those studies are lab or field experiments with genuine random assignment. A growing number of the site's best evidence isn't that: it's a real-world dataset where nobody could flip a coin, and the researchers had to argue their way to a causal claim some other way. That argument, the identification strategy itself, deserves its own explanation, not just a passing mention inside a principle's study-card. This file exists so the next entry explains its method with the same rigor as the first one, not from scratch each time.

## What this content type is, and isn't

It starts from a real, cited study whose central challenge was proving cause without randomizing anything, not from a psychological mechanism (that's `behavioural-principle-article`) and not from a general framework for ranking evidence quality (that's `evidence-strength.html`, a field guide, not a per-study breakdown). A Natural Experiments entry can, and usually should, cite a principle it corroborates or extends, exactly the way the flagship entry cites Propinquity Effect, but the entry's own job is to explain the *method*: what real-world condition stood in for random assignment, why that substitute is credible, and where its limits are. If the underlying psychological mechanism doesn't have a principle yet, write that principle first, then write the breakdown that cites it, the same sequencing `science-behind-article` requires between a new mechanism and the object that demonstrates it.

## Verify the mechanism match before citing a principle, don't reach for the nearest-sounding one

Before linking a breakdown to an existing principle, check the source study's own stated mechanism against that principle's actual definition line, not just its vibe. The flagship entry's citation of Propinquity Effect only holds because the draft study's own language ("scouting directors profit from scouting in geographically proximate locations they are familiar with through repeated exposure") is the identical mechanism Festinger's housing study names: repeated incidental contact building familiarity that gets mistaken for a signal of trust or fit. If a future study's finding merely sounds adjacent to an existing principle without matching its actual causal claim, research it as its own thing (WebSearch for the real underlying psychology) rather than borrowing the nearest available chip. This is the same check `science-behind-article`'s first failure mode already documents for a different content type; it applies here with equal force.

## The structure, in this order

This content type deliberately reuses Science Behind's existing global CSS classes (`.sb-entry`, `.sb-head`, `.sb-hero-icon`, `.sb-lead`, `.sb-tags`, `.sb-chips`, `.sb-block`, `.sb-split`/`.sb-split-col.real`/`.perceived`, `.sb-sources`) rather than building a parallel component set. Confirm those classes are still globally scoped in `styles.css` (not nested under `.science-behind`) before relying on this; if a future refactor scopes them, either update this file or build an equivalent parallel set, don't silently break the reuse.

1. **Header.** `.sb-hero-icon` depicting the literal method, not a generic magnifying glass: the flagship entry's icon combines a baseball-stitching magnifying glass, a dashed measurement line, and a location pin, because the study is specifically about geographic distance inside baseball scouting. Title states the causal puzzle as a question ("How do you prove distance biased 30,000 draft picks when nobody can randomly assign where a scout lives?"), matching the site's `salient-question` convention. Two `.sb-lead` paragraphs: the first names the real dataset and the real obstacle to randomizing it, the second previews the substitute method used.
2. **Tags and chips** (`.sb-tags`, `.sb-chips`). `.sb-tags` names the general method family (e.g. "Observational Study", "Machine Learning Controls", "Regression Discontinuity", whatever actually applies, don't force-fit a label that isn't accurate). `.sb-chips` links to the principle(s) this corroborates or extends, plus plain badges naming the specific technique(s) used (e.g. "Selection on Observables", "Robustness Checks").
3. **Four `.sb-block`s, in this fixed order**, each with a `<span class="k">` label:
   - **The obstacle** — what real-world question needed a causal answer, and specifically why a controlled trial was impossible here (nobody can randomly assign where a scout lives, nobody can force a country to switch its organ-donation default and switch it back).
   - **The workaround** — the actual substitute for random assignment: what data, what model, or what natural discontinuity stood in for the coin flip, explained plainly enough that a reader without a statistics background follows the logic.
   - **Why it's still convincing** (fold into the workaround block, or its own block, depending on how much explaining the workaround itself needs) — the specific design choice that rules out the obvious alternative explanation, mirroring what a `study-card`'s "Strength" already does for a randomized study.
   - **The finding** — the real numbers, paraphrase-tagged per the research discipline below, stated plainly, including the actual real-world stakes (not just a percentage in isolation).
4. **Real vs. can't-rule-out split** (`.sb-split`, reusing the `real`/`perceived` column classes even though this content type isn't about perception, the visual pattern of "what's solid" vs. "what's still open" transfers directly). Left column: what the method actually establishes, 2-3 bullets. Right column: what it can't rule out, always including the study's actual publication status (working paper vs. peer-reviewed) as one bullet, never omitted.
5. **Sources** (`.sb-sources`). Full citation in the exact format used elsewhere on the site (author, year, title in quotes, venue, working link). A paraphrase disclaimer whenever the full paper sat behind this site's network restrictions (see research discipline below), stated plainly, not buried. A "See also" line cross-linking back to the principle article this corroborates, and forward to any special report built on the same study.

## Research discipline, same obligation as everywhere else on the site

- Use WebSearch to find and verify the actual study before drafting. Academic paper hosts (`nber.org`, `bfi.uchicago.edu`, `papers.ssrn.com`, `ideas.repec.org`, `semanticscholar.org`, `fieldexperiments.com`, and similar) are frequently blocked by this environment's network egress policy (`EGRESS_BLOCKED`). When WebFetch fails on the primary source, that's expected, not a reason to guess: rely on WebSearch's own snippet-level detail, tag every finding `Paraphrased`, and say plainly in the entry's `.sb-sources` block that the paper sat behind network restrictions.
- Never invent a number, a sample size, or a p-value to make a finding sound more precise than what was actually found. If a real number can't be verified, describe the finding qualitatively and disclose the gap rather than fabricating specificity.
- A study still marked "working paper" rather than peer-reviewed is fine to feature, this content type is explicitly about interesting identification strategies, not only settled consensus, but the `.sb-split` "can't rule out" column must say so, every time, not just for a first flagship entry.

## Discoverability: an entry needs the same wiring a principle does, every time

A new entry isn't finished when the `<article class="sb-entry">` is written. Six places need updating, all together, not the article on its own:

1. **`natural-experiments.html`'s own `#ciToc` list** — add a new `<li>` linking to the entry's anchor, matching the `session-toc` markup pattern already used elsewhere on the site.
2. **`principles.html`** — if the entry corroborates or extends an existing principle, add a "See also" line to that principle's `also-note` block linking forward to the new entry, exactly as the flagship entry's Propinquity Effect principle does.
3. **`script.js`'s `CATEGORY_ORDER`** — already includes `'Natural Experiments'`; a new entry doesn't need a new category, only a new `search-index.js` row (below).
4. **`search-index.js`** — one new entry object with `category: 'Natural Experiments'`, a real URL anchor, and a blurb written the same way the flagship entry's is: naming the real puzzle, not a generic teaser.
5. **`sitemap.xml`** — only needed if this content type ever gets its own dedicated page per entry; while entries live as anchors within the single `natural-experiments.html` page (see the merge-at-low-count rule below), no separate sitemap row is needed per entry, only for the page itself.
6. **Any special report built on the same study** — cross-link both directions: the report's "Continue reading" `.method-grid` links to the entry, and the entry's `.sb-sources` "See also" links back to the report.

## At low entry counts, merge the hub and the index, per `science-behind-article`'s own precedent

The page launched with exactly one entry: no domain or signal filter tiles, no search box inside the page, just one `<section class="landing-hub" id="hub">` holding a plain intro paragraph and a single-item `<ul class="session-toc">`. This mirrors `science-behind-article`'s own documented fix for the identical situation (a category-tile hub and a full index doing the same job when there's nothing yet to differentiate them). Don't build filtering infrastructure ahead of the content that would justify it: add domain tiles, a signal-type axis, or a search box only once there are enough entries that browsing genuinely benefits from them, re-running that skill's own check (would the hub's categories differ from the index's) before adding any of it.

## The landing-hub title never states a raw count

Per `science-behind-article`'s identical rule: `.landing-hub-title` reads as a standing identity statement ("When you can't flip a coin"), not a count that undersells the page at one entry and needs revisiting at fifty. The live entry count belongs on a control (a future "All N" chip once there's a list worth counting), never in the headline.

## Nav rollout: a new top-level nav item, not nested under an existing one

"Natural Experiments" shipped with its own full top-level nav item (icon, `nav-desc`, footer link) across every page on the site, mirroring exactly how "Science Behind" itself was rolled out with a full nav item from its first entry rather than starting nested under an existing section and being promoted later. When adding the section for the first time, use a Python script for the multi-file mechanical edit (as this session did for both the nav-rollout and the "Reading the Research" count-sync), and disambiguate the anchor string carefully: a short anchor like `<a href="apply.html">` can match both the real nav-bar instance and an identical-looking footer link, requiring a longer, SVG-content-inclusive anchor to target only the intended instance.

## Chunk any `.sb-block` paragraph over ~110-120 words, and check the CSS spacing when you do

The flagship entry shipped with two `.sb-block` paragraphs (137 and 141 words, one flowing paragraph each) that read as dense, undifferentiated text on a real phone screenshot, the same defect `behavioural-principle-article` had to fix across 18 of its own `.article-block` paragraphs after direct user feedback ("I keep having to tell you about needing to chunk and format so it's not just stabs of text"). Before finishing any `.sb-block`, count words in its paragraph; past ~110-120 words or five sentences, split at the natural idea boundary (the method explained, then its implication; one piece of supporting evidence, then a second) into a second `<p>`.

`.sb-block p { margin: 0; }` in `styles.css` means two sibling `<p>` tags in one block render with no vertical gap unless a sibling-selector rule adds it back, same underlying bug `.article-block` had. `styles.css` now carries `.sb-block p + p { margin-top: 12px; }`, added specifically for this content type; confirm it's still there before shipping a new multi-paragraph block, don't assume the default component spacing already handles it.

## Voice and rigor, same as everywhere else on the site

- **No em dashes**, anywhere. See `CLAUDE.md`'s standing policy.
- **Run the `authentic-voice` four-question test** before calling any entry finished.
- **Never fabricate a citation, a number, or a URL.** Disclose a gap rather than guessing at it.
- **Identify any named entity that isn't a household name**, per `science-behind-article`'s own identification-failure-mode rule: if the entry names a specific organization, database, or program that an average reader wouldn't recognise from the name alone, say what it is before using the name again.
