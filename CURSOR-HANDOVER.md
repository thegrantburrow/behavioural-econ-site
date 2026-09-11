# Field Notes — Cursor handover export

Exported 2026-09-11 from Claude Code session, repo `thegrantburrow/behavioural-econ-site`,
branch `claude/field-notes-cursor-export-8g8jf2`.

This bundle is the **complete** set of Field Notes context that lived outside the
GitHub repo, plus the in-repo context needed to use it. Where something was
asked for and does not exist, it is marked `MISSING:` in section 1 or 6.

## Bundle contents

```
00-README-CURSOR-HANDOVER.md      this file (sections 3, 4, 6, 7)
01-claude-local-skills/
  behavioural-principle-article/  CRITICAL - was not in the repo
    SKILL.md
    reference/case-studies-example.html
  setup-writing-style/            generic Anthropic skill, builds my-writing-style
    SKILL.md
    scripts/stylometry.py
02-project-knowledge/
  CLAUDE.md                       live authority on standing policy
  PROJECT-BRIEF.md                historical design log (STALE IN PLACES, see below)
  VISUAL-SYSTEMS.md               the 12+ icon/illustration systems
03-repo-skills-reference/         all 12 skills already in .claude/skills/
```

## Read this before using anything in 01-

### The exported skill's colour palette is WRONG. Do not copy it.

`behavioural-principle-article/SKILL.md` hardcodes a palette that has drifted
from the live site. Verified today against `mockup/styles.css`'s own `:root`:

| token | SKILL.md says | live `styles.css` |
|---|---|---|
| `--ink` | `#1E1B16` | `#1B1E24` |
| `--terracotta` | `#B2472B` | `#C43E1F` |
| `--mustard` | `#D9A441` | `#E0A93A` |
| `--teal` | `#2B6660` | `#1F7A6C` |
| `--paper` | `#FBF9F4` | `#F5F6F5` |

All five differ. `CLAUDE.md` already carries the standing rule for this: always
grep `mockup/styles.css` for the token before hardcoding a hex anywhere. The
live block also defines `--terracotta-dim`, `--mustard-dim`, `--nav-menu-bg` and
`--nav-h`, which the skill does not mention at all. Treat the skill's CSS block
as historical and the stylesheet as the source of truth.

### PROJECT-BRIEF.md is a log, not a spec

It is genuinely useful for *why* decisions were made (the illustration
lessons-learned section and the Experiment Teardown design rules especially),
but its counts and structure are stale. It says "Site is now two pages, not one"
and tracks principles "36 → 42 → 43". Measured today:

- 49 HTML pages in `mockup/`
- 84 principle sections in `principles.html`
- 27 experiments, 9 Science Behind entries, 8 field sessions
- 202 ids in `apply-data.js`, 71 hand-written rows in `search-index.js`

`CLAUDE.md` is the live authority. Where the two disagree, CLAUDE.md wins.

---

# 3. Gold-standard exemplars

Five, mixed across content types. The Science Behind picks are not a taste call:
`authentic-voice` records that these four siblings were *measured* when the Up
Bank entry was rewritten, and they are the numeric baseline the site's voice is
calibrated against (21.3-23.5 words per sentence, Flesch-Kincaid 10.5-12.0).

### 1. `science-behind.html#japanese-selvedge-denim` — Science Behind
The cleanest object-first piece on the site. Starts from a thing a reader owns,
works back to the mechanisms, and never reaches for a study to justify the
object. It is one of the four measured voice baselines.

### 2. `science-behind.html#goalsaver-bonus-interest` — Science Behind
The best example of decoding a *real named Australian product* without tipping
into either marketing copy or a lecture. Also a measured baseline entry.

### 3. `science-behind.html#up-bank-teardown` — Science Behind (instructive, not just good)
Worth reading precisely because it failed twice and was fixed twice: first as
stuttered two-beat `<b>The feature.</b>`/`<b>The mechanism.</b>` paragraphs, then
as comma-chained run-ons at 30.9 words per sentence, before landing at 22.7.
Read it next to the two above to see the rhythm the site actually wants.

