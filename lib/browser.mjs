import {validateText} from './validate.mjs';

function initialize() {
  const root = document.getElementById('validator');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const get = id => document.getElementById(id);
  const contents = get('submission-text'), format = get('format'), summary = get('validation-summary'), errors = get('validation-errors');
  const MAX_SIZE = 5 * 1024 * 1024;
  function message(text) {summary.textContent = text; delete summary.dataset.valid; errors.replaceChildren();}
  function validate() {
    if (new Blob([contents.value]).size > MAX_SIZE) {message('This file exceeds 5 MB. Use the command-line validator.'); return;}
    const result = validateText(contents.value, format.value);
    errors.replaceChildren();
    summary.dataset.valid = String(result.valid);
    summary.textContent = result.valid
      ? `Valid file: all ${Object.keys(result.data.responses).length} provider rules are present. ${result.warnings.length ? `${result.warnings.length} review note(s).` : 'No structural errors found.'}`
      : `File needs changes: ${result.errors.length} error(s).`;
    for (const [prefix, items] of [['Error', result.errors], ['Review', result.warnings]]) {
      for (const item of items.slice(0,100)) {
        const li = document.createElement('li');
        li.textContent = `${prefix}${item.row ? ` — row ${item.row}` : ''}: ${item.field || 'file'} — ${item.message}`;
        errors.append(li);
      }
      if (items.length > 100) {const li=document.createElement('li'); li.textContent=`Showing the first 100 ${prefix.toLowerCase()} messages; correct these and validate again.`; errors.append(li);}
    }
  }
  get('run-validation').addEventListener('click',validate);
  contents.addEventListener('input',()=>message('Contents changed. Validate again to check this version.'));
  format.addEventListener('change',()=>message('Format changed. Validate again to check this version.'));
  get('submission-file').addEventListener('change',async event=>{
    const file=event.target.files[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {message('This file exceeds 5 MB. Use the command-line validator.'); return;}
    const extension=file.name.split('.').pop().toLowerCase();
    if (!['json','csv'].includes(extension)) {message('Choose a .json or .csv file.'); return;}
    try {contents.value=await file.text(); format.value=extension; validate();}
    catch {message('The file could not be read. Choose it again or paste its contents.');}
  });
  const example=get('example'), download=get('download-example');
  const exampleURL=()=>new URL(`../downloads/${example.value}`,location.href);
  example.addEventListener('change',()=>{download.href=exampleURL().href;});
  get('load-example').addEventListener('click',async event=>{
    event.target.disabled=true;
    message('Loading example…');
    try {
      const response=await fetch(exampleURL());
      if(!response.ok) throw new Error('Download failed');
      contents.value=await response.text(); format.value=example.value.split('.').pop(); validate();
    } catch {message('The example could not be loaded. Use its download link and select the saved file.');}
    finally {event.target.disabled=false;}
  });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initialize);
else initialize();
