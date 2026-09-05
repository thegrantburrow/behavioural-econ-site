---
name: article-to-linkedin
description: >
  Use whenever drafting, revising, collaging, or Drive-archiving a LinkedIn post
  for Grant Burrow / grantburrow.com (article-share, principle-share, field-session
  recap, or any "turn this into a LinkedIn post" request). Trigger on phrasing like
  "LinkedIn post", "write a LinkedIn", "post this to LinkedIn", "collage for LinkedIn",
  or supplying a Topic/URL + hero image for a post. Always use this skill instead of
  improvising — soft randomisation, voice register, collage, and Drive embed rules
  are locked here. Load authentic-voice before calling any draft finished. Use
  oscarfinch-feedback-html for every draft review round.
---

# Grant Burrow — LinkedIn Post Writing Spec (for Cursor)

**Owner:** Grant Burrow / grantburrow.com (What Works & Why)  
**Purpose:** Give Cursor everything it needs to draft LinkedIn posts in Grant’s voice, build a simple collage, and archive to Google Drive — without producing five near-identical AI twins.  
**Mode:** Soft randomisation — keep a recognisable spine; rotate openers, mid-beats, phrasing, and closes so a batch does not look templated.  
**Date locked:** 2026-09-06 (from live corrections Sept 2024–2026)

---

## 0. How to use this file in Cursor

1. This skill is the standing pipeline for every LinkedIn post on this project.
2. For each post, the user supplies: **topic / principle URL**, **hero photo or screenshot** (or “use the one on the site”), and any **NOTE TO CURSOR** lines.
3. Before writing, Cursor must run the **Soft randomisation checklist** (§4) and write the chosen rotation IDs at the top of its private scratch notes (not in the post).
4. Deliver: (a) LinkedIn copy, (b) collage image, (c) when asked to save — Drive Doc with collage **embedded** + sibling `… collage.jpg`.
5. When Grant corrects wording, treat his paste as source of truth and update this spec’s relevant line in the same turn.
6. Also save locally under `linkedin-posts/<slug>/post.txt` + `collage.jpg` (outside `mockup/` — GitHub Pages only publishes `mockup/`).
7. Present every draft through `oscarfinch-feedback-html` with copy-edit textareas from round 1 (see §14).

---

## 1. Voice register (locked)

Write in Grant’s **LinkedIn / personal** register — not the website Field Notes voice.

| Do | Don’t |
|---|---|
| First person (`I`, `we`) | Third-person Field Notes tone |
| Warm, specific, real numbers | Vague quantifiers (“many”, “significant”) |
| Short paragraphs (1–3 sentences), blank line between | Dense walls of text |
| Spaced hyphen asides (`word - word`) | Em dashes (`—`) |
| `&` mid-sentence where natural (`joy & surprise`) | Forced “and” everywhere |
| Topic emoji as one finding per line when used | Emoji stuffed into every sentence |
| Slightly imperfect human texture | Over-polished corporate / AI smoothness |
| Light italics on one key word when it helps (`a *real* physical magazine`) | ALL CAPS emphasis or shouty formatting |

### Critical: leading “It”

- **Do** drop “It” only in `It was [adjective] to…` openers → `Was fantastic to lead this session…`
- **Do not** drop “It” from warm reflective lines. Prefer `It got me thinking…` over `Got me thinking…`

### Don’ts (hard bans)

- Em dashes
- Hollow AI fillers: `leverage`, `delve`, `unlock`, `elevate`, `seamless`, `robust`, `game-changer` (as lazy intensifier)
- Generic closes: `Thoughts?`, `Let's connect!`, `Thanks for reading!`
- Tidy rule-of-three summary sentence as the closer — end on one real specific thought
- Left/Right image stage directions in the post body (`Left:`, `Right:`)
- Claiming a spotted-in-the-wild photo **proved** sales moved — the photo is the example; the papers are the evidence

Also run `authentic-voice` before calling any draft finished (LinkedIn posts are short enough that contrastive “X, not Y” and rule-of-three closers sneak in easily).

---

## 2. Content spine (always present — order of *ideas*, not fixed sentences)

Every article-share / principle-share post should cover these **beats**. Soft randomisation changes *how* and sometimes *order of optional beats*, not whether the spine exists.

