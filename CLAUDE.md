# Field Notes — behavioural-econ-site

A website about applied behavioural economics — real consumer moments (retail
signage, app notifications, subscription pricing, shopfronts) mapped to the
research behind them. Built from the owner's own photos of real examples,
plus original case studies. Full context: `PROJECT-BRIEF.md`.

- Working tree lives in `mockup/` (`index.html`, `principles.html`,
  `sessions.html`, `experiments.html`, `styles.css`, `script.js`,
  `mockup/images/`). Treat this as the site; there is no build step yet.
- Cited study PDFs live in `references/` (`manifest.json` + `papers/`).
  Not deployed to Pages. Refresh with `python3 scripts/extract_citations.py`;
  ingest Grok-sourced PDFs with `python3 scripts/ingest_reference_pdf.py`.
  See `references/README.md`.
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