### 4. `sessions.html#high-school-money-talk` — Field Session
The first-person register done right: Grant's own talk at Airds High, his own
photos, no borrowed authority. This is the bar for "personal applied work" as
distinct from a reference article. Its five images are also the site's only
image set that has been explicitly watermark-audited and cleared.

### 5. `nobody-owns-a-bias.html` — Special Report
The argument-driven long form at its best: a real thesis about attribution and
priority, several cited sources tied to one claim. It is also the page where the
owner caught the "Nobel goes to economics, not psychology" heading, so the
current live version is post-correction and shows the fix in situ.

Spot-checked all of these today for sentence rhythm; every one sits well inside
the site's own thresholds (no sentence over 35 words with 5+ commas). Note my
extraction was a crude paragraph scrape, so the absolute figures I got run lower
than `authentic-voice`'s formally measured ones. The documented 21.3-23.5 range
in that skill is the number to trust, not mine.

---

# 4. Before → after rewrite samples

All five are real, verified today either against `authentic-voice`'s own
incident record or against the git history of this repo. Owner quotes are
verbatim from the skill's record of what he said.

### 4.1 The original catch — empty contrast
**Defect:** contrastive reveal ("X, not Y") where the negated half carries no
information, only false weight. Hallmark #1, the catch this whole discipline
came from.

- **Before:** `That's a proposed use, not a tested one.`
- **After:** cut; the plainer claim carries it alone.
- **Owner, 2026-08-22:** "I've picked up you writing like AI again. This not that etc."

The audit that followed reviewed 102 raw hits one by one: most were *kept*
because the distinction was load-bearing, five were fixed. This is a reading
call every time, never a find-and-replace.

### 4.2 A true negation that was still the tic
**Defect:** "not Y" was factually correct, but the reader had already been given
that fact two headings earlier in the same list. Contrastive form added shape,
not information. This is why question 5 (is it *new*?) exists.

- **Before:** `2002: the Nobel goes to economics, not psychology.`
- **After:** `2002: the Nobel goes to economics`  ← verified live in `nobody-owns-a-bias.html`
- **Owner:** "This is a hallmark of ai writing... Root cause. Fix and back fix and moving forward."

### 4.3 A title, caught twice on the same piece
**Defect, round one:** the reveal shape does not need the word "not." A premise
that pivots on "now" to a punchline restating the premise's own implication is
the identical tic, and a grep for "isn't/aren't/not" sails straight past it.
**Defect, round two:** the replacement passed the information test and still
failed, because "was never X. Y was." is itself stock reveal-copy template.

- **Before (v1):** `Netflix Built Its Pitch on Unlimited Choice. Now It Wants You to Stop Choosing.`
- **Before (v2):** `The Channel Netflix Spent a Decade Killing Might Be Coming Back. The Real Problem Was Never the Catalogue.`
- **After (live):** `The Channel Netflix Spent a Decade Killing Might Be Coming Back`
- **Owner, v1:** "That sounds like classic ai."
- **Owner, v2:** "The second sentence is classic ai... you need to be checking to prevent in future not just me."

Verified live today: the `<h1>` and `<title>` of
`the-channel-netflix-spent-a-decade-killing.html` both carry the single plain
sentence. The finding itself now lives in the body prose, in natural claim-first
order, where it reads as a clarification rather than a reveal.

### 4.4 Same template, found by back-fixing rather than by being caught
**Defect:** the "was never X" template again, on a different page, found by
grepping for the shape after 4.3 rather than waiting for the owner to flag it.

- **Before:** `The harm was never the information; it's inventing the shortage.`
- **After:** `Fabricating the shortage is what crosses the line.`  ← verified live in `principles.html` Scarcity
- Natural claim-first order, no dramatic pivot, same fact.

### 4.5 Machine-watermark register — four from the git history
**Defect:** not AI-tic but *AI fingerprint*: register too formal or too
templated for the site, the Smokehouse remediation pass. Each pair below is a
real diff from this repo, reproducible with `git show <sha>`.

- `f9d7ced` — **Before:** `they structurally estimated a welfare model that puts donation gains and unsubscribe costs into one comparable unit` → **After:** `they fitted a welfare model that puts...`
  *Defect: "structurally estimated" is journal register, not site register.*
