var APPLY_PRINCIPLES = [
  {id:"anchoring", title:"Anchoring", cat:"judgment", blurb:"The first number you see becomes the reference point every later number gets judged against, even when it's arbitrary."},
  {id:"sludge", title:"Sludge", cat:"friction", blurb:"Friction added deliberately against your interest, like a cancellation flow that interrupts you with a retention offer instead of letting you leave."},
  {id:"zero-price", title:"Zero Price Effect", cat:"pricing", blurb:"Free isn't just a low price. It's a different category of decision. Demand jumps disproportionately the moment a price hits $0."},
  {id:"decoy", title:"Decoy Effect", cat:"choice", blurb:"Add a third, clearly worse option and people switch to the option it makes look better, even though nothing about that option changed."},
  {id:"transparency", title:"Operational Transparency", cat:"friction", blurb:"Watching the work happen increases how much people value it, effort becomes visible, and visible effort feels worth more."},
  {id:"not-enough-choice", title:"Not Enough Choice", cat:"choice", blurb:"Removing an option doesn't just narrow a decision. It can make people want the eliminated choice more, and trust the chooser less."},
  {id:"choice-overload", title:"Choice Overload", cat:"choice", blurb:"More options can look generous, but past a point they don't help you choose. They make choosing itself the hard part."},
  {id:"zero-price-paradox", title:"Zero Price Paradox", cat:"pricing", blurb:"A price of exactly $0 can convert worse than a small positive price, because it invites scrutiny instead of feeling like a gift."},
  {id:"tradeoff-transparency", title:"Tradeoff Transparency", cat:"friction", blurb:"Showing what's being given up, not just what's being gained, leads to better decisions than presenting benefits alone."},
  {id:"behavioural-labels", title:"Behavioural Labels", cat:"social", blurb:"Label someone with the identity behind a behaviour, a voter, not someone who votes, and they act to stay consistent with it."},
  {id:"framing-effect", title:"Framing Effect", cat:"judgment", blurb:"The same fact, framed two different ways, changes how people feel about it, even though the underlying information is identical."},
  {id:"illusion-of-explanatory-depth", title:"Illusion of Explanatory Depth", cat:"judgment", blurb:"You feel certain you understand how something works, right up until you're asked to actually explain the mechanism, step by step."},
  {id:"social-proof", title:"Social Proof", cat:"social", blurb:"When people are unsure what to do, they copy what everyone else appears to be doing, treating popularity itself as evidence of quality."},
  {id:"social-norm", title:"Social Norm", cat:"social", blurb:"What most people actually do and what most people approve of are two different signals, and mixing them up can backfire."},
  {id:"compromise-effect", title:"Compromise Effect", cat:"choice", blurb:"Add a middle option to a lineup of two, and people disproportionately pick the middle one because it's the easiest choice to defend."},
  {id:"similarity-effect", title:"Similarity Effect", cat:"choice", blurb:"Add a second option that's very similar to an existing one, and the two split attention and share, leaving a distinct alternative better off."},
  {id:"goal-gradient", title:"Goal Gradient Effect", cat:"motivation", blurb:"Effort and motivation increase the closer you get to a goal, so a loyalty card with two stamps already filled in gets used faster than a blank one."},
  {id:"medium-maximization", title:"Medium Maximization", cat:"motivation", blurb:"Give people a token standing in for a reward, points, miles, stamps, and they'll sometimes work to maximise the token itself."},
  {id:"noise", title:"Noise", cat:"judgment", blurb:"Ask the same expert to judge the same thing twice on different days and you'll often get two different answers, because judgment itself is noisy."},
  {id:"price-transparency", title:"Price Transparency", cat:"pricing", blurb:"Showing the full, all-in price upfront changes not just what people buy, but how much and how carefully."},
  {id:"salience", title:"Salience", cat:"judgment", blurb:"The option or detail that visually or emotionally stands out gets weighted far more heavily than its actual importance justifies."},
  {id:"left-digit-bias", title:"Left Digit Bias", cat:"pricing", blurb:"$2.99 gets processed as two dollars something, not $2.99, because people anchor on the leftmost digit and round off the rest."},
  {id:"ordering-effects", title:"Ordering Effects", cat:"motivation", blurb:"The same set of options, presented in a different order, gets chosen differently, first and last positions draw disproportionate attention."},
  {id:"chunking", title:"Chunking", cat:"motivation", blurb:"Break a long string of information into small groups and it becomes dramatically easier to hold in mind, without adding a single new fact."},
  {id:"translating-information", title:"Translating Information", cat:"friction", blurb:"The same total cost feels completely different depending on the unit it's expressed in, a yearly cost and a daily one are the same number, restated."},
  {id:"emergency-reserves", title:"Emergency Reserves", cat:"motivation", blurb:"Build in a small, pre-approved allowance for slipping up and people persist at a goal for longer than if it demanded perfection."},
  {id:"pain-of-paying", title:"Pain of Paying", cat:"pricing", blurb:"The more directly and viscerally you feel the act of paying, the less you enjoy and the less you consume, even at the same price."},
  {id:"peak-end-rule", title:"Peak-End Rule", cat:"judgment", blurb:"You remember an experience almost entirely by its worst or best moment and how it ended, not by its average intensity."},
  {id:"illusory-truth-effect", title:"Illusory Truth Effect", cat:"judgment", blurb:"Hearing a claim repeated makes it feel truer, even if you correctly identified it as false the first time."},
  {id:"illusion-of-control", title:"Illusion of Control", cat:"judgment", blurb:"People act as though they can influence outcomes that are actually random or already fixed."},
  {id:"hindsight-bias", title:"Hindsight Bias", cat:"judgment", blurb:"Once you know how something turned out, it feels like you basically knew it all along, even on things that were genuinely uncertain."},
  {id:"survivorship-bias", title:"Survivorship Bias", cat:"judgment", blurb:"Studying only the survivors of a selection process gives a systematically distorted picture, because the failures are invisible."},
  {id:"take-the-best-heuristic", title:"Take-the-Best Heuristic", cat:"choice", blurb:"A simple rule that uses just one good piece of information can out-predict a complicated model trying to weigh everything."},
  {id:"choice-bracketing", title:"Choice Bracketing", cat:"choice", blurb:"Choosing once for a whole set of future decisions produces different choices than making each decision fresh, one at a time."},
  {id:"precision-effect", title:"The Precision Effect", cat:"pricing", blurb:"A precise number and a round one trigger different reactions, and precision doesn't always help."},
  {id:"default-effect", title:"Default Effect", cat:"choice", blurb:"Whatever option is pre-selected gets chosen at a dramatically higher rate than the same option would if you had to actively pick it."},
  {id:"mental-accounting", title:"Mental Accounting", cat:"pricing", blurb:"Money gets mentally filed into separate accounts by source or purpose, and a dollar in one account gets treated as worth less than in another."},
  {id:"endowment-effect", title:"Endowment Effect", cat:"pricing", blurb:"Merely owning something, even briefly, makes you value it more than you would if you didn't own it."},
  {id:"ikea-effect", title:"IKEA Effect", cat:"motivation", blurb:"Assembling or partly creating something yourself makes you value the finished result more than an identical item you didn't build."},
  {id:"ostrich-effect", title:"Ostrich Effect", cat:"judgment", blurb:"People selectively avoid checking information that might be bad news, even though not looking doesn't change the underlying reality."},
  {id:"order-effect", title:"Order Effect", cat:"judgment", blurb:"The same information, presented in a different order, produces a different overall impression: whatever arrives first anchors the rest."},
  {id:"shooting-the-messenger", title:"Shooting the Messenger", cat:"social", blurb:"People who deliver bad news get judged more harshly, even when everyone agrees they had nothing to do with causing it."},
  {id:"symbolic-rewards", title:"Symbolic Rewards", cat:"motivation", blurb:"A token of recognition with no monetary value increases effort and performance anyway, purely through status and recognition."},
  {id:"scarcity", title:"Scarcity", cat:"pricing", blurb:"Making something look limited in quantity or time left makes it more wanted and more likely to be chosen right now."},
  {id:"checklists", title:"Checklists", cat:"judgment", blurb:"A short list of steps, read aloud, measurably reduces errors in complex tasks, not by teaching anyone anything new."},
  {id:"false-positives", title:"False Positives", cat:"judgment", blurb:"A handful of small, individually reasonable choices in how a result is measured can turn pure chance into something that looks statistically real."},
  {id:"representativeness", title:"Representativeness", cat:"judgment", blurb:"A result only describes the population it was measured on, and trial participants are a poor stand-in for a full rollout."},
  {id:"chef-or-the-ingredients", title:"Chef or the Ingredients", cat:"judgment", blurb:"A pilot staffed with your very best people proves your best people are good at their jobs, not that the idea itself will work at scale."},
  {id:"spillovers", title:"Spillovers", cat:"judgment", blurb:"A pilot too small to move the surrounding system can hide an effect that only appears once an idea is running at real scale."},
  {id:"cost-traps", title:"Cost Traps", cat:"judgment", blurb:"An effect that looked strong and cheap in a small pilot routinely shrinks once it's handed to a real operating team."},
  {id:"reciprocity", title:"Reciprocity", cat:"social", blurb:"An unsolicited gift or favor creates a felt obligation to give something back, often worth far more than what was received."},
  {id:"good-friction", title:"Good Friction", cat:"friction", blurb:"The same tool as Sludge, aimed the other way: effort added on purpose to a choice you'd regret."},
  {id:"halo-effect", title:"Halo Effect", cat:"judgment", blurb:"A single strong trait quietly colours judgment of other, unrelated traits of the same person, brand, or product."},
  {id:"loss-aversion", title:"Loss Aversion", cat:"judgment", blurb:"Losses are felt more intensely than equivalent gains, so people go out of their way to avoid a loss they'd happily walk past as a foregone gain."},
  {id:"signpost-effect", title:"Signpost Effect", cat:"choice", blurb:"Expressing the same fact in different terms, cost, efficiency, environmental impact, can activate a goal that was otherwise dormant."},
  {id:"perceived-fairness", title:"Perceived Fairness", cat:"pricing", blurb:"People judge a price change against a reference transaction: protecting profit from a real cost reads as fair, exploiting demand doesn't."},
  {id:"law-of-round-numbers", title:"Law of Round Numbers", cat:"motivation", blurb:"A round number acts as an unusually strong reference point that quietly changes effort, timing, or choices to land on one."},
  {id:"payment-transparency", title:"Payment Transparency", cat:"pricing", blurb:"A payment's felt cost depends less on the price than on whether paying it makes you rehearse the amount and whether the money leaves immediately."},
  {id:"credit-card-premium", title:"The Credit Card Premium", cat:"pricing", blurb:"People are reliably willing to pay more for the identical item once they're told they'll pay by credit card instead of cash."},
  {id:"pseudo-set-framing", title:"Pseudo-Set Framing", cat:"motivation", blurb:"People push to complete any group framed as a whole, even when the grouping is arbitrary and carries no reward for finishing."},
  {id:"smart-defaults", title:"Smart Defaults", cat:"choice", blurb:"A default set for someone's own future benefit, timed so that accepting it costs nothing anyone can actually feel today."},
  {id:"precommitment-devices", title:"Precommitment Devices", cat:"choice", blurb:"A voluntary constraint someone places on their own future choices today, so a future self with less willpower can't undo it."},
  {id:"crossmodal-correspondence", title:"Crossmodal Correspondence", cat:"judgment", blurb:"The brain treats taste as one blended sense, so an unrelated touch or colour cue gets folded straight into how something is judged to taste."},
  {id:"meaningless-differentiation", title:"Meaningless Differentiation", cat:"judgment", blurb:"A visible, specific-sounding detail can be read as proof of a real, unstated benefit, even when the detail itself changes nothing."},
  {id:"licensing-effect", title:"Licensing Effect", cat:"judgment", blurb:"Completing one virtuous or responsible act gives people a felt permission to indulge right afterward, even when the two choices are unrelated."},
  {id:"present-bias", title:"Present Bias", cat:"choice", blurb:"People weigh a reward available right now far more heavily than the identical reward available later, so an advance choice and an in-the-moment choice can flatly contradict each other."},
  {id:"sunk-cost-fallacy", title:"Sunk Cost Fallacy", cat:"pricing", blurb:"Money, time, or effort already sunk into something keeps pulling people toward continuing it, even once continuing is the worse choice going forward."},
  {id:"temporal-reframing", title:"Temporal Reframing", cat:"pricing", blurb:"Restating a cost as a small recurring amount instead of one aggregate total changes what it gets compared against, and makes the identical spend feel easier to say yes to."},
  {id:"bundling", title:"Bundling", cat:"pricing", blurb:"The identical dollar saving carries more weight in how good a deal feels when it's stated directly on a combined bundle price than when the same amount is spread across separate item-level discounts."},
  {id:"clawback", title:"Clawback (Loss-Framed Incentives)", cat:"motivation", blurb:"The identical reward moves people more when it's framed as something already theirs and at risk of being taken back than when the same reward is framed as something still to be earned."},
  {id:"disclosure-backfire", title:"Disclosure Backfire (Sunlight That Doesn't Disinfect)", cat:"friction", blurb:"Disclosing a conflict of interest is meant to let the person receiving advice discount it appropriately. It can instead free the person giving the advice to lean into their bias further."},
  {id:"propinquity-effect", title:"Propinquity Effect", cat:"social", blurb:"People who cross paths often, simply because they live or work near each other, become more familiar with each other than they would otherwise, and that familiarity gets read as trust or fit, even in a decision meant to be judged on merit alone."}
];

