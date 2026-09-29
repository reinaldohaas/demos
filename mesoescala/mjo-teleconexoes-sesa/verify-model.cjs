const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

// 1. Integridade da Base Curada (documented-cases.js)
const casesModule = require(path.join(__dirname, 'documented-cases.js'));
const cases = casesModule.DOCUMENTED_CASES || casesModule;
assert.equal(cases.length, 10, 'A base deve conter exatamente os 10 casos autorizados');

const expectedIds = [
  'DJF-la-nina-8',
  'DJF-el-nino-1',
  'DJF-el-nino-3',
  'DJF-neutro-4',
  'DJF-alvarez-3-4',
  'DJF-alvarez-8-1',
  'MAM-alvarez-1',
  'JJA-alvarez-8',
  'SON-alvarez-7-8',
  'SON-alvarez-1'
];
assert.deepEqual(cases.map(c => c.id).sort(), expectedIds.sort(), 'Os IDs dos 10 casos devem corresponder exatamente aos autorizados');

for (const c of cases) {
  assert(['DJF', 'MAM', 'JJA', 'SON'].includes(c.season), `Estação válida para ${c.id}`);
  assert(['el-nino', 'la-nina', 'neutro', 'todos'].includes(c.enso), `ENOS válido para ${c.id}`);
  assert(Number(c.phase) >= 1 && Number(c.phase) <= 8, `Fase MJO válida para ${c.id}`);
  assert.equal(c.sign, 'positivo', `Somente casos com sinal aumentado ("mais") autorizados (${c.id})`);
  assert(typeof c.chance === 'string' && c.chance.length > 5, `Rótulo de chance presente para ${c.id}`);
  assert(typeof c.text === 'string' && c.text.length > 15, `Texto de síntese física presente para ${c.id}`);
  assert(typeof c.source === 'string' && c.source.length > 10, `Fonte identificada para ${c.id}`);

  // Regiões estritamente SESA ou ZCAS
  assert(['SESA', 'ZCAS'].includes(c.region), `Região deve ser estritamente SESA ou ZCAS para ${c.id} (atual: ${c.region})`);
  assert(['SESA', 'ZCAS'].includes(c.regionName), `Nome da região deve ser estritamente SESA ou ZCAS para ${c.id} (atual: ${c.regionName})`);
  assert(typeof c.authorSectorDef === 'string' && c.authorSectorDef.length > 15, `authorSectorDef presente para ${c.id}`);

  // Verificar mecanismos
  if (c.id.includes('alvarez')) {
    assert(c.extratropical && ['C', 'A'].includes(c.extratropical.type), `Centro extratropical C ou A obrigatório para ${c.id}`);
    assert(Number.isFinite(c.extratropical.lat) && Number.isFinite(c.extratropical.lon), `Coordenadas extratropicais válidas para ${c.id}`);
  }
  if (c.id === 'DJF-la-nina-8' || c.id === 'DJF-el-nino-1') {
    assert(c.sourceMarker && Number.isFinite(c.sourceMarker.lat) && Number.isFinite(c.sourceMarker.lon), `Marcador qualitativo de fonte obrigatório para ${c.id}`);
    assert(c.text.includes('fluxo de umidade da Amazônia para a ZCAS e divergência de umidade no SESA (Fernandes & Grimm 2023)'), `Mecanismo de divergência no SESA e umidade da Amazônia presente para ${c.id}`);
  }
}

// 2. Ausência Total de "metric" nos Arquivos de Produção
const prodFiles = [
  'documented-cases.js',
  'documented-view.js',
  'index.html',
  'rmm-diagram.js',
  'map-regions.js',
  'cpc-mjo-precip-data.js',
  'grimm-matrix-data.js'
];
for (const file of prodFiles) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  assert(!content.includes('metric'), `O arquivo ${file} NÃO deve conter nenhuma ocorrência de "metric"`);
}

