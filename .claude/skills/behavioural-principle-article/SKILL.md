---
name: behavioural-principle-article
description: Use this skill whenever the user asks to write an article, case study, research write-up, or explainer for a behavioural economics principle or cognitive bias — for the Field Notes project or any similar site. Trigger on phrasing like "write an article about anchoring", "case study for [principle]", "cover [bias] the way we did the others", "research write-up on [effect]", "do a Field Notes piece on X", or any request to document a behavioural-economics principle in depth. Always use this skill for that task rather than improvising a different structure — the output must match the established Field Notes case-study format (principle, psychology, errors, positive use, cited study, methodology critique, tagged findings) every time, so the site reads as one consistent body of work rather than five different writing styles.
---

# Behavioural Principle Article

## Why this exists

Field Notes is built on a promise: real examples, honestly sourced, no theory dumped without payoff. The first five case studies (Anchoring, Sludge, Zero Price Effect, Decoy Effect, Operational Transparency) set a structure that delivers on that promise. Every future principle article needs to hit the same shape, or the site starts reading like five different writers instead of one considered voice — and worse, it risks citing something inaccurately, which is exactly the kind of sloppiness this site is positioned against.

## The structure — always these seven sections, in this order

1. **The principle** — one or two plain-language sentences. No jargon a first-time reader would need to look up.
2. **The psychology** — the actual cognitive mechanism causing the effect, not a restatement of what it is. Answer "why does the brain do this," not "what happens."
3. **Where it causes errors** — a concrete way this leads people to worse judgments, ideally with a real example (a company, a product, a situation), not an abstract hypothetical.
4. **Where it can help** — the ethical or decision-improving use of the same mechanism. This section matters for tone: Field Notes teaches people to *recognise* manipulation, not to *deploy* it on others. Never let this section read as a playbook for exploiting users — if a principle genuinely has no benign use, say that honestly rather than forcing one.
5. **The study** — the real primary academic source: author(s), year, title, journal, volume/pages, and a working link. Prefer the original foundational paper over a popular retelling. If the commonly-cited "example" people know (like Ariely's Economist-subscription demo) is not itself a peer-reviewed study, say so plainly and label it an illustrative case, not research — see the Decoy Effect write-up for the pattern.
6. **Methodology critique** — one genuine strength and one genuine weakness of the study's design. Engage with the actual method (sample size and composition, lab vs. field, what was held constant, replication concerns) — not generic hedging like "more research is needed."
7. **2–3 key findings, each explicitly tagged** — either `Verbatim (abstract)` (only when you have the exact wording, in quotation marks) or `Paraphrased` (a summary in your own words). Never let a paraphrase read like a direct quote. If you can't reach full text of the paper, say so rather than inventing a quote that sounds plausible.

## Research discipline — do this before writing a word

Citation details (names, years, journal, page numbers, the exact finding) have to be right, because this is a site whose entire value proposition is "we did the work you didn't." Don't write from memory alone:

- Use WebSearch to find and verify the actual primary source before drafting. If a well-known popular version of a finding exists (a viral case study, a business-book anecdote), search specifically for whether an underlying academic paper exists, and cite that instead of the popularization — but if no peer-reviewed source exists, don't manufacture one; label it as an illustrative case (see rule 5 above).
- Try WebFetch on the actual paper or its abstract page for verbatim text. It will often be blocked (paywalls, network policy) — that's fine and expected. When it fails, say so and mark every finding `Paraphrased` rather than guessing at wording. Don't quietly drop this caveat; tell the user plainly what you could and couldn't verify, the way the original five case studies did.
- If you find a real-world corroborating example beyond the core study (a regulatory case, a well-documented product feature), it's worth including as an "Also worth citing" aside — clearly separated from the primary academic source, not blended into it.

## Output format

The seven sections above are the content contract — they hold regardless of where the output is going (a chat reply, a markdown doc, an HTML page). Don't assume a specific visual template unless one is specified.

**When producing HTML for the Field Notes site itself**, reuse its existing design tokens rather than inventing new styling:

```css
--ink: #1B1E24;
--terracotta: #C43E1F;
--terracotta-dim: #A6331A;
--mustard: #E0A93A;
--mustard-dim: #96691E;
--teal: #1F7A6C;
--paper: #F5F6F5;
--card: #FFFFFF;
--line: rgba(27, 30, 36, 0.12);
--muted: rgba(27, 30, 36, 0.6);
```

These are mirrored from `mockup/styles.css`'s own `:root` block as of
2026-09-11. They are not the authority: `styles.css` is. An earlier copy of
this skill carried a palette that had drifted from the live tokens on all five
brand colours, so grep `styles.css` for the token before hardcoding any hex,
exactly as `CLAUDE.md`'s standing rule requires.

Georgia (or the system serif stack) for headings, system sans for body text — matching the site's established editorial, restrained voice (Bellroy/Vox-influenced, not flashy). See `reference/case-studies-example.html` for a complete worked example covering all five original principles — use it as the structural and tonal template, including how the "verbatim vs. paraphrased" tagging is presented visually (a coloured left-border on each finding, with a small uppercase label).

## A note on voice

Field Notes' whole angle is practical application over theory-dumping — the site exists because most writing about behavioural economics "stops at theory." Keep that in the prose: name the real company, the real product, the real screen. Avoid textbook throat-clearing ("Numerous studies have shown..."). Say what the study actually did and what it actually found.
