#!/usr/bin/env python3
"""
Regression test: a principle article that cross-links to a Science Behind
entry via "Decoded on The Science Behind" / "Also decoded on The Science
Behind" must mirror that entry's real photographic evidence inline (a
.spotted-wild block), whenever that Science Behind entry actually has one
(spotted-wild or an inline sb-screenshot) to mirror.

Why this exists: on 2026-09-05 the owner flagged the Framing Effect
principle for using only an invented abstract diagram, "I've shared good
real life example screenshots of framing. They should be used to
illustrate." The principle already linked to macca-golden-deal, a Science
Behind entry that DOES carry real McDonald's screenshots, the citation
just never carried the evidence forward onto the principle page itself. A
site-wide check found 7 more principles with the identical gap
(loss-aversion, clawback, mental-accounting, goal-gradient, chunking,
scarcity, probability-weighting), all citing entries (up-bank-teardown,
macca-golden-deal) that already had real images sitting unused one click
away. precommitment-devices cites up-bank-teardown too, and correctly has
no gap: that entry has real photos for other mechanisms, but its own
Precommitment Devices block has none to mirror. The check is scoped to
the specific .sb-block a principle's own link sits inside, not "does the
entry have evidence anywhere," precisely so a 7-mechanism entry with
photos for 2 of them doesn't produce 5 false positives.

This is a *lint*, not an auto-fixer: it can't decide which real image
best represents a given principle, or write its caption, that's a human/
agent judgement call per the spotted-in-the-wild skill. It only flags
principles that cite an entry with evidence to mirror and don't yet
mirror it.

Usage:
    python3 scripts/check_missing_wild_mirror.py

Exits non-zero if any gap is found.
"""
import re
import sys
from pathlib import Path


def sb_principles_with_evidence(sb_html):
    """Map each (sb_entry_id, principle_id) pair to whether that SPECIFIC
    mechanism's own .sb-block carries real evidence, not just whether the
    entry has evidence somewhere. An entry can have 7 mechanisms and real
    photos for only 2 of them; a principle citing that entry only has
    something to mirror if its own mechanism is one of the 2."""
    result = set()
    for entry_m in re.finditer(r'<article class="sb-entry"[^>]*id="([^"]+)"[^>]*>(.*?)(?=<article class="sb-entry"|<footer)',
                                sb_html, re.S):
        eid, body = entry_m.group(1), entry_m.group(2)
        for block_m in re.finditer(r'<div class="sb-block">(.*?)</div>\s*(?=<div class="sb-block">|<div class="sb-split">|<div class="spotted-wild">)',
                                    body, re.S):
            block = block_m.group(1)
            if 'spotted-wild' in block or 'sb-screenshot' in block:
                for pid in set(re.findall(r'principles\.html#([a-z0-9-]+)', block)):
                    result.add((eid, pid))
    return result


def find_principle_blocks(html):
    positions = [(m.start(), m.group(1)) for m in re.finditer(r'<section class="principle" id="([a-z0-9-]+)"', html)]
    positions.append((len(html), None))
    for i in range(len(positions) - 1):
        start, pid = positions[i]
        end = positions[i + 1][0]
        yield pid, html[start:end]


def main():
    root = Path(__file__).resolve().parent.parent / 'mockup'
    sb_html = (root / 'science-behind.html').read_text(encoding='utf-8')
    principles_html = (root / 'principles.html').read_text(encoding='utf-8')

    pairs_with_evidence = sb_principles_with_evidence(sb_html)

    gaps = {}
    for pid, block in find_principle_blocks(principles_html):
        cited = set(re.findall(r'science-behind\.html#([a-z0-9-]+)', block))
        cited_with_evidence = sorted(eid for eid in cited if (eid, pid) in pairs_with_evidence)
        if cited_with_evidence and 'spotted-wild' not in block:
            gaps[pid] = cited_with_evidence

    if gaps:
        print("=== principles.html: cites Science Behind evidence but doesn't mirror it ===")
        for pid, entries in gaps.items():
            print(f"  {pid} -> {', '.join(entries)}")
        sys.exit(1)
    else:
        print("OK, no gaps found")
        sys.exit(0)


if __name__ == '__main__':
    main()
