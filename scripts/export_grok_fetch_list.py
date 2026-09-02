"""Export missing manifest entries for Grok PDF sourcing.

Writes:
  references/grok-fetch-list.json
  references/grok-fetch-list.md

Usage:
  python3 scripts/export_grok_fetch_list.py
"""

from __future__ import annotations

import json
import sys
from datetime import UTC, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from reference_pdf_lib import REPO, load_manifest

OUT_JSON = REPO / "references" / "grok-fetch-list.json"
OUT_MD = REPO / "references" / "grok-fetch-list.md"


def entry_payload(entry: dict) -> dict:
    return {
        "id": entry["id"],
        "label": entry["label"],
        "url": entry.get("url"),
        "canonical_url": entry.get("canonical_url"),
        "year": entry.get("year"),
        "first_author": entry.get("first_author"),
        "suggested_filename": entry["suggested_filename"],
        "source_pages": entry.get("source_pages", []),
    }


def render_markdown(missing: list[dict], on_disk: int, total: int) -> str:
    lines = [
        "# Grok fetch list: missing cited-study PDFs",
        "",
        f"Generated {datetime.now(UTC).strftime('%Y-%m-%d %H:%M UTC')} by "
        "`scripts/export_grok_fetch_list.py`.",
        "",
        f"**{len(missing)} papers** still missing from `references/papers/` "
        f"({on_disk}/{total} on disk).",
        "",
        "## Instructions for Grok",
        "",
        "1. For each row below, find the **full primary-source paper** (journal PDF, "
        "NBER working paper, publisher preprint, or scanned book chapter). "
        "Abstract-only pages do not count.",
        "2. Save each file to `references/inbox/` using the **exact** "
        "`suggested_filename` shown.",
        "3. Full papers only. No watermarks, no screenshot chrome, no paywall "
        "preview stubs.",
        "4. If a citation is a book with no single PDF, source the closest "
        "primary chapter or scan and note the limitation in the filename "
        "suffix only if unavoidable (prefer the canonical name).",
        "5. When done (or after each batch), run:",
        "",
        "   ```bash",
        "   python3 scripts/batch_ingest_reference_pdfs.py",
        "   ```",
        "",
        "6. Re-run this export to refresh the list:",
        "",
        "   ```bash",
        "   python3 scripts/export_grok_fetch_list.py",
        "   ```",
        "",
        "## Missing papers",
        "",
        "| # | Year | Author | Suggested filename | URL | Site pages |",
        "|---:|---:|---|---|---|---|",
    ]

    for i, entry in enumerate(missing, 1):
        year = entry.get("year") or ""
        author = entry.get("first_author") or ""
        filename = entry["suggested_filename"]
        url = entry.get("url") or entry.get("canonical_url") or ""
        pages = ", ".join(entry.get("source_pages", []))
        if url:
            url_cell = f"[link]({url})"
        else:
            url_cell = "(no URL on site)"
        lines.append(
            f"| {i} | {year} | {author} | `{filename}` | {url_cell} | {pages} |"
        )

    lines.extend(
        [
            "",
            "## Full citation labels",
            "",
        ]
    )

    for i, entry in enumerate(missing, 1):
        lines.append(f"### {i}. `{entry['suggested_filename']}`")
        lines.append("")
        lines.append(f"- **id:** `{entry['id']}`")
        lines.append(f"- **label:** {entry['label']}")
        url = entry.get("url") or entry.get("canonical_url")
        if url:
            lines.append(f"- **url:** {url}")
        lines.append(f"- **source_pages:** {', '.join(entry.get('source_pages', []))}")
        lines.append("")

    return "\n".join(lines)


def main() -> int:
    manifest = load_manifest()
    entries = manifest["entries"]
    missing = [e for e in entries if e.get("status") == "missing"]
    missing.sort(key=lambda e: (e.get("year") or "0000", e.get("first_author") or ""))

    on_disk = sum(1 for e in entries if e.get("status") == "on_disk")
    payload = {
        "description": "Missing cited-study PDFs for Grok to source into references/inbox/",
        "generated_at": datetime.now(UTC).isoformat(),
        "generated_by": "scripts/export_grok_fetch_list.py",
        "total_entries": len(entries),
        "on_disk": on_disk,
        "missing_count": len(missing),
        "entries": [entry_payload(e) for e in missing],
    }

    OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    OUT_MD.write_text(render_markdown(missing, on_disk, len(entries)) + "\n")

    print(f"Wrote {len(missing)} missing entries to:")
    print(f"  {OUT_JSON.relative_to(REPO)}")
    print(f"  {OUT_MD.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
