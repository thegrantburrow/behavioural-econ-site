#!/usr/bin/env python3
"""Builds a review artifact: four narrative homepages for What Works & Why.

The brief was specific. The three number proof slab ("56 principles, 10
experiments, 0 growth hacks") reads as stale, a single hero example will go
stale too, and the previous round answered a request for narrative flow with
a row of toggles. So none of these four is a control panel: each is a story
that unfolds as you scroll, and each is shown as a real scrolling homepage
rather than as a schematic, because "visually compelling as the homepage
flows" cannot be judged from a diagram.

Each mock is rendered in an iframe carrying `mockup/styles.css` verbatim, so
what you are looking at is the site's own type, palette and components rather
than an approximation of them. The hero markup is lifted from the live
homepage unchanged for the same reason.
"""
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MOCKUP = os.path.join(ROOT, 'mockup')

CSS = open(os.path.join(MOCKUP, 'styles.css')).read()
INDEX = open(os.path.join(MOCKUP, 'index.html')).read()

# Lifted, not retyped: the hero is the one part of every option that does not
# change, and a hand copy of it would drift from the real page.
HERO = re.search(r'<header class="hero">.*?</header>', INDEX, re.S).group(0)
HERO = HERO.replace('src="images/logo-lockup.png"', 'src="__LOGO__"')

# how many principles there actually are, so nothing here restates a number
# that the site itself computes wrongly
N_PRINCIPLES = len(re.findall(r'<section class="principle"', open(
    os.path.join(MOCKUP, 'principles.html')).read()))
# One blueprint carries exactly one sample size block and one entry in the
# contents, which is what VISUAL-SYSTEMS.md says of `.power-calc` too. Counting
# a container class that does not exist returns zero rather than failing, and a
# zero went out in a draft of this page saying the site has no experiments.
N_EXPERIMENTS = len(re.findall(r'class="power-calc"', open(
    os.path.join(MOCKUP, 'experiments.html')).read()))
N_SESSIONS = len(re.findall(r'class="session-toc-title"', open(
    os.path.join(MOCKUP, 'sessions.html')).read()))
for _name, _n in (('principles', N_PRINCIPLES), ('experiments', N_EXPERIMENTS),
                  ('sessions', N_SESSIONS)):
    if not _n:
        raise SystemExit('counted zero %s. The selector no longer matches the page, and a count '
                         'of zero is a broken selector, not a fact about the site.' % _name)


def b64_logo():
    import base64
    p = os.path.join(MOCKUP, 'images', 'logo-lockup.png')
    return 'data:image/png;base64,' + base64.b64encode(open(p, 'rb').read()).decode()


def b64_img(name):
    import base64
    p = os.path.join(MOCKUP, 'images', name)
    ext = 'jpeg' if name.endswith('.jpg') else 'png'
    return 'data:image/%s;base64,%s' % (ext, base64.b64encode(open(p, 'rb').read()).decode())


def esc(s):
    return html.escape(s, quote=True)


