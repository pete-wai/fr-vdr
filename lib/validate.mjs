import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import Papa from 'papaparse';
import schema from '../schemas/implementation-status.schema.json' with {type: 'json'};
import catalog from '../data/rule-catalog.json' with {type: 'json'};
import {COLUMNS, METADATA_FIELDS, RESPONSE_FIELDS, applicable} from './model.mjs';

const ajv = new Ajv2020({allErrors: true, strict: true});
ajv.addKeyword('$schemaVersion');
addFormats(ajv);
const checkSchema = ajv.compile(schema);
const error = (field, message, extra = {}) => ({field, message, ...extra});

// JSON.parse accepts duplicate members. Inspect its already syntax-checked tokens
// so escaped spellings of the same key cannot silently replace a response.
function duplicateKeys(text) {
  const tokens = text.match(/"(?:[^"\\]|\\.)*"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\],:]/g);
  let pos = 0;
  const errors = [];
  function value(path) {
    if (tokens[pos] === '{') {
      pos++;
      const seen = new Set();
      while (tokens[pos] !== '}') {
        const key = JSON.parse(tokens[pos++]);
        const next = `${path}/${key}`;
        if (seen.has(key)) errors.push(error(next, `Duplicate JSON member: ${key}.`));
        seen.add(key);
        pos++; value(next);
        if (tokens[pos] === ',') pos++;
      }
      pos++;
    } else if (tokens[pos] === '[') {
      pos++;
      let index = 0;
      while (tokens[pos] !== ']') {
        value(`${path}/${index++}`);
        if (tokens[pos] === ',') pos++;
      }
      pos++;
    } else pos++;
  }
  value('');
  return errors;
}

export function validateSubmission(data, rows = {}) {
  const errors = [];
  if (!checkSchema(data)) {
    for (const issue of checkSchema.errors) {
      if (issue.keyword === 'if') continue;
      let field = issue.instancePath;
      if (issue.params.missingProperty) field += '/' + issue.params.missingProperty;
      if (issue.params.additionalProperty) field += '/' + issue.params.additionalProperty;
      const ruleId = field.match(/^\/responses\/([^/]+)/)?.[1];
      const detail = issue.params.allowedValues ? ` (${issue.params.allowedValues.join(', ')})` : issue.params.allowedValue ? ` (${issue.params.allowedValue})` : '';
      errors.push(error(field, issue.message + detail, {ruleId, row: rows[ruleId]}));
    }
  }
  const warnings = [];
  if (data?.metadata && data?.responses) {
    for (const rule of catalog.rules) {
      if (data.responses[rule.id]?.status === 'Not Applicable' && applicable(rule, data.metadata.framework, data.metadata.class ?? '')) {
        warnings.push(error(`/responses/${rule.id}/status`, 'This rule applies to this profile; review the provider’s Not Applicable explanation.', {ruleId: rule.id, row: rows[rule.id]}));
      }
    }
  }
  return {valid: errors.length === 0, errors, warnings, data};
}

export function validateText(input, format) {
  try {
    const text = input.replace(/^\uFEFF/, '');
    if (format === 'json') {
      const data = JSON.parse(text);
      const errors = duplicateKeys(text);
      return errors.length ? {valid: false, errors, warnings: []} : validateSubmission(data);
    }
    if (format !== 'csv') throw new Error('Choose a .json or .csv file.');
    const parsed = Papa.parse(text, {skipEmptyLines: 'greedy', dynamicTyping: false});
    const errors = parsed.errors.map(e => error('csv', e.message, {row: e.row === undefined ? undefined : e.row + 1}));
    const [headers, ...records] = parsed.data;
    if (!headers || headers.length !== COLUMNS.length || headers.some((h, i) => h !== COLUMNS[i])) {
      errors.push(error('header', `Use these ${COLUMNS.length} columns in order: ${COLUMNS.join(', ')}.`, {row: 1}));
      return {valid: false, errors, warnings: []};
    }
    const data = {metadata: {}, responses: Object.create(null)}, rows = {};
    if (!records.length) errors.push(error('csv', 'No rule responses found.'));
    records.forEach((values, i) => {
      const row = i + 2; // Logical CSV record, counting the header; embedded newlines do not add records.
      if (values.length !== COLUMNS.length) {errors.push(error('csv', `Expected ${COLUMNS.length} cells; found ${values.length}.`, {row})); return;}
      const record = Object.fromEntries(COLUMNS.map((key, idx) => [key, values[idx]]));
      for (const field of METADATA_FIELDS) {
        if (i === 0) {if (record[field] !== '' || field !== 'fedrampId') data.metadata[field] = record[field];}
        else if ((data.metadata[field] ?? '') !== record[field]) errors.push(error(field, 'Offering metadata must be identical in every row.', {row}));
      }
      const id = record.ruleId;
      if (Object.hasOwn(data.responses, id)) {errors.push(error('ruleId', 'Duplicate rule ID.', {ruleId: id, row})); return;}
      rows[id] = row;
      data.responses[id] = Object.fromEntries(RESPONSE_FIELDS.filter(k => record[k] !== '' || ['status', 'explanation'].includes(k)).map(k => [k, record[k]]));
    });
    const result = validateSubmission(data, rows);
    result.errors.unshift(...errors);
    result.valid = result.errors.length === 0;
    return result;
  } catch (cause) {
    return {valid: false, errors: [error(format, cause.message)], warnings: []};
  }
}
