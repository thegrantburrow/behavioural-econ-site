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

`--paper` (#FBF9F4), `--paper-alt` (#F1EEE6), `--panel` (#FFFFFF), `--line`
(rgba(30,27,22,0.12)), `--ink` (#1E1B16), `--ink-soft` (rgba(30,27,22,0.6)), `--accent`
(terracotta #B2472B), `--accent-ink`, `--accent2` (teal #2B6660), `--accent2-ink`, `--good`
(=accent2/teal), `--needs` (=accent/terracotta), `--shadow`. These are the real site
tokens from `mockup/styles.css`, not invented values — if the site's palette changes,
update this template to match. Georgia/serif for headings, system sans for body, exactly
like the real site. Light values and dark values both defined via `@media
(prefers-color-scheme: dark)` *and* mirrored in `:root[data-theme="dark"]` /
`:root[data-theme="light"]` so the manual toggle overrides the OS preference correctly in
both directions. Note: the real site itself doesn't have a shipped dark mode yet (a
separate open item) — the dark values here are this template's own invention, kept
consistent with the site's hues, not pulled from an existing site dark theme.

## What varies per request

Everything else: the number of cards, whether each has a `.preview` mockup or is
text-only, the tag/category label, the heading and description copy. Match the content to
what's actually being decided — don't pad with filler cards to hit a round number, and
don't omit the `.preview` on something inherently visual (a UI mockup, a copy variant
shown in its real placement) just to save time.
