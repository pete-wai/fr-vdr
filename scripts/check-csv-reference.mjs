// Independent CSV Schema validation. Downloads a checksum-pinned official release
// into .cache/ and installs an exact Java runtime with mise if needed.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import path from 'node:path';
import Papa from 'papaparse';
const release='1.4.4';
const checksum='401c23b99ae25bcca3754996d51f93c9bbb56043b6e313aecbf3b4aa2d2319ac';
const java='java@temurin-21.0.13+9.0.LTS';
const directory=path.resolve('.cache/csv-validator');
await mkdir(directory,{recursive:true});
const archive=path.join(directory,'distribution.zip');
let bytes;
try {bytes=await readFile(archive);} catch {
  const response=await fetch(`https://github.com/digital-preservation/csv-validator/releases/download/${release}/csv-validator-distribution-${release}-bin.zip`);
  if(!response.ok) throw new Error(`Reference validator download returned ${response.status}`);
  bytes=Buffer.from(await response.arrayBuffer());
}
if(createHash('sha256').update(bytes).digest('hex')!==checksum) throw new Error('Reference validator checksum mismatch');
await writeFile(archive,bytes);
execFileSync('unzip',['-q','-o',archive,'-d',directory]);
execFileSync('mise',['install',java],{stdio:'inherit'});
function validate(file,shouldPass) {
  const result=spawnSync('mise',['exec',java,'--','java','-jar',path.join(directory,`csv-validator-cmd-${release}.jar`),file,'schemas/implementation-status.csvs'],{encoding:'utf8'});
  if(result.error) throw result.error;
  const output=result.stdout + result.stderr;
  // The reference CLI may exit zero for a schema error, so require explicit PASS.
  const passed=/^PASS\s*$/m.test(output);
  if(passed!==shouldPass || (shouldPass && result.status!==0) || (!shouldPass && !/^FAIL\s*$/m.test(output))) throw new Error(`Unexpected reference result for ${file}:\n${output}`);
}
for(const name of ['automated','legacy','availability']) validate(`examples/${name}.csv`,true);
const original=Papa.parse(await readFile('examples/legacy.csv','utf8'),{skipEmptyLines:true}).data;
for(const [name,modify] of [
  ['status',rows=>rows[1][9]='Complete'],
  ['date',rows=>rows[1][6]='2026-02-30'],
  ['risk',rows=>rows.find(row=>row[8]==='VDR-CSO-ADT')[13]=''],
  ['exception',rows=>rows.find(row=>row[8]==='VDR-TFR-PVR')[12]=''],
  ['framework',rows=>rows.find(row=>row[8]==='VDR-TFR-MVX')[9]='Fully Addressed'],
  ['duplicate',rows=>rows.push(rows[1])]
]) {
  const rows=structuredClone(original); modify(rows);
  const file=path.join(directory,`invalid-${name}.csv`);
  await writeFile(file,Papa.unparse(rows)); validate(file,false);
}
console.log(`CSV Schema reference ${release}: three examples passed; six negative cases rejected.`);
