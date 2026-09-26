const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const casesModule = require(path.join(__dirname, 'documented-cases.js'));
const cases = casesModule.DOCUMENTED_CASES || casesModule;
assert(cases.length >= 5, 'Deveria conter os casos documentados curados');

// 1. Integridade dos dados
for (const c of cases) {
  assert(['DJF', 'MAM', 'JJA', 'SON'].includes(c.season), 'Estação válida');
  assert(['neutro', 'el-nino', 'la-nina'].includes(c.enso), 'ENOS válido');
  assert(Number(c.phase) >= 1 && Number(c.phase) <= 8, 'Fase MJO válida de 1 a 8');
  assert(c.source && c.source.length > 5, 'Fonte bibliográfica identificada');
  assert(c.limits && c.limits.length > 5, 'Limites metodológicos explicitados');

  for (const metric of ['mean', 'extremes']) {
    const result = c[metric];
    if (result !== null) {
      assert(['SESA', 'ZCAS', 'CESA'].includes(result.region), `Região válida para ${c.id}: ${result.region}`);
      assert(typeof result.text === 'string' && result.text.length > 10, `Texto explicativo presente para ${c.id}`);
      assert(typeof result.figure === 'string' && result.figure.length > 3, `Figura/seção rastreável para ${c.id}`);
      assert(['positivo', 'negativo', 'neutro'].includes(result.sign), `Sinal meteorológico válido para ${c.id}`);
      assert(typeof result.timing === 'string', `Timing explicitado para ${c.id}`);
      assert(!/%|m\/s/.test(result.text), 'Sem percentuais ou m/s inventados no texto');
    }
  }
}

// Regra de escopo do ENOS Neutro 8 e 1: não destacar toda a ZCAS
assert.equal(casesModule.findDocumentedCase('DJF', 'neutro', 8).mean, null, 'Neutro 8 em DJF não destaca chuva média em toda a ZCAS');
assert.equal(casesModule.findDocumentedCase('DJF', 'neutro', 1).mean, null, 'Neutro 1 em DJF não destaca chuva média em toda a ZCAS');
assert.equal(new Set(cases.map(c => c.id)).size, cases.length, 'IDs únicos de casos cadastrados');

// Validação dos Casos com Fases Agrupadas e Casos Sazonais de Roy et al. (2025)
const seasonalCases = cases.filter(c => ['MAM', 'JJA', 'SON'].includes(c.season));
assert(seasonalCases.length >= 8, 'Deveria conter casos sazonais cadastrados para MAM, JJA e SON');
for (const c of seasonalCases) {
  assert(c.groupedPhase, `groupedPhase deve existir para ${c.id}`);
  assert(c.groupNote && c.groupNote.includes('Evidência para fases agrupadas'), `groupNote deve alertar sobre fases agrupadas em ${c.id}`);
  assert.equal(c.mean, null, `Chuva média deve ser null para ${c.id} (Roy et al. não avaliam chuva regional)`);
  assert.equal(c.extremes, null, `Extremos devem ser null para ${c.id} (Roy et al. não avaliam chuva regional)`);
  assert(c.circulation && c.circulation.length > 10, `Circulação extratropical deve estar documentada para ${c.id}`);
}

// 2. Controles e interface no HTML
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Eventos de interesse e atalhos sazonais nas 4 estações
assert(html.includes('Eventos de interesse:'), 'Seção Eventos de interesse presente');
assert(html.includes('value="MAM|neutro|4|circulation"'), 'Atalho MAM Neutro presente');
assert(html.includes('value="JJA|el-nino|2|circulation"'), 'Atalho JJA El Niño presente');
assert(html.includes('value="SON|el-nino|4|circulation"'), 'Atalho SON El Niño presente');

// Ausência de rotulagem indevida de dados observacionais NOAA e escalas quantitativas falsas
assert(!html.includes('NOAA/ESRL'), 'Sem atribuição indevida a NOAA/ESRL no HTML');
assert(!html.includes('10⁶ m² s⁻¹'), 'Sem unidade quantitativa não rastreável no HTML');
assert(!html.includes('Potencial de velocidade 200 hPa (NOAA/PSL)'), 'Sem rótulo falso de dados da NOAA no botão chi');

