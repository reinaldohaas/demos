const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

// 1. Integridade da Base Curada (documented-cases.js)
const casesModule = require(path.join(__dirname, 'documented-cases.js'));
const cases = casesModule.DOCUMENTED_CASES || casesModule;
assert.equal(cases.length, 8, 'A base deve conter exatamente os 8 casos autorizados');

const expectedIds = [
  'DJF-la-nina-8',
  'DJF-el-nino-1',
  'DJF-alvarez-3-4',
  'DJF-alvarez-8-1',
  'MAM-alvarez-1',
  'JJA-alvarez-8',
  'SON-alvarez-7-8',
  'SON-alvarez-1'
];
assert.deepEqual(cases.map(c => c.id).sort(), expectedIds.sort(), 'Os IDs dos 8 casos devem corresponder exatamente aos autorizados');

for (const c of cases) {
  assert(['DJF', 'MAM', 'JJA', 'SON'].includes(c.season), `Estação válida para ${c.id}`);
  assert(['el-nino', 'la-nina', 'todos'].includes(c.enso), `ENOS válido para ${c.id}`);
  assert(Number(c.phase) >= 1 && Number(c.phase) <= 8, `Fase MJO válida para ${c.id}`);
  assert.equal(c.sign, 'positivo', `Somente casos com sinal aumentado ("mais") autorizados (${c.id})`);
  assert(typeof c.chance === 'string' && c.chance.length > 5, `Rótulo de chance presente para ${c.id}`);
  assert(typeof c.text === 'string' && c.text.length > 15, `Texto de síntese física presente para ${c.id}`);
  assert(typeof c.source === 'string' && c.source.length > 10, `Fonte identificada para ${c.id}`);

  // Verificar mecanismos
  if (c.id.includes('alvarez')) {
    assert(c.extratropical && ['C', 'A'].includes(c.extratropical.type), `Centro extratropical C ou A obrigatório para ${c.id}`);
    assert(Number.isFinite(c.extratropical.lat) && Number.isFinite(c.extratropical.lon), `Coordenadas extratropicais válidas para ${c.id}`);
  }
  if (c.id.includes('fernandes') || c.id.includes('DJF-la-nina') || c.id.includes('DJF-el-nino')) {
    assert(c.sourceMarker && Number.isFinite(c.sourceMarker.lat) && Number.isFinite(c.sourceMarker.lon), `Marcador qualitativo de fonte obrigatório para ${c.id}`);
  }
}

// 2. Ausência Total de "metric" nos Arquivos de Produção
const prodFiles = [
  'documented-cases.js',
  'documented-view.js',
  'index.html',
  'rmm-diagram.js',
  'map-regions.js'
];
for (const file of prodFiles) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  assert(!content.includes('metric'), `O arquivo ${file} NÃO deve conter nenhuma ocorrência de "metric"`);
}

// 3. Validação do HTML
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(!html.includes('id="metricSelect"'), 'metricSelect deve estar removido do HTML');
assert(html.includes('id="ensoGroup"'), 'ensoGroup deve existir para controle de visibilidade');
for (const id of expectedIds) {
  assert(html.includes(`value="${id}"`), `Opção do evento ${id} deve estar presente no HTML`);
}

// 4. Teste de Sintaxe dos Scripts
for (const file of ['documented-cases.js', 'documented-view.js', 'map-regions.js', 'rmm-diagram.js', 'panels-manager.js']) {
  new vm.Script(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}

// 5. Simulação Funcional no Sandbox (DOM Mock)
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
    options: [],
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
  'globalView', 'regionalView', 'mjoSelect',
  'sstLayer', 'jetsLayer', 'psaLayer', 'legendButton', 'legend',
  'caseTitle', 'caseSummary', 'narrationText', 'btnVoiceNarrate', 'btnVoicePause',
  'btnVoiceStop', 'btnVoiceMute', 'mapTitle', 'mapDesc', 'map', 'mapDrawing',
  'result', 'sstBand', 'sstText', 'phaseInfo', 'panelPsa', 'psaCard', 'psaText',
  'rmmDiagram', 'mjoAmplitude', 'mjoAmplitudeValue', 'rmmStatus', 'rmmStatusTag',
  'ensoGroup', 'seasonSelect', 'ensoSelect', 'phaseSelect', 'eventNotice',
  'eventsDJF', 'eventsMAM', 'eventsJJA', 'eventsSON',
  'btnPanelsMenu', 'btnResetLayout', 'panelsDropdown'
];

const elements = {};
for (const id of elementIds) {
  elements[id] = makeMockElement(id);
}

