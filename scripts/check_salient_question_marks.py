#!/usr/bin/env python3
"""
Regression test: every `.salient-question` on the site needs exactly one
<mark>-highlighted phrase, the single most concrete or surprising word or
short phrase in the question (behavioural-principle-article skill's own
rule, which explicitly "applies anywhere .salient-question is used, not
just principles.html").

Why this exists: this component is shared across principles.html,
sessions.html, experiments.html, science-behind.html,
natural-experiments.html, and any standalone special report using
.case-card, but the check for it had only ever actually been run against
principles.html and a few special reports. On 2026-09-05 the owner caught
a live gap on sessions.html's "dentist-visit" entry ("the yellow
highlights etc that we'd codified aren't here") that this exact check,
just never pointed at that file, would have already caught.

Usage:
    python3 scripts/check_salient_question_marks.py [file ...]

Defaults to every mockup/*.html file. Exits non-zero if any gap is found.
"""
import re
import sys
from pathlib import Path


def find_gaps(html):
    return [m.group(0) for m in re.finditer(r'<p class="salient-question[^"]*">.*?</p>', html)
            if '<mark>' not in m.group(0)]


def main():
    root = Path(__file__).resolve().parent.parent / 'mockup'
    targets = [Path(f) for f in sys.argv[1:]] or sorted(root.glob('*.html'))

    any_gaps = False
    for path in targets:
        html = path.read_text(encoding='utf-8')
        gaps = find_gaps(html)
        if gaps:
            any_gaps = True
            print(f"=== {path.name}: salient-question missing <mark> ===")
            for g in gaps:
                print(f"  {g}")

    if not any_gaps:
        print("OK, no gaps found")
    sys.exit(1 if any_gaps else 0)


if __name__ == '__main__':
    main()
