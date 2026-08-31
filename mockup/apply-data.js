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
  {id:"medium-maximization", title:"Medium Maximisation", cat:"motivation", blurb:"Give people a token standing in for a reward, points, miles, stamps, and they'll sometimes work to maximise the token itself."},
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
  {id:"reciprocity", title:"Reciprocity", cat:"social", blurb:"An unsolicited gift or favour creates a felt obligation to give something back, often worth far more than what was received."},
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
  {id:"licensing-effect", title:"Licensing Effect", cat:"judgment", blurb:"Completing one virtuous or responsible act gives people a felt permission to indulge right afterwards, even when the two choices are unrelated."},
  {id:"present-bias", title:"Present Bias", cat:"choice", blurb:"People weigh a reward available right now far more heavily than the identical reward available later, so an advance choice and an in-the-moment choice can flatly contradict each other."},
  {id:"sunk-cost-fallacy", title:"Sunk Cost Fallacy", cat:"pricing", blurb:"Money, time, or effort already sunk into something keeps pulling people towards continuing it, even once continuing is the worse choice going forward."},
  {id:"temporal-reframing", title:"Temporal Reframing", cat:"pricing", blurb:"Restating a cost as a small recurring amount instead of one aggregate total changes what it gets compared against, and makes the identical spend feel easier to say yes to."},
  {id:"bundling", title:"Bundling", cat:"pricing", blurb:"The identical dollar saving carries more weight in how good a deal feels when it's stated directly on a combined bundle price than when the same amount is spread across separate item-level discounts."},
  {id:"clawback", title:"Clawback (Loss-Framed Incentives)", cat:"motivation", blurb:"The identical reward moves people more when it's framed as something already theirs and at risk of being taken back than when the same reward is framed as something still to be earned."},
  {id:"disclosure-backfire", title:"Disclosure Backfire (Sunlight That Doesn't Disinfect)", cat:"friction", blurb:"Disclosing a conflict of interest is meant to let the person receiving advice discount it appropriately. It can instead free the person giving the advice to lean into their bias further."},
  {id:"propinquity-effect", title:"Propinquity Effect", cat:"social", blurb:"People who cross paths often, simply because they live or work near each other, become more familiar with each other than they would otherwise, and that familiarity gets read as trust or fit, even in a decision meant to be judged on merit alone."},
  {id:"availability-heuristic", title:"Availability Heuristic", cat:"judgment", blurb:"When something is easy to picture or recall, a recent headline, a vivid story, a memory of your own, it feels more common and more likely than it actually is, simply because it comes to mind so easily."},
  {id:"diversification-heuristic", title:"Diversification Heuristic", cat:"judgment", blurb:"Asked to split money or attention across several options, people default to dividing it evenly by how many there are, not by what each one actually contains."},
  {id:"ambiguity-aversion", title:"Ambiguity Aversion", cat:"judgment", blurb:"Given a choice between a risk with known odds and an otherwise identical risk with hidden odds, most people pick the known one, even when the hidden odds could be just as good or better."},
  {id:"risk-aversion", title:"Risk Aversion", cat:"judgment", blurb:"Given a choice between a certain amount and a gamble worth the same or more on average, most people take the certain amount, giving up expected value in exchange for certainty."},
  {id:"positional-concern", title:"Positional Concern", cat:"social", blurb:"Given a choice between an absolute amount of money and a smaller amount that still ranks above everyone else's, many people pick the smaller amount, valuing relative standing as much as, or more than, the amount itself."},
  {id:"warm-glow-giving", title:"Warm-Glow Giving", cat:"social", blurb:"Given complete, unaccountable control over money and zero consequence for keeping all of it, most people still give some away. Giving itself feels rewarding, separate from anything the giver could get back."},
  {id:"bulletproof-glass-effect", title:"Bulletproof Glass Effect", cat:"judgment", blurb:"A prominent, detailed privacy or security notice can lower trust instead of raising it, because explaining a protection in detail implies the danger it guards against is real."},
  {id:"implementation-intentions", title:"Implementation Intentions", cat:"motivation", blurb:"Deciding in advance exactly when, where and how you'll act on a goal, a specific if-then plan rather than a general intention, makes people far more likely to actually follow through."},
  {id:"reminder-fatigue", title:"Reminder Fatigue", cat:"social", blurb:"A repeated reminder raises compliance the moment it's sent, but each additional one also raises the odds the recipient opts out of all future contact for good."}
];