// Configurar opções nos selects de eventos do mock
for (const eid of ['eventsDJF', 'eventsMAM', 'eventsJJA', 'eventsSON']) {
  elements[eid].options = [
    { value: '' },
    ...expectedIds.map(id => ({ value: id }))
  ];
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
      },
      appendChild: () => {}
    };
    return el;
  },
  createElement: (tag) => ({ tagName: tag, dataset: {}, addEventListener: () => {}, setAttribute: () => {}, style: {}, appendChild: () => {}, replaceChildren: () => {} }),
  querySelectorAll: (selector) => {
    if (selector === '.event-select') return [elements.eventsDJF, elements.eventsMAM, elements.eventsJJA, elements.eventsSON];
    return [];
  }
};

const sandbox = {
  document: domMock,
  console: console,
  window: {
    speechSynthesis: {
      speak: () => { sandbox.speakCallCount++; },
      cancel: () => {},
      pause: () => {},
      resume: () => {},
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

// 6. Teste de Regressão Completo do Sandbox:
// 96 combinações (4 estações x 3 ENOS x 8 fases) x 4 modos MJO x 2 amplitudes {0.5, 1.5} x 2 visões {global, regional}
const seasons = ['DJF', 'MAM', 'JJA', 'SON'];
const ensos = ['neutro', 'el-nino', 'la-nina'];
const phases = [1, 2, 3, 4, 5, 6, 7, 8];
const mjoModes = ['none', 'chi', 'dipoles', 'track'];
const amplitudes = [0.5, 1.5];
const views = ['global', 'regional'];

let totalSandboxRuns = 0;
for (const season of seasons) {
  for (const enso of ensos) {
    for (const phase of phases) {
      for (const mjoMode of mjoModes) {
        for (const amplitude of amplitudes) {
          for (const view of views) {
            totalSandboxRuns++;
            sandbox.setClimateState({ season, enso, phase, amplitude, view, mjoMode });

            // Verificar narração gerada
            const narration = elements.narrationText.textContent;
            assert(narration && narration.length > 20, 'Narração deve ser gerada');

            // Verificar amplitude < 1 oculta destaques
            if (amplitude < 1) {
              const hasWaveTrain = createdElements.some(el => el.textContent && el.textContent.includes('trem de ondas'));
              assert(!hasWaveTrain, `Com amplitude < 1 não pode desenhar trem de ondas (${season}-${enso}-${phase})`);
              const hasChiBox = createdElements.some(el => el.textContent && el.textContent.includes('χ₂₀₀'));
              assert(!hasChiBox, `Com amplitude < 1 não pode desenhar destaque de χ₂₀₀ (${season}-${enso}-${phase})`);
            }
          }
        }
      }
    }
  }
}
assert.equal(totalSandboxRuns, 4 * 3 * 8 * 4 * 2 * 2, 'Exatamente 1536 configurações testadas sem exceções');

// 7. Teste de Modo Evento e Ocultação do ENOS
// Caso Alvarez (DJF 3-4): ensoGroup deve sumir
sandbox.selectEvent('DJF-alvarez-3-4');
assert.equal(elements.ensoGroup.style.display, 'none', 'Caso Alvarez em modo evento oculta seletor ENOS');
assert(elements.caseTitle.textContent.includes('Todos os anos'), 'Título deve indicar composição de todos os anos no caso Alvarez');

// Mudança manual pelo usuário deve sair do modo evento e restaurar ensoGroup
sandbox.setClimateState({ phase: 2 }, true); // fromUser = true
assert.equal(elements.ensoGroup.style.display, '', 'Mudança manual pelo usuário restaura seletor ENOS');

// Caso Fernandes & Grimm (DJF La Niña 8): ensoGroup visível
sandbox.selectEvent('DJF-la-nina-8');
assert.equal(elements.ensoGroup.style.display, '', 'Caso Fernandes & Grimm mantém seletor ENOS visível');
assert(elements.caseTitle.textContent.includes('La Niña'), 'Título deve indicar La Niña');

// 8. Teste do SALLJ Direcional em DJF
// Prata (DJF 3 ou 4) -> SALLJ para o sul (Bacia do Prata)
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 3, amplitude: 1.5 });
const salljLegend = createdElements.some(el => el.textContent && el.textContent.includes('alternância ZCAS × Prata (Nogués-Paegle & Mo 1997)'));
assert(salljLegend, 'SALLJ deve incluir a legenda de alternância ZCAS x Prata');
const pathPrata = createdElements.find(el => el.attributes && el.attributes.stroke === '#34d399');
assert(pathPrata && pathPrata.attributes.d, 'Caminho do SALLJ deve existir para fase 3');

// ZCAS (DJF 8 ou 1) -> SALLJ curvando para leste/nordeste (ZCAS)
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 8, amplitude: 1.5 });
const pathZcas = createdElements.find(el => el.attributes && el.attributes.stroke === '#34d399');
assert(pathZcas && pathZcas.attributes.d, 'Caminho do SALLJ deve existir para fase 8');
assert.notEqual(pathPrata.attributes.d, pathZcas.attributes.d, 'Traçado do SALLJ na Bacia do Prata (fase 3) deve ser diferente do traçado na ZCAS (fase 8)');

