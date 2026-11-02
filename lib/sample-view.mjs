import {STATUSES, applicable, resolvedRule} from './model.mjs';

export const SAMPLES = [
  {slug: 'automated', label: 'Aster'},
  {slug: 'legacy', label: 'Harbor'},
  {slug: 'availability', label: 'Smallbrook'}
];
const statusClass = status => ['full', 'partial', 'unaddressed', 'na'][STATUSES.indexOf(status)];
export const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const fields = [
  ['explanation', 'Implementation explanation'],
  ['completionTarget', 'Completion target'],
  ['completionTargetExplanation', 'Reason for the target'],
  ['customerRisk', 'Risk to agency customers'],
  ['providerCompensation', 'Provider compensation'],
  ['agencyCompensation', 'Agency compensation'],
  ['additionalAssurance', 'Additional assurance'],
  ['feedback', 'Feedback on the rule']
];

export function summarizeSample(submission, catalog) {
  const counts = Object.fromEntries(STATUSES.map(status => [status, 0]));
  for (const response of Object.values(submission.responses)) {
    if (!Object.hasOwn(counts, response.status)) throw new Error(`Unknown status: ${response.status}`);
    counts[response.status]++;
  }
  const mandatory = catalog.rules.filter(rule => applicable(rule, submission.metadata.framework, submission.metadata.class)
    && ['MUST', 'MUST NOT'].includes(resolvedRule(rule, submission.metadata.class).force));
  return {
    counts, total: Object.values(counts).reduce((sum, count) => sum + count, 0),
    mandatoryTotal: mandatory.length,
    mandatoryFull: mandatory.filter(rule => submission.responses[rule.id]?.status === 'Fully Addressed').length
  };
}

export function renderSample(submission, catalog, slug) {
  if (!SAMPLES.some(sample => sample.slug === slug)) throw new Error('Unknown sample');
  const summary = summarizeSample(submission, catalog), meta = submission.metadata;
  const html = escapeHTML;
  const navigation = SAMPLES.map(sample => sample.slug === slug
    ? `<span aria-current="page">${sample.label}</span>`
    : `<a href="${sample.slug}.md">${sample.label}</a>`).join('');
  const cards = STATUSES.map(status => `<div class="sample-count ${statusClass(status)}"><dt>${status}</dt><dd>${summary.counts[status]}</dd></div>`).join('');
  const output = [
    `---\ntitle: ${JSON.stringify(meta.offeringName)}\n---`,
    '<!-- Generated from examples/*.json. Edit the source data or lib/sample-view.mjs. -->',
    `<h1>${html(meta.offeringName)}</h1>`,
    '<nav class="sample-nav" aria-label="Choose a sample">'+navigation+'</nav>',
    `<p class="sample-meta">${html(meta.providerName)} · ${html(meta.framework)} Class ${html(meta.class)} · As of <time datetime="${html(meta.asOfDate)}">${html(meta.asOfDate)}</time></p>`,
    '## Implementation status',
    `<dl class="sample-counts">${cards}</dl>`,
    `${summary.total} rule responses. **${summary.mandatoryFull} of ${summary.mandatoryTotal} applicable MUST and MUST NOT rules** are reported as Fully Addressed.`,
    'The totals come from this sample’s answers. They show what the fictional provider reports; they do not establish compliance.',
    `[Download JSON](../downloads/${slug}.json) · [Download CSV](../downloads/${slug}.csv) · [Validate a file](../validate.md) · [About the examples](../examples.md)`,
    'Read the responses below, or jump to [VDR](#vdr) or [VER](#ver).'
  ];
  for (const ruleset of ['VDR', 'VER']) {
    output.push(`## ${ruleset}`);
    for (const rule of catalog.rules.filter(rule => rule.ruleset === ruleset)) {
      const response = submission.responses[rule.id];
      if (!response) throw new Error(`Missing response: ${rule.id}`);
      const applies = applicable(rule, meta.framework, meta.class);
      const force = applies ? resolvedRule(rule, meta.class).force : 'Other framework';
      const details = fields.filter(([key]) => response[key]?.trim()).map(([key,label]) =>
        `<dt>${label}</dt><dd>${html(response[key])}</dd>`).join('');
      output.push(`<section class="sample-rule" aria-labelledby="${rule.id}"><h3 id="${rule.id}"><a href="#${rule.id}" class="sample-rule-id">${rule.id}</a> ${html(rule.content.name)}</h3><p class="sample-rule-meta"><span class="sample-status ${statusClass(response.status)}">${html(response.status)}</span><span>${html(force)}</span></p><dl>${details}</dl></section>`);
    }
  }
  return output.join('\n\n') + '\n';
}
