# cursor-export

The Claude-local material from the 2026-09-11 handover that does not belong in
`.claude/skills/`. Everything else from that export is already tracked
elsewhere in this repo, so it is deliberately not duplicated here. Read
`../CURSOR-HANDOVER.md` first: it is the actual handover document, covering the
exemplars, the before/after corrections, the branch audit and the naming map.

## What is in here

### `claude-local-skills/setup-writing-style/`

A generic Anthropic skill, not a Field Notes one. It is the tool that *builds* a
`my-writing-style` voice profile from a user's own sent writing. Ships
`SKILL.md` and `scripts/stylometry.py`, a 529-line pure-standard-library
script that filters writing samples, computes per-register style stats and picks
representative exemplars. Verified on 2026-09-11: it compiles, `--help` works,
and `--selftest` passes.

**It is parked here rather than installed.** Dropping it into
`.claude/skills/` would make it load in every session for this repo, and it has
no Field Notes role. Move the directory there if you actually want it active.

**No `my-writing-style` profile was ever built for Field Notes.** The site's
voice discipline lives in `authentic-voice` (the always-on finish check) and
`smokehouse` (the on-demand remediation pass), both of which carry real dated
incidents and the owner's own verbatim catches. Those are the authority on how
this site sounds. If a profile is ever generated, it supplements them and does
not replace them.

### `claude-local-skills/behavioural-principle-article-VERBATIM-ORIGINAL/`

`SKILL.md` exactly as it was found in the Claude-local synced skills path,
kept unaltered for the record.

**Do not build from this copy.** Its CSS token block had drifted from the live
site on all five brand colours. The corrected, annotated version is the live
skill at `.claude/skills/behavioural-principle-article/`, and
`mockup/styles.css` is the authority over both:

| token | this verbatim copy | live `styles.css` |
|---|---|---|
| `--ink` | `#1E1B16` | `#1B1E24` |
| `--terracotta` | `#B2472B` | `#C43E1F` |
| `--mustard` | `#D9A441` | `#E0A93A` |
| `--teal` | `#2B6660` | `#1F7A6C` |
| `--paper` | `#FBF9F4` | `#F5F6F5` |

Its `reference/case-studies-example.html` is byte-identical to the tracked one,
so only `SKILL.md` is duplicated here.

## What is not in here, and where it lives instead

| Export section | Now at |
|---|---|
| The handover document itself | `../CURSOR-HANDOVER.md` |
| behavioural-principle-article, ready to use | `../.claude/skills/behavioural-principle-article/` |
| Project knowledge | `../CLAUDE.md`, `../PROJECT-BRIEF.md`, `../VISUAL-SYSTEMS.md` |
| The other twelve skills | `../.claude/skills/` |

All of those were verified byte-identical to the export bundle before this
folder was written, which is why they are referenced rather than copied.

## Asked for in the export and genuinely absent

- `MISSING: my-writing-style` (never generated; see above)
- `MISSING: design-options-review` (the directory doing that job is
  `oscarfinch-feedback-html`)
- `MISSING: artifact-design`, `MISSING: dataviz` (Claude session built-ins with
  no file on disk; they govern Claude Artifacts publishing and have no use
  outside it)
- `MISSING: predictive-search-component` (never a skill; the real assets are
  `mockup/predictive-search.js` and the `search-index.js` sync policy in
  `CLAUDE.md`)
- `MISSING: .docx editorial work` (no `.docx` exists in this repo or the export
  container, and neither `CLAUDE.md` nor `PROJECT-BRIEF.md` references one)
