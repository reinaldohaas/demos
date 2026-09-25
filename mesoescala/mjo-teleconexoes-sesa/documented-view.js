const $ = id => document.getElementById(id);
let selectedCase = DOCUMENTED_CASES[0];
let metric = 'extremes';
let mapView = 'global';
const visibleLayers = {mjo:true, sst:true, jets:false, psa:true};
const ns = 'http://www.w3.org/2000/svg';

function svg(tag, attributes, text) {
  const el = document.createElementNS(ns, tag);
  for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, v);
  if (text !== undefined) el.textContent = text;
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

function drawGlobalContext() {
  if (mapView !== 'global') return;

  // TSM Equatorial no mapa global: distinção qualitativa de El Niño, La Niña e Neutralidade
  if (visibleLayers.sst) {
    const [sx, sy] = project(-135, 0);
    if (selectedCase.enso === 'el-nino') {
      svg('ellipse', {cx: sx, cy: sy, rx: 130, ry: 26, fill: '#ef4444', 'fill-opacity': 0.35, stroke: '#f87171', 'stroke-dasharray': '5 4'});
      svg('text', {x: sx, y: sy + 44, fill: '#fca5a5', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle'}, 'El Niño · TSM equatorial anômala quente (qualitativo)');
    } else if (selectedCase.enso === 'la-nina') {
      svg('ellipse', {cx: sx, cy: sy, rx: 130, ry: 26, fill: '#2563eb', 'fill-opacity': 0.35, stroke: '#60a5fa', 'stroke-dasharray': '5 4'});
      svg('text', {x: sx, y: sy + 44, fill: '#93c5fd', 'font-size': 13, 'font-weight': '600', 'text-anchor': 'middle'}, 'La Niña · TSM equatorial anômala fria (qualitativo)');
    } else {
      svg('ellipse', {cx: sx, cy: sy, rx: 130, ry: 20, fill: '#0ea5e9', 'fill-opacity': 0.12, stroke: '#64748b', 'stroke-dasharray': '4 4'});
      svg('text', {x: sx, y: sy + 38, fill: '#94a3b8', 'font-size': 13, 'text-anchor': 'middle'}, 'ENOS Neutro · TSM equatorial próxima à média (qualitativo)');
    }
  }

  drawLand();

  // Rótulos de referência dos Oceanos
  for (const [lon, lat, label] of [[80, -48, 'OCEANO ÍNDICO'], [-145, -48, 'OCEANO PACÍFICO'], [-30, -48, 'OCEANO ATLÂNTICO']]) {
    const [x, y] = project(lon, lat);
    svg('text', {x, y, fill: '#5a829e', 'font-size': 14, 'letter-spacing': 2.5, 'text-anchor': 'middle', 'font-weight': '600'}, label);
  }

  // MJO: Referência nominal de fase RMM (Wheeler & Hendon 2004)
  if (visibleLayers.mjo) {
    const phaseLon = selectedCase.phase === 1 ? 30 : selectedCase.phase === 3 ? 85 : selectedCase.phase === 4 ? 125 : -45;
    const [mx, my] = project(phaseLon, 0);
    svg('ellipse', {cx: mx, cy: my, rx: 46, ry: 24, fill: '#2dd4bf', 'fill-opacity': 0.15, stroke: '#5eead4', 'stroke-dasharray': '5 4'});
    svg('text', {x: mx, y: my - 34, fill: '#88efdf', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle'}, `MJO · fase ${selectedCase.phase}`);
    svg('text', {x: mx, y: my - 16, fill: '#99d9d2', 'font-size': 11, 'text-anchor': 'middle'}, 'ref. nominal RMM');
    svg('text', {x: mx, y: my + 38, fill: '#7298a6', 'font-size': 11, 'text-anchor': 'middle'}, '(não é convecção observada)');
  }

  // Teleconexão PSA conceitual: representada somente quando há mecanismo verificado para o caso
  if (visibleLayers.psa && selectedCase.psa) {
    const p1 = project(-140, -32);
    const p2 = project(-100, -46);
    const p3 = project(-60, -36);
    svg('path', {
      d: `M ${p1[0]} ${p1[1]} Q ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`,
      fill: 'none', stroke: '#fbbf24', 'stroke-width': 2.2, 'stroke-dasharray': '6 5'
    });
    const labelPos = project(-100, -49);
    svg('text', {x: labelPos[0], y: labelPos[1], fill: '#fde68a', 'font-size': 12, 'text-anchor': 'middle'}, 'Corredor PSA (ondas de Rossby · defasagem ~7–12 d)');
  }
}

function drawJets() {
  if (!visibleLayers.jets) return;

  // Jato Subtropical (200 hPa): representado com uma linha contínua de referência média, sem duplicação e sem jato polar
  if (mapView === 'global') {
    const pts = [[140, -28], [175, -29], [-160, -30], [-120, -31], [-80, -30], [-55, -29], [-30, -28]];
    const projectedPts = pts.map(p => project(...p));
    const d = `M ` + projectedPts.map(p => `${p[0]},${p[1]}`).join(' L ');
    svg('path', {d, fill: 'none', stroke: '#38bdf8', 'stroke-width': 2.5, 'stroke-dasharray': '8 5'});
    const [jx, jy] = project(-115, -28);
    svg('text', {x: jx, y: jy - 7, fill: '#7dd3fc', 'font-size': 12, 'text-anchor': 'middle'}, 'Jato Subtropical (~200 hPa · referência)');
  } else {
    const p1 = project(-82, -31);
    const p2 = project(-38, -28);
    svg('line', {x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: '#38bdf8', 'stroke-width': 2.5, 'stroke-dasharray': '8 5'});
    const [jx, jy] = project(-60, -29);
    svg('text', {x: jx, y: jy - 7, fill: '#7dd3fc', 'font-size': 12, 'text-anchor': 'middle'}, 'Jato Subtropical (200 hPa)');
  }

  // SALLJ (~850 hPa): representado com uma seta única ao longo do leste dos Andes em direção ao SESA
  const salljStart = project(-63, -16);
  const salljMid = project(-61, -23);
  const salljEnd = project(-57, -30);
  svg('path', {
    d: `M ${salljStart[0]} ${salljStart[1]} Q ${salljMid[0]} ${salljMid[1]} ${salljEnd[0]} ${salljEnd[1]}`,
    fill: 'none', stroke: '#34d399', 'stroke-width': 3.2
  });
  // Ponta da seta do SALLJ
  const endX = salljEnd[0], endY = salljEnd[1];
  svg('polygon', {
    points: `${endX},${endY} ${endX - 7},${endY - 14} ${endX + 7},${endY - 10}`,
    fill: '#34d399'
  });
  const [sx, sy] = project(-65, -22);
  svg('text', {x: sx, y: sy, fill: '#6ee7b7', 'font-size': 12, 'font-weight': '600', 'text-anchor': 'end'}, 'SALLJ (~850 hPa)');
}

function drawMap(result) {
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
    drawGlobalContext();
  } else {
    drawLand();
  }

  // Jatos (Subtropical e SALLJ)
  drawJets();

  // Delimitação do SESA: rótulo mantido rigorosamente como "SESA" no topo da região, sem "Bacia do Prata"
  // As duas regiões são referências permanentes, mesmo sem efeito documentado.
  polygon(REGIONS.SESA_POLY, result?.region === 'SESA' ? '#2dd4bf26' : 'none', result?.region === 'SESA' ? '#5eead4' : '#486780', 1.8);
  polygon(REGIONS.ZCAS_POLY, result?.region === 'ZCAS' ? '#2dd4bf26' : 'none', result?.region === 'ZCAS' ? '#5eead4' : '#486780', 1.8, '4 3');
  const [zx, zy] = project(-37, -17);
  svg('text', {x: zx + 8, y: zy, fill: '#a5cce3', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'start'}, 'ZCAS');
  const [sx, sy] = project(-56, -21);
  svg('text', {x: sx, y: sy - 7, fill: '#a5cce3', 'font-size': 17, 'font-weight': '700', 'text-anchor': 'middle'}, 'SESA');

  // Resultado documentado para a variável selecionada (Chuva média ou Extremos)
  if (result) {
    const location = result.region === 'SESA' ? [-56, -30] : result.region === 'CESA' ? [-46, -15] : [-43, -21];
    const [x, y] = project(...location);

    // Símbolo de chuva qualitativo
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
    svg('text', {x: x + 47, y: y + 5, fill: '#aaf4e7', 'font-size': 24, 'font-weight': '800'}, '↑');
    svg('text', {x, y: y + 49, fill: '#c6f6ef', 'font-size': 14, 'font-weight': '600', 'text-anchor': 'middle'},
      metric === 'extremes' ? 'Extremos mais frequentes' : 'Chuva média favorecida');

    if (result.region === 'CESA') {
      svg('text', {x, y: y - 45, fill: '#a5cce3', 'font-size': 17, 'font-weight': '700', 'text-anchor': 'middle'},
        result.region === 'CESA' ? 'CESA · centro-leste' : result.region);
    }
  }

  $('mapTitle').textContent = mapView === 'global' ? 'Visão global: MJO, Pacífico e América do Sul' : 'América do Sul (visão regional)';
  $('mapDesc').textContent = 'ZCAS e SESA permanecem como referências geográficas. ' + (result ? `${result.region}: ${result.text} Símbolo regional sem magnitude ou extensão quantitativa.` : 'Sem destaque de efeito para esta variável; isso não indica efeito zero.');
}

function update() {
  const c = selectedCase;
  const result = c[metric];

  $('globalView').setAttribute('aria-pressed', String(mapView === 'global'));
  $('regionalView').setAttribute('aria-pressed', String(mapView === 'regional'));
  document.querySelectorAll('[data-case]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.case === c.id)));
  for (const m of ['mean', 'extremes']) $(m).setAttribute('aria-pressed', String(m === metric));

  $('caseTitle').textContent = `DJF · ${c.label}`;
  $('caseSummary').textContent = result ? result.text : 'Não representado nesta síntese: nenhum efeito é desenhado para esta variável.';

  $('result').replaceChildren();
  const value = document.createElement('p');
  value.className = result ? 'value' : 'muted';
  value.textContent = result ? `${metric === 'extremes' ? 'Frequência de extremos' : 'Chuva média'} · ${result.region}` : 'Sem resultado selecionado para esta variável';
  $('result').appendChild(value);

  const description = document.createElement('p');
  description.textContent = result ? result.text : 'A evidência de outra variável não foi transferida automaticamente para esta.';
  $('result').appendChild(description);

  $('sstBand').className = 'band' + (c.enso === 'el-nino' ? ' warm' : c.enso === 'la-nina' ? ' cold' : '');
  $('sstText').textContent = c.enso === 'el-nino'
    ? 'El Niño · anomalias quentes no Pacífico equatorial central/leste'
    : c.enso === 'la-nina'
      ? 'La Niña · anomalias frias no Pacífico equatorial central/leste'
      : 'ENOS neutro · sem padrão forte de El Niño ou La Niña; não significa anomalia local zero.';

  $('phaseInfo').textContent = `Fase ${c.phase} · ${c.phase === 3 ? 'Oceano Índico' : c.phase === 4 ? 'Continente Marítimo' : c.phase === 1 ? 'África e Oceano Índico Ocidental' : 'Hemisfério Ocidental e Atlântico'} — referência nominal RMM de Wheeler & Hendon (2004), distinta de grade contínua de convecção observada.`;

  $('psaCard').hidden = !c.psa;
  $('psaText').textContent = c.psa || '';

  drawMap(result);
}

// Inicialização dos botões de casos documentados
for (const c of DOCUMENTED_CASES) {
  const b = document.createElement('button');
  b.dataset.case = c.id;
  b.textContent = c.label;
  b.addEventListener('click', () => {
    selectedCase = c;
    // Preservar a variável escolhida ao comparar casos; apenas o destaque muda.
    update();
  });
  $('cases').appendChild(b);
}

for (const m of ['mean', 'extremes']) {
  $(m).addEventListener('click', () => {
    metric = m;
    update();
  });
}

$('legendButton').addEventListener('click', () => {
  $('legend').hidden = !$('legend').hidden;
  $('legendButton').setAttribute('aria-expanded', String(!$('legend').hidden));
  $('legendButton').textContent = $('legend').hidden ? 'Mostrar legenda' : 'Ocultar legenda';
});

for (const [id, view] of [['globalView', 'global'], ['regionalView', 'regional']]) {
  $(id).addEventListener('click', () => {
    mapView = view;
    update();
  });
}

for (const [id, layer] of [['mjoLayer', 'mjo'], ['sstLayer', 'sst'], ['jetsLayer', 'jets'], ['psaLayer', 'psa']]) {
  $(id).addEventListener('click', () => {
    visibleLayers[layer] = !visibleLayers[layer];
    $(id).setAttribute('aria-pressed', String(visibleLayers[layer]));
    update();
  });
}

update();