# ---------------------------------------------------------------- mock chrome
# New sections need new CSS. Everything here is built from the site's own
# tokens and its existing type scale. Deliberately no new icons: per
# VISUAL-SYSTEMS.md a mock that represents the site's look has to match an
# existing icon system or state which it is borrowing, and none of these four
# narratives needs a glyph that does not already exist. The one borrowed
# pattern is the numbered rail in option three, which is system 15's progress
# rail turned into page furniture, and the card says so.
MOCKCSS = """
.n-lede{max-width:62ch;margin:0 auto;padding:6px 20px 0;}
.n-lede p{font-size:1.15rem;line-height:1.62;color:var(--muted);margin:0 0 14px;}
.n-lede p b{color:var(--ink);font-weight:600;}
.n-beat{border-top:1px solid var(--line);}
.n-beat .wrap{max-width:760px;padding-top:44px;padding-bottom:44px;}
.n-kicker{display:block;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--terracotta);font-weight:700;margin-bottom:14px;}
.n-big{font-family:Georgia,ui-serif,serif;font-size:2.1rem;line-height:1.22;margin:0 0 16px;
  text-wrap:balance;letter-spacing:-0.012em;}
.n-mid{font-family:Georgia,ui-serif,serif;font-size:1.5rem;line-height:1.3;margin:0 0 12px;}
.n-body{font-size:1.05rem;line-height:1.68;color:var(--muted);margin:0 0 14px;max-width:62ch;}
.n-body b{color:var(--ink);font-weight:600;}
.n-sign{border:2px solid var(--ink);border-radius:4px;padding:20px 26px;display:inline-block;
  text-align:center;background:var(--card);margin:6px 0 20px;}
.n-sign s{display:block;font-size:1.1rem;color:var(--muted);}
.n-sign strong{display:block;font-family:Georgia,serif;font-size:2.6rem;color:var(--terracotta);
  line-height:1.05;}
.n-sign span{display:block;font-size:0.74rem;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--muted);margin-top:6px;}
.n-receipt{border-left:3px solid var(--teal);background:var(--card);padding:18px 22px;
  border-radius:0 10px 10px 0;margin:4px 0 16px;}
.n-receipt .n-kicker{color:var(--teal);}
.n-receipt p{font-size:0.99rem;line-height:1.62;margin:0 0 10px;}
.n-receipt p:last-child{margin-bottom:0;}
.n-cite{font-size:0.86rem;color:var(--muted);font-style:italic;}
.n-caveat{font-size:0.92rem;color:var(--muted);border-top:1px dashed var(--line);
  padding-top:10px;margin-top:12px;}
.n-claim{font-family:Georgia,ui-serif,serif;font-size:1.85rem;line-height:1.28;margin:0 0 18px;
  max-width:22ch;text-wrap:balance;}
.n-claim em{font-style:normal;color:var(--terracotta);}
.n-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:34px;
  align-items:start;}
.n-steps{max-width:760px;margin:0 auto;padding:0 20px;}
.n-step{display:grid;grid-template-columns:64px minmax(0,1fr);gap:22px;padding:30px 0;
  border-top:1px solid var(--line);}
.n-step-n{font-family:Georgia,serif;font-size:2.6rem;line-height:1;color:var(--mustard);
  font-weight:400;}
.n-step h3{font-family:Georgia,serif;font-size:1.35rem;margin:0 0 8px;}
.n-step .n-body{margin-bottom:10px;}
.n-fix{display:inline-block;font-size:0.9rem;color:var(--teal);font-weight:600;
  border-bottom:1px solid rgba(43,102,96,0.4);text-decoration:none;}
.n-photo{display:block;width:100%;height:auto;}
.n-photo-wrap{position:relative;line-height:0;}
.n-photo-cap{font-size:0.84rem;color:var(--muted);padding:10px 20px 0;max-width:760px;
  margin:0 auto;line-height:1.5;}
.n-pull{font-family:Georgia,serif;font-size:1.6rem;line-height:1.35;color:var(--ink);
  border-left:3px solid var(--terracotta);padding-left:20px;margin:6px 0 18px;max-width:30ch;}
.n-out{border-top:1px solid var(--line);background:var(--card);}
.n-out .wrap{max-width:760px;padding-top:36px;padding-bottom:36px;}
.n-out-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px;}
.n-out-links a{display:block;padding:14px 16px;border:1px solid var(--line);border-radius:10px;
  text-decoration:none;color:var(--ink);background:var(--paper);}
.n-out-links b{display:block;font-family:Georgia,serif;font-size:1.05rem;margin-bottom:3px;}
.n-out-links span{font-size:0.88rem;color:var(--muted);line-height:1.45;}
@media (max-width:700px){
  .n-pair{grid-template-columns:1fr;gap:16px;}
  .n-big{font-size:1.7rem;}
  .n-claim{font-size:1.5rem;max-width:none;}
  .n-out-links{grid-template-columns:1fr;}
  .n-step{grid-template-columns:44px minmax(0,1fr);gap:14px;}
  .n-step-n{font-size:2rem;}
}
"""

OUT_LINKS = """
<section class="n-out"><div class="wrap">
  <p class="n-body" style="margin-bottom:2px"><b>__CLOSE__</b></p>
  <div class="n-out-links">
    <a href="#"><b>Principles</b><span>__NP__ of them, each tied to a real study.</span></a>
    <a href="#"><b>Field Sessions</b><span>__NS__ talks, and what actually happened in the room.</span></a>
    <a href="#"><b>Experiments</b><span>__NE__ blueprints you can run yourself.</span></a>
    <a href="#"><b>Reading the Research</b><span>How to tell a good study from a loud one.</span></a>
  </div>
</div></section>
"""


def out(close):
    return (OUT_LINKS.replace('__CLOSE__', close).replace('__NP__', str(N_PRINCIPLES))
            .replace('__NS__', str(N_SESSIONS)).replace('__NE__', str(N_EXPERIMENTS)))


