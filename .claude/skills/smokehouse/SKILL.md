---
name: smokehouse
description: |
  CODE NAME: Smokehouse. Use whenever Grant says "Smokehouse", "run Smokehouse",
  "Smokehouse this", "AI detection pass", "fingerprint pass", "watermark rewrite",
  "dilute AI tells", "make this less detectable as AI", or asks to remediate
  AI stylistic fingerprints / machine-watermark exposure on Field Notes (or any
  polished prose for him). Distinct from authentic-voice (which is the always-on
  finish check for new writing): Smokehouse is the deliberate remediation pass
  over existing Claude-native copy. Load this skill immediately when the code
  name or those triggers appear; do not improvise a different cleanup playbook.
---

# Smokehouse

**Code name:** `Smokehouse`  
**Say it to invoke:** "Smokehouse this page", "run Smokehouse on the special reports", "Smokehouse pass".

## Why this exists

On 2026-09-08/09 the site ran a full remediation after Anthropic's EU AI Act text-watermark rollout and a deep audit of AI stylistic tells. Two different problems were getting collapsed into one. This skill keeps them separate and makes the remediation repeatable on demand, across Cursor agents and Grok, without re-deriving the playbook each time.

Legitimate path only: rewrite the prose. Not a watermark-stripping tool, synonym-swap script, or evasion playbook.

## Two layers (never confuse them)

| Layer | What it is | What fixes it | What does NOT fix it |
|---|---|---|---|
| **1. Stylistic fingerprints** | Surface tells a reader or third-party detector can spot | Grep + targeted edit | — |
| **2. Machine watermarks** | Statistical patterns in token choice across a passage | Substantive rewrite of the same facts | Splitting long sentences alone; deleting one adverb |

Fingerprint cleanup can leave the watermark signal intact. A Smokehouse pass that only shortens sentences is incomplete.

Companion skill: `authentic-voice` (always-on finish check for new prose). Smokehouse is the deliberate remediation sweep. Run authentic-voice checks inside Smokehouse; do not skip them.

## Layer 1: Fingerprint checklist (do first)

1. **`quietly`.** Grep `\bquietly\b`. Delete it if the sentence still says the same thing. If something real is lost (covert / unnoticed / silent), say that with a concrete phrase instead. Site target: **0** in reader-facing mockup HTML/JS (CSS "quieter" comments in `*-live.html` presenter chrome are fine).
2. **Empty contrastive reveals.** `X, not Y` / `isn't X, it's Y` / stock "was never X" pivots. Run the authentic-voice five-question test. Keep load-bearing BE contrasts (mechanism *is* the distinction). Cut empty rhetorical weight.
3. **Long run-ons.** Measure **body `<p>` sentences per paragraph** (not whole-page concatenation). Target: most under 30 words, strong candidates to split at ≥36, average in the low-to-mid 20s. Never strip `;` from HTML entities (`&rdquo;` etc.) when auto-splitting.
4. **Em dashes.** No `—` / `&mdash;` / `&#8212;` in reader-facing sentences. Exceptions only: empty table cell `&mdash;` and `<span class="dash">&mdash;</span>` flow connectors (see `CLAUDE.md`).
5. **Stock scaffolds.** Kill repeating templates: "The next mechanism…", "whether or not", stacked "genuinely / structurally / the identical", uniform section openers.

## Layer 2: Watermark rewrite (required for a full Smokehouse)

Same facts, citations, links, ids, numbers, images. Different words, clause order, and section scaffolding. Uneven rhythm.

**The gate:** if every section still opens with the same template and the same clause inventory with periods inserted, that was fingerprint cleanup only. A watermark-facing rewrite breaks templates, re-orders explanations, and rephrases load-bearing sentences.

**Good Smokehouse rewrite (shape):**

- From: "Anchoring, the decoy, and the compromise all work on someone actively comparing options. The next mechanism works on someone who never has to choose at all…"
- To: "Anchoring, decoys, and compromise all need someone comparing. The Default Effect works when they barely choose at all…"

**Preserve always:** citation honesty, principle/cross-page `<a href>` at first body mention (not only meta), `search-index.js` / `apply-data.js` sync when titles or blurbs change, image `width`/`height`, no invented synonyms for academic terms.

## Scope order (when told "Smokehouse the site" or "keep going")

1. Special reports + hubs (`reading-the-research`, `natural-experiments`, `for-*`)
2. `science-behind.html` (entry by entry)
3. `experiments.html` (Theory / Hypothesis / Ethical / intro per experiment)
4. `principles.html` (narrative blocks, then Strength/Weakness, then validity badges)
5. `sessions.html` (first person preserved)
6. `*-live.html` reveal `verdictHtml` / `mechanismHtml` (vary phrasing across tools; do not share one template)

## Standing site constraints (Smokehouse inherits all of these)

- `authentic-voice` before calling prose finished
- No em dashes in prose (`CLAUDE.md`)
- No co-author / `cursoragent@cursor.com` trailers in commit messages (`.githooks/commit-msg`; see `CLAUDE.md`)
- Sync `search-index.js` when titles/blurbs/anchors change
- Inline-link cross-page refs in body prose; run `scripts/check_inline_references.py` after experiment / Science Behind edits
- Third person everywhere except Field Sessions (first person by design)

## Gates before calling Smokehouse finished

```bash
# Fingerprints
rg -n '\bquietly\b' mockup --glob '*.{html,js}'   # expect 0 in prose
rg -n '—|&mdash;|&#8212;' mockup --glob '*.html' # prose only; allow table/dash exceptions

# Optional: per-paragraph body <p> sentence length (target 0 sentences ≥36 on touched pages)
```

Then: authentic-voice read of openings and any remaining `X, not Y`; confirm at least one rewritten passage is a real rephrase, not a split-only edit.

## What Smokehouse is not

- Not a detector-evasion manual
- Not "replace every word with a synonym"
- Not permission to invent citations, soften numbers, or drop inline links
- Not a substitute for human judgment on the densest pages (principles, experiments, science-behind)

## History (short)

- 2026-09-08: `quietly` purge (93 → 0); authentic-voice catch documented
- 2026-09-09: sitewide body-`<p>` ≥36 cleared; substantive watermark rewrite across special reports, science-behind, experiments, all 84 principles (+ Strength/Weakness + validity badges), sessions, 11 live tools; shipped live via PR #6
- 2026-09-09: skill codified as **Smokehouse** so the pass can be invoked by name
