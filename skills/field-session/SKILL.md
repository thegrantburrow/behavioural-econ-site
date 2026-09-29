---
name: field-session
description: Use this skill whenever the user shares photos, notes, or a recap of a real talk, workshop, or presentation they personally ran, and wants it written up for the Field Notes site's "Field Sessions" page — distinct from the reference-style Principles case studies. Trigger on phrasing like "here are photos from a session I ran", "same principle as the first field session", "write this up as a field session", "do a session recap", or any request to document a real talk/workshop as personal applied work rather than a formal academic case study. Always use this skill for that task instead of improvising a different structure or format — every session must read as one consistent, first-person body of work with the same visual system (toggle, photo collage, teardown-style diagrams), not a one-off design.
---

# Field Session

## Why this exists

Field Sessions are a different content type from the site's Principles catalog: personal, first-person write-ups of real talks/workshops where the site owner put behavioural-economics mechanisms in front of an actual room, told honestly as a recap rather than dressed up as research. The first one (Airds High School, a school money-literacy talk) established the format. Every new session needs to hit the same shape and reuse the same visual system, or `sessions.html` starts reading like several different projects glued together instead of one running body of work.

## Failure mode: badging a personal encounter as a talk

**What happened.** The `dentist-visit` entry (a real trip to the dentist, not a talk to an audience) shipped with the exact same copy-pasted badges every real talk on the page uses: `<span class="case-tag">Field Session</span>` and `<span class="field-note-tag">A session recap, not a study</span>`. Its own `session-meta` line right below already said "one patient's real-time field notes, not a talk," and its `data-audience` was `"solo"`, the only entry on the page not filed under `education`/`team`/`conference`, so the page's own audience-filter chip already correctly called this a "Solo Field Note" elsewhere on the page. The badges on the article itself were never updated to match; they still asserted "Field Session," the label this skill's own trigger criteria (a talk, workshop, or presentation personally run) explicitly requires. The owner's catch, verbatim: "I went to a dentist. It isn't a session."

**The check.** Before badging any new entry `Field Session` / "A session recap, not a study," confirm the content actually is a talk, workshop, or presentation to a real audience, matching this skill's own trigger description, not a personal encounter or observation written up in the same first-person voice. If `data-audience="solo"` (a personal account with no audience) is the right classification, the on-page badges must say so too: use `Solo Field Note` for the `case-tag` and a parallel honesty caveat naming what it actually is (e.g. "A personal visit, not a study") for the `field-note-tag`, reusing the exact "Solo Field Notes" wording the audience-filter chip already establishes rather than inventing new terminology. Also check any cross-link elsewhere on the site that describes the entry in prose (a "See also" note on `principles.html`, for instance) for the same word choice, "field session" used loosely to mean "the dentist one" is the identical mislabel in a different sentence.

**The fix, in practice.** Relabeled `dentist-visit`'s `case-tag` to "Solo Field Note" and its `field-note-tag` to "A personal visit, not a study," and corrected a cross-link on `principles.html` that had called it a "dentist field session" to "dentist visit field note." A site-wide check confirmed this is the only entry with `data-audience="solo"`, so no other session needed the same correction, but re-run this check (`grep -c 'data-audience="solo"' mockup/sessions.html` should equal the number of entries whose badges say something other than "Field Session") whenever a new non-talk personal account is added to this page.

## Failure mode: the salient-question mark-highlight rule was never written down for this content type

**What happened.** `behavioural-principle-article` documents a rule that every `.salient-question` (the bold-italic sub-headline under a piece's title) needs exactly one `<mark>`-highlighted phrase, the single most concrete or surprising word, and that the rule "applies anywhere `.salient-question` is used, not just `principles.html`." Field Sessions reuse the identical `.salient-question` component for every entry's sub-headline, but this skill never actually said so, and a 2026-09-05 check found `dentist-visit` was the one gap among all 8 sessions on the page (every other entry already carried a `<mark>`, evidently by whoever wrote each one remembering the convention from nearby examples, not because this skill required it). The owner's catch arrived in the same message as the badge mislabel above: "the yellow highlights etc that we'd codified aren't here."

**The check.** Before calling any new or edited session finished, run `python3 scripts/check_salient_question_marks.py` from the repo root. With no arguments it checks every page in `mockup/` in one pass (principles.html, sessions.html, experiments.html, science-behind.html, natural-experiments.html, and every standalone special report using `.case-card`), since this component is shared across all of them and a gap can hide on any page that reuses it, not just the one being edited.

**The fix, in practice.** Added `<mark>` around "name a single one" in `dentist-visit`'s salient-question, the phrase that actually makes the question land (the surprising claim isn't that the mechanisms exist, it's that nobody in the room could name one and it still works). A site-wide sweep of `experiments.html`, `science-behind.html`, and `natural-experiments.html` at the same time found no further gaps.

## Which visual systems this covers

Field Sessions use several distinct icon/illustration systems of their
own, not one: the trio-card icons (`.case-icon`), the live-demo flow
diagram (`.flow-icon`/`.flow-step-icon`/`.flow-arrow-down`), the app/doc
mockup icons shared with Experiments, and hand-coded data charts
(`.be-chart-svg`/`.trend-chart-svg`). Before drawing a new icon for a
session, check the repo's `VISUAL-SYSTEMS.md` for which of these (or which
other system entirely, e.g. the principle eyebrow icon or the mechanism
diagram library) actually matches what's being built, rather than reusing
whichever one is visually closest.

