const $ = id => document.getElementById(id);

let currentSeason = 'DJF';
let currentEnso = 'neutro';
let currentPhase = 4;
let currentAmplitude = 1.5;
function displayEvidence() { return currentAmplitude >= 1 ? findDocumentedCase(currentSeason, currentEnso, currentPhase) : null; }
function displayAllEvidences() {
  if (currentAmplitude < 1) return { specific: null, alvarez: null, primary: null };
  return findDocumentedCases(currentSeason, currentEnso, currentPhase);
}
let isEventMode = false;
let activeEventId = null;
let mapView = 'global';
let mjoMode = 'none'; // 'none' | 'chi' | 'cpc_precip' | 'dipoles' | 'track'
const visibleLayers = {
  get mjo() { return mjoMode !== 'none'; },
  set mjo(v) { if (!v) mjoMode = 'none'; else if (mjoMode === 'none') mjoMode = 'chi'; },
  sst: true,
  jets: true,
  psa: true,
  sallj: true,
  sesa: true,
  zcas: true,
  get boxes() { return this.sesa && this.zcas; },
  set boxes(v) { this.sesa = !!v; this.zcas = !!v; }
};
let salljState = 'auto'; // 'auto' | 'forte' | 'fraco' | 'climatologico'

function getEffectiveSalljState(season = currentSeason, phase = currentPhase) {
  if (salljState !== 'auto') {
    return salljState;
  }
  // No modo Automático:
  // Em JJA sempre Climatológico (no inverno, altos níveis dominam — Alvarez et al. 2013)
  if (season === 'JJA') {
    return 'climatologico';
  }
  if (season === 'DJF') {
    const p = Number(phase);
    if (p === 3 || p === 4) return 'forte';
    if (p === 8 || p === 1) return 'fraco';
  }
  return 'climatologico';
}
const ns = 'http://www.w3.org/2000/svg';

// Estado da Narração
let isNarrationActive = false;
let isNarrationPaused = false;
let isMuted = false;
const speechSynth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
let ptVoice = null;

function updatePortugueseVoice() {
  if (!speechSynth || typeof speechSynth.getVoices !== 'function') return;
  const voices = speechSynth.getVoices();
  if (!voices || voices.length === 0) return;
  // Priorizar vozes pt-BR naturais (ex: Microsoft Maria/Daniel, Google português do Brasil)
  ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR') ||
            voices.find(v => v.lang && v.lang.toLowerCase().startsWith('pt')) ||
            null;
}

if (speechSynth && typeof window !== 'undefined') {
  if (speechSynth.onvoiceschanged !== undefined) {
    speechSynth.onvoiceschanged = updatePortugueseVoice;
  }
  updatePortugueseVoice();
}

// Padrões conceituais estilizados de convecção/precipitação da MJO por fase (1 a 8)
// Esquema didático ilustrando os dipolos equatoriais de convecção ativa (verde) e suprimida (marrom)
// baseados na distribuição típica das fases do índice RMM (Wheeler & Hendon 2004).
// Restrito estritamente à bacia tropical/equatorial (Índico, Continente Marítimo, Pacífico e África).
// Não desenha manchas sobre a América do Sul/Brasil (as respostas brasileiras são tratadas exclusivamente
// pelas evidências observacionais documentadas).
// Centros de convecção OLR — Método do Perfil Zonal (|lat| <= 10° em novmar; 5°S a 20°N em maysep; suavização circular 20°)
// Compostos CPC (Wheeler & Hendon 2004), plot_olr_tvalue_8pan_novmar.gif e plot_olr_tvalue_8pan_maysep.gif
const MJO_PHASE_REF = {
  novmar: {
    1: { active: [ 15,  1], suppressed: [ 157,  0], region: 'Hemisfério Ocidental e África' },
    2: { active: [ 73,  0], suppressed: [ 138,  0], region: 'Oceano Índico Ocidental' },
    3: { active: [ 79,  1], suppressed: [ 178, -3], region: 'Oceano Índico Central/Leste' },
    4: { active: [108,  0], suppressed: [  18,  1], region: 'Continente Marítimo' },
    5: { active: [129,  0], suppressed: [  77,  3], region: 'Continente Marítimo Oriental' },
    6: { active: [153,  0], suppressed: [  89, -1], region: 'Pacífico Ocidental' },
    7: { active: [-180, -4], suppressed: [  92,  0], region: 'Pacífico Central (Linha de Data)' },
    8: { active: [ -92, -2], suppressed: [  95,  0], region: 'Pacífico Leste / Hemisfério Ocidental' }
  },
  maysep: {
    1: { active: [ -77,  8], suppressed: [ 153,  7], region: 'Hemisfério Ocidental e África' },
    2: { active: [  71,  6], suppressed: [ 151,  8], region: 'Oceano Índico Ocidental' },
    3: { active: [  73,  8], suppressed: [ -64,  8], region: 'Oceano Índico Central/Leste' },
    4: { active: [  84,  9], suppressed: [ -72,  8], region: 'Continente Marítimo' },
    5: { active: [ 138,  5], suppressed: [ -83,  6], region: 'Continente Marítimo Oriental' },
    6: { active: [ 151,  5], suppressed: [  74,  7], region: 'Pacífico Ocidental' },
    7: { active: [-164,  8], suppressed: [  78,  9], region: 'Pacífico Central (Linha de Data)' },
    8: { active: [-106, 12], suppressed: [  81,  8], region: 'Pacífico Leste / Hemisfério Ocidental' }
  }
};

// Dipolos NOAA didáticos equatoriais derivados da estação ativa
function getMjoDipoles(phase, season = currentSeason) {
  const seasonKey = (season === 'JJA' || season === 'SON') ? 'maysep' : 'novmar';
  const ref = (MJO_PHASE_REF[seasonKey] || MJO_PHASE_REF.novmar)[Number(phase)];
  if (!ref) return null;
  const [aLon, aLat] = ref.active;
  const [sLon, sLat] = ref.suppressed;
  return {
    wet: [
      { lon: aLon, lat: aLat, rx: 75, ry: 24, rot: 0, label: 'Convecção MJO (+)' }
    ],
    dry: [
      { lon: sLon, lat: sLat, rx: 80, ry: 26, rot: 0, label: 'Suprimida (−)' }
    ]
  };
}

// Esquema didático de Divergência e Convergência em Altos Níveis (~200 hPa)
// Tabela única de centros de χ₂₀₀ (G. Deemer, compostos NOAA/ESRL PSD, julho–outubro, padrão didático único):
const MJO_CHI_CENTERS = {
  1: { div: [10, 2],    conv: [145, 1] },
  2: { div: [65, -1],   conv: [-170, 0] },
  3: { div: [75, -1],   conv: [-110, -4] },
  4: { div: [115, 2],   conv: [-60, 2] },
  5: { div: [135, 1],   conv: [-70, 0] },
  6: { div: [-130, -3], conv: [55, -3] },
  7: { div: [-115, -3], conv: [80, -1] },
  8: { div: [-65, -3],  conv: [135, 0] }
};

// Esquema didático derivado com paralelogramos estritamente paralelos:
// - Externo: borda norte em 30°N e borda sul em 30°S (fixas); W = 60°.
// - Médio: H = 20° em torno da latitude do centro; W = 40°.
// - Núcleo (só contorno): H = 10° em torno da latitude do centro; W = 22°.
// - Inclinação rigorosamente igual e paralela em todos os níveis e centros:
//   À latitude lat, o centro da fatia horizontal é lonC - (lat - latC).
//   Arestas laterais com inclinação uniforme (dlon = -(lat - latC)), tornando todos os paralelogramos paralelos.
// - Nenhum vértice além de ±30° de latitude.
function getMjoChiSchematic(phase) {
  const ref = MJO_CHI_CENTERS[Number(phase)];
  if (!ref) return null;
  const [adLon, adLat] = ref.div;
  const [scLon, scLat] = ref.conv;

  const buildLevels = (lonC, latC) => {
    // Nenhum vértice além de ±30° de latitude
    const midLatN = Math.min(30, Math.max(-30, latC + 10));
    const midLatS = Math.max(-30, Math.min(30, latC - 10));
    const coreLatN = Math.min(30, Math.max(-30, latC + 5));
    const coreLatS = Math.max(-30, Math.min(30, latC - 5));

    // Inclinação uniforme de 1.0 para todas as arestas laterais:
    const createLevel = (name, W, latN, latS) => ({
      name,
      W,
      latN,
      latS,
      lon: lonC,
      lat: latC,
      dlonNW: -(latN - latC) - W,
      dlonNE: -(latN - latC) + W,
      dlonSE: -(latS - latC) + W,
      dlonSW: -(latS - latC) - W
    });

    return [
      createLevel('outer', 60, 30, -30),
      createLevel('mid', 40, midLatN, midLatS),
      createLevel('core', 22, coreLatN, coreLatS)
    ];
  };

  return {
    active: {
      center: [adLon, adLat],
      levels: buildLevels(adLon, adLat)
    },
    suppressed: {
      center: [scLon, scLat],
      levels: buildLevels(scLon, scLat)
    }
  };
}

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

function getMjoPhaseCoords(phase, season = currentSeason) {
  const seasonKey = (season === 'JJA' || season === 'SON') ? 'maysep' : 'novmar';
  const seasonRef = MJO_PHASE_REF[seasonKey] || MJO_PHASE_REF.novmar;
  const item = seasonRef[Number(phase)];
  return item ? { lon: item.active[0], lat: item.active[1], active: item.active, suppressed: item.suppressed, region: item.region } : { lon: 0, lat: 0, region: 'Global' };
}

