# VDR/VER implementation status

**example prototype for discussion**

Describe what your cloud service offering does for each provider rule in **Vulnerability Detection and Response (VDR)** and **Vulnerability Evaluation and Reporting (VER)**.

1. Download the [CSV template](downloads/implementation-status-template.csv) or adapt a [JSON example](examples.md).
2. Explain what you do for each rule. If you have a gap, describe the customer risk and your plan to address it. Use the [field instructions](schemas.md).
3. [Validate your file](validate.md) and review any errors before sharing it through your collection process.

Answer all **37 provider rules: 18 VDR and 19 VER**. For the other framework’s machine-verification rule, use **Not Applicable** and explain why. This prototype supports Rev5 Classes B, C, and D, and 20x Classes B and C.

The examples describe fictional offerings as of **December 7, 2026**. That date is not a submission deadline. This site does not collect provider data. These files describe rule implementation; they do not replace the vulnerability reports required by FedRAMP.

The [FAQ](faq.md) answers common questions from FedRAMP’s GitHub discussions, including what SHOULD means and how to handle false positives, mitigation, and reporting.

## Source and coverage

This prototype uses a fixed copy of [FedRAMP rules version 2026.10.13.01](https://github.com/FedRAMP/rules/blob/0735135dbfe5d97ab00716c80a9306438ceeb6fe/fedramp-consolidated-rules.json). Use your offering’s framework and class to determine which requirements and timeframes apply.

You do not need to answer the four rules directed to FedRAMP or agencies. The source contains conflicting Class A applicability information, so this prototype does not support Class A. The [coverage report](downloads/coverage-report.txt) records the exclusions and source inconsistencies. The [rule catalog](downloads/rule-catalog.json) preserves the source details, including supporting lists and timeframe tables.

Consult the [official VDR rules](https://www.fedramp.gov/2026/reference/rev5/c/vulnerability-detection-and-response/) and [official VER rules](https://www.fedramp.gov/2026/reference/rev5/c/vulnerability-evaluation-and-reporting/) for requirements; those links show Rev5 Class C, so select your offering’s profile when reviewing them.
