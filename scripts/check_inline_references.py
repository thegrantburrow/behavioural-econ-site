#!/usr/bin/env python3
"""
Regression test: every cross-page reference an experiment or Science Behind
entry cites in its session-meta / also-note must also be inline-linked
somewhere in its own body prose (Theory, Hypothesis, Ethics, Design, etc.),
not just parked in the meta line and the closing note.

Why this exists: on 2026-09-04 the "home-loan-prize-draw" experiment's
Theory paragraph literally said "Bankwest's real Interesting Rates
promotion" and "Probability Weighting is the direct mechanism" as plain
text, while the actual <a href> to those pages only lived in session-meta
and the closing also-note. A reader following the prose had no way to
click through to the thing being described at the exact point it was
named. Running this checker for the first time found the same gap in
23 of the other 26 experiments on the site (see CLAUDE.md's "every
cross-page reference gets inline-linked" standing policy).

This is a *lint*, not an auto-fixer: it reports gaps for a human/agent to
fix by adding a real, well-placed inline link, not by mechanically
wrapping the first matching substring (which can land a link on the wrong
occurrence, or inside a heading, or across markup boundaries).

Usage:
    python3 scripts/check_inline_references.py [file ...]

Defaults to mockup/experiments.html and mockup/science-behind.html.
Exits non-zero if any gap is found, so it can be wired into CI later.
"""
import re
import sys
from pathlib import Path

ARTICLE_CLASSES = {
    'experiment': 'experiments.html',
    'sb-entry': 'multi',  # sb-entry is reused by science-behind.html and natural-experiments.html
}


def find_articles(html, article_class):
    positions = [(m.start(), m.group(1))
                 for m in re.finditer(r'<article class="%s"[^>]*id="([^"]+)"' % re.escape(article_class), html)]
    positions.append((len(html), None))
    return positions


def is_cross_page_ref(href, self_page):
    if href.startswith('#'):
        return False
    if href.startswith(self_page + '#') or href == self_page:
        return False
    if href.startswith('http') or href.startswith('mailto:'):
        return False
    return True


def analyze(html, article_class, self_page):
    positions = find_articles(html, article_class)
    gaps = {}
    for i in range(len(positions) - 1):
        start, aid = positions[i]
        end = positions[i + 1][0]
        block = html[start:end]

        meta_m = re.search(r'<p class="session-meta">(.*?)</p>', block, re.S)
        meta = meta_m.group(1) if meta_m else ''
        also_notes = re.findall(r'<div class="also-note">(.*?)</div>', block, re.S)
        also = ' '.join(also_notes)

        ref_hrefs = set(re.findall(r'href="([^"]+)"', meta)) | set(re.findall(r'href="([^"]+)"', also))
        ref_hrefs = {h for h in ref_hrefs if is_cross_page_ref(h, self_page)}
        if not ref_hrefs:
            continue

        body = block
        if meta_m:
            body = body.replace(meta_m.group(0), '')
        for an in also_notes:
            body = body.replace(an, '')
        body_hrefs = set(re.findall(r'href="([^"]+)"', body))

        missing = ref_hrefs - body_hrefs
        if missing:
            gaps[aid] = sorted(missing)
    return gaps


def main():
    root = Path(__file__).resolve().parent.parent / 'mockup'
    targets = sys.argv[1:] or [
        (root / 'experiments.html', 'experiment', 'experiments.html'),
        (root / 'science-behind.html', 'sb-entry', 'science-behind.html'),
    ]
    if sys.argv[1:]:
        # allow ad-hoc invocation with just file paths, guessing article class
        resolved = []
        for f in sys.argv[1:]:
            p = Path(f)
            cls = 'experiment' if 'experiments' in p.name else 'sb-entry'
            resolved.append((p, cls, p.name))
        targets = resolved

    any_gaps = False
    for path, article_class, self_page in targets:
        html = path.read_text(encoding='utf-8')
        gaps = analyze(html, article_class, self_page)
        if gaps:
            any_gaps = True
            print(f"=== {path.name}: cross-page references not inline-linked in body ===")
            for aid, missing in gaps.items():
                print(f"  {aid}")
                for href in missing:
                    print(f"    missing inline link to: {href}")
        else:
            print(f"=== {path.name}: OK, no gaps ===")

    sys.exit(1 if any_gaps else 0)


if __name__ == '__main__':
    main()
