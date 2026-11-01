# Rule coverage

Source version: 2026.10.13.01. Commit: 0735135dbfe5d97ab00716c80a9306438ceeb6fe.
SHA-256: fb48d677a85d77fb72735a325de2c1945a1e0ceab1d2e655292fe9ebe3e4e0b4.

37 provider-directed rules are required in every submission.
The other framework’s machine-verification rule must be Not Applicable.

## Excluded actors

- VER-FRP-ARP: FedRAMP — Directed to FedRAMP or agencies, not providers.
- VER-FRP-ADV: FedRAMP — Directed to FedRAMP or agencies, not providers.
- VER-AGM-RVR: Agencies — Directed to FedRAMP or agencies, not providers.
- VER-AGM-MAP: Agencies — Directed to FedRAMP or agencies, not providers.

## Supported profiles

- Rev5 Class B
- Rev5 Class C
- Rev5 Class D
- 20x Class B
- 20x Class C

## Source inconsistencies

- VDR-TFR-PDD, Class A: Variant exists but inherited subset applicability excludes this class.
- VDR-TFR-PCD, Class A: Variant exists but inherited subset applicability excludes this class.
- VDR-TFR-PVR, Class A: Variant exists but inherited subset applicability excludes this class.
- VDR-TFR-PSD, Class A: Variant exists but inherited subset applicability excludes this class.
- VDR-TFR-MVX, Class A: Variant exists but inherited subset applicability excludes this class.
- VER-TFR-MRH, Class A: Variant exists but inherited subset applicability excludes this class.
- VER-TFR-EVU, Class A: Variant exists but inherited subset applicability excludes this class.
- VER-TFR-IRI, Class A: Variant exists but inherited subset applicability excludes this class.
- VER-TFR-NRI, Class A: Variant exists but inherited subset applicability excludes this class.

These variants remain in the catalog but do not expand parent applicability. No 20x Class D machine-verification variant is supplied, so that profile is unsupported.

## Provider inventory

| Rule ID | Name | Framework |
| --- | --- | --- |
| VDR-CSO-DET | Vulnerability Detection | all |
| VDR-CSO-RES | Vulnerability Response | all |
| VDR-CSO-FAV | Failures Are Vulnerabilities | all |
| VDR-CSO-DFR | Design For Resilience | all |
| VDR-CSO-ADT | Automate Detection | all |
| VDR-CSO-DAC | Detect After Changes | all |
| VDR-CSO-MSP | Maintain Security | all |
| VDR-CSO-AKE | Avoid KEVs | all |
| VDR-CSO-SIR | Sampling | all |
| VDR-TFR-NMV | Non-Machine Verification and Validation | all |
| VDR-TFR-PDD | Persistent Drift Detection | all |
| VDR-TFR-PCD | Persistently Complete Detection | all |
| VDR-TFR-PVR | Mitigation and Remediation Expectations | all |
| VDR-TFR-RMN | Remaining Vulnerabilities | all |
| VDR-TFR-KEV | Remediate KEVs | all |
| VDR-TFR-PSD | Persistent Sample Detection | all |
| VDR-TFR-MVX | Persistent Machine Verification and Validation for 20x | 20x |
| VDR-TFR-MVF | Persistent Machine Verification and Validation for Rev5 | rev5 |
| VER-EVA-ELX | Evaluate Exploitability | all |
| VER-EVA-EIR | Evaluate Internet-Reachability | all |
| VER-EVA-EPA | Estimate Potential Agency Impact | all |
| VER-EVA-AIA | Assume It's Automatable | all |
| VER-EVA-GRV | Group Vulnerabilities | all |
| VER-EVA-EFP | Evaluate False Positives | all |
| VER-EVA-EFA | Evaluation Factors | all |
| VER-RPT-PER | Persistent Reporting | all |
| VER-RPT-VDT | Vulnerability Details | all |
| VER-RPT-AVI | Accepted Vulnerability Info | all |
| VER-RPT-NID | Responsible Disclosure | all |
| VER-RPT-HLO | High-Level Overviews | all |
| VER-RPT-RPD | Responsible Public Disclosure | all |
| VER-TFR-MHR | Monthly Activity Report | all |
| VER-TFR-MAV | Mark Accepted Vulnerabilities | all |
| VER-TFR-MRH | Historical Activity | all |
| VER-TFR-EVU | Evaluate Vulnerabilities Quickly | all |
| VER-TFR-IRI | Internet-Reachable Incidents | all |
| VER-TFR-NRI | Non-Internet-Reachable Incidents | all |