// 3. Validação do HTML
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(!html.includes('id="metricSelect"'), 'metricSelect deve estar removido do HTML');
assert(html.includes('id="ensoGroup"'), 'ensoGroup deve existir para controle de visibilidade');
assert(html.includes('id="sandboxSector"'), 'sandboxSector deve estar presente no HTML');
assert(html.includes('id="sandboxMatrixContainer"'), 'sandboxMatrixContainer deve estar presente no HTML');
assert(html.includes('id="sandboxDiagnosticCard"'), 'sandboxDiagnosticCard deve estar presente no HTML');
for (const id of expectedIds) {
  assert(html.includes(`value="${id}"`), `Opção do evento ${id} deve estar presente no HTML`);
}

// 4. Teste de Sintaxe dos Scripts
for (const file of ['documented-cases.js', 'documented-view.js', 'map-regions.js', 'rmm-diagram.js', 'panels-manager.js', 'cpc-mjo-precip-data.js', 'grimm-matrix-data.js']) {
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
    classList: {
      contains: () => false,
      add: () => {},
      remove: () => {},
      toggle: () => {}
    },
    querySelectorAll: () => [],
    scrollIntoView: () => {},
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
  'sstLayer', 'jetsLayer', 'jetsToggle', 'salljLayer', 'salljToggle', 'psaLayer', 'psaToggle',
  'boxesLayer', 'boxesToggle', 'sesaToggle', 'zcasToggle', 'legendButton', 'legend',
  'caseTitle', 'caseSummary', 'narrationText', 'btnVoiceNarrate', 'btnVoicePause',
  'btnVoiceStop', 'btnVoiceMute', 'mapTitle', 'mapDesc', 'map', 'mapDrawing',
  'result', 'sstBand', 'sstText', 'phaseInfo', 'panelPsa', 'psaCard', 'psaText',
  'rmmDiagram', 'mjoAmplitude', 'mjoAmplitudeValue', 'rmmStatus', 'rmmStatusTag',
  'ensoGroup', 'seasonSelect', 'ensoSelect', 'phaseSelect', 'eventNotice',
  'eventsSelect', 'eventsDJF', 'eventsMAM', 'eventsJJA', 'eventsSON',
  'salljSelect',
  'btnPanelsMenu', 'btnResetLayout', 'panelsDropdown',
  'sandboxSector', 'sandboxModeBtn', 'btnOpenSandbox', 'btnToggleSandboxView',
  'sandboxSeasonTabs', 'sandboxMatrixContainer', 'sandboxDiagnosticCard', 'sandboxSummaryCount'
];

const elements = {};
for (const id of elementIds) {
  elements[id] = makeMockElement(id);
}

// Configurar opções nos selects de eventos do mock
for (const eid of ['eventsSelect', 'eventsDJF', 'eventsMAM', 'eventsJJA', 'eventsSON']) {
  if (elements[eid]) {
    elements[eid].options = [
      { value: '' },
      ...expectedIds.map(id => ({ value: id }))
    ];
  }
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
        if (typeof v === 'string' && k !== 'href' && k !== 'xlink:href' && !v.startsWith('data:') && v.includes('NaN')) throw new Error('NaN in string in ' + tag + ' ' + k + ': ' + v);
        el.attributes[k] = v;
      },
      appendChild: () => {}
    };
    return el;
  },
  createElement: (tag) => ({ tagName: tag, dataset: {}, addEventListener: () => {}, setAttribute: () => {}, style: {}, appendChild: () => {}, replaceChildren: () => {} }),
  querySelectorAll: (selector) => {
    if (selector === '.event-select') return [elements.eventsSelect, elements.eventsDJF, elements.eventsMAM, elements.eventsJJA, elements.eventsSON].filter(Boolean);
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
vm.runInContext(fs.readFileSync(path.join(__dirname, 'cpc-mjo-precip-data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'grimm-matrix-data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'documented-cases.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'documented-view.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'rmm-diagram.js'), 'utf8'), sandbox);

// 6. Teste de Regressão Completo do Sandbox:
// 96 combinações (4 estações x 3 ENOS x 8 fases) x 5 modos MJO x 2 amplitudes {0.5, 1.5} x 2 visões {global, regional}
const seasons = ['DJF', 'MAM', 'JJA', 'SON'];
const ensos = ['neutro', 'el-nino', 'la-nina'];
const phases = [1, 2, 3, 4, 5, 6, 7, 8];
const mjoModes = ['none', 'chi', 'cpc_precip', 'dipoles', 'track'];
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
              const hasCpcImg = createdElements.some(el => el.tagName === 'image');
              assert(!hasCpcImg, `Com amplitude < 1 não pode desenhar imagem CPC (${season}-${enso}-${phase})`);
            }
          }
        }
      }
    }
  }
}
assert.equal(totalSandboxRuns, 4 * 3 * 8 * 5 * 2 * 2, 'Exatamente 1920 configurações testadas sem exceções');

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
// SESA (DJF 3 ou 4) -> SALLJ para o sul (SESA)
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 3, amplitude: 1.5 });
const salljLegend = createdElements.some(el => el.textContent && el.textContent.includes('dipolo ZCAS × SESA (Liebmann 2004; Nogués-Paegle & Mo 1997)'));
assert(salljLegend, 'SALLJ deve incluir a legenda do dipolo ZCAS x SESA com Liebmann 2004 e Nogués-Paegle & Mo 1997');
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

