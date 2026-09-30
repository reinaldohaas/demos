// Base de Conhecimento Científico das 96 Células (4 Estações × 3 Estados de ENOS × 8 Fases da MJO)
// Montada automaticamente a partir de 3 camadas estritas, com referência visível:
// 1. Fundo ENOS (independe da fase): Grimm, Barros & Doyle (2000), J. Climate 13, resumo (apenas SON).
// 2. Sinal MJO — Alvarez et al. (2016), TODOS OS ANOS (mesmo texto nas 3 colunas de ENOS; rótulo "média de todos os anos, sem separar ENOS").
// 3. MJO × ENOS — Fernandes & Grimm (2023), SOMENTE DJF, somente os casos aprovados.
// Célula sem nenhuma camada: "Sem resultado publicado para esta combinação".
// Em MAM/JJA/SON, na linha de MJO × ENOS: "Combinação MJO × ENOS não estudada nesta estação".

const GRIMM_96_MATRIX = {};

const SEASONS = ['DJF', 'MAM', 'JJA', 'SON'];
const ENSOS = ['la-nina', 'neutro', 'el-nino'];
const PHASES = [1, 2, 3, 4, 5, 6, 7, 8];

const PHASE_NAMES = {
  1: 'Hemisfério Ocidental/África',
  2: 'Oceano Índico Ocidental',
  3: 'Oceano Índico Central/Leste',
  4: 'Continente Marítimo',
  5: 'Continente Marítimo Oriental',
  6: 'Pacífico Ocidental',
  7: 'Linha de Data',
  8: 'Pacífico Leste/Hemisfério Ocidental'
};

const CURATED_BENCHMARKS = {
  'DJF-la-nina-8': {
    id: 'DJF-la-nina-8',
    title: 'DJF · Fernandes & Grimm · La Niña 8 — pico na ZCAS',
    author: 'Fernandes & Grimm (2023)'
  },
  'DJF-el-nino-1': {
    id: 'DJF-el-nino-1',
    title: 'DJF · Fernandes & Grimm · El Niño 1 — pico na ZCAS (fase posterior)',
    author: 'Fernandes & Grimm (2023)'
  },
  'DJF-el-nino-3': {
    id: 'DJF-el-nino-3',
    title: 'DJF · Fernandes & Grimm · El Niño 3 — pico no SESA',
    author: 'Fernandes & Grimm (2023)'
  },
  'DJF-neutro-4': {
    id: 'DJF-neutro-4',
    title: 'DJF · Fernandes & Grimm · Neutro 4 — maior aumento no SESA',
    author: 'Fernandes & Grimm (2023)'
  },
  'DJF-alvarez-3-4': {
    id: 'DJF-alvarez-3-4',
    title: 'DJF · Alvarez · 3–4 — mais chance de semana chuvosa (SESA)',
    author: 'Alvarez et al. (2016)'
  },
  'DJF-alvarez-8-1': {
    id: 'DJF-alvarez-8-1',
    title: 'DJF · Alvarez · 8–1 — mais chance de semana chuvosa (ZCAS)',
    author: 'Alvarez et al. (2016)'
  },
  'MAM-alvarez-1': {
    id: 'MAM-alvarez-1',
    title: 'MAM · Alvarez · 1 — mais chance de semana chuvosa (ZCAS)',
    author: 'Alvarez et al. (2016)'
  },
  'JJA-alvarez-8': {
    id: 'JJA-alvarez-8',
    title: 'JJA · Alvarez · 8 — mais chance de semana chuvosa (ZCAS)',
    author: 'Alvarez et al. (2016)'
  },
  'SON-alvarez-7-8': {
    id: 'SON-alvarez-7-8',
    title: 'SON · Alvarez · 7–8 — mais chance de semana chuvosa (ZCAS)',
    author: 'Alvarez et al. (2016)'
  },
  'SON-alvarez-1': {
    id: 'SON-alvarez-1',
    title: 'SON · Alvarez · 1 — mais chance de semana chuvosa (SESA)',
    author: 'Alvarez et al. (2016)'
  }
};

