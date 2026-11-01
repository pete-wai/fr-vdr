# Fictional provider personas

All examples describe implementation as of **December 7, 2026**. Names are fictional and official offering identifiers are omitted. The examples demonstrate honest reporting, including incomplete implementation; validation is not a compliance determination.

## Aster Cloud — Persona 1

- Offering: Aster Operations Cloud; 20x Class C.
- Every applicable provider rule is Fully Addressed. The Rev5-specific machine-verification rule is Not Applicable.
- Cloud monitoring includes technical weaknesses, configuration drift, process failures, and inaccurate control documentation, not just CVEs.
- An integrated GRC system manages ownership, response history, evidence, timers, and controlled reporting.
- SOC analysts review AI-prepared evidence. A separate AI check flags disagreements for analyst resolution; it is not an independent assessor or a substitute for accountable human decisions.
- Daily or faster operational checks exceed most applicable timelines. Impact-reduction targets use the actual Class C matrix and distinguish mitigation from remediation.
- Optional assurance is useful and selective; feedback appears where it has a concrete purpose.

## Harbor Systems — Persona 2

- Offering: Harbor Agency Workspace; Rev5 Class C.
- All applicable MUST and MUST NOT requirements are Fully Addressed. Most SHOULD and SHOULD NOT requirements, taken together, are incomplete, with easier protective practices already in place.
- Legacy scanners automate basic scanning. Manual registers, daily source reconciliation, staffed escalation, and controlled exports support mandatory activities.
- Integration cost and tightly coupled systems explain recommendation gaps without creating exemptions from mandatory requirements.
- Microsegmentation, hardened releases, filtering, and administrative restrictions reduce some risk but do not establish absence of indirect internet reachability.
- Roadmap dates extend into 2027. Supplier-dependent impact-reduction coverage is Unknown; individual finding tracking is deliberately Not Planned for replacement by grouping.
- Optional content is sparse. Manual reporting can still produce schema-valid JSON; lack of an automated history API does not imply missing mandatory report fields.

## Smallbrook Services — Persona 3

- Offering: Smallbrook Public Information Workspace; Rev5 Class B.
- A small team operates a public-information service with low-impact, noncritical use cases. It has gaps in both mandatory rules and recommendations.
- Weekly manual reviews initially evaluate every detected finding, but some contextual evidence and evaluation quality remain incomplete. VER-TFR-EVU is Partially Addressed because a weekly initial review does not establish completed evaluation under VER-EVA within seven days.
- Availability improvements, tested recovery, a small inventory, and restricted privileges are its priorities. Confidentiality, integrity, and multi-agency impact must still be considered; Class B does not make those concerns disappear.
- Agencies are advised to retain independent copies, maintain alternate channels, avoid sensitive data, and avoid critical workloads. These limits reduce exposure but do not excuse noncompliance.
- Full-population weekly machine detection satisfies the sampling-frequency recommendation; full verification and validation of intended configuration remains incomplete.
- Dates extend into 2027. Automation and history retrieval remain Unknown; grouping is Not Planned while individual tracking remains practical.
- Optional information is generally omitted.

## Authoring checks

Each response must address its specific rule, preserve the selected framework/class, and agree with the other responses. No response may use more than five short sentences across explanation, exception reason, risk, compensating measures, assurance, and feedback. Incomplete responses normally use four sentences, or five when the completion target requires an explanation.

Every JSON example is authored directly; CSV is generated from it. Do not insert invented vulnerability records or real customer information. Do not treat a future roadmap date as proof that a requirement is already met. Review all applicable MUST rules for Harbor and all applicable rules for Aster whenever source requirements change.
