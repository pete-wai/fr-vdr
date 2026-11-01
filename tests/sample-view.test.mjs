import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SAMPLES, summarizeSample, renderSample, escapeHTML} from '../lib/sample-view.mjs';
import catalog from '../data/rule-catalog.json' with {type: 'json'};
import {RESPONSE_FIELDS} from '../lib/model.mjs';

for (const {slug} of SAMPLES) test(`${slug} viewer includes every answer and accurate totals`, () => {
  const sample = JSON.parse(readFileSync(`examples/${slug}.json`, 'utf8'));
  const summary = summarizeSample(sample, catalog);
  const page = renderSample(sample, catalog, slug);
  assert.equal(summary.total, Object.keys(sample.responses).length);
  for (const [status, count] of Object.entries(summary.counts)) {
    assert.equal(count, Object.values(sample.responses).filter(response => response.status === status).length);
    assert.ok(page.includes(`<dt>${status}</dt><dd>${count}</dd>`));
  }
  assert.equal((page.match(/class="sample-rule"/g) ?? []).length, catalog.rules.length);
  for (const [id, response] of Object.entries(sample.responses)) {
    assert.ok(page.includes(`id="${id}"`));
    for (const key of RESPONSE_FIELDS) if (response[key]) assert.ok(page.includes(escapeHTML(response[key])), `${id}/${key}`);
  }
});

test('summary reacts to data changes and counts only applicable mandatory rules', () => {
  const sample = {metadata: {framework:'Rev5',class:'B'}, responses: {
    a: {status:'Fully Addressed'}, b: {status:'Partially Addressed'}, c: {status:'Not Applicable'}
  }};
  const rule = (id, framework, force) => ({id,framework,applicability:{types:['Rev5','20x'],classes:['B']},content:{force}});
  const source = {rules:[rule('a','all','MUST NOT'),rule('b','all','SHOULD'),rule('c','20x','MUST')]};
  assert.deepEqual(summarizeSample(sample, source), {
    counts:{'Fully Addressed':1,'Partially Addressed':1,'Not Addressed':0,'Not Applicable':1},
    total:3, mandatoryTotal:1, mandatoryFull:1
  });
  sample.responses.a.status = 'Not Addressed';
  assert.equal(summarizeSample(sample, source).mandatoryFull,0);
  assert.equal(summarizeSample(sample, source).counts['Not Addressed'],1);
});

test('viewer escapes sample markup and omits empty optional answers', () => {
  const sample = JSON.parse(readFileSync('examples/automated.json','utf8'));
  sample.responses['VDR-CSO-DET'].explanation = '<script>alert("unsafe")</script>';
  sample.responses['VDR-CSO-DET'].feedback = '';
  const page=renderSample(sample,catalog,'automated');
  assert.ok(page.includes('&lt;script&gt;'));
  assert.ok(!page.includes('<script>'));
  assert.ok(!page.includes('<dd></dd>'));
});
