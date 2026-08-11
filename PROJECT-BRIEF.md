# Field Notes — Project Brief

## What this is
A website about applied behavioural economics — showing how behavioural science
principles show up in real consumer moments (retail signage, app notifications,
subscription pricing, menus, shopfronts). Built from the owner's own photos of
real examples encountered in daily life, plus original research/case studies.

**Mission statement (hero copy, locked):**
> "You're already doing behavioural economics. Probably without knowing it.
> And probably doing it badly."
>
> Follow-up line: "This is a field guide to the forces already shaping how
> people decide — so you can use them deliberately, not by accident."

## Tech stack (decided, not yet built)
- **Framework:** Next.js, hosted on **Vercel** (auto-deploys from this GitHub repo)
- **CMS:** Sanity.io (free tier) — for managing posts/case studies/photos without code
- **Newsletter:** Beehiiv (free up to 2,500 subs) — better fit than ConvertKit for a
  polished, photo-led site
- **Repo:** github.com/thegrantburrow/behavioural-econ-site (created, cloned locally)

## Design system
- **Palette:** ink `#1C1A17` (not pure black), terracotta `#B2472B`, mustard
  `#D9A441`, teal `#2A6660`, cream `#F5F0E8`. Bellroy-inspired restraint — NOT neon,
  NOT gaudy. Bold colour used in confident blocks (Unloan-style), not just accents.
- **Type:** Georgia/serif for headlines (editorial, has character), system sans for
  body/UI. No monospace anywhere — earlier drafts used mono for labels, explicitly
  rejected as "typewriter/bad."
- **Aesthetic references:** Bellroy (restraint, photography-led, warm neutrals),
  Unloan (bold colour blocks, dynamic layout), Vox (editorial illustration),
  New Yorker cover illustration (flat/detailed vector scenes, NOT simple icons)

## Homepage structure (validated layout)
1. Hero — mission statement above
2. "See it in practice" — compact icon row linking to 5 principle sections (anchor
   links, same-page jump, not separate pages)
3. One detail section per principle: icon + one-line definition + illustration +
   caption naming the real photo it's based on
4. "More to explore" — Case Studies / Articles / Insights as secondary nav
5. Newsletter signup, footer

## The 5 launch principles (final, precisely researched)
Originally 6 were drafted; two were merged after realising they illustrated the
same underlying mechanism. **Do not re-split these:**

1. **Anchoring** — real photo: "Super Deal" retail sign, $399.99 next to a
   struck-through $1,349.99 RRP.
2. **Sludge (Obstruction)** — real photo: a subscription cancellation flow showing
   a "before you go" retention offer. Precise terms: **Sludge** is Thaler &
   Sunstein's term for friction added against the user's interest; **Roach Motel**
   is the dark-pattern category (easy in, hard to leave); **Obstruction** is the
   specific mechanism (interrupting a cancellation with a retention offer) — this
   is one of six dark patterns the FTC charged Amazon with in its 2023 Prime
   lawsuit, and is now directly targeted by the FTC's "Click-to-Cancel" rule.
   NOT loss aversion — that was the original (wrong) label.
3. **Zero Price Effect** — real photo: app push notifications offering FREE items,
   not discounts.
4. **Decoy Effect (Asymmetric Dominance)** — TWO real photos in one section: (a) a
   subscription pricing screen where "Best Value" is actually the *cheapest*
   option, not the middle one (so it's not really "medium maximisation," which was
   the original wrong label), and (b) a gelato menu's scoop-size ladder
   (Single/Double/Triple). Academic source: Huber, Payne & Puto (1982). Classic
   illustration: Ariely's Economist subscription study.
5. **Operational Transparency** — real photo: a fry shop's fully open glass
   kitchen with "HAND CUT FRIES" signage — watching the work happen increases
   perceived value.

## Illustration approach — lessons learned (important, read before redoing work)
Several rounds of hand-coded SVG illustration were attempted and rejected:
- Pure icon/diagram style: rejected as "not real illustration"
- Painterly/photorealistic SVG: technically impossible with hand-coded vector
  graphics — this is a hard ceiling, not a skill issue
- Flat New Yorker-cover-style **invented scenes** (metaphorical, not tied to the
  actual photos): rejected — must be recognisably the actual photographed scene
- Flat New Yorker-style **faithful redraws** of the actual photos: accepted as
  the right direction, but hand-drawn human figures kept coming out anatomically
  wrong (self-intersecting SVG paths causing stray black shapes, unrecognisable
  proportions) even after 6 rounds of iterative fixing

**Current direction (in progress when this brief was written):** abandon manual
SVG tracing. Use **automated photo-stylisation filters** instead (OpenCV: bilateral
filtering + adaptive threshold edge detection + k-means colour quantisation,
similar to how Prisma-style apps work) applied directly to the real photos —
this preserves real human proportions/detail because it starts from the actual
photo. Three filter directions tested and liked in principle (classic cartoon,
posterised flat-colour, ink linework); vibrant colour version of the "classic
cartoon" variant (bilateral filter + edge overlay, saturation boosted on the
source before filtering) was the strongest result so far. The posterised and
ink-linework variants need their colour pipeline fixed (boost saturation
*before* k-means quantisation, not after, or they collapse toward sepia).

This is why the **eachlabs style-transfer skill** is being installed — to get
genuine AI-based style transfer rather than OpenCV approximations.

## Photos already collected (in original chat, need to be re-uploaded/sourced)
- Super Deal retail sign (anchoring)
- Subscription cancellation "before you go" screen (sludge)
- FREE item push notifications, KFC/McDonald's (zero price effect)
- Subscription pricing tiers screenshot (decoy effect, photo 1)
- Gelato shop menu board, scoop sizes (decoy effect, photo 2)
- Hand Cut Fries open-kitchen shopfront (operational transparency)
- A gelato counter interior shot (Lunetta) — used as the test subject for the
  illustration-style iteration work; two staff members serving, one with
  glasses/ponytail standing upright, one bent forward into a low tub, a
  sharp-focus hand reaching in from the foreground

## Open decisions / next steps
- Get eachlabs style-transfer skill actually generating output on the gelato
  photo and the 6 principle photos
- Once illustration style is finalised, apply to all 5 principle photos
  consistently
- Scaffold the actual Next.js project (not yet started — only mockups exist so far)
- Set up Sanity + Beehiiv accounts when ready to go live
