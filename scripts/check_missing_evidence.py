#!/usr/bin/env python3
"""
Regression test: a Science Behind entry whose own sources note says its
screen copy was "captured" from a real app or site must actually ship that
visual evidence (a `.spotted-wild` block or inline `.sb-screenshot`s), not
describe it in prose alone.

Why this exists: on 2026-09-05 the "bankwest-interesting-rate" entry quoted
ten distinct pieces of real marketing copy ("Still a 'winner'", "You'll
still feel like one", "Skip the app? You'll miss your chance to enter") and
its own sb-sources paragraph said the screen copy was "drawn directly from
Bankwest's ... promotion ... captured 2026", the same claim macca-golden-deal
makes right before its spotted-wild block. Bankwest's entry had no visual
evidence at all: the owner had shared real screenshots of the promotion for
this exact entry, and they were never integrated. A "captured" sourcing
claim with this much quoted UI copy and no image is the site's own
admission that a screenshot exists (or should) and simply wasn't used.

This is a *lint*, not an auto-fixer: it can't attach real screenshots for
you (see spotted-in-the-wild skill), it only flags the gap so a human/agent
addresses it before calling the entry finished.

Usage:
    python3 scripts/check_missing_evidence.py [file ...]

Defaults to mockup/science-behind.html. Exits non-zero if any gap is found.
"""
import re
import sys
from pathlib import Path


def find_articles(html):
    positions = [(m.start(), m.group(1))
                 for m in re.finditer(r'<article class="sb-entry"[^>]*id="([^"]+)"', html)]
    positions.append((len(html), None))
    return positions


def analyze(html):
    positions = find_articles(html)
    gaps = []
    for i in range(len(positions) - 1):
        start, aid = positions[i]
        end = positions[i + 1][0]
        block = html[start:end]

        sources_m = re.search(r'<div class="sb-sources">(.*?)</div>', block, re.S)
        sources = sources_m.group(1) if sources_m else ''
        claims_capture = bool(re.search(r'captured\s+20\d\d', sources))
        if not claims_capture:
            continue

        has_evidence = ('spotted-wild' in block) or ('sb-screenshot' in block)
        if not has_evidence:
            gaps.append(aid)
    return gaps


def main():
    root = Path(__file__).resolve().parent.parent / 'mockup'
    targets = [Path(f) for f in sys.argv[1:]] or [root / 'science-behind.html']

    any_gaps = False
    for path in targets:
        html = path.read_text(encoding='utf-8')
        gaps = analyze(html)
        if gaps:
            any_gaps = True
            print(f"=== {path.name}: entries claim captured screen copy but ship no visual evidence ===")
            for aid in gaps:
                print(f"  {aid}")
        else:
            print(f"=== {path.name}: OK, no gaps ===")

    sys.exit(1 if any_gaps else 0)


if __name__ == '__main__':
    main()
