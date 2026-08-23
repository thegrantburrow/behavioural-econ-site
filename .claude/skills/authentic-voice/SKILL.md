---
name: authentic-voice
description: Use whenever writing or editing prose a reader will actually read on this site (principle articles, field sessions, experiment write-ups, special reports, nav copy, captions) or in any polished document for Grant. Checks for the specific patterns that make text read as AI-generated rather than human-written, catalogued from a real instance the owner flagged directly. Load this before calling any piece of writing finished, not just when told to.
---

# Authentic Voice

## Why this exists

On 2026-08-22 the owner flagged a sentence from a freshly written experiment blueprint: "That's a proposed use, not a tested one." His words: "I've picked up you writing like AI again. This not that etc." He was right. That sentence does no real work its plainer version couldn't do: the "not a tested one" half exists purely to make the sentence sound considered. A site whose entire pitch is real examples and real research over sounding smart cannot afford to read like a template. This skill exists so that catch doesn't have to happen twice.

## The research behind this

Ten hallmarks, drawn from documented patterns in AI-generated text (Wikipedia's WikiProject AI Cleanup style guide, Forbes' recurring "giveaway signs" series, and independent writing-craft audits), cross-checked against this site's own content:

1. **The contrastive reveal ("X, not Y").** A claim immediately followed by its negated opposite, used for rhetorical weight rather than because the negation adds information. This is the one that got caught. See below for the full test.
2. **Rule-of-three padding.** Grouping ideas or examples in threes (or fours) as a default rhythm, regardless of whether the content actually has that many parts.
3. **Hollow abstractions.** "boundaries," "landscape," "tapestry," "testament to," "at its core," "delve into," "unlock," "leverage," "elevate," "seamless," "robust," "game-changer": words that sound considered but could sit in front of any noun without changing the meaning.
4. **Throat-clearing announcements.** "Here's the kicker," "But here's the thing," "It's worth noting that," "It's important to note that": a promise of a payoff, stated instead of delivered.
5. **Stacked formal transitions.** "Moreover," "Furthermore," "Additionally," "Consequently" opening consecutive sentences or paragraphs like a debate outline.
6. **Redundant recap closings.** A final paragraph that opens "In conclusion," "In summary," "Ultimately," or "At the end of the day" and then just restates the paragraph before it, instead of ending on an actual last thought.
7. **Uniform sentence rhythm.** Every sentence roughly the same length, every paragraph the same shape. Smooth, but mechanical; real writing has short sentences next to long ones.
8. **Superficial analysis dressed as depth.** Confident, grammatical prose that doesn't actually add a new fact or a real insight, just restates the premise with more words.
9. **Stacked hedges.** "It's important to note," "it should be noted," "arguably," piled up to soften a claim instead of just making it.
10. **Personified abstractions.** "The data speaks for itself," "the research reveals," "this shift represents": treating a dataset or a trend as an agent with something to say.

