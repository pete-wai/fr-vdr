# VDR/VER implementation-status collection prototype

Accepted implementation plan — November 1, 2026. The user explicitly requested implementation of the following plan. Subsequent implementation decisions are appended below without replacing the accepted text.

## Summary

Create a public `pete-wai/fr-vdr` repository and a succinct Zensical site on GitHub Pages, labeled **“example prototype for discussion.”**

Deliver JSON and CSV schemas, a blank CSV template, three complete fictional submissions in both formats, browser and command-line validators, and portable project documentation.

Each submission covers one offering. Examples use **December 7, 2026** as their as-of date; no submission deadline is implied.

## Rules and collection formats

- Pin the [canonical FedRAMP rules dataset](https://github.com/FedRAMP/rules) by commit, version, and checksum. Preserve rule text, supporting lists, timeframe tables, actors, and framework/class variants.
- Include **all provider-directed rules**: currently 37 unique IDs, comprising 18 VDR and 19 VER rules. Exclude the four FedRAMP/agency-directed rules from submissions and document their exclusion in the coverage report.
- Include both framework-specific provider rules in the inventory. Require `Not Applicable` with an explanation for the rule belonging to the other framework.
- Determine applicability from source metadata and class variants together. Preserve unsupported or inconsistent source combinations in the catalog and report them explicitly rather than inventing requirements.

Use JSON Schema Draft 2020-12 with FedRAMP-style `$schema`, `$id`, `$schemaVersion`, titles, descriptions, and reusable definitions. Use this project’s URL for its identity.

JSON contains offering metadata and responses keyed by rule ID. CSV contains one row per rule, repeating the offering metadata so the file stands alone.

| Fields | Requirement |
|---|---|
| Schema version, rules version, provider name, offering name, framework, class, as-of date | Required metadata |
| FedRAMP identifier | Optional metadata |
| Rule ID, implementation status, explanation | Required for every rule |
| Completion target, customer risk, provider compensation, agency compensation | Required for Partially Addressed or Not Addressed |
| Completion-target explanation | Required when the target is Unknown or Not Planned |
| Additional assurance, general feedback | Optional |

- Preserve the four requested status labels exactly.
- Completion target accepts an ISO calendar date, `Unknown`, or `Not Planned`. It is empty or omitted for other statuses.
- Require substantive, non-whitespace explanations, including reasons for `Not Applicable`.
- Keep risk and the two compensation answers separate. Explain that the implementation narrative must describe both the reason and resulting risk when a rule is not followed.
- Publish an actual `.csvs` schema using the linked CSV Schema language, plus a concise field reference. Use UTF-8 CSV with a header and conventional quoting.
- Prefill every provider rule ID in the blank template. Leave responses blank; explain that an unfinished template will fail submission validation.

## Examples and validation

Produce one authored JSON submission per persona and generate its CSV equivalent to prevent differences between formats.

1. **20x Class C:** Fully addresses applicable rules through automated monitoring, integrated GRC records, SOC review, and AI-assisted checks with human accountability. Uses faster operational targets where credible.
2. **Rev5 Class C:** Fully addresses MUST and MUST NOT requirements; leaves most SHOULD requirements incomplete. Uses legacy scanning, manual processes, segmentation, and documented compensating measures. Cost and complexity explain gaps without being presented as compliance exceptions.
3. **Rev5 Class B:** Has explicit MUST and SHOULD gaps, weekly manual vulnerability evaluation, and availability-focused improvements. Describes bounded use cases and advises agencies against sensitive data or critical workloads without claiming those limits eliminate risk.

Each rule response uses at most five short sentences across all narrative fields. Optional information appears selectively, mainly for Persona 1. Dates and exception reasons fit each provider’s overall implementation plan.

Use a shared JavaScript validation engine for the browser and Node CLI:

- Validate JSON with Ajv and parse CSV with Papa Parse.
- Check required responses, unknown or duplicate IDs, metadata consistency, status values, calendar dates, conditional fields, and applicability.
- Convert CSV to the common submission model before applying shared checks.
- Report errors by rule and field, with CSV row numbers where possible.
- Keep browser validation entirely local; bundle dependencies with the site.
- Document that validation establishes structural completeness, not the truth or adequacy of a provider’s claims.

Provide a separate coverage-check script that independently traverses the pinned source and compares its provider-rule inventory with both schemas, the template, examples, and published downloads. Normal builds use the pinned source; an explicit upstream-check command reports changes without silently adopting them.

## Site, verification, and publication

Build four compact pages: **Overview**, **Schemas and template**, **Examples**, and **Validate**. Include downloadable files, brief persona explanations, an example-loading control, and a file picker for validation.

Use plain, direct prose and FedRAMP terminology. Apply verified FedRAMP writing conventions, including capitalization, and manually review for repetitive cadences and unsupported claims. Avoid decorative slogans and unnecessary imagery.

Verification must cover:

- All six example files passing with equivalent JSON/CSV content.
- Missing, extra, and duplicate rules; incorrect statuses; empty explanations; incomplete risk fields; invalid dates; and inconsistent CSV metadata.
- Framework-specific applicability and class-dependent requirement strength.
- Quoted commas, line breaks, Unicode, optional blanks, and UTF-8 BOM handling.
- Exact inventory coverage and deliberate exclusion of non-provider actors.
- Persona consistency and the five-sentence limit.
- Browser/CLI agreement, keyboard operation, readable error messages, working downloads, and GitHub Pages subpath links.

Pin runtimes and dependencies with mise, uv, and committed lockfiles. Use GitHub Actions to run checks, build Zensical, and deploy passing commits from `main`. Verify the deployed site and downloads at `https://pete-wai.github.io/fr-vdr/`.

## Documentation and retained decisions

Create these root-level files:

- **`AGENTS.md`** — architecture, sources, commands, generation boundaries, validation, editorial requirements, publication, and update procedures.
- **`PERSONA.md`** — refined personas, framework/class choices, operational assumptions, and consistency requirements.
- **`MEMORY.md`** — completed work, verification results, unresolved issues, source revisions, and next steps.
- **`REQUESTS.md`** — original request and follow-ups verbatim, plus clearly separated records of clarification answers and subsequent decisions.
- **`PLAN.md`** — this agreed implementation plan, with dated revisions.
- **`README.md`** — concise orientation, local commands, and links to the site and artifacts.

Preserve request history rather than overwriting it. Keep the public site focused on completing and validating submissions; retain detailed implementation history in the repository.

## Implementation decisions — November 1, 2026

- CSV Schema Language 1.1 is used for stable reference-implementation compatibility; its syntax is checked by CSV Validator 1.4.4 with a pinned checksum.
- The raw coverage report downloads as `.txt` so Zensical does not convert it into an extra page.
- The current source supports Rev5 B/C/D and 20x B/C after intersecting parent applicability with framework variants. Class A contradictions and 20x D’s missing machine-verification variant are explicitly reported.
- The browser validator accepts files up to 5 MB and provides an editable text area; the CLI handles larger files.
- Root request history is retained separately from the four succinct public documentation pages.

## Sample viewer extension — November 1, 2026

Add three generated reading pages, linked from Examples and from each other. Each page shows offering metadata, four status totals, the number of applicable MUST/MUST NOT rules reported Fully Addressed, and all nonempty response fields grouped under VDR and VER. Calculate summaries from the authored sample JSON and resolve rule force against the offering's class. Keep download and validation links available. Render static pages during the existing build so the viewer also works without JavaScript; escape sample text and validate source submissions before rendering. Verify summary arithmetic, all-field coverage, mobile layout, keyboard navigation, built links, and the public deployment.
