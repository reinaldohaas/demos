const $ = id => document.getElementById(id);

let currentSeason = 'DJF';
let currentEnso = 'neutro';
let currentPhase = 4;
let currentAmplitude = 1.5;
function displayEvidence() { return currentAmplitude >= 1 ? findDocumentedCase(currentSeason, currentEnso, currentPhase) : null; }
let metric = 'extremes';
let mapView = 'global';
let mjoMode = 'dipoles'; // 'dipoles' | 'track' | 'none'
const visibleLayers = {
  get mjo() { return mjoMode !== 'none'; },
  set mjo(v) { if (!v) mjoMode = 'none'; else if (mjoMode === 'none') mjoMode = 'dipoles'; },
  sst: true,
  jets: true,
  psa: true
};
const ns = 'http://www.w3.org/2000/svg';

// Estado da Narração
let isNarrationActive = false;
let isNarrationPaused = false;
let pausedNarrationChanged = false;
let isMuted = false;
const speechSynth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

// Padrões conceituais estilizados de convecção/precipitação da MJO por fase (1 a 8)
// Esquema didático ilustrando os dipolos de convecção ativa (verde) e suprimida (marrom)
// baseados na distribuição típica das fases do índice RMM (Wheeler & Hendon 2004).
// Não constitui extração raster observacional direta nem produto numérico em tempo real.
const MJO_COMPOSITES = {
  1: {
    wet: [
      { lon: 35, lat: 2, rx: 75, ry: 24, rot: 0, label: 'Convecção MJO (+)' },
      { lon: -60, lat: -4, rx: 55, ry: 22, rot: -10 }
    ],
    dry: [
      { lon: 120, lat: -6, rx: 90, ry: 28, rot: 0, label: 'Suprimida (−)' }
    ]
  },
  2: {
    wet: [
      { lon: 70, lat: -3, rx: 75, ry: 26, rot: 0, label: 'Convecção MJO (+)' },
      { lon: -62, lat: -3, rx: 50, ry: 20, rot: -10 }
    ],
    dry: [
      { lon: 140, lat: -8, rx: 95, ry: 28, rot: 0, label: 'Suprimida (−)' }
    ]
  },
  3: {
    wet: [
      { lon: 86, lat: -2, rx: 80, ry: 28, rot: 0, label: 'Convecção MJO (+)' }
    ],
    dry: [
      { lon: 155, lat: -8, rx: 100, ry: 30, rot: 0, label: 'Suprimida (−)' }
    ]
  },
  4: {
    wet: [
      { lon: 118, lat: -5, rx: 80, ry: 28, rot: 0, label: 'Convecção MJO (+)' }
    ],
    dry: [
      { lon: 175, lat: -8, rx: 90, ry: 30, rot: 0, label: 'Suprimida (−)' },
      { lon: 55, lat: 2, rx: 55, ry: 22, rot: 0 }
    ]
  },
  5: {
    wet: [
      { lon: 136, lat: 3, rx: 85, ry: 28, rot: 0, label: 'Convecção MJO (+)' }
    ],
    dry: [
      { lon: 70, lat: -4, rx: 85, ry: 28, rot: 0, label: 'Suprimida (−)' },
      { lon: -160, lat: -8, rx: 70, ry: 24, rot: 0 }
    ]
  },
  6: {
    wet: [
      { lon: 155, lat: 0, rx: 70, ry: 24, rot: 0, label: 'Convecção MJO (+)' },
      { lon: 178, lat: -14, rx: 75, ry: 24, rot: 25, label: 'SPCZ' }
    ],
    dry: [
      { lon: 85, lat: -5, rx: 110, ry: 30, rot: 0, label: 'Suprimida (−)' }
    ]
  },
  7: {
    wet: [
      { lon: -175, lat: -13, rx: 90, ry: 26, rot: 25, label: 'Convecção MJO / SPCZ (+)' }
    ],
    dry: [
      { lon: 105, lat: -6, rx: 115, ry: 32, rot: 0, label: 'Suprimida (−)' }
    ]
  },
  8: {
    wet: [
      { lon: -150, lat: -12, rx: 70, ry: 24, rot: 20, label: 'Convecção MJO (+)' },
      { lon: -56, lat: -7, rx: 60, ry: 22, rot: -10 }
    ],
    dry: [
      { lon: 115, lat: -6, rx: 120, ry: 32, rot: 0, label: 'Suprimida (−)' }
    ]
  }
};

// Trilha de fases da MJO numeradas 1 a 8 ao longo do equador (referência visual esquemática)
const MJO_TRACK_POINTS = [
  { phase: 1, lon: 40, label: '1' },
  { phase: 2, lon: 65, label: '2' },
  { phase: 3, lon: 85, label: '3' },
  { phase: 4, lon: 105, label: '4' },
  { phase: 5, lon: 125, label: '5' },
  { phase: 6, lon: 150, label: '6' },
  { phase: 7, lon: 170, label: '7' },
  { phase: 8, lon: -155, label: '8' }
];