Sources: [Forbes, "15 New Giveaway Signs of AI Writing" (Feb & May 2026)](https://www.forbes.com/sites/jodiecook/2026/02/03/the-15-new-giveaway-signs-of-ai-generated-content-in-february-2026/), [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), [Grammarly, "Common Words and Phrases in AI-Generated Content"](https://www.grammarly.com/blog/ai/common-ai-words/).

## The 2026-08-22 site audit: what a real pass looks like

Grepping the whole site for pattern #1 turned up 102 raw hits. Nearly all of them were fine. Going through every one taught the actual lesson this skill exists to encode: **a negation only earns its place when it's carrying real weight.**

Kept, because the distinction is the actual content:
- "Choices are made by relative comparison, not absolute judgment." (Decoy Effect's core mechanism, the sentence *is* the finding)
- "paraphrased from the abstract and secondary academic summaries, not quoted verbatim" (a citation-honesty disclosure required by this site's own sourcing standard, deleting it deletes real information)
- "Internal validity: A real grocery store, real purchases, not stated preference" (revealed vs. stated preference is a load-bearing methodological distinction in behavioural economics, not decoration)
- Bolded pull-quote lines like "Only the zero moved." and "The set, not the amount, became the target." (this site's deliberate, consistent `.flow-insight` / illustration-caption convention, a punchy standalone headline, not a mid-paragraph crutch)

Fixed, because the negation was empty rhetorical weight with no real payoff:
- "That's a proposed use, not a tested one" &rarr; "The principle proposes this; nobody has tested it." (two plain sentences, same information, no reveal)
- "...is a legitimate design choice, but it's not a neutral one" &rarr; "...is a legitimate design choice. It also shapes how much people spend." (says what it actually shapes, instead of just negating "neutral")
- "The first half of this is a strategy problem, not a statistics one" &rarr; "The first half of this is a strategy problem. Better statistics can't fix it." (states the real consequence instead of naming what it isn't)
- "That isn't friction added to punish a customer, it's putting back the cues a card removed" &rarr; "It puts back the cues a card removed." (the full "It's not X, it's Y" sentence shape, cut straight to the actual claim)
- Two uses of "perceived proximity, not real distance" inside one experiment's Theory and Hypothesis blocks &rarr; varied the second one entirely, because repeating the identical construction twice in one piece is itself the tic, even when each instance is individually defensible

## The test, before calling any sentence finished

For every "X, not Y" (or "It's not X, it's Y," or "isn't a Y, it's a Z") construction:

1. **Delete the negated half. Does the sentence lose real information, or just lose punch?** If a reader would learn something true and specific from "not Y" that they couldn't get from "X" alone, keep it. If "not Y" is just there to make "X" sound more considered, cut it or replace the whole sentence with a plainer claim.
2. **Is this a standalone bolded headline (a `.flow-insight`, a `.lesson`, an illustration caption), or is it sitting mid-paragraph as connective tissue?** This site's punchy one-line pull-quotes are a deliberate, consistent design convention, not the tic. The tic shows up embedded in ordinary explanatory prose, dressing up a plain sentence as a considered one.
3. **Has this exact construction already appeared once in this same piece?** One real contrastive clarification is a clarification. Two in one article is a crutch. Say the second one a different way, or don't say it at all.
4. **Would a specific person actually say this out loud, in this shape, making this particular point?** "A specific, citable, replicated finding, not a vibe" survives this test in a first-person field-session narrative because it has real personality and a real referent. "That's a proposed use, not a tested one" doesn't survive it anywhere; nobody talks like that.

Run the same four-question test against hallmarks 2 through 10 above when reviewing a full piece, not just #1. A rule-of-three that's actually three things is fine; a rule-of-three imposed on two things and a stretch isn't. A transition word is fine once; three in a row reads like an outline.

## The 2026-08-23 catch: CV and evidence-table content has its own tells

This skill was written against flowing editorial prose (principle articles, field sessions). Applying it to a bulleted CV-style evidence table for Grant's UTS Recognition of Prior Learning application, on his direct instruction to "ensure written as me not AI," surfaced two real failure modes the original ten don't name directly, both confirmed by grep against the actual file, not guessed at:

11. **Verbatim phrase reuse across entries.** The same descriptive phrase copy-pasted into two different bullet points ("anchoring, salience, default effects" used identically for two different employers; "structurally different" used twice to describe two different things). In flowing prose this reads as repetition; in a table where a reader compares rows side by side, it reads as templated filler dressed up as two separate observations. Fix: say the same underlying fact in a different way each time, or cut the repeat and let the first instance stand.
12. **Mechanical uniform bullet architecture.** Every bullet following the identical shape (`<b>Title, Company</b> (dates): verb-led clause`) is the bulleted-list version of hallmark #7's uniform sentence rhythm, and just as mechanical: a reader's eye slides over it as a template rather than reading each line as its own claim. Fix: vary which part of the bullet leads. Some open with the role, some with the outcome, some with the fact itself; the dates and title can trail in a clause instead of always fronting the sentence.

Hallmark #8 (superficial analysis dressed as depth) also has a sharper version in this context: **confidently describing what a role "must have involved" when the only real source is a bare job title and date range.** A CV bullet inferring specific responsibilities from a title alone, with no supporting detail in the actual source document, reads as embellishment even when every individual word is plausible. Fix: state the verifiable fact (title, dates, tenure) plainly, and only add interpretive claims about what the role actually entailed when the source material (a description, a stated achievement, a number) actually supports it.

## Before calling anything finished

Read the piece once, specifically hunting for these ten patterns, the way the owner's own global standing policy already asks for a "genuine last read-through from the reader's seat" before calling a document done. This is that read-through, scoped to sentence-level construction rather than document-level scaffolding. Run it on every new principle article, field session, experiment blueprint, and special report as a default step in finishing the piece.

This is a companion to, not a replacement for, the site's standing no-em-dash policy in `CLAUDE.md`. An em dash is one specific punctuation mark; this skill is about sentence-level habits that survive even after every em dash is gone.
