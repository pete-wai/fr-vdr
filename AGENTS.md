# Project instructions

## Purpose and authority

This public project is an **example prototype for discussion**, requested by pete-wai for a December provider implementation-status collection. It is not an official FedRAMP artifact, compliance assessment, or submission endpoint. The site must remain concise and use that exact prototype label.

Read `README.md`, `PLAN.md`, `REQUESTS.md`, `PERSONA.md`, and the latest entries in `MEMORY.md` before changing behavior. Preserve original requests and append subsequent instructions and decisions. User instructions take precedence over these maintenance conventions.

## Source of truth and applicability

`data/fedramp-consolidated-rules.json` is a byte-preserved snapshot from the official `FedRAMP/rules` repository. `data/provenance.json` records its repository, path, commit, version, retrieval date, and SHA-256. Never infer authoritative requirements from persona prose or generated documentation.

Traverse every framework and subset under `FRR.VDR.data` and `FRR.VER.data`. Resolve actors from a rule’s `affects` field, falling back to the subset’s applicability. Include provider-directed rules only. Currently there are 37: 18 VDR and 19 VER. Do not hardcode those counts in coverage assertions; independently derive the expected inventory from the source.

Preserve complete rule objects, supporting lists, notes, tables, timeframes, and class variants in the derived catalog. Determine applicability from the intersection of parent metadata, framework, and available class variant. Never treat the presence of a variant as permission to expand parent applicability. The current snapshot has Class A contradictions, and lacks a 20x D machine-verification variant; supported profiles are Rev5 B/C/D and 20x B/C. Report ambiguity rather than inventing requirements.

All submissions include both framework-specific provider IDs. The other framework’s rule must be `Not Applicable`, with an explanation. A normally applicable rule may be reported as Not Applicable with a substantive explanation, but the companion validator raises a review note. Four non-provider rules are explicitly excluded in the coverage report.

## Data contract

`lib/model.mjs` owns field order, status labels, version, and applicability functions. JSON uses `metadata` plus `responses` keyed by rule ID. CSV is one row per rule with repeated metadata and fixed headers. Maintain JSON/CSV equivalence.

Statuses are exactly Fully Addressed, Partially Addressed, Not Addressed, and Not Applicable. All responses require an explanation. Incomplete responses require a completion target, customer risk, provider compensation, and agency compensation. Targets accept ISO dates, Unknown, or Not Planned; exceptions require a reason. Complete/N/A responses must omit or leave the target blank. Optional strings may be absent or empty, not null; nonempty strings cannot be whitespace-only.

The collection captures implementation status, not individual vulnerabilities. Do not replace the official VER vulnerability-report schemas or imply this collection fulfills their reporting requirements. Schema validation does not prove explanation quality, risk acceptance, or compliance. MUST NOT and SHOULD NOT remain distinct source forces. MAY choices need explanations but do not imply a duty to exercise the permission.

## Authoring and generation boundaries

- Edit the three `examples/*.json` files as authored source. Do not hand-edit their generated CSV counterparts.
- Edit `scripts/generate.mjs` to change generated schemas, CSV template, or catalog behavior.
- `scripts/build.mjs` generates the coverage report, copies downloads, bundles browser code, builds Zensical, and verifies built artifacts.
- Never edit `docs/downloads/`, `docs/assets/validator.js`, or `site/` directly; these are ignored generated output.
- `lib/sample-view.mjs` renders readable sample pages and calculates status totals from the authored JSON. `scripts/build.mjs` validates samples before generating `docs/samples/`; never hand-edit that ignored directory. Preserve every nonempty response field and resolve mandatory-rule summaries using the offering's framework and class. Status totals describe reported answers, not compliance scores.
- Generated schemas, catalog, template, CSV examples, and coverage report are tracked so they can be reviewed and used without building.
- The source snapshot is not generated during ordinary builds. Preserve it byte-for-byte until a deliberate update.

Examples must remain fictional, use the agreed profiles and December 7, 2026 date, and contain no more than five short sentences per rule across all narrative fields. Keep optional information selective. The sentence limit belongs to examples only. See `PERSONA.md` for operational assumptions and review criteria.

## Validation architecture

`lib/validate.mjs` uses Ajv Draft 2020-12 with date formats and Papa Parse. It rejects duplicate JSON keys before validation, maps CSV into the common model, and supplies row/field errors and applicability review notes. Do not implement separate browser and CLI rules.