# ------------------------------------------------------------- the four flows
MOCK1 = """
<div class="n-lede"><p>A guide to the forces already shaping how people decide, so you can use
them on purpose. Here is one, all the way down.</p></div>

<section class="n-beat"><div class="wrap">
  <span class="n-kicker">One. What you saw</span>
  <h2 class="n-big">You walked past this on Saturday and it worked.</h2>
  <div class="n-sign"><s>Was $80</s><strong>$49</strong><span>This week only</span></div>
  <p class="n-body">Not a trick, not a lie, and nothing about it is hidden. The eighty is real.
  The forty nine is real. You still got moved by it.</p>
</div></section>

<section class="n-beat"><div class="wrap">
  <span class="n-kicker">Two. What you actually did</span>
  <h2 class="n-mid">You compared forty nine to eighty. You never compared it to what the thing
  is worth.</h2>
  <p class="n-body">That is the whole move. The first number you meet becomes the ruler for
  every number after it, and the shop chose which number you met first.</p>
</div></section>

<section class="n-beat"><div class="wrap">
  <span class="n-kicker">Three. Why</span>
  <h2 class="n-mid">Anchoring</h2>
  <p class="n-body">People do not judge a number on its own. They judge it against whatever
  number is nearest to hand, <b>even when that number is irrelevant, and even when they know
  it is</b>.</p>
</div></section>

<section class="n-beat"><div class="wrap">
  <span class="n-kicker">Four. The receipt</span>
  <div class="n-receipt">
    <span class="n-kicker">The study</span>
    <p>Tversky and Kahneman spun a wheel of fortune in front of participants, then asked what
    percentage of UN member states were African. The wheel was rigged to stop on 10 or 65.
    Median answers: <b>25 per cent</b> after the wheel showed 10, <b>45 per cent</b> after it
    showed 65.</p>
    <p class="n-cite">Tversky &amp; Kahneman, 1974, Science.</p>
    <p class="n-caveat">Worth knowing: the original effect sizes have shrunk in replication, and
    anchoring is weaker when people have real knowledge of the thing being priced. It is a
    lever, not a law.</p>
  </div>
  <p class="n-body">Every principle on this site is written this way. The moment, the move, the
  study, and the reason to doubt it.</p>
</div></section>
""" + out('That was one. There are __NP__ more.').replace('__NP__', str(N_PRINCIPLES - 1))


MOCK2 = """
<div class="n-lede"><p>Most of what gets repeated about human behaviour is half right. This
site is the other half: the claim, and then the receipt.</p></div>

<section class="n-beat"><div class="wrap"><div class="n-pair">
  <h2 class="n-claim">&ldquo;Give people <em>more choice</em> and they will buy more.&rdquo;</h2>
  <div>
    <div class="n-receipt">
      <span class="n-kicker">The receipt</span>
      <p>A supermarket tasting table with 24 jams pulled a bigger crowd than one with 6.
      <b>Thirty per cent</b> of the people who stopped at the small table bought a jar.
      <b>Three per cent</b> of the people who stopped at the big one did.</p>
      <p class="n-cite">Iyengar &amp; Lepper, 2000, Journal of Personality and Social Psychology.</p>
      <p class="n-caveat">And the honest part: this one has had a rough decade. Meta analyses
      put the average effect near zero, and it holds mainly when the choice is hard and the
      buyer has no preference already.</p>
    </div>
  </div>
</div></div></section>

<section class="n-beat"><div class="wrap"><div class="n-pair">
  <h2 class="n-claim">&ldquo;People will tell you <em>what they want</em>.&rdquo;</h2>
  <div>
    <div class="n-receipt">
      <span class="n-kicker">The receipt</span>
      <p>What people say they will pay, choose or do is a poor guide to what they then pay,
      choose or do. The gap is largest exactly where it matters most: new things, moral things,
      and anything they would rather be true about themselves.</p>
      <p class="n-caveat">Which is why every experiment on this site measures behaviour and not
      stated intention, and says so in its method.</p>
    </div>
  </div>
</div></div></section>

<section class="n-beat"><div class="wrap"><div class="n-pair">
  <h2 class="n-claim">&ldquo;Free is just a very <em>low price</em>.&rdquo;</h2>
  <div>
    <div class="n-receipt">
      <span class="n-kicker">The receipt</span>
      <p>Drop a premium chocolate from 15c to 14c and a cheap one from 1c to free, and demand
      inverts. The cheap one goes from a minority pick to <b>the overwhelming majority</b>,
      even though the price gap barely moved.</p>
      <p class="n-cite">Shampanier, Mazar &amp; Ariely, 2007, Marketing Science.</p>
      <p class="n-caveat">Zero is not a price. It is a different category, and it turns off the
      part of the decision that does the arithmetic.</p>
    </div>
  </div>
</div></div></section>
""" + out('Every principle here is written as a claim and a receipt, including the ones where '
          'the receipt is thinner than people think.')


