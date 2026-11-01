# Work record

## 2026-11-01 — Initial implementation

The user approved the plan and authorized a public `pete-wai/fr-vdr` repository and GitHub Pages publication. Required framing: **example prototype for discussion**. Request history is retained in `REQUESTS.md`; the agreed plan is in `PLAN.md`.

Source: FedRAMP/rules commit `0735135dbfe5d97ab00716c80a9306438ceeb6fe`, version `2026.10.13.01`. The pinned source contains 37 provider rules, plus four excluded non-provider rules. Class A variant/parent contradictions and missing 20x D machine-verification coverage are recorded in the catalog and coverage report.

Implemented the source snapshot/provenance, rule catalog, Draft 2020-12 JSON Schema, CSV Schema Language 1.1 schema, blank CSV template, three authored JSON examples and matching CSV examples, shared browser/CLI validation, independent coverage checks, and four-page Zensical site.

Initial automated verification: all six examples pass; 34 tests pass, including browser-bundle/Node parity. Publication and final browser/reference-validator verification are still in progress; append the actual outcomes below.

### Pre-publication verification

- `npm run build` passed all 34 tests, exact source/schema/template/example coverage, published download byte parity, and 86 local links/assets.
- CSV Validator 1.4.4 independently accepted all three CSV examples and rejected six negative cases (status, date, risk, exception reason, framework, duplicate rule).
- Browser QA accepted all six examples and a local CSV selected through the file picker. Invalid pasted JSON produced field-specific errors, and the Validate button worked via Enter with a visible focus outline.
- Reviewed the overview and validator at normal width and at a 390-pixel mobile width; controls and text remained readable. Restored the normal viewport afterward.
- Corrected Persona 3’s VER-TFR-EVU response: weekly initial review is insufficient for Fully Addressed when complete contextual evaluation remains unfinished.
- Downloadable coverage report uses `.txt` to avoid Zensical converting it into an extra page. All source prose remains in the tracked Markdown report.
- The official CSV Schema documentation contains inconsistent examples of column-reference separators; the generated schema uses `/`, verified against the reference implementation.

Next: create the public repository, configure GitHub Pages, verify the deployed build and downloads, then append the deployment outcome.

### Deployment completed

- Public repository: https://github.com/pete-wai/fr-vdr
- Live site: https://pete-wai.github.io/fr-vdr/
- Deployed content commit: `38ce39ecb00279157899d7ceacc6dece65a0f88a`.
- GitHub Actions run https://github.com/pete-wai/fr-vdr/actions/runs/41357272830 completed successfully: locked installation, reference CSV validation, 34 tests, coverage, build, generated-file consistency, artifact upload, and Pages deployment.
- Verified HTTP 200 for all four public pages and all twelve downloads. Every download matched its repository source byte-for-byte; the six downloaded example submissions passed the shared validator.
- Verified the public validator loads and validates the Smallbrook CSV example and resolves its download within `/fr-vdr/downloads/`.
- All requested root documentation, the original request, clarification answers, follow-up, and accepted implementation message are saved. The working tree was clean before this final log entry.
- This final documentation-only commit does not change the deployed site and uses `[skip ci]` to avoid rebuilding unchanged artifacts.

No implementation or publication work remains. Future maintenance should start with an explicit upstream comparison and review of any rule changes; the known applicability limitations remain documented rather than silently resolved.

## 2026-11-01 — Sample viewer extension

Added a generated reading page for each sample, linked from Examples, with offering metadata, four data-derived status totals, applicable mandatory-rule progress, and all populated response fields grouped by VDR/VER. Views use the authored JSON and pinned rule catalog, validate data before rendering, escape text, and work without JavaScript. Source schemas and submissions are unchanged.

Local build passes 39 tests, including new checks for summary arithmetic, mandatory applicability, every response field, and HTML escaping. Browser verification and publication are in progress.

Browser QA confirmed all 37 rule cards render, sample switching works by keyboard, and status cards adapt to a two-column mobile layout. Harbor totals are 24 Fully Addressed, 9 Partially Addressed, 3 Not Addressed, and 1 Not Applicable; Smallbrook totals are 9, 22, 5, and 1. The built site passed 143 local-link checks. Publishing this extension through the existing Pages workflow.

Published commit `a05f8bb38b6ec78ac99d89ac0002e46a505956cb` successfully in Actions run https://github.com/pete-wai/fr-vdr/actions/runs/41357963895. Verified all three public `/samples/{automated,legacy,availability}/` pages return HTTP 200, contain all 37 rule responses, and show totals matching their source JSON. Confirmed the Harbor viewer in the public browser. All 39 tests and deployment checks passed. This final log-only update uses `[skip ci]`; the deployed site is unchanged.
