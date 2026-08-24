---
name: special-report
description: Use whenever the user asks to write, add, or expand a standalone argument-driven long-form piece for this site, distinct from a principle article (mechanism-first, one study), an experiment blueprint (a testable future test), a field session (a personal recap), or a Science Behind entry (object-first). Trigger on phrasing like "write a special report on X", "do a full report/article on this argument", "add this to Reading the Research", or any request to make a case at length using several real, cited sources tied together by one thesis (e.g. "Don't Say the E-Word", "Policy-Based Evidence, Not Evidence-Based Policy", "Six Moves Behind Every Pricing Page", "Not Testing Is Still a Bet"). Distinct from the other four content-type skills: this one starts from an argument or thesis, not a single study, a hypothesis, a real object, or a personal talk.
---

# Special Report

## Why this exists

By 2026-08-24 this site had shipped eight special reports (`evidence-strength.html`, `policy-based-evidence.html`, `dont-say-the-e-word.html`, `how-you-pay-changes-what-you-spend.html`, `small-sample-big-claim.html`, `savings-lottery.html`, `nobody-owns-a-bias.html`, `six-moves-behind-every-pricing-page.html`) all following the same unwritten structure, plus a ninth (`not-testing-is-still-a-bet.html`) that broke one part of it. Nobody had written the structure down. This file does that, so the next report matches the established shape on purpose instead of by luck.

## What this content type is, and isn't

It starts from an argument: a thesis the site is making, built by tying two or more real, cited findings (academic papers, and where relevant real narrative sources like a podcast episode) together under one claim. It's not a single principle's study card (that's `behavioural-principle-article`), not a future test (`experiment-blueprint`), and not a real object decoded (`science-behind-article`). A real narrative source (a podcast, a documented public statement) can carry the story, but the load-bearing citation is still the real academic paper behind it, labeled separately, exactly as `dont-say-the-e-word.html` labels List's own peer-reviewed paper as the citation and his public post as "restated publicly."

## The structure, in this order

1. **Header block** (`<section class="principles-index" id="top">`): `<span class="label">Special Report</span>`, an `<h1 class="principles-index-title">` stating the thesis as a title (a chiasmus, a plain declarative, or a named argument, never a category label), then the intro (see the chunking rule below), then a `<p class="story-stack-label">The story in four parts</p>` and a `.story-stack` of exactly four `.story-stack-item`s (icon + `<h4>` + one-sentence `<p>`), each beat moving the argument forward, not restating the same point four times.
2. **Report body** (`<section class="report report-light" id="...">`): a sequence of `.report-section` blocks, each with its own `<h3>` and one or more `<p class="intro">` paragraphs. A section presenting a real case usually uses `.case-grid` of `.case-card`s (tag, `<h4>`, `.salient-question` with a `<mark>`, `.case-body`, an optional `.lesson`) or a plain `.case-cite` line for the citation itself, matching the exact citation format used throughout `principles.html`.
3. **Closing "how to spot it" section**: a `.questions-callout` with 2-4 `<li><b>Question?</b><span>Why it matters.</span></li>` items, the same component `nobody-owns-a-bias.html` and `six-moves-behind-every-pricing-page.html` already use.
4. **Continue reading**: a final `.report-section` with 2-4 `.method-grid` pairs of `.method-col` links, cross-linking to the principles, other reports, and Science Behind entries the report is built on.

## The chunking rule: a long intro paragraph reads as a wall of text on mobile

**What happened.** Every prior report's `.toc-intro` ran 4-5 sentences, roughly 90-110 words, one paragraph. `not-testing-is-still-a-bet.html`'s intro ran 9 sentences, about 180 words, still one paragraph, because it needed to set up four real cases instead of one or two. On a real phone screenshot it reads as a single dense block above the fold, distinct from every report before it. The owner's catch, verbatim: "Chunk this content. It's too much a block of text. But keep elegant."

**The check.** `.toc-intro` has no hard character limit in CSS (`max-width: 46ch`, so it wraps narrow regardless of length), which is exactly why a long one silently becomes a wall of text instead of throwing an error. Before finalizing, count the intro's rough word count. Past about 110-120 words or five sentences, look for the natural idea boundaries: usually the claim itself, then the stakes or scale of the claim, then a roadmap of what follows. That's rarely more than three beats even for a long intro.

**The fix, in practice.** Split into 2-3 separate `<p class="toc-intro">` elements, one per idea, no bolded lead-in labels and no restructuring of the sentences themselves beyond the split. `.toc-intro`'s existing `margin: 0 0 16px` already spaces stacked paragraphs correctly, so this is a pure content split, not a CSS change. This is deliberately lighter-touch than `experiment-blueprint`'s bolded-lead-in chunking rule (`<b>The study.</b>`, `<b>The gap.</b>`): a report's intro is the site's own editorial voice making an argument, and a checklist-style label on every paragraph would flatten that into a spec sheet instead of a pitch. Keep the labels for technical blocks; keep report intros as plain, short paragraphs, matching the rest of the site's op-ed register. The same instinct applies inside `.report-section` bodies: if a single `<p class="intro">` is doing more than one job (stating a finding, then immediately pivoting to its caveat, then to its implication), that's usually two paragraphs wearing one tag.

## Voice and rigor, same as everywhere else on the site

- **No em dashes**, anywhere. See `CLAUDE.md`'s standing policy.
- **Run the `authentic-voice` checks** before calling any report finished, headings included, not just body prose.
- **Never fabricate a citation, a number, or a URL.** A narrative source (a podcast, a public talk) is fine to use for the story, but label it separately from the academic paper it's built on, and verify both are real before publishing.
- **Sync cross-links both ways.** A new report needs a nav-sublist entry (all pages), a `reading-the-research.html` case-card, the "Show N related essays" count, and the homepage "N special reports" count, all updated together, not just the new file on its own.
