const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const cases=require('./documented-cases.js');
assert.equal(cases.length,5);
assert.deepEqual(cases.map(c=>c.id),['nt4','nt3','en3','ln8','en1']);
for(const c of cases){
 for(const metric of ['mean','extremes']){
  const result=c[metric];
  assert(result===null || (['SESA','ZCAS','CESA'].includes(result.region)&&result.text));
  if(result) assert(!/%|m\/s/.test(result.text));
 }
}
assert.equal(cases[0].mean,null);assert.equal(cases[1].mean,null);
assert.equal(cases[3].extremes,null);
const html=fs.readFileSync('index.html','utf8');
assert(!/sliderAmp|btnPlayCycle|logitRulerCanvas|enso-science.js/.test(html));
for(const file of ['documented-cases.js','documented-view.js','map-regions.js'])new vm.Script(fs.readFileSync(file,'utf8'));
console.log('5 casos documentados; variáveis ausentes permanecem null; sem controles de combinações livres ou probabilidades sintéticas; sintaxe OK.');
