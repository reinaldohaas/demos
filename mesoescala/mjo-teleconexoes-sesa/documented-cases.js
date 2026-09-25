// Null means not represented in this curated synthesis, never a zero anomaly.
const DOCUMENTED_CASES = [
  {id:'nt4', label:'Neutro · fase 4', enso:'neutro', phase:4,
   extremes:{region:'SESA', text:'Maior aumento da frequência de extremos no SESA entre as fases em anos neutros.'}, mean:null,
   psa:'Na fase 4 em anos neutros, a convecção suprimida no Pacífico Sul subtropical induz teleconexão via trem de ondas com sinais aproximadamente opostos aos das fases 8–1, favorecendo convergência de umidade sobre o SESA.'},
  {id:'nt3', label:'Neutro · fase 3', enso:'neutro', phase:3,
   extremes:{region:'SESA', text:'Aumento da frequência de extremos no SESA; segue a fase 4 no destaque em anos neutros.'}, mean:null,
   psa:'Convecção anômala da MJO sobre o Oceano Índico central/leste; o padrão de circulação e dispersão de ondas favorece o transporte de umidade em direção ao SESA.'},
  {id:'en3', label:'El Niño · fase 3', enso:'el-nino', phase:3,
   extremes:{region:'SESA', text:'Maior aumento da frequência de extremos no SESA destacado para El Niño.'}, mean:null,
   psa:'Interação construtiva entre o aquecimento anômalo do Pacífico equatorial e a convecção da MJO no Índico, intensificando a anomalia ciclônica e a convergência sobre o SESA.'},
  {id:'ln8', label:'La Niña · fase 8', enso:'la-nina', phase:8,
   extremes:null, mean:{region:'ZCAS', text:'Anomalias positivas de chuva na região da ZCAS: resposta destacada na fase 8 em La Niña.'},
   psa:'Convecção anômala no Pacífico Sul subtropical central/leste nas fases 7–8 induz trem de ondas PSA com resposta remota sobre a ZCAS.'},
  {id:'en1', label:'El Niño · fase 1', enso:'el-nino', phase:1,
   extremes:{region:'CESA', text:'Maior aumento da frequência de extremos no centro-leste da América do Sul destacado para El Niño.'},
   mean:{region:'ZCAS', text:'Anomalias positivas de chuva na região da ZCAS: resposta destacada na fase 1 em El Niño.'},
   psa:'Convecção anômala no Pacífico Sul subtropical central/leste nas fases 8–1 induz resposta remota sobre a ZCAS e aumento de extremos no CESA.'}
];
if (typeof module !== 'undefined') module.exports = DOCUMENTED_CASES;
