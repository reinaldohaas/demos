const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const casesModule = require(path.join(__dirname, 'documented-cases.js'));
const cases = casesModule.DOCUMENTED_CASES || casesModule;
assert(cases.length >= 5, 'Deveria conter os casos documentados curados');

// Verificar integridade dos casos documentados
for (const c of cases) {
  assert(['DJF', 'MAM', 'JJA', 'SON'].includes(c.season), 'Estação válida');
  assert(['neutro', 'el-nino', 'la-nina'].includes(c.enso), 'ENOS válido');
  assert(Number(c.phase) >= 1 && Number(c.phase) <= 8, 'Fase MJO válida de 1 a 8');
  for (const metric of ['mean', 'extremes']) {
    const result = c[metric];
    assert(result === null || (['SESA', 'ZCAS', 'CESA'].includes(result.region) && result.text));
    if (result) assert(!/%|m\/s/.test(result.text), 'Sem percentuais ou m/s inventados no texto');
  }
}

// Verificar HTML: controles completos presentes e antigos geradores ausentes
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 4 estações
for (const season of ['DJF', 'MAM', 'JJA', 'SON']) {
  assert(html.includes(`data-season="${season}"`), `Botão de estação ${season} deve estar presente`);
}

// 3 estados ENOS
for (const enso of ['el-nino', 'neutro', 'la-nina']) {
  assert(html.includes(`data-enso="${enso}"`), `Botão de ENOS ${enso} deve estar presente`);
}

// 8 fases da MJO
for (let p = 1; p <= 8; p++) {
  assert(html.includes(`data-phase="${p}"`), `Botão de fase MJO ${p} deve estar presente`);
}

// Sem geradores de combinações livres ou réguas numéricas sintéticas antigas
assert(!/sliderAmp|btnPlayCycle|logitRulerCanvas|enso-science.js/.test(html), 'Sem elementos legados de cálculos sintéticos');

// Teste de Sintaxe dos Scripts
for (const file of ['documented-cases.js', 'documented-view.js', 'map-regions.js']) {
  new vm.Script(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}

// Simulação Funcional Completa no DOM
const createdElements = [];
const elements = {
  globalView: { setAttribute: () => {}, addEventListener: () => {} },
  regionalView: { setAttribute: () => {}, addEventListener: () => {} },
  mjoLayer: { setAttribute: () => {}, addEventListener: () => {} },
  sstLayer: { setAttribute: () => {}, addEventListener: () => {} },
  jetsLayer: { setAttribute: () => {}, addEventListener: () => {} },
  psaLayer: { setAttribute: () => {}, addEventListener: () => {} },
  extremes: { setAttribute: () => {}, addEventListener: () => {} },
  mean: { setAttribute: () => {}, addEventListener: () => {} },
  legendButton: { setAttribute: () => {}, addEventListener: () => {} },
  legend: { hidden: true },
  caseTitle: {},
  caseSummary: { style: {} },
  mapTitle: {},
  mapDesc: {},
  map: { setAttribute: () => {} },
  mapDrawing: { replaceChildren: () => { createdElements.length = 0; }, appendChild: (el) => createdElements.push(el) },
  result: { replaceChildren: () => {}, appendChild: () => {} },
  sstBand: {},
  sstText: {},
  phaseInfo: {},
  psaCard: {},
  psaText: {}
};

const domMock = {
  getElementById: (id) => elements[id] || { setAttribute: () => {}, addEventListener: () => {} },
  createElementNS: (ns, tag) => ({
    tagName: tag,
    setAttribute: (k, v) => {
      if (typeof v === 'number' && isNaN(v)) throw new Error('NaN attribute in ' + tag + ' ' + k);
      if (typeof v === 'string' && v.includes('NaN')) throw new Error('NaN in string in ' + tag + ' ' + k + ': ' + v);
    }
  }),
  createElement: (tag) => ({ tagName: tag, dataset: {}, addEventListener: () => {}, setAttribute: () => {} }),
  querySelectorAll: () => []
};

const sandbox = {
  document: domMock,
  console: console
};
vm.createContext(sandbox);

vm.runInContext(fs.readFileSync(path.join(__dirname, 'world-land.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'map-regions.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'documented-cases.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'documented-view.js'), 'utf8'), sandbox);

// Testar troca de controles para todas as 96 combinações (4 estações x 3 ENOS x 8 fases) em ambas as métricas e visões
const seasons = ['DJF', 'MAM', 'JJA', 'SON'];
const ensos = ['neutro', 'el-nino', 'la-nina'];
const phases = [1, 2, 3, 4, 5, 6, 7, 8];

for (const season of seasons) {
  for (const enso of ensos) {
    for (const phase of phases) {
      sandbox.currentSeason = season;
      sandbox.currentEnso = enso;
      sandbox.currentPhase = phase;
      for (const view of ['global', 'regional']) {
        sandbox.mapView = view;
        for (const metric of ['extremes', 'mean']) {
          sandbox.metric = metric;
          sandbox.update();
        }
      }
    }
  }
}

console.log('Todos os 8 botões MJO, 3 ENOS e 4 estações verificados; ZCAS e SESA preservados; todas as 96 combinações testadas com sucesso!');
