# Field Notes — behavioural-econ-site

A website about applied behavioural economics — real consumer moments (retail
signage, app notifications, subscription pricing, shopfronts) mapped to the
research behind them. Built from the owner's own photos of real examples,
plus original case studies. Full context: `PROJECT-BRIEF.md`.

- Working tree lives in `mockup/` (`index.html`, `principles.html`,
  `sessions.html`, `experiments.html`, `styles.css`, `script.js`,
  `mockup/images/`). Treat this as the site; there is no build step yet.
- Palette: ink `#1E1B16`, terracotta `#B2472B`, mustard `#D9A441`, teal
  `#2B6660`, paper `#FBF9F4`. Georgia/serif for headlines, system sans for
  body — no monospace.
- Skills exist for the site's recurring content types — use them instead of
  improvising structure: `behavioural-principle-article`, `field-session`,
  `experiment-blueprint`, `design-options-review`.

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