1. **Concrete moment** — a real, dated, first-person observation (app screen, mailbox, magazine, rate, sticker).
2. **Warm reaction** — `It got me thinking…` (or a rotated equivalent that still keeps “It” when reflective).
3. **Name the mechanism simply** — one or two plain sentences; real numbers when available.
4. **Parallel examples** (usually 2–3) — familiar everyday shapes so it is not a one-off (e.g. 6.99% vs 7.00%, $29,990 vs $30,000). Illustrations, not fake studies.
5. **Tension question** — `If X shouldn’t move a decision that much - what might be going on?`
6. **Harness / commercial stake** — behavioural science might be doing real work; orgs could harness it for acquisition & retention (see phrase bank).
7. **Active ingredients** — 2–4 emoji lines; lead-in preferably `A few active ingredients that might be going on:`
8. **Evidence beat** — one short sentence naming **2–3 real papers** (authors + one-clause hook). No study summaries.
9. **Link handoff** — service to the reader, then URL on its own line.
10. **Soft wonder close** — forward-looking, trailing ellipsis, one specific thought.
11. **Hashtags** — 5–7 from the standing set + 1–2 topic tags.

Optional (rotate in/out): inclusive “you” invitation in the open; one italicised key word; a mid-thought ellipsis in the harness line.

### Event / field-session recaps (different spine, same voice)

When the post is a live-session or program recap rather than an article/principle share:

- Prefer Grant’s own past posts about that **same named program** over generic article-share defaults (hashtags, framing, caption devices). Facts from a different year (names, headcounts) do **not** carry over — leave a visible gap rather than guessing.
- Drop the collaborator-thanks paragraph only when there is no confirmed name for *this* occurrence; say so in the review artifact.
- Dropped opening “It” is allowed on `Was fantastic to lead…` openers; keep “It” on reflective lines.
- Still use the link-handoff register when a matching Field Session / site write-up exists.
- Precision: if an action was staged/demoed, say so (`hypothetically` spend, etc.) rather than implying a real purchase.

---

## 3. Soft randomisation (required for every draft)

**Goal:** Five posts in a week should feel like the same person noticing different things — not the same Mad Libs template with nouns swapped.

### 3.1 Anti-twin rules (hard)

Before delivering a draft, Cursor must check the **last 4 posts** in this conversation or Drive folder (if known). Then enforce:

1. **Opener family must differ** from the immediately previous post (do not use the same opener ID twice in a row).
2. **At most 2 of the last 4 posts** may use the same opener family.
3. **Findings layout must differ** from the previous post (emoji-list vs prose vs hybrid).
4. **Close family must differ** from the previous post.
5. **Do not** reuse the exact harness sentence verbatim if it appeared in the previous post — pick another variant from the bank.
6. **Do not** start three consecutive posts with the same first three words.
7. Parallel-example *slot* can repeat (rate / sticker / menu) but **numbers and nouns must be topic-true**, not copy-pasted from an unrelated post unless they genuinely fit.

### 3.2 Rotation tables

Pick **one ID from each table** per post. Prefer random / hash of topic slug; if that collides with anti-twin rules, pick the next unused ID.

#### A — Opener family

| ID | Pattern | Example shape |
|---|---|---|
| A1 | Inclusive wonder | `I wonder if - like me - a couple of days ago you received…` |
| A2 | Solo concrete moment | `Last week I opened the McDonald's app and there it was - …` |
| A3 | Dated mail / object | `A couple of days ago I received the physical copy of … in the mailbox.` |
| A4 | Noticed-in-the-wild | `I keep noticing … sitting one cent under a round number.` |
| A5 | Contrast open | `On paper it's only one cent. In how it feels, it's a different price.` |
| A6 | Question-first | `Why does $0.99 feel so different from $1.00 - when they're a cent apart?` |

#### B — Reaction line

| ID | Line bank (keep “It” on reflective ones) |
|---|---|
| B1 | `It got me thinking about…` |
| B2 | `It got me thinking - …` |
| B3 | `It stopped me for a second - …` |
| B4 | `That small detail got me thinking about…` (no leading It — only when the subject is already named) |

#### C — Parallel-example placement

