"""Download openly linked PDFs listed in references/manifest.json.

Only attempts entries whose site URL already ends in .pdf. Paywalled DOI
landing pages are skipped on purpose; those PDFs should be added manually
(or via Grok) with ingest_reference_pdf.py.

Usage:
  python3 scripts/download_reference_pdfs.py
  python3 scripts/download_reference_pdfs.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / "references" / "manifest.json"
PAPERS = REPO / "references" / "papers"
USER_AGENT = "behavioural-econ-site-reference-archiver/1.0"


def is_pdf_bytes(data: bytes) -> bool:
    return data.startswith(b"%PDF")


def download(url: str, dest: Path, retries: int = 3) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
            if not is_pdf_bytes(data):
                raise ValueError("response is not a PDF")
            dest.write_bytes(data)
            return
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(2**attempt)
    raise RuntimeError(f"failed after {retries} attempts: {last_error}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    manifest = json.loads(MANIFEST.read_text())
    PAPERS.mkdir(parents=True, exist_ok=True)

    candidates = [
        e
        for e in manifest["entries"]
        if e["status"] == "missing"
        and e.get("url")
        and e["url"].lower().split("?", 1)[0].endswith(".pdf")
    ]

    ok = 0
    failed: list[str] = []
    for entry in candidates:
        dest = REPO / "references" / entry["pdf_path"]
        if args.dry_run:
            print(f"would fetch {entry['url']} -> {dest.name}")
            continue
        try:
            print(f"fetching {dest.name} ...")
            download(entry["url"], dest)
            entry["status"] = "on_disk"
            ok += 1
        except Exception as exc:  # noqa: BLE001
            failed.append(f"{entry['suggested_filename']}: {exc}")

    if not args.dry_run:
        manifest["on_disk"] = sum(1 for e in manifest["entries"] if e["status"] == "on_disk")
        MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")

    print(f"downloaded {ok}/{len(candidates)} direct-link PDFs")
    if failed:
        print("failures:", file=sys.stderr)
        for line in failed:
            print(f"  {line}", file=sys.stderr)
        sys.exit(1 if ok == 0 else 0)


if __name__ == "__main__":
    main()