MOCK3 = """
<div class="n-lede"><p>Whatever you are building, the person using it walks the same five
steps. Something goes wrong at each one, and it is usually the same something.</p></div>

<div class="n-steps">
  <div class="n-step"><div class="n-step-n">1</div><div>
    <h3>They notice</h3>
    <p class="n-body">Or they do not, because the thing that matters is competing with
    everything else on the page and losing quietly.</p>
    <a class="n-fix" href="#">Salience, and why contrast beats size</a>
  </div></div>
  <div class="n-step"><div class="n-step-n">2</div><div>
    <h3>They compare</h3>
    <p class="n-body">Against whatever number is nearest, not against what the thing is worth.
    You choose which number is nearest.</p>
    <a class="n-fix" href="#">Anchoring, and the decoy that fixes it</a>
  </div></div>
  <div class="n-step"><div class="n-step-n">3</div><div>
    <h3>They hesitate</h3>
    <p class="n-body">Because the cost is certain and now, and the benefit is vague and later.
    Every abandoned basket is this sentence.</p>
    <a class="n-fix" href="#">Present bias, and making the benefit arrive sooner</a>
  </div></div>
  <div class="n-step"><div class="n-step-n">4</div><div>
    <h3>They commit</h3>
    <p class="n-body">And then immediately look for evidence they were right. What you say in
    the next thirty seconds decides whether they keep it.</p>
    <a class="n-fix" href="#">Post purchase rationalisation</a>
  </div></div>
  <div class="n-step"><div class="n-step-n">5</div><div>
    <h3>They remember</h3>
    <p class="n-body">Not the average of the experience. The best bit and the last bit, and
    almost nothing else.</p>
    <a class="n-fix" href="#">The peak end rule</a>
  </div></div>
</div>
""" + out('Five steps, and __NP__ principles sitting under them.').replace(
    '__NP__', str(N_PRINCIPLES))


MOCK4 = """
<div class="n-lede"><p>None of this is theory that has never left a slide. Every idea here was
argued in front of a room of people who could push back, and most of them did.</p></div>

<div class="n-photo-wrap"><img class="n-photo" src="__PHOTO__" alt="A hall of students during a
field session"></div>
<p class="n-photo-cap">Airds High School, Year 8 and 9. The session on the maths their brains
skip.</p>

<section class="n-beat"><div class="wrap">
  <span class="n-kicker">What was argued</span>
  <p class="n-pull">Every one of you already does behavioural economics. You are just doing it
  to yourselves.</p>
  <p class="n-body">Then two hundred teenagers were walked through the same handful of moves a
  shop makes on them, using the prices in the shopping centre next to the school. The point was
  not that they were being tricked. It was that the moves work anyway.</p>
</div></section>

<section class="n-beat"><div class="wrap">
  <span class="n-kicker">What actually happened</span>
  <p class="n-body">The part that landed was not the research. It was the envelope exercise,
  where they had to allocate a fortnight of real money before they were allowed to spend any of
  it, and then were shown what they had actually chosen.</p>
  <p class="n-body">Every field session on this site is written up the same way: what was
  argued, what the room did with it, <b>and the bits that did not work</b>.</p>
</div></section>
""" + out('__NS__ sessions written up, and the material behind them.').replace(
    '__NS__', str(N_SESSIONS))


