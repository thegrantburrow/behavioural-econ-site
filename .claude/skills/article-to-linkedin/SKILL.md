# Article to LinkedIn

## Why this exists

Founded 2026-08-27 on a direct request: turn a published site piece (the NRMA
tactile-premium special report, first) into a short LinkedIn post that
actually sounds like the owner, not a marketing summary of the article. His
own framing of the brief, in full: a short post in his voice, a reason for
sharing that isn't generic, a collage of the article's own key images, a
direct link, and 2-4 hashtags that aren't contrived. Every future "turn this
into a LinkedIn post" request for this site should go through the same
pipeline, not a one-off summary written from scratch each time.

## What this deliverable is, and isn't

It's a short, personal LinkedIn post that points at a full site article,
written the way the owner would actually write a post, not a press-release
recap of the piece and not the article's abstract with a link tacked on. It
is going out under his name on a public platform, so the standing global
policy in his own `~/.claude/CLAUDE.md` applies in full: **a finished
document must read as genuinely his**, no review scaffolding, no
verification-status commentary, no AI prose tics, first person throughout.
Treat this the same as a CV or a cover letter for that purpose, just shorter
and public.

## Prerequisite: a voice profile must exist

This only works if `~/.claude/skills/my-writing-style/SKILL.md` exists. If it
doesn't, stop and run the `setup-writing-style` skill first (see that
skill's own guardrails on consent and sourcing); don't guess at how the owner
writes from the site's own editorial voice, which is a different, more
formal register aimed at a different reader. Once it exists, load it before
drafting every post this skill produces, not just the first one, and fold
back any feedback the owner gives on a specific post per that skill's own
"Updating this profile" section.

## The pipeline

1. **Read the source article in full**, not just its headline and intro. Pull out: the single most shareable insight (usually not the same as the article's own thesis statement, thesis is written for a reader already committed to a 5-minute read; a LinkedIn hook has one sentence to earn attention), the real citations with real numbers, and every real image actually embedded in the piece (a `.spotted-wild` photo, a `.case-grid` screenshot, a diagram). Never invent a number or a finding that isn't in the article itself.
2. **Find the real reason for sharing, not a placeholder one.** "Thought this was interesting" or "check out my latest piece" is exactly the generic framing the brief rejected. The real reason is almost always sitting in the article already: a genuine personal starting point (he found the actual physical object himself, a real professional stake (the finding bears directly on acquisition/retention/loyalty work he does), or a real surprise (the evidence points the opposite way from the obvious assumption). Name that specific reason in the post itself, early, the way his own real posts open on a real hook rather than a greeting.
3. **Draft the post applying `my-writing-style`.** Match its "doc / LinkedIn / external" surface section for structure (short paragraphs, a blank line between each, an emoji-bulleted list for a small sample of findings, no greeting), but don't force-fit a habit the profile documents for a different post type when it doesn't actually apply. His sampled posts are all live-event recaps with a named collaborator to thank early; an article share has no event and no collaborator, so that specific device gets dropped rather than manufactured, not silently, note it as a real gap between the sampled voice and this new post type when presenting the draft. Keep the length well under his usual 150-350 words when the post is pointing at a full piece rather than being the whole content itself, aim for roughly 120-220 words so the link still has a reason to be clicked.
4. **Build the collage from the article's own real images, nothing stock.** Composite the 2-4 images that most concretely show what the post is about (not every image in the piece, the ones a reader needs to see to get the point) onto one flat image sized for a LinkedIn upload (roughly 1400x1000 or 1200x1200 works well for two portrait-oriented photos side by side). Keep the composition restrained: the site's own paper background token (`#FBF9F4`), a thin ink-toned border per photo, generous margins, no added text, no drop shadows or gradients competing with the real photos. Check every source image against the site's standing no-watermark policy before it goes anywhere near the collage, the same check any image gets before `mockup/images/`. If the article's images are all portrait-oriented, don't force a square or landscape canvas that crops them, size the canvas around what the real images actually are.
5. **2-4 hashtags, each one earning its place.** A hashtag is contrived when it's generic enough to sit on any post about anything (`#marketing`, `#business`, `#growth`) or invented for this one post and unlikely to be a real, searched tag. Pull from his own real recurring set where it genuinely fits (`#behaviouraleconomics` shows up across every sampled post and fits almost everything on this site), and add one or two specific to this article's actual subject (a real, standard industry term like `#customerloyalty` or `#directmail`, not a compound invented for the occasion like `#printvsdigital`).
6. **Direct link, plain, no tracking parameters added.** The article's canonical URL (`https://www.grantburrow.com/<slug>.html`), on its own line, near the end of the post.
7. **Save the deliverable outside the deployed site.** GitHub Pages only publishes the `mockup/` directory (see `.github/workflows/*.yml`), so a LinkedIn post and its collage are not site content and don't belong there. Save to `linkedin-posts/<article-slug>/post.txt` (the plain post text, ready to paste, nothing else in the file, no headers or metadata) and `linkedin-posts/<article-slug>/collage.png` at the repo root.
8. **Run the same finishing checks any of his own finished writing gets** before calling it done: the `authentic-voice` skill's fourteen hallmarks (a LinkedIn post is exactly the kind of short, punchy writing where a contrastive "X, not Y" or a rule-of-three sneaks in), no em dash (his own real posts use a spaced hyphen for an aside, never `&mdash;` or `—`), and a genuine read-through from a LinkedIn scroller's seat, not a mechanical checklist pass. Present the draft, name any place a real pattern from the sampled voice didn't apply and had to be dropped or improvised, and invite correction the way `my-writing-style`'s own "Applying this profile" section asks for.

## A note on rigor

Nothing in this pipeline gets a pass on the site's own citation-honesty
standard just because it's a shorter, more casual format. A number quoted in
a LinkedIn post traces to the same verified citation as the article it
links to, and a claim the article itself already flagged as a reasoned
extension rather than a directly-tested finding (see `special-report`'s
citation discipline) stays flagged that way here too, in plain language, not
dropped for the sake of a punchier line.
