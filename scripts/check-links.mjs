import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
async function files(dir) {const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
let checked=0;
for(const file of (await files('site')).filter(f=>f.endsWith('.html'))) {
  const text=await readFile(file,'utf8');
  for(const [,raw] of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if(/^(?:[a-z]+:|\/\/|#)/i.test(raw)) continue;
    const href=decodeURIComponent(raw.split(/[?#]/)[0]);
    if(!href) continue;
    const target=href.startsWith('/fr-vdr/')?path.join('site',href.slice('/fr-vdr/'.length)):path.resolve(path.dirname(file),href);
    try {const info=await stat(target); if(info.isDirectory()) await stat(path.join(target,'index.html'));}
    catch {throw new Error(`${file}: broken local link ${raw}`);}
    checked++;
  }
}
console.log(`Built-site links PASS: ${checked} local links and assets.`);
