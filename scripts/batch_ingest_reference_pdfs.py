"""Batch-ingest PDFs from a folder into references/papers/.

Matches inbox files to manifest entries by filename, then by year+author slug,
then by token overlap. Unmatched files are reported; matched files are copied
to papers/ and marked on_disk.

Default inbox: references/inbox/

Usage:
  python3 scripts/batch_ingest_reference_pdfs.py
  python3 scripts/batch_ingest_reference_pdfs.py --dir ~/Downloads/grok-papers
  python3 scripts/batch_ingest_reference_pdfs.py --move   # move instead of copy
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from reference_pdf_lib import INBOX, PAPERS, REPO, ingest_bytes, load_manifest, save_manifest


def tokenize_slug(text: str) -> set[str]:
    return {t for t in re.split(r"[-_\s]+", text.lower()) if len(t) > 2}


def score_match(filename_stem: str, entry: dict) -> int:
    suggested = Path(entry["suggested_filename"]).stem
    if filename_stem == suggested:
        return 1000
    if filename_stem in suggested or suggested in filename_stem:
        return 900

    file_tokens = tokenize_slug(filename_stem)
    entry_tokens = tokenize_slug(suggested)
    overlap = len(file_tokens & entry_tokens)
    if overlap == 0:
        return 0

    score = overlap * 10
    year = entry.get("year")
    author = entry.get("first_author")
    if year and year in filename_stem:
        score += 20
    if author and author in filename_stem:
        score += 30
    return score


def best_entry_for_file(path: Path, entries: list[dict]) -> tuple[dict | None, int]:
    if path.name in {e["suggested_filename"] for e in entries}:
        for entry in entries:
            if entry["suggested_filename"] == path.name:
                return entry, 1000

    stem = path.stem.lower()
    best_entry = None
    best_score = 0
    for entry in entries:
        if entry["status"] == "on_disk":
            continue
        score = score_match(stem, entry)
        if score > best_score:
            best_score = score
            best_entry = entry
    if best_score < 25:
        return None, best_score
    return best_entry, best_score


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", type=Path, default=INBOX, help="folder of PDFs to ingest")
    parser.add_argument("--move", action="store_true", help="move files instead of copying")
    parser.add_argument("--min-score", type=int, default=25, help="minimum match score")
    args = parser.parse_args()

    inbox = args.dir.expanduser().resolve()
    if not inbox.is_dir():
        raise SystemExit(f"inbox folder not found: {inbox}")

    manifest = load_manifest()
    PAPERS.mkdir(parents=True, exist_ok=True)

    pdfs = sorted(p for p in inbox.glob("*.pdf") if p.is_file())
    if not pdfs:
        print(f"no PDFs found in {inbox}")
        return

    ingested = 0
    skipped = 0
    unmatched: list[str] = []

    for path in pdfs:
        if path.read_bytes()[:4] != b"%PDF":
            unmatched.append(f"{path.name} (not a PDF)")
            continue

        entry, score = best_entry_for_file(path, manifest["entries"])
        if entry is None or score < args.min_score:
            unmatched.append(f"{path.name} (no manifest match, score={score})")
            continue

        dest = REPO / "references" / entry["pdf_path"]
        if dest.exists() and dest.resolve() == path.resolve():
            entry["status"] = "on_disk"
            ingested += 1
            continue
        if dest.exists():
            skipped += 1
            print(f"skip {path.name}: already have {dest.name}")
            continue

        data = path.read_bytes()
        if ingest_bytes(entry, data, manifest):
            if args.move:
                path.unlink()
            ingested += 1
            print(f"ingested {path.name} -> {entry['pdf_path']} (score={score})")

    save_manifest(manifest)
    print(f"batch ingest complete: {ingested} ingested, {skipped} skipped, {len(unmatched)} unmatched")
    for line in unmatched:
        print(f"  unmatched: {line}")


if __name__ == "__main__":
    main()