function svg(tag, attributes, text, onClick) {
  const el = document.createElementNS(ns, tag);
  for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, v);
  if (text !== undefined) el.textContent = text;
  if (onClick && typeof el.addEventListener === 'function') el.addEventListener('click', onClick);
  $('mapDrawing').appendChild(el);
  return el;
}

function project(lon, lat) {
  if (mapView === 'regional') return [60 + (lon + 85) * 8, 35 + (15 - lat) * 6.4];
  const wrapped = ((lon - 20) % 360 + 360) % 360;
  return [wrapped * 1200 / 360, (85 - lat) * 560 / 160];
}

function polygon(points, fill, stroke, strokeWidth = 1.5, dash = null) {
  const attrs = {
    points: points.map(p => project(...p).join(',')).join(' '),
    fill, stroke, 'stroke-width': strokeWidth
  };
  if (dash) attrs['stroke-dasharray'] = dash;
  return svg('polygon', attrs);
}

function getMjoPhaseCoords(phase) {
  switch (Number(phase)) {
    case 1: return { lon: 30, region: 'África e Índico Ocidental' };
    case 2: return { lon: 65, region: 'Oceano Índico Ocidental/Central' };
    case 3: return { lon: 85, region: 'Oceano Índico Central/Leste' };
    case 4: return { lon: 120, region: 'Continente Marítimo' };
    case 5: return { lon: 140, region: 'Continente Marítimo Oriental' };
    case 6: return { lon: 160, region: 'Pacífico Ocidental' };
    case 7: return { lon: -175, region: 'Pacífico Central (Linha de Data)' };
    case 8: return { lon: -45, region: 'Hemisfério Ocidental e Atlântico' };
    default: return { lon: 0, region: 'Global' };
  }
}

function getSubtropicalJetParams(season, enso) {
  // Representação esquemática didática do guia de ondas subtropical (~200 hPa).
  // A latitude reflete a migração sazonal média do jato e a espessura ilustra o reforço do guia de ondas sob ENOS.
  // Não constitui medição instrumental de velocidade nem latitude uniforme independente da longitude (Roy et al. 2025; Jones et al. 2023).
  let lat = -30;
  if (season === 'DJF') lat = -32;
  else if (season === 'MAM') lat = -30;
  else if (season === 'JJA') lat = -27;
  else if (season === 'SON') lat = -29;

  // Espessura qualitativa representando a modulação do guia de ondas pelo ENOS
  let width = 2.5;
  if (enso === 'el-nino') width = 3.6;
  else if (enso === 'la-nina') width = 1.8;

  return { lat, width };
}

function drawLand() {
  for (const feature of WORLD_LAND.features) {
    const polygons = feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates : [feature.geometry.coordinates];
    for (const rings of polygons) {
      const ring = rings[0];
      if (mapView === 'regional') {
        polygon(ring, '#18364a', '#517087', 0.9);
        continue;
      }
      let previous = null;
      const continuous = ring.map(([lon, lat]) => {
        let x = ((lon - 20) % 360 + 360) % 360;
        if (previous !== null) {
          while (x - previous > 180) x -= 360;
          while (x - previous < -180) x += 360;
        }
        previous = x;
        return [x, lat];
      });
      for (const shift of [-360, 0, 360]) {
        svg('polygon', {
          points: continuous.map(([x, lat]) => `${(x + shift) * 1200 / 360},${(85 - lat) * 560 / 160}`).join(' '),
          fill: '#18364a',
          stroke: '#517087',
          'stroke-width': 0.7
        });
      }
    }
  }
}

function drawMjoConvection() {
  if (currentAmplitude < 1) return;
  const comp = MJO_COMPOSITES[currentPhase];
  if (!comp) return;

  // 1. Manchas de convecção ativa (verde/azul tropical)
  if (comp.wet) {
    for (const item of comp.wet) {
      const [cx, cy] = project(item.lon, item.lat);
      const attrs = {
        cx, cy, rx: item.rx, ry: item.ry,
        fill: '#059669', 'fill-opacity': 0.38,
        stroke: '#34d399', 'stroke-width': 1.4
      };
      if (item.rot) attrs.transform = `rotate(${item.rot}, ${cx}, ${cy})`;
      svg('ellipse', attrs);
      if (item.label && mapView === 'global') {
        svg('text', { x: cx, y: cy - item.ry - 4, fill: '#6ee7b7', 'font-size': 11, 'font-weight': '700', 'text-anchor': 'middle' }, item.label);
      }
    }
  }

  // 2. Manchas de convecção suprimida (marrom/âmbar tropical)
  if (comp.dry) {
    for (const item of comp.dry) {
      const [cx, cy] = project(item.lon, item.lat);
      const attrs = {
        cx, cy, rx: item.rx, ry: item.ry,
        fill: '#b45309', 'fill-opacity': 0.30,
        stroke: '#f59e0b', 'stroke-width': 1.4
      };
      if (item.rot) attrs.transform = `rotate(${item.rot}, ${cx}, ${cy})`;
      svg('ellipse', attrs);
      if (item.label && mapView === 'global') {
        svg('text', { x: cx, y: cy + item.ry + 13, fill: '#fcd34d', 'font-size': 11, 'font-weight': '600', 'text-anchor': 'middle' }, item.label);
      }
    }
  }
}