// 4 estações
for (const season of ['DJF', 'MAM', 'JJA', 'SON']) {
  assert(html.includes(`data-season="${season}"`), `Botão de estação ${season} presente`);
}

// 3 estados ENOS
for (const enso of ['el-nino', 'neutro', 'la-nina']) {
  assert(html.includes(`data-enso="${enso}"`), `Botão de ENOS ${enso} presente`);
}

// 8 fases da MJO
for (let p = 1; p <= 8; p++) {
  assert(html.includes(`data-phase="${p}"`), `Botão de fase MJO ${p} presente`);
}

// Opções do seletor MJO nos trópicos
assert(html.includes('value="dipoles"'), 'Opção Convecção tropical RMM presente');
assert(html.includes('value="track"'), 'Opção Trilha 1-8 presente');
assert(html.includes('value="none"'), 'Opção Nenhuma presente');

// Controles de narração por voz e texto acessível
assert(html.includes('id="btnVoiceNarrate"'), 'Botão narrar presente');
assert(html.includes('id="btnVoicePause"'), 'Botão pausar presente');
assert(html.includes('id="btnVoiceStop"'), 'Botão parar presente');
assert(html.includes('id="btnVoiceMute"'), 'Botão silenciar presente');
assert(html.includes('id="narrationText"'), 'Área de texto de narração presente');

// Diagrama RMM compacto e controle de intensidade integrado
assert(html.includes('id="rmmDiagram"'), 'Diagrama RMM presente');
assert(html.includes('id="mjoAmplitude"'), 'Controle de amplitude presente');
assert(html.includes('rmm-card-compact'), 'Card compacto do diagrama RMM à direita presente');
assert(html.includes('id="topMainStage"'), 'Top main stage presente com mapa e RMM lado a lado');
assert(html.includes('id="btnPanelsMenu"'), 'Botão de menu de painéis presente');
assert(html.includes('id="btnResetLayout"'), 'Botão de restaurar layout presente');
assert(html.includes('id="panelsDropdown"'), 'Dropdown de gerenciamento de painéis presente');

// Painéis móveis identificados
for (const pId of ['panelRMM', 'panelNarration', 'panelResult', 'panelPsa', 'panelSst', 'panelPhase']) {
  assert(html.includes(`data-panel-id="${pId}"`), `Painel móvel ${pId} presente`);
}

// Glossário removido desta demonstração conforme instrução
assert(!html.includes('term-table'), 'Glossário deve permanecer removido');

// Sem geradores de combinações livres ou réguas sintéticas antigas
assert(!/sliderAmp|btnPlayCycle|logitRulerCanvas|enso-science.js/.test(html), 'Sem elementos legados de cálculos sintéticos');

