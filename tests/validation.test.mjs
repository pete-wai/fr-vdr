import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Papa from 'papaparse';
import {validateText, validateSubmission} from '../lib/validate.mjs';
import {NARRATIVE_FIELDS, applicable, resolvedRule, extractCatalog} from '../lib/model.mjs';
import catalog from '../data/rule-catalog.json' with {type:'json'};
const read = path => readFileSync(path, 'utf8');
const sample = name => JSON.parse(read(`examples/${name}.json`));
const mutate = fn => {const data = sample('legacy'); fn(data); return data;};
const id = 'VDR-CSO-ADT';

for (const name of ['automated','legacy','availability']) {
  test(`${name}: equivalent valid JSON and CSV, concise prose`, () => {
    const json = validateText(read(`examples/${name}.json`), 'json');
    const csv = validateText(read(`examples/${name}.csv`), 'csv');
    assert.equal(json.valid, true, JSON.stringify(json.errors));
    assert.equal(csv.valid, true, JSON.stringify(csv.errors));
    assert.deepEqual(JSON.parse(JSON.stringify(csv.data)), json.data);
    for (const [ruleId, response] of Object.entries(json.data.responses)) {
      const sentences = NARRATIVE_FIELDS.flatMap(key => (response[key] ?? '').match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? []);
      assert.ok(sentences.length <= 5, `${ruleId}: ${sentences.length} sentences`);
    }
  });
}
test('persona statuses match applicable force and intended patterns', () => {
  const automated = sample('automated'), legacy = sample('legacy'), small = sample('availability');
  let recommendations = 0, incomplete = 0, smallMustGaps = 0;
  for (const rule of catalog.rules) {
    if (applicable(rule, '20x', 'C')) assert.equal(automated.responses[rule.id].status, 'Fully Addressed');
    if (applicable(rule, 'Rev5', 'C')) {
      const force = resolvedRule(rule, 'C').force;
      if (force.startsWith('MUST')) assert.equal(legacy.responses[rule.id].status, 'Fully Addressed', rule.id);
      if (force.startsWith('SHOULD')) {recommendations++; if (['Partially Addressed','Not Addressed'].includes(legacy.responses[rule.id].status)) incomplete++;}
    }
    if (applicable(rule, 'Rev5', 'B') && resolvedRule(rule,'B').force.startsWith('MUST') && small.responses[rule.id].status !== 'Fully Addressed') smallMustGaps++;
  }
  assert.ok(incomplete > recommendations / 2);
  assert.ok(smallMustGaps > 0);
});
for (const [name, change] of [
  ['missing rule', d => delete d.responses[id]],
  ['extra rule', d => d.responses['VER-FAKE-XYZ'] = d.responses[id]],
  ['non-provider rule', d => d.responses['VER-FRP-ARP'] = d.responses[id]],
  ['incorrect status', d => d.responses[id].status = 'Complete'],
  ['whitespace explanation', d => d.responses[id].explanation = ' \n\t'],
  ['missing target', d => delete d.responses[id].completionTarget],
  ['invalid calendar date', d => d.responses[id].completionTarget = '2027-02-29'],
  ['missing customer risk', d => delete d.responses[id].customerRisk],
  ['missing provider compensation', d => delete d.responses[id].providerCompensation],
  ['missing agency compensation', d => delete d.responses[id].agencyCompensation],
  ['unknown target without reason', d => d.responses[id].completionTarget = 'Unknown'],
  ['not planned without reason', d => d.responses[id].completionTarget = 'Not Planned'],
  ['wrong framework applicability', d => d.responses['VDR-TFR-MVX'].status = 'Fully Addressed'],
  ['Class A source conflict', d => d.metadata.class = 'A'],
  ['unsupported 20x D', d => {d.metadata.framework = '20x'; d.metadata.class = 'D';}],
  ['invalid as-of date', d => d.metadata.asOfDate = '2026-13-01'],
  ['unexpected property', d => d.unexpected = true],
  ['target on fully addressed', d => d.responses['VDR-CSO-DET'].completionTarget = '2027-01-01'],
  ['wrong rules version', d => d.metadata.rulesVersion = 'latest']
]) test(name, () => assert.equal(validateSubmission(mutate(change)).valid, false));

