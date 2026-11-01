import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const pinned = JSON.parse(await readFile('data/provenance.json','utf8'));
const response = await fetch('https://api.github.com/repos/FedRAMP/rules/commits/main');
if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
const {sha} = await response.json();
const source = await fetch(`https://raw.githubusercontent.com/FedRAMP/rules/${sha}/${pinned.path}`);
if (!source.ok) throw new Error(`Source returned ${source.status}`);
const bytes = Buffer.from(await source.arrayBuffer());
const hash = createHash('sha256').update(bytes).digest('hex');
console.log(`Pinned: ${pinned.commit}\nUpstream: ${sha}`);
if (hash !== pinned.sha256) {
  console.log('Rules content changed upstream. Review the new source and all affected schemas and examples before updating the pin.');
  process.exitCode = 1;
} else console.log('Pinned rules content matches upstream. No files changed.');
