"""Place a sourced PDF into references/papers/ and update manifest status.

Use when Grok (or a human) has a local PDF for a manifest entry.

Usage:
  python3 scripts/ingest_reference_pdf.py --id 769f957d79 --file ~/Downloads/thorndike.pdf
  python3 scripts/ingest_reference_pdf.py --filename 1920-thorndike-a-constant-error-in-psychological-ratings.pdf --file paper.pdf
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / "references" / "manifest.json"
PAPERS = REPO / "references" / "papers"


def main() -> None:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--id", help="manifest entry id")
    group.add_argument("--filename", help="suggested_filename from manifest")
    parser.add_argument("--file", required=True, help="path to the PDF to ingest")
    args = parser.parse_args()

    src = Path(args.file).expanduser().resolve()
    if not src.is_file():
        raise SystemExit(f"file not found: {src}")
    if src.read_bytes()[:4] != b"%PDF":
        raise SystemExit(f"not a PDF: {src}")

    manifest = json.loads(MANIFEST.read_text())
    entry = None
    for candidate in manifest["entries"]:
        if args.id and candidate["id"] == args.id:
            entry = candidate
            break
        if args.filename and candidate["suggested_filename"] == args.filename:
            entry = candidate
            break
    if entry is None:
        raise SystemExit("no matching manifest entry")

    PAPERS.mkdir(parents=True, exist_ok=True)
    dest = REPO / "references" / entry["pdf_path"]
    shutil.copy2(src, dest)
    entry["status"] = "on_disk"
    manifest["on_disk"] = sum(1 for e in manifest["entries"] if e["status"] == "on_disk")
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"ingested {dest.relative_to(REPO)}")


if __name__ == "__main__":
    main()