function drawMjoTrack() {
  if (mapView !== 'global') return;

  // Linha guia equatorial
  const startP = project(30, 0);
  const endP = project(-140, 0);
  svg('line', { x1: startP[0], y1: startP[1], x2: endP[0], y2: endP[1], stroke: '#ef4444', 'stroke-width': 1, 'stroke-dasharray': '3 4', opacity: 0.5 });

  for (const pt of MJO_TRACK_POINTS) {
    const [tx, ty] = project(pt.lon, 0);
    const isActive = pt.phase === Number(currentPhase);

    if (isActive) {
      // Realce da fase ativa
      svg('circle', { cx: tx, cy: ty, r: 15, fill: '#ef4444', stroke: '#ffffff', 'stroke-width': 2.2 });
      svg('text', { x: tx, y: ty + 5, fill: '#ffffff', 'font-size': 13, 'font-weight': '900', 'text-anchor': 'middle', cursor: 'pointer' }, pt.label, () => setClimateState({ phase: pt.phase }));
    } else {
      // Marcação das outras fases ao longo da trilha
      svg('text', { x: tx, y: ty + 5, fill: '#f87171', 'font-size': 14, 'font-weight': '800', 'text-anchor': 'middle', cursor: 'pointer' }, pt.label, () => setClimateState({ phase: pt.phase }));
    }
  }
}

function drawMjoTropicalVisualizations() {
  if (mjoMode === 'dipoles') {
    drawMjoConvection();
  } else if (mjoMode === 'track') {
    drawMjoTrack();
  }
  // Se mjoMode === 'none', nenhuma representação tropical é desenhada
}