function getSubtropicalJetLat(lon, season = currentSeason) {
  let baseLat = -29.5;
  if (season === 'DJF') baseLat = -32;
  else if (season === 'JJA') baseLat = -27;
  else if (season === 'SON') baseLat = -29;
  else if (season === 'MAM') baseLat = -30;

  // Onda planetária de Rossby (número de onda zonal 7, com ondulação típica no hemisfério sul)
  const amp = 3.6;
  const k = 7;
  const phi = -60;
  const rad = (k * (lon - phi) * Math.PI) / 180;
  return baseLat - amp * Math.sin(rad);
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
  let width = 3.2;
  if (enso === 'el-nino') width = 4.5;
  else if (enso === 'la-nina') width = 2.2;

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

  // Na visão regional, desenhar fronteiras dos países e limites estaduais discretos para clara orientação geográfica
  if (mapView === 'regional') {
    if (REGIONS.COUNTRY_BORDERS) {
      for (const border of REGIONS.COUNTRY_BORDERS) {
        const d = 'M ' + border.map(p => project(...p).join(' ')).join(' L ');
        svg('path', { d, fill: 'none', stroke: '#34526f', 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      }
    }
    if (REGIONS.BRAZIL_STATE_BORDERS) {
      for (const border of REGIONS.BRAZIL_STATE_BORDERS) {
        const d = 'M ' + border.map(p => project(...p).join(' ')).join(' L ');
        svg('path', { d, fill: 'none', stroke: '#274460', 'stroke-width': 0.85, 'stroke-dasharray': '3 3', 'stroke-linecap': 'round' });
      }
    }
    if (REGIONS.GEO_LABELS) {
      for (const lbl of REGIONS.GEO_LABELS) {
        const [gx, gy] = project(lbl.lon, lbl.lat);
        svg('text', {
          x: gx, y: gy, fill: lbl.color || '#3b5875', 'font-size': lbl.size || 11,
          'font-weight': lbl.weight || '600', 'letter-spacing': lbl.letterSpacing || 2,
          'text-anchor': 'middle', 'user-select': 'none'
        }, lbl.text);
      }
    }
    if (REGIONS.STATE_LABELS) {
      for (const st of REGIONS.STATE_LABELS) {
        const [sx, sy] = project(st.lon, st.lat);
        svg('text', {
          x: sx, y: sy, fill: '#34516d', 'font-size': 9, 'font-weight': '600',
          'text-anchor': 'middle', 'user-select': 'none'
        }, st.text);
      }
    }
  }
}

function drawMjoConvection() {
  if (currentAmplitude < 1 || mapView !== 'global') return;
  const comp = getMjoDipoles(currentPhase, currentSeason);
  if (!comp) return;

  const ampScale = Math.min(2.4, Math.max(0.65, currentAmplitude / 1.5));

  // 1. Manchas de convecção ativa (verde/azul tropical)
  if (comp.wet) {
    for (const item of comp.wet) {
      const [cx, cy] = project(item.lon, item.lat);
      const attrs = {
        cx, cy, rx: item.rx, ry: item.ry,
        fill: '#059669', 'fill-opacity': Math.min(0.70, 0.35 * ampScale),
        stroke: '#34d399', 'stroke-width': 1.4 + 0.3 * (currentAmplitude - 1),
        'stroke-dasharray': '5 3',
        'stroke-opacity': Math.min(1.0, 0.50 + 0.35 * ampScale)
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
        fill: '#b45309', 'fill-opacity': Math.min(0.65, 0.28 * ampScale),
        stroke: '#f59e0b', 'stroke-width': 1.4 + 0.3 * (currentAmplitude - 1),
        'stroke-dasharray': '5 3',
        'stroke-opacity': Math.min(1.0, 0.50 + 0.35 * ampScale)
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

  const TRACK_POINTS = [
    { phase: 1, lon: 50 },
    { phase: 2, lon: 70 },
    { phase: 3, lon: 90 },
    { phase: 4, lon: 108 },
    { phase: 5, lon: 128 },
    { phase: 6, lon: 148 },
    { phase: 7, lon: 165 },
    { phase: 8, lon: 180 },
    { phase: 1, lon: -165, repeated: true }
  ];
  const evidence = displayEvidence();

  // Linha guia equatorial
  const yEq = (85 - 0) * 560 / 160;
  svg('line', { x1: 0, y1: yEq, x2: 1200, y2: yEq, stroke: '#ef4444', 'stroke-width': 1, 'stroke-dasharray': '3 4', opacity: currentAmplitude < 1 ? 0.2 : 0.4 });

  // Rótulo da trilha: "Fases RMM (Wheeler & Hendon 2004)"
  svg('text', {
    x: 1190, y: yEq - 10,
    fill: currentAmplitude < 1 ? '#64748b' : '#fca5a5',
    'font-size': 11, 'font-weight': '700', 'text-anchor': 'end',
    stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
  }, 'Fases RMM (Wheeler & Hendon 2004)');

  for (const pt of TRACK_POINTS) {
    const p = pt.phase;
    const [tx, ty] = project(pt.lon, 0);
    const isCurrent = p === Number(currentPhase);
    const isGrouped = evidence && evidence.groupedPhases && evidence.groupedPhases.includes(p);
    const isActive = currentAmplitude >= 1 && (isCurrent || isGrouped);

    if (currentAmplitude < 1) {
      // Números em cinza, sem nenhum destaque
      svg('text', {
        x: tx, y: ty + 5,
        fill: '#64748b', 'font-size': 14, 'font-weight': '700',
        'text-anchor': 'middle', cursor: 'pointer'
      }, String(p), () => setClimateState({ phase: p }, true));
    } else if (isActive) {
      // Realce da fase ativa (destaca ambas as ocorrências do 1 se fase 1)
      svg('circle', {
        cx: tx, cy: ty, r: 15,
        fill: isCurrent ? '#ef4444' : '#b91c1c',
        stroke: isCurrent ? '#ffffff' : '#fecaca',
        'stroke-width': isCurrent ? 2.5 : 1.8,
        'stroke-dasharray': isCurrent ? null : '3 2'
      });
      svg('text', {
        x: tx, y: ty + 5,
        fill: '#ffffff', 'font-size': 13, 'font-weight': '900',
        'text-anchor': 'middle', cursor: 'pointer'
      }, String(p), () => setClimateState({ phase: p }, true));
    } else {
      svg('text', {
        x: tx, y: ty + 5,
        fill: '#f87171', 'font-size': 14, 'font-weight': '800',
        'text-anchor': 'middle', cursor: 'pointer'
      }, String(p), () => setClimateState({ phase: p }, true));
    }
  }
}

function drawChiColorbar(x, y, w, h) {
  // Fundo translúcido
  svg('rect', { x, y, width: w, height: h, rx: 6, fill: 'rgba(15, 23, 42, 0.90)', stroke: 'rgba(56, 189, 248, 0.35)', 'stroke-width': 1 });

  // Título e crédito a G. Deemer
  svg('text', { x: x + w / 2, y: y + 10, fill: '#bae6fd', 'font-size': 9, 'font-weight': '700', 'text-anchor': 'middle' },
    'χ₂₀₀ · G. Deemer (compostos NOAA/ESRL PSD, julho–outubro, padrão didático único)');

  // 6 caixas de cores
  const barW = w - 40;
  const barH = 7;
  const barX = x + 20;
  const barY = y + 14;
  const colors = ['#0369a1', '#0284c7', '#38bdf8', '#facc15', '#f97316', '#dc2626'];
  const segW = barW / colors.length;

  colors.forEach((col, idx) => {
    svg('rect', { x: barX + idx * segW, y: barY, width: segW, height: barH, fill: col, stroke: 'rgba(0,0,0,0.3)', 'stroke-width': 0.5 });
  });

  // Ticks conceituais qualitativos
  svg('text', { x: barX, y: barY + barH + 9, fill: '#38bdf8', 'font-size': 8.5, 'font-weight': '700', 'text-anchor': 'start' }, '← Divergência (Ativa · χ < 0)');
  svg('text', { x: barX + barW / 2, y: barY + barH + 9, fill: '#94a3b8', 'font-size': 8.5, 'font-weight': '600', 'text-anchor': 'middle' }, 'Neutro');
  svg('text', { x: barX + barW, y: barY + barH + 9, fill: '#f87171', 'font-size': 8.5, 'font-weight': '700', 'text-anchor': 'end' }, 'Convergência (Suprimida · χ > 0) →');
}

function drawMjoVelocityPotential() {
  if (currentAmplitude < 1) return;
  const chi = getMjoChiSchematic(currentPhase);
  if (!chi) return;

  const isGlobal = mapView === 'global';

  if (isGlobal) {
    // 1. Limites do domínio tropical entre 30°S e 30°N
    const y30N = (85 - 30) * 560 / 160;
    const y30S = (85 - (-30)) * 560 / 160;

    // 2. Desenhar camadas ativas e suprimidas em formato de PARALELOGRAMOS (4 vértices)
    // Inclinação: borda sul deslocada para LESTE em W (metade da largura) em relação à norte:
    //   NW = [lonC − 1,5W, latN]   NE = [lonC + 0,5W, latN]
    //   SE = [lonC + 1,5W, latS]   SW = [lonC − 0,5W, latS]
    //   Nenhum vértice além de ±30° de latitude.
    const renderLayers = (data, styleKey) => {
      if (!data || !data.levels) return;
      const ampScale = Math.min(2.4, Math.max(0.65, currentAmplitude / 1.5));
      const styles = {
        outer: {
          fill: styleKey === 'active' ? '#38bdf8' : '#facc15',
          opacity: Math.min(0.35, 0.10 * ampScale),
          stroke: styleKey === 'active' ? '#7dd3fc' : '#fde047',
          strokeWidth: 1.1 + 0.3 * (currentAmplitude - 1),
          dashArray: '5 4',
          strokeOpacity: Math.min(1.0, 0.45 + 0.35 * ampScale)
        },
        mid: {
          fill: styleKey === 'active' ? '#0284c7' : '#f97316',
          opacity: Math.min(0.40, 0.13 * ampScale),
          stroke: styleKey === 'active' ? '#38bdf8' : '#fb923c',
          strokeWidth: 1.3 + 0.4 * (currentAmplitude - 1),
          dashArray: '5 3',
          strokeOpacity: Math.min(1.0, 0.55 + 0.35 * ampScale)
        },
        core: {
          fill: 'none',
          opacity: 0,
          stroke: styleKey === 'active' ? '#0284c7' : '#ef4444',
          strokeWidth: 1.6 + 0.5 * (currentAmplitude - 1),
          dashArray: '4 3',
          strokeOpacity: Math.min(1.0, 0.60 + 0.30 * ampScale)
        }
      };

      const scaleX = 1200 / 360;
      const scaleY = 3.5;

      for (const item of data.levels) {
        const st = styles[item.name];
        const baseCx = ((item.lon - 20) % 360 + 360) % 360 * scaleX;
        const yNW = (85 - item.latN) * scaleY;
        const yNE = (85 - item.latN) * scaleY;
        const ySE = (85 - item.latS) * scaleY;
        const ySW = (85 - item.latS) * scaleY;

        for (const shift of [-1200, 0, 1200]) {
          const cx = baseCx + shift;
          const xNW = cx + item.dlonNW * scaleX;
          const xNE = cx + item.dlonNE * scaleX;
          const xSE = cx + item.dlonSE * scaleX;
          const xSW = cx + item.dlonSW * scaleX;

          const minX = Math.min(xNW, xNE, xSE, xSW);
          const maxX = Math.max(xNW, xNE, xSE, xSW);

          if (maxX >= -50 && minX <= 1250) {
            const pts = `${xNW.toFixed(1)},${yNW.toFixed(1)} ${xNE.toFixed(1)},${yNE.toFixed(1)} ${xSE.toFixed(1)},${ySE.toFixed(1)} ${xSW.toFixed(1)},${ySW.toFixed(1)}`;
            const attrs = {
              points: pts,
              stroke: st.stroke,
              'stroke-width': st.strokeWidth,
              'stroke-dasharray': st.dashArray,
              'stroke-opacity': st.strokeOpacity
            };
            if (st.fill === 'none') {
              attrs.fill = 'none';
            } else {
              attrs.fill = st.fill;
              attrs['fill-opacity'] = st.opacity;
            }
            svg('polygon', attrs);
          }
        }
      }
    };

    renderLayers(chi.active, 'active');
    renderLayers(chi.suppressed, 'suppressed');

    // Linhas de domínio tropical e título desenhados após os campos para legibilidade garantida
    svg('line', { x1: 0, y1: y30N, x2: 1200, y2: y30N, stroke: 'rgba(56, 189, 248, 0.35)', 'stroke-dasharray': '5 4' });
    svg('line', { x1: 0, y1: y30S, x2: 1200, y2: y30S, stroke: 'rgba(56, 189, 248, 0.35)', 'stroke-dasharray': '5 4' });
    svg('text', { x: 1190, y: y30N + 14, fill: '#bae6fd', 'font-size': 10, 'font-weight': '700', 'text-anchor': 'end', 'letter-spacing': 0.5, stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'χ₂₀₀ · G. Deemer (compostos NOAA/ESRL PSD, julho–outubro, padrão didático único)');

    // 3. Marcadores em losango e rótulos nos centros de divergência e convergência
    if (chi.active && chi.active.center) {
      const [acx, acy] = project(chi.active.center[0], chi.active.center[1]);
      const r = 7;
      svg('polygon', {
        points: `${acx},${acy - r} ${acx + r},${acy} ${acx},${acy + r} ${acx - r},${acy}`,
        fill: '#38bdf8', stroke: '#ffffff', 'stroke-width': 1.6
      });
      svg('text', { x: acx, y: acy - 11, fill: '#bae6fd', 'font-size': 11.5, 'font-weight': '800', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'Divergência 200 hPa');
      svg('text', { x: acx, y: acy + 17, fill: '#e0f2fe', 'font-size': 10, 'font-weight': '600', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, '(Convecção MJO Ativa · χ < 0)');
    }
    if (chi.suppressed && chi.suppressed.center) {
      const [scx, scy] = project(chi.suppressed.center[0], chi.suppressed.center[1]);
      const r = 7;
      svg('polygon', {
        points: `${scx},${scy - r} ${scx + r},${scy} ${scx},${scy + r} ${scx - r},${scy}`,
        fill: '#f97316', stroke: '#ffffff', 'stroke-width': 1.6
      });
      svg('text', { x: scx, y: scy - 11, fill: '#fef08a', 'font-size': 11.5, 'font-weight': '800', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'Convergência 200 hPa');
      svg('text', { x: scx, y: scy + 17, fill: '#fed7aa', 'font-size': 10, 'font-weight': '600', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, '(Convecção Suprimida · χ > 0)');
    }

    // 4. Barra de escala didática conceitual
    drawChiColorbar(300, 516, 600, 36);
  } else {
    // Visão Regional (América do Sul): paralelogramos suaves sobre o continente
    // Núcleo (core) só com contorno, sem preenchimento; mid <= 0.12; outer <= 0.10. Opacidade somada no centro <= 0.25.
    const renderRegionalLayers = (data, styleKey) => {
      if (!data || !data.levels) return;
      const ampScale = Math.min(2.4, Math.max(0.65, currentAmplitude / 1.5));
      const styles = {
        outer: {
          fill: styleKey === 'active' ? '#38bdf8' : '#facc15',
          opacity: Math.min(0.35, 0.10 * ampScale),
          stroke: styleKey === 'active' ? '#7dd3fc' : '#fde047',
          strokeWidth: 1.1 + 0.3 * (currentAmplitude - 1),
          dashArray: '5 4',
          strokeOpacity: Math.min(1.0, 0.45 + 0.35 * ampScale)
        },
        mid: {
          fill: styleKey === 'active' ? '#0284c7' : '#f97316',
          opacity: Math.min(0.40, 0.12 * ampScale),
          stroke: styleKey === 'active' ? '#38bdf8' : '#fb923c',
          strokeWidth: 1.3 + 0.4 * (currentAmplitude - 1),
          dashArray: '5 3',
          strokeOpacity: Math.min(1.0, 0.55 + 0.35 * ampScale)
        },
        core: {
          fill: 'none',
          opacity: 0,
          stroke: styleKey === 'active' ? '#0284c7' : '#ef4444',
          strokeWidth: 1.6 + 0.5 * (currentAmplitude - 1),
          dashArray: '4 3',
          strokeOpacity: Math.min(1.0, 0.60 + 0.30 * ampScale)
        }
      };
      for (const item of data.levels) {
        const st = styles[item.name];
        for (const shift of [-360, 0, 360]) {
          const cLon = item.lon + shift;
          const [xNW, yNW] = project(cLon + item.dlonNW, item.latN);
          const [xNE, yNE] = project(cLon + item.dlonNE, item.latN);
          const [xSE, ySE] = project(cLon + item.dlonSE, item.latS);
          const [xSW, ySW] = project(cLon + item.dlonSW, item.latS);

          const minX = Math.min(xNW, xNE, xSE, xSW);
          const maxX = Math.max(xNW, xNE, xSE, xSW);
          const minY = Math.min(yNW, yNE, ySE, ySW);
          const maxY = Math.max(yNW, yNE, ySE, ySW);

          if (maxX >= -100 && minX <= 740 && maxY >= -100 && minY <= 620) {
            const pts = `${xNW.toFixed(1)},${yNW.toFixed(1)} ${xNE.toFixed(1)},${yNE.toFixed(1)} ${xSE.toFixed(1)},${ySE.toFixed(1)} ${xSW.toFixed(1)},${ySW.toFixed(1)}`;
            const attrs = {
              points: pts,
              stroke: st.stroke,
              'stroke-width': st.strokeWidth,
              'stroke-dasharray': st.dashArray,
              'stroke-opacity': st.strokeOpacity
            };
            if (st.fill === 'none') {
              attrs.fill = 'none';
            } else {
              attrs.fill = st.fill;
              attrs['fill-opacity'] = st.opacity;
            }
            svg('polygon', attrs);
          }
        }
      }
    };

    renderRegionalLayers(chi.active, 'active');
    renderRegionalLayers(chi.suppressed, 'suppressed');

    // Barra de legenda compacta na visão regional
    drawChiColorbar(60, 476, 520, 36);
  }
}

function drawCpcPrecipColorbar(x, y, w, h) {
  // Fundo translúcido
  svg('rect', { x, y, width: w, height: h, rx: 6, fill: 'rgba(15, 23, 42, 0.92)', stroke: 'rgba(56, 189, 248, 0.35)', 'stroke-width': 1 });

  // Título e crédito oficial NOAA/CPC (Wheeler & Hendon 2004)
  svg('text', { x: x + w / 2, y: y + 10, fill: '#bae6fd', 'font-size': 9, 'font-weight': '700', 'text-anchor': 'middle' },
    `Anomalia de Precipitação Tropical (mm/dia) · Compostos Oficiais CPC/NOAA (Fase ${currentPhase})`);

  // Caixas de cores da escala NOAA/CPC
  const barW = w - 40;
  const barH = 7;
  const barX = x + 20;
  const barY = y + 14;
  const cpcLevels = [
    { color: '#785046', label: '< -3' },
    { color: '#a0786e', label: '-2' },
    { color: '#c8a096', label: '-1' },
    { color: '#f0dcd2', label: '-0.5' },
    { color: '#1e293b', label: '0' },
    { color: '#b4faaa', label: '+0.5' },
    { color: '#50f050', label: '+1' },
    { color: '#1eb41e', label: '+2' },
    { color: '#b4f0fa', label: '+3' },
    { color: '#50a5f5', label: '+4' },
    { color: '#2882f0', label: '> +5' }
  ];
  const segW = barW / cpcLevels.length;

  cpcLevels.forEach((lvl, idx) => {
    svg('rect', { x: barX + idx * segW, y: barY, width: segW, height: barH, fill: lvl.color, stroke: 'rgba(0,0,0,0.3)', 'stroke-width': 0.5 });
    svg('text', { x: barX + idx * segW + segW / 2, y: barY + barH + 9, fill: '#cbd5e1', 'font-size': 7.5, 'font-weight': '600', 'text-anchor': 'middle' }, lvl.label);
  });
}

function drawMjoCpcPrecipitation() {
  if (currentAmplitude < 1) return;
  const phase = currentPhase || 1;
  const isGlobal = mapView === 'global';

  // Obter imagem base64 pré-carregada ou caminho do arquivo
  let dataUri = null;
  if (typeof CPC_MJO_PRECIP_DATA !== 'undefined') {
    const subset = isGlobal ? CPC_MJO_PRECIP_DATA.global : CPC_MJO_PRECIP_DATA.regional;
    if (subset) dataUri = subset[phase];
  }
  const imgHref = dataUri || (isGlobal
    ? `data/cpc-precip/cpc_mjo_precip_p${phase}.png`
    : `data/cpc-precip/cpc_mjo_precip_reg_p${phase}.png`);

  const ampScale = Math.min(2.4, Math.max(0.65, currentAmplitude / 1.5));
  const opacity = Math.min(1.0, 0.70 + 0.20 * ampScale);

  if (isGlobal) {
    // Limites do domínio tropical entre 30°S e 30°N (y: 192.5 a 402.5, H = 210)
    const y30N = (85 - 30) * 560 / 160;
    const y30S = (85 - (-30)) * 560 / 160;

    // Imagem georreferenciada da faixa tropical (0 a 1200 px, altura 210 px)
    svg('image', {
      x: 0,
      y: y30N,
      width: 1200,
      height: y30S - y30N,
      preserveAspectRatio: 'none',
      href: imgHref,
      'xlink:href': imgHref,
      opacity: opacity.toFixed(2)
    });

    // Contornos norte e sul da faixa tropical 30°N e 30°S
    svg('line', { x1: 0, y1: y30N, x2: 1200, y2: y30N, stroke: '#38bdf8', 'stroke-width': 1.0, 'stroke-dasharray': '5 4', opacity: 0.6 });
    svg('line', { x1: 0, y1: y30S, x2: 1200, y2: y30S, stroke: '#38bdf8', 'stroke-width': 1.0, 'stroke-dasharray': '5 4', opacity: 0.6 });

    // Rótulo de fonte e referência
    svg('text', {
      x: 1190, y: y30N + 14,
      fill: '#bae6fd', 'font-size': 10, 'font-weight': '700', 'text-anchor': 'end', 'letter-spacing': 0.5,
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, `Anomalia de Precipitação CPC/NOAA (Fase ${phase}, Wheeler & Hendon 2004)`);

    // Barra de legenda dos compostos CPC
    drawCpcPrecipColorbar(300, 516, 600, 36);
  } else {
    // Visão Regional América do Sul: domínio 85°W–35°W, 15°N–30°S (x: 60 a 460, y: 35 a 323)
    svg('image', {
      x: 60,
      y: 35,
      width: 400,
      height: 288,
      preserveAspectRatio: 'none',
      href: imgHref,
      'xlink:href': imgHref,
      opacity: opacity.toFixed(2)
    });

    // Moldura tracejada suave
    svg('rect', {
      x: 60, y: 35, width: 400, height: 288,
      fill: 'none', stroke: '#38bdf8', 'stroke-width': 1.0, 'stroke-dasharray': '4 4', opacity: 0.5
    });

    svg('text', {
      x: 450, y: 52,
      fill: '#bae6fd', 'font-size': 9.5, 'font-weight': '700', 'text-anchor': 'end',
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, `Precipitação CPC/NOAA · Fase ${phase}`);

    // Barra de legenda compacta na visão regional
    drawCpcPrecipColorbar(60, 476, 520, 36);
  }
}

function drawMjoTropicalVisualizations() {
  if (mjoMode === 'dipoles') {
    if (mapView === 'global') drawMjoConvection();
  } else if (mjoMode === 'chi') {
    drawMjoVelocityPotential();
  } else if (mjoMode === 'cpc_precip') {
    drawMjoCpcPrecipitation();
  } else if (mjoMode === 'track') {
    if (mapView === 'global') drawMjoTrack();
  }
}

function drawGlobalContext(evidence) {
  if (mapView !== 'global') return;

  drawLand();

  // Visualização tropical da MJO: Chi 200, Dipolos NOAA, Trilha 1–8 ou Nenhuma
  // Desenhar Chi antes de TSM, oceanos, PSA, jatos, SESA e ZCAS
  drawMjoTropicalVisualizations();

  // TSM Equatorial no mapa global: desenhada sobre Chi para legibilidade garantida
  if (visibleLayers.sst) {
    const [sx, sy] = project(-135, 0);
    const isAlvarezEvent = isEventMode && activeEventId && activeEventId.includes('alvarez');
    if (isAlvarezEvent) {
      // NÃO desenhar a TSM de ENOS; rótulo "composição de todos os anos"
      svg('text', {
        x: sx, y: sy + 10,
        fill: '#cbd5e1', 'font-size': 13, 'font-weight': '700', 'text-anchor': 'middle',
        stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
      }, 'Composição de todos os anos (sem separação por ENOS)');
    } else if (currentEnso === 'el-nino') {
      // El Niño: cores mais fortes e vibrantes, sobreposta à MJO
      svg('ellipse', { cx: sx, cy: sy, rx: 135, ry: 28, fill: '#dc2626', 'fill-opacity': 0.65, stroke: '#fca5a5', 'stroke-width': 2.2 });
      svg('ellipse', { cx: sx, cy: sy, rx: 80, ry: 15, fill: '#f97316', 'fill-opacity': 0.75, stroke: '#fef08a', 'stroke-width': 1.5 });
      svg('text', { x: sx, y: sy + 46, fill: '#fee2e2', 'font-size': 13, 'font-weight': '700', 'text-anchor': 'middle', stroke: '#450a0a', 'stroke-width': 3, 'paint-order': 'stroke fill' }, 'El Niño · TSM equatorial anômala quente');
    } else if (currentEnso === 'la-nina') {
      // La Niña: cores mais fortes e vibrantes, sobreposta à MJO
      svg('ellipse', { cx: sx, cy: sy, rx: 135, ry: 28, fill: '#1d4ed8', 'fill-opacity': 0.65, stroke: '#93c5fd', 'stroke-width': 2.2 });
      svg('ellipse', { cx: sx, cy: sy, rx: 80, ry: 15, fill: '#0284c7', 'fill-opacity': 0.75, stroke: '#e0f2fe', 'stroke-width': 1.5 });
      svg('text', { x: sx, y: sy + 46, fill: '#e0f2fe', 'font-size': 13, 'font-weight': '700', 'text-anchor': 'middle', stroke: '#082f49', 'stroke-width': 3, 'paint-order': 'stroke fill' }, 'La Niña · TSM equatorial anômala fria');
    } else {
      svg('ellipse', { cx: sx, cy: sy, rx: 130, ry: 20, fill: '#0284c7', 'fill-opacity': 0.20, stroke: '#38bdf8', 'stroke-dasharray': '4 4', 'stroke-width': 1.2 });
      svg('text', { x: sx, y: sy + 38, fill: '#e2e8f0', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'ENOS Neutro · TSM equatorial próxima à média (qualitativo)');
    }
  }

  // Rótulos de referência dos Oceanos (sobre Chi)
  for (const [lon, lat, label] of [[80, -48, 'OCEANO ÍNDICO'], [-145, -48, 'OCEANO PACÍFICO'], [-30, -48, 'OCEANO ATLÂNTICO']]) {
    const [x, y] = project(lon, lat);
    svg('text', { x, y, fill: '#5a829e', 'font-size': 14, 'letter-spacing': 2.5, 'text-anchor': 'middle', 'font-weight': '600' }, label);
  }
}

function getPsaSourceType(season = currentSeason, enso = currentEnso, phase = currentPhase) {
  const p = Number(phase);
  // Fases 2 a 5 da MJO e El Niño: convecção tropical / ciclone tropical no Pacífico Oeste/Central
  if (enso === 'el-nino' && (p >= 2 && p <= 5)) return 'ciclone_tropical';
  if (p >= 2 && p <= 5) return 'ciclone_tropical';
  // Fases 6, 7, 8, 1 ou La Niña: convecção e divergência ancoradas na ZCPS (Zona de Convergência do Pacífico Sul)
  return 'zcps';
}

function drawPsa() {
  if (!visibleLayers.psa) return;
  const psaStroke = '#c084fc';
  const sourceType = getPsaSourceType(currentSeason, currentEnso, currentPhase);

  if (mapView === 'global') {
    // 1. Destaque da Fonte Convectiva: Ciclone Tropical vs. ZCPS (Alvarez & Grimm)
    if (sourceType === 'ciclone_tropical') {
      const [srcX, srcY] = project(155, -12);
      svg('circle', {
        cx: srcX, cy: srcY, r: 16,
        fill: 'rgba(56, 189, 248, 0.18)',
        stroke: '#38bdf8', 'stroke-width': 1.6, 'stroke-dasharray': '3 3'
      });
      svg('circle', {
        cx: srcX, cy: srcY, r: 24,
        fill: 'none',
        stroke: 'rgba(56, 189, 248, 0.45)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4'
      });
      svg('text', {
        x: srcX, y: srcY + 5,
        fill: '#38bdf8', 'font-size': 14, 'font-weight': '800', 'text-anchor': 'middle'
      }, '🌀');

      // Traçado conectando a fonte tropical ao guia do PSA
      const [destX, destY] = project(175, -45);
      svg('path', {
        d: `M ${srcX} ${srcY + 16} Q ${srcX + 20} ${srcY + 65} ${destX} ${destY}`,
        fill: 'none', stroke: '#38bdf8', 'stroke-width': 2, 'stroke-dasharray': '5 4'
      });
      svg('text', {
        x: srcX + 22, y: srcY - 10,
        fill: '#7dd3fc', 'font-size': 11, 'font-weight': '700',
        stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
      }, 'Fonte: Ciclone Tropical / Pacífico Oeste (Alvarez & Grimm)');
    } else {
      // Eixo da ZCPS (Zona de Convergência do Pacífico Sul / SPCZ)
      const p1 = project(165, -10);
      const p2 = project(185, -20);
      const p3 = project(215, -30);
      svg('path', {
        d: `M ${p1[0]} ${p1[1]} Q ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`,
        fill: 'none', stroke: '#f59e0b', 'stroke-width': 4.5, opacity: 0.8, 'stroke-dasharray': '8 4'
      });
      svg('text', {
        x: p2[0] - 10, y: p2[1] - 12,
        fill: '#fde047', 'font-size': 11, 'font-weight': '700',
        stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
      }, 'Fonte: Eixo da ZCPS (SPCZ) · Alvarez & Grimm');

      // Traçado conectando o eixo da ZCPS ao trem PSA
      const [psaTargetX, psaTargetY] = project(-145, -50);
      svg('path', {
        d: `M ${p3[0]} ${p3[1]} Q ${p3[0] + 15} ${p3[1] + 45} ${psaTargetX} ${psaTargetY}`,
        fill: 'none', stroke: '#f59e0b', 'stroke-width': 2, 'stroke-dasharray': '5 4'
      });
    }

    // 2. Centros do Trem de Ondas PSA (mesmos de Alvarez e Grimm)
    const centers = [
      { lon: 135, lat: -40, sign: '−', r: 10 },
      { lon: 175, lat: -45, sign: '+', r: 16 },
      { lon: -145, lat: -50, sign: '−', r: 22 },
      { lon: -100, lat: -50, sign: '+', r: 22 },
      { lon: -65, lat: -40, sign: '−', r: 14 },
      { lon: -30, lat: -35, sign: '+', r: 14 }
    ];
    const pts = centers.map(c => project(c.lon, c.lat));

    // Traçado guia conectando os centros com linha tracejada
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i][0]} ${pts[i][1]}`;
    }

    svg('path', {
      d,
      fill: 'none', stroke: psaStroke, 'stroke-width': 1.8, 'stroke-dasharray': '6 5'
    });

    // Centros de ação da EOF1 de v200: contorno sem preenchimento, cor própria, "+" / "−"
    for (let i = 0; i < centers.length; i++) {
      const c = centers[i];
      const [cx, cy] = pts[i];
      svg('circle', {
        cx, cy, r: c.r,
        fill: 'none',
        stroke: psaStroke,
        'stroke-width': 1.8
      });
      svg('text', {
        x: cx, y: cy + 4.5,
        fill: '#f3e8ff', 'font-size': 13, 'font-weight': '800', 'text-anchor': 'middle'
      }, c.sign);
    }

    const labelPos = project(-115, -60);
    const sourceLabel = sourceType === 'ciclone_tropical' ? 'Ciclone Tropical' : 'ZCPS';
    svg('text', {
      x: labelPos[0], y: labelPos[1],
      fill: '#f3e8ff', 'font-size': 11.5, 'font-weight': '700', 'text-anchor': 'middle',
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, `Padrão PSA · Trem de Ondas · Fonte: ${sourceLabel} (Alvarez & Grimm)`);
  } else {
    // Visão Regional: trem de onda entrando pelo Pacífico SE, cruzando o extremo sul e saindo no Atlântico
    const pts = [
      project(-85, -46),
      project(-65, -40),
      project(-38, -35)
    ];
    const d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} Q ${pts[1][0].toFixed(1)} ${pts[1][1].toFixed(1)} ${pts[2][0].toFixed(1)} ${pts[2][1].toFixed(1)}`;
    svg('path', {
      d,
      fill: 'none', stroke: psaStroke, 'stroke-width': 1.8, 'stroke-dasharray': '6 5'
    });

    // Centro da Patagônia/extremo sul
    const [cx1, cy1] = project(-65, -40);
    svg('circle', { cx: cx1, cy: cy1, r: 14, fill: 'none', stroke: psaStroke, 'stroke-width': 1.8 });
    svg('text', { x: cx1, y: cy1 + 4.5, fill: '#f3e8ff', 'font-size': 13, 'font-weight': '800', 'text-anchor': 'middle' }, '−');

    // Centro do Atlântico Sudoeste
    const [cx2, cy2] = project(-38, -35);
    svg('circle', { cx: cx2, cy: cy2, r: 14, fill: 'none', stroke: psaStroke, 'stroke-width': 1.8 });
    svg('text', { x: cx2, y: cy2 + 4.5, fill: '#f3e8ff', 'font-size': 13, 'font-weight': '800', 'text-anchor': 'middle' }, '+');

    const [lblX, lblY] = project(-68, -48);
    const sourceLabel = sourceType === 'ciclone_tropical' ? 'Ciclone Tropical' : 'ZCPS';
    svg('text', {
      x: lblX, y: lblY,
      fill: '#f3e8ff', 'font-size': 11, 'font-weight': '700', 'text-anchor': 'middle',
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, `Padrão PSA · Trem de Ondas · Fonte: ${sourceLabel} (Alvarez & Grimm)`);
  }
}

function drawSallj() {
  if (!visibleLayers.sallj) return;

  const effectiveState = getEffectiveSalljState(currentSeason, currentPhase);

  // A intensidade visual (espessura) escala com f = min(A, 1) no modo Automático; nos modos manuais, não.
  const isAuto = salljState === 'auto';
  const f = isAuto ? Math.min(Number(currentAmplitude), 1.0) : 1.0;

  let baseStroke = 3.2;
  const startPt = project(-63, -17);
  let midPt, endPt;
  let arrowAngle = 0;
  let subLabel = '';

  if (effectiveState === 'forte') {
    // Forte: seta longa e grossa até o setor SESA
    baseStroke = 4.2;
    midPt = project(-61, -22.5);
    endPt = project(-58, -29.5);
    arrowAngle = Math.atan2(endPt[1] - midPt[1], endPt[0] - midPt[0]);
    stateLabel = 'jato forte — mais chuva e extremos no SESA (Liebmann et al. 2004)';
  } else if (effectiveState === 'fraco') {
    // Fraco: seta curta curvando para leste, em direção ao setor ZCAS
    baseStroke = 2.2;
    midPt = project(-57, -19);
    endPt = project(-47, -21);
    arrowAngle = Math.atan2(endPt[1] - midPt[1], endPt[0] - midPt[0]);
    stateLabel = 'jato fraco — umidade desviada para a ZCAS (Liebmann et al. 2004; Muza et al. 2009)';
  } else {
    // Climatológico: seta média (atual)
    baseStroke = 3.2;
    midPt = project(-62, -20);
    endPt = project(-61, -23.5);
    arrowAngle = Math.atan2(endPt[1] - midPt[1], endPt[0] - midPt[0]);
    if (isAuto && currentSeason === 'JJA') {
      stateLabel = 'no inverno, altos níveis dominam — Alvarez et al. 2013';
    }
  }

  const strokeWidth = baseStroke * f;

  svg('path', {
    d: `M ${startPt[0]} ${startPt[1]} Q ${midPt[0]} ${midPt[1]} ${endPt[0]} ${endPt[1]}`,
    fill: 'none', stroke: '#34d399', 'stroke-width': strokeWidth
  });

  const arrowLen = Math.max(7, 13 * (strokeWidth / 3.2));
  const arrowWidth = Math.max(3.5, 6.5 * (strokeWidth / 3.2));
  const tipX = endPt[0], tipY = endPt[1];
  const leftX = tipX - arrowLen * Math.cos(arrowAngle) + arrowWidth * Math.sin(arrowAngle);
  const leftY = tipY - arrowLen * Math.sin(arrowAngle) - arrowWidth * Math.cos(arrowAngle);
  const rightX = tipX - arrowLen * Math.cos(arrowAngle) - arrowWidth * Math.sin(arrowAngle);
  const rightY = tipY - arrowLen * Math.sin(arrowAngle) + arrowWidth * Math.cos(arrowAngle);

  svg('polygon', {
    points: `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`,
    fill: '#34d399'
  });

  // Rótulos do SALLJ a oeste dos Andes, sobre o Pacífico
  const isReg = mapView === 'regional';
  const labelLon = isReg ? -83 : -76;
  const anchor = isReg ? 'start' : 'end';
  const [sx, sy] = project(labelLon, -18.5);
  svg('text', {
    x: sx, y: sy,
    fill: '#6ee7b7', 'font-size': 11.5, 'font-weight': '700', 'text-anchor': anchor,
    stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
  }, 'SALLJ (~850 hPa)');

  const [subX, subY] = project(labelLon, -20.5);
  svg('text', {
    x: subX, y: subY,
    fill: '#a7f3d0', 'font-size': 9.5, 'font-weight': '600', 'text-anchor': anchor,
    stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
  }, 'dipolo ZCAS × SESA (Liebmann 2004; Nogués-Paegle & Mo 1997)');

  if (stateLabel) {
    const [stX, stY] = project(labelLon, -22.5);
    svg('text', {
      x: stX, y: stY,
      fill: '#fde047', 'font-size': 9.0, 'font-weight': '600', 'text-anchor': anchor,
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, stateLabel);
  }
}

function drawJets() {
  if (!visibleLayers.jets) return;

  const width = (currentEnso === 'el-nino') ? 4.5 : (currentEnso === 'la-nina') ? 2.2 : 3.2;

  if (mapView === 'global') {
    // Mapear de lon = 20° a 380° de forma contínua em projeção equirretangular (1200x560)
    const pts = [];
    for (let lon = 20; lon <= 380; lon += 2) {
      const lat = getSubtropicalJetLat(lon, currentSeason);
      const x = ((lon - 20) / 360) * 1200;
      const y = ((85 - lat) / 160) * 560;
      pts.push([x, y]);
    }
    const d = 'M ' + pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ');
    svg('path', { d, fill: 'none', stroke: '#38bdf8', 'stroke-width': width, 'stroke-dasharray': '8 5' });

    // Rótulo sobre o Pacífico central para não sobrepor continentes nem feições equatoriais
    const latLbl = getSubtropicalJetLat(-140, currentSeason);
    const [jx, jy] = project(-140, latLbl);
    svg('text', {
      x: jx, y: jy - 9,
      fill: '#7dd3fc', 'font-size': 12, 'font-weight': '600', 'text-anchor': 'middle',
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, 'Jato Subtropical (~200 hPa · onda planetária)');
  } else {
    // Na visão regional, amostragem densa da onda ao cruzar o Pacífico, Andes, SESA e Atlântico
    const pts = [];
    for (let lon = -85; lon <= -35; lon += 1) {
      const lat = getSubtropicalJetLat(lon, currentSeason);
      pts.push(project(lon, lat));
    }
    const d = 'M ' + pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ');
    svg('path', { d, fill: 'none', stroke: '#38bdf8', 'stroke-width': width, 'stroke-dasharray': '8 5' });

    // Seta direcional no extremo leste (Atlântico) indicando fluxo zonal de oeste para leste
    if (pts.length >= 2) {
      const lastPt = pts[pts.length - 1];
      const prevPt = pts[pts.length - 2];
      const angle = Math.atan2(lastPt[1] - prevPt[1], lastPt[0] - prevPt[0]);
      const headLen = 10;
      const ax1 = lastPt[0] - headLen * Math.cos(angle - Math.PI / 6);
      const ay1 = lastPt[1] - headLen * Math.sin(angle - Math.PI / 6);
      const ax2 = lastPt[0] - headLen * Math.cos(angle + Math.PI / 6);
      const ay2 = lastPt[1] - headLen * Math.sin(angle + Math.PI / 6);
      svg('polygon', {
        points: `${lastPt[0].toFixed(1)},${lastPt[1].toFixed(1)} ${ax1.toFixed(1)},${ay1.toFixed(1)} ${ax2.toFixed(1)},${ay2.toFixed(1)}`,
        fill: '#38bdf8'
      });
    }

    // Na visão regional, posicionar rótulo sobre o Pacífico/Chile para não sobrepor o continente/SESA
    const latLbl = getSubtropicalJetLat(-80, currentSeason);
    const [jx, jy] = project(-80, latLbl);
    svg('text', {
      x: jx, y: jy - 9,
      fill: '#7dd3fc', 'font-size': 11, 'font-weight': '600', 'text-anchor': 'start',
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, 'Jato Subtropical (~200 hPa · onda)');
  }
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
    drawMjoTropicalVisualizations();
  }

  // Jatos (Subtropical e SALLJ) e Teleconexão PSA
  drawJets();
  drawSallj();
  drawPsa();

  // Delimitação do SESA: identificada quando camada ativa
  const cases = displayAllEvidences();
  const primaryEvidence = cases.primary;
  if (visibleLayers.sesa) {
    const isSesaHighlighted = currentAmplitude >= 1 && primaryEvidence && primaryEvidence.region === 'SESA';
    polygon(REGIONS.SESA_POLY, isSesaHighlighted ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.03)', isSesaHighlighted ? '#38bdf8' : '#486780', isSesaHighlighted ? 2.2 : 1.5);
    const [sesaLabelX, sesaLabelY] = project(-50, -25.5);
    svg('text', { x: sesaLabelX, y: sesaLabelY, fill: isSesaHighlighted ? '#7dd3fc' : '#8ab8d4', 'font-size': 16, 'font-weight': '700', 'text-anchor': 'middle' }, 'SESA');
  }

  // Delimitação da ZCAS: identificada quando camada ativa
  if (visibleLayers.zcas) {
    const isZcasHighlighted = currentAmplitude >= 1 && primaryEvidence && primaryEvidence.region === 'ZCAS';
    polygon(REGIONS.ZCAS_POLY, isZcasHighlighted ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.02)', isZcasHighlighted ? '#2dd4bf' : '#3e5c76', isZcasHighlighted ? 2.2 : 1.4, '4 3');
    const [zx, zy] = project(-35, -20.5);
    svg('text', { x: zx, y: zy, fill: isZcasHighlighted ? '#5eead4' : '#6b8ca8', 'font-size': 16, 'font-weight': '700', 'text-anchor': 'middle' }, 'ZCAS');
  }

  // Destaque condicional do caso documentado (somente quando A >= 1)
  if (currentAmplitude >= 1 && primaryEvidence) {
    let location = [-45, -23];
    if (primaryEvidence.region === 'SESA') location = [-55, -34];
    else if (primaryEvidence.region === 'ZCAS') location = [-45, -23];
    else if (primaryEvidence.region === 'LESTE') location = [-40, -14];
    else if (primaryEvidence.region === 'SUDESTE') location = [-46, -23];
    if (primaryEvidence.anchor) location = primaryEvidence.anchor;

    const [x, y] = project(...location);

    // Nuvem de chuva com setas de precipitação e seta de aumento
    svg('path', {
      d: `M ${x - 22} ${y} C ${x - 38} ${y - 16}, ${x - 17} ${y - 30}, ${x - 5} ${y - 21} C ${x + 2} ${y - 43}, ${x + 31} ${y - 31}, ${x + 25} ${y - 13} C ${x + 44} ${y - 10}, ${x + 33} ${y + 5}, ${x + 20} ${y + 4} L ${x - 22} ${y + 4} Z`,
      fill: '#73d8da', stroke: '#b4f5f0', 'stroke-width': 2
    });
    for (const dx of [-16, 0, 16]) {
      svg('line', {
        x1: x + dx, y1: y + 12, x2: x + dx - 5, y2: y + 24,
        stroke: '#73d8da', 'stroke-width': 3, 'stroke-linecap': 'round'
      });
    }
    svg('text', { x: x + 47, y: y + 5, fill: '#aaf4e7', 'font-size': 24, 'font-weight': '800' }, '↑');

    // Rótulo descritivo posicionado no Atlântico para legibilidade
    const labelText = primaryEvidence.chance || 'Mais chance de semana chuvosa';
    const isSesa = primaryEvidence.region === 'SESA';
    const oceanLon = isSesa ? -44 : -38;
    const oceanLat = location[1] !== undefined ? location[1] : (isSesa ? -34 : -23);
    let [tx, ty] = project(oceanLon, oceanLat);

    const isRegional = mapView === 'regional';
    const maxTx = isRegional ? 395 : 940;
    if (tx > maxTx) tx = maxTx;

    svg('line', {
      x1: x + 30, y1: y,
      x2: tx - 6, y2: ty - 3,
      stroke: 'rgba(115, 216, 218, 0.45)',
      'stroke-width': 1.1,
      'stroke-dasharray': '3 3'
    });

    svg('text', {
      x: tx, y: ty,
      fill: '#c6f6ef',
      'font-size': isRegional ? 12 : 13,
      'font-weight': '700',
      'text-anchor': 'start',
      stroke: '#081726',
      'stroke-width': 2.5,
      'paint-order': 'stroke fill'
    }, labelText);
  }

  // Mecanismos físicos dos autores no mapa (aparecem junto com o caso; somem com A < 1)
  if (currentAmplitude >= 1) {
    const alv = cases.alvarez;
    const spec = cases.specific;

    // 1. Mecanismo Tropical (Alvarez et al. 2016): sinal do χ200 sobre a AS tropical
    if (alv && alv.tropicalChi) {
      const [tcx, tcy] = project(-53, -7.5);
      const isConv = alv.tropicalChi === 'convergencia';
      const bgFill = isConv ? 'rgba(245, 158, 11, 0.20)' : 'rgba(56, 189, 248, 0.20)';
      const strCol = isConv ? '#f59e0b' : '#38bdf8';
      const txtCol = isConv ? '#fef08a' : '#bae6fd';
      const labelChi = isConv
        ? 'χ₂₀₀ > 0 — convergência / subsidência'
        : 'χ₂₀₀ < 0 — divergência / subida';

      svg('rect', {
        x: tcx - 120, y: tcy - 14, width: 240, height: 26, rx: 6,
        fill: bgFill, stroke: strCol, 'stroke-width': 1.4, 'stroke-dasharray': '4 2'
      });
      svg('text', {
        x: tcx, y: tcy + 4,
        fill: txtCol, 'font-size': 11, 'font-weight': '700',
        'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2, 'paint-order': 'stroke fill'
      }, labelChi);
    }

    // 2. Mecanismo Extratropical (Alvarez et al. 2016): centro C ou A (trem de ondas)
    if (alv && alv.extratropical) {
      const ext = alv.extratropical;
      const [ecx, ecy] = project(ext.lon, ext.lat);
      const isC = ext.type === 'C';
      const circleFill = isC ? 'rgba(14, 165, 233, 0.30)' : 'rgba(245, 158, 11, 0.30)';
      const circleStroke = isC ? '#38bdf8' : '#f59e0b';
      const letterCol = isC ? '#38bdf8' : '#fbbf24';

      svg('circle', {
        cx: ecx, cy: ecy, r: 16,
        fill: circleFill, stroke: circleStroke, 'stroke-width': 2
      });
      svg('text', {
        x: ecx, y: ecy + 6,
        fill: letterCol, 'font-size': 16, 'font-weight': '900',
        'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2, 'paint-order': 'stroke fill'
      }, ext.type);

      // Deslocar o rótulo para não sobrepor a nuvem nem os círculos do PSA
      let lx = ecx, ly = ecy + 27;
      let textAnchor = 'middle';

      if (alv.id === 'DJF-alvarez-3-4') {
        lx = ecx - 20;
        ly = ecy + 4;
        textAnchor = 'end';
      } else if (alv.id === 'DJF-alvarez-8-1') {
        lx = ecx;
        ly = ecy - 22;
        textAnchor = 'middle';
      } else if (alv.id === 'MAM-alvarez-1') {
        lx = ecx - 20;
        ly = ecy + 4;
        textAnchor = 'end';
      } else if (alv.id === 'JJA-alvarez-8') {
        lx = ecx + 22;
        ly = ecy + 18;
        textAnchor = 'start';
      } else if (alv.id === 'SON-alvarez-7-8') {
        lx = ecx - 20;
        ly = ecy - 6;
        textAnchor = 'end';
      } else if (alv.id === 'SON-alvarez-1') {
        lx = ecx - 20;
        ly = ecy + 4;
        textAnchor = 'end';
      }

      svg('text', {
        x: lx, y: ly,
        fill: '#cbd5e1', 'font-size': 10, 'font-weight': '600',
        'text-anchor': textAnchor, stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
      }, 'trem de ondas (Alvarez et al. 2016)');
    }

    // 3. Marcador qualitativo "fonte" (Fernandes & Grimm 2023)
    if (spec && spec.sourceMarker) {
      if (mapView === 'global') {
        const [scx, scy] = project(spec.sourceMarker.lon, spec.sourceMarker.lat);
        svg('circle', {
          cx: scx, cy: scy, r: 18,
          fill: 'rgba(245, 158, 11, 0.25)', stroke: '#f59e0b', 'stroke-width': 1.8, 'stroke-dasharray': '4 3'
        });
        svg('text', {
          x: scx, y: scy - 24,
          fill: '#fcd34d', 'font-size': 12, 'font-weight': '800',
          'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2, 'paint-order': 'stroke fill'
        }, 'fonte');
        svg('text', {
          x: scx, y: scy + 30,
          fill: '#fef08a', 'font-size': 10, 'font-weight': '600',
          'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
        }, 'convecção subtropical');
      } else {
        const edgeY = project(-85, spec.sourceMarker.lat)[1];
        svg('text', {
          x: 10, y: edgeY,
          fill: '#fcd34d', 'font-size': 11, 'font-weight': '700',
          'text-anchor': 'start', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
        }, '← fonte: convecção subtropical');
      }
    }
  }

  // Texto no mapa quando amplitude < 1: "MJO fraca (amplitude < 1) — sem padrão associado"
  if (currentAmplitude < 1) {
    const bannerX = mapView === 'global' ? 600 : 320;
    const bannerY = 46;
    svg('rect', {
      x: bannerX - 210, y: bannerY - 18, width: 420, height: 32, rx: 6,
      fill: 'rgba(15, 23, 42, 0.90)', stroke: '#475569', 'stroke-width': 1.2
    });
    svg('text', {
      x: bannerX, y: bannerY + 4,
      fill: '#94a3b8', 'font-size': 13, 'font-weight': '700', 'text-anchor': 'middle'
    }, 'MJO fraca (amplitude < 1) — sem padrão associado');
  }

  $('mapTitle').textContent = mapView === 'global' ? 'Visão global: MJO, Pacífico e América do Sul' : 'América do Sul (visão regional)';
  $('mapDesc').textContent = (primaryEvidence && currentAmplitude >= 1)
    ? `${primaryEvidence.regionName || primaryEvidence.region}: ${primaryEvidence.text} Símbolo regional sem magnitude ou extensão quantitativa.`
    : (currentAmplitude < 1
      ? 'MJO fraca (amplitude < 1) — sem padrão associado.'
      : 'Sem resultado documentado para esta combinação.');
}

function generateNarrationText(season, enso, phase, evidence) {
  const seasonNames = {
    DJF: 'Verão austral (DJF)',
    MAM: 'Outono austral (MAM)',
    JJA: 'Inverno austral (JJA)',
    SON: 'Primavera austral (SON)'
  };
  const ensoNames = {
    'el-nino': 'El Niño',
    'neutro': 'ENOS Neutro',
    'la-nina': 'La Niña',
    'todos': 'Todos os anos'
  };
  const phaseInfo = getMjoPhaseCoords(phase, season);
  const chiRef = MJO_CHI_CENTERS[Number(phase)];
  const [adLon] = chiRef ? chiRef.div : [0];
  const [scLon] = chiRef ? chiRef.conv : [0];
  const adLonStr = adLon < 0 ? `${Math.abs(adLon)} graus oeste` : `${adLon} graus leste`;
  const scLonStr = scLon < 0 ? `${Math.abs(scLon)} graus oeste` : `${scLon} graus leste`;

  let text = `Em 200 hPa, o potencial de velocidade (χ₂₀₀) na fase ${phase} posiciona o centro de divergência em altitude e convecção ativa em ${adLonStr} e a convergência com subsidência em ${scLonStr}, no contexto de convecção nominal sobre ${phaseInfo.region}. `;
  if (isEventMode && evidence && evidence.enso === 'todos') {
    text += `Configuração selecionada: ${seasonNames[season]}, na composição de todos os anos (sem separação por ENOS). `;
  } else {
    text += `Configuração selecionada: ${seasonNames[season]}, com ${ensoNames[enso] || 'Todos os anos'}. `;
  }

  // 1. Contexto esquemático da TSM e dos Jatos
  if (enso === 'todos' || (isEventMode && evidence && evidence.enso === 'todos')) {
    text += `Na composição de todos os anos (sem estratificação por ENOS), a análise reflete a média geral. O Jato Subtropical exibe espessura de referência intermediária. `;
  } else if (enso === 'el-nino') {
    text += `No Pacífico equatorial central e leste, o padrão qualitativo indica anomalias térmicas positivas da TSM. Em altitude, o traçado de referência do Jato Subtropical (~200 hPa) ilustra o guia de ondas com espessura qualitativa reforçada sob circulação de Hadley intensificada no El Niño. `;
  } else if (enso === 'la-nina') {
    text += `No Pacífico equatorial central e leste, o padrão qualitativo indica anomalias térmicas negativas da TSM. Em altitude, o traçado de referência do Jato Subtropical ilustra o guia de ondas com espessura qualitativa reduzida na La Niña. `;
  } else {
    text += `No Pacífico equatorial, a TSM encontra-se próxima à referência climatológica neutra (lembrando que anomalias locais ocorrem na natureza). O Jato Subtropical exibe espessura de referência intermediária. `;
  }

  if (season === 'DJF') {
    text += `A posição latitudinal adotada para o traçado esquemático do jato situa-se em torno de 32 graus sul no verão austral. `;
  } else if (season === 'JJA') {
    text += `No inverno austral, o traçado do jato posiciona-se em torno de 27 graus sul. `;
  } else {
    text += `Nas estações de transição sazonal (MAM e SON), o traçado do jato posiciona-se em torno de 29 a 30 graus sul. `;
  }

  // SALLJ direcional (Liebmann et al. 2004; Nogués-Paegle & Mo 1997)
  const p = Number(phase);
  const effectiveSallj = getEffectiveSalljState(season, phase);
  if (effectiveSallj === 'forte') {
    text += `Em baixos níveis, o SALLJ (~850 hPa) atua direcionado até o SESA como jato forte — mais chuva e extremos no SESA (Liebmann et al. 2004; dipolo: Nogués-Paegle & Mo 1997). `;
  } else if (effectiveSallj === 'fraco') {
    text += `Em baixos níveis, o SALLJ (~850 hPa) curva para leste/nordeste, em direção ao setor ZCAS como jato fraco — umidade desviada para a ZCAS (Muza et al. 2009; Liebmann et al. 2004; dipolo: Nogués-Paegle & Mo 1997). `;
  } else {
    if (salljState === 'auto' && season === 'JJA') {
      text += `Em baixos níveis, o SALLJ (~850 hPa) atua em traçado climatológico (no inverno, altos níveis dominam — Alvarez et al. 2013; dipolo ZCAS × SESA: Liebmann et al. 2004; Nogués-Paegle & Mo 1997). `;
    } else {
      text += `Em baixos níveis, o SALLJ (~850 hPa) atua no traçado neutro ao longo dos Andes (dipolo ZCAS × SESA: Liebmann et al. 2004; Nogués-Paegle & Mo 1997). `;
    }
  }

  // Nota de La Niña em DJF (fases 2–8)
  if (season === 'DJF' && enso === 'la-nina' && p >= 2 && p <= 8) {
    text += `Nota de La Niña: extremos no SESA diminuem mesmo quando a chuva média aumenta (subsidência favorecida pela La Niña). `;
  }

  // Nota de inverno em JJA
  if (season === 'JJA') {
    text += `No inverno, extremos no SESA ligam-se a um ciclone travado por anticiclone perto da Península Antártica (Alvarez et al. 2013); a relação com as fases da MJO não foi estabelecida. `;
  }

  // 2. Efeitos verificados e mecanismos dos autores
  if (evidence) {
    text += `Resultado documentado (${evidence.source}): ${evidence.text} `;
    if (evidence.tropicalChi) {
      text += `Mecanismo tropical em 200 hPa: ${evidence.tropicalChi === 'convergencia' ? 'convergência e subsidência anômala (χ₂₀₀ > 0)' : 'divergência e movimentos ascendentes (χ₂₀₀ < 0)'} sobre a América do Sul tropical. `;
    }
    if (evidence.extratropical) {
      text += `Mecanismo extratropical: ${evidence.extratropical.desc}, associado a trem de ondas de Rossby (Alvarez et al. 2016). `;
    }
    if (evidence.source_convection) {
      text += `Fonte convectiva: ${evidence.source_convection}. `;
    }
    if (evidence.note) {
      text += `Nota observacional: ${evidence.note} `;
    }
  } else {
    text += `Sem resultado documentado para esta combinação nesta síntese documental. As feições da base cartográfica e física permanecem ativas para exploração no sandbox. `;
  }

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

function formatTextForSpeech(raw) {
  if (!raw) return '';
  let s = raw;

  // 1. Remover parênteses de citações e referências a figuras para leitura fluida
  s = s.replace(/\s*\((?:Fernandes|Grimm|Jones|Roy|Alvarez|Vera|Kiladis|Liebmann|Wheeler|Hendon)[^)]*\)/gi, '');
  s = s.replace(/\s*\((?:Figs?\.|Seção|Seções)[^)]*\)/gi, '');
  s = s.replace(/\s*\(20\d\d\)/g, '');
  s = s.replace(/et\s+al\./gi, 'e colaboradores');

  // 2. Coordenadas geográficas: converter 'S' e 'W' para português falado natural
  s = s.replace(/(\d+)[°º]\s*S\s*[–-]\s*(\d+)[°º]\s*S/gi, '$1 a $2 graus sul');
  s = s.replace(/(\d+)[°º]\s*W\s*[–-]\s*(\d+)[°º]\s*W/gi, '$1 a $2 graus oeste');
  s = s.replace(/(\d+)[°º]\s*N\s*[–-]\s*(\d+)[°º]\s*N/gi, '$1 a $2 graus norte');
  s = s.replace(/(\d+)[°º]\s*E\s*[–-]\s*(\d+)[°º]\s*E/gi, '$1 a $2 graus leste');
  s = s.replace(/(\d+)[°º]\s*S\b/gi, '$1 graus sul');
  s = s.replace(/(\d+)[°º]\s*W\b/gi, '$1 graus oeste');
  s = s.replace(/(\d+)[°º]\s*N\b/gi, '$1 graus norte');
  s = s.replace(/(\d+)[°º]\s*E\b/gi, '$1 graus leste');

  // 3. Unidades de pressão e altitude (hPa -> hectopascais, ~ -> cerca de)
  s = s.replace(/~200\s*hPa/gi, 'cerca de duzentos hectopascais');
  s = s.replace(/~850\s*hPa/gi, 'cerca de oitocentos e cinquenta hectopascais');
  s = s.replace(/(\d+)\s*hPa\b/gi, '$1 hectopascais');
  s = s.replace(/~/g, 'cerca de ');

  // 4. Siglas e termos técnicos para pronúncia em português
  s = s.replace(/(?:jato\s+(?:de\s+baixos\s+níveis\s+)?)?\bSALLJ\b/gi, 'jato de baixos níveis SALLJ');
  s = s.replace(/\bTSM\b/g, 'temperatura da superfície do mar');

  // CESA sem duplicar "região"
  s = s.replace(/(?<!região\s+)\bCESA\b/g, 'região CESA');


  s = s.replace(/\bNorthern\b/g, 'Norte');

  s = s.replace(/χ₂₀₀|χ200/g, 'qui duzentos');
  s = s.replace(/\bZ200\b/g, 'geopotencial em duzentos hectopascais');
  s = s.replace(/\bZ_\{200\}\b/g, 'geopotencial em duzentos hectopascais');
  s = s.replace(/\b2\.\s*Circulação e teleconexão:\s*/gi, 'Sobre a circulação e teleconexão: ');
  s = s.replace(/\b3\.\s*Chuva média:\s*/gi, 'Em relação à chuva média: ');
  s = s.replace(/\b4\.\s*Frequência de extremos:\s*/gi, 'Em relação aos extremos de chuva: ');
  s = s.replace(/Mecanismo dinâmico:\s*/gi, 'Quanto ao mecanismo dinâmico: ');
  s = s.replace(/Limitações e incertezas:\s*/gi, 'Sobre as limitações: ');
  s = s.replace(/Limites físicos da síntese:\s*/gi, 'Sobre os limites físicos: ');

  // 6. Expressões de amplitude
  s = s.replace(/A\s*<\s*1/gi, 'amplitude menor que um');
  s = s.replace(/A\s*≥\s*1/gi, 'amplitude maior ou igual a um');
  s = s.replace(/Amplitude RMM selecionada:\s*([\d,.]+)\./gi, 'Amplitude RMM selecionada: $1.');

  // 7. Pontuação e limpeza
  s = s.replace(/\s*–\s*/g, ' a ');
  s = s.replace(/\s*—\s*/g, ', ');
  s = s.replace(/\s+/g, ' ');
  s = s.replace(/\s*([,.:;])\s*/g, '$1 ');
  s = s.replace(/\s+,/g, ',');
  s = s.replace(/\.{2,}/g, '.');

  return s.trim();
}

function speakCurrentNarration() {
  if (typeof forecastModeActive !== 'undefined' && forecastModeActive) return;
  const evidence = displayEvidence();
  const text = generateNarrationText(currentSeason, currentEnso, currentPhase, evidence);

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
  const spokenText = formatTextForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = 'pt-BR';
  if (!ptVoice) updatePortugueseVoice();
  if (ptVoice) utterance.voice = ptVoice;
  utterance.rate = 1.0;

  utterance.onstart = () => { updateVoiceUI('speaking'); };
  utterance.onend = () => { updateVoiceUI('idle'); };
  utterance.onerror = () => { updateVoiceUI('idle'); };

  speechSynth.speak(utterance);
  updateVoiceUI('speaking');
}

function setMjoMode(mode) {
  mjoMode = mode; // 'dipoles' | 'chi' | 'cpc_precip' | 'track' | 'none'
  update();
}

function exitEventMode() {
  if (isEventMode) {
    isEventMode = false;
    activeEventId = null;
    const eg = $('ensoGroup');
    if (eg) eg.style.display = '';
    document.querySelectorAll('.event-select').forEach(sel => { sel.value = ''; });
    if ($('eventNotice')) $('eventNotice').textContent = '';
  }
}

function selectEvent(eventId) {
  if (!eventId) {
    exitEventMode();
    update();
    return;
  }
  const c = DOCUMENTED_CASES.find(item => item.id === eventId);
  if (!c) return;

  isEventMode = true;
  activeEventId = eventId;

  // Sincronizar todos os selects de eventos
  document.querySelectorAll('.event-select').forEach(sel => {
    const hasOption = [...sel.options].some(o => o.value === eventId);
    sel.value = hasOption ? eventId : '';
  });

  const stateOpts = {
    season: c.season,
    phase: Number(c.phase),
    amplitude: 1.5
  };

  if (c.enso === 'todos') {
    const eg = $('ensoGroup');
    if (eg) eg.style.display = 'none';
  } else {
    const eg = $('ensoGroup');
    if (eg) eg.style.display = '';
    stateOpts.enso = c.enso;
  }

  setClimateState(stateOpts, false);
}

function setClimateState(opts, fromUser = false) {
  if (fromUser) {
    if (opts.season !== undefined || opts.enso !== undefined || opts.phase !== undefined) {
      exitEventMode();
    }
  }

  if (opts.season !== undefined) currentSeason = opts.season;
  if (opts.enso !== undefined) currentEnso = opts.enso;
  if (opts.phase !== undefined) currentPhase = Number(opts.phase);
  if (opts.amplitude !== undefined && Number.isFinite(Number(opts.amplitude))) {
    currentAmplitude = Math.max(0, Math.min(3, Number(opts.amplitude)));
  }
  if (opts.view !== undefined) mapView = opts.view;
  if (opts.mjoMode !== undefined) mjoMode = opts.mjoMode;
  if (opts.salljState !== undefined) salljState = opts.salljState;
  if (opts.visibleLayers) Object.assign(visibleLayers, opts.visibleLayers);
  update();
}

function update() {
  if (typeof renderRMMDiagram === "function") renderRMMDiagram(currentPhase, currentAmplitude);
  // Atualizar atributos dos botões de controle
  document.querySelectorAll('[data-season]:not([data-shortcut])').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.season === currentSeason)));
  document.querySelectorAll('[data-enso]:not([data-shortcut])').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.enso === currentEnso)));
  document.querySelectorAll('[data-phase]:not([data-shortcut])').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.phase) === Number(currentPhase))));
  const seasonSel = $('seasonSelect');
  if (seasonSel) seasonSel.value = currentSeason;
  const ensoSel = $('ensoSelect');
  if (ensoSel) ensoSel.value = currentEnso;
  const phaseSel = $('phaseSelect');
  if (phaseSel) phaseSel.value = String(currentPhase);
  const ampInput = $('mjoAmplitude');
  if (ampInput) ampInput.value = currentAmplitude;
  const ampVal = $('mjoAmplitudeValue');
  if (ampVal) ampVal.textContent = currentAmplitude.toFixed(1);

  // Buscar evidências na base curada
  const cases = displayAllEvidences();
  const specific = cases.specific;
  const alvarez = cases.alvarez;
  const primaryEvidence = cases.primary;

  // Sincronizar select de eventos se não estiver em modo de evento ativo
  if (!isEventMode) {
    document.querySelectorAll('.event-select').forEach(select => {
      const match = [...select.options].find(o => {
        if (!o.value) return false;
        const c = DOCUMENTED_CASES.find(item => item.id === o.value);
        if (!c) return false;
        if (c.season !== currentSeason) return false;
        const pNum = Number(currentPhase);
        const phaseMatches = (Number(c.phase) === pNum) || (c.groupedPhases && c.groupedPhases.includes(pNum));
        if (!phaseMatches) return false;
        if (c.enso === 'todos') return alvarez !== null;
        return c.enso === currentEnso;
      });
      select.value = match ? match.value : '';
    });
    const evNotice = $('eventNotice');
    if (evNotice) evNotice.textContent = '';
  } else {
    const evNotice = $('eventNotice');
    if (evNotice) {
      const activeCase = DOCUMENTED_CASES.find(c => c.id === activeEventId);
      evNotice.textContent = activeCase ? `Evento ativo: ${activeCase.shortLabel}` : 'Evento de interesse ativo';
    }
  }

  $('globalView').setAttribute('aria-pressed', String(mapView === 'global'));
  $('regionalView').setAttribute('aria-pressed', String(mapView === 'regional'));
  if ($('mjoSelect')) $('mjoSelect').value = mjoMode;
  if ($('salljSelect')) $('salljSelect').value = salljState;
  for (const [id, layer] of [
    ['sstLayer','sst'],
    ['jetsLayer','jets'],
    ['jetsToggle','jets'],
    ['salljLayer','sallj'],
    ['salljToggle','sallj'],
    ['psaLayer','psa'],
    ['psaToggle','psa'],
    ['boxesLayer','boxes'],
    ['boxesToggle','boxes'],
    ['sesaToggle','sesa'],
    ['zcasToggle','zcas']
  ]) if ($(id)) $(id).checked = visibleLayers[layer];
  if ($('layerCount')) $('layerCount').textContent = `(${['sst','jets','psa'].filter(key => visibleLayers[key]).length}/3)`;

  const ensoLabel = currentEnso === 'el-nino' ? 'El Niño' : currentEnso === 'la-nina' ? 'La Niña' : 'ENOS Neutro';
  let title = '';
  if (isEventMode) {
    const activeCase = DOCUMENTED_CASES.find(c => c.id === activeEventId);
    if (activeCase && activeCase.enso === 'todos') {
      title = `${currentSeason} · Todos os anos · MJO Fase ${currentPhase}`;
    } else {
      title = `${currentSeason} · ${ensoLabel} · MJO Fase ${currentPhase}`;
    }
  } else {
    title = `${currentSeason} · ${ensoLabel} · MJO Fase ${currentPhase}`;
  }
  if (primaryEvidence && primaryEvidence.groupedPhase) {
    title += ` (Fases ${primaryEvidence.groupedPhase})`;
  }
  $('caseTitle').textContent = title;

  // Resumo do Caso
  if ($('caseSummary')) {
    if (currentAmplitude < 1) {
      $('caseSummary').textContent = 'MJO fraca (amplitude < 1) — sem padrão associado.';
      $('caseSummary').style.color = 'var(--muted)';
    } else if (specific && alvarez) {
      $('caseSummary').textContent = `${specific.text} | Média de todos os anos (Alvarez et al.): ${alvarez.text}`;
      $('caseSummary').style.color = 'var(--accent-teal)';
    } else if (specific) {
      $('caseSummary').textContent = `${specific.text} (${specific.source})`;
      $('caseSummary').style.color = 'var(--accent-teal)';
    } else if (alvarez) {
      $('caseSummary').textContent = `Média de todos os anos (Alvarez et al. 2016): ${alvarez.text} (${alvarez.source})`;
      $('caseSummary').style.color = 'var(--accent-teal)';
    } else {
      $('caseSummary').textContent = 'Sem resultado documentado para esta combinação.';
      $('caseSummary').style.color = 'var(--muted)';
    }
  }

  // Painel de Resultados
  $('result').replaceChildren();
  if (currentAmplitude < 1) {
    const val = document.createElement('p');
    val.className = 'muted';
    val.textContent = 'MJO fraca (A < 1): destaques de fase ativa ocultos; jatos, TSM, ZCAS, SESA e PSA preservados.';
    $('result').appendChild(val);
  } else if (specific && alvarez) {
    // 1. Específico do ENOS (Fernandes & Grimm)
    const sBlock = document.createElement('div');
    const sTitle = document.createElement('p');
    sTitle.className = 'value';
    sTitle.style.color = 'var(--accent-teal)';
    sTitle.textContent = `${specific.source.split(',')[0]} (Específico · ${ensoLabel})`;
    sBlock.appendChild(sTitle);
    const sDesc = document.createElement('p');
    sDesc.textContent = specific.text;
    sBlock.appendChild(sDesc);
    if (specific.authorSectorDef) {
      const sDef = document.createElement('p');
      sDef.className = 'muted';
      sDef.style.marginTop = '4px';
      sDef.innerHTML = `<strong>Definição do autor:</strong> ${specific.authorSectorDef}`;
      sBlock.appendChild(sDef);
    }
    $('result').appendChild(sBlock);

    // 2. Média de todos os anos (Alvarez et al.)
    const aBlock = document.createElement('div');
    aBlock.style.marginTop = '12px';
    aBlock.style.paddingTop = '10px';
    aBlock.style.borderTop = '1px solid rgba(255,255,255,0.12)';
    const aTitle = document.createElement('p');
    aTitle.className = 'value';
    aTitle.style.color = 'var(--accent-teal)';
    aTitle.textContent = 'Média de todos os anos (Alvarez et al. 2016)';
    aBlock.appendChild(aTitle);
    if (isEventMode && activeEventId && activeEventId.includes('alvarez')) {
      const aSub = document.createElement('p');
      aSub.className = 'muted';
      aSub.style.marginBottom = '6px';
      aSub.textContent = 'composição de todos os anos (sem separação por ENOS)';
      aBlock.appendChild(aSub);
    }
    const aDesc = document.createElement('p');
    aDesc.textContent = alvarez.text;
    aBlock.appendChild(aDesc);
    if (alvarez.authorSectorDef) {
      const aDef = document.createElement('p');
      aDef.className = 'muted';
      aDef.style.marginTop = '4px';
      aDef.innerHTML = `<strong>Definição do autor:</strong> ${alvarez.authorSectorDef}`;
      aBlock.appendChild(aDef);
    }
    $('result').appendChild(aBlock);
  } else if (specific) {
    const sBlock = document.createElement('div');
    const sTitle = document.createElement('p');
    sTitle.className = 'value';
    sTitle.style.color = 'var(--accent-teal)';
    sTitle.textContent = `${specific.source.split(',')[0]} (Específico · ${ensoLabel})`;
    sBlock.appendChild(sTitle);
    const sDesc = document.createElement('p');
    sDesc.textContent = specific.text;
    sBlock.appendChild(sDesc);
    if (specific.authorSectorDef) {
      const sDef = document.createElement('p');
      sDef.className = 'muted';
      sDef.style.marginTop = '4px';
      sDef.innerHTML = `<strong>Definição do autor:</strong> ${specific.authorSectorDef}`;
      sBlock.appendChild(sDef);
    }
    $('result').appendChild(sBlock);
  } else if (alvarez) {
    const aBlock = document.createElement('div');
    const aTitle = document.createElement('p');
    aTitle.className = 'value';
    aTitle.style.color = 'var(--accent-teal)';
    aTitle.textContent = 'Média de todos os anos (Alvarez et al. 2016)';
    aBlock.appendChild(aTitle);
    if (isEventMode && activeEventId && activeEventId.includes('alvarez')) {
      const aSub = document.createElement('p');
      aSub.className = 'muted';
      aSub.style.marginBottom = '6px';
      aSub.textContent = 'composição de todos os anos (sem separação por ENOS)';
      aBlock.appendChild(aSub);
    }
    const aDesc = document.createElement('p');
    aDesc.textContent = alvarez.text;
    aBlock.appendChild(aDesc);
    if (alvarez.authorSectorDef) {
      const aDef = document.createElement('p');
      aDef.className = 'muted';
      aDef.style.marginTop = '4px';
      aDef.innerHTML = `<strong>Definição do autor:</strong> ${alvarez.authorSectorDef}`;
      aBlock.appendChild(aDef);
    }
    $('result').appendChild(aBlock);
  } else {
    const val = document.createElement('p');
    val.className = 'muted';
    val.textContent = 'Sem resultado documentado para esta combinação.';
    $('result').appendChild(val);
    const desc = document.createElement('p');
    desc.textContent = `Não há caso específico catalogado para ${currentSeason} · ${ensoLabel} · Fase ${currentPhase} nesta síntese documental. As feições da base continuam disponíveis para análise no sandbox.`;
    $('result').appendChild(desc);
  }

  // Nota de La Niña em DJF (fases 2–8)
  const pVal = Number(currentPhase);
  if (currentSeason === 'DJF' && currentEnso === 'la-nina' && pVal >= 2 && pVal <= 8) {
    const lnBox = document.createElement('div');
    lnBox.className = 'card-note';
    lnBox.style.marginTop = '10px';
    lnBox.style.padding = '8px 10px';
    lnBox.style.background = 'rgba(37, 99, 235, 0.15)';
    lnBox.style.borderLeft = '3px solid #60a5fa';
    lnBox.style.borderRadius = '4px';
    lnBox.style.fontSize = '12px';
    lnBox.style.lineHeight = '1.45';
    lnBox.innerHTML = '<strong>Nota La Niña (DJF, fases 2–8):</strong> extremos no SESA diminuem mesmo quando a chuva média aumenta (subsidência favorecida pela La Niña).';
    $('result').appendChild(lnBox);
  }

  // Nota de Inverno em JJA
  if (currentSeason === 'JJA') {
    const jjaBox = document.createElement('div');
    jjaBox.className = 'card-note';
    jjaBox.style.marginTop = '10px';
    jjaBox.style.padding = '8px 10px';
    jjaBox.style.background = 'rgba(56, 189, 248, 0.12)';
    jjaBox.style.borderLeft = '3px solid #38bdf8';
    jjaBox.style.borderRadius = '4px';
    jjaBox.style.fontSize = '12px';
    jjaBox.style.lineHeight = '1.45';
    jjaBox.innerHTML = '<strong>Nota de inverno (JJA):</strong> No inverno, extremos no SESA ligam-se a um ciclone travado por anticiclone perto da Península Antártica (Alvarez et al. 2013); a relação com as fases da MJO não foi estabelecida.';
    $('result').appendChild(jjaBox);
  }

  // Nota fixa dos setores (recortes por autor)
  const sectorBox = document.createElement('div');
  sectorBox.className = 'card-note';
  sectorBox.style.marginTop = '12px';
  sectorBox.style.padding = '8px 10px';
  sectorBox.style.background = 'rgba(14, 165, 233, 0.08)';
  sectorBox.style.borderLeft = '3px solid var(--accent-teal)';
  sectorBox.style.borderRadius = '4px';
  sectorBox.style.fontSize = '11.5px';
  sectorBox.style.lineHeight = '1.45';
  sectorBox.innerHTML = '<strong>Recortes dos setores:</strong> SESA e ZCAS têm recortes diferentes conforme o autor: Fernandes & Grimm usam CESA (inclui a ZCAS) e o médio/baixo Paraná–Prata; Liebmann et al. usam os pontos 30°S 60°W e 20°S 45°W; Muza et al. chamam de SEBr a ZCAS continental. O mapa mostra os setores calculados por R. Haas.';
  $('result').appendChild(sectorBox);

  // Faixa de TSM do ENOS
  const isAlvarezEvent = isEventMode && activeEventId && activeEventId.includes('alvarez');
  if (isAlvarezEvent) {
    $('sstBand').className = 'band';
    $('sstText').textContent = 'Composição de todos os anos (sem separação por ENOS).';
  } else {
    $('sstBand').className = 'band' + (currentEnso === 'el-nino' ? ' warm' : currentEnso === 'la-nina' ? ' cold' : '');
    $('sstText').textContent = currentEnso === 'el-nino'
      ? 'El Niño · anomalias quentes no Pacífico equatorial central/leste'
      : currentEnso === 'la-nina'
        ? 'La Niña · anomalias frias no Pacífico equatorial central/leste'
        : 'ENOS neutro · sem padrão forte de El Niño ou La Niña; não significa anomalia local zero.';
  }

  // Informações de Fase da MJO
  const phaseInfo = getMjoPhaseCoords(currentPhase);
  $('phaseInfo').textContent = `Fase ${currentPhase} · ${phaseInfo.region} — referência nominal RMM de Wheeler & Hendon (2004), distinta de grade contínua de convecção observada.`;

  // Mecanismo PSA
  const psaCard = $('panelPsa') || $('psaCard');
  if (psaCard) psaCard.hidden = false;
  if ($('psaText')) {
    const psaEvidence = specific || alvarez;
    $('psaText').textContent = (psaEvidence && psaEvidence.psa)
      ? psaEvidence.psa
      : 'Padrão PSA · onda de Rossby intrassazonal no Pacífico Sul (~200 hPa). Em DJF e MAM, centros da EOF1 de v200 (Cavalcanti 2018) ilustram o guia de onda.';
  }

  // Desenhar mapa com a base permanente e destaques seletivos
  drawMap(primaryEvidence);

  // Disparar atualização da narração (fala se ativa e atualiza texto acessível)
  speakCurrentNarration();

  // Atualizar Setor Sandbox das 96 Permutações (Alice Grimm)
  if (typeof updateGrimmSandboxUI === 'function') {
    updateGrimmSandboxUI();
  }
}

// Event Listeners: Estações (DJF, MAM, JJA, SON)
const seasonSelect = $('seasonSelect');
if (seasonSelect) {
  seasonSelect.addEventListener('change', () => {
    setClimateState({ season: seasonSelect.value }, true);
  });
}
document.querySelectorAll('[data-season]:not([data-shortcut])').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ season: b.dataset.season }, true);
  });
});

