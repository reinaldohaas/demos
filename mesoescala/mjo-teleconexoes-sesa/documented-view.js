const $ = id => document.getElementById(id);

let currentSeason = 'DJF';
let currentEnso = 'neutro';
let currentPhase = 4;
let currentAmplitude = 1.5;
function displayEvidence() { return currentAmplitude >= 1 ? findDocumentedCase(currentSeason, currentEnso, currentPhase) : null; }
let metric = 'extremes';
let mapView = 'global';
let mjoMode = 'chi'; // 'chi' | 'dipoles' | 'track' | 'none'
const visibleLayers = {
  get mjo() { return mjoMode !== 'none'; },
  set mjo(v) { if (!v) mjoMode = 'none'; else if (mjoMode === 'none') mjoMode = 'chi'; },
  sst: true,
  jets: true,
  psa: true
};
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

// Esquema didático conceitual: Divergência e Convergência em Altos Níveis (~200 hPa)
// Relação física fundamental (Helmholtz / Poisson): v_χ = ∇χ e ∇²χ = −δ, onde δ = ∇ · v_χ é a divergência horizontal.
// Anomalias negativas (roxo/azul): divergência em altos níveis (∇²χ < 0, δ > 0), favorecendo convecção e ascendência ativa da MJO.
// Anomalias positivas (verde/amarelo/laranja/vermelho): convergência em altos níveis (∇²χ > 0, δ < 0), favorecendo convecção suprimida e subsidência.
// Representação estritamente qualitativa e esquemática; sem inferência de chuva local no Brasil a partir deste campo.
// Centros de χ200 — baricentro da área t>2,5 nos compostos CPC (Wheeler & Hendon 2004),
// plot_chi_tvalue_8pan_{novmar|maysep}.gif, leitura em pixels em 27/09/2026 (1,178 px/grau; 1,45 px/grau)
const MJO_CHI_REF = {
  novmar: {
    1: { div: [-10, -1], conv: [ 164, 2] },
    2: { div: [ 49, -3], conv: [-166, 4] },
    3: { div: [ 79, -1], conv: [-111, 1] },
    4: { div: [ 119, 0], conv: [ -28, 0] },
    5: { div: [ 159, 0], conv: [ -13, 2] },
    6: { div: [-167, 0], conv: [  69,-2] },
    7: { div: [-113,-8], conv: [  87,-2] },
    8: { div: [ -36,-1], conv: [ 117, 0] }
  },
  maysep: {
    1: { div: [-23,  4], conv: [ 157, 5] },
    2: { div: [ 45,  0], conv: [-148,10] },
    3: { div: [ 80, -1], conv: [ -81, 3] },
    4: { div: [ 114, 0], conv: [ -60, 0] },
    5: { div: [ 160, 1], conv: [ -41, 2] },
    6: { div: [-168, 0], conv: [  55,-2] },
    7: { div: [-126,-1], conv: [  80,-1] },
    8: { div: [ -59, 3], conv: [ 109, 1] }
  }
};

// Esquema didático derivado dinamicamente por estação (DJF/MAM -> novmar; JJA/SON -> maysep)
function getMjoChiSchematic(phase, season = currentSeason) {
  const seasonKey = (season === 'JJA' || season === 'SON') ? 'maysep' : 'novmar';
  const ref = MJO_CHI_REF[seasonKey][Number(phase)];
  if (!ref) return null;
  const [adLon, adLat] = ref.div;
  const [scLon, scLat] = ref.conv;
  return {
    active: {
      center: [adLon, adLat],
      outer: { lon: adLon, lat: adLat, rx: 80, ry: 26 },
      mid:   { lon: adLon, lat: adLat, rx: 50, ry: 24 },
      core:  { lon: adLon, lat: adLat, rx: 28, ry: 20 }
    },
    suppressed: {
      center: [scLon, scLat],
      outer: { lon: scLon, lat: scLat, rx: 80, ry: 26 },
      mid:   { lon: scLon, lat: scLat, rx: 50, ry: 24 },
      core:  { lon: scLon, lat: scLat, rx: 28, ry: 20 }
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

  const RMM_TRACK_LON = {1: 20, 2: 65, 3: 90, 4: 115, 5: 135, 6: 155, 7: 175, 8: -90};
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

  for (let p = 1; p <= 8; p++) {
    const [tx, ty] = project(RMM_TRACK_LON[p], 0);
    const isCurrent = p === Number(currentPhase);
    const isGrouped = evidence && evidence.groupedPhases && evidence.groupedPhases.includes(p);
    const isActive = currentAmplitude >= 1 && (isCurrent || isGrouped);

    if (currentAmplitude < 1) {
      // Números em cinza, sem nenhum destaque
      svg('text', {
        x: tx, y: ty + 5,
        fill: '#64748b', 'font-size': 14, 'font-weight': '700',
        'text-anchor': 'middle', cursor: 'pointer'
      }, String(p), () => setClimateState({ phase: p }));
    } else if (isActive) {
      // Realce da fase ativa
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
      }, String(p), () => setClimateState({ phase: p }));
    } else {
      svg('text', {
        x: tx, y: ty + 5,
        fill: '#f87171', 'font-size': 14, 'font-weight': '800',
        'text-anchor': 'middle', cursor: 'pointer'
      }, String(p), () => setClimateState({ phase: p }));
    }
  }
}

