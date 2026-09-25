const $ = id => document.getElementById(id);
let selectedCase = DOCUMENTED_CASES[0];
let metric = 'extremes';
const ns = 'http://www.w3.org/2000/svg';
function svg(tag, attributes, text) {
  const el=document.createElementNS(ns,tag);
  for(const [k,v] of Object.entries(attributes)) el.setAttribute(k,v);
  if(text !== undefined) el.textContent=text;
  $('mapDrawing').appendChild(el);
  return el;
}
function project(lon,lat) {return [60+(lon+85)*8,35+(15-lat)*6.4];}
function polygon(points,fill,stroke) {
  svg('polygon',{points:points.map(p=>project(...p).join(',')).join(' '),fill,stroke,'stroke-width':1.5});
}
function drawMap(result) {
  $('mapDrawing').replaceChildren();
  for(const lat of [0,-20,-40]) {
    const [x,y]=project(-85,lat);
    svg('line',{x1:x,y1:y,x2:565,y2:y,stroke:'#20354b','stroke-dasharray':'4 6'});
    svg('text',{x:10,y:y+4,fill:'#8198af','font-size':12},`${Math.abs(lat)}°${lat<0?'S':''}`);
  }
  polygon(REGIONS.SOUTH_AMERICA_COORDS,'#132d40','#4b728e');
  polygon(REGIONS.SESA_POLY,'none','#486780');
  const [sx,sy]=project(-56,-21);
  svg('text',{x:sx,y:sy-7,fill:'#a5cce3','font-size':17,'text-anchor':'middle'},'SESA');
  if(result) {
    const location=result.region==='SESA'?[-56,-30]:result.region==='CESA'?[-46,-15]:[-43,-21];
    const [x,y]=project(...location);
    if(result.region==='ZCAS') polygon(REGIONS.ZCAS_POLY,'none','#7ba1bb');
    svg('path',{d:`M ${x-22} ${y} C ${x-38} ${y-16}, ${x-17} ${y-30}, ${x-5} ${y-21} C ${x+2} ${y-43}, ${x+31} ${y-31}, ${x+25} ${y-13} C ${x+44} ${y-10}, ${x+33} ${y+5}, ${x+20} ${y+4} L ${x-22} ${y+4} Z`,fill:'#73d8da',stroke:'#b4f5f0','stroke-width':2});
    for(const dx of [-16,0,16]) svg('line',{x1:x+dx,y1:y+12,x2:x+dx-5,y2:y+24,stroke:'#73d8da','stroke-width':metric==='extremes'?4:2,'stroke-linecap':'round'});
    svg('text',{x:x+47,y:y+5,fill:'#aaf4e7','font-size':24},'↑');
    svg('text',{x,y:y+49,fill:'#c6f6ef','font-size':14,'text-anchor':'middle'},metric==='extremes'?'Extremos mais frequentes':'Chuva média favorecida');
    if(result.region!=='SESA') svg('text',{x,y:y-45,fill:'#a5cce3','font-size':17,'text-anchor':'middle'},result.region==='CESA'?'CESA · centro-leste':result.region);
  }
  $('mapDesc').textContent=result?`${result.region}: ${result.text} Símbolo regional sem magnitude ou extensão quantitativa.`:'Mapa de referência sem efeito desenhado para esta variável.';
}
function update() {
  const c=selectedCase, result=c[metric];
  document.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===c.id)));
  for(const m of ['mean','extremes']) $(m).setAttribute('aria-pressed',String(m===metric));
  $('caseTitle').textContent=`DJF · ${c.label}`;
  $('caseSummary').textContent=result?result.text:'Não representado nesta síntese: nenhum efeito é desenhado para esta variável.';
  $('result').replaceChildren();
  const value=document.createElement('p'); value.className=result?'value':'muted';
  value.textContent=result?`${metric==='extremes'?'Frequência de extremos':'Chuva média'} · ${result.region}`:'Sem resultado selecionado para esta variável';
  $('result').appendChild(value);
  const description=document.createElement('p');
  description.textContent=result?result.text:'A evidência de outra variável não foi transferida automaticamente para esta.';
  $('result').appendChild(description);
  $('sstBand').className='band'+(c.enso==='el-nino'?' warm':c.enso==='la-nina'?' cold':'');
  $('sstText').textContent=c.enso==='el-nino'?'El Niño · anomalias quentes no Pacífico equatorial central/leste':c.enso==='la-nina'?'La Niña · anomalias frias no Pacífico equatorial central/leste':'ENOS neutro · sem padrão forte de El Niño ou La Niña; não significa anomalia local zero.';
  $('phaseInfo').textContent=`Fase ${c.phase} · ${c.phase===3?'Oceano Índico':c.phase===4?'Continente Marítimo':'Hemisfério Ocidental e África'} — localização ampla de referência, não um mapa composto de convecção.`;
  $('psaCard').hidden=!c.psa;
  $('psaText').textContent=c.psa||'';
  drawMap(result);
}
for(const c of DOCUMENTED_CASES) {
  const b=document.createElement('button'); b.dataset.case=c.id; b.textContent=c.label;
  b.addEventListener('click',()=>{selectedCase=c;metric=c.extremes?'extremes':'mean';update();});
  $('cases').appendChild(b);
}
for(const m of ['mean','extremes']) $(m).addEventListener('click',()=>{metric=m;update();});
$('legendButton').addEventListener('click',()=>{
  $('legend').hidden=!$('legend').hidden;
  $('legendButton').setAttribute('aria-expanded',String(!$('legend').hidden));
  $('legendButton').textContent=$('legend').hidden?'Mostrar legenda':'Ocultar legenda';
});
update();