test('date and exception alternatives pass', () => {
  for (const completionTarget of ['2028-02-29','Unknown','Not Planned']) {
    const data = mutate(d => {d.responses[id].completionTarget = completionTarget; d.responses[id].completionTargetExplanation = 'Supplier timing remains uncertain.';});
    assert.equal(validateSubmission(data).valid, true);
  }
});
test('applicable Not Applicable requires explanation and raises a review warning', () => {
  const data = mutate(d => d.responses[id] = {status:'Not Applicable',explanation:'Provider-specific circumstances require review.'});
  const result = validateSubmission(data);
  assert.equal(result.valid, true); assert.ok(result.warnings.some(w=>w.ruleId===id));
});
test('duplicate JSON keys including escaped equivalent keys are rejected', () => {
  const text = read('examples/automated.json');
  for (const key of ['VDR-CSO-DET', 'VDR-CSO-\\u0044ET']) {
    const modified = text.replace('"responses": {', `"responses": {"${key}": {},`);
    assert.ok(validateText(modified,'json').errors.some(e=>e.message.includes('Duplicate')));
  }
});
test('bad JSON, null, arrays and unknown formats fail cleanly', () => {
  for (const text of ['{', 'null', '[]', '123']) assert.equal(validateText(text,'json').valid, false);
  assert.equal(validateText('hello','txt').valid, false);
});
const modifyCSV = fn => {
  const parsed = Papa.parse(read('examples/legacy.csv'),{skipEmptyLines:true});
  fn(parsed.data);
  return Papa.unparse(parsed.data);
};
test('CSV rejects duplicate IDs and metadata mismatch with row locations', () => {
  const dup = validateText(modifyCSV(rows=>rows.push(rows[1])), 'csv');
  assert.ok(dup.errors.some(e=>e.message.includes('Duplicate') && e.row));
  const inconsistent = validateText(modifyCSV(rows=>rows[2][2]='Different provider'), 'csv');
  assert.ok(inconsistent.errors.some(e=>e.row===3 && e.field==='providerName'));
});
test('CSV missing rules, headers, cells, malformed quotes and whitespace narratives fail', () => {
  for (const change of [rows=>rows.pop(), rows=>rows[0][0]='wrong', rows=>rows[1].pop(), rows=>rows[1][10]='   ']) {
    assert.equal(validateText(modifyCSV(change),'csv').valid,false);
  }
  assert.equal(validateText('"unclosed','csv').valid,false);
  assert.equal(validateText('','csv').valid,false);
});
test('CSV quotes, commas, multiline Unicode, optional blanks, and BOM survive parsing', () => {
  const text = modifyCSV(rows => rows[1][10] = 'Reviewed "quoted" evidence, including café records.\nA second line records the result.');
  const result = validateText('\uFEFF'+text, 'csv');
  assert.equal(result.valid,true,JSON.stringify(result.errors));
  assert.ok(result.data.responses['VDR-CSO-DET'].explanation.includes('\n'));
  assert.equal(validateText('\uFEFF'+read('examples/automated.json'),'json').valid,true);
});
test('blank template intentionally fails submission validation', () => assert.equal(validateText(read('templates/implementation-status.csv'),'csv').valid,false));
test('class-dependent force and source contradictions are preserved', () => {
  const rule = catalog.rules.find(r=>r.id==='VDR-TFR-MVF');
  assert.equal(resolvedRule(rule,'B').force,'SHOULD');
  assert.equal(resolvedRule(rule,'C').force,'MUST');
  assert.equal(applicable(rule,'Rev5','A'),false);
  assert.ok(catalog.issues.length > 0);
});
test('source traversal retains supporting lists and excludes actors independently', () => {
  const catalog = extractCatalog(JSON.parse(read('data/fedramp-consolidated-rules.json')));
  assert.ok(catalog.rules.find(r=>r.id==='VER-RPT-VDT').content.following_information.length > 0);
  assert.ok(catalog.rules.find(r=>r.id==='VDR-TFR-PVR').content.varies_by_class.c.pain_timeframes);
  assert.ok(catalog.excluded.every(r=>!r.actors.includes('Providers')));
});