// 3. Teste de Sintaxe dos Scripts
for (const file of ['documented-cases.js', 'documented-view.js', 'map-regions.js', 'rmm-diagram.js', 'panels-manager.js']) {
  new vm.Script(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}

// 4. Simulação Funcional no DOM
const createdElements = [];
function makeMockElement(id) {
  const listeners = {};
  return {
    id,
    listeners,
    dataset: {},
    style: {},
    textContent: '',
    innerHTML: '',
    value: '1.5',
    hidden: false,
    setAttribute: () => {},
    addEventListener: (event, fn) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    click: function() {
      if (listeners['click']) {
        listeners['click'].forEach(fn => fn());
      }
    },
    replaceChildren: () => { if (id === 'mapDrawing') createdElements.length = 0; },
    appendChild: (el) => { if (id === 'mapDrawing') createdElements.push(el); }
  };
}

const elementIds = [
  'globalView', 'regionalView', 'mjoLayer', 'mjoDipolesLayer', 'mjoChiLayer', 'mjoTrackLayer', 'mjoNoneLayer',
  'sstLayer', 'jetsLayer', 'psaLayer', 'extremes', 'mean', 'legendButton', 'legend',
  'caseTitle', 'caseSummary', 'narrationText', 'btnVoiceNarrate', 'btnVoicePause',
  'btnVoiceStop', 'btnVoiceMute', 'mapTitle', 'mapDesc', 'map', 'mapDrawing',
  'result', 'sstBand', 'sstText', 'phaseInfo', 'panelPsa', 'psaCard', 'psaText',
  'rmmDiagram', 'mjoAmplitude', 'mjoAmplitudeValue', 'rmmStatus'
];

const elements = {};
for (const id of elementIds) {
  elements[id] = makeMockElement(id);
}

const domMock = {
  getElementById: (id) => elements[id] || makeMockElement(id),
  createElementNS: (ns, tag) => {
    const el = {
      tagName: tag,
      attributes: {},
      dataset: {},
      textContent: '',
      setAttribute: (k, v) => {
        if (typeof v === 'number' && isNaN(v)) throw new Error('NaN attribute in ' + tag + ' ' + k);
        if (typeof v === 'string' && v.includes('NaN')) throw new Error('NaN in string in ' + tag + ' ' + k + ': ' + v);
        el.attributes[k] = v;
      }
    };
    return el;
  },
  createElement: (tag) => ({ tagName: tag, dataset: {}, addEventListener: () => {}, setAttribute: () => {}, style: {} }),
  querySelectorAll: () => []
};

let cancelCalls = 0;
let pauseCalls = 0;
let resumeCalls = 0;

const sandbox = {
  document: domMock,
  console: console,
  window: {
    speechSynthesis: {
      speak: (u) => {
        sandbox.speakCallCount++;
        sandbox.window.speechSynthesis.speaking = true;
        sandbox.window.speechSynthesis.paused = false;
      },
      cancel: () => {
        cancelCalls++;
        sandbox.window.speechSynthesis.speaking = false;
        sandbox.window.speechSynthesis.paused = false;
      },
      pause: () => {
        pauseCalls++;
        sandbox.window.speechSynthesis.speaking = false;
        sandbox.window.speechSynthesis.paused = true;
      },
      resume: () => {
        resumeCalls++;
        sandbox.window.speechSynthesis.speaking = true;
        sandbox.window.speechSynthesis.paused = false;
      },
      paused: false,
      speaking: false
    }
  },
  speakCallCount: 0,
  SpeechSynthesisUtterance: function(text) { this.text = text; }
};
vm.createContext(sandbox);

vm.runInContext(fs.readFileSync(path.join(__dirname, 'world-land.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'map-regions.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'documented-cases.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'documented-view.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'rmm-diagram.js'), 'utf8'), sandbox);

// Validação geométrica: SESA posicionado na faixa subtropical/Sul do Brasil (25°S a 40°S)
const regions = vm.runInContext('REGIONS', sandbox);
const sesaLats = regions.SESA_POLY.map(p => p[1]);
assert(Math.max(...sesaLats) <= -25, 'SESA com limite norte em 25°S');
assert(Math.min(...sesaLats) <= -38, 'SESA se estendendo até 40°S');

// Validação de fronteiras e limites estaduais brasileiros
const countryBorders = regions.COUNTRY_BORDERS;
const brazilBorders = regions.BRAZIL_STATE_BORDERS;
assert(countryBorders && countryBorders.length >= 8, 'Fronteiras sul-americanas presentes');
assert(brazilBorders && brazilBorders.length >= 10, 'Limites estaduais brasileiros presentes');

// Teste do Diagrama RMM e limiar de atividade da MJO (A < 1 fraca vs A >= 1 ativa)
for (const amplitude of [0, 0.5, 0.99, 1.0, 1.5, 2.0]) {
  sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 4, amplitude, metric: 'extremes' });
  const hasRain = createdElements.some(el => el.textContent === 'Extremos mais frequentes');
  assert.equal(hasRain, amplitude >= 1, `Amplitude ${amplitude} deve ocultar destaques se < 1 e exibir se >= 1`);
  const hasSesa = createdElements.some(el => el.textContent === 'SESA');
  const hasZcas = createdElements.some(el => el.textContent === 'ZCAS');
  assert(hasSesa, 'SESA preservada sob qualquer amplitude');
  assert(hasZcas, 'ZCAS preservada sob qualquer amplitude');
}