function drawGlobalContext(evidence) {
  if (mapView !== 'global') return;

  // TSM Equatorial no mapa global: representação qualitativa das anomalias equatoriais do Pacífico
  if (visibleLayers.sst) {
    const [sx, sy] = project(-135, 0);
    if (currentEnso === 'el-nino') {
      svg('ellipse', { cx: sx, cy: sy, rx: 130, ry: 26, fill: '#ef4444', 'fill-opacity': 0.35, stroke: '#f87171', 'stroke-dasharray': '5 4' });
      svg('text', { x: sx, y: sy + 44, fill: '#fca5a5', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle' }, 'El Niño · TSM equatorial anômala quente (qualitativo)');
    } else if (currentEnso === 'la-nina') {
      svg('ellipse', { cx: sx, cy: sy, rx: 130, ry: 26, fill: '#2563eb', 'fill-opacity': 0.35, stroke: '#60a5fa', 'stroke-dasharray': '5 4' });
      svg('text', { x: sx, y: sy + 44, fill: '#93c5fd', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle' }, 'La Niña · TSM equatorial anômala fria (qualitativo)');
    } else {
      svg('ellipse', { cx: sx, cy: sy, rx: 130, ry: 20, fill: '#0ea5e9', 'fill-opacity': 0.12, stroke: '#64748b', 'stroke-dasharray': '4 4' });
      svg('text', { x: sx, y: sy + 38, fill: '#94a3b8', 'font-size': 13, 'text-anchor': 'middle' }, 'ENOS Neutro · TSM equatorial próxima à média (qualitativo)');
    }
  }

  drawLand();

  // Rótulos de referência dos Oceanos
  for (const [lon, lat, label] of [[80, -48, 'OCEANO ÍNDICO'], [-145, -48, 'OCEANO PACÍFICO'], [-30, -48, 'OCEANO ATLÂNTICO']]) {
    const [x, y] = project(lon, lat);
    svg('text', { x, y, fill: '#5a829e', 'font-size': 14, 'letter-spacing': 2.5, 'text-anchor': 'middle', 'font-weight': '600' }, label);
  }

  // Visualização tropical da MJO: Dipolos NOAA, Trilha 1–8 ou Nenhuma
  drawMjoTropicalVisualizations();

  // Teleconexão PSA conceitual: representada somente quando há mecanismo verificado para a combinação
  if (visibleLayers.psa && evidence && evidence.psa) {
    const p1 = project(-140, -32);
    const p2 = project(-100, -46);
    const p3 = project(-60, -36);
    svg('path', {
      d: `M ${p1[0]} ${p1[1]} Q ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`,
      fill: 'none', stroke: '#fbbf24', 'stroke-width': 2.2, 'stroke-dasharray': '6 5'
    });
    const labelPos = project(-100, -49);
    svg('text', { x: labelPos[0], y: labelPos[1], fill: '#fde68a', 'font-size': 12, 'text-anchor': 'middle' }, 'Guia PSA de ondas de Rossby (esquema conceitual)');
  }
}

function drawJets() {
  if (!visibleLayers.jets) return;

  const { lat, width } = getSubtropicalJetParams(currentSeason, currentEnso);

  // Jato Subtropical: um único traçado, espessura modulada pelo ENOS e latitude pela estação
  if (mapView === 'global') {
    const pts = [
      [140, lat + 2], [175, lat + 1], [-160, lat],
      [-120, lat - 1], [-80, lat], [-55, lat + 1], [-30, lat + 2]
    ];
    const projectedPts = pts.map(p => project(...p));
    const d = `M ` + projectedPts.map(p => `${p[0]},${p[1]}`).join(' L ');
    svg('path', { d, fill: 'none', stroke: '#38bdf8', 'stroke-width': width, 'stroke-dasharray': '8 5' });
    const [jx, jy] = project(-115, lat - 1);
    svg('text', { x: jx, y: jy - 8, fill: '#7dd3fc', 'font-size': 12, 'text-anchor': 'middle' }, 'Jato Subtropical (~200 hPa · referência conceitual)');
  } else {
    const p1 = project(-82, lat);
    const p2 = project(-38, lat + 3);
    svg('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: '#38bdf8', 'stroke-width': width, 'stroke-dasharray': '8 5' });
    const [jx, jy] = project(-60, lat + 1);
    svg('text', { x: jx, y: jy - 8, fill: '#7dd3fc', 'font-size': 12, 'text-anchor': 'middle' }, 'Jato Subtropical (~200 hPa · referência conceitual)');
  }

  // SALLJ (~850 hPa): uma única seta, sem partículas ou trajetórias duplicadas
  const salljStart = project(-63, -16);
  const salljMid = project(-61, -23);
  const salljEnd = project(-57, -31);
  svg('path', {
    d: `M ${salljStart[0]} ${salljStart[1]} Q ${salljMid[0]} ${salljMid[1]} ${salljEnd[0]} ${salljEnd[1]}`,
    fill: 'none', stroke: '#34d399', 'stroke-width': 3.2
  });
  const endX = salljEnd[0], endY = salljEnd[1];
  svg('polygon', {
    points: `${endX},${endY} ${endX - 7},${endY - 14} ${endX + 7},${endY - 10}`,
    fill: '#34d399'
  });
  const [sx, sy] = project(-65, -22);
  svg('text', { x: sx, y: sy, fill: '#6ee7b7', 'font-size': 12, 'font-weight': '600', 'text-anchor': 'end' }, 'SALLJ (~850 hPa · transporte de umidade)');
}

function drawMap(evidence) {
  $('mapDrawing').replaceChildren();
  $('map').setAttribute('viewBox', mapView === 'global' ? '0 0 1200 560' : '0 0 640 520');

  // Linhas de latitude de referência
  for (const lat of [0, -20, -40, 20, 40]) {
    const y = project(-85, lat)[1];
    svg('line', {
      x1: 0, y1: y,
      x2: mapView === 'global' ? 1200 : 640, y2: y,
      stroke: '#1e334a', 'stroke-dasharray': '4 6'
    });
  }

  if (mapView === 'global') {
    drawGlobalContext(evidence);
  } else {
    drawLand();
    if (mjoMode === 'dipoles') drawMjoConvection();
  }

  // Jatos (Subtropical e SALLJ como base visual permanente)
  drawJets();

  // Delimitação do SESA: SEMPRE DELIMITADA E IDENTIFICADA
  // Rótulo mantido estritamente como "SESA" no topo da região, sem "Bacia do Prata"
  const result = evidence ? evidence[metric] : null;
  const isSesaHighlighted = result && result.region === 'SESA';
  polygon(REGIONS.SESA_POLY, isSesaHighlighted ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.03)', isSesaHighlighted ? '#38bdf8' : '#486780', isSesaHighlighted ? 2.2 : 1.5);
  const [sesaLabelX, sesaLabelY] = project(-56, -24);
  svg('text', { x: sesaLabelX, y: sesaLabelY - 7, fill: isSesaHighlighted ? '#7dd3fc' : '#a5cce3', 'font-size': 17, 'font-weight': '700', 'text-anchor': 'middle' }, 'SESA');

  // Delimitação da ZCAS: SEMPRE DELIMITADA E IDENTIFICADA
  const isZcasHighlighted = result && result.region === 'ZCAS';
  polygon(REGIONS.ZCAS_POLY, isZcasHighlighted ? 'rgba(45, 212, 191, 0.14)' : 'rgba(45, 212, 191, 0.02)', isZcasHighlighted ? '#2dd4bf' : '#3e5c76', isZcasHighlighted ? 2.2 : 1.4, '4 3');
  const [zx, zy] = project(-48, -19);
  svg('text', { x: zx, y: zy, fill: isZcasHighlighted ? '#5eead4' : '#6b8ca8', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' }, 'ZCAS');

  // Destaque condicional: somente quando houver resultado comprovado para a combinação e métrica
  if (result) {
    const location = result.region === 'SESA' ? [-56, -33] : result.region === 'CESA' ? [-46, -15] : [-43, -22];
    const [x, y] = project(...location);

    svg('path', {
      d: `M ${x - 22} ${y} C ${x - 38} ${y - 16}, ${x - 17} ${y - 30}, ${x - 5} ${y - 21} C ${x + 2} ${y - 43}, ${x + 31} ${y - 31}, ${x + 25} ${y - 13} C ${x + 44} ${y - 10}, ${x + 33} ${y + 5}, ${x + 20} ${y + 4} L ${x - 22} ${y + 4} Z`,
      fill: '#73d8da', stroke: '#b4f5f0', 'stroke-width': 2
    });
    for (const dx of [-16, 0, 16]) {
      svg('line', {
        x1: x + dx, y1: y + 12, x2: x + dx - 5, y2: y + 24,
        stroke: '#73d8da', 'stroke-width': metric === 'extremes' ? 4 : 2.5, 'stroke-linecap': 'round'
      });
    }
    svg('text', { x: x + 47, y: y + 5, fill: '#aaf4e7', 'font-size': 24, 'font-weight': '800' }, '↑');
    svg('text', { x, y: y + 49, fill: '#c6f6ef', 'font-size': 14, 'font-weight': '600', 'text-anchor': 'middle' },
      metric === 'extremes' ? 'Extremos mais frequentes' : 'Chuva média favorecida');

    if (result.region === 'CESA') {
      svg('text', { x, y: y - 45, fill: '#a5cce3', 'font-size': 16, 'font-weight': '700', 'text-anchor': 'middle' }, 'CESA · centro-leste');
    }
  }

  $('mapTitle').textContent = mapView === 'global' ? 'Visão global: MJO, Pacífico e América do Sul' : 'América do Sul (visão regional)';
  $('mapDesc').textContent = result ? `${result.region}: ${result.text} Símbolo regional sem magnitude ou extensão quantitativa.` : 'Mapa de referência com ZCAS e SESA. Sem resultado específico verificado nesta síntese.';
}

function generateNarrationText(season, enso, phase, metricVal, evidence) {
  const seasonNames = {
    DJF: 'Verão austral (DJF)',
    MAM: 'Outono austral (MAM)',
    JJA: 'Inverno austral (JJA)',
    SON: 'Primavera austral (SON)'
  };
  const ensoNames = {
    'el-nino': 'El Niño',
    'neutro': 'ENOS Neutro',
    'la-nina': 'La Niña'
  };
  const phaseInfo = getMjoPhaseCoords(phase);

  let text = `Configuração selecionada: ${seasonNames[season]}, com ${ensoNames[enso]} e a Oscilação Madden-Julian na fase ${phase}, correspondente à convecção nominal sobre ${phaseInfo.region}. `;

  // 1. Contexto esquemático da TSM e dos Jatos
  if (enso === 'el-nino') {
    text += `No Pacífico equatorial central e leste, o padrão qualitativo indica anomalias térmicas positivas da TSM. Em altitude, o traçado de referência do Jato Subtropical (~200 hPa) ilustra o guia de ondas com espessura qualitativa reforçada sob circulação de Hadley intensificada no El Niño. `;
  } else if (enso === 'la-nina') {
    text += `No Pacífico equatorial central e leste, o padrão qualitativo indica anomalias térmicas negativas da TSM. Em altitude, o traçado de referência do Jato Subtropical ilustra o guia de ondas com espessura qualitativa reduzida na La Niña. `;
  } else {
    text += `No Pacífico equatorial, a TSM encontra-se próxima à referência climatológica neutra (lembrando que anomalias locais ocorrem na natureza). O Jato Subtropical exibe espessura de referência intermediária. `;
  }

  if (season === 'DJF') {
    text += `A posição latitudinal adotada para o traçado esquemático do jato situa-se em torno de 32 graus sul no verão austral. `;
  } else if (season === 'JJA') {
    text += `No inverno austral, o traçado do jato posiciona-se em torno de 27 graus sul; quanto às teleconexões extratropicais no Hemisfério Sul, Roy et al. (2025) documentam maior atividade de ondas sob condições de ENOS no outono e inverno, sem que haja suporte nesta síntese para inferir resposta regional de chuva no SESA nesta estação. `;
  } else {
    text += `Nas estações de transição sazonal (MAM e SON), o traçado do jato posiciona-se em torno de 29 a 30 graus sul. `;
  }
  text += `Este traçado de jato e as anomalias de TSM são esquemas conceituais didáticos e não medidas de velocidade ou posições latitudinais uniformes ponto a ponto. Em baixos níveis, o SALLJ (~850 hPa) atua no transporte meridional de umidade amazônica, exibindo modos espaciais diferenciados — Central, Northern, Andes e Peru (Jones et al. 2023). `;

  // 2. Efeitos verificados, separando convecção-fonte, circulação/teleconexão e respostas remotas
  if (evidence) {
    text += `Segundo Fernandes e Alice Grimm (2023), Jones et al. (2023) e Roy et al. (2025): `;
    if (evidence.source_convection) {
      text += `1. Convecção-fonte: ${evidence.source_convection} `;
    }
    if (evidence.circulation) {
      text += `2. Circulação e PSA: ${evidence.circulation} `;
    }
    if (evidence.mean) {
      text += `3. Chuva média: ${evidence.mean.text} `;
    } else {
      text += `3. Chuva média: resultado de chuva média não cadastrado nesta síntese para esta fase. `;
    }
    if (evidence.extremes) {
      text += `4. Frequência de extremos: ${evidence.extremes.text} `;
    } else {
      text += `4. Frequência de extremos: resultado de extremos não cadastrado nesta síntese para esta fase. `;
    }
    if (evidence.psa) {
      text += `Mecanismo dinâmico: ${evidence.psa} `;
    }
    if (evidence.limits) {
      text += `Limitações e incertezas: ${evidence.limits} `;
    }
  } else {
    text += `Sem resultado específico verificado nesta síntese documental para esta combinação em relação a ${metricVal === 'extremes' ? 'extremos de chuva' : 'chuva média'}. `;
    text += `Esta ausência de destaque não equivale a efeito físico zero na natureza, ausência do fenômeno ou falta de ciência; reflete a exigência metodológica de registrar apenas resultados fundamentados para o recorte estratificado. `;
  }

  text += `Ressalta-se que a chuva média e a frequência de extremos são variáveis meteorológicas distintas, e extremos de precipitação não autorizam inferência de tempo severo como granizo ou tornados.`;

  return `Amplitude RMM selecionada: ${currentAmplitude.toFixed(1)}. ${currentAmplitude < 1 ? "MJO fraca: os destaques associados às composições de MJO ativa foram ocultados; a base permanece. A fase dentro do círculo unitário não é uma atribuição robusta." : "MJO ativa. A amplitude não foi convertida em magnitudes de chuva, PSA ou jatos; não há calibração dessas relações nesta síntese."} ` + text;
}

function updateVoiceUI(state) {
  const btnNarrate = $('btnVoiceNarrate');
  const btnPause = $('btnVoicePause');
  const btnMute = $('btnVoiceMute');

  if (btnNarrate) {
    btnNarrate.setAttribute('aria-pressed', String(isNarrationActive && !isNarrationPaused));
    btnNarrate.textContent = (isNarrationActive && !isNarrationPaused) ? 'Narrando...' : 'Ouvir narração';
  }
  if (btnMute) {
    btnMute.setAttribute('aria-pressed', String(isMuted));
    btnMute.textContent = isMuted ? 'Com som' : 'Silenciar';
  }
  if (btnPause) {
    btnPause.textContent = isNarrationPaused ? 'Retomar' : 'Pausar';
    btnPause.setAttribute('aria-pressed', String(isNarrationPaused));
  }
}

function speakCurrentNarration() {
  const evidence = displayEvidence();
  const text = generateNarrationText(currentSeason, currentEnso, currentPhase, metric, evidence);

  // Atualizar texto na tela para leitura e acessibilidade
  if ($('narrationText')) {
    $('narrationText').textContent = text;
  }

  if (!speechSynth || isMuted || !isNarrationActive) {
    updateVoiceUI();
    return;
  }

  // Se estiver em pausa, preservar a pausa e não iniciar fala ao trocar controles
  if (isNarrationPaused) {
    pausedNarrationChanged = true;
    updateVoiceUI();
    return;
  }

  speechSynth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 1.05;

  utterance.onstart = () => { updateVoiceUI('speaking'); };
  utterance.onend = () => { updateVoiceUI('idle'); };
  utterance.onerror = () => { updateVoiceUI('idle'); };

  speechSynth.speak(utterance);
  updateVoiceUI('speaking');
}

function setMjoMode(mode) {
  mjoMode = mode; // 'dipoles' | 'track' | 'none'
  update();
}

function setClimateState(opts) {
  if (opts.season !== undefined) currentSeason = opts.season;
  if (opts.enso !== undefined) currentEnso = opts.enso;
  if (opts.phase !== undefined) currentPhase = Number(opts.phase);
  if (opts.amplitude !== undefined && Number.isFinite(Number(opts.amplitude))) currentAmplitude = Math.max(0, Math.min(3, Number(opts.amplitude)));
  if (opts.metric !== undefined) metric = opts.metric;
  if (opts.view !== undefined) mapView = opts.view;
  if (opts.mjoMode !== undefined) mjoMode = opts.mjoMode;
  update();
}

function update() {
  if (typeof renderRMMDiagram === "function") renderRMMDiagram(currentPhase,currentAmplitude);
  // Atualizar atributos dos botões de controle
  document.querySelectorAll('[data-season]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.season === currentSeason)));
  document.querySelectorAll('[data-enso]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.enso === currentEnso)));
  document.querySelectorAll('[data-phase]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.phase) === Number(currentPhase))));
  document.querySelectorAll('[data-shortcut]').forEach(b => {
    const isCurrent = b.dataset.season === currentSeason && b.dataset.enso === currentEnso && Number(b.dataset.phase) === Number(currentPhase);
    b.setAttribute('aria-pressed', String(isCurrent));
  });

  $('globalView').setAttribute('aria-pressed', String(mapView === 'global'));
  $('regionalView').setAttribute('aria-pressed', String(mapView === 'regional'));
  for (const m of ['mean', 'extremes']) $(m).setAttribute('aria-pressed', String(m === metric));

  // Atualizar botões de camadas da MJO (exclusão mútua e nenhuma)
  if ($('mjoDipolesLayer')) $('mjoDipolesLayer').setAttribute('aria-pressed', String(mjoMode === 'dipoles'));
  if ($('mjoTrackLayer')) $('mjoTrackLayer').setAttribute('aria-pressed', String(mjoMode === 'track'));
  if ($('mjoNoneLayer')) $('mjoNoneLayer').setAttribute('aria-pressed', String(mjoMode === 'none'));
  if ($('mjoLayer')) $('mjoLayer').setAttribute('aria-pressed', String(mjoMode !== 'none'));

  // Buscar evidência na base curada
  const evidence = displayEvidence();
  const result = evidence ? evidence[metric] : null;

  const ensoLabel = currentEnso === 'el-nino' ? 'El Niño' : currentEnso === 'la-nina' ? 'La Niña' : 'ENOS Neutro';
  $('caseTitle').textContent = `${currentSeason} · ${ensoLabel} · MJO Fase ${currentPhase}`;

  // Resumo do Caso
  if ($('caseSummary')) {
    if (result) {
      $('caseSummary').textContent = `${result.text} (${result.figure || 'Fernandes & Grimm 2023'})`;
      if ($('caseSummary').style) $('caseSummary').style.color = 'var(--accent-teal)';
    } else {
      $('caseSummary').textContent = currentAmplitude < 1 ? 'MJO fraca (A < 1): destaques de fase ativa ocultos; jatos, TSM, ZCAS e SESA preservados.' : 'Sem resultado específico verificado nesta síntese.';
      if ($('caseSummary').style) $('caseSummary').style.color = 'var(--muted)';
    }
  }

  // Painel de Resultados
  $('result').replaceChildren();
  const value = document.createElement('p');
  value.className = result ? 'value' : 'muted';
  value.textContent = result
    ? `${metric === 'extremes' ? 'Frequência de extremos' : 'Chuva média'} · ${result.region}`
    : 'Sem resultado específico verificado nesta síntese.';
  $('result').appendChild(value);

  const description = document.createElement('p');
  description.textContent = result
    ? result.text
    : `Não há evidência curada desta combinação (${currentSeason}, ${ensoLabel}, Fase ${currentPhase}) para ${metric === 'extremes' ? 'frequência de extremos' : 'chuva média'} no recorte documental atual de Fernandes & Alice M. Grimm (2023). A ausência de resultado não equivale a efeito zero ou ausência de influência física.`;
  $('result').appendChild(description);

  // Faixa de TSM do ENOS
  $('sstBand').className = 'band' + (currentEnso === 'el-nino' ? ' warm' : currentEnso === 'la-nina' ? ' cold' : '');
  $('sstText').textContent = currentEnso === 'el-nino'
    ? 'El Niño · anomalias quentes no Pacífico equatorial central/leste'
    : currentEnso === 'la-nina'
      ? 'La Niña · anomalias frias no Pacífico equatorial central/leste'
      : 'ENOS neutro · sem padrão forte de El Niño ou La Niña; não significa anomalia local zero.';

  // Informações de Fase da MJO
  const phaseInfo = getMjoPhaseCoords(currentPhase);
  $('phaseInfo').textContent = `Fase ${currentPhase} · ${phaseInfo.region} — referência nominal RMM de Wheeler & Hendon (2004), distinta de grade contínua de convecção observada.`;

  // Mecanismo PSA
  if (evidence && evidence.psa) {
    $('psaCard').hidden = false;
    $('psaText').textContent = evidence.psa;
  } else {
    $('psaCard').hidden = false;
    $('psaText').textContent = 'Sem mecanismo de teleconexão PSA documentado especificamente para esta combinação no recorte curado da literatura.';
  }

  // Desenhar mapa com a base permanente e destaques seletivos
  drawMap(evidence);

  // Disparar atualização da narração (fala se ativa e atualiza texto acessível)
  speakCurrentNarration();
}

// Event Listeners: Estações (DJF, MAM, JJA, SON)
document.querySelectorAll('[data-season]').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ season: b.dataset.season });
  });
});

// Event Listeners: ENOS (El Niño, Neutro, La Niña)
document.querySelectorAll('[data-enso]').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ enso: b.dataset.enso });
  });
});