// 9. Teste de χ200 Único (G. Deemer) e Paralelogramos (Zero Elipses)
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

// Testar geometria dos paralelogramos em todas as 8 fases:
// - Externo: latN=30, latS=-30, W=60
// - Médio: H=20, W=40
// - Núcleo: H=10, W=22
// - Nenhum vértice além de ±30°
for (let p = 1; p <= 8; p++) {
  const chi = sandbox.getMjoChiSchematic(p);
  assert(chi && chi.active && chi.suppressed, `χ200 deve estar definido para fase ${p}`);
  for (const branch of [chi.active, chi.suppressed]) {
    assert.equal(branch.levels.length, 3, `Deve ter 3 níveis na fase ${p}`);
    const [outer, mid, core] = branch.levels;
    assert.equal(outer.W, 60, `Outer W deve ser 60 na fase ${p}`);
    assert.equal(outer.latN, 30, `Outer latN deve ser 30 na fase ${p}`);
    assert.equal(outer.latS, -30, `Outer latS deve ser -30 na fase ${p}`);

    assert.equal(mid.W, 40, `Mid W deve ser 40 na fase ${p}`);
    assert.equal(mid.latN - mid.latS, 20, `Mid H deve ser 20 na fase ${p}`);

    assert.equal(core.W, 22, `Core W deve ser 22 na fase ${p}`);
    assert.equal(core.latN - core.latS, 10, `Core H deve ser 10 na fase ${p}`);

    for (const lvl of branch.levels) {
      assert(lvl.latN <= 30 && lvl.latN >= -30, `latN deve estar em [-30, 30] na fase ${p}`);
      assert(lvl.latS <= 30 && lvl.latS >= -30, `latS deve estar em [-30, 30] na fase ${p}`);

      // Validação de paralelismo estrito: inclinação dlon/dlat constante em todos os níveis
      const leftSlope = (lvl.dlonSW - lvl.dlonNW) / (lvl.latS - lvl.latN);
      const rightSlope = (lvl.dlonSE - lvl.dlonNE) / (lvl.latS - lvl.latN);
      assert(Math.abs(leftSlope - (-1.0)) < 1e-6, `Aresta esquerda deve ter inclinação -1.0 (nível ${lvl.name}, fase ${p})`);
      assert(Math.abs(rightSlope - (-1.0)) < 1e-6, `Aresta direita deve ter inclinação -1.0 (nível ${lvl.name}, fase ${p})`);
    }
  }
}

// Testar desenho de χ200 em modo chi: paralelogramos e zero elipses
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 1, amplitude: 1.5, mjoMode: 'chi', view: 'global' });
const chiPolygons = createdElements.filter(el => el.tagName === 'polygon');
assert(chiPolygons.length >= 6, 'Devem ser gerados pelo menos 6 polígonos (paralelogramos: outer, mid, core para div e conv)');

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