// Plain, observable business symptoms, grouped by where in the journey
// they show up. Each symptom maps to a small, hand-picked set of specific
// principles that actually explain it, never a whole category. No
// behavioural-science term appears anywhere in this data: the diagnosis
// step only ever shows what a business owner would already say out loud.
var APPLY_SYMPTOMS = [
  {group: "Getting them to start", items: [
    {id: "no-click", text: "People see the offer, but don't click through.", principles: ["salience", "framing-effect", "signpost-effect"]},
    {id: "early-abandon", text: "They start filling something out, then abandon almost immediately.", principles: ["sludge", "choice-overload"]}
  ]},
  {group: "Getting them through", items: [
    {id: "price-screen", text: "They abandon right at the price or payment screen.", principles: ["price-transparency", "pain-of-paying", "payment-transparency"]},
    {id: "one-step-stall", text: "They stall at one specific step, then give up.", principles: ["sludge", "choice-overload"]}
  ]},
  {group: "Getting them to choose well", items: [
    {id: "picks-cheapest", text: "They pick the cheapest option even when it's clearly not the best value.", principles: ["decoy", "anchoring"]},
    {id: "sticks-preselected", text: "They stick with whatever's pre-selected, rarely changing it.", principles: ["default-effect"]}
  ]},
  {group: "Getting them to come back", items: [
    {id: "one-and-done", text: "They complete it once, then don't return.", principles: ["goal-gradient", "pseudo-set-framing"]},
    {id: "cancels-soon", text: "They cancel or downgrade shortly after signing up.", principles: ["smart-defaults", "precommitment-devices"]}
  ]}
];