// Event Listeners: MJO Fases 1 a 8
document.querySelectorAll('[data-phase]').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ phase: Number(b.dataset.phase) });
  });
});

// Event Listeners: Atalhos para os Casos Documentados com Destaque
document.querySelectorAll('[data-shortcut]').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({
      season: b.dataset.season,
      enso: b.dataset.enso,
      phase: Number(b.dataset.phase),
      metric: b.dataset.metric || metric
    });
  });
});

// Variáveis: Extremos vs Chuva Média
for (const m of ['mean', 'extremes']) {
  $(m).addEventListener('click', () => {
    setClimateState({ metric: m });
  });
}

// Alternância da Legenda
$('legendButton').addEventListener('click', () => {
  $('legend').hidden = !$('legend').hidden;
  $('legendButton').setAttribute('aria-expanded', String(!$('legend').hidden));
  $('legendButton').textContent = $('legend').hidden ? 'Mostrar legenda' : 'Ocultar legenda';
});

// Alternância de Visão Global / Regional
for (const [id, view] of [['globalView', 'global'], ['regionalView', 'regional']]) {
  $(id).addEventListener('click', () => {
    setClimateState({ view });
  });
}

// Alternância das Camadas MJO nos Trópicos: Dipolos NOAA, Trilha 1–8 ou Nenhuma (ao ligar um desliga a outra)
if ($('mjoDipolesLayer')) {
  $('mjoDipolesLayer').addEventListener('click', () => {
    setMjoMode(mjoMode === 'dipoles' ? 'none' : 'dipoles');
  });
}
if ($('mjoTrackLayer')) {
  $('mjoTrackLayer').addEventListener('click', () => {
    setMjoMode(mjoMode === 'track' ? 'none' : 'track');
  });
}
if ($('mjoNoneLayer')) {
  $('mjoNoneLayer').addEventListener('click', () => {
    setMjoMode('none');
  });
}
if ($('mjoLayer')) {
  $('mjoLayer').addEventListener('click', () => {
    if (mjoMode === 'dipoles') setMjoMode('track');
    else if (mjoMode === 'track') setMjoMode('none');
    else setMjoMode('dipoles');
  });
}