CARDS = [
 dict(key='one', tag='Flow one', title='One moment, all the way down', rec=False,
      mock=MOCK1,
      desc='The homepage stops summarising the site and performs it. Four beats down one scroll: '
           'the thing you walked past, the move it made on you, the name for that move, and then '
           'the study with its real numbers and its weakness. It is the site in miniature, and it '
           'is the only one where a visitor finishes the homepage having actually learned '
           'something rather than having been told that learning is available.',
      slab='<b>Replaces the slab with the receipt.</b> Three numbers claiming rigour is the '
           'weakest possible proof for a site about evidence quality. One citation shown '
           'properly, caveat and all, proves it instead of asserting it.',
      stale='<b>The staleness fix:</b> the four beats are the structure and the example is a '
            'slot inside it. Swapping the moment is a content edit, not a redesign, and the '
            'page reads the same the day after you change it.'),

 dict(key='two', tag='Flow two', title='Claim, then receipt', rec=True,
      mock=MOCK2,
      desc='Three pairs down the page. On the left a confident claim about people that a reader '
           'will nod along to, set big. On the right, immediately, the evidence, including the '
           'part where the evidence is thinner than the claim. It is your editorial voice turned '
           'into the page structure, and the jam study admitting it has had a rough decade does '
           'more for your credibility than any number could.',
      slab='<b>Replaces the slab entirely.</b> The proof is demonstrated three times before a '
           'visitor reaches any navigation, so there is nothing left for a stat row to do.',
      stale='<b>The staleness fix:</b> nothing here is pegged to a date, a count or a single '
            'example. Claims about how people decide do not age, and if one of the three '
            'receipts weakens further, that is new copy for that receipt rather than a hole in '
            'the page.'),

 dict(key='three', tag='Flow three', title='The staircase', rec=False,
      mock=MOCK3,
      desc='The five stages you already have, but walked down the page in order instead of '
           'picked from a control. One stage per step: what the person does, what goes wrong '
           'there, and the one principle that answers it. No persona picker, no vocabulary '
           'toggle, one vocabulary chosen and committed to. It is the least new writing of the '
           'four because the stages already exist.',
      slab='<b>Replaces the slab with a spine.</b> The numbers on the left do the job the stat '
           'row was doing, which is signalling that there is a lot here, except they are also '
           'the navigation.',
      stale='<b>The staleness fix:</b> the five steps are a claim about how buying works, not '
            'about how much content you have, so adding a principle changes nothing on the '
            'homepage. The borrowed pattern is the progress rail already used on three article '
            'pages, turned into page furniture.'),

 dict(key='four', tag='Flow four', title='The room', rec=False,
      mock=MOCK4,
      desc='Proof by having done it. The homepage opens on a real photograph of a real room, '
           'says what was argued in it, and says what the room did with the argument, including '
           'the part that did not land. It is the only one of the four that can use photography '
           'you already own, and the only one where the credibility comes from the work rather '
           'than from the writing.',
      slab='<b>Replaces the slab with a photograph.</b> One picture of two hundred people in a '
           'hall says more about whether this is real than "56, 10, 0" can.',
      stale='<b>The staleness risk is the highest of the four</b>, and there is a second thing '
            'to decide. A named session on the homepage dates the site the moment the next one '
            'happens, so this only works if you swap the photo and the two paragraphs every time '
            'you run one. That is a habit, not a build. Separately: the photograph is of '
            'identifiable school students. It is already on the sessions page and it was checked '
            'clean, but the homepage is the page that gets shared, indexed and screenshotted, '
            'and that is a bigger exposure than the one you have already agreed to. Your call, '
            'not mine, and worth making deliberately.'),
]


