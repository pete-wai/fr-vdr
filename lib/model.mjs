export const SCHEMA_VERSION = '0.1.0';
export const BASE_URL = 'https://pete-wai.github.io/fr-vdr/';
export const STATUSES = ['Fully Addressed', 'Partially Addressed', 'Not Addressed', 'Not Applicable'];
export const METADATA_FIELDS = ['schemaVersion', 'rulesVersion', 'providerName', 'offeringName', 'framework', 'class', 'asOfDate', 'fedrampId'];
export const RESPONSE_FIELDS = ['status', 'explanation', 'completionTarget', 'completionTargetExplanation', 'customerRisk', 'providerCompensation', 'agencyCompensation', 'additionalAssurance', 'feedback'];
export const COLUMNS = [...METADATA_FIELDS, 'ruleId', ...RESPONSE_FIELDS];
export const NARRATIVE_FIELDS = RESPONSE_FIELDS.filter(key => !['status', 'completionTarget'].includes(key));

// Inherited applicability is intersected, never expanded by the presence of a variant.
export function applicable(rule, framework, serviceClass) {
  return rule.applicability.types.includes(framework)
    && rule.applicability.classes.includes(serviceClass)
    && (rule.framework === 'all' || rule.framework.toLowerCase() === framework.toLowerCase())
    && (!rule.content.varies_by_class || Object.hasOwn(rule.content.varies_by_class, serviceClass.toLowerCase()));
}

export function resolvedRule(rule, serviceClass) {
  return {...rule.content, ...rule.content.varies_by_class?.[serviceClass.toLowerCase()]};
}

export function extractCatalog(source) {
  const rules = [], excluded = [], issues = [];
  for (const ruleset of ['VDR', 'VER']) {
    const set = source.FRR[ruleset];
    for (const [framework, subsets] of Object.entries(set.data)) {
      for (const [subset, entries] of Object.entries(subsets)) {
        const applicability = set.info.subsets[subset].applicability;
        for (const [id, content] of Object.entries(entries)) {
          const record = {id, ruleset, framework, subset, applicability, content};
          const actors = content.affects ?? applicability.affects;
          if (actors.includes('Providers')) rules.push(record);
          else excluded.push({id, actors, reason: 'Directed to FedRAMP or agencies, not providers.'});
          for (const cls of Object.keys(content.varies_by_class ?? {})) {
            if (!applicability.classes.includes(cls.toUpperCase())) issues.push({id, class: cls.toUpperCase(), issue: 'Variant exists but inherited subset applicability excludes this class.'});
          }
        }
      }
    }
  }
  if (new Set(rules.map(r => r.id)).size !== rules.length) throw new Error('Duplicate upstream rule IDs require review.');
  // A profile must have an applicable framework-specific machine-verification rule.
  const profiles = ['Rev5', '20x'].flatMap(framework => ['A', 'B', 'C', 'D']
    .filter(cls => rules.some(r => r.framework.toLowerCase() === framework.toLowerCase() && applicable(r, framework, cls)))
    .map(cls => ({framework, class: cls})));
  return {rulesVersion: source.info.version, profiles, rules, excluded, issues};
}
