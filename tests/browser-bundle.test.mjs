import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {build} from 'esbuild';
import {validateText} from '../lib/validate.mjs';
test('browser bundle and Node engine agree for all examples and invalid input',async()=>{
  const bundle=await build({entryPoints:['lib/validate.mjs'],bundle:true,write:false,platform:'browser',format:'iife',globalName:'collectionValidator'});
  const context=vm.createContext({console});
  vm.runInContext(bundle.outputFiles[0].text,context);
  for(const name of ['automated','legacy','availability']) for(const format of ['json','csv']) {
    const text=readFileSync(`examples/${name}.${format}`,'utf8');
    assert.deepEqual(JSON.parse(JSON.stringify(context.collectionValidator.validateText(text,format))),JSON.parse(JSON.stringify(validateText(text,format))));
  }
  for(const text of ['{}','{','null','{"responses":{"x":{},"x":{}}}']) {
    assert.equal(context.collectionValidator.validateText(text,'json').valid,validateText(text,'json').valid);
  }
});
