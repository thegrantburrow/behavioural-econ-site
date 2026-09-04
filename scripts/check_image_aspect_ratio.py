#!/usr/bin/env python3
"""
Regression test: no CSS rule may scale an <img>'s width to a percentage
without also letting its height resize proportionally.

Why this exists: on 2026-09-04, `.spotted-item img` in styles.css set
`width: 100%` with no `height` rule at all. Every real screenshot inside
a `.spotted-wild` block (GoDaddy, CommSec, Apple Returns, McDonald's,
Up Bank, and the newly built Bankwest panels) also carries real pixel
`width`/`height` HTML attributes, added site-wide for the anchor-scroll
CLS fix (see CLAUDE.md). Those attributes map to a low-specificity
`height: <value>px` presentational hint in the browser's own stylesheet.
Without an explicit `height: auto` in this site's own CSS to override
that hint, the browser renders the image at its literal unscaled pixel
height while the width shrinks to fit its container, a severe vertical
stretch. The owner's catch, on a real phone: "Just do a collage of the
photos I shared... Root cause and fix for all." Confirmed via Playwright
getBoundingClientRect() that every `.spotted-item img` on the live site
was affected, not just the newest one, since the missing rule was in the
shared CSS class, not any one image's own markup.

This is a lint over styles.css, not the HTML: it flags any CSS rule
targeting an <img> element (by tag, class, or descendant selector) that
scales width to a percentage without a matching `height: auto` (or an
intentional `object-fit` crop, which legitimately pins height).

Usage:
    python3 scripts/check_image_aspect_ratio.py

Exits non-zero if any such rule is found.
"""
import re
import sys
from pathlib import Path


def main():
    css_path = Path(__file__).resolve().parent.parent / 'mockup' / 'styles.css'
    css = css_path.read_text(encoding='utf-8')

    bad = []
    for m in re.finditer(r'([^{}]*)\{([^}]*)\}', css):
        selector, body = m.group(1).strip(), m.group(2)
        if not re.search(r'\bimg\b', selector):
            continue
        scales_width = re.search(r'(?<![-\w])width\s*:\s*(?:\d+%|100%)', body)
        has_height_auto = re.search(r'height\s*:\s*auto', body)
        has_object_fit = 'object-fit' in body
        if scales_width and not has_height_auto and not has_object_fit:
            bad.append((selector, body.strip()))

    if bad:
        print("=== styles.css: img rule scales width without height:auto (will stretch any img with width/height attributes) ===")
        for sel, body in bad:
            print(f"  {sel!r} | {body[:100]}")
        sys.exit(1)
    else:
        print("OK, every img-scaling CSS rule has height:auto or an intentional object-fit crop")
        sys.exit(0)


if __name__ == '__main__':
    main()