## Where everything lives

- `mockup/sessions.html` — one page holding every session. Each session is its own `<article class="session" id="some-slug">...</article>`, appended after the existing one(s). Don't create a new page per session, and don't touch the shared page header (`#top`) or nav/footer — those are shared across all sessions.
- `mockup/images/` — processed session photos, named `<session-slug>-<descriptive-name>.jpg`.
- `mockup/styles.css` — the `/* ---------- field sessions page ---------- */` block near the end already has everything a new session needs (`.session-toggle`, `.session-panel`, `.session-collage`, `.session-demo`/`.flow-diagram`, `.session-trio`/`.trio-grid`, `.app-mock-*`). Reuse these classes; don't invent new ones for things they already cover.
- `mockup/script.js` — the last IIFE wires every `.session-toggle` found on the page, each scoped to its own `.session` article via `.closest('.session')`. This already supports multiple sessions on one page — you don't need to touch it when adding a session, only if you change the toggle's underlying mechanism.

## Step 1 — find and process the real photos

The user's uploaded photos are files on disk, not just chat content. Find them:

```
find / -maxdepth 8 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -newer <some recent reference file> 2>/dev/null | grep -v -E "node_modules|/proc/"
```

or list `/root/.claude/uploads/<session-id>/` sorted by time and match against how many images the user pasted and roughly when. Read each candidate with the Read tool to confirm it's the right one before using it — don't guess from filenames alone.

Then, for each real photo you're keeping:

1. Resize with Pillow: `ImageOps.exif_transpose()` first (phone photos carry an EXIF rotation tag; without transposing, the raw pixel array can be sideways), then resize so the longest edge is ~1400px, save as JPEG quality ~82, `optimize=True`.
2. **Actually view the resized output with Read before trusting it.** EXIF handling is a common source of silent 90°-rotation bugs — confirm the text in the photo (logos, handwriting, slide text) reads upright, not sideways or upside-down, rather than assuming the transpose worked.
3. Save into `mockup/images/` with a clear descriptive name.

Don't use every photo uploaded — pick the ones that actually support the narrative (an establishing room shot, the key visual aid, any handout or slide with real content on it), the same way the Airds session used 5 of the photos taken that day.

## Step 2 — write the article

Match this exact skeleton (see the Airds High School article in `mockup/sessions.html` for the full worked example):

```html
<article class="session" id="<slug>">
  <div class="wrap">
    <span class="field-note-tag">A session recap, not a study</span>
    <span class="case-tag">Field Session</span>
    <h2>...</h2>
    <p class="session-meta">Who it was for &middot; the occasion</p>

    <div class="view-toggle session-toggle" role="tablist" aria-label="Choose how to read this session">
      <button type="button" class="view-btn active" data-view-btn="full" role="tab" aria-selected="true">Full write-up</button>
      <button type="button" class="view-btn" data-view-btn="condensed" role="tab" aria-selected="false">Condensed</button>
      <!-- 0-2 more buttons for applied variants, see Step 4 -->
    </div>

    <div class="session-panel" data-panel="full"> ... </div>
    <div class="session-panel" data-panel="condensed" hidden> ... </div>
  </div>
</article>
```

**Voice**: first person, the site owner's own account of running the session — not a third-person case study. Write the way you'd tell a colleague what actually happened: what you did, what people said, what you'd change next time. Keep the honesty framing from the Principles articles (real mechanism, real citation where one's used) but the register is personal reflection, not academic write-up.