| ID | Placement |
|---|---|
| C1 | Right after naming the mechanism (before the tension question) |
| C2 | Inside the active-ingredients list (as emoji lines) |
| C3 | Both: one short prose line early + one emoji line later (no exact repeat) |
| C4 | Omit separate prose parallels if the hero + ingredients already carry 3 concrete shapes |

#### D — Findings layout

| ID | Layout |
|---|---|
| D1 | Lead-in + 3 emoji lines |
| D2 | Lead-in + 2 emoji lines + one short prose beat |
| D3 | No lead-in label; three short paragraphs instead of emoji (rare — use ≤1 in 4 posts) |
| D4 | Lead-in + 4 emoji lines when the principle genuinely has four clean hooks |

Lead-in preference: `A few active ingredients that might be going on:`  
Allowed alternates (max 1 in 3 posts): `A few things that might be doing the work:` / `What's quietly doing work here:`

#### E — Harness / commercial line

| ID | Variant |
|---|---|
| E1 | `Real tangible behavioural science might be doing real work here - and it might be possible to harness by more organisations in interesting & creative ways… that drive better acquisition & retention outcomes.` |
| E2 | `Real tangible behavioural science might be doing real work here - and it might be harnessed by more organisations in interesting & creative ways that drive better acquisition & retention.` |
| E3 | `There's a commercial version of this hiding in plain sight - acquisition, retention, and how a number is framed before anyone "decides."` |
| E4 | Skip a long harness paragraph; let the tension question + ingredients carry the stake (use ≤1 in 4 posts) |

#### F — Link handoff

| ID | Variant |
|---|---|
| F1 | `I did a short piece on it for those interested where I share more and the commercial outcomes that may improve if harnessed in practical ways:` then URL |
| F2 | `I wrote this up properly here if useful - more on the mechanism and where it shows up commercially:` then URL |
| F3 | `Full write-up (study, caveats, and where it shows up in the wild):` then URL |

Prefer F1 as default; rotate F2/F3 so F1 is not every post.

#### G — Close family

| ID | Pattern |
|---|---|
| G1 | `I wonder where else …` + trailing ellipsis |
| G2 | `I wonder whether anyone's actually measured what that … is doing…` |
| G3 | `Still thinking about where else this same shape is sitting in plain sight…` |
| G4 | One specific curiosity without “I wonder” (≤1 in 4 posts) |

### 3.3 What must stay stable (do not “randomise away”)

- Spaced hyphens, not em dashes  
- Evidence honesty (photo ≠ proof of lift)  
- 2–3 real paper names when leaning on research  
- Hashtag core set  
- First-person warmth  
- Site URL pointing at the real principle / Field Note  

---

## 4. Soft randomisation checklist (run every draft)

Copy into scratch, fill, then write:

```
Topic slug:
Previous post opener ID (if known):
Chosen: A__ B__ C__ D__ E__ F__ G__
Anti-twin OK? (opener ≠ last; layout ≠ last; close ≠ last): Y/N
Parallel examples topic-true? Y/N
Photo framed as example not proof? Y/N
```

If any N → re-roll the colliding ID before drafting.

---

## 5. Evidence without bluster

When the post leans on behavioural science:

- After findings, **one** short sentence naming **2–3 real papers** — authors + one-clause hook only.
- Shape: `There's real research behind those, not just intuition - [Author] on [hook], [Author] on [hook], [Author] on [hook].`
- Prefer “might be going on” over overconfident causality.
- Spotted-in-the-wild screenshots are **examples of the pricing/shape**, not evidence the missing cent / digit caused a measured lift unless the cited study is about that exact setting.
- Valuation / perception studies: prefer “can be perceived as worth more” / “people valued more” over flat “is worth more.”

Pull paper names from the live grantburrow.com principle page for that topic whenever possible. Read the source article in full before drafting — never invent a number or finding that isn’t in the piece.

---

## 6. Links & hashtags

### Link targets

Use the real page for the principle or Field Note, e.g.:

- https://www.grantburrow.com/the-tactile-premium  
- https://www.grantburrow.com/principles#left-digit-bias  
- Other principles: `https://www.grantburrow.com/principles#<slug>`

URL on its **own line** after the handoff sentence. No tracking parameters.

### Hashtags

End with 5–7 tags. Core set (usually include most):