function drawChiColorbar(x, y, w, h) {
  // Fundo translúcido
  svg('rect', { x, y, width: w, height: h, rx: 6, fill: 'rgba(15, 23, 42, 0.90)', stroke: 'rgba(56, 189, 248, 0.35)', 'stroke-width': 1 });

  // Título didático conceitual
  svg('text', { x: x + w / 2, y: y + 10, fill: '#bae6fd', 'font-size': 9.5, 'font-weight': '700', 'text-anchor': 'middle' },
    'Divergência / Convergência em 200 hPa · χ₂₀₀ (Esquema conceitual didático)');

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
  const chi = getMjoChiSchematic(currentPhase, currentSeason);
  if (!chi) return;

  const isGlobal = mapView === 'global';

  if (isGlobal) {
    // 1. Limites do domínio tropical entre 30°S e 30°N
    const y30N = (85 - 30) * 560 / 160;
    const y30S = (85 - (-30)) * 560 / 160;

    // 2. Desenhar camadas ativas e suprimidas com envelopamento contínuo
    const renderLayers = (data, styleKey) => {
      if (!data) return;
      const styles = {
        outer: {
          fill: styleKey === 'active' ? '#38bdf8' : '#facc15',
          opacity: 0.10,
          stroke: styleKey === 'active' ? '#7dd3fc' : '#fde047',
          strokeWidth: 1.1
        },
        mid: {
          fill: styleKey === 'active' ? '#0284c7' : '#f97316',
          opacity: 0.12,
          stroke: styleKey === 'active' ? '#38bdf8' : '#fb923c',
          strokeWidth: 1.3
        },
        core: {
          fill: 'none',
          opacity: 0,
          stroke: styleKey === 'active' ? '#0284c7' : '#ef4444',
          strokeWidth: 1.8
        }
      };

      for (const level of ['outer', 'mid', 'core']) {
        const item = data[level];
        if (!item) continue;
        const st = styles[level];
        const rx = item.rx * (1200 / 360);
        const ry = item.ry * (560 / 160);

        for (const shift of [-360, 0, 360]) {
          const [cx, cy] = project(item.lon + shift, item.lat);
          if (cx + rx >= -50 && cx - rx <= 1250) {
            svg('ellipse', {
              cx, cy, rx, ry,
              fill: st.fill,
              'fill-opacity': st.opacity,
              stroke: st.stroke,
              'stroke-width': st.strokeWidth
            });
          }
        }
      }
    };

    renderLayers(chi.active, 'active');
    renderLayers(chi.suppressed, 'suppressed');

    // Linhas de domínio tropical e título desenhados após os campos para legibilidade garantida
    svg('line', { x1: 0, y1: y30N, x2: 1200, y2: y30N, stroke: 'rgba(56, 189, 248, 0.35)', 'stroke-dasharray': '5 4' });
    svg('line', { x1: 0, y1: y30S, x2: 1200, y2: y30S, stroke: 'rgba(56, 189, 248, 0.35)', 'stroke-dasharray': '5 4' });
    svg('text', { x: 1190, y: y30N + 14, fill: '#bae6fd', 'font-size': 10.5, 'font-weight': '700', 'text-anchor': 'end', 'letter-spacing': 0.5, stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'χ₂₀₀ · Potencial de velocidade em altitude (esquema conceitual)');

    // 3. Rótulos nos centros de divergência e convergência
    if (chi.active && chi.active.center) {
      const [acx, acy] = project(chi.active.center[0], chi.active.center[1]);
      svg('text', { x: acx, y: acy - 6, fill: '#bae6fd', 'font-size': 11.5, 'font-weight': '800', 'text-anchor': 'middle' }, 'Divergência 200 hPa');
      svg('text', { x: acx, y: acy + 9, fill: '#e0f2fe', 'font-size': 10.5, 'font-weight': '600', 'text-anchor': 'middle' }, '(Convecção MJO Ativa · χ < 0)');
    }
    if (chi.suppressed && chi.suppressed.center) {
      const [scx, scy] = project(chi.suppressed.center[0], chi.suppressed.center[1]);
      svg('text', { x: scx, y: scy - 6, fill: '#fef08a', 'font-size': 11.5, 'font-weight': '800', 'text-anchor': 'middle' }, 'Convergência 200 hPa');
      svg('text', { x: scx, y: scy + 9, fill: '#fed7aa', 'font-size': 10.5, 'font-weight': '600', 'text-anchor': 'middle' }, '(Convecção Suprimida · χ > 0)');
    }

    // 4. Barra de escala didática conceitual
    drawChiColorbar(350, 520, 500, 34);
  } else {
    // Visão Regional (América do Sul): contornos didáticos suaves sobre o continente
    // Núcleo (core) só com contorno, sem preenchimento; mid <= 0.12; outer <= 0.10. Opacidade somada no centro <= 0.25.
    const renderRegionalLayers = (data, styleKey) => {
      if (!data) return;
      const styles = {
        outer: { fill: styleKey === 'active' ? '#38bdf8' : '#facc15', opacity: 0.10, stroke: styleKey === 'active' ? '#7dd3fc' : '#fde047', strokeWidth: 1.1 },
        mid: { fill: styleKey === 'active' ? '#0284c7' : '#f97316', opacity: 0.12, stroke: styleKey === 'active' ? '#38bdf8' : '#fb923c', strokeWidth: 1.3 },
        core: { fill: 'none', opacity: 0, stroke: styleKey === 'active' ? '#0284c7' : '#ef4444', strokeWidth: 1.8 }
      };
      for (const level of ['outer', 'mid', 'core']) {
        const item = data[level];
        if (!item) continue;
        const st = styles[level];
        const [cx, cy] = project(item.lon, item.lat);
        const rx = item.rx * 8;
        const ry = item.ry * 6.4;
        const attrs = {
          cx, cy, rx, ry,
          stroke: st.stroke,
          'stroke-width': st.strokeWidth
        };
        if (st.fill === 'none') {
          attrs.fill = 'none';
        } else {
          attrs.fill = st.fill;
          attrs['fill-opacity'] = st.opacity;
        }
        svg('ellipse', attrs);
      }
    };

    renderRegionalLayers(chi.active, 'active');
    renderRegionalLayers(chi.suppressed, 'suppressed');

    // Barra de legenda compacta na visão regional
    drawChiColorbar(100, 480, 440, 30);
  }
}

function drawMjoTropicalVisualizations() {
  if (mjoMode === 'dipoles') {
    if (mapView === 'global') drawMjoConvection();
  } else if (mjoMode === 'chi') {
    drawMjoVelocityPotential();
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
    if (currentEnso === 'todos') {
      svg('text', { x: sx, y: sy + 38, fill: '#cbd5e1', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'Composição de todos os anos');
    } else if (currentEnso === 'el-nino') {
      svg('ellipse', { cx: sx, cy: sy, rx: 130, ry: 26, fill: '#ef4444', 'fill-opacity': 0.35, stroke: '#f87171', 'stroke-dasharray': '5 4' });
      svg('text', { x: sx, y: sy + 44, fill: '#fca5a5', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'El Niño · TSM equatorial anômala quente (qualitativo)');
    } else if (currentEnso === 'la-nina') {
      svg('ellipse', { cx: sx, cy: sy, rx: 130, ry: 26, fill: '#2563eb', 'fill-opacity': 0.35, stroke: '#60a5fa', 'stroke-dasharray': '5 4' });
      svg('text', { x: sx, y: sy + 44, fill: '#93c5fd', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'La Niña · TSM equatorial anômala fria (qualitativo)');
    } else {
      svg('ellipse', { cx: sx, cy: sy, rx: 130, ry: 20, fill: '#0ea5e9', 'fill-opacity': 0.12, stroke: '#64748b', 'stroke-dasharray': '4 4' });
      svg('text', { x: sx, y: sy + 38, fill: '#e2e8f0', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle', stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill' }, 'ENOS Neutro · TSM equatorial próxima à média (qualitativo)');
    }
  }

  // Rótulos de referência dos Oceanos (sobre Chi)
  for (const [lon, lat, label] of [[80, -48, 'OCEANO ÍNDICO'], [-145, -48, 'OCEANO PACÍFICO'], [-30, -48, 'OCEANO ATLÂNTICO']]) {
    const [x, y] = project(lon, lat);
    svg('text', { x, y, fill: '#5a829e', 'font-size': 14, 'letter-spacing': 2.5, 'text-anchor': 'middle', 'font-weight': '600' }, label);
  }

  // Teleconexão PSA: 6 centros da EOF1 de v em 200 hPa, NDJFMA (Cavalcanti 2018, slide 12)
  if (currentAmplitude >= 1 && visibleLayers.psa && (currentSeason === 'DJF' || currentSeason === 'MAM')) {
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
    const psaStroke = '#c084fc';

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
    svg('text', {
      x: labelPos[0], y: labelPos[1],
      fill: '#f3e8ff', 'font-size': 11.5, 'font-weight': '700', 'text-anchor': 'middle',
      stroke: '#081726', 'stroke-width': 2.5, 'paint-order': 'stroke fill'
    }, 'Padrão PSA · EOF1 de v em 200 hPa, NDJFMA (Cavalcanti 2018, INPE)');
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
    const p2 = project(-38, lat + 2.5);
    svg('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: '#38bdf8', 'stroke-width': width, 'stroke-dasharray': '8 5' });
    // Na visão regional, posicionar rótulo sobre o Pacífico/Chile para não sobrepor o continente/SESA
    const [jx, jy] = project(-78, lat - 0.5);
    svg('text', { x: jx, y: jy - 7, fill: '#7dd3fc', 'font-size': 11, 'font-weight': '600', 'text-anchor': 'start' }, 'Jato Subtropical (~200 hPa · guia)');
  }

  // SALLJ (~850 hPa): uma única seta, sem partículas ou trajetórias duplicadas
  // Canalização meridional a leste dos Andes da Bolívia ao norte da Argentina/Chaco
  const salljStart = project(-63, -17);
  const salljMid = project(-61, -22.5);
  const salljEnd = project(-58, -28);
  svg('path', {
    d: `M ${salljStart[0]} ${salljStart[1]} Q ${salljMid[0]} ${salljMid[1]} ${salljEnd[0]} ${salljEnd[1]}`,
    fill: 'none', stroke: '#34d399', 'stroke-width': 3.2
  });
  const endX = salljEnd[0], endY = salljEnd[1];
  svg('polygon', {
    points: `${endX},${endY} ${endX - 7},${endY - 14} ${endX + 7},${endY - 10}`,
    fill: '#34d399'
  });
  // Rótulo posicionado a oeste do jato para evitar sobreposição com SESA e ícones de chuva
  const [sx, sy] = project(-64.5, -21.5);
  svg('text', { x: sx, y: sy, fill: '#6ee7b7', 'font-size': 11.5, 'font-weight': '600', 'text-anchor': 'end' }, 'SALLJ (~850 hPa)');
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
    if (mjoMode === 'chi') {
      drawMjoVelocityPotential();
    }
  }

  // Jatos (Subtropical e SALLJ como base visual permanente)
  drawJets();

  // Delimitação do SESA: SEMPRE DELIMITADA E IDENTIFICADA
  // Rótulo mantido estritamente como "SESA" no topo da região, sem "Bacia do Prata"
  const result = (currentAmplitude >= 1 && evidence && metric !== 'circulation') ? evidence[metric] : null;
  const isSesaHighlighted = result && result.region === 'SESA';
  polygon(REGIONS.SESA_POLY, isSesaHighlighted ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.03)', isSesaHighlighted ? '#38bdf8' : '#486780', isSesaHighlighted ? 2.2 : 1.5);
  // Rótulo posicionado na borda nordeste da região, sem colidir com SALLJ nem com chuva
  const [sesaLabelX, sesaLabelY] = project(-50, -25.5);
  svg('text', { x: sesaLabelX, y: sesaLabelY, fill: isSesaHighlighted ? '#7dd3fc' : '#8ab8d4', 'font-size': 16, 'font-weight': '700', 'text-anchor': 'middle' }, 'SESA');

  // Delimitação da ZCAS: SEMPRE DELIMITADA E IDENTIFICADA
  const isZcasHighlighted = result && (result.region === 'ZCAS' || result.region === 'CESA');
  polygon(REGIONS.ZCAS_POLY, isZcasHighlighted ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.02)', isZcasHighlighted ? '#2dd4bf' : '#3e5c76', isZcasHighlighted ? 2.2 : 1.4, '4 3');
  // Rótulo posicionado na porção oceânica da ZCAS para nunca conflitar com chuva sobre MG/SP/RJ ou interior da ZCAS
  const [zx, zy] = project(-35, -20.5);
  svg('text', { x: zx, y: zy, fill: isZcasHighlighted ? '#5eead4' : '#6b8ca8', 'font-size': 16, 'font-weight': '700', 'text-anchor': 'middle' }, 'ZCAS');

  // Destaque condicional: somente quando houver resultado comprovado para a combinação e métrica (A >= 1)
  if (result) {
    const defaultLoc = result.region === 'SESA' ? [-55, -34] : [-45, -23];
    const location = result.anchor || defaultLoc;
    const [x, y] = project(...location);
    const isNegative = result.sign === 'negativo';

    if (isNegative) {
      // Sinal seco / chuva reduzida: nuvem âmbar/seca com linha tracejada e seta para baixo
      svg('path', {
        d: `M ${x - 22} ${y} C ${x - 38} ${y - 16}, ${x - 17} ${y - 30}, ${x - 5} ${y - 21} C ${x + 2} ${y - 43}, ${x + 31} ${y - 31}, ${x + 25} ${y - 13} C ${x + 44} ${y - 10}, ${x + 33} ${y + 5}, ${x + 20} ${y + 4} L ${x - 22} ${y + 4} Z`,
        fill: 'rgba(245, 158, 11, 0.28)', stroke: '#f59e0b', 'stroke-width': 2
      });
      // Linha de bloqueio/supressão cortando a base da nuvem
      svg('line', {
        x1: x - 16, y1: y + 14, x2: x + 16, y2: y + 14,
        stroke: '#f59e0b', 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-dasharray': '4 3'
      });
      svg('text', { x: x + 47, y: y + 7, fill: '#fbbf24', 'font-size': 26, 'font-weight': '900' }, '↓');
    } else {
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
    }

    // Deslocar o texto do símbolo de chuva para o oceano Atlântico para desamontoar de SESA/ZCAS/SALLJ
    const labelText = isNegative
      ? 'Chuva reduzida / Frio'
      : (metric === 'extremes' ? 'Extremos mais frequentes' : 'Chuva média favorecida');

    const isSesa = result.region === 'SESA';
    const oceanLon = isSesa ? -44 : -39;
    const oceanLat = location[1] !== undefined ? location[1] : (isSesa ? -34 : -23);
    let [tx, ty] = project(oceanLon, oceanLat);

    // Garantir que o texto nunca seja cortado na borda direita do mapa
    const maxTx = (mapView === 'regional' ? 640 : 1200) - 180;
    if (tx > maxTx) tx = maxTx;

    // Linha guia sutil conectando o símbolo de chuva ao texto no oceano
    svg('line', {
      x1: x + 30, y1: y,
      x2: tx - 6, y2: ty - 3,
      stroke: isNegative ? 'rgba(245, 158, 11, 0.45)' : 'rgba(115, 216, 218, 0.45)',
      'stroke-width': 1.1,
      'stroke-dasharray': '3 3'
    });

    svg('text', {
      x: tx, y: ty,
      fill: isNegative ? '#fef08a' : '#c6f6ef',
      'font-size': 13,
      'font-weight': '700',
      'text-anchor': 'start',
      stroke: '#081726',
      'stroke-width': 2.5,
      'paint-order': 'stroke fill'
    }, labelText);
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
  $('mapDesc').textContent = result ? `${result.region}: ${result.text} Símbolo regional sem magnitude ou extensão quantitativa.` : (currentAmplitude < 1 ? 'MJO fraca (amplitude < 1) — sem padrão associado.' : 'Mapa de referência com ZCAS e SESA. Sem resultado específico verificado nesta síntese.');
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
    'la-nina': 'La Niña',
    'todos': 'Todos os anos'
  };
  const phaseInfo = getMjoPhaseCoords(phase, season);
  const seasonKey = (season === 'JJA' || season === 'SON') ? 'maysep' : 'novmar';
  const chiSeason = MJO_CHI_REF[seasonKey] || MJO_CHI_REF.novmar;
  const chiRef = chiSeason[Number(phase)];
  const [adLon] = chiRef ? chiRef.div : [0];
  const [scLon] = chiRef ? chiRef.conv : [0];
  const adLonStr = adLon < 0 ? `${Math.abs(adLon)} graus oeste` : `${adLon} graus leste`;
  const scLonStr = scLon < 0 ? `${Math.abs(scLon)} graus oeste` : `${scLon} graus leste`;

  let text = `Em 200 hPa, o potencial de velocidade (χ₂₀₀) na fase ${phase} posiciona o centro de divergência em altitude e convecção ativa em ${adLonStr} e a convergência com subsidência em ${scLonStr}, no contexto de convecção nominal sobre ${phaseInfo.region}. `;
  text += `Configuração selecionada: ${seasonNames[season]}, com ${ensoNames[enso] || 'Todos os anos'}. `;

  // 1. Contexto esquemático da TSM e dos Jatos
  if (enso === 'todos') {
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
  text += `Este traçado de jato e as anomalias de TSM são esquemas conceituais didáticos e não medidas de velocidade ou posições latitudinais uniformes ponto a ponto. Em baixos níveis, o SALLJ (~850 hPa) atua no transporte meridional de umidade amazônica, exibindo modos espaciais diferenciados — Central, Northern, Andes e Peru (estudo de novembro–março, Jones et al. 2023). `;

  // 2. Efeitos verificados, separando convecção-fonte, circulação/teleconexão e respostas remotas
  if (evidence) {
    if (evidence.groupNote) {
      text += `Atenção: ${evidence.groupNote} `;
    }
    text += `Base bibliográfica: ${evidence.source}. `;
    if (evidence.source_convection) {
      text += `1. Convecção-fonte: ${evidence.source_convection} `;
    }
    if (evidence.circulation) {
      text += `2. Circulação e teleconexão: ${evidence.circulation} `;
    }
    if (evidence.mean) {
      text += `3. Chuva média: ${evidence.mean.text} `;
    } else {
      text += `3. Chuva média: resultado de chuva média regional não cadastrado nesta síntese para esta fase. `;
    }
    if (evidence.extremes) {
      text += `4. Frequência de extremos: ${evidence.extremes.text} `;
    } else {
      text += `4. Frequência de extremos: resultado de extremos regionais não cadastrado nesta síntese para esta fase. `;
    }
    if (evidence.psa) {
      text += `Mecanismo dinâmico: ${evidence.psa} `;
    }
    if (evidence.limits) {
      text += `Limitações e incertezas: ${evidence.limits} `;
    }
  } else {
    text += `Sem resultado específico verificado nesta síntese documental para esta combinação em relação a ${metricVal === 'circulation' ? 'circulação' : metricVal === 'extremes' ? 'extremos de chuva' : 'chuva média'}. `;
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

  // SESA = Bacia do Prata (preposições tratadas antes da regra geral, preservando caixa alta)
  s = s.replace(/\b(no)\s+SESA\b/gi, (_, a) => (a === 'No' ? 'Na' : 'na') + ' Bacia do Prata');
  s = s.replace(/\b(do)\s+SESA\b/gi, (_, a) => (a === 'Do' ? 'Da' : 'da') + ' Bacia do Prata');
  s = s.replace(/\b(ao)\s+SESA\b/gi, (_, a) => (a === 'Ao' ? 'À' : 'à') + ' Bacia do Prata');
  s = s.replace(/\b(pelo)\s+SESA\b/gi, (_, a) => (a === 'Pelo' ? 'Pela' : 'pela') + ' Bacia do Prata');
  s = s.replace(/\b(para\s+o)\s+SESA\b/gi, (_, a) => (a[0] === 'P' ? 'Para a' : 'para a') + ' Bacia do Prata');
  s = s.replace(/\b(sobre\s+o)\s+SESA\b/gi, (_, a) => (a[0] === 'S' ? 'Sobre a' : 'sobre a') + ' Bacia do Prata');
  s = s.replace(/\b(o)\s+SESA\b/gi, (_, a) => (a === 'O' ? 'A' : 'a') + ' Bacia do Prata');
  s = s.replace(/(?<!Bacia\s+(?:do\s+|da\s+|de\s+)?)\bSESA\b/g, 'Bacia do Prata');

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
  mjoMode = mode; // 'dipoles' | 'chi' | 'track' | 'none'
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
  // Buscar evidência na base curada
  const evidence = displayEvidence();
  const result = evidence && metric !== 'circulation' ? evidence[metric] : null;

  let activeEventMatch = false;
  document.querySelectorAll('.event-select').forEach(select => {
    const match = [...select.options].find(o => {
      if (!o.value) return false;
      const [s, e, p, m] = o.value.split('|');
      if (s !== currentSeason) return false;
      if (m !== metric) return false;
      const pNum = Number(p);
      const phaseMatches = (pNum === Number(currentPhase)) ||
        (evidence && evidence.groupedPhases && evidence.groupedPhases.includes(pNum) && evidence.groupedPhases.includes(Number(currentPhase)));
      if (!phaseMatches) return false;
      if (e === 'todos') {
        return evidence ? evidence.enso === 'todos' : false;
      }
      return e === currentEnso;
    });
    select.value = match ? match.value : '';
    if (match) activeEventMatch = true;
  });
  const evNotice = $('eventNotice');
  if (evNotice) {
    if (activeEventMatch && Math.abs(currentAmplitude - 1.5) < 0.05 && mjoMode === 'chi') {
      evNotice.textContent = 'modo χ200 e A = 1,5 aplicados para o caso';
    } else {
      evNotice.textContent = '';
    }
  }
  $('globalView').setAttribute('aria-pressed', String(mapView === 'global'));
  $('regionalView').setAttribute('aria-pressed', String(mapView === 'regional'));
  if ($('metricSelect')) $('metricSelect').value = metric;
  if ($('mjoSelect')) $('mjoSelect').value = mjoMode;
  for (const [id, layer] of [['sstLayer','sst'],['jetsLayer','jets'],['psaLayer','psa']]) if ($(id)) $(id).checked = visibleLayers[layer];
  if ($('layerCount')) $('layerCount').textContent = `(${['sst','jets','psa'].filter(key => visibleLayers[key]).length}/3)`;

  const ensoLabel = currentEnso === 'todos'
    ? 'Todos os anos'
    : (currentEnso === 'el-nino' ? 'El Niño' : currentEnso === 'la-nina' ? 'La Niña' : 'ENOS Neutro');
  let title = `${currentSeason} · ${ensoLabel} · MJO Fase ${currentPhase}`;
  if (evidence && evidence.groupedPhase) {
    title += ` (Fases ${evidence.groupedPhase})`;
  }
  $('caseTitle').textContent = title;

  // Resumo do Caso
  if ($('caseSummary')) {
    if (result) {
      const note = evidence.groupNote ? `[${evidence.groupNote}] ` : '';
      $('caseSummary').textContent = `${note}${result.text} (${result.figure || evidence.source})`;
      if ($('caseSummary').style) $('caseSummary').style.color = result.sign === 'negativo' ? '#fbbf24' : 'var(--accent-teal)';
    } else if (metric === 'circulation' && evidence && evidence.circulation) {
      const note = evidence.groupNote ? `[${evidence.groupNote}] ` : '';
      $('caseSummary').textContent = `${note}${evidence.circulation} (${evidence.source})`;
      if ($('caseSummary').style) $('caseSummary').style.color = 'var(--accent-cyan)';
    } else {
      $('caseSummary').textContent = currentAmplitude < 1 ? 'MJO fraca (A < 1): destaques de fase ativa ocultos; jatos, TSM, ZCAS e SESA preservados.' : 'Sem resultado específico verificado nesta síntese.';
      if ($('caseSummary').style) $('caseSummary').style.color = 'var(--muted)';
    }
  }

  // Painel de Resultados
  $('result').replaceChildren();
  const value = document.createElement('p');
  if (result) {
    value.className = 'value';
    if (result.sign === 'negativo') {
      value.style.color = '#fbbf24';
      value.textContent = `Chuva reduzida / Subsidência · ${result.region}`;
    } else {
      value.style.color = 'var(--accent-teal)';
      value.textContent = `${metric === 'extremes' ? 'Frequência de extremos' : 'Chuva média'} · ${result.region}`;
    }
  } else if (metric === 'circulation' && evidence && evidence.circulation) {
    value.className = 'value';
    value.textContent = 'Circulação extratropical e teleconexões · Hemisfério Sul';
  } else {
    value.className = 'muted';
    value.textContent = 'Sem resultado específico verificado nesta síntese.';
  }
  $('result').appendChild(value);

  const description = document.createElement('p');
  if (result) {
    const note = evidence.groupNote ? `${evidence.groupNote} ` : '';
    description.textContent = `${note}${result.text}`;
  } else if (metric === 'circulation' && evidence && evidence.circulation) {
    const note = evidence.groupNote ? `${evidence.groupNote} ` : '';
    description.textContent = `${note}${evidence.circulation} Anomalias de altura geopotencial e propagação: ${evidence.psa || 'Dispersão de ondas de Rossby.'} Sem inferência de chuva regional a partir deste resultado de circulação. Fonte: ${evidence.source}.`;
  } else {
    description.textContent = `Não há evidência curada desta combinação (${currentSeason}, ${ensoLabel}, Fase ${currentPhase}) para ${metric === 'circulation' ? 'circulação' : metric === 'extremes' ? 'frequência de extremos' : 'chuva média'} no recorte documental atual de Fernandes & Grimm (2023) e Alvarez et al. (2016). A ausência de resultado não equivale a efeito zero ou ausência de influência física.`;
  }
  $('result').appendChild(description);

  // Faixa de TSM do ENOS
  $('sstBand').className = 'band' + (currentEnso === 'el-nino' ? ' warm' : currentEnso === 'la-nina' ? ' cold' : '');
  $('sstText').textContent = currentEnso === 'todos'
    ? 'Composição de todos os anos · análise climatológica média sem estratificação por ENOS'
    : currentEnso === 'el-nino'
      ? 'El Niño · anomalias quentes no Pacífico equatorial central/leste'
      : currentEnso === 'la-nina'
        ? 'La Niña · anomalias frias no Pacífico equatorial central/leste'
        : 'ENOS neutro · sem padrão forte de El Niño ou La Niña; não significa anomalia local zero.';

  // Informações de Fase da MJO
  const phaseInfo = getMjoPhaseCoords(currentPhase);
  $('phaseInfo').textContent = `Fase ${currentPhase} · ${phaseInfo.region} — referência nominal RMM de Wheeler & Hendon (2004), distinta de grade contínua de convecção observada.`;

  // Mecanismo PSA
  const psaCard = $('panelPsa') || $('psaCard');
  if (psaCard) psaCard.hidden = false;
  if ($('psaText')) {
    $('psaText').textContent = (evidence && evidence.psa)
      ? evidence.psa
      : 'Sem mecanismo de teleconexão PSA documentado especificamente para esta combinação no recorte curado da literatura.';
  }

  // Desenhar mapa com a base permanente e destaques seletivos
  drawMap(evidence);

  // Disparar atualização da narração (fala se ativa e atualiza texto acessível)
  speakCurrentNarration();
}

// Event Listeners: Estações (DJF, MAM, JJA, SON)
const seasonSelect = $('seasonSelect');
if (seasonSelect) {
  seasonSelect.addEventListener('change', () => {
    setClimateState({ season: seasonSelect.value });
  });
}
document.querySelectorAll('[data-season]:not([data-shortcut])').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ season: b.dataset.season });
  });
});

