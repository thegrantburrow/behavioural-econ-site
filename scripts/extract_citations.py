"""Extract cited studies from mockup HTML into references/manifest.json.

Scans citation blocks (`.citation`, `.case-cite`) and embedded JSON `cite`
fields in live-session tools. Deduplicates by canonical URL where possible,
otherwise by normalized author/year/title text.

Usage:
  python3 scripts/extract_citations.py
  python3 scripts/extract_citations.py --check   # report manifest vs papers/
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import unicodedata
from html import unescape
from pathlib import Path
from urllib.parse import urlparse

REPO = Path(__file__).resolve().parent.parent
MOCKUP = REPO / "mockup"
REFERENCES = REPO / "references"
MANIFEST = REFERENCES / "manifest.json"
PAPERS = REFERENCES / "papers"

CITE_BLOCK = re.compile(
    r'<div class="(?:citation|case-cite)">(.*?)</div>',
    re.DOTALL | re.IGNORECASE,
)
ANCHOR = re.compile(
    r'<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
    re.DOTALL | re.IGNORECASE,
)
CITE_JSON = re.compile(r'"cite"\s*:\s*"((?:\\.|[^"\\])*)"')
SKIP_HREF = re.compile(
    r"^(?:#|mailto:|javascript:)|"
    r"(?:index|principles|sessions|experiments|reading-the-research|"
    r"not-testing-is-still-a-bet|small-sample-big-claim)\.html",
    re.I,
)
NON_ACADEMIC_HOSTS = {
    "baymard.com",
    "www.baymard.com",
    "medium.com",
    "www.nngroup.com",
    "nngroup.com",
    "mynrma.com.au",
    "mi-3.com.au",
    "www.bandt.com.au",
    "researchgate.net",
    "www.researchgate.net",
}


def slugify(text: str, max_len: int = 48) -> str:
    text = unescape(text)
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:max_len].rstrip("-") or "untitled"


def strip_tags(html: str) -> str:
    html = re.sub(r"<[^>]+>", " ", html)
    html = unescape(html)
    return re.sub(r"\s+", " ", html).strip()


def parse_year(text: str) -> str | None:
    match = re.search(r"\((\d{4})\)", text)
    return match.group(1) if match else None


def parse_first_author(text: str) -> str | None:
    text = strip_tags(text)
    match = re.match(r"^([A-Za-zÀ-ÿ][^,&(]+)", text)
    if not match:
        return None
    author = match.group(1).strip()
    author = re.sub(r"\s+et al\.?$", "", author, flags=re.I)
    return slugify(author.split()[-1], max_len=24)


def parse_title(text: str) -> str:
    text = strip_tags(text)
    quoted = re.search(r"[“\"']([^”\"']+)[”\"']", text)
    if quoted:
        return slugify(quoted.group(1))
    italic = re.search(r"<i>([^<]+)</i>", text, re.I)
    if italic:
        return slugify(italic.group(1))
    after_year = re.search(r"\(\d{4}\)\.\s*(.+?)(?:\.|$)", text)
    if after_year:
        return slugify(after_year.group(1))
    return slugify(text[:80])


def canonical_url(url: str) -> str:
    url = url.strip()
    if url.startswith("//"):
        url = "https:" + url
    parsed = urlparse(url)
    host = (parsed.netloc or "").lower()
    path = parsed.path.rstrip("/")
    if host.endswith("doi.org") and path:
        return f"https://doi.org{path}"
    if host.endswith("arxiv.org") and "/abs/" in path:
        return path.replace("/abs/", "/pdf/") + ".pdf"
    return f"{parsed.scheme}://{host}{path}" if host else url


def is_academic_url(url: str) -> bool:
    if not url or SKIP_HREF.search(url):
        return False
    if url.lower().endswith(".pdf"):
        return True
    host = urlparse(url).netloc.lower()
    if host in NON_ACADEMIC_HOSTS:
        return False
    academic_markers = (
        "doi.org",
        "arxiv.org",
        "nber.org",
        "pubmed",
        "sciencedirect",
        "springer",
        "wiley",
        "oup.com",
        "jstor",
        "ssrn",
        "psycnet",
        "pnas.org",
        "informs.org",
        "sciencedirect",
        "hal.science",
        "scitepress.org",
        "centralbank.ie",
        "gwern.net",
        "mit.edu",
        "uh.edu",
        "archive.org",
        "sagepub.com",
        "tandfonline",
        "sciencedirect",
        "apa.org",
        "journals.uchicago.edu",
        "muse.jhu.edu",
        "jmir.org",
        "scirp.org",
    )
    return any(marker in host for marker in academic_markers)


def suggested_filename(year: str | None, author: str | None, title: str) -> str:
    parts = [p for p in (year, author, title) if p]
    base = "-".join(parts) if parts else "unknown-source"
    return f"{base}.pdf"


def entry_id(canonical: str, label: str) -> str:
    digest = hashlib.sha1(f"{canonical}|{label}".encode()).hexdigest()[:10]
    return digest


SPLIT_MARKERS = re.compile(r"\s+(?:Critique|Reanalysis):\s+", re.I)


def looks_academic_label(label: str) -> bool:
    return bool(parse_year(label) and parse_first_author(label))


def segments_from_block(block: str) -> list[str]:
    parts = SPLIT_MARKERS.split(block)
    return [part for part in parts if strip_tags(part).strip()]


def entry_from_segment(segment: str, rel: str) -> dict | None:
    label = strip_tags(segment)
    if not label or label.lower().startswith("see "):
        return None
    anchors = ANCHOR.findall(segment)
    url = anchors[0][0] if anchors else ""
    if url and not is_academic_url(url):
        return None
    if not url and not looks_academic_label(label):
        return None
    return {
        "label": label,
        "url": url or None,
        "canonical_url": canonical_url(url) if url else None,
        "year": parse_year(label),
        "first_author": parse_first_author(label),
        "title_slug": parse_title(segment),
        "source_pages": [rel],
    }


def collect_from_html(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8", errors="replace")
    rel = path.relative_to(MOCKUP).as_posix()
    found: list[dict] = []

    for block in CITE_BLOCK.findall(text):
        for segment in segments_from_block(block):
            entry = entry_from_segment(segment, rel)
            if entry:
                found.append(entry)

    for raw in CITE_JSON.findall(text):
        cite_html = bytes(raw, "utf-8").decode("unicode_escape")
        entry = entry_from_segment(cite_html, rel)
        if entry:
            found.append(entry)

    return found


def merge_entries(items: list[dict]) -> list[dict]:
    by_key: dict[str, dict] = {}
    for item in items:
        key = item["canonical_url"] or f"{item['year']}|{item['first_author']}|{item['title_slug']}|{item['label'][:120]}"
        if key in by_key:
            existing = by_key[key]
            for page in item["source_pages"]:
                if page not in existing["source_pages"]:
                    existing["source_pages"].append(page)
            continue
        item["id"] = entry_id(key, item["label"])
        item["suggested_filename"] = suggested_filename(
            item["year"], item["first_author"], item["title_slug"]
        )
        item["pdf_path"] = f"papers/{item['suggested_filename']}"
        item["status"] = "missing"
        by_key[key] = item
    return sorted(by_key.values(), key=lambda x: (x["year"] or "9999", x["label"]))


def refresh_status(entries: list[dict]) -> None:
    for entry in entries:
        path = REFERENCES / entry["pdf_path"]
        entry["status"] = "on_disk" if path.is_file() else "missing"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Print missing PDF count")
    args = parser.parse_args()

    all_items: list[dict] = []
    for path in sorted(MOCKUP.glob("*.html")):
        all_items.extend(collect_from_html(path))

    entries = merge_entries(all_items)
    if MANIFEST.exists():
        prior = {e["id"]: e for e in json.loads(MANIFEST.read_text())["entries"]}
        for entry in entries:
            old = prior.get(entry["id"])
            if old and old.get("pdf_path") != entry["pdf_path"] and (REFERENCES / old["pdf_path"]).is_file():
                entry["pdf_path"] = old["pdf_path"]
    refresh_status(entries)

    REFERENCES.mkdir(exist_ok=True)
    PAPERS.mkdir(exist_ok=True)
    manifest = {
        "description": "Cited studies referenced across mockup/*.html. PDFs live in papers/.",
        "generated_by": "scripts/extract_citations.py",
        "entry_count": len(entries),
        "on_disk": sum(1 for e in entries if e["status"] == "on_disk"),
        "entries": entries,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")

    if args.check:
        missing = [e for e in entries if e["status"] == "missing"]
        print(f"{len(entries)} unique academic citations; {len(missing)} missing PDFs")
        for entry in missing[:20]:
            print(f"  - {entry['suggested_filename']}  ({entry['label'][:80]}...)")
        if len(missing) > 20:
            print(f"  ... and {len(missing) - 20} more")
    else:
        print(f"Wrote {MANIFEST} ({len(entries)} entries, {manifest['on_disk']} on disk)")


if __name__ == "__main__":
    main()
