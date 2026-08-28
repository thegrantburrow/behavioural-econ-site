# Live Interactive Session

## Why this exists

Founded 2026-08-28 on a direct request: build a real, live, in-person demonstration of anchoring, two QR codes seeding two different anchors before the same estimate question, run with a real audience during a real talk, results shown live in the room. The owner's own framing: "New category of the website. These will be illustrative interactive sessions where an audience will experience behavioural science and economics in action." Anchoring was the pilot; more are expected to follow the same standard. This skill exists so the next one (loss aversion, social proof, whatever comes next) starts from the pipeline and the real technical lessons below, instead of re-deriving them.

## What this content type is, and isn't

It's a **live, in-person replication of a real published paradigm**, run with an actual audience, not a read-only page and not a hypothetical. It's distinct from every other content type on this site: `behavioural-principle-article` explains a mechanism from its cited study; `experiment-blueprint` is a testable design nobody has run yet; `field-session` is a first-person recap of a talk after it happened. A Live Session is a tool people actually use, during the talk, and the "content" (the write-up, the citation, the framing) exists to support that live moment, not to stand alone. It shares one discipline with every other content type on the site: the paradigm has to be a real one from the literature, not an invented "fun fact" quiz.

## The pipeline, in order

1. **Pick a principle already on the site with a real, replicable lab paradigm**, not just a mechanism that's true in general. Anchoring works because Tversky & Kahneman (1974) is a clean two-step design (comparative judgment against a planted anchor, then a free estimate) that transfers directly to a phone screen. Not every principle transfers this cleanly, check whether the actual published methodology is something a room full of people can do in under a minute before committing to it.
2. **Design the paradigm faithfully**, not just "in the spirit of" the study:
   - A comparative judgment against the anchor ("more or less than X?") always comes before the free estimate, this is the real two-step design from Jacowitz & Kahneman (1995) and the original 1974 study, not a detail to drop for simplicity.
   - Use the real historical anchor values when the study you're replicating had specific ones (10 and 65 for the UN-Africa question), don't invent round numbers that feel plausible.
   - Assignment to condition has to be effectively blind and effectively random from the participant's side. Two QR codes that look identical (same design, same size, no visible label reading "A" or "B") satisfy this even though the underlying links differ, what matters is nothing on the page or in the room ever tells a participant which condition they're in.
   - Report the group gap as a **median**, not a mean, these estimate distributions are typically right-skewed and a mean gets pulled by outliers.
3. **Build the live tool as a Claude Artifact using the `artifact` runtime capability**, not as a page on the static site. `grantburrow.com` has no backend, so shared, live-updating state across many phones plus a presenter's screen needs the artifact platform's shared-state publish model. See "The self-publishing technical pattern" below for exactly how, it's a real, working, non-obvious pattern, not a placeholder.
4. **State the write-access caveat plainly, every time, before relying on it live.** `artifact.publish()` requires write access, and a stranger who only has the link may load the page read-only rather than editable, this is a platform behavior, not a bug in the build. Test it for real (open the live link from a second, logged-out device or browser profile) before a live talk, and build the page to degrade gracefully (see below) rather than assuming it will just work.
5. **Generate real QR codes pointing at the deployed artifact URL**, one per condition, plus one for the presenter's reveal view. Verify each one actually decodes to the intended URL before treating it as done, a QR code that looks right and doesn't scan right is worse than no QR code.
6. **Wire it into `live-sessions.html`** (or whichever page holds this category): the paradigm explained in plain language, real "try it yourself" links for someone browsing the site outside a live event, a cross-link to the full principle article for the citation and methodology critique, and a plain explanation of how it's actually run live. Add the nav entry, footer link, sitemap entry, and homepage `explore-hub-card` the same way every other new category on this site gets wired in, that's not optional polish, it's how the category is actually reachable.

## The self-publishing technical pattern

The `artifact` capability's `publish(html)` call requires the **complete replacement document as a string**, and its own documentation explicitly warns against serializing the live DOM (`document.documentElement.outerHTML`) to build that string, since the live DOM can carry viewer-session state and runtime-injected scripts that don't belong in the next published version. That creates a real, non-obvious problem: the script that rebuilds the page has to describe the ENTIRE page, including itself, without literally containing a copy of its own source as a second, separately-maintained string (which would drift out of sync the moment either copy gets edited).