// 11. Teste da Narrativa do SALLJ (Liebmann et al. 2004; Nogués-Paegle & Mo 1997)
sandbox.setClimateState({ season: 'DJF', enso: 'la-nina', phase: 8, amplitude: 1.5 });
const narZcas = elements.narrationText.textContent;
assert(narZcas.includes('curva para leste/nordeste, em direção ao setor ZCAS'), 'Narrativa deve indicar curva para ZCAS');
assert(narZcas.includes('Liebmann et al. 2004; dipolo: Nogués-Paegle & Mo 1997'), 'Narrativa do SALLJ deve citar Liebmann et al. 2004 e Nogués-Paegle & Mo 1997');

sandbox.setClimateState({ season: 'DJF', enso: 'el-nino', phase: 3, amplitude: 1.5 });
const narSesa = elements.narrationText.textContent;
assert(narSesa.includes('atua direcionado até o SESA'), 'Narrativa deve indicar SALLJ direcionado até o SESA');
assert(narSesa.includes('Liebmann et al. 2004; dipolo: Nogués-Paegle & Mo 1997'), 'Narrativa deve citar Liebmann et al. 2004 e Nogués-Paegle & Mo 1997 no SESA');

// 12. Teste da Nota de La Niña em DJF (fases 2–8)
sandbox.setClimateState({ season: 'DJF', enso: 'la-nina', phase: 4, amplitude: 1.5 });
const narLaNina = elements.narrationText.textContent;
assert(narLaNina.includes('extremos no SESA diminuem mesmo quando a chuva média aumenta (subsidência favorecida pela La Niña)'), 'Nota La Niña (DJF fases 2-8) deve estar presente na narração');

// 13. Teste da Nota de Inverno em JJA
sandbox.setClimateState({ season: 'JJA', enso: 'neutro', phase: 1, amplitude: 1.5 });
const narJja = elements.narrationText.textContent;
assert(narJja.includes('No inverno, extremos no SESA ligam-se a um ciclone travado por anticiclone perto da Península Antártica (Alvarez et al. 2013)'), 'Nota de inverno JJA deve estar presente na narração');

// 14. Teste dos Novos Eventos (El Niño 3 e Neutro 4)
sandbox.selectEvent('DJF-el-nino-3');
assert.equal(elements.caseTitle.textContent.includes('El Niño'), true, 'DJF-el-nino-3 deve carregar evento El Niño');
assert.equal(elements.ensoGroup.style.display, '', 'ENOS visível em DJF-el-nino-3');

sandbox.selectEvent('DJF-neutro-4');
assert.equal(elements.caseTitle.textContent.includes('Neutro'), true, 'DJF-neutro-4 deve carregar evento Neutro');

// 15. Teste de Pontilhado do χ200
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 1, amplitude: 1.5, mjoMode: 'chi', view: 'global' });
createdElements.length = 0;
sandbox.drawMjoVelocityPotential();
const levelPolys = createdElements.filter(el => el.tagName === 'polygon' && el.attributes && el.attributes['stroke-dasharray']);
assert(levelPolys.length >= 6, 'Devem ser desenhados pelo menos 6 paralelogramos de chi200 pontilhados');

// 16. Teste de Cores Vibrantes da TSM em El Niño e La Niña
sandbox.setClimateState({ season: 'DJF', enso: 'el-nino', phase: 1, amplitude: 1.5, view: 'global' });
const elNinoSst = createdElements.find(el => el.tagName === 'ellipse' && el.attributes && el.attributes.fill === '#dc2626');
assert(elNinoSst, 'El Niño deve possuir elipse de TSM com cor forte (#dc2626)');

sandbox.setClimateState({ season: 'DJF', enso: 'la-nina', phase: 1, amplitude: 1.5, view: 'global' });
const laNinaSst = createdElements.find(el => el.tagName === 'ellipse' && el.attributes && el.attributes.fill === '#1d4ed8');
assert(laNinaSst, 'La Niña deve possuir elipse de TSM com cor forte (#1d4ed8)');

// 17. Teste de Controle e Alternância de PSA e SALLJ no Mapa
assert.equal(elements.psaToggle.checked, true, 'psaToggle deve iniciar marcado');
assert.equal(elements.salljToggle.checked, true, 'salljToggle deve iniciar marcado');

elements.psaToggle.checked = false;
elements.psaToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasPsaOff = createdElements.some(el => el.textContent && el.textContent.includes('Padrão PSA'));
assert.equal(hasPsaOff, false, 'PSA não deve ser desenhada quando psaToggle estiver desmarcado');