// Alternância de Outras Camadas
for (const [id, layer] of [['sstLayer', 'sst'], ['jetsLayer', 'jets'], ['psaLayer', 'psa']]) {
  if ($(id)) {
    $(id).addEventListener('click', () => {
      visibleLayers[layer] = !visibleLayers[layer];
      $(id).setAttribute('aria-pressed', String(visibleLayers[layer]));
      update();
    });
  }
}

// Controles de Narração por Voz
if ($('btnVoiceNarrate')) {
  $('btnVoiceNarrate').addEventListener('click', () => {
    isNarrationActive = true;
    isNarrationPaused = false;
    isMuted = false;
    speakCurrentNarration();
  });
}

if ($('btnVoicePause')) {
  $('btnVoicePause').addEventListener('click', () => {
    if (!speechSynth) return;
    if (isNarrationPaused || speechSynth.paused) {
      isNarrationPaused = false;
      if (pausedNarrationChanged) {
        pausedNarrationChanged = false;
        speechSynth.cancel();
        speechSynth.resume();
        if (isNarrationActive && !isMuted) speakCurrentNarration();
      } else if (speechSynth.paused) {
        speechSynth.resume();
      } else if (isNarrationActive) {
        speakCurrentNarration();
      }
    } else if (speechSynth.speaking) {
      isNarrationPaused = true;
      speechSynth.pause();
    }
    updateVoiceUI();
  });
}

if ($('btnVoiceStop')) {
  $('btnVoiceStop').addEventListener('click', () => {
    isNarrationActive = false;
    isNarrationPaused = false;
    if (speechSynth) speechSynth.cancel();
    updateVoiceUI('idle');
  });
}

if ($('btnVoiceMute')) {
  $('btnVoiceMute').addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted && speechSynth) {
      speechSynth.cancel();
    } else if (!isMuted && isNarrationActive && !isNarrationPaused) {
      speakCurrentNarration();
    }
    updateVoiceUI();
  });
}

if (typeof window !== 'undefined') {
  window.setClimateState = setClimateState;
}

// Inicializar interface
update();