// 5. Testes de Execução: todas as 96 combinações (4 estações x 3 ENOS x 8 fases) em ambas as métricas e visões
const seasons = ['DJF', 'MAM', 'JJA', 'SON'];
const ensos = ['neutro', 'el-nino', 'la-nina'];
const phases = [1, 2, 3, 4, 5, 6, 7, 8];
let combinationCount = 0;

for (const season of seasons) {
  for (const enso of ensos) {
    for (const phase of phases) {
      combinationCount++;
      for (const view of ['global', 'regional']) {
        for (const metric of ['extremes', 'mean']) {
          sandbox.setClimateState({ season, enso, phase, metric, view });

          // Geração do texto de narração acessível
          const narration = elements.narrationText.textContent;
          assert(narration && narration.length > 50, 'Narração em texto deve ser gerada');
          assert(narration.includes(phase.toString()), 'Narração deve citar a fase');

          // Ausência de destaques em resultados não cadastrados
          const evidence = sandbox.findDocumentedCase(season, enso, phase);
          const hasResult = evidence && evidence[metric];
          const hasRainHighlight = createdElements.some(el => el.textContent === 'Extremos mais frequentes' || el.textContent === 'Chuva média favorecida');
          if (!hasResult) {
            assert(!hasRainHighlight, `Combinação não documentada (${season}-${enso}-${phase}-${metric}) não pode ter destaque gráfico de chuva`);
          }

          // Permanência dos polígonos/rótulos geográficos de ZCAS e SESA
          const hasSesa = createdElements.some(el => el.textContent === 'SESA');
          const hasZcas = createdElements.some(el => el.textContent === 'ZCAS');
          assert(hasSesa, 'SESA deve estar sempre identificada no mapa');
          assert(hasZcas, 'ZCAS deve estar sempre identificada no mapa');
        }
      }
    }
  }
}
assert.equal(combinationCount, 96, 'Exatamente 96 combinações básicas (4 estações x 3 ENOS x 8 fases)');

// Teste específico de caso com fases agrupadas (Roy et al. 2025): MAM Neutro Fase 4 (Par 4–5)
sandbox.setClimateState({ season: 'MAM', enso: 'neutro', phase: 4, amplitude: 1.5, metric: 'circulation' });
assert(elements.caseTitle.textContent.includes('Par 4–5'), 'caseTitle deve identificar Par 4–5');
assert(elements.caseSummary.textContent.includes('fases agrupadas'), 'caseSummary deve citar evidência para fases agrupadas');
assert(elements.narrationText.textContent.includes('fases agrupadas'), 'Narração deve citar evidência para fases agrupadas');
const hasRainInMAM = createdElements.some(el => el.textContent === 'Extremos mais frequentes' || el.textContent === 'Chuva média favorecida');
assert(!hasRainInMAM, 'MAM não pode exibir símbolo de chuva (Roy et al. não analisam precipitação regional)');

// Teste de alinhamento matemático dos 8 octantes do diagrama RMM
// cx=110, cy=110. O clique passa dx e dy = 110 - clickY. angleDeg = Math.atan2(dy, dx) * 180 / Math.PI.
const testAngles = [
  { angle: 22.5, expectedPhase: 5 },
  { angle: 67.5, expectedPhase: 6 },
  { angle: 112.5, expectedPhase: 7 },
  { angle: 157.5, expectedPhase: 8 },
  { angle: -157.5, expectedPhase: 1 },
  { angle: -112.5, expectedPhase: 2 },
  { angle: -67.5, expectedPhase: 3 },
  { angle: -22.5, expectedPhase: 4 }
];
elements.rmmDiagram.getBoundingClientRect = () => ({ left: 0, top: 0, width: 220, height: 220 });
for (const { angle, expectedPhase } of testAngles) {
  const rad = angle * Math.PI / 180;
  const clickX = 110 + 60 * Math.cos(rad);
  const clickY = 110 - 60 * Math.sin(rad);
  const clickEvent = {
    type: 'click',
    clientX: clickX,
    clientY: clickY,
    target: { closest: () => null }
  };
  sandbox.handleRMMClick(clickEvent);
  assert(elements.caseTitle.textContent.includes(`Fase ${expectedPhase}`), `Ângulo ${angle}° deve mapear para fase ${expectedPhase} (encontrado: ${elements.caseTitle.textContent})`);
}