`lib/browser.mjs` handles local files, pasted text, and example downloads. Render all untrusted text through `textContent`, not HTML. Do not upload, log, persist, or transmit provider file contents. The 5 MB browser limit protects usability; the CLI has no artificial file-size limit. Bundle dependencies locally; no analytics, remote fonts, or third-party runtime scripts.

The `.csvs` file uses CSV Schema Language 1.1. It provides portable column/conditional checks, while the shared validator adds exact headers, complete inventory, cross-row metadata, and additional whitespace checks. Do not claim that the browser interprets arbitrary CSV schemas. Verify CSV Schema syntax against the reference implementation when changing it.

`scripts/check-coverage.mjs` independently traverses the pinned source and compares exact provider IDs with both schemas, the template, and examples. It also checks full catalog content and source checksum. With `--published`, it checks download byte parity. Preserve its independence from the generator’s traversal logic.

## Environment and commands

Use mise for Node and uv, and uv for the exact Python version and project-local `.venv`. Exact runtime versions are in `mise.toml`, `.python-version`, `package.json`, and `pyproject.toml`. Commit `package-lock.json` and `uv.lock`; never install Python packages into the system interpreter.

```sh
mise trust
mise install
mise exec -- npm ci
mise exec -- uv sync --locked
mise exec -- npm run generate
mise exec -- npm run check
mise exec -- npm run build
mise exec -- npm run validate -- path/to/submission.json
mise exec -- npm run upstream
```

Run from the repository root. `build` regenerates, tests, checks coverage, builds the site, verifies downloads, and checks local links. Preview only on loopback with `mise exec -- uv run --locked zensical serve --dev-addr 127.0.0.1:8000`. Stop owned preview servers after verification.

The reference CSV validator is a separate maintenance check, not a browser dependency. Its pinned release/checksum and Java runtime are recorded in `scripts/check-csv-reference.mjs`. Use `npm run check:csv-reference` as documented there; its cache is ignored.

## Tests and review

Run `npm run build` after any change affecting collection outputs. Test valid examples, JSON/CSV equivalence, missing/extra/duplicate IDs, escaped duplicate JSON keys, conditionals, dates, metadata consistency, quoting, BOM, Unicode, multiline fields, optional blanks, applicability, class-specific force, and persona assertions. Browser-bundle tests must agree with the Node engine.

After UI changes, inspect the actual page with browser tools: load examples, validate edited invalid content, navigate by keyboard, and review narrow-screen layout. A unit test does not replace this check. Preserve visible labels, focus styles, live status messages, and readable rule/field errors. Verify the final `/fr-vdr/` path and downloadable files after deployment.

## Editorial guidance

Write direct instructions in ordinary sentences. Avoid slogans, clipped repeated cadences, inflated claims, and decorative summaries. Refer to rules by stable ID and name when discussing their meaning. Use the official capitalization of FedRAMP Certification and FedRAMP Certification Package. The official 2026 repository’s style checks and the official “Using the Consolidated Rules” guidance informed these conventions; do not claim a separate general writing guide was located.

Use the schemas’ exact labels in instructions. Do not soften a MUST gap into an exception because a service is small, low impact, or expensive to modernize. Do not describe segmentation alone as proof that a vulnerability cannot be reached by an internet-origin payload. AI assistance remains subordinate to accountable human decisions.

## Updating sources and publishing

`npm run upstream` only compares upstream content with the pin. It never updates files. For an intentional update, inspect the new authoritative source, record commit/version/checksum together, review actor and applicability changes, regenerate artifacts, update every affected example, and run all checks. Record the change in `MEMORY.md` and revise `PLAN.md` if scope or contract changes.

The public repository is `pete-wai/fr-vdr`; the site is `https://pete-wai.github.io/fr-vdr/`. GitHub Pages uses Actions, with read-only contents permission plus Pages/OIDC permissions in the deploy job. PRs run validation and build without deploying. Passing `main` builds deploy. Do not commit provider submissions, credentials, generated site files, or machine-specific cache paths.

Update `MEMORY.md` with actual completed checks, limitations, source revisions, and deployment outcome. Do not mark planned work complete until verified. Preserve unrelated edits and keep request history append-only.
