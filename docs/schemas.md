# Schemas and template

[Download JSON Schema](downloads/implementation-status.schema.json) · [Download CSV Schema](downloads/implementation-status.csvs) · [Download CSV template](downloads/implementation-status-template.csv)

Use one file per offering. Include every provider rule once, including MAY and negative requirements such as MUST NOT. Answer the same questions whether the rule says MUST, SHOULD, or MAY.

## Answer each rule

Choose **Fully Addressed**, **Partially Addressed**, **Not Addressed**, or **Not Applicable**.

Explain how you follow the rule. If you do not follow it, explain why and describe the resulting customer risk. For **Not Applicable**, explain why the rule does not apply. Do not use it just because you have not implemented a rule or have decided not to follow a SHOULD recommendation. See the [FAQ on SHOULD](faq.md#what-does-should-mean).

For **Partially Addressed** or **Not Addressed**, give a completion target. Explain the customer risk, what you do to reduce it, and what agencies can do to reduce it in the three separate fields. If there are no compensating measures, say so. Use **Unknown** or **Not Planned** only with an explanation. Leave the completion target empty for other statuses.

If a rule applies when something happens, explain how you will handle that event even if it has not happened yet. For a MAY rule, you can explain your choice not to use the option and report it as Fully Addressed. Optional assurance and feedback can be left blank.

## Fields

JSON uses a `metadata` object and a `responses` object keyed by rule ID. CSV repeats the metadata in every row, followed by `ruleId` and the response fields below. Keep the template’s column names and order.

| Field | What to enter |
| --- | --- |
| `schemaVersion` | `0.1.0` |
| `rulesVersion` | `2026.10.13.01` |
| `providerName` | Provider’s name. |
| `offeringName` | Name of the offering being described. |
| `framework` | `Rev5` or `20x`. |
| `class` | `B`, `C`, or `D` for Rev5; `B` or `C` for 20x. |
| `asOfDate` | Date the answers describe, as `YYYY-MM-DD`. |
| `fedrampId` | Official offering identifier, if available; otherwise blank or omitted. |
| `ruleId` | Prefilled CSV identifier; the corresponding JSON object key. |
| `status` | One of the four labels above. |
| `explanation` | How the rule is followed, or the reason and risk for not following it. |
| `completionTarget` | Required for incomplete rules: `YYYY-MM-DD`, `Unknown`, or `Not Planned`. |
| `completionTargetExplanation` | Required for `Unknown` or `Not Planned`; explain the uncertainty or decision. |
| `customerRisk` | Required for incomplete rules: risk to federal agency customers. |
| `providerCompensation` | Required for incomplete rules: what the provider does to reduce that risk. |
| `agencyCompensation` | Required for incomplete rules: what agencies can do to reduce that risk. |
| `additionalAssurance` | Optional evidence or assurance about implementation. |
| `feedback` | Optional feedback about the rule itself. |

## File conventions

Save CSV as UTF-8 with a header. Spreadsheet software normally quotes commas, quotation marks, and line breaks when exporting CSV. Use ISO dates as text so they remain `YYYY-MM-DD`; do not add a leading apostrophe to the exported value. The blank template will fail validation until you complete it.

In JSON, omit unused optional fields or use empty strings; do not use `null`. Completion targets must be actual calendar dates or the exact exception labels. The validator leaves past target dates unchanged so reviewers can see them.

The [JSON Schema](https://json-schema.org/) uses Draft 2020-12. Enable date-format validation in external validators. The `.csvs` file uses [CSV Schema Language 1.1](https://digital-preservation.github.io/csv-schema/csv-schema-1.1.html), supported by the reference validator. It checks column rules; the companion validator also checks complete rule coverage, exact headers, consistent metadata, and applicability. The browser tool validates this collection format, not arbitrary uploaded schema files.

A valid file has the required answers in the expected format. Reviewers still need to check whether the answers are accurate and whether your approach addresses the rules.
