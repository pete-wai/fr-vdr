export const DOWNLOADS = [
  ['schemas/implementation-status.schema.json','implementation-status.schema.json'],
  ['schemas/implementation-status.csvs','implementation-status.csvs'],
  ['templates/implementation-status.csv','implementation-status-template.csv'],
  ['data/rule-catalog.json','rule-catalog.json'],
  ['data/provenance.json','provenance.json'],
  ['data/coverage-report.md','coverage-report.txt'],
  ...['automated','legacy','availability'].flatMap(name=>['json','csv'].map(ext=>[`examples/${name}.${ext}`,`${name}.${ext}`]))
];