// Category display names, reused wherever a principle's .cat needs a real
// label (the disambiguation step, chip hints), matching the exact 6 category
// names already used in the site's own nav and principles.html filters.
var APPLY_CATEGORY_LABELS = {
  judgment: "Judgment & Memory",
  choice: "Choice Architecture",
  pricing: "Pricing & Value",
  social: "Social Influence",
  motivation: "Motivation & Goals",
  friction: "Friction & Transparency"
};

// The full triage tree for the "I have a problem" path. Every one of the 76
// principles above appears in at least one stage's symptom list, unlike the
// old 4-stage/8-symptom version this replaces, which only ever reached about
// 15 of them. Nothing here is free text: p1 picks one stage (single-select),
// p2 checks every symptom that applies within that stage (multi-select,
// union-matched to principles), and an optional disambiguation step narrows
// further by category when a stage still leaves too many candidates. Plain,
// observable business language throughout, never a behavioural-science term.
var APPLY_STAGES = [
  {
    id: "notice", label: "Getting them to notice, or click through",
    hint: "The very first moment: an ad, an email, a banner, a message.",
    items: [
      {id: "notice-no-click", text: "People see the offer or message, but don't click through.", principles: ["salience", "framing-effect", "signpost-effect"]},
      {id: "notice-reword", text: "The same fact seems to land completely differently depending on how it's worded.", principles: ["framing-effect"]},
      {id: "notice-vivid-story", text: "A vivid recent story or headline seems to be driving a decision more than the real numbers do.", principles: ["availability-heuristic"]},
      {id: "notice-first-impression", text: "One strong first impression seems to be colouring how people see everything else about us.", principles: ["halo-effect"]},
      {id: "notice-repetition", text: "Repeating the same claim seems to make people believe it more, true or not.", principles: ["illusory-truth-effect"]}
    ]
  },
  {
    id: "onboarding", label: "Getting them through a form or signup",
    hint: "Signing up, filling in details, setting up an account.",
    items: [
      {id: "onboard-early-abandon", text: "They start filling something out, then abandon almost immediately.", principles: ["sludge", "choice-overload"]},
      {id: "onboard-one-step-stall", text: "They stall at one specific step, then give up.", principles: ["sludge", "choice-overload"]},
      {id: "onboard-long-number", text: "A long number or code (an ID, a reference) seems to trip people up until it's grouped.", principles: ["chunking"]},
      {id: "onboard-more-options-harder", text: "Showing more options up front seems to make signing up harder, not easier.", principles: ["choice-overload"]},
      {id: "onboard-removed-option", text: "Removing an option people used to have seems to have made them want it more.", principles: ["not-enough-choice"]}
    ]
  },
  {
    id: "choosing", label: "Getting them to pick well among options",
    hint: "Comparing plans, products, or settings once they're already choosing.",
    items: [
      {id: "choose-cheapest", text: "They pick the cheapest option even when it's clearly not the best value.", principles: ["decoy", "anchoring"]},
      {id: "choose-sticks-default", text: "They stick with whatever's pre-selected, rarely changing it.", principles: ["default-effect"]},
      {id: "choose-third-option", text: "Adding a third, clearly worse option seems to have changed which of the other two people pick.", principles: ["decoy"]},
      {id: "choose-middle-option", text: "Adding a middle option pulled people toward it, more than its actual value explains.", principles: ["compromise-effect"]},
      {id: "choose-similar-option", text: "A new option very similar to an existing one split attention, and an unrelated third one gained.", principles: ["similarity-effect"]},
      {id: "choose-order-changes", text: "The exact same options, shown in a different order, get picked differently.", principles: ["ordering-effects", "order-effect"]},
      {id: "choose-splits-evenly", text: "People split their attention or budget evenly across however many options are on the menu, not by what's actually in each one.", principles: ["diversification-heuristic"]},
      {id: "choose-meaningless-detail", text: "A specific-sounding but functionally meaningless detail seems to get read as a real benefit.", principles: ["meaningless-differentiation"]},
      {id: "choose-sensory-cue", text: "An unrelated touch, colour, or texture cue seems to be changing how the product itself is judged.", principles: ["crossmodal-correspondence"]},
      {id: "choose-once-for-future", text: "People choose once for a whole set of future decisions, and it produces a different outcome than deciding fresh each time.", principles: ["choice-bracketing"]},
      {id: "choose-avoid-loss", text: "People go out of their way to avoid a loss they'd otherwise walk past as a missed gain.", principles: ["loss-aversion"]},
      {id: "choose-ownership-jump", text: "The moment people “own” something, even briefly (a trial, a cart), they suddenly value it more.", principles: ["endowment-effect"]},
      {id: "choose-restate-terms", text: "Restating the identical fact in different terms (cost vs. time vs. impact) changes what people choose.", principles: ["signpost-effect"]},
      {id: "choose-scarcity-signal", text: "Marking something as limited in quantity or time makes it wanted right now.", principles: ["scarcity"]},
      {id: "choose-only-upside", text: "Only showing the upside, never what's given up, seems to be producing worse decisions.", principles: ["tradeoff-transparency"]},
      {id: "choose-hidden-terms", text: "People avoid an option just because its terms or odds aren't fully spelled out, even when it could be the better one.", principles: ["ambiguity-aversion"]},
      {id: "choose-sure-thing", text: "Given a certain smaller outcome and a bigger, less certain one worth more on average, people take the certain one almost every time.", principles: ["risk-aversion"]}
    ]
  },
  {
    id: "payment", label: "Getting them through payment or pricing",
    hint: "The price screen, checkout, or how a cost is shown.",
    items: [
      {id: "pay-screen-drop", text: "They abandon right at the price or payment screen.", principles: ["price-transparency", "pain-of-paying", "payment-transparency"]},
      {id: "pay-free-jump", text: "Making something completely free changed demand by far more than a small price cut would.", principles: ["zero-price"]},
      {id: "pay-free-worse", text: "Making something free actually converted worse than charging a small amount.", principles: ["zero-price-paradox"]},
      {id: "pay-99-cents", text: "Prices ending in .99 seem to be read as a lower price bracket than they actually are.", principles: ["left-digit-bias"]},
      {id: "pay-round-vs-precise", text: "A precise price and a round price get reacted to differently, and it's not obvious which wins.", principles: ["precision-effect"]},
      {id: "pay-yearly-vs-daily", text: "The same total cost feels different depending on whether it's shown yearly or broken down daily.", principles: ["translating-information"]},
      {id: "pay-mental-account", text: "The same dollar seems to be treated as worth more or less depending which “account” it came from.", principles: ["mental-accounting"]},
      {id: "pay-card-premium", text: "People pay more for the identical thing once they're paying by card instead of cash.", principles: ["credit-card-premium"]},
      {id: "pay-recurring-reframe", text: "Restating a cost as a small recurring amount instead of one total made the same spend feel easier to accept.", principles: ["temporal-reframing"]},
      {id: "pay-bundle-discount", text: "The same discount feels bigger stated on a bundle than spread across separate line items.", principles: ["bundling"]},
      {id: "pay-fairness-reaction", text: "A price rise gets judged fair or unfair depending on the story behind it, not the number itself.", principles: ["perceived-fairness"]},
      {id: "pay-installment-plan", text: "Offering to spread a large cost into smaller, fee-free instalments changes whether people buy at all.", principles: ["risk-aversion"]}
    ]
  },
  {
    id: "engagement", label: "Getting them to keep using it, or build a habit",
    hint: "Repeat use, streaks, loyalty programmes, ongoing effort.",
    items: [
      {id: "engage-speeds-up", text: "People move slowly at first, then speed up as they get closer to finishing.", principles: ["goal-gradient"]},
      {id: "engage-chases-token", text: "People seem to chase the points or badges themselves, more than the reward those tokens are supposed to represent.", principles: ["medium-maximization"]},
      {id: "engage-one-slip-quits", text: "People give up completely after one slip, instead of getting back on track.", principles: ["emergency-reserves"]},
      {id: "engage-values-built", text: "People value something more once they've helped build or set it up themselves.", principles: ["ikea-effect"]},
      {id: "engage-badge-works", text: "A recognition badge with no real monetary value still seems to increase effort.", principles: ["symbolic-rewards"]},
      {id: "engage-finish-group", text: "People push to finish any group we've framed as a whole, even one with no real reward for finishing.", principles: ["pseudo-set-framing"]},
      {id: "engage-commit-vs-do", text: "People commit to something in advance, then do something different in the moment.", principles: ["present-bias"]},
      {id: "engage-self-lockin", text: "People voluntarily lock in a constraint on their own future choices.", principles: ["precommitment-devices"]},
      {id: "engage-round-number", text: "People change their effort or timing just to land on a round number.", principles: ["law-of-round-numbers"]},
      {id: "engage-at-risk-reward", text: "Framing a reward as already theirs, and at risk, moves people more than framing it as still to be earned.", principles: ["clawback"]},
      {id: "engage-identity-label", text: "An identity label (“a saver,” not “someone who saves”) seems to change behaviour more than a plain instruction does.", principles: ["behavioural-labels"]}
    ]
  },
  {
    id: "retention", label: "Getting them to stay, not cancel",
    hint: "Renewals, downgrades, cancellations, churn.",
    items: [
      {id: "retain-one-and-done", text: "They complete it once, then don't return.", principles: ["goal-gradient", "pseudo-set-framing"]},
      {id: "retain-cancels-soon", text: "They cancel or downgrade shortly after signing up.", principles: ["smart-defaults", "precommitment-devices"]},
      {id: "retain-cancel-harder", text: "Leaving or cancelling is a lot harder than signing up was.", principles: ["sludge"]},
      {id: "retain-default-kept", text: "A default set for their own future benefit gets kept, because saying yes costs nothing today.", principles: ["smart-defaults"]},
      {id: "retain-regret-pause", text: "We're considering adding a deliberate pause before a choice people might later regret.", principles: ["good-friction"]}
    ]
  },
  {
    id: "trust", label: "Getting them to trust you, or each other",
    hint: "Credibility, word of mouth, fairness, believability.",
    items: [
      {id: "trust-copies-others", text: "People copy what everyone else seems to be doing when they're unsure what to do.", principles: ["social-proof"]},
      {id: "trust-norm-mismatch", text: "What people actually do and what they say they approve of point in different directions.", principles: ["social-norm"]},
      {id: "trust-undervalues-effort", text: "People undervalue work or effort they can't actually see happening.", principles: ["transparency"]},
      {id: "trust-gift-goodwill", text: "An unsolicited small gift or favour seems to be earning outsized goodwill back.", principles: ["reciprocity"]},
      {id: "trust-disclosure-backfires", text: "Disclosing a conflict of interest doesn't seem to be reducing biased advice, maybe the opposite.", principles: ["disclosure-backfire"]},
      {id: "trust-proximity-bias", text: "People who happen to sit, live, or work near each other get treated as more trustworthy, even when that shouldn't matter.", principles: ["propinquity-effect"]},
      {id: "trust-remembers-ending", text: "People remember an experience almost entirely by its worst or best moment, and how it ended.", principles: ["peak-end-rule"]}
    ]
  },
  {
    id: "internal", label: "How your own team makes decisions, or judges results",
    hint: "Interpreting a test, a pilot, or a result before you act on it.",
    items: [
      {id: "internal-two-reviewers-differ", text: "Two people review the exact same result and reach different conclusions.", principles: ["noise"]},
      {id: "internal-knew-it-all-along", text: "Once we know how something turned out, it feels like we basically knew it all along.", principles: ["hindsight-bias"]},
      {id: "internal-only-survivors", text: "We're only looking at the people who stuck around, not the ones who dropped out.", principles: ["survivorship-bias"]},
      {id: "internal-analysis-choices", text: "A few small, individually reasonable analysis choices turned what might be noise into a result that looks real.", principles: ["false-positives"]},
      {id: "internal-sample-mismatch", text: "Our test group doesn't really look like the population we're about to roll this out to.", principles: ["representativeness"]},
      {id: "internal-best-team-piloted", text: "Our best team ran the pilot, and we're not sure an average team would get the same result.", principles: ["chef-or-the-ingredients"]},
      {id: "internal-scale-unknown", text: "A small pilot showed a real effect, but we're not sure it survives running at full scale.", principles: ["spillovers"]},
      {id: "internal-costlier-at-scale", text: "Something that looked cheap and effective in a small pilot got a lot more expensive once a real team owned it.", principles: ["cost-traps"]},
      {id: "internal-cant-explain", text: "We're confident we understand how something works, right up until we're asked to actually explain it, step by step.", principles: ["illusion-of-explanatory-depth"]},
      {id: "internal-false-control", text: "We act like we can influence an outcome that's actually random, or already decided.", principles: ["illusion-of-control"]},
      {id: "internal-simple-rule-wins", text: "A simple, one-factor rule keeps out-predicting our more complicated model.", principles: ["take-the-best-heuristic"]},
      {id: "internal-avoid-checking", text: "We're avoiding checking a number because it might be bad news.", principles: ["ostrich-effect"]},
      {id: "internal-blame-messenger", text: "Whoever delivers bad news gets blamed for it, even when they didn't cause it.", principles: ["shooting-the-messenger"]},
      {id: "internal-checklist-helped", text: "A short, read-aloud checklist cut errors in a complex task, without teaching anyone anything new.", principles: ["checklists"]},
      {id: "internal-sunk-cost", text: "Money or effort we've already spent keeps pulling us toward continuing, even past the point it's the worse choice.", principles: ["sunk-cost-fallacy"]},
      {id: "internal-licensing", text: "Doing one responsible thing seems to give the team permission to indulge right after.", principles: ["licensing-effect"]}
    ]
  }
];

