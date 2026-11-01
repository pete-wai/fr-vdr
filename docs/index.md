# VDR/VER implementation status

**example prototype for discussion**

Use these draft files to describe how one cloud service offering addresses the provider rules for **Vulnerability Detection and Response (VDR)** and **Vulnerability Evaluation and Reporting (VER)**.

1. Download the [CSV template](downloads/implementation-status-template.csv) or adapt a [JSON example](examples.md).
2. Answer each rule using the [field instructions](schemas.md).
3. [Validate your file](validate.md) and review any errors before sharing it through your collection process.

The collection covers **37 provider rules: 18 VDR and 19 VER**. Every file includes the full inventory, with an explained **Not Applicable** response for the other framework’s machine-verification rule. Supported profiles are Rev5 Classes B, C, and D, and 20x Classes B and C.

The examples describe fictional offerings as of **December 7, 2026**. That date is not a submission deadline. No provider data is collected by this site, and these files do not replace official FedRAMP reporting artifacts.

## Source and coverage

The prototype pins [FedRAMP rules version 2026.10.13.01](https://github.com/FedRAMP/rules/blob/0735135dbfe5d97ab00716c80a9306438ceeb6fe/fedramp-consolidated-rules.json). Rule strength, timeframes, and applicability depend on the offering’s framework and class.

Four rules addressed to FedRAMP or agencies are excluded. Some Class A variants conflict with their parent applicability metadata; Class A is therefore unsupported in this prototype. The [coverage report](downloads/coverage-report.txt) records the exclusions and source inconsistencies. The [rule catalog](downloads/rule-catalog.json) preserves the source details, including supporting lists and timeframe tables.

Consult the [official VDR rules](https://www.fedramp.gov/2026/reference/rev5/c/vulnerability-detection-and-response/) and [official VER rules](https://www.fedramp.gov/2026/reference/rev5/c/vulnerability-evaluation-and-reporting/) for requirements; those links show Rev5 Class C, so select your offering’s profile when reviewing them.