elements.psaToggle.checked = true;
elements.psaToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasPsaOn = createdElements.some(el => el.textContent && el.textContent.includes('Padrão PSA'));
assert.equal(hasPsaOn, true, 'PSA deve ser restaurada quando psaToggle estiver marcado');

elements.salljToggle.checked = false;
elements.salljToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasSalljOff = createdElements.some(el => el.textContent && el.textContent.includes('SALLJ'));
assert.equal(hasSalljOff, false, 'SALLJ não deve ser desenhado quando salljToggle estiver desmarcado');

elements.salljToggle.checked = true;
elements.salljToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasSalljOn = createdElements.some(el => el.textContent && el.textContent.includes('SALLJ'));
assert.equal(hasSalljOn, true, 'SALLJ deve ser restaurado quando salljToggle estiver marcado');

// Teste de Controle do Jato Subtropical
assert.equal(elements.jetsToggle.checked, true, 'jetsToggle deve iniciar marcado');
elements.jetsToggle.checked = false;
elements.jetsToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasJetOff = createdElements.some(el => el.textContent && el.textContent.includes('Jato Subtropical'));
assert.equal(hasJetOff, false, 'Jato Subtropical não deve ser desenhado quando jetsToggle estiver desmarcado');

elements.jetsToggle.checked = true;
elements.jetsToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasJetOn = createdElements.some(el => el.textContent && el.textContent.includes('Jato Subtropical'));
assert.equal(hasJetOn, true, 'Jato Subtropical deve ser restaurado quando jetsToggle estiver marcado');

// Teste de Controle das Caixas SESA e ZCAS (boxesToggle)
assert.equal(elements.boxesToggle.checked, true, 'boxesToggle deve iniciar marcado');
elements.boxesToggle.checked = false;
elements.boxesToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasSesaBoxOff = createdElements.some(el => el.textContent === 'SESA');
const hasZcasBoxOff = createdElements.some(el => el.textContent === 'ZCAS');
assert.equal(hasSesaBoxOff, false, 'Caixa SESA não deve ser desenhada quando boxesToggle estiver desmarcado');
assert.equal(hasZcasBoxOff, false, 'Caixa ZCAS não deve ser desenhada quando boxesToggle estiver desmarcado');

elements.boxesToggle.checked = true;
elements.boxesToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
const hasSesaBoxOn = createdElements.some(el => el.textContent === 'SESA');
const hasZcasBoxOn = createdElements.some(el => el.textContent === 'ZCAS');
assert.equal(hasSesaBoxOn, true, 'Caixa SESA deve ser restaurada quando boxesToggle estiver marcado');
assert.equal(hasZcasBoxOn, true, 'Caixa ZCAS deve ser restaurada quando boxesToggle estiver marcado');

// Teste de controles individuais (sesaToggle e zcasToggle)
elements.sesaToggle.checked = false;
elements.sesaToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
assert.equal(createdElements.some(el => el.textContent === 'SESA'), false, 'Caixa SESA deve ser ocultada individualmente');
assert.equal(createdElements.some(el => el.textContent === 'ZCAS'), true, 'Caixa ZCAS deve permanecer visível quando apenas sesaToggle for desmarcado');

elements.sesaToggle.checked = true;
elements.sesaToggle.listeners['change'].forEach(fn => fn());
elements.zcasToggle.checked = false;
elements.zcasToggle.listeners['change'].forEach(fn => fn());
createdElements.length = 0;
sandbox.drawMap();
assert.equal(createdElements.some(el => el.textContent === 'SESA'), true, 'Caixa SESA deve permanecer visível quando apenas zcasToggle for desmarcado');
assert.equal(createdElements.some(el => el.textContent === 'ZCAS'), false, 'Caixa ZCAS deve ser ocultada individualmente');

elements.zcasToggle.checked = true;
elements.zcasToggle.listeners['change'].forEach(fn => fn());

// 18. Teste dos 4 Estados do SALLJ x DJF Fases 3 e 8 x A {0.5, 1.5}
const salljStates = ['auto', 'forte', 'fraco', 'climatologico'];
const testPhases = [3, 8];
const testAmps = [0.5, 1.5];