// Event Listeners: ENOS (El Niño, Neutro, La Niña)
const ensoSelect = $('ensoSelect');
if (ensoSelect) {
  ensoSelect.addEventListener('change', () => {
    setClimateState({ enso: ensoSelect.value }, true);
  });
}
document.querySelectorAll('[data-enso]:not([data-shortcut])').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ enso: b.dataset.enso }, true);
  });
});

// Event Listeners: MJO Fases 1 a 8
const phaseSelect = $('phaseSelect');
if (phaseSelect) {
  phaseSelect.addEventListener('change', () => {
    setClimateState({ phase: Number(phaseSelect.value) }, true);
  });
}
document.querySelectorAll('[data-phase]:not([data-shortcut])').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ phase: Number(b.dataset.phase) }, true);
  });
});

// Event Selects
document.querySelectorAll('.event-select').forEach(select => {
  select.addEventListener('change', () => {
    selectEvent(select.value);
  });
});

if ($('mjoSelect')) $('mjoSelect').addEventListener('change', e => setMjoMode(e.target.value));

// Alternância da Legenda
$('legendButton').addEventListener('click', () => {
  $('legend').hidden = !$('legend').hidden;
  $('legendButton').setAttribute('aria-expanded', String(!$('legend').hidden));
  $('legendButton').textContent = $('legend').hidden ? 'Mostrar legenda & guia' : 'Ocultar legenda & guia';
});

