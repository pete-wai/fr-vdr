# VDR/VER discussion research

Research date: November 1, 2026. Used to revise explanatory prose and write the [FAQ](../docs/faq.md). This is a research archive, not an additional source of requirements.

## Coverage and retrieval

The FedRAMP MCP imported Community at 2026-11-01T21:44:58Z and 2026 commentary at 2026-11-01T21:45:10Z. Both reported successful imports without gaps. These are manually synchronized snapshots, not a live guarantee of every GitHub comment.

Searches covered both `community` and `commentary`, included resolved corrections, and exhausted returned pagination. Queries included VDR/VER, full ruleset names, PAIN, false positives, accepted vulnerabilities, and broader Rev5/20x discussion wording. Exact queries and result counts are retained in `vdr-ver-discussions.json`. Search phrases return broad candidates; they should not be interpreted as exact topic counts.

Retrieved 2,154 distinct documents, including parent context, with full-text pagination and no retrieval failures. Retained 427 topic-related documents and their surrounding context, including 127 by pete-gov. Selection used VDR/VER, full ruleset names with spaces or hyphens, PAIN, potential agency impact, false positives, and accepted vulnerabilities in text or titles. Replies to selected comments were retained, together with parent questions and thread context. Dedicated ruleset threads include replies that do not repeat the keywords. Generic thread roots do not cause every unrelated descendant to be retained.

- [Discussion corpus](vdr-ver-discussions.json): full retained text, source IDs, URLs, authors, dates, hashes, parent relationships, preview flags, and correction history.
- [Candidate index](discussion-index.json): every retrieved discussion document and its inclusion decision. Documents without a topic match or surrounding context are indexed but their full text is not republished.
- [Official context](official-context.json): MCP copies of the rules guide, definitions, addressing-rules guidance, and deadline guidance.
- [FAQ source map](faq-sources.json): each answer's discussion sources, parent question links, and official references.

Limits: keyword retrieval can miss indirect references outside the retrieved context; deleted or unimported GitHub material is unavailable. No claim is made that this archive captures every VDR/VER comment ever posted. To refresh, rerun all searches against both sources, exhaust pagination, fetch full documents and related parents, review relevance and corrected answers, and record the new snapshot. Do not replace the rules pin as part of editorial maintenance.

## Authority and differences resolved

The canonical rules remain the byte-preserved source in `data/`, version 2026.10.13.01, commit `0735135dbfe5d97ab00716c80a9306438ceeb6fe`. The FAQ uses that source for rule text, strength, class variants, and dates. Imported Markdown is explanatory context and may have a different repository revision. Discussions explain intent; they do not amend the pinned rules.

- Older discussions refer to VDR reporting/evaluation IDs. The FAQ uses their current VER IDs and links to the corresponding current rules.
- Comments about optional Balance releases and future Class D proposals are historical or prospective. Neither changes this collection's current supported profiles.
- The false-positive discussions offer several reporting choices. Grouping, supplementary information, and N0 are not presented as a new mandatory reporting category. The pinned source already includes N0; an older comment proposing its addition is not current source text.
- A comment about tracking fully mitigated vulnerabilities does not change VER-TFR-MAV's test: the 192-day acceptance requirement applies when a vulnerability is not or will not be fully mitigated or remediated. Continued detection alone is insufficient to trigger that particular rule.
- VER-TFR-IRI is MAY for Class B and SHOULD for C/D. VER-TFR-NRI is MAY for B/C and SHOULD for D. A general incident discussion must not flatten these differences.
- The calendar-days answer comes from an archived preview discussion. The pinned source still distinguishes `days` from `bizdays`; the FAQ does not reuse obsolete preview timeframes.
- Mitigation can lead to a new evaluation and a revised VDR-TFR-PVR timeframe. The KEV rule separately refers to CISA catalog due dates, even for fully mitigated vulnerabilities. The FAQ does not restate a comment's blanket 14-day KEV claim.
- Manual USDA Connect reporting is a transition example, not fulfillment of automated retrieval or a general exemption from Certification Data Sharing rules.
- December 7, 2026 and March 7, 2027 are read from the pinned ruleset effective-date metadata. The FAQ distinguishes those dates from this project's fictional as-of date and does not introduce a collection deadline.
- The validator answer explicitly describes this prototype. Its linked discussion concerns a different FedRAMP web validator and is identified as such.

## Editorial approach

pete-gov's useful recurring pattern is to answer the question, explain what the rule is trying to accomplish, and describe what a provider can do. The revised text follows that structure with plain verbs, concrete examples, and explicit customer risk. It does not copy jokes, dismissive language, or personal mannerisms, and it does not claim pete-gov authored or approved this site.

The FAQ is a synthesis with direct citations. Original comments are preserved here for audit, including statements not adopted in the FAQ. All example JSON/CSV submissions, persona narratives, schemas, template, rule source, and validator behavior remain unchanged.