SHELL_CSS = """
:root{
  --paper:#FBF9F4; --paper-alt:#F1EEE6; --panel:#FFFFFF; --line:rgba(30,27,22,0.12);
  --ink:#1E1B16; --ink-soft:rgba(30,27,22,0.6);
  --accent:#B2472B; --accent-ink:#FBF9F4; --accent2:#2B6660; --accent2-ink:#FBF9F4;
  --good:#2B6660; --good-ink:#FBF9F4; --needs:#B2472B; --needs-ink:#FBF9F4;
  --shadow:0 1px 2px rgba(30,27,22,.06), 0 8px 24px rgba(30,27,22,.08);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#17191A; --paper-alt:#1D2023; --panel:#232628; --line:rgba(238,234,226,0.15);
  --ink:#EEEAE2; --ink-soft:rgba(238,234,226,0.6);
  --accent:#D97A56; --accent-ink:#1A1310; --accent2:#5FA89A; --accent2-ink:#0D1917;
  --good:#5FA89A; --good-ink:#0D1917; --needs:#D97A56; --needs-ink:#1A1310;
  --shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.35);}}
:root[data-theme="dark"]{
  --paper:#17191A; --paper-alt:#1D2023; --panel:#232628; --line:rgba(238,234,226,0.15);
  --ink:#EEEAE2; --ink-soft:rgba(238,234,226,0.6);
  --accent:#D97A56; --accent-ink:#1A1310; --accent2:#5FA89A; --accent2-ink:#0D1917;
  --good:#5FA89A; --good-ink:#0D1917; --needs:#D97A56; --needs-ink:#1A1310;
  --shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.35);}
:root[data-theme="light"]{
  --paper:#FBF9F4; --paper-alt:#F1EEE6; --panel:#FFFFFF; --line:rgba(30,27,22,0.12);
  --ink:#1E1B16; --ink-soft:rgba(30,27,22,0.6);
  --accent:#B2472B; --accent-ink:#FBF9F4; --accent2:#2B6660; --accent2-ink:#FBF9F4;
  --good:#2B6660; --good-ink:#FBF9F4; --needs:#B2472B; --needs-ink:#FBF9F4;
  --shadow:0 1px 2px rgba(30,27,22,.06), 0 8px 24px rgba(30,27,22,.08);}
*{box-sizing:border-box;}
[hidden]{display:none !important;}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}
.wrap{max-width:1000px;margin:0 auto;padding:44px 20px 80px;}
h1{font-family:Georgia,ui-serif,serif;font-size:30px;margin:0 0 6px;text-wrap:balance;}
.sub{color:var(--ink-soft);font-size:15px;line-height:1.6;margin:0 0 8px;max-width:70ch;}
.ask{font-size:13.5px;color:var(--ink-soft);background:var(--paper-alt);border:1px solid var(--line);
  border-radius:10px;padding:12px 15px;margin:18px 0 10px;line-height:1.6;}
.ask b{color:var(--ink);}
.ask--warn{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,transparent);}
.ask--warn b{color:var(--accent);}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;
  box-shadow:var(--shadow);margin-bottom:28px;overflow:hidden;}
.card.rec{border-left:3px solid var(--accent2);}
.card__head{padding:18px 22px 0;}
.tag{display:inline-block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;
  color:var(--accent);font-weight:600;margin-bottom:6px;}
.card h3{font-family:Georgia,ui-serif,serif;font-size:20px;margin:0 0 7px;}
.card p.desc{font-size:14px;color:var(--ink-soft);line-height:1.62;margin:0 0 14px;max-width:68ch;}
.notes{padding:0 22px 16px;display:grid;gap:8px;}
.note{font-size:13px;line-height:1.58;color:var(--ink-soft);padding:10px 13px;border-radius:9px;
  background:var(--paper-alt);}
.note b{color:var(--ink);}
.note--warn{background:color-mix(in srgb,var(--accent) 9%,transparent);}
.note--warn b{color:var(--accent);}
.preview{background:var(--paper-alt);border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);padding:16px;}
.frame{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;
  box-shadow:0 2px 10px rgba(0,0,0,.08);}
.frame-bar{display:flex;align-items:center;gap:6px;padding:9px 12px;background:#EDEAE2;
  border-bottom:1px solid rgba(0,0,0,.08);}
.frame-dot{width:8px;height:8px;border-radius:50%;background:rgba(0,0,0,.18);}
.frame-url{margin-left:8px;font-size:11px;color:rgba(0,0,0,.45);}
.frame iframe{display:block;width:100%;height:620px;border:0;background:#FBF9F4;}
.scrollhint{font-size:12px;color:var(--ink-soft);margin:9px 2px 0;font-style:italic;}
.toggle{display:flex;gap:8px;padding:16px 22px 4px;flex-wrap:wrap;}
.toggle-btn{border:1px solid var(--line);background:var(--panel);color:var(--ink-soft);
  font-size:13px;padding:7px 14px;border-radius:999px;cursor:pointer;transition:.15s;min-height:40px;}
.toggle-btn:hover{border-color:var(--accent);}
.toggle-btn[data-active="true"][data-val="good"]{background:var(--good);border-color:var(--good);
  color:var(--good-ink);}
.toggle-btn[data-active="true"][data-val="needs-work"]{background:var(--needs);
  border-color:var(--needs);color:var(--needs-ink);}
.comment{margin:10px 22px 20px;}
.comment textarea{width:100%;min-height:44px;resize:vertical;border:1px solid var(--line);
  border-radius:8px;background:var(--paper);color:var(--ink);font-family:inherit;font-size:13.5px;
  padding:9px 11px;}
.comment textarea:focus{outline:2px solid var(--accent);outline-offset:1px;}
.feedback{background:var(--panel);border:1px solid var(--line);border-radius:16px;
  box-shadow:var(--shadow);padding:18px 20px;margin-top:36px;}
.feedback h3{font-family:Georgia,ui-serif,serif;font-size:17px;margin:0 0 10px;}
.feedback textarea{width:100%;min-height:90px;border:1px solid var(--line);border-radius:8px;
  background:var(--paper-alt);color:var(--ink);font-family:inherit;font-size:13px;padding:10px;
  resize:vertical;}
.feedback-row{display:flex;justify-content:flex-end;gap:10px;margin-top:10px;}
.copy-btn{background:var(--accent);color:var(--accent-ink);border:none;border-radius:8px;
  padding:11px 18px;font-size:13.5px;font-weight:600;cursor:pointer;min-height:42px;}
.copy-btn[data-copied="true"]{background:var(--accent2);color:var(--accent2-ink);}
.theme-toggle{position:fixed;top:14px;right:14px;z-index:20;width:38px;height:38px;
  border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink);
  box-shadow:var(--shadow);cursor:pointer;font-size:17px;display:flex;align-items:center;
  justify-content:center;padding:0;}
@media (max-width:640px){
  .wrap{padding:34px 14px 60px;}
  h1{font-size:25px;}
  .card__head{padding:16px 16px 0;}
  .preview{padding:12px 10px;}
  .notes{padding:0 16px 14px;}
  .frame iframe{height:520px;}
  .toggle{padding:14px 16px 4px;}
  .toggle-btn{flex:1 1 auto;min-width:44%;}
  .comment{margin:10px 16px 18px;}
}
"""

