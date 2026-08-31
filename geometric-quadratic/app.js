/**
 * GEOMETRIA UNIFICADA DA EQUAÇÃO QUADRÁTICA
 * Implementação em JavaScript Puro (Vanilla JS)
 */

(function () {
  'use strict';

  // ==========================================================================
  // ESTADO GLOBAL DA APLICAÇÃO
  // ==========================================================================
  const state = {
    // Coeficientes da equação f(x) = ax^2 + bx + c
    a: 1.0,
    b: -4.0,
    c: 5.0,

    // Ponto de teste no eixo real
    x: 2.0,

    // Raio para limite de curvatura (R -> infinito)
    R: 5.0,

    // Visibilidade dos elementos
    showParabola: true,
    showDerivative: true,
    showFactor1: true,
    showFactor2: true,
    showCircles: true,
    showTangents: true,
    showProductRect: true,
    showGrid: true,

    // Modo de visualização ('dual', 'real', 'complex')
    viewMode: 'dual',

    // Limites dos gráficos SVG (xmin, xmax, ymin, ymax)
    viewBoxReal: { xmin: -3, xmax: 7, ymin: -4, ymax: 10 },
    viewBoxComplex: { xmin: -3, xmax: 7, ymin: -5, ymax: 5 },

    // Controle de animação
    currentAnimation: null,
    animFrameId: null,
    animStartTime: 0,
    isDraggingX: false,
    dragTargetSvg: null,
    isPanning: false,
    panStart: { x: 0, y: 0 },
    panViewBoxStart: null
  };

  // ==========================================================================
  // ELEMENTOS DOM
  // ==========================================================================
  const dom = {
    // Inputs & Sliders
    sliderA: document.getElementById('slider-a'),
    sliderB: document.getElementById('slider-b'),
    sliderC: document.getElementById('slider-c'),
    sliderX: document.getElementById('slider-x'),
    sliderR: document.getElementById('slider-radius-limit'),

    numA: document.getElementById('num-a'),
    numB: document.getElementById('num-b'),
    numC: document.getElementById('num-c'),
    numX: document.getElementById('num-x'),

    btnReset: document.getElementById('btn-reset'),
    btnTheme: document.getElementById('btn-theme'),

    // Presets
    presetComplex: document.getElementById('preset-complex'),
    presetDouble: document.getElementById('preset-double'),
    presetReal: document.getElementById('preset-real'),
    presetInverted: document.getElementById('preset-inverted'),

    // LaTeX / Text Outputs
    mainEq: document.getElementById('latex-main-eq'),
    badgeDelta: document.getElementById('badge-delta-state'),
    valDelta: document.getElementById('val-delta'),
    valH: document.getElementById('val-h'),
    valK: document.getElementById('val-k'),
    valVertex: document.getElementById('val-vertex'),
    latexRoots: document.getElementById('latex-roots'),
    latexFactorization: document.getElementById('latex-factorization'),
    latexDerivative: document.getElementById('latex-derivative'),
    latexRadiusIdentity: document.getElementById('latex-radius-identity'),
    metricReadout: document.getElementById('metric-readout'),
    valRadiusLimit: document.getElementById('val-radius-limit'),
    latexCurvatureReadout: document.getElementById('latex-curvature-readout'),

    // Toggles
    chkParabola: document.getElementById('chk-parabola'),
    chkDerivative: document.getElementById('chk-derivative'),
    chkFactor1: document.getElementById('chk-factor1'),
    chkFactor2: document.getElementById('chk-factor2'),
    chkCircles: document.getElementById('chk-circles'),
    chkTangents: document.getElementById('chk-tangents'),
    chkProductRect: document.getElementById('chk-product-rect'),
    chkGrid: document.getElementById('chk-grid'),

    // View tabs
    tabDual: document.getElementById('tab-dual'),
    tabReal: document.getElementById('tab-real'),
    tabComplex: document.getElementById('tab-complex'),
    graphsWrapper: document.getElementById('graphs-wrapper'),

    // Animation Buttons
    btnAnimCircles: document.getElementById('btn-anim-circles'),
    btnAnimMultiply: document.getElementById('btn-anim-multiply'),
    btnAnimDerivative: document.getElementById('btn-anim-derivative'),
    btnAnimLimRadius: document.getElementById('btn-anim-lim-radius'),
    btnAnimCollapse: document.getElementById('btn-anim-collapse'),
    btnStopAnim: document.getElementById('btn-stop-anim'),

    animBanner: document.getElementById('anim-banner'),
    animBannerText: document.getElementById('anim-banner-text'),
    btnBannerClose: document.getElementById('btn-banner-close'),

    // Zoom
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),

    // SVGs
    svgReal: document.getElementById('svg-real'),
    svgComplex: document.getElementById('svg-complex'),
    containerReal: document.getElementById('svg-container-real'),
    containerComplex: document.getElementById('svg-container-complex')
  };

  // ==========================================================================
  // MOTOR MATEMÁTICO
  // ==========================================================================
  function computeMath() {
    const a = state.a;
    const b = state.b;
    const c = state.c;
    const x = state.x;

    // f(x) e derivada f'(x)
    const fx = a * x * x + b * x + c;
    const fPrime = 2 * a * x + b;

    // Discriminante
    const delta = b * b - 4 * a * c;

    // Vértice (h, f(h))
    const h = -b / (2 * a);
    const fh = a * h * h + b * h + c; // Também igual a -delta / (4a)

    let k = 0;
    let isComplex = false;
    let isDouble = false;
    let isReal = false;
    let roots = [];

    const EPS = 1e-7;

    if (delta < -EPS) {
      isComplex = true;
      k = Math.sqrt(-delta) / (2 * Math.abs(a));
      roots = [
        { re: h, im: k },
        { re: h, im: -k }
      ];
    } else if (Math.abs(delta) <= EPS) {
      isDouble = true;
      k = 0;
      roots = [
        { re: h, im: 0 },
        { re: h, im: 0 }
      ];
    } else {
      isReal = true;
      const sqrtDelta = Math.sqrt(delta);
      const x1 = (-b - sqrtDelta) / (2 * a);
      const x2 = (-b + sqrtDelta) / (2 * a);
      k = sqrtDelta / (2 * Math.abs(a)); // Separação do vértice
      roots = [
        { re: Math.min(x1, x2), im: 0 },
        { re: Math.max(x1, x2), im: 0 }
      ];
    }

    // Fatores lineares
    // r1(x) = a(x - x1), r2(x) = a(x - x2) quando reais
    // ou r1(x) = a(x - h - k), r2(x) = a(x - h + k)
    let r1_val = 0;
    let r2_val = 0;
    if (isReal || isDouble) {
      const x1 = roots[0].re;
      const x2 = roots[1].re;
      r1_val = a * (x - x1);
      r2_val = a * (x - x2);
    } else {
      // No caso complexo, projeção da parte real:
      r1_val = a * (x - h);
      r2_val = a * (x - h);
    }

    // Distância métrica / Raio aos centros complexos
    // r(x) = sqrt((x - h)^2 + k^2)
    const distReal = x - h;
    const r_complex = Math.sqrt(distReal * distReal + k * k);
    const r_squared = r_complex * r_complex;

    // Curvatura
    const curvature = 1 / state.R;

    return {
      a, b, c, x, fx, fPrime,
      delta, h, fh, k,
      isComplex, isDouble, isReal,
      roots,
      r1_val, r2_val,
      r_complex, r_squared,
      curvature
    };
  }

  // ==========================================================================
  // FORMATAÇÃO E ATUALIZAÇÃO DA INTERFACE (LATEX & CARDS)
  // ==========================================================================
  function renderMathText(el, latexStr, fallbackText) {
    if (!el) return;
    if (window.katex) {
      try {
        window.katex.render(latexStr, el, { throwOnError: false, displayMode: false });
        return;
      } catch (e) {
        console.warn('KaTeX render error:', e);
      }
    }
    el.innerText = fallbackText || latexStr;
  }

  function formatNum(n, decimals = 2) {
    if (Math.abs(n) < 1e-6) return '0.00';
    return Number(n).toFixed(decimals);
  }

  function updateMathUI(m) {
    // 1. Equação principal
    const signB = m.b >= 0 ? `+ ${formatNum(m.b)}` : `- ${formatNum(Math.abs(m.b))}`;
    const signC = m.c >= 0 ? `+ ${formatNum(m.c)}` : `- ${formatNum(Math.abs(m.c))}`;
    const eqLatex = `f(x) = ${formatNum(m.a)}x^2 ${signB}x ${signC}`;
    renderMathText(dom.mainEq, eqLatex, `f(x) = ${m.a}x^2 + ${m.b}x + ${m.c}`);

    // 2. Discriminante e Badge
    dom.valDelta.innerText = formatNum(m.delta, 2);
    dom.valH.innerText = formatNum(m.h, 2);
    dom.valK.innerText = formatNum(m.k, 2);
    dom.valVertex.innerText = `(${formatNum(m.h, 2)}, ${formatNum(m.fh, 2)})`;

    if (m.isComplex) {
      dom.badgeDelta.className = 'badge badge-complex';
      dom.badgeDelta.innerText = 'Δ < 0 (2 Raízes Complexas)';
    } else if (m.isDouble) {
      dom.badgeDelta.className = 'badge badge-double';
      dom.badgeDelta.innerText = 'Δ = 0 (1 Raiz Real Dupla)';
    } else {
      dom.badgeDelta.className = 'badge badge-real';
      dom.badgeDelta.innerText = 'Δ > 0 (2 Raízes Reais Distintas)';
    }

    // 3. Raízes
    let rootsLatex = '';
    if (m.isComplex) {
      rootsLatex = `z_1 = ${formatNum(m.h)} + ${formatNum(m.k)}i,\\quad z_2 = ${formatNum(m.h)} - ${formatNum(m.k)}i`;
    } else if (m.isDouble) {
      rootsLatex = `x_1 = x_2 = ${formatNum(m.h)} \\quad (k = 0)`;
    } else {
      rootsLatex = `x_1 = ${formatNum(m.roots[0].re)},\\quad x_2 = ${formatNum(m.roots[1].re)}`;
    }
    renderMathText(dom.latexRoots, rootsLatex);

    // 4. Fatoração
    let factorLatex = '';
    if (m.isComplex) {
      factorLatex = `f(x) = ${formatNum(m.a)}(x - (${formatNum(m.h)} + ${formatNum(m.k)}i))(x - (${formatNum(m.h)} - ${formatNum(m.k)}i))`;
    } else if (m.isDouble) {
      factorLatex = `f(x) = ${formatNum(m.a)}(x - ${formatNum(m.h)})^2`;
    } else {
      factorLatex = `f(x) = ${formatNum(m.a)}(x - ${formatNum(m.roots[0].re)})(x - ${formatNum(m.roots[1].re)})`;
    }
    renderMathText(dom.latexFactorization, factorLatex);

    // 5. Derivada
    const signDerivB = m.b >= 0 ? `+ ${formatNum(m.b)}` : `- ${formatNum(Math.abs(m.b))}`;
    const derivLatex = `f'(x) = ${formatNum(2 * m.a)}x ${signDerivB} = r_1(x) + r_2(x)`;
    renderMathText(dom.latexDerivative, derivLatex);

    // 6. Identidade do Raio
    let radiusLatex = '';
    if (m.isComplex) {
      radiusLatex = `r(x) = \\sqrt{(x - h)^2 + k^2} \\implies f(x) = a \\cdot r^2`;
    } else if (m.isDouble) {
      radiusLatex = `r(x) = |x - h| \\implies f(x) = a \\cdot (x - h)^2`;
    } else {
      radiusLatex = `f(x) = r_1(x) \\cdot (x - x_2) = \\frac{1}{a} r_1(x) r_2(x)`;
    }
    renderMathText(dom.latexRadiusIdentity, radiusLatex);

    const ar2 = m.a * m.r_squared;
    dom.metricReadout.innerHTML = `
      <span>x = ${formatNum(m.x, 2)}</span> &bull; 
      <span>r = ${formatNum(m.r_complex, 3)}</span> &bull; 
      <span>r² = ${formatNum(m.r_squared, 3)}</span> &bull; 
      <span>a·r² = ${formatNum(ar2, 3)}</span> &bull; 
      <span><strong>f(${formatNum(m.x, 1)}) = ${formatNum(m.fx, 3)}</strong></span>
    `;

    // 7. Curvatura
    dom.valRadiusLimit.innerText = `R = ${formatNum(state.R, 1)}`;
    const curvLatex = `\\kappa = \\frac{1}{R} = ${formatNum(m.curvature, 3)} \\implies \\text{Arco tangenciando em } (${formatNum(m.x, 1)}, ${formatNum(m.r1_val, 1)})`;
    renderMathText(dom.latexCurvatureReadout, curvLatex);
  }

  // ==========================================================================
  // COORDENADAS E SVG HELPERS
  // ==========================================================================
  function getSvgDimensions(svg) {
    const rect = svg.getBoundingClientRect();
    return {
      width: rect.width || 500,
      height: rect.height || 440
    };
  }

  function mathToSvg(x, y, vb, svgDim) {
    const scaleX = svgDim.width / (vb.xmax - vb.xmin);
    const scaleY = svgDim.height / (vb.ymax - vb.ymin);
    const svgX = (x - vb.xmin) * scaleX;
    const svgY = svgDim.height - (y - vb.ymin) * scaleY;
    return { x: svgX, y: svgY };
  }

  function svgToMath(svgX, svgY, vb, svgDim) {
    const scaleX = (vb.xmax - vb.xmin) / svgDim.width;
    const scaleY = (vb.ymax - vb.ymin) / svgDim.height;
    const x = vb.xmin + svgX * scaleX;
    const y = vb.ymin + (svgDim.height - svgY) * scaleY;
    return { x, y };
  }

  function createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, val] of Object.entries(attrs)) {
      el.setAttribute(key, val);
    }
    return el;
  }

  // ==========================================================================
  // DESENHO DA GRADE E DOS EIXOS
  // ==========================================================================
  function drawGridAndAxes(svg, vb, svgDim, xLabel = 'x', yLabel = 'y') {
    // Limpar SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const gridGroup = createSvgElement('g', { class: 'grid-layer' });
    const axisGroup = createSvgElement('g', { class: 'axis-layer' });
    const textGroup = createSvgElement('g', { class: 'labels-layer' });

    // Grid spacing
    const xStep = 1;
    const yStep = 1;

    const xStart = Math.ceil(vb.xmin / xStep) * xStep;
    const xEnd = Math.floor(vb.xmax / xStep) * xStep;
    const yStart = Math.ceil(vb.ymin / yStep) * yStep;
    const yEnd = Math.floor(vb.ymax / yStep) * yStep;

    // Linhas de Grade Verticais
    if (state.showGrid) {
      for (let x = xStart; x <= xEnd; x += xStep) {
        const p1 = mathToSvg(x, vb.ymin, vb, svgDim);
        const p2 = mathToSvg(x, vb.ymax, vb, svgDim);
        gridGroup.appendChild(createSvgElement('line', {
          x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
          stroke: 'var(--color-grid)',
          'stroke-width': x === 0 ? '1.5' : '1'
        }));
      }

      // Linhas de Grade Horizontais
      for (let y = yStart; y <= yEnd; y += yStep) {
        const p1 = mathToSvg(vb.xmin, y, vb, svgDim);
        const p2 = mathToSvg(vb.xmax, y, vb, svgDim);
        gridGroup.appendChild(createSvgElement('line', {
          x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
          stroke: 'var(--color-grid)',
          'stroke-width': y === 0 ? '1.5' : '1'
        }));
      }
    }

    // Eixo X Principal (y = 0)
    const originX1 = mathToSvg(vb.xmin, 0, vb, svgDim);
    const originX2 = mathToSvg(vb.xmax, 0, vb, svgDim);
    axisGroup.appendChild(createSvgElement('line', {
      x1: originX1.x, y1: originX1.y, x2: originX2.x, y2: originX2.y,
      stroke: 'var(--color-axis)',
      'stroke-width': '2'
    }));

    // Eixo Y Principal (x = 0)
    const originY1 = mathToSvg(0, vb.ymin, vb, svgDim);
    const originY2 = mathToSvg(0, vb.ymax, vb, svgDim);
    axisGroup.appendChild(createSvgElement('line', {
      x1: originY1.x, y1: originY1.y, x2: originY2.x, y2: originY2.y,
      stroke: 'var(--color-axis)',
      'stroke-width': '2'
    }));

    // Ticks e Números no Eixo X
    for (let x = xStart; x <= xEnd; x += xStep) {
      if (x === 0) continue;
      const pt = mathToSvg(x, 0, vb, svgDim);
      axisGroup.appendChild(createSvgElement('line', {
        x1: pt.x, y1: pt.y - 4, x2: pt.x, y2: pt.y + 4,
        stroke: 'var(--color-axis)',
        'stroke-width': '1.5'
      }));

      const txt = createSvgElement('text', {
        x: pt.x, y: pt.y + 16,
        fill: 'var(--text-muted)',
        'font-size': '11',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'middle'
      });
      txt.textContent = x;
      textGroup.appendChild(txt);
    }

    // Ticks e Números no Eixo Y
    for (let y = yStart; y <= yEnd; y += yStep) {
      if (y === 0) continue;
      const pt = mathToSvg(0, y, vb, svgDim);
      axisGroup.appendChild(createSvgElement('line', {
        x1: pt.x - 4, y1: pt.y, x2: pt.x + 4, y2: pt.y,
        stroke: 'var(--color-axis)',
        'stroke-width': '1.5'
      }));

      const txt = createSvgElement('text', {
        x: pt.x - 8, y: pt.y + 4,
        fill: 'var(--text-muted)',
        'font-size': '11',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'end'
      });
      txt.textContent = y;
      textGroup.appendChild(txt);
    }

    // Rótulos dos Eixos (Ex: x, y ou Re, Im)
    const labelXPos = mathToSvg(vb.xmax - 0.4, 0, vb, svgDim);
    const lblX = createSvgElement('text', {
      x: labelXPos.x, y: labelXPos.y - 8,
      fill: 'var(--text-primary)',
      'font-size': '12',
      'font-weight': 'bold',
      'font-family': 'var(--font-mono)'
    });
    lblX.textContent = xLabel;
    textGroup.appendChild(lblX);

    const labelYPos = mathToSvg(0, vb.ymax - 0.4, vb, svgDim);
    const lblY = createSvgElement('text', {
      x: labelYPos.x + 10, y: labelYPos.y + 12,
      fill: 'var(--text-primary)',
      'font-size': '12',
      'font-weight': 'bold',
      'font-family': 'var(--font-mono)'
    });
    lblY.textContent = yLabel;
    textGroup.appendChild(lblY);

    svg.appendChild(gridGroup);
    svg.appendChild(axisGroup);
    svg.appendChild(textGroup);
  }

  // ==========================================================================
  // RENDERIZADOR: PLANO REAL (XY)
  // ==========================================================================
  function renderRealPlane(m) {
    const svg = dom.svgReal;
    const svgDim = getSvgDimensions(svg);
    const vb = state.viewBoxReal;

    drawGridAndAxes(svg, vb, svgDim, 'Eixo Real (x)', 'y = f(x)');

    const contentGroup = createSvgElement('g', { class: 'real-content' });

    // 1. Fatores Lineares r1(x) e r2(x)
    if (m.isReal || m.isDouble) {
      const x1 = m.roots[0].re;
      const x2 = m.roots[1].re;

      // Linha Fator 1: r1(x) = a*(x - x1)
      if (state.showFactor1) {
        const ptA = mathToSvg(vb.xmin, m.a * (vb.xmin - x1), vb, svgDim);
        const ptB = mathToSvg(vb.xmax, m.a * (vb.xmax - x1), vb, svgDim);
        contentGroup.appendChild(createSvgElement('line', {
          x1: ptA.x, y1: ptA.y, x2: ptB.x, y2: ptB.y,
          stroke: 'var(--color-factor1)',
          'stroke-width': '2',
          'stroke-dasharray': '6,4',
          opacity: '0.85'
        }));
      }

      // Linha Fator 2: r2(x) = a*(x - x2)
      if (state.showFactor2) {
        const ptA = mathToSvg(vb.xmin, m.a * (vb.xmin - x2), vb, svgDim);
        const ptB = mathToSvg(vb.xmax, m.a * (vb.xmax - x2), vb, svgDim);
        contentGroup.appendChild(createSvgElement('line', {
          x1: ptA.x, y1: ptA.y, x2: ptB.x, y2: ptB.y,
          stroke: 'var(--color-factor2)',
          'stroke-width': '2',
          'stroke-dasharray': '6,4',
          opacity: '0.85'
        }));
      }
    }

    // 2. Reta da Derivada f'(x) = 2ax + b
    if (state.showDerivative) {
      const yMinX = 2 * m.a * vb.xmin + m.b;
      const yMaxX = 2 * m.a * vb.xmax + m.b;
      const ptA = mathToSvg(vb.xmin, yMinX, vb, svgDim);
      const ptB = mathToSvg(vb.xmax, yMaxX, vb, svgDim);

      contentGroup.appendChild(createSvgElement('line', {
        x1: ptA.x, y1: ptA.y, x2: ptB.x, y2: ptB.y,
        stroke: 'var(--color-derivative)',
        'stroke-width': '2.5',
        opacity: '0.9'
      }));
    }

    // 3. Parábola y = ax^2 + bx + c
    if (state.showParabola) {
      const numSamples = 200;
      const dx = (vb.xmax - vb.xmin) / numSamples;
      let pathD = '';

      for (let i = 0; i <= numSamples; i++) {
        const curX = vb.xmin + i * dx;
        const curY = m.a * curX * curX + m.b * curX + m.c;
        const pt = mathToSvg(curX, curY, vb, svgDim);

        if (i === 0) {
          pathD += `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
        } else {
          pathD += ` L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
        }
      }

      contentGroup.appendChild(createSvgElement('path', {
        d: pathD,
        fill: 'none',
        stroke: 'var(--color-parabola)',
        'stroke-width': '3.5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }));
    }

    // 4. Retângulo de Multiplicação dos Fatores em x (se ativo e real)
    if (state.showProductRect && (m.isReal || m.isDouble)) {
      const ptX = mathToSvg(m.x, 0, vb, svgDim);
      const ptF1 = mathToSvg(m.x, m.r1_val, vb, svgDim);
      const ptF2 = mathToSvg(m.x, m.r2_val, vb, svgDim);
      const ptFx = mathToSvg(m.x, m.fx, vb, svgDim);

      // Linhas verticais indicando alturas de r1, r2 e f(x)
      contentGroup.appendChild(createSvgElement('line', {
        x1: ptX.x - 3, y1: ptX.y, x2: ptX.x - 3, y2: ptF1.y,
        stroke: 'var(--color-factor1)', 'stroke-width': '2'
      }));
      contentGroup.appendChild(createSvgElement('line', {
        x1: ptX.x + 3, y1: ptX.y, x2: ptX.x + 3, y2: ptF2.y,
        stroke: 'var(--color-factor2)', 'stroke-width': '2'
      }));
      contentGroup.appendChild(createSvgElement('line', {
        x1: ptX.x, y1: ptX.y, x2: ptX.x, y2: ptFx.y,
        stroke: 'var(--color-parabola)', 'stroke-width': '2', 'stroke-dasharray': '3,3'
      }));
    }

    // 5. Vértice da Parábola
    const ptV = mathToSvg(m.h, m.fh, vb, svgDim);
    contentGroup.appendChild(createSvgElement('circle', {
      cx: ptV.x, cy: ptV.y, r: '5',
      fill: 'var(--color-parabola)',
      stroke: '#ffffff',
      'stroke-width': '1.5'
    }));

    const txtV = createSvgElement('text', {
      x: ptV.x, y: ptV.y + (m.a > 0 ? 18 : -10),
      fill: 'var(--color-parabola)',
      'font-size': '11',
      'font-weight': 'bold',
      'font-family': 'var(--font-mono)',
      'text-anchor': 'middle'
    });
    txtV.textContent = `V(${formatNum(m.h, 1)}, ${formatNum(m.fh, 1)})`;
    contentGroup.appendChild(txtV);

    // 6. Raízes Reais (se existirem)
    if (m.isReal || m.isDouble) {
      m.roots.forEach((root, idx) => {
        const ptRoot = mathToSvg(root.re, 0, vb, svgDim);
        const rootColor = idx === 0 ? 'var(--color-factor1)' : 'var(--color-factor2)';

        contentGroup.appendChild(createSvgElement('circle', {
          cx: ptRoot.x, cy: ptRoot.y, r: '6',
          fill: rootColor,
          stroke: '#ffffff',
          'stroke-width': '2'
        }));

        const txtR = createSvgElement('text', {
          x: ptRoot.x, y: ptRoot.y - 10,
          fill: rootColor,
          'font-size': '11',
          'font-weight': 'bold',
          'font-family': 'var(--font-mono)',
          'text-anchor': 'middle'
        });
        txtR.textContent = `x${idx + 1}=${formatNum(root.re, 1)}`;
        contentGroup.appendChild(txtR);
      });
    }

    // 7. Ponto de Teste X = (x, 0) e P = (x, f(x))
    const ptX = mathToSvg(m.x, 0, vb, svgDim);
    const ptP = mathToSvg(m.x, m.fx, vb, svgDim);
    const ptDeriv = mathToSvg(m.x, m.fPrime, vb, svgDim);

    // Linha vertical conectando X ao ponto na curva P(x, f(x))
    contentGroup.appendChild(createSvgElement('line', {
      x1: ptX.x, y1: ptX.y, x2: ptP.x, y2: ptP.y,
      stroke: 'var(--color-point-x)',
      'stroke-width': '1.5',
      'stroke-dasharray': '4,3'
    }));

    // Ponto na parábola P(x, f(x))
    contentGroup.appendChild(createSvgElement('circle', {
      cx: ptP.x, cy: ptP.y, r: '6',
      fill: 'var(--color-parabola)',
      stroke: '#ffffff',
      'stroke-width': '2'
    }));

    // Ponto na derivada
    if (state.showDerivative) {
      contentGroup.appendChild(createSvgElement('circle', {
        cx: ptDeriv.x, cy: ptDeriv.y, r: '4',
        fill: 'var(--color-derivative)',
        stroke: '#ffffff',
        'stroke-width': '1.5'
      }));
    }

    // Ponto Dourado Arrastável X=(x,0)
    const handleGroup = createSvgElement('g', {
      class: 'draggable-handle-x',
      cursor: 'ew-resize'
    });

    handleGroup.appendChild(createSvgElement('circle', {
      cx: ptX.x, cy: ptX.y, r: '9',
      fill: 'var(--color-point-x)',
      stroke: '#ffffff',
      'stroke-width': '2.5',
      filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))'
    }));

    const txtX = createSvgElement('text', {
      x: ptX.x, y: ptX.y + 24,
      fill: 'var(--color-point-x)',
      'font-size': '12',
      'font-weight': 'bold',
      'font-family': 'var(--font-mono)',
      'text-anchor': 'middle'
    });
    txtX.textContent = `X = ${formatNum(m.x, 2)}`;
    handleGroup.appendChild(txtX);

    contentGroup.appendChild(handleGroup);
    svg.appendChild(contentGroup);
  }

  // ==========================================================================
  // ==========================================================================
  // RENDERIZADOR: PLANO COMPLEXO & GEOMETRIA DOS CÍRCULOS
  // ==========================================================================
  function renderComplexPlane(m) {
    const svg = dom.svgComplex;
    const svgDim = getSvgDimensions(svg);
    const vb = state.viewBoxComplex;

    drawGridAndAxes(svg, vb, svgDim, 'Eixo Real Re(z)', 'Eixo Imag. Im(z)');

    const contentGroup = createSvgElement('g', { class: 'complex-content' });
    const ptH0 = mathToSvg(m.h, 0, vb, svgDim);
    const ptX = mathToSvg(m.x, 0, vb, svgDim);
    const scaleX = svgDim.width / (vb.xmax - vb.xmin);

    // ========================================================================
    // CASO 1: RAÍZES COMPLEXAS CONJUGADAS (Delta < 0)
    // ========================================================================
    if (m.isComplex) {
      const z1 = { re: m.h, im: m.k };
      const z2 = { re: m.h, im: -m.k };

      const ptZ1 = mathToSvg(z1.re, z1.im, vb, svgDim);
      const ptZ2 = mathToSvg(z2.re, z2.im, vb, svgDim);
      const radiusPixels = m.r_complex * scaleX;

      // 1. Linhas verticais indicando a distância k de z1 e z2 até o eixo real
      contentGroup.appendChild(createSvgElement('line', {
        x1: ptZ1.x, y1: ptZ1.y, x2: ptH0.x, y2: ptH0.y,
        stroke: 'var(--color-z1)',
        'stroke-width': '1.5',
        'stroke-dasharray': '4,3',
        opacity: '0.7'
      }));

      contentGroup.appendChild(createSvgElement('line', {
        x1: ptZ2.x, y1: ptZ2.y, x2: ptH0.x, y2: ptH0.y,
        stroke: 'var(--color-z2)',
        'stroke-width': '1.5',
        'stroke-dasharray': '4,3',
        opacity: '0.7'
      }));

      if (m.k > 0.1) {
        const txtK1 = createSvgElement('text', {
          x: ptZ1.x + 8, y: (ptZ1.y + ptH0.y) / 2,
          fill: 'var(--color-z1)',
          'font-size': '11',
          'font-weight': 'bold',
          'font-family': 'var(--font-mono)'
        });
        txtK1.textContent = `k = ${formatNum(m.k, 2)}`;
        contentGroup.appendChild(txtK1);
      }

      // 2. Círculos Complexos C1 e C2
      if (state.showCircles) {
        contentGroup.appendChild(createSvgElement('circle', {
          cx: ptZ1.x, cy: ptZ1.y, r: radiusPixels,
          fill: 'rgba(6, 182, 212, 0.08)',
          stroke: 'var(--color-z1)',
          'stroke-width': '2.5',
          filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))'
        }));

        contentGroup.appendChild(createSvgElement('circle', {
          cx: ptZ2.x, cy: ptZ2.y, r: radiusPixels,
          fill: 'rgba(245, 158, 11, 0.08)',
          stroke: 'var(--color-z2)',
          'stroke-width': '2.5',
          filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))'
        }));
      }

      // 3. Segmentos radiais e triângulo retângulo
      if (state.showTangents) {
        contentGroup.appendChild(createSvgElement('line', {
          x1: ptZ1.x, y1: ptZ1.y, x2: ptX.x, y2: ptX.y,
          stroke: 'var(--color-z1)',
          'stroke-width': '2'
        }));

        contentGroup.appendChild(createSvgElement('line', {
          x1: ptZ2.x, y1: ptZ2.y, x2: ptX.x, y2: ptX.y,
          stroke: 'var(--color-z2)',
          'stroke-width': '2'
        }));

        const triPath = `M ${ptH0.x} ${ptH0.y} L ${ptX.x} ${ptX.y} L ${ptZ1.x} ${ptZ1.y} Z`;
        contentGroup.appendChild(createSvgElement('path', {
          d: triPath,
          fill: 'rgba(250, 204, 21, 0.1)',
          stroke: 'var(--color-point-x)',
          'stroke-width': '1',
          'stroke-dasharray': '2,2'
        }));

        const midHyp = { x: (ptZ1.x + ptX.x) / 2, y: (ptZ1.y + ptX.y) / 2 };
        const txtR = createSvgElement('text', {
          x: midHyp.x - 12, y: midHyp.y - 8,
          fill: 'var(--color-point-x)',
          'font-size': '11',
          'font-weight': 'bold',
          'font-family': 'var(--font-mono)'
        });
        txtR.textContent = `r = ${formatNum(m.r_complex, 2)}`;
        contentGroup.appendChild(txtR);
      }

      // Centros z1 e z2
      contentGroup.appendChild(createSvgElement('circle', {
        cx: ptZ1.x, cy: ptZ1.y, r: '7',
        fill: 'var(--color-z1)',
        stroke: '#ffffff',
        'stroke-width': '2'
      }));

      const txtZ1 = createSvgElement('text', {
        x: ptZ1.x, y: ptZ1.y - 12,
        fill: 'var(--color-z1)',
        'font-size': '12',
        'font-weight': 'bold',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'middle'
      });
      txtZ1.textContent = `z1 = ${formatNum(m.h, 2)} + ${formatNum(m.k, 2)}i`;
      contentGroup.appendChild(txtZ1);

      contentGroup.appendChild(createSvgElement('circle', {
        cx: ptZ2.x, cy: ptZ2.y, r: '7',
        fill: 'var(--color-z2)',
        stroke: '#ffffff',
        'stroke-width': '2'
      }));

      const txtZ2 = createSvgElement('text', {
        x: ptZ2.x, y: ptZ2.y + 20,
        fill: 'var(--color-z2)',
        'font-size': '12',
        'font-weight': 'bold',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'middle'
      });
      txtZ2.textContent = `z2 = ${formatNum(m.h, 2)} - ${formatNum(m.k, 2)}i`;
      contentGroup.appendChild(txtZ2);
    }
    // ========================================================================
    // CASO 2: RAIZ REAL DUPLA (Delta = 0, k = 0)
    // ========================================================================
    else if (m.isDouble) {
      const radiusPixels = Math.abs(m.x - m.h) * scaleX;

      if (state.showCircles && radiusPixels > 1) {
        contentGroup.appendChild(createSvgElement('circle', {
          cx: ptH0.x, cy: ptH0.y, r: radiusPixels,
          fill: 'rgba(56, 189, 248, 0.08)',
          stroke: 'var(--color-factor1)',
          'stroke-width': '2.5'
        }));
      }

      contentGroup.appendChild(createSvgElement('circle', {
        cx: ptH0.x, cy: ptH0.y, r: '8',
        fill: 'var(--color-factor1)',
        stroke: '#ffffff',
        'stroke-width': '2'
      }));

      const txtDouble = createSvgElement('text', {
        x: ptH0.x, y: ptH0.y - 14,
        fill: 'var(--color-factor1)',
        'font-size': '12',
        'font-weight': 'bold',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'middle'
      });
      txtDouble.textContent = `x1 = x2 = ${formatNum(m.h, 2)} (Im = 0)`;
      contentGroup.appendChild(txtDouble);
    }
    // ========================================================================
    // CASO 3: RAÍZES REAIS DISTINTAS (Delta > 0)
    // ========================================================================
    else {
      const x1 = m.roots[0].re;
      const x2 = m.roots[1].re;
      const ptX1 = mathToSvg(x1, 0, vb, svgDim);
      const ptX2 = mathToSvg(x2, 0, vb, svgDim);

      const r1Pix = Math.abs(m.x - x1) * scaleX;
      const r2Pix = Math.abs(m.x - x2) * scaleX;

      // 1. Círculos centrados nas raízes reais passando por X (ou círculos de distância)
      if (state.showCircles) {
        if (r1Pix > 1) {
          contentGroup.appendChild(createSvgElement('circle', {
            cx: ptX1.x, cy: ptX1.y, r: r1Pix,
            fill: 'rgba(6, 182, 212, 0.05)',
            stroke: 'var(--color-factor1)',
            'stroke-width': '2',
            'stroke-dasharray': '5,3'
          }));
        }
        if (r2Pix > 1) {
          contentGroup.appendChild(createSvgElement('circle', {
            cx: ptX2.x, cy: ptX2.y, r: r2Pix,
            fill: 'rgba(245, 158, 11, 0.05)',
            stroke: 'var(--color-factor2)',
            'stroke-width': '2',
            'stroke-dasharray': '5,3'
          }));
        }
      }

      // 2. Segmento destacando a distância do vértice h até cada raiz (k = sqrt(Delta)/(2a))
      contentGroup.appendChild(createSvgElement('line', {
        x1: ptX1.x, y1: ptX1.y - 8, x2: ptX2.x, y2: ptX2.y - 8,
        stroke: 'var(--text-muted)',
        'stroke-width': '1.5',
        'stroke-dasharray': '3,3'
      }));

      const txtDist = createSvgElement('text', {
        x: ptH0.x, y: ptH0.y - 12,
        fill: 'var(--text-muted)',
        'font-size': '10',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'middle'
      });
      txtDist.textContent = `2·dist = ${formatNum(2 * m.k, 2)}`;
      contentGroup.appendChild(txtDist);

      // 3. Raízes Reais no Eixo Real
      contentGroup.appendChild(createSvgElement('circle', {
        cx: ptX1.x, cy: ptX1.y, r: '7',
        fill: 'var(--color-factor1)',
        stroke: '#ffffff',
        'stroke-width': '2'
      }));

      const txtR1 = createSvgElement('text', {
        x: ptX1.x, y: ptX1.y - 14,
        fill: 'var(--color-factor1)',
        'font-size': '12',
        'font-weight': 'bold',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'middle'
      });
      txtR1.textContent = `x1 = ${formatNum(x1, 2)} (Real)`;
      contentGroup.appendChild(txtR1);

      contentGroup.appendChild(createSvgElement('circle', {
        cx: ptX2.x, cy: ptX2.y, r: '7',
        fill: 'var(--color-factor2)',
        stroke: '#ffffff',
        'stroke-width': '2'
      }));

      const txtR2 = createSvgElement('text', {
        x: ptX2.x, y: ptX2.y - 14,
        fill: 'var(--color-factor2)',
        'font-size': '12',
        'font-weight': 'bold',
        'font-family': 'var(--font-mono)',
        'text-anchor': 'middle'
      });
      txtR2.textContent = `x2 = ${formatNum(x2, 2)} (Real)`;
      contentGroup.appendChild(txtR2);
    }

    // 4. Limite de Curvatura / Círculo de Raio R (Seção 9 & 11)
    if (state.R < 90) {
      const radiusLimPix = state.R * scaleX;
      const centerLimY = -state.R;
      const ptCenterLim = mathToSvg(m.x, centerLimY, vb, svgDim);

      contentGroup.appendChild(createSvgElement('circle', {
        cx: ptCenterLim.x, cy: ptCenterLim.y, r: radiusLimPix,
        fill: 'none',
        stroke: 'var(--color-curv)',
        'stroke-width': '1.8',
        'stroke-dasharray': '5,3',
        opacity: '0.8'
      }));
    }

    // Ponto Real Arrastável X=(x, 0)
    const handleGroup = createSvgElement('g', {
      class: 'draggable-handle-x',
      cursor: 'ew-resize'
    });

    handleGroup.appendChild(createSvgElement('circle', {
      cx: ptX.x, cy: ptX.y, r: '9',
      fill: 'var(--color-point-x)',
      stroke: '#ffffff',
      'stroke-width': '2.5',
      filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))'
    }));

    const txtX = createSvgElement('text', {
      x: ptX.x, y: ptX.y + 24,
      fill: 'var(--color-point-x)',
      'font-size': '12',
      'font-weight': 'bold',
      'font-family': 'var(--font-mono)',
      'text-anchor': 'middle'
    });
    txtX.textContent = `X = (${formatNum(m.x, 2)}, 0)`;
    handleGroup.appendChild(txtX);

    contentGroup.appendChild(handleGroup);
    svg.appendChild(contentGroup);
  }

  // ==========================================================================
  // ATUALIZAÇÃO PRINCIPAL DE RENDERIZAÇÃO
  // ==========================================================================
  function updateAll() {
    const m = computeMath();
    updateMathUI(m);
    renderRealPlane(m);
    renderComplexPlane(m);
  }

  // ==========================================================================
  // MOTOR DE ANIMAÇÕES
  // ==========================================================================
  function stopAnimation() {
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }
    state.currentAnimation = null;
    dom.btnStopAnim.style.display = 'none';
    dom.animBanner.style.display = 'none';

    document.querySelectorAll('.btn-anim').forEach(btn => btn.classList.remove('animating'));
  }

  function startAnimation(name, durationMs, stepCallback, onComplete) {
    stopAnimation();
    state.currentAnimation = name;
    dom.btnStopAnim.style.display = 'inline-flex';
    dom.animBanner.style.display = 'flex';
    state.animStartTime = performance.now();

    function loop(time) {
      const elapsed = time - state.animStartTime;
      let progress = elapsed / durationMs;

      if (progress >= 1.0) {
        progress = 1.0;
        stepCallback(progress);
        updateAll();
        if (onComplete) onComplete();
        stopAnimation();
        return;
      }

      stepCallback(progress);
      updateAll();
      state.animFrameId = requestAnimationFrame(loop);
    }

    state.animFrameId = requestAnimationFrame(loop);
  }

  // Animação 1: Construção dos Círculos (Varia x continuamente e constrói a métrica)
  function runAnimCircles() {
    dom.btnAnimCircles.classList.add('animating');
    dom.animBannerText.innerText = 'Animando Construção: Percorrendo X no eixo real e gerando f(x) = a·r²...';

    const startX = state.h - 3;
    const endX = state.h + 3;

    startAnimation('circles', 5000, (progress) => {
      // Movimento harmônico suave de vai e volta
      const t = 0.5 * (1 - Math.cos(progress * 2 * Math.PI));
      state.x = startX + (endX - startX) * t;
      dom.sliderX.value = state.x.toFixed(2);
      dom.numX.value = state.x.toFixed(2);
    });
  }

  // Animação 2: Multiplicação dos Fatores (r1 * r2 = f(x))
  function runAnimMultiply() {
    dom.btnAnimMultiply.classList.add('animating');
    dom.animBannerText.innerText = 'Multiplicando Fatores: Avaliando r₁(x) · r₂(x) = f(x)...';

    // Se estiver em complexo, muda para raízes reais para melhor visualização didática
    if (state.c === 5) {
      state.c = 3;
      dom.sliderC.value = 3;
      dom.numC.value = 3;
    }

    const startX = 0;
    const endX = 4;

    startAnimation('multiply', 5000, (progress) => {
      const t = 0.5 * (1 - Math.cos(progress * 2 * Math.PI));
      state.x = startX + (endX - startX) * t;
      dom.sliderX.value = state.x.toFixed(2);
      dom.numX.value = state.x.toFixed(2);
    });
  }

  // Animação 3: Soma dos Fatores -> Derivada (r1 + r2 = f')
  function runAnimDerivative() {
    dom.btnAnimDerivative.classList.add('animating');
    dom.animBannerText.innerText = 'Soma dos Fatores → Derivada: Demonstrando que r₁(x) + r₂(x) = 2ax + b...';

    if (state.c === 5) {
      state.c = 3;
      dom.sliderC.value = 3;
      dom.numC.value = 3;
    }

    const startX = -1;
    const endX = 5;

    startAnimation('derivative', 5000, (progress) => {
      const t = 0.5 * (1 - Math.cos(progress * 2 * Math.PI));
      state.x = startX + (endX - startX) * t;
      dom.sliderX.value = state.x.toFixed(2);
      dom.numX.value = state.x.toFixed(2);
    });
  }

  // Animação 4: Da Reta ao Círculo (R -> infinito)
  function runAnimLimRadius() {
    dom.btnAnimLimRadius.classList.add('animating');
    dom.animBannerText.innerText = 'Da Reta ao Círculo: Variando o raio R de 2 até ∞ (curvatura κ → 0)...';

    startAnimation('limRadius', 5000, (progress) => {
      const t = 0.5 * (1 - Math.cos(progress * 2 * Math.PI));
      state.R = 2 + (80 - 2) * t;
      dom.sliderR.value = state.R.toFixed(1);
    });
  }

  // Animação 5: Transição Delta (k -> 0) de Complexo -> Duplo -> Real
  function runAnimCollapse() {
    dom.btnAnimCollapse.classList.add('animating');
    dom.animBannerText.innerText = 'Transição Δ: Diminuindo c de 5 para 3 (k > 0 → k = 0 → Raízes Reais)...';

    startAnimation('collapse', 6000, (progress) => {
      const t = 0.5 * (1 - Math.cos(progress * 2 * Math.PI));
      state.c = 5 + (3 - 5) * t;
      dom.sliderC.value = state.c.toFixed(2);
      dom.numC.value = state.c.toFixed(2);
    });
  }

  // ==========================================================================
  // EVENTOS E INTERATIVIDADE
  // ==========================================================================
  function bindInputs() {
    // Sincronização Slider <-> Input Numérico para 'a'
    dom.sliderA.addEventListener('input', (e) => {
      let val = parseFloat(e.target.value);
      if (Math.abs(val) < 0.05) val = val >= 0 ? 0.1 : -0.1;
      state.a = val;
      dom.numA.value = state.a.toFixed(1);
      updateAll();
    });
    dom.numA.addEventListener('change', (e) => {
      let val = parseFloat(e.target.value) || 1.0;
      if (Math.abs(val) < 0.05) val = 1.0;
      state.a = val;
      dom.sliderA.value = state.a;
      updateAll();
    });

    // Sincronização Slider <-> Input Numérico para 'b'
    dom.sliderB.addEventListener('input', (e) => {
      state.b = parseFloat(e.target.value);
      dom.numB.value = state.b.toFixed(1);
      updateAll();
    });
    dom.numB.addEventListener('change', (e) => {
      state.b = parseFloat(e.target.value) || 0;
      dom.sliderB.value = state.b;
      updateAll();
    });

    // Sincronização Slider <-> Input Numérico para 'c'
    dom.sliderC.addEventListener('input', (e) => {
      state.c = parseFloat(e.target.value);
      dom.numC.value = state.c.toFixed(1);
      updateAll();
    });
    dom.numC.addEventListener('change', (e) => {
      state.c = parseFloat(e.target.value) || 0;
      dom.sliderC.value = state.c;
      updateAll();
    });

    // Ponto X no eixo real
    dom.sliderX.addEventListener('input', (e) => {
      state.x = parseFloat(e.target.value);
      dom.numX.value = state.x.toFixed(2);
      updateAll();
    });
    dom.numX.addEventListener('change', (e) => {
      state.x = parseFloat(e.target.value) || 0;
      dom.sliderX.value = state.x;
      updateAll();
    });

    // Raio Limite R
    dom.sliderR.addEventListener('input', (e) => {
      state.R = parseFloat(e.target.value);
      updateAll();
    });

    // Presets
    dom.presetComplex.addEventListener('click', () => {
      setActivePreset(dom.presetComplex);
      setEquationParams(1.0, -4.0, 5.0, 2.0);
    });

    dom.presetDouble.addEventListener('click', () => {
      setActivePreset(dom.presetDouble);
      setEquationParams(1.0, -4.0, 4.0, 2.0);
    });

    dom.presetReal.addEventListener('click', () => {
      setActivePreset(dom.presetReal);
      setEquationParams(1.0, -4.0, 3.0, 2.0);
    });

    dom.presetInverted.addEventListener('click', () => {
      setActivePreset(dom.presetInverted);
      setEquationParams(-1.0, 4.0, -5.0, 2.0);
    });

    // Reset
    dom.btnReset.addEventListener('click', () => {
      setActivePreset(dom.presetComplex);
      setEquationParams(1.0, -4.0, 5.0, 2.0);
    });

    // Toggles de Visibilidade
    dom.chkParabola.addEventListener('change', (e) => { state.showParabola = e.target.checked; updateAll(); });
    dom.chkDerivative.addEventListener('change', (e) => { state.showDerivative = e.target.checked; updateAll(); });
    dom.chkFactor1.addEventListener('change', (e) => { state.showFactor1 = e.target.checked; updateAll(); });
    dom.chkFactor2.addEventListener('change', (e) => { state.showFactor2 = e.target.checked; updateAll(); });
    dom.chkCircles.addEventListener('change', (e) => { state.showCircles = e.target.checked; updateAll(); });
    dom.chkTangents.addEventListener('change', (e) => { state.showTangents = e.target.checked; updateAll(); });
    dom.chkProductRect.addEventListener('change', (e) => { state.showProductRect = e.target.checked; updateAll(); });
    dom.chkGrid.addEventListener('change', (e) => { state.showGrid = e.target.checked; updateAll(); });

    // Modos de Visualização (Abas)
    dom.tabDual.addEventListener('click', () => setViewMode('dual'));
    dom.tabReal.addEventListener('click', () => setViewMode('real'));
    dom.tabComplex.addEventListener('click', () => setViewMode('complex'));

    // Botões de Animação
    dom.btnAnimCircles.addEventListener('click', runAnimCircles);
    dom.btnAnimMultiply.addEventListener('click', runAnimMultiply);
    dom.btnAnimDerivative.addEventListener('click', runAnimDerivative);
    dom.btnAnimLimRadius.addEventListener('click', runAnimLimRadius);
    dom.btnAnimCollapse.addEventListener('click', runAnimCollapse);
    dom.btnStopAnim.addEventListener('click', stopAnimation);
    dom.btnBannerClose.addEventListener('click', stopAnimation);

    // Zoom Controls
    dom.btnZoomIn.addEventListener('click', () => zoom(0.8));
    dom.btnZoomOut.addEventListener('click', () => zoom(1.25));
    dom.btnZoomReset.addEventListener('click', resetZoom);

    // Tema Claro / Escuro
    dom.btnTheme.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      updateAll();
    });

    // Redimensionamento de Janela
    window.addEventListener('resize', () => {
      updateAll();
    });

    // Drag & Drop no SVG para o Ponto X
    setupSvgInteraction(dom.svgReal, state.viewBoxReal);
    setupSvgInteraction(dom.svgComplex, state.viewBoxComplex);
  }

  function setActivePreset(button) {
    document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
  }

  function setEquationParams(a, b, c, x) {
    stopAnimation();
    state.a = a;
    state.b = b;
    state.c = c;
    state.x = x !== undefined ? x : state.x;

    dom.sliderA.value = a;
    dom.numA.value = a.toFixed(1);
    dom.sliderB.value = b;
    dom.numB.value = b.toFixed(1);
    dom.sliderC.value = c;
    dom.numC.value = c.toFixed(1);
    dom.sliderX.value = state.x;
    dom.numX.value = state.x.toFixed(2);

    updateAll();
  }

  function setViewMode(mode) {
    state.viewMode = mode;
    dom.tabDual.classList.toggle('active', mode === 'dual');
    dom.tabReal.classList.toggle('active', mode === 'real');
    dom.tabComplex.classList.toggle('active', mode === 'complex');

    dom.graphsWrapper.className = 'graphs-wrapper';
    if (mode === 'real') dom.graphsWrapper.classList.add('single-real');
    if (mode === 'complex') dom.graphsWrapper.classList.add('single-complex');

    setTimeout(updateAll, 50);
  }

  function zoom(factor) {
    ['viewBoxReal', 'viewBoxComplex'].forEach(vbKey => {
      const vb = state[vbKey];
      const cx = (vb.xmin + vb.xmax) / 2;
      const cy = (vb.ymin + vb.ymax) / 2;
      const w = (vb.xmax - vb.xmin) * factor;
      const h = (vb.ymax - vb.ymin) * factor;

      vb.xmin = cx - w / 2;
      vb.xmax = cx + w / 2;
      vb.ymin = cy - h / 2;
      vb.ymax = cy + h / 2;
    });
    updateAll();
  }

  function resetZoom() {
    state.viewBoxReal = { xmin: -3, xmax: 7, ymin: -4, ymax: 10 };
    state.viewBoxComplex = { xmin: -3, xmax: 7, ymin: -5, ymax: 5 };
    updateAll();
  }

  // ==========================================================================
  // ARRASTAR PONTO X & PAN PELO SVG
  // ==========================================================================
  function setupSvgInteraction(svg, viewBox) {
    svg.addEventListener('mousedown', onPointerDown);
    svg.addEventListener('touchstart', onPointerDown, { passive: false });

    function getEventPos(e) {
      const rect = svg.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        svgX: clientX - rect.left,
        svgY: clientY - rect.top
      };
    }

    function onPointerDown(e) {
      const pos = getEventPos(e);
      const svgDim = getSvgDimensions(svg);
      const mathPt = svgToMath(pos.svgX, pos.svgY, viewBox, svgDim);

      // Se clicar perto do eixo real ou do ponto X, inicia arrasto do X
      state.isDraggingX = true;
      state.dragTargetSvg = svg;
      state.x = mathPt.x;
      dom.sliderX.value = state.x.toFixed(2);
      dom.numX.value = state.x.toFixed(2);
      updateAll();

      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!state.isDraggingX) return;
      if (e.cancelable) e.preventDefault();

      const pos = getEventPos(e);
      const svgDim = getSvgDimensions(svg);
      const mathPt = svgToMath(pos.svgX, pos.svgY, viewBox, svgDim);

      state.x = mathPt.x;
      dom.sliderX.value = state.x.toFixed(2);
      dom.numX.value = state.x.toFixed(2);
      updateAll();
    }

    function onPointerUp() {
      state.isDraggingX = false;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    }
  }

  // ==========================================================================
  // INICIALIZAÇÃO DA APLICAÇÃO
  // ==========================================================================
  function init() {
    bindInputs();

    // Aguardar carregamento do KaTeX se disponível
    function triggerMathRender() {
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(document.body);
        } catch (e) {
          console.warn('Auto-render KaTeX error:', e);
        }
      }
      updateAll();
    }

    if (window.katex) {
      triggerMathRender();
    } else {
      window.addEventListener('load', triggerMathRender);
      setTimeout(triggerMathRender, 300);
    }
  }

  // Executar inicialização quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
