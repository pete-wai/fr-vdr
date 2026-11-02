# VDR/VER implementation status

**example prototype for discussion**

Use these draft schemas to describe how a cloud service offering implements FedRAMP Vulnerability Detection and Response (VDR) and Vulnerability Evaluation and Reporting (VER). Explain what you do for each rule, where you have gaps, and what those gaps mean for agency customers.

**[Open the site](https://pete-wai.github.io/fr-vdr/)** · [JSON Schema](schemas/implementation-status.schema.json) · [CSV Schema](schemas/implementation-status.csvs) · [CSV template](templates/implementation-status.csv)

One file describes one offering. Both formats require all 37 provider-directed rule IDs from the pinned source, including an explained Not Applicable response for the other framework’s machine-verification rule. Four rules directed to FedRAMP or agencies are excluded. This prototype supports Rev5 B/C/D and 20x B/C; see the [coverage report](data/coverage-report.md) for source inconsistencies and the complete inventory.

Examples are fictional snapshots dated December 7, 2026, not official FedRAMP submissions. Passing validation checks the collection structure and completeness, not compliance or the truth of implementation claims.

[Read the formatted samples](https://pete-wai.github.io/fr-vdr/examples/) with generated status summaries and complete rule-by-rule answers. These views are rebuilt from the same JSON files as the downloads.

Read the [FAQ](https://pete-wai.github.io/fr-vdr/faq/) for answers grounded in FedRAMP’s GitHub discussions. The [research record](research/README.md) documents sources and historical differences.

## Local use

Install [mise](https://mise.jdx.dev/) first. Run from the repository root:

```sh
mise trust
mise install
mise exec -- node --version
mise exec -- npm --version
mise exec -- npm ci
mise exec -- uv sync --locked
mise exec -- npm run build
```

The project pins Node 24.21.0, npm 11.19.0 (bundled with that Node release), uv 0.12.19, Python 3.13.15, and Zensical 0.0.74. Python packages live in `.venv`; commit both dependency lockfiles. Build output is `site/`.

```sh
mise exec -- npm run validate -- examples/legacy.json examples/legacy.csv
mise exec -- npm run coverage
mise exec -- npm run upstream
mise exec -- uv run --locked zensical serve --dev-addr 127.0.0.1:8000
```

The browser and CLI use the same JavaScript validation engine. The `.csvs` file is also usable with the [CSV Schema reference validator](https://digital-preservation.github.io/csv-validator/); its row checks are supplemented by the project’s cross-row completeness checks. The upstream command is read-only and exits with status 1 if source content changed.

## Files and maintenance

- `schemas/`, `templates/`, and `examples/` contain the downloadable collection files.
- `data/` contains the pinned upstream source, provenance, derived rule catalog, and coverage report.
- `lib/`, `scripts/`, and `tests/` implement generation, validation, and verification.
- `docs/` and `zensical.toml` define the static site; GitHub Actions publishes passing builds from `main`.
- [AGENTS.md](AGENTS.md) documents implementation and update procedures.
- [PERSONA.md](PERSONA.md), [PLAN.md](PLAN.md), [REQUESTS.md](REQUESTS.md), and [MEMORY.md](MEMORY.md) preserve the examples, accepted plan, request history, and work record.

The source pin is in [provenance.json](data/provenance.json). Builds never fetch newer rules automatically. To update, review the source changes, deliberately replace the snapshot and provenance, regenerate, revise examples, and run all checks before publishing.
