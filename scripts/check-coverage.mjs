import {readFile, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import Papa from 'papaparse';
const read = path => readFile(path,'utf8');
const json = async path => JSON.parse(await read(path));
const sourceBytes = await readFile('data/fedramp-consolidated-rules.json');
const source = JSON.parse(sourceBytes), expected = new Map(), excluded = [];
// Deliberately independent of extractCatalog and its generated view model.
for (const setName of ['VDR','VER']) {
  const set = source.FRR[setName];
  for (const [framework, groups] of Object.entries(set.data)) for (const [group, items] of Object.entries(groups)) {
    for (const [id, content] of Object.entries(items)) {
      const applicability = set.info.subsets[group].applicability;
      if (!(content.affects ?? applicability.affects).includes('Providers')) {excluded.push(id); continue;}
      assert.ok(!expected.has(id), `Duplicate upstream rule ${id}`);
      expected.set(id, {content, applicability, framework});
    }
  }
}
const ids = [...expected.keys()].sort();
function same(actual, label) {assert.deepEqual([...actual].sort(),ids,`${label}: exact rule inventory differs`);}
const provenance = await json('data/provenance.json');
assert.equal(createHash('sha256').update(sourceBytes).digest('hex'),provenance.sha256);
assert.equal(source.info.version, provenance.version);
const catalog = await json('data/rule-catalog.json');
same(catalog.rules.map(r=>r.id),'catalog');
for (const rule of catalog.rules) {
  const original = expected.get(rule.id);
  assert.deepEqual(rule.content,original.content,`${rule.id}: source detail lost`);
  assert.deepEqual(rule.applicability,original.applicability);
  assert.equal(rule.framework,original.framework);
}
assert.deepEqual(catalog.excluded.map(r=>r.id).sort(),excluded.sort());
const schema = await json('schemas/implementation-status.schema.json');
same(schema.properties.responses.required,'JSON required rules');
same(Object.keys(schema.properties.responses.properties),'JSON rule properties');
const csvSchema = await read('schemas/implementation-status.csvs');
const ruleLine = csvSchema.split('\n').find(line=>line.startsWith('ruleId:'));
same([...ruleLine.matchAll(/is\("([A-Z]{3}-[A-Z]{3}-[A-Z]{3})"\)/g)].map(m=>m[1]),'CSV schema rule choices');
const template = Papa.parse(await read('templates/implementation-status.csv'),{header:true,skipEmptyLines:true});
assert.equal(template.errors.length,0); same(template.data.map(r=>r.ruleId),'template');
for (const name of ['automated','legacy','availability']) {
  same(Object.keys((await json(`examples/${name}.json`)).responses),`${name} JSON`);
  same(Papa.parse(await read(`examples/${name}.csv`),{header:true,skipEmptyLines:true}).data.map(r=>r.ruleId),`${name} CSV`);
}
// With --published, require exact byte parity for every download in the built site.
if (process.argv.includes('--published')) {
  const {DOWNLOADS} = await import('./downloads.mjs');
  for (const [origin,name] of DOWNLOADS) assert.deepEqual(await readFile(`site/downloads/${name}`),await readFile(origin),`Published ${name} is stale`);
  await access('site/assets/validator.js');
}
console.log(`Coverage PASS: ${ids.length} provider rules (${ids.filter(id=>id.startsWith('VDR-')).length} VDR, ${ids.filter(id=>id.startsWith('VER-')).length} VER); excluded: ${excluded.join(', ')}.`);
