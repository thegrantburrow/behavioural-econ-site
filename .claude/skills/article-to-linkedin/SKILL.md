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

The first real draft went through one round of his feedback before he'd post
it. That round is folded into the pipeline below (see "Round 1 feedback" at
the end) rather than kept as a one-off fix, since every failure mode it
surfaced will recur on the next article if it isn't codified here.

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
2. **Find the real reason for sharing, and frame it as a service to the reader, not a report on your own work.** "Thought this was interesting" or "check out my latest piece" is exactly the generic framing the brief rejected, but so is a post that reads as "here's some research I did", even a specific, real reason for writing it. His round-1 correction, verbatim: less about the research itself and more "here is some of the interesting behavioural science behind it and how you might harness it in practical ways yourself". Open on a real, concrete, dated personal moment (he received the actual magazine two days ago, he found the actual object in his letterbox), then pivot straight to what the reader can do with the mechanism, not to a description of the piece he wrote. Don't restate the same idea across the first two paragraphs, if the opening moment and the pivot line are both explaining "why does this physical thing still exist", that's one idea said twice, cut one.
3. **Draft the post applying `my-writing-style`.** Match its "doc / LinkedIn / external" surface section for structure (short paragraphs, a blank line between each, an emoji-bulleted list for a small sample of findings, no greeting), but don't force-fit a habit the profile documents for a different post type when it doesn't actually apply. His sampled posts are all live-event recaps with a named collaborator to thank early; an article share has no event and no collaborator, so that specific device gets dropped rather than manufactured, not silently, note it as a real gap between the sampled voice and this new post type when presenting the draft. Keep the length well under his usual 150-350 words when the post is pointing at a full piece rather than being the whole content itself, aim for roughly 120-220 words so the link still has a reason to be clicked.
4. **The findings list is 2 main drivers, elaborated, not 3+ raw stats.** A first pass at this skill listed every citable finding in the article as its own one-line emoji bullet, mimicking the shape of his real "small sample" lists without their substance. His correction: pick the top 2 actual drivers of the argument, give each a little real elaboration in plain language, and use the specific numbers and citations as a parenthetical backing detail at the end of that bullet, not as the bullet's entire content. A third genuinely supporting finding can move into the surrounding prose instead of getting its own bullet, it doesn't need equal billing just because the article cites it.
5. **Build the collage from the article's own real images, nothing stock.** Composite the 2-4 images that most concretely show what the post is about (not every image in the piece, the ones a reader needs to see to get the point) onto one flat image sized for a LinkedIn upload (roughly 1400x1000 or 1200x1200 works well for two portrait-oriented photos side by side). Keep the composition restrained: the site's own paper background token (`#FBF9F4`), a thin ink-toned border per photo, generous margins, no added text, no drop shadows or gradients competing with the real photos. Check every source image against the site's standing no-watermark policy before it goes anywhere near the collage, the same check any image gets before `mockup/images/`. If the article's images are all portrait-oriented, don't force a square or landscape canvas that crops them, size the canvas around what the real images actually are.
6. **Hashtags: use his real recurring cluster, don't force a 2-4 cap.** The original brief said "2-4 hashtags that aren't contrived", read the first time as a hard ceiling, which produced a thinner set than he actually wanted. His round-1 correction added four more from his own documented recurring set (`#behaviouralscience #customers #experimentation #outcomes`) on top of the three already there, landing at 7, which matches `my-writing-style`'s own documented range for him (5-7 tags per post) exactly. Default to his real cluster at its natural size, then add only the one or two genuinely article-specific tags on top (a real, standard industry term like `#customerloyalty` or `#directmail`, not a compound invented for the occasion like `#printvsdigital`). "Not contrived" is the actual bar, not a specific number.
7. **Direct link, plain, no tracking parameters added.** The article's canonical URL (`https://www.grantburrow.com/<slug>.html`), on its own line, near the end of the post.
8. **Close on a plain, specific thought, never a tidy summary aphorism.** A first pass closed with "Digital is still cheaper to produce and send. Touch, memory, and price all point the other way", a rule-of-three wrap-up sentence that reads exactly like generated copy dressing up a plain point as a considered one. His catch, verbatim: "This first line reads like classic ai. Sounds like me as a human." The fix wasn't softer wording, it was structural: drop the neat list-of-three-things-that-point-the-other-way shape entirely and end on something a specific person would actually say out loud, a real question posed to the reader, a genuine next step, a plain observation with one real idea in it, not three packaged as a flourish.
9. **Save the deliverable outside the deployed site.** GitHub Pages only publishes the `mockup/` directory (see `.github/workflows/*.yml`), so a LinkedIn post and its collage are not site content and don't belong there. Save to `linkedin-posts/<article-slug>/post.txt` (the plain post text, ready to paste, nothing else in the file, no headers or metadata) and `linkedin-posts/<article-slug>/collage.png` at the repo root.
10. **Run the same finishing checks any of his own finished writing gets** before calling it done: the `authentic-voice` skill's fourteen hallmarks (a LinkedIn post is exactly the kind of short, punchy writing where a contrastive "X, not Y" or a rule-of-three sneaks in), no em dash (his own real posts use a spaced hyphen for an aside, never `&mdash;` or `—`), and a genuine read-through from a LinkedIn scroller's seat, not a mechanical checklist pass. Present the draft, name any place a real pattern from the sampled voice didn't apply and had to be dropped or improvised, and invite correction the way `my-writing-style`'s own "Applying this profile" section asks for.
11. **Use the standing `oscarfinch-feedback-html` format to collect his feedback, item by item.** Don't just show the post as flowing text and wait for a verdict. Break it into the same real decisions this skill makes (opening hook, findings list, any commercial/practical-impact paragraph, closing line, collage, hashtags) as separate cards in that project's standard feedback template, so a "needs work" lands on the specific piece it's about, not the whole post. This is what actually produced the round-1 corrections below, a single freeform "thoughts?" would have gotten a vaguer answer.
12. **From round 2 onward, once he's actually rewriting sentences rather than describing what's wrong, switch the feedback cards to the copy-edit variant.** See `oscarfinch-feedback-html`'s "A copy-editing request wants a live text box" section: a `<textarea>` pre-filled with the current copy per section, that he edits directly, instead of a toggle plus a comment describing the edit. His round-2 catch, verbatim: "want a section per content when the current copy is and I'll edit it … easier for this kind of copy editing." Round 1's toggle-plus-comment shape is still the right default for the very first pass (he's judging pieces, not yet rewriting them), but don't make him ask for the copy-edit variant twice on the same post, offer it as soon as a round produces an actual rewritten sentence in his feedback rather than a description of one.

## Round 1 feedback: what changed after his first review

The first real draft (the-tactile-premium.html post) shipped with a rhetorical-question opener, a 3-item raw-stat findings list, a tidy rule-of-three closer, and 3 hashtags. Every one of those four choices got "needs work." The corrected pattern for each is folded into the numbered steps above (2, 4, 6, 8 respectively), not just fixed on that one post, because none of the four was specific to this article, they were all defaults this skill picked that turned out wrong for how he actually wants an article-share post to read. Treat round-1 feedback on the next article the same way: fix the post, then check whether the fix is really about that one post or about a default this skill should carry forward.

## A note on rigor

Nothing in this pipeline gets a pass on the site's own citation-honesty
standard just because it's a shorter, more casual format. A number quoted in
a LinkedIn post traces to the same verified citation as the article it
links to, and a claim the article itself already flagged as a reasoned
extension rather than a directly-tested finding (see `special-report`'s
citation discipline) stays flagged that way here too, in plain language, not
dropped for the sake of a punchier line.