// Desired-outcome options for "what do you want them to do instead"
// (single-select chips). Roughly one per stage above, plus Other.
var APPLY_OUTCOMES = [
  {id: "out-click", text: "Click through to the next step"},
  {id: "out-finish-signup", text: "Finish the form or signup, without abandoning partway"},
  {id: "out-pick-better", text: "Pick the option that's actually the better fit, not just the cheapest or the default"},
  {id: "out-through-payment", text: "Get through payment without dropping off"},
  {id: "out-return", text: "Come back and use it again, not just once"},
  {id: "out-stay-subscribed", text: "Stay subscribed, instead of cancelling"},
  {id: "out-trust-more", text: "Trust the message, or trust each other, more"},
  {id: "out-accurate-call", text: "Make a more accurate internal call, not get misled by noise or a small pilot"}
];

// Type-of-change options, reused for "what would applying this look like"
// (p5) and for the principle-first path's "what would change" question (c2).
// Multi-select chips.
var APPLY_CHANGE_TYPES = [
  {id: "change-default", text: "Add or change a default"},
  {id: "change-show-cost", text: "Show the full, real cost or number upfront"},
  {id: "change-show-effort", text: "Make the effort or work behind it visible"},
  {id: "change-reduce-steps", text: "Remove a step, or reduce the options shown"},
  {id: "change-comparison", text: "Add a real comparison point (an anchor, a decoy, a bundle)"},
  {id: "change-reframe", text: "Reframe the same fact in different words"},
  {id: "change-social-proof", text: "Show what other people are actually doing"},
  {id: "change-urgency", text: "Add a real, honest urgency or limited-time signal"},
  {id: "change-progress", text: "Make progress visible (a tracker, a partly-filled reward)"},
  {id: "change-pause", text: "Add a deliberate pause before an easy-to-regret choice"}
];

