# Cited study PDFs

Primary-source PDFs for studies cited across `mockup/*.html`. These files are
**reference only**: they are not deployed to GitHub Pages (only `mockup/` is).

## Layout

- `manifest.json` — one row per unique academic citation (re-run extract for current count)
- `papers/` — the PDF files themselves

## Filename convention

`{year}-{first-author}-{short-title-slug}.pdf`

Examples:

- `1974-tversky-judgment-under-uncertainty-heuristics-and-biases.pdf`
- `2007-wainer-the-most-dangerous-equation.pdf`

The manifest's `suggested_filename` field is canonical. If a PDF arrives under a
different name, rename on ingest or update `pdf_path` in the manifest.

## Workflow

### 1. Refresh the manifest after new citations land on the site

```bash
python3 scripts/extract_citations.py
```

### 2. Pull any openly linked PDFs (URL already ends in `.pdf`)

```bash
python3 scripts/download_reference_pdfs.py
```

Most citations point at publisher landing pages or DOI resolvers. Those need a
full PDF sourced elsewhere.

### 3. Batch-ingest a folder of Grok PDFs

Drop PDFs into `references/inbox/` (or any folder), then:

```bash
python3 scripts/batch_ingest_reference_pdfs.py
python3 scripts/batch_ingest_reference_pdfs.py --dir ~/Downloads/grok-papers
```

Files are matched to manifest entries by exact filename, then by
year/author/title token overlap. Unmatched files are listed at the end.

### 4. Auto-fetch open-access PDFs (DOI / NBER / arxiv resolvers)

```bash
python3 scripts/fetch_reference_pdfs.py
```

### 5. Ingest a single PDF manually

```bash
python3 scripts/ingest_reference_pdf.py \
  --filename 1974-tversky-judgment-under-uncertainty-heuristics-and-biases.pdf \
  --file /path/to/downloaded.pdf
```

Or match by manifest `id`:

```bash
python3 scripts/ingest_reference_pdf.py --id a1b2c3d4e5 --file paper.pdf
```

### 6. Check coverage

```bash
python3 scripts/extract_citations.py --check
```

## Manifest fields

| Field | Meaning |
| --- | --- |
| `label` | Citation text as it appears on the site |
| `url` | Link in the site HTML |
| `canonical_url` | Normalised URL for deduplication |
| `source_pages` | Which `mockup/*.html` files cite this study |
| `suggested_filename` | Target filename under `papers/` |
| `status` | `on_disk` or `missing` |

## Notes

- Keep publisher watermarks out of site images (`CLAUDE.md` policy). PDFs here
  are archival copies for fact-checking, not public site assets.
- Do not hotlink these from the live site unless licensing is explicit.
- Re-run `extract_citations.py` after adding citations so new studies appear in
  the manifest before PDFs are ingested.