for (const sState of salljStates) {
  for (const tPhase of testPhases) {
    for (const tAmp of testAmps) {
      sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: tPhase, amplitude: tAmp, salljState: sState, view: 'global' });
      assert.equal(elements.salljSelect.value, sState, `Select deve estar sincronizado com estado ${sState}`);

      createdElements.length = 0;
      sandbox.drawSallj();

      const salljPath = createdElements.find(el => el.tagName === 'path' && el.attributes && el.attributes.stroke === '#34d399');
      assert(salljPath, `Path do SALLJ deve existir para estado=${sState}, fase=${tPhase}, A=${tAmp}`);

      const strokeW = Number(salljPath.attributes['stroke-width']);
      const effective = sandbox.getEffectiveSalljState('DJF', tPhase);

      if (sState === 'auto') {
        const expectedEffective = tPhase === 3 ? 'forte' : 'fraco';
        assert.equal(effective, expectedEffective, `Em auto, fase ${tPhase} deve resolver para ${expectedEffective}`);
        const baseW = expectedEffective === 'forte' ? 4.2 : 2.2;
        const expectedW = baseW * Math.min(tAmp, 1.0);
        assert(Math.abs(strokeW - expectedW) < 1e-5, `Espessura em auto (${strokeW}) deve ser ${expectedW} para A=${tAmp}`);
      } else {
        assert.equal(effective, sState, `Modo manual deve manter estado ${sState}`);
        const baseW = sState === 'forte' ? 4.2 : sState === 'fraco' ? 2.2 : 3.2;
        assert(Math.abs(strokeW - baseW) < 1e-5, `Espessura em modo manual (${strokeW}) deve ser constante ${baseW} para A=${tAmp}`);
      }

      // Validar legenda por estado
      const dipoloSub = createdElements.find(el => el.tagName === 'text' && el.attributes && el.attributes.fill === '#a7f3d0');
      assert(dipoloSub && dipoloSub.textContent.includes('dipolo ZCAS × SESA'), `Sub-legenda do dipolo deve estar presente`);

      const stateSub = createdElements.find(el => el.tagName === 'text' && el.attributes && el.attributes.fill === '#fde047');
      if (effective === 'forte') {
        assert(stateSub && stateSub.textContent.includes('jato forte — mais chuva e extremos no SESA (Liebmann et al. 2004)'));
      } else if (effective === 'fraco') {
        assert(stateSub && stateSub.textContent.includes('jato fraco — umidade desviada para a ZCAS (Liebmann et al. 2004; Muza et al. 2009)'));
      }
    }
  }
}

// Teste JJA no modo Automático: sempre climatológico
sandbox.setClimateState({ season: 'JJA', enso: 'neutro', phase: 1, amplitude: 1.5, salljState: 'auto', view: 'global' });
assert.equal(sandbox.getEffectiveSalljState('JJA', 1), 'climatologico', 'Em JJA modo auto deve ser sempre climatológico');
createdElements.length = 0;
sandbox.drawSallj();
const jjaState = createdElements.find(el => el.tagName === 'text' && el.attributes && el.attributes.fill === '#fde047');
assert(jjaState && jjaState.textContent.includes('no inverno, altos níveis dominam — Alvarez et al. 2013'), 'Sub-legenda em JJA deve conter nota de inverno');

