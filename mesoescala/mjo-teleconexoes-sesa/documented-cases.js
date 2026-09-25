// Null means not represented in this curated synthesis, never a zero anomaly.
const DOCUMENTED_CASES = [
  {id:'nt4', label:'Neutro · fase 4', enso:'neutro', phase:4,
   extremes:{region:'SESA', text:'Maior aumento da frequência de extremos no SESA entre as fases em anos neutros.'}, mean:null,
   psa:'Na fase 4, especialmente no neutro, a convecção suprimida no Pacífico Sul subtropical participa de uma teleconexão com sinais aproximadamente opostos aos das fases 8–1.'},
  {id:'nt3', label:'Neutro · fase 3', enso:'neutro', phase:3,
   extremes:{region:'SESA', text:'Aumento da frequência de extremos no SESA; segue a fase 4 no destaque em anos neutros.'}, mean:null, psa:null},
  {id:'en3', label:'El Niño · fase 3', enso:'el-nino', phase:3,
   extremes:{region:'SESA', text:'Maior aumento da frequência de extremos no SESA destacado para El Niño.'}, mean:null, psa:null},
  {id:'ln8', label:'La Niña · fase 8', enso:'la-nina', phase:8,
   extremes:null, mean:{region:'ZCAS', text:'Anomalias positivas de chuva na região da ZCAS: resposta destacada na fase 8 em La Niña.'},
   psa:'Convecção anômala no Pacífico Sul subtropical central/leste nas fases 7–8 → resposta remota sobre a ZCAS, destacada na fase 8.'},
  {id:'en1', label:'El Niño · fase 1', enso:'el-nino', phase:1,
   extremes:{region:'CESA', text:'Maior aumento da frequência de extremos no centro-leste da América do Sul destacado para El Niño.'},
   mean:{region:'ZCAS', text:'Anomalias positivas de chuva na região da ZCAS: resposta destacada na fase 1 em El Niño.'},
   psa:'Convecção anômala no Pacífico Sul subtropical central/leste nas fases 8–1 → resposta remota sobre a ZCAS, destacada na fase 1.'}
];
if (typeof module !== 'undefined') module.exports = DOCUMENTED_CASES;
