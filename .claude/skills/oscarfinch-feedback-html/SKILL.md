---
name: oscarfinch-feedback-html
description: The standing format for any "give me options in HTML" request on this project (behavioural-econ-site) — visual mockups, copy variants, decisions, research summaries. Use automatically whenever the user asks for options, mockups, or a summary "in HTML" or "as an artifact" without specifying a different format. Do not ask the user to re-specify this format — it is already decided.
---

# Oscar Finch: standard interactive feedback HTML (behavioural-econ-site palette)

Ported from the original `oscarfinch-feedback-html` skill (established 2026-08-16 on
another project after the pattern was used successfully four times running) into this
project's own colour tokens (terracotta / mustard / teal / paper / ink, matching
`mockup/styles.css`) on 2026-08-21, per direct instruction. The mechanics below are
unchanged from the original — only the palette in `template.html` differs.

Canonical skeleton: `template.html` in this skill's folder. Copy it, fill in the
placeholders, keep the CSS/JS as-is (it already handles both light and dark theme via
`prefers-color-scheme` and `data-theme` overrides). **`.feedback` is intentionally plain
document flow, not `position: sticky`** — sticky+bottom engages immediately on a short
page (few cards) and overlaps the last card instead of sitting below it. Don't reintroduce
sticky positioning here even though a "sticky feedback panel" sounds appealing.

## The non-negotiable shape

- **A visible, working in-page light/dark toggle button** (`#theme-toggle`, top-right,
  fixed position — see `template.html`). Never rely on `prefers-color-scheme` alone or the
  artifact host's own theme switcher. The button flips a real `data-theme="light"/"dark"`
  attribute on `<html>` and remembers the choice via `localStorage`. **Never ship a
  feedback-HTML artifact without it — check it's present and wired before publishing,
  every time.**
- One `.card[data-item][data-title="..."]` per option/decision. `data-title` is what
  lands in the copied feedback, so make it identifiable on its own (not just "Option 1").
- **Binary toggle only** — "Looks good" / "Needs work". Not three-way, not a star rating,
  not free-form radio labels.
- One comment `<textarea data-comment>` per card, always present, even if the toggle
  wasn't touched — a comment alone is enough to include that item in the feedback output.
- A `.preview` block showing the actual thing being decided (a live mockup, real copy in
  context, a rendered example) wherever the option is visual or textual-in-context. Pure
  process/logistics decisions (no visual/copy component) can skip `.preview` entirely.
- One feedback panel at the bottom: a readonly textarea that live-compiles only the
  **touched** items (skip anything with no toggle and no comment), plus a "Copy feedback"
  button that shows a "Copied ✓" confirmation state for ~1.8s, using
  `navigator.clipboard.writeText` with an `execCommand('copy')` fallback.
- Copied format per item: `— {title}\n  Choice: {toggle label or "(no choice)"}\n
  Comment: {text, only if present}`, separated by blank lines.

## Design tokens (reuse exactly — don't invent new ones per artifact)

`--paper` (#F5F6F5), `--paper-alt` (#EBECEC), `--panel` (#FFFFFF), `--line`
(rgba(27,30,36,0.12)), `--ink` (#1B1E24), `--ink-soft` (rgba(27,30,36,0.6)), `--accent`
(terracotta #C43E1F), `--accent-ink`, `--accent2` (teal #1F7A6C), `--accent2-ink`, `--good`
(=accent2/teal), `--needs` (=accent/terracotta), `--shadow`. These are meant to be the real
site tokens from `mockup/styles.css`, not invented values — if the site's palette changes,
update this template to match. Georgia/serif for headings, system sans for body, exactly
like the real site. Light values and dark values both defined via `@media
(prefers-color-scheme: dark)` *and* mirrored in `:root[data-theme="dark"]` /
`:root[data-theme="light"]` so the manual toggle overrides the OS preference correctly in
both directions. Note: the real site itself doesn't have a shipped dark mode yet (a
separate open item) — the dark values here are this template's own invention, kept
consistent with the site's hues, not pulled from an existing site dark theme.

**Check these values against `mockup/styles.css` before every use, don't trust this
paragraph on faith.** Caught 2026-08-27: this file's `--terracotta`/`--teal`/`--mustard`/
`--ink`/`--paper` values had drifted from the site's real, live tokens (production is
`--ink: #1B1E24`, `--terracotta: #C43E1F`, `--mustard: #E0A93A`, `--teal: #1F7A6C`,
`--paper: #F5F6F5`, none of which match the values documented above or in the top-level
`CLAUDE.md`). A review artifact built from this file's stale values still functions and
still looks close to on-brand, which is exactly why the drift went unnoticed: nothing
breaks, the colours are just quietly a shade off from what actually ships. Before building
any review artifact, grep `mockup/styles.css` for the live `--ink`/`--terracotta`/
`--mustard`/`--teal`/`--paper` values and use those, not the ones written above, and flag
it if they've moved again since this note was written.

## What varies per request

Everything else: the number of cards, whether each has a `.preview` mockup or is
text-only, the tag/category label, the heading and description copy. Match the content to
what's actually being decided — don't pad with filler cards to hit a round number, and
don't omit the `.preview` on something inherently visual (a UI mockup, a copy variant
shown in its real placement) just to save time.

