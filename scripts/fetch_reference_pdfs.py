"""Fetch missing reference PDFs via open-access resolvers and direct links.

Tries, in order per entry: direct .pdf URLs, NBER/arxiv/hal patterns, then
Semantic Scholar and OpenAlex DOI lookups.

Usage:
  python3 scripts/fetch_reference_pdfs.py
  python3 scripts/fetch_reference_pdfs.py --limit 20
  python3 scripts/fetch_reference_pdfs.py --dry-run
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from reference_pdf_lib import (
    PAPERS,
    load_manifest,
    resolve_pdf_url,
    save_manifest,
    try_download_pdf,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0, help="max entries to attempt")
    parser.add_argument("--sleep", type=float, default=0.35, help="seconds between attempts")
    args = parser.parse_args()

    manifest = load_manifest()
    PAPERS.mkdir(parents=True, exist_ok=True)

    missing = [e for e in manifest["entries"] if e["status"] == "missing"]
    if args.limit:
        missing = missing[: args.limit]

    ok = 0
    failed: list[str] = []
    for entry in missing:
        pdf_url = resolve_pdf_url(entry)
        if not pdf_url:
            failed.append(f"{entry['suggested_filename']}: no open PDF URL found")
            continue
        if args.dry_run:
            print(f"would fetch {entry['suggested_filename']} <- {pdf_url}")
            continue
        print(f"fetching {entry['suggested_filename']} ...")
        data = try_download_pdf(pdf_url)
        if data and not args.dry_run:
            from reference_pdf_lib import ingest_bytes

            if ingest_bytes(entry, data, manifest):
                ok += 1
                time.sleep(args.sleep)
                continue
        failed.append(f"{entry['suggested_filename']}: {pdf_url}")
        time.sleep(args.sleep)

    if not args.dry_run:
        save_manifest(manifest)

    attempted = len(missing) if args.dry_run else ok + len(failed)
    print(f"fetched {ok}/{len(missing)} missing PDFs")
    if failed and not args.dry_run:
        print("unresolved:", file=sys.stderr)
        for line in failed[:30]:
            print(f"  {line}", file=sys.stderr)
        if len(failed) > 30:
            print(f"  ... and {len(failed) - 30} more", file=sys.stderr)


if __name__ == "__main__":
    main()