// Neutro (DJF 6)
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 6, amplitude: 1.5 });
const pathNeutro = createdElements.find(el => el.attributes && el.attributes.stroke === '#34d399');
assert(pathNeutro && pathNeutro.attributes.d, 'Caminho do SALLJ deve existir para fase neutra');
assert.notEqual(pathNeutro.attributes.d, pathPrata.attributes.d, 'Traçado neutro deve ser diferente do traçado Prata');
assert.notEqual(pathNeutro.attributes.d, pathZcas.attributes.d, 'Traçado neutro deve ser diferente do traçado ZCAS');

// 9. Teste de χ200 Único (G. Deemer) e Losangos (Zero Elipses)
const expectedChiCenters = {
  1: { div: [10, 2],    conv: [145, 1] },
  2: { div: [65, -1],   conv: [-170, 0] },
  3: { div: [75, -1],   conv: [-110, -4] },
  4: { div: [115, 2],   conv: [-60, 2] },
  5: { div: [135, 1],   conv: [-70, 0] },
  6: { div: [-130, -3], conv: [55, -3] },
  7: { div: [-115, -3], conv: [80, -1] },
  8: { div: [-65, -3],  conv: [135, 0] }
};
const docViewCode = fs.readFileSync(path.join(__dirname, 'documented-view.js'), 'utf8');
assert(!docViewCode.includes('MJO_CHI_REF'), 'MJO_CHI_REF não deve mais existir no código');
assert(docViewCode.includes('MJO_CHI_CENTERS'), 'MJO_CHI_CENTERS deve estar definido');
assert(docViewCode.includes('G. Deemer'), 'Crédito a G. Deemer deve constar na legenda');

// Testar desenho de χ200 em modo chi: losangos e zero elipses
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 1, amplitude: 1.5, mjoMode: 'chi', view: 'global' });
const chiPolygons = createdElements.filter(el => el.tagName === 'polygon');
assert(chiPolygons.length >= 6, 'Devem ser gerados pelo menos 6 polígonos (losangos: outer, mid, core para div e conv)');

// Chamar drawMjoVelocityPotential isoladamente para confirmar que não cria nenhuma elipse
createdElements.length = 0;
sandbox.drawMjoVelocityPotential();
const chiEllipses = createdElements.filter(el => el.tagName === 'ellipse');
assert.equal(chiEllipses.length, 0, 'drawMjoVelocityPotential não deve conter nenhuma tag ellipse');

// 10. Teste do Evento Alvarez: TSM ocultada e faixa neutra
sandbox.selectEvent('DJF-alvarez-3-4');
const sstEllipseInAlvarez = createdElements.some(el => el.tagName === 'ellipse' && el.attributes && el.attributes.fill && (el.attributes.fill.includes('239') || el.attributes.fill.includes('37')));
assert(!sstEllipseInAlvarez, 'No evento Alvarez não deve desenhar elipse de TSM');
assert(elements.sstText.textContent.includes('Composição de todos os anos'), 'Texto da TSM deve indicar composição de todos os anos no evento Alvarez');
assert(!elements.sstBand.className.includes('warm') && !elements.sstBand.className.includes('cold'), 'sstBand não deve ter classe warm ou cold no evento Alvarez');

// 11. Teste da Narrativa do SALLJ para ZCAS
sandbox.setClimateState({ season: 'DJF', enso: 'la-nina', phase: 8, amplitude: 1.5 });
const narZcas = elements.narrationText.textContent;
assert(narZcas.includes('curva para leste/nordeste, em direção ao setor ZCAS (Nogués-Paegle & Mo 1997).'), 'Narrativa deve usar a frase solicitada para o SALLJ ZCAS');
assert(!narZcas.includes('reforçando a convergência de umidade sobre o Sudeste'), 'Narrativa NÃO deve conter "reforçando a convergência de umidade sobre o Sudeste"');

console.log('====================================================');
console.log('TODAS AS VALIDAÇÕES AUTOMATIZADAS PASSARAM COM SUCESSO:');
console.log('1. 8 casos documentados autorizados (só mais, só mecanismo físico).');
console.log('2. ZERO ocorrências de "metric" nos arquivos de produção.');
console.log('3. Seletor de ENOS oculto em eventos Alvarez e restaurado na interação manual.');
console.log('4. SALLJ direcional validado (Prata vs ZCAS vs neutro) e narrativa corrigida.');
console.log('5. χ200 Deemer com tabela única e losangos (zero elipses).');
console.log('6. Evento Alvarez sem elipse de TSM e rótulo "composição de todos os anos".');
console.log('7. 1536 configurações de sandbox executadas sem erros.');
console.log('====================================================');

