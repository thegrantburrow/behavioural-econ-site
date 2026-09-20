"""Shared helpers for reference PDF scripts."""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / "references" / "manifest.json"
PAPERS = REPO / "references" / "papers"
INBOX = REPO / "references" / "inbox"
USER_AGENT = "behavioural-econ-site-reference-archiver/1.0 (mailto:grant@behavioural-econ-site)"
DOI_RE = re.compile(r"10\.\d{4,9}/[-._;()/:A-Z0-9]+", re.I)
NBER_RE = re.compile(r"nber\.org/papers/(w\d+)", re.I)
ARXIV_RE = re.compile(r"arxiv\.org/abs/([\d.]+(?:v\d+)?)", re.I)
PUBMED_RE = re.compile(r"pubmed\.ncbi\.nlm\.nih\.gov/(\d+)", re.I)


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text())


def save_manifest(manifest: dict) -> None:
    manifest["on_disk"] = sum(1 for e in manifest["entries"] if e["status"] == "on_disk")
    manifest["entry_count"] = len(manifest["entries"])
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")


def is_pdf_bytes(data: bytes) -> bool:
    return data.startswith(b"%PDF")


def extract_doi(url: str | None) -> str | None:
    if not url:
        return None
    match = DOI_RE.search(url)
    return match.group(0).lower() if match else None


def fetch_bytes(url: str, timeout: int = 60) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/pdf,*/*",
        },
    )
    opener = urllib.request.build_opener(urllib.request.HTTPRedirectHandler())
    with opener.open(req, timeout=timeout) as resp:
        return resp.read()


def try_download_pdf(url: str) -> bytes | None:
    try:
        data = fetch_bytes(url)
    except Exception:  # noqa: BLE001
        return None
    return data if is_pdf_bytes(data) else None


def candidate_urls(entry: dict) -> list[str]:
    urls: list[str] = []
    site_url = entry.get("url") or ""
    canonical = entry.get("canonical_url") or ""

    for raw in (site_url, canonical):
        if not raw:
            continue
        if raw.lower().split("?", 1)[0].endswith(".pdf"):
            urls.append(raw)

    nber = NBER_RE.search(site_url) or NBER_RE.search(canonical)
    if nber:
        paper_id = nber.group(1)
        urls.append(f"https://www.nber.org/papers/{paper_id}.pdf")

    arxiv = ARXIV_RE.search(site_url) or ARXIV_RE.search(canonical)
    if arxiv:
        arxiv_id = arxiv.group(1)
        urls.append(f"https://arxiv.org/pdf/{arxiv_id}.pdf")

    pubmed = PUBMED_RE.search(site_url) or PUBMED_RE.search(canonical)
    if pubmed:
        pdf_url = pubmed_pdf(pubmed.group(1))
        if pdf_url:
            urls.append(pdf_url)

    if "hal.science" in site_url and "/document" in site_url:
        urls.append(site_url)

    doi = extract_doi(site_url) or extract_doi(canonical)
    if doi:
        urls.append(f"https://doi.org/{doi}")
        # Semantic Scholar open-access lookup is resolved separately.

    deduped: list[str] = []
    seen: set[str] = set()
    for url in urls:
        if url not in seen:
            seen.add(url)
            deduped.append(url)
    return deduped


def semantic_scholar_pdf(doi: str) -> str | None:
    url = (
        "https://api.semanticscholar.org/graph/v1/paper/DOI:"
        f"{doi}?fields=openAccessPdf"
    )
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.load(resp)
    except Exception:  # noqa: BLE001
        return None
    oa = payload.get("openAccessPdf") or {}
    return oa.get("url")


def openalex_pdf(doi: str) -> str | None:
    url = f"https://api.openalex.org/works/https://doi.org/{doi}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.load(resp)
    except Exception:  # noqa: BLE001
        return None
    best = payload.get("best_oa_location") or {}
    return best.get("pdf_url") or payload.get("open_access", {}).get("oa_url")


def pubmed_pdf(pubmed_id: str) -> str | None:
    # Europe PMC often exposes a direct PDF for open-access PubMed records.
    search = (
        "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
        f"?query=EXT_ID:{pubmed_id}%20AND%20SRC:MED&format=json&pageSize=1"
    )
    req = urllib.request.Request(search, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.load(resp)
    except Exception:  # noqa: BLE001
        return None
    results = payload.get("resultList", {}).get("result", [])
    if not results:
        return None
    pmcid = results[0].get("pmcid")
    if not pmcid:
        return None
    return f"https://europepmc.org/backend/ptpmcrender.fcgi?accid={pmcid}&blobtype=pdf"


def resolve_pdf_url(entry: dict) -> str | None:
    for url in candidate_urls(entry):
        if url.lower().split("?", 1)[0].endswith(".pdf") or "ptpmcrender.fcgi" in url:
            return url

    doi = extract_doi(entry.get("url")) or extract_doi(entry.get("canonical_url"))
    if doi:
        for resolver in (semantic_scholar_pdf, openalex_pdf):
            pdf_url = resolver(doi)
            if pdf_url:
                return pdf_url
            time.sleep(0.2)

    for url in candidate_urls(entry):
        if not url.lower().endswith(".pdf"):
            continue
        return url
    return None


def ingest_bytes(entry: dict, data: bytes, manifest: dict) -> bool:
    if not is_pdf_bytes(data):
        return False
    PAPERS.mkdir(parents=True, exist_ok=True)
    dest = REPO / "references" / entry["pdf_path"]
    dest.write_bytes(data)
    entry["status"] = "on_disk"
    return True