- `87b6589` — **Before:** `...that show up whether or not anyone named them.` → **After:** `...that show up even when nobody named them.`
  *Defect: "whether or not anyone" is stilted; plainer clause does the same work.*
- `357f366` — **Before:** `Applicants who get the current generic decline message should report more of it.` → **After:** `Applicants on the current generic decline message should score worse on the same survey.`
  *Defect: vague "more of it" back-reference; the fix names the actual measure.*
- **`quietly`, sitewide:** 93 live uses → **0**, verified by grep today. Anthropic's
  own watermark FAQ names it as a classic stylistic tell. On this site it almost
  never added a fact the verb didn't already carry ("quietly compounds," "quietly
  erodes"). Atmospheric padding dressed as precision.

---

# 6. Stranded work from broken branches / sessions

Checked exhaustively. Good news, and it is genuinely good news:

**Nothing is stranded.** Only two branches exist on the remote:

- `claude/add-project-brief-350zjc`
- `claude/field-notes-cursor-export-8g8jf2` (current)

`git merge-base --is-ancestor` confirms the first is **fully merged** into the
current branch. `PROJECT-BRIEF.md` (44KB) is present and tracked. There are no
unmerged commits, no dangling work, and no uncommitted changes in the tree.

- **Project brief / .docx editorial work:** `MISSING: .docx editorial work` —
  no `.docx` or `.doc` file exists anywhere in the repo or this container, and
  neither `CLAUDE.md` nor `PROJECT-BRIEF.md` references one. The brief is
  markdown only. If Grant has .docx editorial work, it was never in this repo
  or this session's filesystem.
- **Unmerged prose:** `MISSING: unmerged prose` — nothing.
- **Decisions not yet written into CLAUDE.md or skills:** none found. The
  reverse is true: CLAUDE.md is unusually complete, carrying nine standing
  policies each with a root cause, a fix and a check. The only decision I would
  call under-documented is the palette drift in the exported skill, which is
  written up at the top of this file.

One real gap worth naming, since it is a decision the repo has made but not
recorded: `PROJECT-BRIEF.md`'s counts and its "two pages" framing are stale
against a 49-page site. Nothing states which of the two documents wins. In
practice CLAUDE.md does, and Cursor should be told so explicitly.

---

# 7. Naming map

### `design-options-review` = `oscarfinch-feedback-html`? — **YES**

Confirmed. `CLAUDE.md` lists `design-options-review` in its skill roster, but no
skill by that name exists on disk. The skill that actually serves that role is
`.claude/skills/oscarfinch-feedback-html/`, whose own description reads: "The
standing format for any 'give me options in HTML' request on this project
(behavioural-econ-site) — visual mockups, copy variants, decisions, research
summaries." It ships a `template.html` companion. Same job, different name.

`CLAUDE.md`'s roster line is the stale one, not the directory.

### Other aliases and near-misses Cursor should know

| Referred to as | Actually is | Note |
|---|---|---|
| `design-options-review` | `oscarfinch-feedback-html` | in repo, + `template.html` |
| `feedback-html` | `oscarfinch-feedback-html` | `feedback-html` is the **cricket** repo's equivalent. Different project, do not cross-apply. |
| `Smokehouse` | `.claude/skills/smokehouse/` | code name, invoked by saying it. On-demand remediation, distinct from always-on `authentic-voice`. |
| `my-writing-style` | — | never created. See section 1. |
| `predictive-search-component` | `mockup/predictive-search.js` + `search-index.js` policy in CLAUDE.md | a component and a standing policy, never a skill |

### Not a rename, but a content-type map worth having

Five content types, five skills, and they are deliberately distinct. Picking the
wrong one is the documented failure mode:

- `behavioural-principle-article` — mechanism-first, one academic study *(the exported one)*
- `science-behind-article` — object-first, a real thing a reader encounters
- `experiment-blueprint` — a testable future control-vs-treatment design
- `field-session` — Grant's own talk, first person, his own photos
- `special-report` — argument-first, one thesis, several cited sources
- `natural-experiment-breakdown` — method-first, how one study proved cause without an RCT