// Alternância de Visão Global / Regional
for (const [id, view] of [['globalView', 'global'], ['regionalView', 'regional']]) {
  $(id).addEventListener('click', () => {
    setClimateState({ view });
  });
}

// Alternância de Outras Camadas
for (const [id, layer] of [
  ['sstLayer', 'sst'],
  ['jetsLayer', 'jets'],
  ['jetsToggle', 'jets'],
  ['salljLayer', 'sallj'],
  ['salljToggle', 'sallj'],
  ['psaLayer', 'psa'],
  ['psaToggle', 'psa'],
  ['boxesLayer', 'boxes'],
  ['boxesToggle', 'boxes'],
  ['sesaToggle', 'sesa'],
  ['zcasToggle', 'zcas']
]) {
  if ($(id)) {
    $(id).addEventListener('change', () => {
      visibleLayers[layer] = $(id).checked;
      if (layer === 'boxes') {
        if ($('sesaToggle')) $('sesaToggle').checked = visibleLayers.boxes;
        if ($('zcasToggle')) $('zcasToggle').checked = visibleLayers.boxes;
        if ($('boxesLayer')) $('boxesLayer').checked = visibleLayers.boxes;
        if ($('boxesToggle')) $('boxesToggle').checked = visibleLayers.boxes;
      } else if (layer === 'sesa' || layer === 'zcas') {
        if ($('boxesToggle')) $('boxesToggle').checked = visibleLayers.boxes;
        if ($('boxesLayer')) $('boxesLayer').checked = visibleLayers.boxes;
      }
      update();
    });
  }
}