The stable solution, tested and working across multiple republish generations in this session:

- Capture this script's own live text at the very top of the script, synchronously, before any other script tag could run: `var OWN_SCRIPT_SRC = document.currentScript.textContent;`. Do the same for any `<style>` block whose content should carry forward unchanged: `document.getElementById('page-style').textContent`.
- Write the document shell (doctype, head, body wrapper, the `<script>`/`<style>` tag markers) **once**, as a plain JS string constant, with placeholder tokens (`__DATA_JSON__`, `__APP_SCRIPT__`, `__STYLE__`) where the changing parts go. Escape every `</script` inside that string as `<' + '/script>` (or equivalent) so the browser's original HTML parser doesn't close the tag early while parsing the page that contains this very constant.
- `buildHtml(state)` is just `SHELL.replace(token, function(){ return value; })` for each placeholder, using the function form of `.replace()` (not a bare string) so a literal `$` in the script or data never gets misinterpreted as a replacement pattern.
- This is self-consistent under repeated rebuilds: `OWN_SCRIPT_SRC` captured from generation N is byte-identical to what generation N+1 will capture from itself, since the logic never changes at runtime, only the embedded data does. Verified directly in this session: published a real response, reloaded from that published file, published a second response from the reloaded copy, and confirmed the second generation still parsed to exactly one `<style>` and two `<script>` elements with both responses present, no structural drift.

**Never serialize the live DOM for this, even though it looks like the obvious shortcut.** It's the platform's own explicit warning, and it's correct: the live DOM includes things the runtime injects that aren't part of your canonical source.

## Handling concurrent writes honestly

`publish()` is compare-and-set: if anyone else published between this view's load and this call, it rejects with `conflict`, and the platform reloads every open view (this one included) to the winning version, silently, without preserving whatever this view was about to write. Two things follow, and both are necessary, not optional:

- **Stash the pending write in `localStorage` (survives the reload) before calling `publish()`.** On boot, check for a stashed pending write that isn't yet reflected in the freshly-loaded data, and if it's missing, retry the whole append-and-publish cycle. This is the documented, intended pattern for this exact case, not a workaround.
- **Bound the retries** (this build caps at 6 attempts with jittered backoff) and fail honestly once they're exhausted, a message like "your answer didn't save after a few tries, just a live-demo hiccup" is accurate; pretending it always works isn't. This is a live-demo tool, not vote-tallying infrastructure, an occasional dropped response under a real rush of simultaneous submissions is an accepted, stated limitation.

## Degrading gracefully when write access isn't there

Treat a `not_writer`, `not_granted`, `capability_disabled`, or `not_declared` rejection (or `claude.use('artifact')` resolving `null` at all) as a **permanent, non-retryable signal for this view**: stop trying to write, and show the participant their own answer plainly ("your answer's in: 35%") without claiming it joined the room's results when it didn't. Never show a generic "something went wrong" here, the participant did nothing wrong and their estimate is still valid, only the live-tally part didn't work on this particular view.

## A real CSS trap: flex-centering a child that isn't a flex parent

The first build of the participant screens centered content using `.screen { flex: 1; justify-content: center; }`, expecting it to center vertically in the viewport. It rendered pinned to the top instead. Root cause: `.screen`'s actual parent was a plain `<div id="app">` (re-rendered via `innerHTML`/`appendChild` on every screen change), and `#app` itself was NOT `display: flex`, so `.screen`'s own `flex: 1` had nothing to size against. The fix is one line, `#app { display: flex; flex-direction: column; flex: 1; min-height: 0; }`, but it's the kind of bug that looks fine in the markup and only shows up on an actual screenshot. Screenshot every screen at a real mobile width before calling a live-session tool built, don't just read the CSS and assume it centers.

## Voice and rigor, same as everywhere else on the site

- **No em dashes**, anywhere a participant or reader sees text: the tool's own copy, the site page, the QR labels.
- **Never fabricate the real-world answer.** Verify the fact's true value (the UN-Africa percentage, or whatever the next session's fact is) the same way any other citation on this site gets verified, and cite where it came from in the site page's write-up, even though the live tool itself only needs the number, not the citation.
- **State residual technical uncertainty plainly, don't silently assume it away.** The write-access question is the clearest example: it's genuinely untested until the owner tests it live, and the build has to say so rather than presenting "it just works" as fact.