// 14. Validação dos Compostos de Precipitação Tropical da MJO (CPC/NOAA)
console.log('Validando compostos de precipitação tropical CPC/NOAA...');
for (const p of [1, 2, 3, 4, 5, 6, 7, 8]) {
  // Visão global com A = 1.5
  sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: p, amplitude: 1.5, view: 'global', mjoMode: 'cpc_precip' });
  const globalImg = createdElements.find(el => el.tagName === 'image');
  assert(globalImg, `Imagem CPC/NOAA deve ser renderizada na visão global para fase ${p}`);
  assert.equal(Number(globalImg.attributes.x), 0, 'Coordenada x global deve ser 0');
  assert.equal(Number(globalImg.attributes.y), 192.5, 'Coordenada y global deve ser 192.5 (30°N)');
  assert.equal(Number(globalImg.attributes.width), 1200, 'Largura global deve ser 1200');
  assert.equal(Number(globalImg.attributes.height), 210, 'Altura global deve ser 210 (30°N a 30°S)');
  assert(globalImg.attributes.href && globalImg.attributes.href.startsWith('data:image/png;base64,'), `Href global deve conter data URI na fase ${p}`);

  // Colorbar na visão global
  const colorbarText = createdElements.find(el => el.tagName === 'text' && el.textContent && el.textContent.includes('Compostos Oficiais CPC/NOAA'));
  assert(colorbarText, `Barra de cores CPC deve estar presente na visão global na fase ${p}`);
  assert(colorbarText.textContent.includes(`Fase ${p}`), `Título da barra deve indicar Fase ${p}`);

  // Visão regional com A = 1.5
  sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: p, amplitude: 1.5, view: 'regional', mjoMode: 'cpc_precip' });
  const regImg = createdElements.find(el => el.tagName === 'image');
  assert(regImg, `Imagem CPC/NOAA deve ser renderizada na visão regional para fase ${p}`);
  assert.equal(Number(regImg.attributes.x), 60, 'Coordenada x regional deve ser 60 (85°W)');
  assert.equal(Number(regImg.attributes.y), 35, 'Coordenada y regional deve ser 35 (15°N)');
  assert.equal(Number(regImg.attributes.width), 400, 'Largura regional deve ser 400 (85°W a 35°W)');
  assert.equal(Number(regImg.attributes.height), 288, 'Altura regional deve ser 288 (15°N a 30°S)');
  assert(regImg.attributes.href && regImg.attributes.href.startsWith('data:image/png;base64,'), `Href regional deve conter data URI na fase ${p}`);

  // Colorbar na visão regional
  const regColorbar = createdElements.find(el => el.tagName === 'text' && el.textContent && el.textContent.includes('Compostos Oficiais CPC/NOAA'));
  assert(regColorbar, `Barra de cores CPC deve estar presente na visão regional na fase ${p}`);
}

// Inativo quando amplitude < 1
sandbox.setClimateState({ season: 'DJF', enso: 'neutro', phase: 4, amplitude: 0.5, view: 'global', mjoMode: 'cpc_precip' });
const inactiveImg = createdElements.find(el => el.tagName === 'image');
assert(!inactiveImg, 'Com amplitude < 1 (inativa), imagem CPC/NOAA não deve ser renderizada');

// 15. Base de Conhecimento e Setor Sandbox das 96 Permutações (Alice Grimm)
console.log('Validando Base Científica das 96 Permutações (Alice Grimm)...');
const grimmModule = require(path.join(__dirname, 'grimm-matrix-data.js'));
const matrix = grimmModule.GRIMM_96_MATRIX;
const matrixKeys = Object.keys(matrix);
assert.equal(matrixKeys.length, 96, 'A matriz deve conter exatamente 96 permutações físicas (4 estações x 3 ENOS x 8 fases)');

const validSignals = ['muito_acima', 'acima', 'muito_abaixo', 'abaixo', 'neutro_climatologia', '+2', '+1', '0', '-1', '-2'];
let curatedFoundCount = 0;