**Never write an em dash.** Not `—`, not `&mdash;`, not `&#8212;`. Use a period, colon, comma, or parentheses depending on what the sentence is actually doing (see `CLAUDE.md`'s standing policy). This was a real defect fixed across the whole site once already; don't let it come back in new sessions.

**The `full` panel**, in order:
1. A short scene-setting paragraph (who, what, why you did the demo this way).
2. The photo collage, if you have real photos — see `.session-collage-wrap` markup in the Airds article. Wrap the `<p class="caption">` inside the same wrapper div as the grid, not as a sibling — `.session .session-panel > p` styles direct-child paragraphs as body text, and a caption sitting at that level would wrongly inherit that styling instead of the smaller italic `.caption` look.
3. The core "live demo" moment, as a `.flow-diagram` teardown (see Step 3) — this is the visual anchor of the piece, and it's what "leading with teardown style" means: sequential steps with icons and arrows, a `flow-split-badge` for the pivotal moment, a `flow-insight` callout for the payoff. Label it honestly with a `flow-tag` like "Live demo, not a controlled study" — never let the teardown visual imply more rigor than a live demo actually has.
4. Any "three things" groupings as a `.session-trio` (see Step 3) — reuse this pattern whenever the session naturally breaks into 2-4 parallel short items (habits, traps, mistakes, rules); don't force it if the content doesn't actually cluster that way.
5. A short pull-quote in `<blockquote class="session-quote">` if something said in the room is genuinely quotable.
6. A closing reflection paragraph — what actually landed, what you'd change next time. This is what makes it a field session and not a lecture note.
7. A closing `.also-note` linking every principle used to its `principles.html#slug` entry.

**The `condensed` panel**: the same structure, roughly a third the length — keep the icons and the core flow-diagram (trimmed to fewer steps if needed) and the trio-grid tags/titles, cut the explanatory prose and drop the photo collage entirely so it stays genuinely light. Don't just truncate the full panel; rewrite it tight.

## Step 3 — visual components (reuse, don't reinvent)

**`.flow-diagram`** (already styled): `flow-tag` → `flow-start` (icon + label) → `flow-arrow-down` → one or more `flow-step` (icon + label) → `flow-arrow-down` → optionally `flow-split` + `flow-split-badge` for a single pivotal moment → `flow-arrow-down` → `flow-insight` (the payoff, in a `<p>` with a bold lead-in). For a numbered how-to instead of a narrative demo, use `flow-step numbered` with a `<span class="step-num">N</span>` instead of an SVG icon (see the "In your banking app" panel in the Airds session).

**`.session-trio`**: an `<h3>` + `<p class="trio-sub">` intro, then `<div class="case-grid trio-grid">` holding 2-4 `<div class="case-card trio-card">` — each with a small SVG icon (`class="case-icon"`, ~24px, same stroke style as the rest of the site: `stroke="currentColor" stroke-width="1.6"` with a `var(--terracotta)` accent on one element), a `<span class="case-tag">`, an `<h4>`, and optionally a `.case-body` paragraph. Close with an `.also-note` "why it landed" line underneath the grid.

**Icons**: match the site's existing abstract line-icon language — no photography-style icons, no emoji. Look at icons already built for related principles (an hourglass for scarcity, a tag/note for mental accounting, an eye-slash for salience/friction) before drawing a new one; reuse the exact SVG paths where the same concept recurs across sessions, the way "50% off" reused the same percent icon in both the flow-diagram and the trio-grid within the Airds session.

**Photo collage** (`.session-collage-wrap` > `.session-collage` > `.photo-cell.area-*` > `img.session-photo`): a bento grid (one CSS class per named area). `.session-photo` carries no color filter (`filter: none`), real photos render in their real, natural color, not a stylised treatment, see the 2026-08-31 catch below for why. If a session has a different number of photos than 5, adjust the `grid-template-areas` in a scoped rule rather than reusing the exact 5-area layout blindly.

## Step 4 — the "applied" toggle panels

Beyond `full` and `condensed`, add 0-2 more toggle panels that answer "how would someone actually use this outside the room where I gave the talk." What these are depends entirely on the session's topic — they are not fixed. For the Airds School money talk (audience: teenagers) they were "in your banking app" (a numbered how-to) and "in-app messages" (UI mockups for onboarding + a check-in nudge). For a different topic and a different audience, the applied panels should be whatever's actually useful to *that* audience — e.g. a product/design audience might want "how to map your own outcome logic" or "what this looks like as a Jira ticket," not consumer app mockups. Ask yourself what the room would actually go do on Monday morning, and build the panel around that.

If a panel needs a UI mockup (an app screen, a message, a form), reuse `.app-mock-phone`/`.app-mock-screen`/`.app-cta`/`.app-mock-banner` for anything phone/app-shaped; for anything else (a slide, a document, a ticket), build a comparably simple mock using the same card/border/shadow language (`var(--card)` background, `var(--line)` border, `border-radius: 12px`, a soft shadow) rather than introducing a visually unrelated style.

## Don't bolt on a Special Report's story-stack or evidence-at-a-glance

Special Reports use two chunked, icon-led summary components (`.story-stack` for the narrative arc, a second one labeled "The evidence at a glance" for headline facts with real numbers, mandatory there past 2 cited studies) — see the `special-report` skill. A 2026-08-27 site-wide audit checked whether Field Sessions needed the same treatment and found they already have the equivalent: `.rail-nav` (the vertical stepper: Setup, Live demo, Saving habits, Spending traps, Reflection) already gives a reader the shape of the piece at a glance, and citation density per session is low (most cite 0-1 real studies). Bolting on a second, redundant summary component would duplicate what rail-nav already does, not add to it.

**The rule, going forward:** don't add a story-stack or an evidence-at-a-glance stack to a Field Session by default. Only add a compact evidence summary (3-5 short items, real numbers, matching this content type's own visual language rather than copy-pasting the Special Report component) if a specific session itself cites more than 2 real academic studies, the same numeric threshold the special-report skill uses. Check before writing a new session by counting `.study-card`/real citation instances inside that one `<article class="session">` block, not the whole page.

