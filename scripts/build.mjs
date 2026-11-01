import {mkdir, copyFile, readFile, writeFile, rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {DOWNLOADS} from './downloads.mjs';
const catalog=JSON.parse(await readFile('data/rule-catalog.json','utf8'));
const pin=JSON.parse(await readFile('data/provenance.json','utf8'));
const report=[
  '# Rule coverage\n',
  `Source version: ${pin.version}. Commit: ${pin.commit}.`,
  `SHA-256: ${pin.sha256}.\n`,
  `${catalog.rules.length} provider-directed rules are required in every submission.`,
  'The other framework’s machine-verification rule must be Not Applicable.\n',
  '## Excluded actors\n',
  ...catalog.excluded.map(r=>`- ${r.id}: ${r.actors.join(', ')} — ${r.reason}`),
  '\n## Supported profiles\n',
  ...catalog.profiles.map(p=>`- ${p.framework} Class ${p.class}`),
  '\n## Source inconsistencies\n',
  ...catalog.issues.map(issue=>`- ${issue.id}, Class ${issue.class}: ${issue.issue}`),
  '\nThese variants remain in the catalog but do not expand parent applicability. No 20x Class D machine-verification variant is supplied, so that profile is unsupported.\n',
  '## Provider inventory\n',
  '| Rule ID | Name | Framework |', '| --- | --- | --- |',
  ...catalog.rules.map(r=>`| ${r.id} | ${r.content.name} | ${r.framework} |`), ''
];
await writeFile('data/coverage-report.md',report.join('\n'));
await rm('docs/downloads',{recursive:true,force:true});
await mkdir('docs/downloads',{recursive:true});
for(const [source,name] of DOWNLOADS) await copyFile(source,`docs/downloads/${name}`);
await build({entryPoints:['lib/browser.mjs'],bundle:true,outfile:'docs/assets/validator.js',minify:true,format:'iife',platform:'browser',target:['es2022'],legalComments:'eof'});
execFileSync('uv',['run','--locked','zensical','build','--clean'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-coverage.mjs','--published'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-links.mjs'],{stdio:'inherit'});