if ($('salljSelect')) {
  $('salljSelect').addEventListener('change', (e) => {
    salljState = e.target.value;
    update();
  });
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

// ============================================================================
// SETOR SANDBOX: As 96 Permutações (ENOS × MJO × Estações · Alice Grimm)
// ============================================================================
let sandboxSelectedSeason = 'DJF';
let isSandboxCollapsed = false;

function initGrimmSandbox() {
  const container = $('sandboxSector');
  if (!container) return;

  // Sincronizar estação inicial com o estado do modelo
  sandboxSelectedSeason = currentSeason || 'DJF';

  // Abas de Estações no Sandbox
  const tabs = document.querySelectorAll('.sandbox-season-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const s = tab.dataset.sbSeason;
      if (!s) return;
      sandboxSelectedSeason = s;
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.sbSeason === s));
      renderGrimmSandboxMatrix();
    });
  });

  // Botão no Header Superior
  const sandboxModeBtn = $('sandboxModeBtn');
  if (sandboxModeBtn) {
    sandboxModeBtn.addEventListener('click', () => {
      if (isSandboxCollapsed) {
        toggleSandboxCollapse(false);
      }
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      sandboxModeBtn.setAttribute('aria-pressed', 'true');
    });
  }

  // Botão no seletor de Eventos de Interesse
  const btnOpenSandbox = $('btnOpenSandbox');
  if (btnOpenSandbox) {
    btnOpenSandbox.addEventListener('click', () => {
      if (isSandboxCollapsed) {
        toggleSandboxCollapse(false);
      }
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Botão Recolher/Expandir
  const btnToggle = $('btnToggleSandboxView');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      toggleSandboxCollapse(!isSandboxCollapsed);
    });
  }

  renderGrimmSandboxMatrix();
  updateGrimmSandboxDiagnostic();
}