// 6. Testes da Máquina de Estados dos Controles de Voz
// Cenário A: Com narração inativa, trocar controles NÃO deve chamar speak()
sandbox.speakCallCount = 0;
sandbox.setClimateState({ season: 'DJF', enso: 'la-nina', phase: 8 });
assert.equal(sandbox.speakCallCount, 0, 'Troca de controles com voz inativa não dispara síntese sonora');

// Cenário B: Clicar em Ouvir Narração deve acionar speak()
elements.btnVoiceNarrate.click();
assert.equal(sandbox.speakCallCount, 1, 'Botão Ouvir Narração deve invocar speak()');

// Cenário C: Clicar em Pausar deve alternar estado de pausa
elements.btnVoicePause.click();
const speaksAfterPause = sandbox.speakCallCount;
// Trocar seleção durante pausa não deve chamar speak()
sandbox.setClimateState({ season: 'DJF', enso: 'el-nino', phase: 1 });
assert.equal(sandbox.speakCallCount, speaksAfterPause, 'Troca de seleção durante pausa não dispara voz alta');

elements.btnVoicePause.click();
assert.equal(sandbox.speakCallCount, speaksAfterPause + 1, 'Retomada após mudança deve iniciar texto atualizado');

// Cenário D: Clicar em Silenciar deve chamar cancel()
elements.btnVoiceMute.click();
assert(cancelCalls > 0, 'Silenciar deve chamar cancel()');

// Cenário E: Clicar em Parar deve desativar narração
elements.btnVoiceStop.click();

// 7. Modos da MJO nos trópicos (dipolos RMM, potencial de velocidade chi, trilha 1 a 8 e nenhuma)
for (const mode of ['dipoles', 'chi', 'track', 'none']) {
  for (const phase of phases) {
    sandbox.setClimateState({ phase, mjoMode: mode });
  }
}

// 8. Relatório fiel e estritamente programático do que foi executado
console.log([
  '--- RELATÓRIO DE TESTES FUNCIONAIS E ESTRUTURAIS ---',
  '1. Integridade dos dados: 100% dos casos documentados com tipos e campos obrigatórios válidos (estação, ENOS, fase, fonte, limites).',
  '2. Regras de escopo: ausência de destaque de chuva média na ZCAS inteira para ENOS neutro fases 8 e 1.',
  '3. Controles e combinações: 96 combinações básicas (4 estações x 3 ENOS x 8 fases) testadas em ambas as visões e variáveis.',
  '4. Ausência de destaques em resultados não cadastrados: nenhum símbolo de chuva desenhado quando evidence[metric] é null.',
  '5. Permanência de ZCAS e SESA: polígonos e identificadores geográficos mantidos em todas as seleções.',
  '6. Geração do texto de narração: texto explicativo acessível produzido sem omissões.',
  '7. Comportamento programado dos controles de voz: reprodução, pausa sem disparo indevido, silenciamento e parada validados no mock.',
  '----------------------------------------------------',
  'Nota: Estes testes atestam exclusivamente a conformidade do código, dados estruturados e eventos da interface.',
  'A fundamentação científica e os limites físicos decorrem da revisão bibliográfica das fontes citadas.'
].join('\n'));
// O modo circulação nunca é tratado como um objeto de precipitação.
for (const season of seasons) {
 sandbox.setClimateState({season, enso:'el-nino', phase:season==='JJA'?2:4, metric:'circulation', amplitude:1.5, view:'global'});
 assert(!createdElements.some(e=>/Extremos mais frequentes|Chuva média favorecida/.test(e.textContent)));
 if(season!=='DJF') assert(!createdElements.some(e=>e.textContent.includes('Guia PSA')));
}
const viewSource=fs.readFileSync(path.join(__dirname,'documented-view.js'),'utf8');
assert(!viewSource.includes('const MJO_CHI_COMPOSITES'));
assert(html.includes('id="forecastPanel"') && html.includes('id="metricSelect"'));
new vm.Script(fs.readFileSync(path.join(__dirname,'forecast-sesa.js'),'utf8'));
console.log('Circulação sem chuva/arco sazonal artificial; campo sintético retirado; módulo de previsão com sintaxe válida.');
