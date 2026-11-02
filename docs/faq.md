# VDR/VER FAQ

These answers draw on questions asked in FedRAMP’s GitHub discussions and responses from pete-gov. They are this project’s summaries, not new FedRAMP guidance. Rule references use **version 2026.10.13.01**; choose your offering’s framework and class when reading the official rules.

Reviewed November 1, 2026. The [research record](https://github.com/pete-wai/fr-vdr/blob/main/research/README.md) explains the sources, historical differences, and coverage limits.

## How do VDR and VER fit together?

VDR covers finding and responding to vulnerabilities. VER covers evaluating their potential effect on agency customers and reporting the results. Use both: detecting a finding is only the start of the work. The evaluation and reporting rules were separated from VDR to make the rulesets easier to use. See [pete-gov’s explanation](https://github.com/FedRAMP/2026/discussions/46#discussioncomment-17330062) and the official [VDR][vdr] and [VER][ver] rules.

## What does SHOULD mean?

Follow the recommendation unless you have a valid reason to take a different approach. Explain your decision, weigh its implications, and describe the resulting risk to agency customers. A SHOULD rule still needs to be addressed in your security documentation. MUST and MUST NOT are absolute requirements and prohibitions. See [Force of the Rule][force] and [the implementation-readiness discussion](https://github.com/FedRAMP/community/discussions/146#discussioncomment-18758517).

For this collection, report what you have implemented. If a recommendation is incomplete, use **Partially Addressed** or **Not Addressed** and explain the gap. A documented decision not to follow a recommendation does not automatically make it **Not Applicable**. These labels describe implementation; they are not FedRAMP compliance decisions.

## Does FedRAMP require a particular reporting template?

Use the information and schemas required by the applicable rule. You have flexibility in how you present useful information to customers, but that does not remove required fields. VER-RPT-VDT (Vulnerability Details) and VER-RPT-AVI (Accepted Vulnerability Info) identify official report schemas. See [the reporting rules][reporting] and [pete-gov’s explanation of rule-to-schema relationships](https://github.com/FedRAMP/2026/discussions/90#discussioncomment-18722032).

This prototype asks how you implement each rule. Its JSON and CSV files do **not** replace those vulnerability reports. The CSV template is a way to answer this collection, not a recommendation to run your vulnerability management program in a spreadsheet.

## Does passing this validator mean we meet the rules?

No. This validator checks whether you supplied the required answers in the expected format. A complete file can report **Not Addressed** rules. People still need to assess whether your claims are accurate and your approach addresses the rules.

That is a limitation of this project’s validator. In a [separate discussion about FedRAMP’s web validator](https://github.com/FedRAMP/2026/discussions/102#discussioncomment-17803687), pete-gov also distinguished a convenience tool from a formal gate. See our [validation instructions](validate.md) for exactly what this tool checks.

## Do we have to use scanners or a particular testing technique?

VDR-CSO-DET (Vulnerability Detection) requires a program that finds vulnerabilities systematically, persistently, and promptly. Scanning is one technique; the rule also covers process failures, incorrect documentation, and other weaknesses. Choose techniques that work for your offering and explain how they provide adequate detection. See [Vulnerability Detection][detection] and [the discussion of penetration testing](https://github.com/FedRAMP/2026/discussions/119#discussioncomment-18403986).

## When can we use samples, and what changes trigger detection?

VDR-CSO-SIR (Sampling) permits sampling effectively identical resources unless that would make detection less efficient or effective. Establish why the sample represents the resources you are evaluating. A staging environment is not what the rule means by a sample.

VDR-CSO-DAC (Detect After Changes) says providers SHOULD automatically perform detection on representative samples of new or significantly changed resources. That does not replace the ongoing detection activities and class-specific intervals in the other rules. See [the sampling discussion](https://github.com/FedRAMP/2026/discussions/103#discussioncomment-17817425), [Sampling][sampling], and [Detect After Changes][changes].

## How do PAIN ratings relate to CVSS and evaluation factors?

Evaluate what exploitation could do to agency customers in your offering. VER-EVA-EPA (Estimate Potential Agency Impact) requires a Potential Agency Impact N-rating, or PAIN. A CVSS score alone does not answer that question. Reachability, exploitability, and the other evaluation factors help you understand the situation; they are not substitutes for the evaluation outcomes. See [Estimate Potential Agency Impact][pain], [Evaluation Factors][factors], and [pete-gov’s explanation](https://github.com/FedRAMP/community/discussions/146#discussioncomment-19249797).

## How should we handle false positives?

Evaluate whether a finding is a false positive in the context of your offering. Keep enough information to explain that decision and revisit it when circumstances change. VER-EVA-EFP (Evaluate False Positives) addresses that evaluation; VER-EVA-GRV (Group Vulnerabilities) can help reduce repetitive work.

In the [false-positive reporting discussion](https://github.com/FedRAMP/community/discussions/146#discussioncomment-19203980), pete-gov explains that reporting does not exclude false positives by default. Identify them clearly and supply applicable information. Grouping them or adding supplementary information are suggested approaches, not a mandated new category. See [Evaluate False Positives][false-positives] and [Vulnerability Details][details].

## What is the difference between mitigation, remediation, and acceptance?

Mitigation reduces the likelihood or impact of exploitation. The vulnerability still exists, even when fully mitigated. Remediation neutralizes or eliminates it so it is no longer detected. Accepting a vulnerability records a decision or overdue condition; it does not make the risk disappear. See the [FedRAMP Definitions][definitions] and [pete-gov’s explanation of continued tracking](https://github.com/FedRAMP/community/discussions/147#discussioncomment-18903585).

VER-TFR-MAV (Mark Accepted Vulnerabilities) requires acceptance categorization when a vulnerability is not or will not be fully mitigated or remediated within 192 days of evaluation. Apply that wording as written; continued detection alone is not its test. Keep tracking fully mitigated vulnerabilities too. See [Mark Accepted Vulnerabilities][accepted] and [Accepted Vulnerability Info][accepted-info].

## When do the clocks start, and are days calendar days?

VER-TFR-EVU (Evaluate Vulnerabilities Quickly) measures from detection. VDR-TFR-PVR (Mitigation and Remediation Expectations) measures from evaluation, using the offering’s class, current PAIN, reachability, and exploitability. Do not substitute a later import into your tracking system for the original detection time. See [the detection-time discussion](https://github.com/FedRAMP/community/discussions/146#discussioncomment-19073144), [Evaluate Vulnerabilities Quickly][evaluation-time], and [Mitigation and Remediation Expectations][response-time].

Days mean calendar days unless the rule says business days. A meaningful mitigation can lead to a new evaluation and a different response timeframe; merely relabeling a finding is not mitigation. See [the calendar-days answer](https://github.com/FedRAMP/2026/discussions/53#discussioncomment-17366321) and [the mitigation-clock explanation](https://github.com/FedRAMP/community/discussions/146#discussioncomment-18356896). Treat the timeframes as limits to improve on, rather than dates to wait for.

## What if a vendor fix or major upgrade is delayed?

Look for ways to reduce the risk while you work toward remediation. A delayed patch does not prevent segmentation, access restrictions, or other appropriate mitigations. Evaluate whether those measures actually reduce risk in your environment, and tell customers what risk remains. If you accept the vulnerability, explain why and provide the required information. See [the vendor-dependency discussion](https://github.com/FedRAMP/2026/discussions/46#discussioncomment-17330062) and VDR-CSO-RES ([Vulnerability Response][response]).

Known Exploited Vulnerabilities have a separate rule. VDR-TFR-KEV (Remediate KEVs) says providers SHOULD remediate them according to the CISA catalog due dates even if fully mitigated. Do not apply the general mitigation-clock explanation as an extension to those dates. See [Remediate KEVs][kev].

## When does a vulnerability become a reportable incident?

Check both the vulnerability’s characteristics and your offering’s class. For internet-reachable, likely exploitable vulnerabilities rated N4 or N5, VER-TFR-IRI (Internet-Reachable Incidents) says Class C and D providers SHOULD treat them as a FedRAMP Reportable Incident until reduced to N3 or below; Class B providers MAY do so.

For non-internet-reachable, likely exploitable N5 vulnerabilities, VER-TFR-NRI (Non-Internet-Reachable Incidents) says Class D providers SHOULD do so until reduced to N4 or below; Class B and C providers MAY. These are the variants for profiles this prototype supports. Other incident rules still apply. See [Internet-Reachable Incidents][iri] and [Non-Internet-Reachable Incidents][nri].

Evaluate the incident under the incident rules; do not assume its rating must always equal the vulnerability rating. See [the vulnerability-versus-incident discussion](https://github.com/FedRAMP/2026/discussions/153#discussioncomment-19079330).

## Do we have to move to a trust center before adopting VDR/VER?

Do not delay VDR/VER implementation while waiting for a trust center. In the [USDA Connect discussion](https://github.com/FedRAMP/2026/discussions/156#discussioncomment-19132691), pete-gov explains how providers can deliver reports during that transition. Manual file uploads do not fully meet the automated-retrieval recommendation in VER-TFR-MRH (Historical Activity); explain that gap and the resulting risk.

Follow the separate Certification Data Sharing requirements and dates as well. See [Historical Activity][history] and [Certification Data Sharing][sharing].

## What do the adoption dates mean, and what evidence should we retain?

The pinned VDR and VER rules list **December 7, 2026** for obtaining and maintaining FedRAMP Certification, with a default grace-period end of **March 7, 2027**. The grace period allows corrective action; it does not move the maintain date. Check the [official deadline guidance][deadlines] and your applicable ruleset dates when planning adoption.

For existing Rev5 Class C offerings, [pete-gov’s readiness answer](https://github.com/FedRAMP/community/discussions/146#discussioncomment-18758517) identifies the VER reports as sufficient evidence until the Security Decision Record is updated, and recommends keeping package documentation current. Keep the reports and records that show how your process operates. See also [the discussion of corrective action and the grace period](https://github.com/FedRAMP/community/discussions/146#discussioncomment-18405212).

This project does not set a submission deadline or collect submissions. December 7 is also the as-of date used in its fictional examples.

[vdr]: https://www.fedramp.gov/2026/reference/vulnerability-detection-and-response/
[ver]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/
[force]: https://www.fedramp.gov/2026/rules/#force-of-the-rule
[reporting]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#reporting
[detection]: https://www.fedramp.gov/2026/reference/vulnerability-detection-and-response/#vulnerability-detection
[sampling]: https://www.fedramp.gov/2026/reference/vulnerability-detection-and-response/#sampling
[changes]: https://www.fedramp.gov/2026/reference/vulnerability-detection-and-response/#detect-after-changes
[pain]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#estimate-potential-agency-impact
[factors]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#evaluation-factors
[false-positives]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#evaluate-false-positives
[details]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#vulnerability-details
[definitions]: https://www.fedramp.gov/2026/definitions/
[accepted]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#mark-accepted-vulnerabilities
[accepted-info]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#accepted-vulnerability-info
[evaluation-time]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#evaluate-vulnerabilities-quickly
[response-time]: https://www.fedramp.gov/2026/reference/vulnerability-detection-and-response/#mitigation-and-remediation-expectations
[response]: https://www.fedramp.gov/2026/reference/vulnerability-detection-and-response/#vulnerability-response
[kev]: https://www.fedramp.gov/2026/reference/vulnerability-detection-and-response/#remediate-kevs
[iri]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#internet-reachable-incidents
[nri]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#non-internet-reachable-incidents
[history]: https://www.fedramp.gov/2026/reference/vulnerability-evaluation-and-reporting/#historical-activity
[sharing]: https://www.fedramp.gov/2026/reference/certification-data-sharing/
[deadlines]: https://www.fedramp.gov/2026/providers/updating/deadlines/
