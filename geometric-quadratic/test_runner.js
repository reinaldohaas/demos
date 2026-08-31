/**
 * SUÍTE DE TESTES AUTOMATIZADOS - GEOMETRIA DA EQUAÇÃO QUADRÁTICA
 * Executável via Node.js ou navegador
 */

function runAllTests() {
  console.log('====================================================');
  console.log('INICIANDO TESTES DO MOTOR MATEMÁTICO E IDENTIDADES');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  function assertClose(val1, val2, testName, eps = 1e-6) {
    const diff = Math.abs(val1 - val2);
    assert(diff <= eps, testName, `Esperado: ${val2}, Obtido: ${val1}, Dif: ${diff}`);
  }

  // Motor de cálculo idêntico ao de app.js para testes isolados
  function computeMathForTest(a, b, c, x, R = 5.0) {
    const fx = a * x * x + b * x + c;
    const fPrime = 2 * a * x + b;
    const delta = b * b - 4 * a * c;
    const h = -b / (2 * a);
    const fh = a * h * h + b * h + c;

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
      k = sqrtDelta / (2 * Math.abs(a));
      roots = [
        { re: Math.min(x1, x2), im: 0 },
        { re: Math.max(x1, x2), im: 0 }
      ];
    }

    let r1_val = 0;
    let r2_val = 0;
    if (isReal || isDouble) {
      r1_val = a * (x - roots[0].re);
      r2_val = a * (x - roots[1].re);
    } else {
      r1_val = a * (x - h);
      r2_val = a * (x - h);
    }

    const distReal = x - h;
    const r_complex = Math.sqrt(distReal * distReal + k * k);
    const r_squared = r_complex * r_complex;
    const curvature = 1 / R;

    return {
      a, b, c, x, fx, fPrime, delta, h, fh, k,
      isComplex, isDouble, isReal, roots,
      r1_val, r2_val, r_complex, r_squared, curvature
    };
  }

  // TESTE 1: Exemplo Inicial Obrigatório (f(x) = x^2 - 4x + 5)
  console.log('--- TESTE 1: Exemplo Obrigatório Complexo (x^2 - 4x + 5) ---');
  const m1 = computeMathForTest(1.0, -4.0, 5.0, 2.0);
  assertClose(m1.delta, -4.0, 'Discriminante Delta = -4');
  assertClose(m1.h, 2.0, 'Vértice h = 2');
  assertClose(m1.k, 1.0, 'Parâmetro k = 1');
  assert(m1.isComplex, 'Identificado como Raízes Complexas');
  assertClose(m1.roots[0].re, 2.0, 'z1 Parte Real = 2');
  assertClose(m1.roots[0].im, 1.0, 'z1 Parte Imaginária = +1');
  assertClose(m1.roots[1].re, 2.0, 'z2 Parte Real = 2');
  assertClose(m1.roots[1].im, -1.0, 'z2 Parte Imaginária = -1');
  assertClose(m1.fPrime, 0.0, 'Derivada no vértice x=2 é f\'(2) = 0');
  
  // Teste da Identidade do Raio Complexo: f(x) = a * r^2
  assertClose(m1.a * m1.r_squared, m1.fx, 'Identidade Central f(x) = a * r(x)^2 em x=2');

  const m1_eval = computeMathForTest(1.0, -4.0, 5.0, 4.0);
  assertClose(m1_eval.a * m1_eval.r_squared, m1_eval.fx, 'Identidade Central f(x) = a * r(x)^2 em x=4');
  assertClose(m1_eval.fx, 5.0, 'f(4) = 4^2 - 4(4) + 5 = 5');
  assertClose(m1_eval.r_complex, Math.sqrt(5), 'Raio r(4) = sqrt((4-2)^2 + 1^2) = sqrt(5)');

  // TESTE 2: Caso Raiz Real Dupla (c = 4 => x^2 - 4x + 4)
  console.log('\n--- TESTE 2: Caso k = 0 / Raiz Real Dupla (x^2 - 4x + 4) ---');
  const m2 = computeMathForTest(1.0, -4.0, 4.0, 2.0);
  assertClose(m2.delta, 0.0, 'Discriminante Delta = 0');
  assertClose(m2.k, 0.0, 'Parâmetro k = 0');
  assert(m2.isDouble, 'Identificado como Raiz Real Dupla');
  assertClose(m2.roots[0].re, 2.0, 'x1 = 2');
  assertClose(m2.roots[1].re, 2.0, 'x2 = 2');
  assertClose(m2.fx, 0.0, 'f(2) = 0');
  assertClose(m2.a * m2.r_squared, m2.fx, 'Identidade f(x) = a(x - h)^2 no caso duplo');

  // TESTE 3: Caso Raízes Reais Distintas (c = 3 => x^2 - 4x + 3 = (x-1)(x-3))
  console.log('\n--- TESTE 3: Caso Raízes Reais (x^2 - 4x + 3) ---');
  const m3 = computeMathForTest(1.0, -4.0, 3.0, 2.5);
  assertClose(m3.delta, 4.0, 'Discriminante Delta = 4');
  assert(m3.isReal, 'Identificado como Raízes Reais');
  assertClose(m3.roots[0].re, 1.0, 'x1 = 1');
  assertClose(m3.roots[1].re, 3.0, 'x2 = 3');

  // Identidade da Derivada como Soma dos Fatores: f'(x) = r1(x) + r2(x)
  assertClose(m3.r1_val + m3.r2_val, m3.fPrime, 'Identidade f\'(x) = r1(x) + r2(x)');

  // Identidade da Multiplicação dos Fatores: r1(x) * (x - x2) = f(x)
  const factorProduct = (m3.x - 1.0) * (m3.x - 3.0);
  assertClose(factorProduct, m3.fx, 'Produto dos fatores (x-1)(x-3) = f(x)');

  // TESTE 4: Parábola com a < 0 (-x^2 + 4x - 5)
  console.log('\n--- TESTE 4: Parábola Invertida (a = -1) ---');
  const m4 = computeMathForTest(-1.0, 4.0, -5.0, 2.0);
  assertClose(m4.delta, -4.0, 'Discriminante Delta = -4');
  assertClose(m4.h, 2.0, 'Vértice h = 2');
  assertClose(m4.k, 1.0, 'Parâmetro k = 1');
  assertClose(m4.a * m4.r_squared, m4.fx, 'Identidade f(x) = a * r^2 para a = -1');
  assertClose(m4.fx, -1.0, 'f(2) = -1');

  // TESTE 5: Curvatura e Limite R -> infinito
  console.log('\n--- TESTE 5: Limite de Curvatura (R -> infinito) ---');
  const m5_finite = computeMathForTest(1.0, -4.0, 5.0, 2.0, 5.0);
  assertClose(m5_finite.curvature, 0.2, 'Curvatura kappa = 1/5 = 0.2 para R = 5');

  const m5_large = computeMathForTest(1.0, -4.0, 5.0, 2.0, 1000.0);
  assertClose(m5_large.curvature, 0.001, 'Curvatura kappa -> 0 para R = 1000 (aproximação à reta)');

  console.log('\n====================================================');
  console.log(`RESULTADO DOS TESTES: ${passed} PASSOU | ${failed} FALHOU`);
  console.log('====================================================');

  return { passed, failed };
}

// Executar no Node.js se chamado diretamente
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests };
  if (require.main === module) {
    const res = runAllTests();
    process.exit(res.failed === 0 ? 0 : 1);
  }
}