function buildGrimmCell(season, enso, phase) {
  // 1. Fundo ENOS (independe da fase):
  // SON: El Niño "mais chuva no SESA na primavera" / La Niña "menos chuva no SESA na primavera"
  // (Grimm, Barros & Doyle 2000, J. Climate 13, resumo). Neutro: nada.
  // Demais estações: nada por enquanto (aguarda o Reinaldo).
  let fundoEnsoText = null;
  let fundoEnsoRef = null;
  if (season === 'SON') {
    if (enso === 'el-nino') {
      fundoEnsoText = 'mais chuva no SESA na primavera';
      fundoEnsoRef = 'Grimm, Barros & Doyle (2000), J. Climate 13, resumo';
    } else if (enso === 'la-nina') {
      fundoEnsoText = 'menos chuva no SESA na primavera';
      fundoEnsoRef = 'Grimm, Barros & Doyle (2000), J. Climate 13, resumo';
    }
  }

  // 2. Sinal MJO — Alvarez et al. (2016), TODOS OS ANOS
  // Mesmo texto nas 3 colunas de ENOS; rótulo "média de todos os anos, sem separar ENOS".
  // Somente os casos já aprovados.
  const mjoLabel = 'média de todos os anos, sem separar ENOS';
  let sinalMjoText = null;
  let sinalMjoRef = null;
  let sinalMjoCaseId = null;

  if (season === 'DJF') {
    if (phase === 3 || phase === 4) {
      sinalMjoText = 'Mais chance de semana chuvosa no SESA (1,5×)';
      sinalMjoRef = 'Alvarez et al. (2016), Climate Dynamics 46, Figs. 4c, 5b, 7b e 10c';
      sinalMjoCaseId = 'DJF-alvarez-3-4';
    } else if (phase === 8 || phase === 1) {
      sinalMjoText = 'Mais chance de semana chuvosa na ZCAS (1,6×)';
      sinalMjoRef = 'Alvarez et al. (2016), Climate Dynamics 46, Figs. 4a,b e 10a';
      sinalMjoCaseId = 'DJF-alvarez-8-1';
    }
  } else if (season === 'MAM') {
    if (phase === 1) {
      sinalMjoText = 'Mais chance de semana chuvosa na ZCAS (1,5×)';
      sinalMjoRef = 'Alvarez et al. (2016), Climate Dynamics 46, Figs. 4d e 11b';
      sinalMjoCaseId = 'MAM-alvarez-1';
    }
  } else if (season === 'JJA') {
    if (phase === 8) {
      sinalMjoText = 'Mais chance de semana chuvosa na ZCAS (1,7×)';
      sinalMjoRef = 'Alvarez et al. (2016), Climate Dynamics 46, Figs. 4k e 12a';
      sinalMjoCaseId = 'JJA-alvarez-8';
    }
  } else if (season === 'SON') {
    if (phase === 7 || phase === 8) {
      sinalMjoText = 'Mais chance de semana chuvosa na ZCAS (1,7×)';
      sinalMjoRef = 'Alvarez et al. (2016), Climate Dynamics 46, Figs. 4i e 13a';
      sinalMjoCaseId = 'SON-alvarez-7-8';
    } else if (phase === 1) {
      sinalMjoText = 'Mais chance de semana chuvosa no SESA (1,5×)';
      sinalMjoRef = 'Alvarez et al. (2016), Climate Dynamics 46, Figs. 4j e 13b';
      sinalMjoCaseId = 'SON-alvarez-1';
    }
  }

  // 3. MJO × ENOS — Fernandes & Grimm (2023), SOMENTE DJF, somente os casos aprovados:
  // Em MAM/JJA/SON, na linha de MJO × ENOS: "Combinação MJO × ENOS não estudada nesta estação".
  let mjoXensoText = null;
  let mjoXensoRef = null;
  let mjoXensoNote = null;
  let mjoXensoCaseId = null;

  if (season === 'DJF') {
    if (enso === 'la-nina' && phase === 8) {
      mjoXensoText = 'Pico de aumento de extremos na ZCAS (fase 8)';
      mjoXensoRef = 'Fernandes & Grimm (2023), J. Climate 36, Figs. 5 e 8';
      mjoXensoCaseId = 'DJF-la-nina-8';
    } else if (enso === 'el-nino' && phase === 1) {
      mjoXensoText = 'Pico de aumento de extremos na ZCAS (fase 1)';
      mjoXensoRef = 'Fernandes & Grimm (2023), J. Climate 36, Figs. 5 e 8';
      mjoXensoCaseId = 'DJF-el-nino-1';
    } else if (enso === 'el-nino' && phase === 3) {
      mjoXensoText = 'Pico de aumento de extremos no SESA (fase 3)';
      mjoXensoRef = 'Fernandes & Grimm (2023), J. Climate 36, Figs. 5 e 8';
      mjoXensoCaseId = 'DJF-el-nino-3';
    } else if (enso === 'neutro' && phase === 4) {
      mjoXensoText = 'Maior aumento de extremos no SESA (fase 4)';
      mjoXensoRef = 'Fernandes & Grimm (2023), J. Climate 36, Figs. 5 e 8';
      mjoXensoCaseId = 'DJF-neutro-4';
    }
  } else {
    mjoXensoNote = 'Combinação MJO × ENOS não estudada nesta estação';
  }

  const hasAnyLayer = !!(fundoEnsoText || sinalMjoText || mjoXensoText);

  // Rótulo principal da célula (para resumos e cabeçalhos):
  let impactLabel = 'Sem resultado publicado para esta combinação';
  if (mjoXensoText) {
    impactLabel = mjoXensoText;
  } else if (sinalMjoText) {
    impactLabel = sinalMjoText;
  } else if (fundoEnsoText) {
    impactLabel = fundoEnsoText;
  }

  // Lista de citações presentes na célula:
  const citations = [];
  if (fundoEnsoRef && !citations.includes(fundoEnsoRef)) citations.push(fundoEnsoRef);
  if (sinalMjoRef && !citations.includes(sinalMjoRef)) citations.push(sinalMjoRef);
  if (mjoXensoRef && !citations.includes(mjoXensoRef)) citations.push(mjoXensoRef);

  // Identificação de caso curado da literatura
  const isCurated = !!(mjoXensoCaseId || sinalMjoCaseId);
  const curatedId = mjoXensoCaseId || sinalMjoCaseId || null;
  let curatedAuthor = null;
  let curatedTitle = null;
  if (mjoXensoCaseId) {
    curatedAuthor = 'Fernandes & Grimm (2023)';
    curatedTitle = mjoXensoText;
  } else if (sinalMjoCaseId) {
    curatedAuthor = 'Alvarez et al. (2016)';
    curatedTitle = sinalMjoText;
  }

  // Categorização visual para cores
  let signalCategory = 'neutro_climatologia';
  let sesaSignal = '0';
  if (mjoXensoCaseId === 'DJF-el-nino-3' || mjoXensoCaseId === 'DJF-neutro-4') {
    signalCategory = 'muito_acima';
    sesaSignal = '+2';
  } else if (sinalMjoCaseId === 'DJF-alvarez-3-4' || sinalMjoCaseId === 'SON-alvarez-1' || fundoEnsoText === 'mais chuva no SESA na primavera') {
    signalCategory = 'acima';
    sesaSignal = '+1';
  } else if (mjoXensoCaseId === 'DJF-la-nina-8' || mjoXensoCaseId === 'DJF-el-nino-1') {
    signalCategory = 'abaixo';
    sesaSignal = '-1';
  } else if (sinalMjoCaseId === 'DJF-alvarez-8-1' || sinalMjoCaseId === 'MAM-alvarez-1' || sinalMjoCaseId === 'JJA-alvarez-8' || sinalMjoCaseId === 'SON-alvarez-7-8') {
    signalCategory = 'abaixo';
    sesaSignal = '-1';
  } else if (fundoEnsoText === 'menos chuva no SESA na primavera') {
    signalCategory = 'abaixo';
    sesaSignal = '-1';
  }

  return {
    id: `${season}-${enso}-${phase}`,
    season,
    enso,
    phase,
    phaseName: PHASE_NAMES[phase],
    fundoEnso: {
      text: fundoEnsoText,
      ref: fundoEnsoRef
    },
    sinalMjo: {
      label: mjoLabel,
      text: sinalMjoText,
      ref: sinalMjoRef,
      caseId: sinalMjoCaseId
    },
    mjoXenso: {
      text: mjoXensoText,
      ref: mjoXensoRef,
      note: mjoXensoNote,
      caseId: mjoXensoCaseId
    },
    hasAnyLayer,
    impactLabel,
    citations,
    isCurated,
    curatedId,
    curatedAuthor,
    curatedTitle,
    signalCategory,
    sesaSignal
  };
}

// Inicializar as 96 células
for (const season of SEASONS) {
  for (const enso of ENSOS) {
    for (const phase of PHASES) {
      const key = `${season}-${enso}-${phase}`;
      GRIMM_96_MATRIX[key] = buildGrimmCell(season, enso, phase);
    }
  }
}

function getGrimmPermutation(season, enso, phase) {
  const key = `${season}-${enso}-${phase}`;
  return GRIMM_96_MATRIX[key] || null;
}

function getGrimmSeasonMatrix(season) {
  return Object.values(GRIMM_96_MATRIX).filter(item => item.season === season);
}

if (typeof module !== 'undefined') {
  module.exports = {
    GRIMM_96_MATRIX,
    getGrimmPermutation,
    getGrimmSeasonMatrix,
    PHASE_NAMES,
    CURATED_BENCHMARKS
  };
}

if (typeof window !== 'undefined') {
  window.GRIMM_96_MATRIX = GRIMM_96_MATRIX;
  window.getGrimmPermutation = getGrimmPermutation;
  window.getGrimmSeasonMatrix = getGrimmSeasonMatrix;
}