function toggleSandboxCollapse(collapse) {
  isSandboxCollapsed = collapse;
  const matrix = $('sandboxMatrixContainer');
  const diag = $('sandboxDiagnosticCard');
  const tabs = $('sandboxSeasonTabs');
  const btn = $('btnToggleSandboxView');
  if (matrix) matrix.style.display = collapse ? 'none' : '';
  if (diag) diag.style.display = collapse ? 'none' : '';
  if (tabs) tabs.style.display = collapse ? 'none' : 'flex';
  if (btn) btn.textContent = collapse ? 'Expandir matriz' : 'Ocultar';
}

function selectGrimmSandboxCell(season, enso, phase) {
  const pNum = Number(phase);
  // Se coincidir com um dos 10 casos curados da literatura com ENOS definido, ativa o caso curado
  if (typeof DOCUMENTED_CASES !== 'undefined' && Array.isArray(DOCUMENTED_CASES)) {
    const curatedMatch = DOCUMENTED_CASES.find(c => {
      if (c.season !== season) return false;
      const phaseMatches = (Number(c.phase) === pNum) || (c.groupedPhases && c.groupedPhases.includes(pNum));
      if (!phaseMatches) return false;
      if (c.enso === 'todos') return false;
      return c.enso === enso;
    });

    if (curatedMatch) {
      selectEvent(curatedMatch.id);
      return;
    }
  }

  // Se não for evento curado específico, aplica o estado no sandbox livre
  setClimateState({
    season: season,
    enso: enso,
    phase: pNum,
    amplitude: Math.max(currentAmplitude, 1.2)
  }, true);
}

