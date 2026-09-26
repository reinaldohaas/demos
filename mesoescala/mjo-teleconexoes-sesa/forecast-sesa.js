// Boletim revisado manualmente. Fontes oficiais; sem geração de previsão pela fase MJO.
let forecastModeActive = false;
(() => {
  const panel = document.getElementById('forecastPanel');
  const sourceRain = 'https://www.cpc.ncep.noaa.gov/products/Global_Monsoons/American_Monsoons/gfs_model.shtml';
  const sourceCfs = 'https://www.cpc.ncep.noaa.gov/products/CFSv2/weekly/';
  const mjoPdf = 'https://www.cpc.ncep.noaa.gov/products/precip/CWlink/MJO/mjoupdate.pdf';
  const periods = [
    {title:'Dias 1–7 · 25/09–01/10/2026', text:'Leitura qualitativa do mapa GFS de 25/09: sinal heterogêneo no SESA, com áreas de anomalia positiva no setor sul e oeste e áreas negativas mais ao norte. Não há um único sinal para toda a região.', source:sourceRain, images:['https://www.cpc.ncep.noaa.gov/products/Precip_Monitoring/Figures/GFS/SA_curr.p.gfs1b.gif'], caption:'Anomalia de precipitação em mm no período. GFS ensemble, emissão conferida: 25/09/2026. Referência CPC 1991–2020; correção de viés baseada nos últimos 30 dias. Resolução espacial não informada nesta página.'},
    {title:'Dias 8–14 · 02/10–08/10/2026', text:'Leitura qualitativa do mapa GFS de 25/09: anomalias positivas aparecem em parte do centro-sul do Brasil e em setores argentinos. O sinal não é uniforme em todo o SESA e não indica, por si, ocorrência de extremos.', source:sourceRain, images:['https://www.cpc.ncep.noaa.gov/products/Precip_Monitoring/Figures/GFS/SA_curr.p.gfs2b.gif'], caption:'Anomalia em mm acumulados no período. Mesma emissão e referência da primeira semana; não é probabilidade.'},
    {title:'Dias 15–21 · 09/10–15/10/2026', text:'CFSv2 disponível para esta janela. Consultar o painel superior do mapa oficial abaixo. Não foi calculada uma média do SESA nem uma probabilidade regional a partir das cores. É orientação de um modelo, sem avaliação de habilidade regional nesta demonstração.', source:sourceCfs, images:['https://www.cpc.ncep.noaa.gov/products/CFSv2/weekly/images/wk3.wk4_20260924.png'], caption:'Painel superior: semana 3. Média de 16 membros, inicialização 24/09/2026. Anomalia da taxa de precipitação em mm/dia; climatologia do modelo dependente do prazo, hindcasts 1999–2010, sem ajuste. Não comparar a escala diretamente com os mm acumulados do GFS.'},
    {title:'Dias 22–30 · 16/10–24/10/2026', text:'O painel inferior do CFSv2 cobre 16–22/10. Dias 23 e 24/10: sem cobertura neste produto. Não prolongamos o campo da semana 4 nem atribuímos um sinal aos dois dias restantes.', source:sourceCfs, images:['https://www.cpc.ncep.noaa.gov/products/CFSv2/weekly/images/wk3.wk4_20260924.png'], caption:'Painel inferior: semana 4, até 22/10. Mesma inicialização, unidade e climatologia da semana 3. Cobertura parcial da janela de 30 dias.'}
  ];
  let selected = 0, currentSpeech = '', voiceEnabled = false;
  panel.innerHTML = `<h2>Situação atual e próximos 30 dias — SESA</h2>
    <p><strong>Boletim consultado em 25/09/2026 · horizonte 25/09–24/10/2026</strong></p>
    <p id="forecastAge" role="status"></p>
    <p>ENOS: El Niño em fortalecimento no diagnóstico CPC de 10/09/2026. <a href="https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml" target="_blank" rel="noopener">Diagnóstico e TSM</a>.</p>
    <p>MJO: o boletim de 21/09 descreve sinal pouco definido no hemisfério ocidental, em fase 8, sob forte influência do ENOS. GEFS e ECMWF divergem quanto à evolução posterior no Índico. Não foi extraída amplitude numérica da figura. <a href="${mjoPdf}" target="_blank" rel="noopener">Boletim CPC — conferir a emissão</a>.</p>
    <div id="forecastPeriods" style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0"></div>
    <h3 id="forecastTitle"></h3><p id="forecastText"></p>
    <p><strong>Limite da interpretação:</strong> os campos abaixo são previsões de precipitação dos modelos. As associações MJO/ENOS da área didática não foram convertidas em previsão regional. Não há estimativa de granizo, tornado ou probabilidade de extremos.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button id="forecastSpeak">Ouvir esta janela</button><button id="forecastPause">Pausar</button><button id="forecastStop">Parar / silêncio</button></div>
    <figure style="margin:18px 0"><div id="forecastImages"></div><figcaption id="forecastCaption"></figcaption></figure>
    <p><a id="forecastSource" target="_blank" rel="noopener">Abrir produto e documentação no CPC</a></p>
    <details><summary>RMM observado e previsto · produto original GEFS</summary>
      <p>O produto original distingue observações, membros e média do conjunto. Horizonte informado pelo CPC: 15 dias, não 30. A data válida está na figura; ela pode ser mais recente que este boletim.</p>
      <img src="https://www.cpc.ncep.noaa.gov/products/precip/mjo/img/GEFS_BC.png" alt="Diagrama oficial GEFS de observação e previsão da MJO; conferir data e legenda na própria imagem" style="max-width:100%;background:white" loading="lazy">
      <p><a href="https://www.cpc.ncep.noaa.gov/products/precip/CWlink/MJO/foregfs.shtml" target="_blank" rel="noopener">Fonte e interpretação do conjunto GEFS</a></p>
    </details>
    <p class="muted">Imagens hospedadas pelo CPC. GFS e RMM são produtos móveis e podem mudar; suas datas prevalecem sobre a síntese datada acima. O CFSv2 está vinculado à emissão de 24/09. Falha na imagem não significa ausência de chuva. Não há atualização automática deste boletim nem fusão calibrada entre modelos.</p>`;
  const age = Math.floor((Date.now()-Date.UTC(2026,8,25))/86400000);
  document.getElementById('forecastAge').textContent = age > 3 ? 'Atenção: síntese datada, com mais de três dias. Consulte novas emissões nas fontes; não usar como diagnóstico de hoje.' : 'Síntese datada: confira a emissão e a validade de cada produto antes de usar.';
  function stop() { voiceEnabled=false; if(window.speechSynthesis) window.speechSynthesis.cancel(); document.getElementById('forecastPause').textContent='Pausar'; }
  function speak() {
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); window.speechSynthesis.resume();
    const u = new SpeechSynthesisUtterance(currentSpeech); u.lang='pt-BR';
    if(typeof portugueseVoice !== 'undefined' && portugueseVoice) u.voice=portugueseVoice;
    window.speechSynthesis.speak(u);
  }
  function render(i) {
    selected=i; const p=periods[i];
    document.getElementById('forecastTitle').textContent=p.title;
    document.getElementById('forecastText').textContent=p.text;
    document.getElementById('forecastCaption').textContent=p.caption;
    document.getElementById('forecastSource').href=p.source;
    const images=document.getElementById('forecastImages'); images.replaceChildren();
    p.images.forEach(url=>{ const img=document.createElement('img'); img.src=url; img.alt=p.title+' — mapa original do CPC, com datas e legenda'; img.style.cssText='display:block;max-width:100%;max-height:850px;background:white;margin:10px auto'; img.onerror=()=>{img.replaceWith(document.createTextNode('Imagem indisponível. Abra a fonte oficial pelo link abaixo.'));}; images.appendChild(img); });
    [...document.getElementById('forecastPeriods').children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
    currentSpeech='Boletim de 25 de setembro de 2026. '+p.title+'. '+p.text+' '+p.caption;
    if(voiceEnabled) { stop(); document.getElementById('forecastText').textContent += ' Narração interrompida após troca de janela; pressione Ouvir para a nova seleção.'; }
  }
  periods.forEach((p,i)=>{const b=document.createElement('button'); b.textContent=p.title; b.addEventListener('click',()=>render(i)); document.getElementById('forecastPeriods').appendChild(b);});
  document.getElementById('forecastSpeak').onclick=()=>{voiceEnabled=true;speak();};
  document.getElementById('forecastPause').onclick=()=>{if(!window.speechSynthesis)return; if(window.speechSynthesis.paused){window.speechSynthesis.resume();document.getElementById('forecastPause').textContent='Pausar';}else if(window.speechSynthesis.speaking){window.speechSynthesis.pause();document.getElementById('forecastPause').textContent='Retomar';}};
  document.getElementById('forecastStop').onclick=stop;
  function setMode(active) {
    stop(); document.getElementById('btnVoiceStop').click();
    forecastModeActive=active; panel.hidden=!active;
    document.getElementById('explorationContent').hidden=active;
    document.getElementById('forecastMode').setAttribute('aria-pressed',String(active));
    document.getElementById('exploreMode').setAttribute('aria-pressed',String(!active));
    document.getElementById('modeNotice').textContent=active?'Produtos oficiais e síntese datada; independente dos controles didáticos.':'Modo didático: seleções manuais, não observações.';
  }
  document.getElementById('forecastMode').onclick=()=>setMode(true);
  document.getElementById('exploreMode').onclick=()=>setMode(false);
  render(0);
})();
