const $ = id => document.getElementById(id);
let selectedCase = DOCUMENTED_CASES[0];
let metric = 'extremes';
let mapView = 'global';
const visibleLayers = {mjo:true,sst:true};
const ns = 'http://www.w3.org/2000/svg';
function svg(tag, attributes, text) {
  const el=document.createElementNS(ns,tag);
  for(const [k,v] of Object.entries(attributes)) el.setAttribute(k,v);
  if(text !== undefined) el.textContent=text;
  $('mapDrawing').appendChild(el);
  return el;
}
function project(lon,lat) {
  if(mapView==='regional') return [60+(lon+85)*8,35+(15-lat)*6.4];
  const wrapped=((lon-20)%360+360)%360;
  return [wrapped*1200/360,(85-lat)*560/160];
}
function drawLand() {
  for(const feature of WORLD_LAND.features) {
    const polygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];
    for(const rings of polygons) {
      const ring=rings[0];
      if(mapView==='regional') {polygon(ring,'#18364a','#517087');continue;}
      let previous=null;
      const continuous=ring.map(([lon,lat])=>{
        let x=((lon-20)%360+360)%360;
        if(previous!==null){while(x-previous>180)x-=360;while(x-previous< -180)x+=360;}
        previous=x;return [x,lat];
      });
      for(const shift of [-360,0,360]) svg('polygon',{points:continuous.map(([x,lat])=>`${(x+shift)*1200/360},${(85-lat)*560/160}`).join(' '),fill:'#18364a',stroke:'#517087','stroke-width':.7});
    }
  }
}
function drawGlobalContext() {
  if(mapView!=='global') return;
  if(visibleLayers.sst && selectedCase.enso!=='neutro') {
    const [x,y]=project(-135,0), warm=selectedCase.enso==='el-nino';
    svg('ellipse',{cx:x,cy:y,rx:120,ry:24,fill:warm?'#ef745f':'#458df0',opacity:.48});
    svg('text',{x,y:y+44,fill:warm?'#ffbaa7':'#a6cdff','font-size':14,'text-anchor':'middle'},warm?'El Niño · TSM +':'La Niña · TSM −');
  }
  drawLand();
  for(const [lon,lat,label] of [[80,-48,'ÍNDICO'],[-145,-48,'PACÍFICO'],[-30,-48,'ATLÂNTICO']]){
    const [x,y]=project(lon,lat);svg('text',{x,y,fill:'#668da7','font-size':15,'letter-spacing':3,'text-anchor':'middle'},label);
  }
  if(visibleLayers.mjo) {
    const lon=selectedCase.phase===3?90:selectedCase.phase===4?125:0;
    const [x,y]=project(lon,2);
    svg('ellipse',{cx:x,cy:y,rx:44,ry:24,fill:'#2dd4bf','fill-opacity':.14,stroke:'#5eead4','stroke-dasharray':'5 5'});
    svg('text',{x,y:y-35,fill:'#88efdf','font-size':15,'text-anchor':'middle'},`MJO · fase ${selectedCase.phase}`);
    svg('text',{x,y:y-17,fill:'#a5c0cb','font-size':11,'text-anchor':'middle'},'referência de fase');
  }
}
function polygon(points,fill,stroke) {
  svg('polygon',{points:points.map(p=>project(...p).join(',')).join(' '),fill,stroke,'stroke-width':1.5});
}
function drawMap(result) {
  $('mapDrawing').replaceChildren();
  $('map').setAttribute('viewBox',mapView==='global'?'0 0 1200 560':'0 0 640 520');
  for(const lat of [0,-20,-40,20,40]) {
    const y=project(-85,lat)[1];
    svg('line',{x1:0,y1:y,x2:mapView==='global'?1200:640,y2:y,stroke:'#20354b','stroke-dasharray':'4 6'});
  }
  if(mapView==='global') drawGlobalContext(); else drawLand();
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
  $('mapTitle').textContent=mapView==='global'?'Visão global: MJO, Pacífico e América do Sul':'América do Sul';
  $('mapDesc').textContent=result?`${result.region}: ${result.text} Símbolo regional sem magnitude ou extensão quantitativa.`:'Mapa de referência sem efeito desenhado para esta variável.';
}
function update() {
  const c=selectedCase, result=c[metric];
  $('globalView').setAttribute('aria-pressed',String(mapView==='global'));
  $('regionalView').setAttribute('aria-pressed',String(mapView==='regional'));
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

for(const [id,view] of [['globalView','global'],['regionalView','regional']]) $(id).addEventListener('click',()=>{mapView=view;update();});
for(const [id,layer] of [['mjoLayer','mjo'],['sstLayer','sst']]) $(id).addEventListener('click',()=>{visibleLayers[layer]=!visibleLayers[layer];$(id).setAttribute('aria-pressed',String(visibleLayers[layer]));update();});