## The 2026-08-31 catch: a stylised photo filter reads as a bug to the person whose real photos it's degrading

**What happened.** `.session-photo` shipped with `filter: grayscale(88%) sepia(14%) contrast(1.1) brightness(1.03)` plus an ink `mix-blend-mode: color` overlay, deliberately applied (per the CSS comment at the time) as a "warm archival duotone so five phone photos, shot at different angles and in different light, read as one consistent set." At 88% grayscale the warmth from the 14% sepia barely registers; every session's real photos rendered as close to flat black-and-white on the live site. The owner's catch, on seeing his own Airds High photos on `grantburrow.com`: "It still uses the black and white photos." A deliberate, documented design choice still reads as an unintended defect if the effect a viewer actually sees doesn't match the effect the CSS comment describes, and a comment justifying a filter doesn't excuse the filter from being checked against how it actually renders.

**The check.** When a color-transforming filter is applied to real, uploaded photos (not to icons, illustrations, or other invented graphics), render it and look at the actual result next to the source file, not just trust the filter values or the comment describing intent. A "consistent set" instinct is real (mismatched phone photos shot in different light can look like a dump), but test whether the specific filter values chosen still read as *photos*, not as a monochrome effect, before shipping it as the default treatment for every future session's real photos.

**The fix, in practice.** Removed the filter and the color-wash overlay entirely (`.session-photo { filter: none; }`); real photos across every existing session (Airds High, Agile Australia) now render in their natural color. If a future session's photos genuinely look like a mismatched dump and a unifying treatment is wanted again, rebuild it as a real, screenshotted options review (per `design-options-review`) rather than reintroducing a heavy filter by default, and check the rendered result against the source photos before shipping either way.

## Step 5 — verify and ship

1. Confirm the new session doesn't break earlier ones: with more than one `.session` article on the page, click through every toggle on every session and confirm each only shows/hides its own panels (this is what the `.closest('.session')` scoping in script.js protects against — verify it, don't just trust it).
2. Screenshot at 320/375/1280px and check `document.documentElement.scrollWidth > document.documentElement.clientWidth` is `false` at each width, the same way every other page on this site is verified.
3. Commit `mockup/sessions.html`, `mockup/styles.css` and/or `mockup/script.js` (only if changed), and the new files under `mockup/images/`, with a commit message describing what the session covers.
3a. Add an entry to `mockup/search-index.js` under Field Sessions, and check any real proper noun central to the talk (a school, a company, a conference name) actually appears in the indexed title/blurb, not just in the session's own body copy. See `predictive-search-component`'s "Entry-content policy" section for the failure mode this catches.
4. If a live preview artifact of `sessions.html` already exists for this conversation, refresh it: rebuild the self-contained version (full site CSS/JS inlined, image `src`s swapped for base64 data URIs, `principles.html#...`/`index.html#...`/`sessions.html` links rewritten to `#`) and republish to the same artifact URL rather than creating a new one.