// Event Listeners: ENOS (El Niño, Neutro, La Niña, Todos os anos)
const ensoSelect = $('ensoSelect');
if (ensoSelect) {
  ensoSelect.addEventListener('change', () => {
    setClimateState({ enso: ensoSelect.value });
  });
}
document.querySelectorAll('[data-enso]:not([data-shortcut])').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ enso: b.dataset.enso });
  });
});

// Event Listeners: MJO Fases 1 a 8
const phaseSelect = $('phaseSelect');
if (phaseSelect) {
  phaseSelect.addEventListener('change', () => {
    setClimateState({ phase: Number(phaseSelect.value) });
  });
}
document.querySelectorAll('[data-phase]:not([data-shortcut])').forEach(b => {
  b.addEventListener('click', () => {
    setClimateState({ phase: Number(b.dataset.phase) });
  });
});

document.querySelectorAll('.event-select').forEach(select => {
  select.addEventListener('change', () => {
    if (!select.value) return;
    const [season, enso, phase, metricVal] = select.value.split('|');
    // Ao escolher evento de interesse: todos os controles de fase, intensidade ativa e padrão nos trópicos seguem essa escolha.
    // Eventos do Alvarez selecionam ENOS = 'todos'; eventos do Fernandes & Grimm selecionam o ENOS correspondente.
    const stateOpts = {
      season,
      enso,
      phase: Number(phase),
      metric: metricVal,
      amplitude: 1.5,
      mjoMode: 'chi'
    };
    setClimateState(stateOpts);
  });
});
$('metricSelect').addEventListener('change', e => setClimateState({metric:e.target.value}));
$('mjoSelect').addEventListener('change', e => setMjoMode(e.target.value));

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

// Alternância de Outras Camadas
for (const [id, layer] of [['sstLayer', 'sst'], ['jetsLayer', 'jets'], ['psaLayer', 'psa']]) {
  if ($(id)) {
    $(id).addEventListener('change', () => {
      visibleLayers[layer] = $(id).checked;
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