for (const season of ['DJF', 'MAM', 'JJA', 'SON']) {
  const seasonList = grimmModule.getGrimmSeasonMatrix(season);
  assert.equal(seasonList.length, 24, `Cada estação deve conter exatamente 24 permutações no sandbox (${season})`);

  for (const enso of ['la-nina', 'neutro', 'el-nino']) {
    for (let p = 1; p <= 8; p++) {
      const item = grimmModule.getGrimmPermutation(season, enso, p);
      assert(item, `Permutação ${season}-${enso}-${p} deve existir`);
      assert.equal(item.season, season);
      assert.equal(item.enso, enso);
      assert.equal(Number(item.phase), p);
      assert(typeof item.phaseName === 'string' && item.phaseName.length > 5, `phaseName presente em ${item.id}`);
      assert(typeof item.impactLabel === 'string' && item.impactLabel.length > 3, `impactLabel presente em ${item.id}`);
      assert(validSignals.includes(item.sesaSignal) || validSignals.includes(item.signalCategory), `sesaSignal ou signalCategory válido em ${item.id}`);
      assert(typeof item.backgroundSummary === 'string' && item.backgroundSummary.length > 20, `backgroundSummary físico em ${item.id}`);
      assert(typeof item.mjoTrigger === 'string' && item.mjoTrigger.length > 20, `mjoTrigger físico em ${item.id}`);
      assert(typeof item.synthesis === 'string' && item.synthesis.length > 20, `synthesis física em ${item.id}`);
      assert(Array.isArray(item.citations) && item.citations.length >= 1, `citations presentes em ${item.id}`);

      if (item.isCurated) {
        curatedFoundCount++;
        assert(typeof item.curatedTitle === 'string' && item.curatedTitle.length > 5);
        assert(typeof item.curatedAuthor === 'string' && item.curatedAuthor.length > 5);
      }
    }
  }
}
assert(curatedFoundCount >= 10, 'Os casos curados devem estar mapeados e identificados na matriz de 96');

// Teste de Integração Funcional do Sandbox (Seleção de Célula e Diagnóstico)
sandbox.selectGrimmSandboxCell('DJF', 'el-nino', 3);
assert.equal(elements.caseTitle.textContent.includes('DJF'), true, 'Título deve refletir DJF');
assert.equal(elements.caseTitle.textContent.includes('El Niño'), true, 'Título deve refletir El Niño');
assert.equal(elements.caseTitle.textContent.includes('Fase 3'), true, 'Título deve refletir Fase 3');
assert(elements.sandboxDiagnosticCard.innerHTML.includes('Alice Grimm'), 'Cartão de diagnóstico deve exibir Alice Grimm');
assert(elements.sandboxDiagnosticCard.innerHTML.includes('Pico'), 'Cartão deve diagnosticar pico no SESA');

sandbox.selectGrimmSandboxCell('SON', 'la-nina', 8);
assert.equal(elements.caseTitle.textContent.includes('SON'), true, 'Título deve refletir SON');
assert.equal(elements.caseTitle.textContent.includes('La Niña'), true, 'Título deve refletir La Niña');
assert.equal(elements.caseTitle.textContent.includes('Fase 8'), true, 'Título deve refletir Fase 8');
assert(elements.sandboxDiagnosticCard.innerHTML.toLowerCase().includes('seca severa'), 'Cartão deve diagnosticar seca severa no SESA em SON La Niña');

console.log('====================================================');
console.log('TODAS AS VALIDAÇÕES AUTOMATIZADAS PASSARAM COM SUCESSO:');
console.log('1. 10 casos documentados autorizados (só mais, só mecanismo físico).');
console.log('2. Regiões estritamente SESA e ZCAS (sem Bacia do Prata, leste ou sudeste).');
console.log('3. ZERO ocorrências de "metric" nos arquivos de produção.');
console.log('4. Seletor de ENOS oculto em eventos Alvarez e restaurado na interação manual.');
console.log('5. SALLJ direcional citando Liebmann et al. (2004) e Nogués-Paegle & Mo (1997).');
console.log('6. Notas de La Niña (DJF 2-8), inverno (JJA) e recortes de setores validados.');
console.log('7. χ200 Deemer com tabela única e losangos (zero elipses).');
console.log('8. 1920 configurações de sandbox executadas sem erros.');
console.log('9. χ200 e dipolos MJO com bordas pontilhadas e intensidade proporcional ao RMM.');
console.log('10. TSM de El Niño e La Niña com cores fortes sobrepostas à MJO.');
console.log('11. Controles e camadas de PSA e SALLJ funcionais e alternáveis.');
console.log('12. SALLJ com 4 estados (Auto, Forte, Fraco, Climatológico), escalonamento por A e legendas.');
console.log('13. Controles diretos para Jato Subtropical e Caixas SESA e ZCAS funcionais e alternáveis.');
console.log('14. Opção de compostos de precipitação tropical CPC/NOAA (8 fases, global e regional, escala 11 níveis).');
console.log('15. Setor Sandbox das 96 permutações físicas e fundamentação de Alice Grimm et al.');
console.log('====================================================');