// Primary-metric options for the experiment setup step (single-select chips).
var APPLY_METRICS = [
  {id: "metric-conversion", text: "Conversion rate (click-through, signup completion, purchase)"},
  {id: "metric-spend", text: "Average spend or order value"},
  {id: "metric-retention", text: "Retention or renewal rate"},
  {id: "metric-time", text: "Time to complete"},
  {id: "metric-errors", text: "Error or complaint rate"},
  {id: "metric-support", text: "Support contact volume"},
  {id: "metric-satisfaction", text: "Satisfaction or trust score"}
];

// "What's currently happening" options for the principle-first path's c2
// step (single-select chips), a compact generic list rather than repeating
// all 60-plus stage symptoms above.
var APPLY_CURRENT_BEHAVIOURS = [
  {id: "cur-no-notice", text: "They don't notice it, or don't click through"},
  {id: "cur-abandon", text: "They start, then abandon partway"},
  {id: "cur-default-cheapest", text: "They default to the cheapest, or whatever's pre-selected"},
  {id: "cur-one-and-done", text: "They complete it once, then don't return"},
  {id: "cur-cancel-soon", text: "They cancel or downgrade soon after starting"},
  {id: "cur-distrust", text: "They don't seem to trust the message"},
  {id: "cur-unsure-read", text: "We're not confident our own read on this is right"}
];