`#behaviouraleconomics` `#behaviouralscience` `#experimentation` `#outcomes` `#customers` `#measurement`

Plus 1–2 topic tags (`#print`, `#pricing`, etc.). No hashtag walls of 15+. Topic tags must be real industry terms, not invented compounds.

---

## 7. When Grant pastes a draft

1. His words = source of truth.  
2. Fix only clear grammar / incomplete clauses / forbidden em dashes.  
3. Do not rewrite metaphors, questions, or cadence into a tidier AI version.  
4. Honour `(NOTE TO CURSOR …)` / `(NOTE TO GROK …)` then strip those notes from posted copy.  
5. Parenthetical asides that read as instructions to Cursor (`(five link to the article…)`) are directives, not copy — resolve them, don’t paste them.  
6. If he updates wording after a Drive save: rebuild Doc with new copy + same collage embed; trash outdated Doc; keep sibling JPEG unless collage changed.  
7. Fold lasting pattern fixes back into this skill in the same turn (not just the one post).

---

## 8. Collage / image (full pipeline)

### Design rules

- Simple: real photos / screenshots from the article / session, nothing stock  
- Canvas often **1200×1200** for LinkedIn  
- Quiet warm background (e.g. soft beige / site paper `#FBF9F4`) — not neon  
- Captions: **Liberation Serif Bold**, large enough to read in-feed  
- **Vertically center** the full block (image + caption) on the canvas — not stuck to the top  
- Low-key captions under images — not handwritten sticky notes or shouty callout cards unless asked  
- Thin ink-toned border per photo, generous margins; no drop shadows competing with the photos  
- Do not put Left/Right stage directions in the post copy  
- Check every source image against the site’s no-watermark policy before compositing  

### Caption voice

Short, specific, quiet. Examples:

- `One cent under a dollar.`  
- `Still printed. Still mailed.` / `Digital hub alongside it.` (when two-panel)

Rotate caption wording with the topic; do not reuse the same caption across unrelated posts.

### Crowd / bystander faces (hard)

Blur identifiable bystanders (students, workshop attendees, anyone who didn’t agree to appear in a LinkedIn post) **before** the collage ships — even if the same unaltered photo is fine on `sessions.html`.

- Per-face only: separate small ellipse over each visible face, light Gaussian, soft feather. Never a whole-crowd band or room-wide blur.
- Never blur Grant; never blur a named adult professional colleague who is a willing participant.
- Automated face detection is worth one attempt; fall back to manual coordinate mapping if it fails (common on angled classroom shots).
- When he flags both “too much blurred” and “too strong,” fix precision and subtlety together on the next attempt.

---

## 9. Drive archive (full pipeline — mandatory when saving)

### Folder & naming

- Folder: **Behavioural Economics > LinkedIn Posts**  
  - Behavioural Economics id: `1JBPEPkhPhEK7Dh7TZemvIhfMxQ298LT-`  
  - LinkedIn Posts id: `12-PUomRxY3PcPIrBJCU_WlawdjKI0Y9W`  
- Naming: **`YYYYMMDD`** prefix (Australia/Sydney date) + short title  
  - Doc: `20260904 NRMA Open Road – tactile premium LinkedIn`  
  - Photo: `20260904 NRMA Open Road – tactile premium LinkedIn collage.jpg`  

### Two files every time

1. **Google Doc** — post copy **and** collage embedded as a **native** Docs image  
2. **Sibling JPEG** — downloadable collage for LinkedIn upload  

Sibling alone ≠ archive. Doc without downloadable photo ≠ complete handoff.

### Embed method (verified)

