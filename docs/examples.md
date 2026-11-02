# Examples

These three fictional providers answer the same questions for every rule. Their answers describe implementation as of **December 7, 2026**. Each provider’s JSON and CSV files contain the same answers. We kept each rule response to five short sentences or fewer; your responses can be longer.

Choose **Read sample** to read the answers. The summary at the top counts the implementation statuses in that sample.

| Offering | Approach | Read or download |
| --- | --- | --- |
| **Aster Operations Cloud** — 20x Class C | Addresses every applicable rule with automated monitoring, integrated GRC records, and SOC decisions supported by AI checks. Its operating targets generally exceed required or recommended intervals. | **[Read sample](samples/automated.md)** · [JSON](downloads/automated.json) · [CSV](downloads/automated.csv) |
| **Harbor Agency Workspace** — Rev5 Class C | Addresses all applicable MUST and MUST NOT requirements. Legacy tools and manual handoffs leave most SHOULD recommendations incomplete; segmentation and review procedures reduce some resulting risks. | **[Read sample](samples/legacy.md)** · [JSON](downloads/legacy.json) · [CSV](downloads/legacy.csv) |
| **Smallbrook Public Information Workspace** — Rev5 Class B | A small provider with incomplete MUST and SHOULD implementation, weekly manual evaluations, and a focus on availability. It limits use to noncritical public information and acknowledges that these limits do not remove the gaps. | **[Read sample](samples/availability.md)** · [JSON](downloads/availability.json) · [CSV](downloads/availability.csv) |

[Load an example in the validator](validate.md). Each file shows how to explain implementation, completion targets, customer risk, and compensating measures. Aster also supplies more optional assurance information.

A passing file can contain **Not Addressed** rules. The validator checks that the answers are present and formatted correctly. It does not decide whether the provider meets FedRAMP requirements or has made sound risk decisions.
