---
name: pdf-read-write
description: 'Read, inspect, extract from, create, merge, split, and update PDF files. Use for PDF text extraction, metadata inspection, page-level manipulation, generating PDFs from text or markdown, and validating PDF output. Keywords: pdf, read pdf, extract pdf text, write pdf, generate pdf, merge pdf, split pdf, fill pdf, scanned pdf, ocr.'
argument-hint: 'Describe the PDF task, input file, desired output, and any formatting or OCR requirements.'
---

# PDF Read And Write

## When to Use

- Read text or metadata from a PDF file
- Create a new PDF from structured content, markdown, or plain text
- Merge, split, rotate, reorder, or stamp PDF pages
- Update an existing PDF with additional pages or simple overlays
- Validate that a generated PDF contains the expected content

## Constraints

- Do not treat PDF files as plain text input. Extract content first with a script or library.
- Distinguish native-text PDFs from scanned PDFs before claiming text extraction is possible.
- If OCR is required, say so explicitly and ask before installing or using OCR tooling.
- Preserve the original PDF unless the user explicitly asks for in-place replacement.

## Workflow

### 1. Clarify the Requested Outcome

Identify which of these jobs the user wants:

- Read: extract text, metadata, page count, bookmarks, tables, images, or a summary
- Write: generate a new PDF from text, markdown, HTML, JSON data, or code output
- Modify: merge, split, reorder, rotate, watermark, stamp, or append pages
- Fill: populate a PDF form or overlay content onto an existing template

If the request is underspecified, ask only for the missing details that change the implementation:

- Source PDF path or source content
- Output path
- Whether layout fidelity matters or plain text is enough
- Whether the PDF is scanned
- Whether OCR is acceptable if the file is image-based

### 2. Inspect the File Before Acting

For an existing PDF:

1. Confirm the file exists and note its size.
2. Determine whether it is likely text-based or scanned.
3. Inspect page count and metadata before extraction or modification.
4. Decide whether a lightweight extraction is enough or whether layout-aware parsing is needed.

Preferred implementation order:

1. Use a small script with `pypdf` for metadata, page count, simple text extraction, merges, splits, and appends.
2. Use `pdfplumber` when layout, tables, or word positioning matters.
3. Use `reportlab` to generate new PDFs with controlled layout.
4. Use OCR tooling only when the PDF is image-based and the user accepts that dependency.

### 3. Choose the Read Path

Use this branching logic:

- If the user needs plain text or a quick summary, extract text page by page.
- If the user needs tables or layout-sensitive content, use a layout-aware extractor.
- If extracted text is empty or nearly empty, treat the PDF as scanned and switch to an OCR decision.
- If the user wants only metadata, avoid full-text extraction.

Minimum read deliverables:

- Output file or extracted text artifact when useful
- Page count and extraction method used
- Note any missing text, unreadable pages, or OCR limitations

### 4. Choose the Write Path

Use this branching logic:

- If the user wants a simple generated document, create a fresh PDF from text or markdown.
- If the user wants to preserve an existing template, overlay or append content instead of rebuilding the whole file.
- If the user wants page operations only, modify the PDF structure without re-rendering content.
- If the user wants form filling, check whether the PDF contains fillable fields before choosing an overlay fallback.

Preferred write approach:

1. Generate new documents with `reportlab`.
2. Modify existing documents with `pypdf`.
3. Keep output in a new file unless replacement is explicitly requested.

### 5. Validate the Result

Always verify the output after reading or writing:

1. Confirm the target file was created.
2. Confirm page count matches expectations.
3. Re-open the output and extract a small sample of text or metadata.
4. Report any fidelity limits, missing fonts, encoding issues, or OCR uncertainty.

## Completion Checks

The task is complete only when all applicable checks pass:

- The input and output paths are clear.
- The chosen method matches the PDF type and requested fidelity.
- The output file exists and opens.
- Extraction or generated content was spot-checked.
- Any limits or assumptions were stated explicitly.

## Implementation Notes

- Prefer one-off scripts executed from the terminal over large permanent code changes unless the user asks for reusable code.
- Keep generated helper scripts temporary unless the user wants them added to the repository.
- When installing dependencies, explain why each package is needed.
- For scanned PDFs, do not imply high-quality extraction without OCR.
- For sensitive documents, avoid printing full extracted contents unless the user asked for them.

## Example Prompts

- Read the text from `docs/spec.pdf` and summarize the main sections.
- Extract metadata and page count from `invoice.pdf`.
- Merge `part1.pdf` and `part2.pdf` into `combined.pdf`.
- Create a PDF report from this markdown and save it as `report.pdf`.
- Split `catalog.pdf` into one file per page.
- Check whether `form.pdf` is fillable and populate these fields.