1. Build a local `.docx` with collage as real Word inline picture (`word/media/image1.jpg` via python-docx `add_picture`), then post paragraphs. Image first, copy below.  
2. Keep embed JPEG modest (~30–40 KB; ~28 KB at ~480px worked). Large `base64Content` gets truncated / rejected.  
3. Upload via Drive `create_file`:  
   - `contentMimeType`: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`  
   - `base64Content`: full docx  
   - `parentId`: LinkedIn Posts id  
   - Do **not** set `disableConversionToGoogleType` (must convert Word → Google Doc)  
4. Upload sibling as `image/jpeg` with `disableConversionToGoogleType: true`.  

### Verify before sending links

- Doc `fileSize` is tens of KB (not ~1 KB)  
- Export as docx → unzip → `word/media/image*.jpg` is a real JPEG (`FF D8`), tens of KB — not a ~70-byte placeholder  
- HTML `<img src="data:…">` or Drive URL in text export is **not** proof of a native image  
- Sibling JPEG exists in the same folder  
- Body matches latest wording  

### Failed approaches (do not retry)

- Text-only Google Doc / `textContent` only  
- HTML + data-URI image  
- HTML + `drive.google.com/uc?id=…`  
- Sidecar JPEG **instead of** embed  

---

## 10. Worked examples (spine same — rotation different)

### Example 1 — NRMA / tactile premium (opener A1, layout D1, close G1)

See live locked copy pattern:

- Inclusive wonder open (“I wonder if - like me… mailbox”)  
- `It got me thinking…` + `*real*` + `digital age`  
- Facts (1927, 1.3M, digital hub alongside)  
- Tension question  
- Harness E1  
- Three emoji ingredients + Peck & Shu / Mangen / Atasoy & Morewedge  
- Link: https://www.grantburrow.com/the-tactile-premium  
- Wonder close + `#print`

Local reference: `linkedin-posts/the-tactile-premium/post.txt`

### Example 2 — Left-digit / McDonald’s $0.99 (opener A2, parallels C1, close G2)

- Solo app moment open  
- Mechanism in plain words  
- Parallels: 6.99% vs 7.00%, $29,990 vs $30,000  
- Ingredients include odometer threshold (Lacetera, Pope & Sydnor) + Thomas & Morwitz  
- Photo = example of shape, not proof the missing cent sold more  
- Link: https://www.grantburrow.com/principles#left-digit-bias  

Use these as **reference texture**, not as paste templates for new topics.

---

## 11. Delivery checklist (before Grant sees it)

- [ ] Soft randomisation checklist filled; anti-twin OK  
- [ ] Sounds like a person talking (especially any dropped “It”)  
- [ ] No em dashes; no banned AI fillers; no generic close  
- [ ] Evidence beat present if research is claimed  
- [ ] Photo framed honestly  
- [ ] Collage: Liberation Serif Bold caption, vertically centered, readable  
- [ ] Crowd faces blurred if needed (§8)  
- [ ] Local `linkedin-posts/<slug>/` saved  
- [ ] If saving: Doc embed verified by unzip + sibling JPEG in folder  
- [ ] Hashtags + correct URL  
- [ ] `authentic-voice` pass done  
- [ ] Review HTML via `oscarfinch-feedback-html` ready  

---

## 12. Input template (user → Cursor)

```
Topic / URL:
Hero image: [path or "use site image at …"]
Must include parallels: [e.g. 6.99% / $29,990 or none]
Tone notes / NOTE TO CURSOR:
Save to Drive?: yes/no
Previous post opener ID (if known):
```

---

## 13. One-line mission

Write like Grant noticed something in the wild, got curious, named the mechanism without bluster, pointed to real papers, and left the reader wondering — then archive the post with the photo **in** the Doc and **beside** it in Drive — and never let five posts share the same skeleton word-for-word.

---

## 14. Feedback loop (standing)

Every draft uses `oscarfinch-feedback-html` with copy-edit `<textarea data-copytext>` cards pre-filled from round 1 — opening hook, findings, commercial/harness line, closing line, hashtags as separate cards. Collage card stays binary toggle + comment (image, not prose). After he edits:

1. Apply his words as source of truth (§7).  
2. Feed lasting patterns back into this skill and any writing-style profile in the same turn.  
3. Rebuild Drive Doc if already archived.

---

## 15. Pipeline order (quick)

1. Read source article / principle page in full; pull real numbers, papers, images.  
2. Fill soft-randomisation checklist (§4); re-roll collisions.  
3. Draft copy (§1–§6 spine + rotations).  
4. Build collage (§8); blur faces if needed.  
5. Save `linkedin-posts/<slug>/post.txt` + `collage.jpg`.  
6. `authentic-voice` + delivery checklist (§11).  
7. Present via `oscarfinch-feedback-html`.  
8. On “Save to Drive”: §9 verified Doc embed + sibling JPEG.  