## A side-by-side comparison mockup has to stay side by side at every width

**What happened.** A `.preview` comparing two phone mockups (Progress Flow vs Progressive
Load, for `breaking-a-form-into-steps.html`) used `flex-wrap: wrap` and fixed pixel
widths, which read fine on a desktop preview but would stack vertically on a real phone
screen, defeating the entire point of a side-by-side comparison exactly where mobile
readers would see it. The owner's catch: "These need to be side by side and optimised for
mobile."

**The fix, in practice.** For any `.preview` whose whole point is a direct comparison
(two mockups, two states, before/after), set `flex-wrap: nowrap` on the row and size every
inner dimension with `clamp()` (padding, font-size, field heights, gaps) instead of fixed
px values or a breakpoint that stacks the columns. Verify with an actual Playwright
screenshot at 390px width, not just a description, and check
`document.documentElement.scrollWidth > document.documentElement.clientWidth` comes back
`false`. A comparison that stacks on the exact width most viewers will actually use has
failed at its one job, no matter how good it looks in a desktop preview.

## A mockup needs to say what happens next, not just show one static state

**What happened.** The same Progress Flow vs Progressive Load preview showed each pattern
frozen at one moment (a filled-in progress bar, a stack of fields) with no indication of
what tapping Continue or scrolling actually does. The owner's catch: "should be
self-contained and self-explanatory." A static screenshot of a UI pattern doesn't explain
the pattern; the pattern *is* the transition.

**The fix, in practice.** Add a one-line caption under any mockup depicting an interaction
pattern, stating the actual state change in plain terms ("Tapping Continue loads a new
screen: step 3 of 4" / "Scrolling reveals more fields inline. Same screen, no reload."),
plus a small visual cue where cheap to add (a faint queued "ghost" card behind a gated
step, a bouncing chevron where content continues). A reviewer shouldn't need the
surrounding prose to understand what a mockup is depicting.

## A copy-editing request wants a live text box, not a toggle plus a comment describing the edit

**What happened.** The standard shape asks the reviewer to toggle "needs work" and then
*describe* the fix in a comment box (e.g. "the opener should say X instead of Y"). For a
straight prose-editing round on a short piece (a LinkedIn post draft, a caption, any text
where the reviewer's real instinct is to just rewrite the sentence), that's an unnecessary
translation step: the owner has to convert his edit into an instruction, then Claude has to
convert the instruction back into the edit. His catch, verbatim, asking for this directly:
"want a section per content when the current copy is and I'll edit it … easier for this
kind of copy editing."

**The fix, in practice.** For a copy-editing round specifically (not a visual/design
options review, where the binary toggle is still right), swap the toggle-plus-comment shape
for one `<textarea data-copytext>` per card, **pre-filled with the current copy** rather
than empty. The reviewer edits the text directly, in place. Track each box's original value
in `dataset.original` on load, and compile the feedback panel from the box's *current*
value every time, tagged `(edited)` or `(unchanged)` by comparing against that stored
original, not from a toggle state. This means the copied feedback is never "here's what's
wrong", it's "here's the exact text now, some of which the reviewer rewrote themselves",
which is both easier for the reviewer to produce and unambiguous for Claude to apply
(diff the returned text against what was sent, rather than parse a description of an edit).
Keep this as a distinct card type, not a wholesale replacement of the toggle: a card with no
inherent text (an image, a layout decision, a process question) still uses the toggle plus
a real comment box, and a design-options review (see the rest of this skill) keeps the
toggle as its primary shape even when a card includes some copy, since the decision being
made there is "which direction", not "fix this sentence."

## "Needs work" can mean the underlying model is wrong, not just the pixels

**What happened.** After the side-by-side and caption fixes above shipped, the same card
got "needs work" a third time: "Isn't the distinction question by question blocks of
them?" The visual itself was clean by then; the actual content was wrong. The mockup
implied Progress Flow shows one field per step, when the report's own text defines the
pattern as "one *set* of fields per step." Two rounds of purely visual iteration had
polished a mockup that was illustrating the wrong thing.

**The fix, in practice.** When repeat feedback on the same card keeps coming back
"needs work" after a visual fix, stop iterating on pixels and re-read the source content
the mockup is supposed to represent (the actual article text, the actual data) before
touching the CSS again. A design fix cannot repair a factual one, and a third round of
polish on a wrong model just produces a better-looking wrong thing.