JS = """
(function(){
  var root=document.documentElement, btn=document.getElementById('theme-toggle');
  var KEY='wwy-fb-theme', stored=null;
  try{stored=localStorage.getItem(KEY);}catch(e){}
  if(stored==='light'||stored==='dark') root.setAttribute('data-theme',stored);
  function isDark(){var c=root.getAttribute('data-theme');
    return c==='dark'||(c!=='light'&&window.matchMedia&&
      window.matchMedia('(prefers-color-scheme: dark)').matches);}
  function sync(){btn.textContent=isDark()?'\\u2600\\ufe0f':'\\ud83c\\udf19';}
  sync();
  btn.addEventListener('click',function(){
    var next=isDark()?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem(KEY,next);}catch(e){}
    sync();
  });
})();

// Each mock runs in its own iframe carrying the site's real stylesheet, so it
// is the site's type and palette rather than a copy of them, and nothing in a
// mock can leak into this page's chrome.
(function(){
  var css=document.getElementById('sitecss').textContent
        + document.getElementById('mockcss').textContent;
  [].forEach.call(document.querySelectorAll('iframe[data-mock]'),function(f){
    var body=document.getElementById('mock-'+f.getAttribute('data-mock')).textContent;
    f.srcdoc='<!doctype html><html><head><meta charset="utf-8">'
      + '<meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<style>' + css + '</style></head><body>' + body + '</body></html>';
  });
})();

document.querySelectorAll('[data-item]').forEach(function(item){
  item.querySelectorAll('.toggle-btn').forEach(function(b){
    b.addEventListener('click',function(){
      var on=b.getAttribute('data-active')==='true';
      item.querySelectorAll('.toggle-btn').forEach(function(x){x.removeAttribute('data-active');});
      if(!on) b.setAttribute('data-active','true');
      update();
    });
  });
  var ta=item.querySelector('[data-comment]');
  if(ta) ta.addEventListener('input',update);
});
function update(){
  var out=[];
  document.querySelectorAll('[data-item]').forEach(function(item){
    var a=item.querySelector('.toggle-btn[data-active="true"]');
    var c=item.querySelector('[data-comment]');
    var v=c?c.value.trim():'';
    if(!a&&!v) return;
    out.push('\\u2014 '+item.getAttribute('data-title')
      +'\\n  Choice: '+(a?a.textContent.trim():'(no choice)')
      +(v?'\\n  Comment: '+v:''));
  });
  document.getElementById('fb-output').value=out.length?out.join('\\n\\n'):'';
}
document.getElementById('fb-copy').addEventListener('click',function(){
  var b=this,t=document.getElementById('fb-output').value;
  if(!t) return;
  function done(){b.textContent='Copied \\u2713';b.setAttribute('data-copied','true');
    setTimeout(function(){b.textContent='Copy feedback';b.removeAttribute('data-copied');},1800);}
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(done).catch(function(){fb(t,done);});
  } else fb(t,done);
});
function fb(t,cb){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);
  a.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(a);cb();}
"""


