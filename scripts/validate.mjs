import {readFile} from 'node:fs/promises';
import {extname} from 'node:path';
import {validateText} from '../lib/validate.mjs';
const files = process.argv.slice(2);
if (!files.length) {console.error('Usage: npm run validate -- file.json [file.csv ...]'); process.exitCode = 2;}
for (const file of files) {
  try {
    const result = validateText(await readFile(file, 'utf8'), extname(file).slice(1).toLowerCase());
    console.log(`${result.valid ? 'PASS' : 'FAIL'} ${file}`);
    for (const item of [...result.errors, ...result.warnings]) console.log(`  ${item.row ? `row ${item.row} ` : ''}${item.field}: ${item.message}`);
    if (!result.valid) process.exitCode = Math.max(process.exitCode ?? 0, 1);
  } catch (cause) {console.error(`${file}: ${cause.message}`); process.exitCode = 2;}
}
