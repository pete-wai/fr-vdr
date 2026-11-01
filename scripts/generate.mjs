import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import Papa from 'papaparse';
import {SCHEMA_VERSION, BASE_URL, STATUSES, COLUMNS, METADATA_FIELDS, RESPONSE_FIELDS, extractCatalog, applicable} from '../lib/model.mjs';

const sourceBytes = await readFile('data/fedramp-consolidated-rules.json');
const source = JSON.parse(sourceBytes);
const catalog = extractCatalog(source);
const provenance = JSON.parse(await readFile('data/provenance.json', 'utf8'));
if (createHash('sha256').update(sourceBytes).digest('hex') !== provenance.sha256) throw new Error('Pinned source checksum mismatch.');
const saveJSON = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + '\n');
await saveJSON('data/rule-catalog.json', catalog);
const text = {type: 'string', pattern: '\\S'};
const optionalText = {type: 'string', anyOf: [{const: ''}, {pattern: '\\S'}]};
const date = {type: 'string', format: 'date', pattern: '^\\d{4}-\\d{2}-\\d{2}$'};
const incomplete = {properties: {status: {enum: ['Partially Addressed', 'Not Addressed']}}, required: ['status']};
const response = {
  type: 'object', additionalProperties: false, required: ['status', 'explanation'],
  properties: {
    status: {type: 'string', enum: STATUSES, title: 'Implementation status'},
    explanation: {...text, description: 'Explain how the rule is followed, or why it is not followed and the resulting customer risk; explain any Not Applicable response.'},
    completionTarget: {anyOf: [date, {enum: ['', 'Unknown', 'Not Planned']}], description: 'For incomplete rules, give a date or an explicit exception.'},
    completionTargetExplanation: {...optionalText, description: 'Explain Unknown or Not Planned targets.'},
    customerRisk: {...optionalText, description: 'Risk this implementation status poses to federal agency customers.'},
    providerCompensation: {...optionalText, description: 'How the provider compensates for the risk; explicitly state if none.'},
    agencyCompensation: {...optionalText, description: 'How agencies can compensate for the risk; explicitly state if none.'},
    additionalAssurance: {...optionalText, description: 'Optional additional assurance about implementation.'},
    feedback: {...optionalText, description: 'Optional feedback about the rule.'}
  },
  allOf: [
    {if: incomplete, then: {
      required: ['completionTarget', 'customerRisk', 'providerCompensation', 'agencyCompensation'],
      properties: Object.fromEntries(['completionTarget', 'customerRisk', 'providerCompensation', 'agencyCompensation'].map(k => [k, text]))
    }, else: {properties: {completionTarget: {const: ''}, completionTargetExplanation: {const: ''}}}},
    {if: {properties: {completionTarget: {enum: ['Unknown', 'Not Planned']}}, required: ['completionTarget']},
      then: {required: ['completionTargetExplanation'], properties: {completionTargetExplanation: text}}}
  ]
};
const metadata = {
  type: 'object', additionalProperties: false,
  required: METADATA_FIELDS.filter(k => k !== 'fedrampId'),
  properties: {
    schemaVersion: {const: SCHEMA_VERSION}, rulesVersion: {const: source.info.version},
    providerName: text, offeringName: text,
    framework: {enum: ['Rev5', '20x']}, class: {enum: ['B', 'C', 'D']},
    asOfDate: date, fedrampId: {...optionalText, description: 'Official offering identifier, if available; leave blank for fictional examples.'}
  },
  allOf: [{if: {properties: {framework: {const: '20x'}}, required: ['framework']}, then: {properties: {class: {enum: ['B', 'C']}}}}]
};
const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: BASE_URL + 'downloads/implementation-status.schema.json', $schemaVersion: SCHEMA_VERSION,
  title: 'VDR/VER Implementation Status — example prototype for discussion',
  description: 'One offering and one response for each provider-directed VDR/VER rule; this collection is not an official FedRAMP reporting schema.',
  type: 'object', additionalProperties: false, required: ['metadata', 'responses'],
  properties: {
    metadata: {$ref: '#/$defs/metadata'},
    responses: {type: 'object', additionalProperties: false, required: catalog.rules.map(r => r.id),
      properties: Object.fromEntries(catalog.rules.map(r => [r.id, {$ref: '#/$defs/response', title: r.content.name}]))}
  },
  allOf: catalog.profiles.map(profile => ({
    if: {properties: {metadata: {properties: {framework: {const: profile.framework}, class: {const: profile.class}}, required: ['framework', 'class']}}, required: ['metadata']},
    then: {properties: {responses: {properties: Object.fromEntries(catalog.rules.filter(r => !applicable(r, profile.framework, profile.class)).map(r => [r.id, {properties: {status: {const: 'Not Applicable'}}}]))}}}
  })),
  $defs: {metadata, response}
};
function explicitTypes(node) {
  if (!node || typeof node !== 'object') return;
  if (!Array.isArray(node) && (node.properties || node.required) && !node.type) node.type = 'object';
  for (const value of Object.values(node)) explicitTypes(value);
}
explicitTypes(schema);
await saveJSON('schemas/implementation-status.schema.json', schema);
const quoted = value => JSON.stringify(value);
const any = values => values.map(v => `is(${quoted(v)})`).join(' or ');
const nonblank = 'regex("(?s).*\\S.*")';
const isIncomplete = '($status\\is("Partially Addressed") or $status\\is("Not Addressed"))';
const csvRules = {
  schemaVersion: `is("${SCHEMA_VERSION}")`, rulesVersion: `is("${source.info.version}")`,
  providerName: nonblank, offeringName: nonblank,
  framework: any(['Rev5', '20x']), class: 'if($framework\\is("20x"), (is("B") or is("C")), (is("B") or is("C") or is("D")))',
  asOfDate: 'xDate and regex("[0-9]{4}-[0-9]{2}-[0-9]{2}")', fedrampId: '',
  ruleId: `(${any(catalog.rules.map(r => r.id))}) and unique`,
  status: `(${any(STATUSES)}) and if((($ruleId\\is("VDR-TFR-MVF") and $framework\\is("20x")) or ($ruleId\\is("VDR-TFR-MVX") and $framework\\is("Rev5"))), is("Not Applicable"))`,
  explanation: nonblank,
  completionTarget: `if(${isIncomplete}, ((xDate and regex("[0-9]{4}-[0-9]{2}-[0-9]{2}")) or is("Unknown") or is("Not Planned")), is(""))`,
  completionTargetExplanation: `if(($completionTarget\\is("Unknown") or $completionTarget\\is("Not Planned")), ${nonblank})`,
  customerRisk: `if(${isIncomplete}, ${nonblank})`,
  providerCompensation: `if(${isIncomplete}, ${nonblank})`,
  agencyCompensation: `if(${isIncomplete}, ${nonblank})`, additionalAssurance: '', feedback: ''
};
await writeFile('schemas/implementation-status.csvs', [
  'version 1.1', `@totalColumns ${COLUMNS.length}`,
  '// UTF-8 CSV with a header row; column order is fixed.',
  '// Companion validator also checks exact headers, all rule IDs, metadata consistency,',
  '// optional whitespace, and calendar dates. This is a collection schema, not a general CSV engine.',
  ...COLUMNS.map(k => `${k}: ${csvRules[k].replace(/\$([A-Za-z]+)\\/g, '$$$1/')}`.trimEnd()), ''
].join('\n'));

const blankRows = catalog.rules.map(rule => COLUMNS.map(key => key === 'ruleId' ? rule.id : key === 'schemaVersion' ? SCHEMA_VERSION : key === 'rulesVersion' ? source.info.version : ''));
await writeFile('templates/implementation-status.csv', Papa.unparse({fields: COLUMNS, data: blankRows}, {newline: '\r\n'}) + '\r\n');
for (const name of ['automated', 'legacy', 'availability']) {
  const submission = JSON.parse(await readFile(`examples/${name}.json`, 'utf8'));
  const rows = catalog.rules.map(rule => {
    const row = {...submission.metadata, ruleId: rule.id, ...submission.responses[rule.id]};
    return COLUMNS.map(key => row[key] ?? '');
  });
  await writeFile(`examples/${name}.csv`, Papa.unparse({fields: COLUMNS, data: rows}, {newline: '\r\n'}) + '\r\n');
}
await mkdir('docs/downloads', {recursive: true});
console.log(`Generated schemas, template, and CSV examples for ${catalog.rules.length} provider rules.`);