def card_html(c, logo, photo):
    mock = c['mock'].replace('__PHOTO__', photo)
    return (
      '<div class="card%s" data-item data-title="%s">'
      '<div class="card__head"><span class="tag">%s</span><h3>%s</h3>'
      '<p class="desc">%s</p></div>'
      '<div class="notes"><p class="note">%s</p><p class="note%s">%s</p></div>'
      '<div class="preview"><div class="frame">'
      '<div class="frame-bar"><i class="frame-dot"></i><i class="frame-dot"></i>'
      '<i class="frame-dot"></i><span class="frame-url">grantburrow.com</span></div>'
      '<iframe data-mock="%s" title="%s" loading="lazy"></iframe></div>'
      '<p class="scrollhint">Scroll inside the window. This is the real stylesheet, so the type '
      'and the colours are the site&rsquo;s own.</p></div>'
      '<div class="toggle"><button class="toggle-btn" data-val="good">Looks good</button>'
      '<button class="toggle-btn" data-val="needs-work">Needs work</button></div>'
      '<div class="comment"><textarea data-comment placeholder="Notes…"></textarea></div>'
      '</div>'
      % (' rec' if c['rec'] else '', esc(c['title']), esc(c['tag']), esc(c['title']), c['desc'],
         c['slab'], ' note--warn' if 'risk' in c['stale'].lower() else '', c['stale'],
         c['key'], esc(c['title'])))


def build(dest):
    logo, photo = b64_logo(), b64_img('airds-room-wide.jpg')
    hero = HERO.replace('__LOGO__', logo)

    mocks = ''.join(
      '<script type="text/plain" id="mock-%s">%s</script>'
      % (c['key'], hero + c['mock'].replace('__PHOTO__', photo)) for c in CARDS)

    head = """  <h1>Four homepages that read as a story</h1>
  <p class="sub">No pickers, no tabs, no stat row. Each of these is one scroll with a beginning,
  a middle and an end, shown running in the site&rsquo;s own stylesheet rather than drawn as a
  diagram, because that is the only way to judge whether a flow is compelling.</p>
  <div class="ask ask--warn"><b>First, the slab is not just stale, it is wrong.</b> It claims
  __NE_CLAIM__ experiment teardowns and the site has __NE__. It claims __NP__ principles, which
  is right today and is typed into the HTML by hand, so it is one lesson away from being wrong
  too. Whichever of these you pick, that section goes.</div>
  <div class="ask">My pick is <b>flow two</b>. It is the only one that needs no example to stay
  fresh, no photograph you have to keep reshooting and no count of anything, and the receipts
  admitting where the evidence has weakened is the most persuasive thing on any of these four
  pages. <b>Flow one</b> is the better teacher and needs a new moment written every few months to
  stay alive. Each card says what replaces the slab and where its own staleness lives.</div>
"""
    head = (head.replace('__NE_CLAIM__', '10').replace('__NE__', str(N_EXPERIMENTS))
                .replace('__NP__', str(N_PRINCIPLES)))

    body = '\n'.join(card_html(c, logo, photo) for c in CARDS)

    doc = ('<title>Four Homepage Narratives</title>\n'
           '<meta name="viewport" content="width=device-width, initial-scale=1, '
           'viewport-fit=cover">\n'
           '<style>' + SHELL_CSS + '</style>\n'
           '<script type="text/plain" id="sitecss">' + CSS + '</script>\n'
           '<script type="text/plain" id="mockcss">' + MOCKCSS + '</script>\n'
           + mocks + '\n'
           '<button class="theme-toggle" id="theme-toggle" type="button" '
           'aria-label="Toggle light and dark">🌙</button>\n'
           '<div class="wrap">\n' + head + '\n' + body + '\n'
           '  <div class="feedback"><h3>Feedback</h3>'
           '<textarea id="fb-output" readonly placeholder="Toggle the options above and your '
           'picks and notes build up here."></textarea>'
           '<div class="feedback-row"><button class="copy-btn" id="fb-copy">Copy feedback</button>'
           '</div></div>\n</div>\n'
           '<script>' + JS + '</script>\n')

    for bad in ('—', '&mdash;', '&#8212;'):
        # the copied feedback bullet is the review format itself, not site prose
        if bad in head + body:
            raise SystemExit('flow options: em dash in the prose: %r' % bad)
    if '</script' in CSS or '</script' in MOCKCSS:
        raise SystemExit('stylesheet would close its own script block')

    open(dest, 'w').write(doc)
    print('wrote %s (%.2f MB, %d flows)' % (dest, len(doc) / 1024 / 1024, len(CARDS)))


if __name__ == '__main__':
    build(sys.argv[1] if len(sys.argv) > 1 else 'cricket-flow-options.html')