function renderGrimmSandboxMatrix() {
  const container = $('sandboxMatrixContainer');
  if (!container || typeof getGrimmSeasonMatrix !== 'function') return;

  const countBadge = $('sandboxSummaryCount');
  if (countBadge) {
    countBadge.textContent = `24 combinações em ${sandboxSelectedSeason} (Total 96 no ciclo)`;
  }

  // Estilos visuais por tipo de resposta no SESA
  const signalStyles = {
    muito_acima: {
      bg: 'rgba(5, 150, 105, 0.18)',
      border: '#059669',
      color: '#34d399',
      icon: '🌧️+'
    },
    acima: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: '#10b981',
      color: '#6ee7b7',
      icon: '🌦️'
    },
    muito_abaixo: {
      bg: 'rgba(220, 38, 38, 0.18)',
      border: '#dc2626',
      color: '#f87171',
      icon: '☀️ Seca'
    },
    abaixo: {
      bg: 'rgba(234, 88, 12, 0.15)',
      border: '#ea580c',
      color: '#fb923c',
      icon: '🌤️-'
    },
    neutro_climatologia: {
      bg: 'rgba(100, 116, 139, 0.10)',
      border: '#475569',
      color: '#94a3b8',
      icon: '⛅ Clima'
    }
  };
  signalStyles['+2'] = signalStyles.muito_acima;
  signalStyles['+1'] = signalStyles.acima;
  signalStyles['-2'] = signalStyles.muito_abaixo;
  signalStyles['-1'] = signalStyles.abaixo;
  signalStyles['0'] = signalStyles.neutro_climatologia;

  const ENSOS = [
    { key: 'la-nina', label: 'La Niña', sub: 'Pacífico Equatorial Frio' },
    { key: 'neutro', label: 'ENOS Neutro', sub: 'Sem Anomalia Remota' },
    { key: 'el-nino', label: 'El Niño', sub: 'Pacífico Equatorial Quente' }
  ];

  let html = `
    <table class="sandbox-table" role="grid" aria-label="Matriz de 24 permutações da estação ${sandboxSelectedSeason}">
      <thead>
        <tr>
          <th style="width:22%; text-align:left;">Fase da MJO (Localização)</th>
          ${ENSOS.map(e => `
            <th style="width:26%;">
              <div>${e.label}</div>
              <div style="font-size:10px; font-weight:400; color:#94a3b8;">${e.sub}</div>
            </th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
  `;

  for (let p = 1; p <= 8; p++) {
    const sample = getGrimmPermutation(sandboxSelectedSeason, 'neutro', p);
    const phaseName = sample ? sample.phaseName : `Fase ${p}`;

    html += `<tr>`;
    html += `
      <td style="padding:8px 10px; background:#0b1929; border:1px solid #1e3a5a; border-radius:6px;">
        <div style="font-weight:700; color:#e2e8f0;">Fase ${p}</div>
        <div style="font-size:10.5px; color:#94a3b8; line-height:1.2;">${phaseName}</div>
      </td>
    `;

    for (const enso of ENSOS) {
      const item = getGrimmPermutation(sandboxSelectedSeason, enso.key, p);
      if (!item) {
        html += `<td class="sandbox-cell" style="background:#0f172a; border:1px solid #1e293b;">-</td>`;
        continue;
      }

      const isActive = (currentSeason === sandboxSelectedSeason && currentEnso === enso.key && Number(currentPhase) === p);
      const styleInfo = signalStyles[item.signalCategory] || signalStyles[item.sesaSignal] || signalStyles.neutro_climatologia;

      html += `
        <td class="sandbox-cell ${isActive ? 'is-active-cell' : ''}"
            data-sb-season="${sandboxSelectedSeason}"
            data-sb-enso="${enso.key}"
            data-sb-phase="${p}"
            data-sb-cell="${sandboxSelectedSeason}-${enso.key}-${p}"
            style="background:${styleInfo.bg}; border:1px solid ${isActive ? '#38bdf8' : styleInfo.border}; padding:7px 10px; cursor:pointer;"
            tabindex="0"
            role="button"
            aria-pressed="${isActive}"
            title="Clique para aplicar ${item.season} · ${enso.label} · Fase ${p} ao mapa">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:4px;">
            <span style="font-size:11.5px; font-weight:700; color:${styleInfo.color}; display:inline-flex; align-items:center; gap:4px;">
              <span>${styleInfo.icon}</span>
              <span>${item.impactLabel}</span>
            </span>
            ${item.isCurated ? `
              <span style="font-size:9.5px; font-weight:700; color:#facc15; background:rgba(234,179,8,0.2); border:1px solid rgba(234,179,8,0.4); border-radius:3px; padding:1px 4px; white-space:nowrap;" title="Caso Curado (${item.curatedAuthor})">
                ⭐ Curado
              </span>
            ` : ''}
          </div>
        </td>
      `;
    }
    html += `</tr>`;
  }

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;

  // Registrar listeners nas células
  container.querySelectorAll('.sandbox-cell').forEach(cell => {
    const clickHandler = () => {
      const s = cell.dataset.sbSeason;
      const e = cell.dataset.sbEnso;
      const p = cell.dataset.sbPhase;
      if (s && e && p) {
        selectGrimmSandboxCell(s, e, p);
      }
    };
    cell.addEventListener('click', clickHandler);
    cell.addEventListener('keydown', evt => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        clickHandler();
      }
    });
  });
}

function updateGrimmSandboxUI() {
  // Sincronizar aba da estação se houver mudança externa
  if (currentSeason && sandboxSelectedSeason !== currentSeason) {
    sandboxSelectedSeason = currentSeason;
    const tabs = document.querySelectorAll('.sandbox-season-btn');
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.sbSeason === currentSeason));
    renderGrimmSandboxMatrix();
  } else {
    // Apenas atualizar as classes das células ativas
    document.querySelectorAll('.sandbox-cell').forEach(cell => {
      const isMatch = (cell.dataset.sbSeason === currentSeason &&
                       cell.dataset.sbEnso === currentEnso &&
                       Number(cell.dataset.sbPhase) === Number(currentPhase));
      cell.classList.toggle('is-active-cell', isMatch);
      cell.setAttribute('aria-pressed', String(isMatch));
      if (isMatch) {
        cell.style.borderColor = '#38bdf8';
      }
    });
  }

  updateGrimmSandboxDiagnostic();
}

function updateGrimmSandboxDiagnostic() {
  const diag = $('sandboxDiagnosticCard');
  if (!diag || typeof getGrimmPermutation !== 'function') return;

  const item = getGrimmPermutation(currentSeason, currentEnso, currentPhase);
  if (!item) {
    diag.innerHTML = `<p class="muted">Selecione uma combinação no sandbox para visualizar o aviso ao previsor.</p>`;
    return;
  }

  const ensoTitle = currentEnso === 'el-nino' ? 'El Niño' : currentEnso === 'la-nina' ? 'La Niña' : 'ENOS Neutro';
  const sourceType = getPsaSourceType(currentSeason, currentEnso, currentPhase);
  const sourceName = sourceType === 'ciclone_tropical'
    ? 'Ciclone Tropical / Aquecimento Equatorial Oeste'
    : 'ZCPS (Zona de Convergência do Pacífico Sul / SPCZ)';

  const html = `
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; border-bottom:1.5px solid #0284c7; padding-bottom:8px; margin-bottom:10px;">
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
          <span style="font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; background:#0284c7; color:#ffffff; padding:2px 8px; border-radius:4px;">
            ⚠️ AVISO AO PREVISOR · SESA & ZCAS
          </span>
          <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#38bdf8; font-weight:700;">
            Diagnóstico Físico de Alice Grimm & Colaboradores
          </span>
        </div>
        <h3 style="font-size:14.5px; font-weight:800; color:#f8fafc; margin:0;">
          ${currentSeason} · ${ensoTitle} · MJO Fase ${currentPhase} (${item.phaseName})
        </h3>
      </div>
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
        <span style="font-size:12px; font-weight:700; padding:3px 9px; border-radius:6px; background:rgba(56,189,248,0.18); color:#7dd3fc; border:1px solid rgba(56,189,248,0.4);">
          ${item.impactLabel}
        </span>
        ${item.isCurated ? `
          <span style="font-size:11.5px; font-weight:700; padding:3px 9px; border-radius:6px; background:rgba(234,179,8,0.22); color:#fde047; border:1px solid rgba(234,179,8,0.45);">
            ⭐ Caso Curado: ${item.curatedAuthor}
          </span>
        ` : ''}
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; font-size:12.5px; line-height:1.45;">
      <div style="background:#0b1929; border:1px solid #1e3a5a; border-radius:6px; padding:10px 12px;">
        <div style="font-weight:700; color:#38bdf8; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
          <span>🌧️</span> Impacto no SESA & Extremos
        </div>
        <div style="color:#e2e8f0;">${item.synthesis}</div>
      </div>

      <div style="background:#0b1929; border:1px solid #1e3a5a; border-radius:6px; padding:10px 12px;">
        <div style="font-weight:700; color:#c084fc; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
          <span>🌀</span> Onda de Rossby PSA & Fonte Convectiva
        </div>
        <div style="color:#e2e8f0;">
          <strong>Fonte da onda:</strong> <span style="color:#fde047;">${sourceName}</span>. O trem de ondas equivalente-barotrópico no Pacífico Sul propaga-se de acordo com Alvarez et al. e Grimm, determinando cavados e cristas sobre o cone sul.
        </div>
      </div>

      <div style="background:#0b1929; border:1px solid #1e3a5a; border-radius:6px; padding:10px 12px;">
        <div style="font-weight:700; color:#34d399; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
          <span>🌪️</span> Acoplamento: Jatos, SALLJ & ENOS
        </div>
        <div style="color:#e2e8f0;">${item.backgroundSummary}</div>
      </div>
    </div>

    <div style="margin-top:10px; padding-top:8px; border-top:1px solid #1e3a5a; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; font-size:11.5px; color:#94a3b8;">
      <div>
        <strong style="color:#cbd5e1;">Pesquisa Científica Validada:</strong> ${Array.isArray(item.citations) ? item.citations.join('; ') : (item.citations || 'Alice Grimm et al.; Alvarez et al.')}
      </div>
      <div style="color:#38bdf8; font-weight:600;">
        💡 Dica: Clique em qualquer célula da matriz abaixo para simular no mapa.
      </div>
    </div>
  `;

  diag.innerHTML = html;
}

if (typeof window !== 'undefined') {
  window.setClimateState = setClimateState;
  window.initGrimmSandbox = initGrimmSandbox;
  window.renderGrimmSandboxMatrix = renderGrimmSandboxMatrix;
  window.updateGrimmSandboxUI = updateGrimmSandboxUI;
  window.selectGrimmSandboxCell = selectGrimmSandboxCell;
  if (window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const opts = {};
    if (params.has('season')) opts.season = params.get('season');
    if (params.has('enso')) opts.enso = params.get('enso');
    if (params.has('phase')) opts.phase = Number(params.get('phase'));
    if (params.has('amplitude')) opts.amplitude = Number(params.get('amplitude'));
    if (params.has('view')) opts.view = params.get('view');
    if (params.has('mjoMode')) opts.mjoMode = params.get('mjoMode');
    if (params.has('salljState')) opts.salljState = params.get('salljState');
    if (Object.keys(opts).length > 0) setClimateState(opts);
  }
}

// Inicializar interface e sandbox
initGrimmSandbox();
update();

