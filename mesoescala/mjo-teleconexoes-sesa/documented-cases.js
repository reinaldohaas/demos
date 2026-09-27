// Base de Evidências Científicas Documentadas
// Cada resultado registra: referência, figura/seção, combinação, região, variável, sinal, defasagem e limites.
// Null significa ausência de resultado representado nesta síntese documental (nunca efeito zero).
// Fontes centrais:
// - Fernandes & Grimm (2023), Journal of Climate, DOI: 10.1175/JCLI-D-22-0781.1
// - Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics, DOI: 10.1007/s00382-015-2581-6
// - Jones, Mu, Carvalho & Ding (2023), npj Climate and Atmospheric Science, DOI: 10.1038/s41612-023-00501-4

const DOCUMENTED_CASES = [
  // =========================================================================
  // 1. CASOS ESTRATIFICADOS POR ENOS EM DJF — Fernandes & Grimm (2023)
  // =========================================================================
  {
    id: 'DJF-la-nina-8',
    season: 'DJF',
    enso: 'la-nina',
    phase: 8,
    label: 'DJF · La Niña · 8 — pico na ZCAS (Fernandes & Grimm)',
    source_convection: 'Convecção reforçada no Pacífico Sul subtropical centro-leste nas fases 7+8 (La Niña; Fernandes & Grimm 2023, Figs. 9 e 12).',
    circulation: 'Trem de ondas PSA maduro com centro anticiclônico anômalo no Atlântico subtropical, favorecendo convergência na ZCAS.',
    mean: {
      region: 'ZCAS',
      text: 'Resposta máxima destacada de chuva média sobre a ZCAS em La Niña (resposta remota da convecção-fonte nas fases 7–8).',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    extremes: {
      region: 'ZCAS',
      text: 'Aumento pronunciado da frequência de extremos de chuva na ZCAS (região CESA) em La Niña.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    psa: 'Trem de ondas PSA maduro impõe anomalia anticiclônica no Atlântico subtropical e convergência sobre a ZCAS, mantendo subsidência compensatória e supressão de chuva sobre o SESA (dipolo clássico).',
    source: 'Fernandes & Grimm (2023), Journal of Climate',
    limits: 'Destaque de pico na ZCAS em La Niña com dipolo em relação ao SESA; não extrapolar para ausência de efeito na fase 1.'
  },
  {
    id: 'DJF-el-nino-1',
    season: 'DJF',
    enso: 'el-nino',
    phase: 1,
    label: 'DJF · El Niño · 1 — pico na ZCAS, uma fase depois (Fernandes & Grimm)',
    source_convection: 'Convecção reforçada no Pacífico Sul subtropical centro-leste, um pouco mais a leste nas fases 8+1 (El Niño; Fernandes & Grimm 2023, Figs. 5 e 9). Não confundir com o envelope equatorial da MJO, que na fase 1 se encontra sobre o Hemisfério Ocidental e África.',
    circulation: 'Trem de ondas PSA maduro no Atlântico Sudoeste acoplado à circulação sobre o sudeste e centro-leste da América do Sul.',
    mean: {
      region: 'ZCAS',
      text: 'Resposta máxima destacada de chuva média na ZCAS em El Niño (resposta remota da convecção-fonte com defasagem de fase para 8–1 no El Niño, contra 7–8 na La Niña).',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    extremes: {
      region: 'ZCAS',
      text: 'Maior aumento da frequência de extremos na ZCAS (região CESA) destacado para El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    psa: 'Trem de ondas PSA plenamente estabelecido a partir da fonte subtropical no Pacífico central-leste; acoplamento dinâmico intensifica a convergência na ZCAS (região CESA) (Fernandes & Grimm 2023, Figs. 5 e 12).',
    source: 'Fernandes & Grimm (2023), Journal of Climate',
    limits: 'Resposta máxima defasada em relação à fonte (forçante em 8–1, resposta remota de pico na fase 1 condicionada pelo El Niño).'
  },

  // =========================================================================
  // 2. COMPOSIÇÕES DE TODOS OS ANOS NAS 4 ESTAÇÕES — Alvarez et al. (2016)
  // Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262
  // Probabilidade de chuva semanal acima do tercil superior pelas fases do RMM
  // =========================================================================

  // --- DJF (VERÃO AUSTRAL) ---
  {
    id: 'DJF-todos-3-4',
    season: 'DJF',
    enso: 'todos',
    phase: 3,
    groupedPhases: [3, 4],
    groupedPhase: '3–4',
    groupNote: 'Composição de todos os anos (sem separação por ENOS) — Alvarez et al. (2016).',
    label: 'DJF · Todos os anos · fases 3–4 (Bacia do Prata)',
    source_convection: 'Convecção anômala ativa da MJO sobre o Oceano Índico central/leste e Continente Marítimo (fases 3–4).',
    circulation: 'Convergência em altos níveis (200 hPa) sobre a América do Sul tropical e escoamento ciclônico anômalo próximo ao extremo sul do continente.',
    mean: {
      region: 'SESA',
      text: 'Aumento significativo na probabilidade de precipitação semanal acima do tercil superior na Bacia do Prata.',
      figure: 'Alvarez et al. (2016), Figs. 2 e 5',
      sign: 'positivo',
      timing: 'composição de fases 3–4'
    },
    extremes: null,
    psa: 'Convergência anômala em 200 hPa sobre a América do Sul tropical acoplada a circulação ciclônica no extremo sul do continente favorece convergência de umidade e intensificação de chuvas na Bacia do Prata (Alvarez et al. 2016).',
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics',
    limits: 'Composição de todos os anos (sem separação por ENOS); fases agrupadas 3–4.'
  },
  {
    id: 'DJF-todos-8-1',
    season: 'DJF',
    enso: 'todos',
    phase: 8,
    groupedPhases: [8, 1],
    groupedPhase: '8–1',
    groupNote: 'Composição de todos os anos (sem separação por ENOS) — Alvarez et al. (2016).',
    label: 'DJF · Média de todos os anos · 8–1 — ZCAS (Alvarez et al.)',
    source_convection: 'Convecção da MJO no Hemisfério Ocidental e África (fases 8–1).',
    circulation: 'Divergência em altos níveis (200 hPa) sobre a América do Sul tropical/subtropical e circulação anticiclônica anômala em altitude.',
    mean: {
      region: 'ZCAS',
      text: 'Aumento na probabilidade de precipitação semanal acima do tercil superior na região da ZCAS.',
      figure: 'Alvarez et al. (2016), Figs. 2 e 5',
      sign: 'positivo',
      timing: 'composição de fases 8–1'
    },
    extremes: null,
    psa: 'Divergência em 200 hPa sobre a América do Sul e circulação anticiclônica anômala no Atlântico subtropical favorecem convecção na ZCAS, gerando dipolo com precipitação suprimida na Bacia do Prata (Alvarez et al. 2016).',
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics',
    limits: 'Composição de todos os anos (sem separação por ENOS); fases agrupadas 8–1.'
  },

  // --- MAM (OUTONO AUSTRAL) ---
  {
    id: 'MAM-todos-3-4',
    season: 'MAM',
    enso: 'todos',
    phase: 3,
    groupedPhases: [3, 4],
    groupedPhase: '3–4',
    groupNote: 'Composição de todos os anos (sem separação por ENOS) — Alvarez et al. (2016).',
    label: 'MAM · Todos os anos · fases 3–4 (Bacia do Prata)',
    source_convection: 'Convecção ativa no Oceano Índico e Continente Marítimo em fases 3–4 no outono austral.',
    circulation: 'Convergência em 200 hPa sobre a América do Sul tropical e perturbações ciclônicas no Atlântico Sudoeste; padrão similar ao de verão com resposta atenuada nos extratrópicos.',
    mean: {
      region: 'SESA',
      text: 'Aumento na probabilidade de precipitação semanal acima do tercil superior na Bacia do Prata, com padrão similar a DJF, porém com resposta atenuada nos extratrópicos.',
      figure: 'Alvarez et al. (2016), Figs. 2 e 6',
      sign: 'positivo',
      timing: 'composição de fases 3–4'
    },
    extremes: null,
    psa: 'Convergência em 200 hPa sobre o Brasil tropical e circulação ciclônica no Atlântico Sudoeste; padrão similar a DJF com magnitude atenuada no outono (Alvarez et al. 2016).',
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics',
    limits: 'Composição de todos os anos (sem separação por ENOS); teleconexão atenuada nos extratrópicos no outono.'
  },
  {
    id: 'MAM-todos-8-1',
    season: 'MAM',
    enso: 'todos',
    phase: 8,
    groupedPhases: [8, 1],
    groupedPhase: '8–1',
    groupNote: 'Composição de todos os anos (sem separação por ENOS) — Alvarez et al. (2016).',
    label: 'MAM · Todos os anos · fases 8–1 (ZCAS)',
    source_convection: 'Convecção ativa no Hemisfério Ocidental e África em fases 8–1 no outono.',
    circulation: 'Divergência em 200 hPa sobre a América do Sul tropical/subtropical e anomalia anticiclônica em altitude.',
    mean: {
      region: 'ZCAS',
      text: 'Aumento na probabilidade de precipitação semanal acima do tercil superior na região da ZCAS, semelhante ao verão.',
      figure: 'Alvarez et al. (2016), Figs. 2 e 6',
      sign: 'positivo',
      timing: 'composição de fases 8–1'
    },
    extremes: null,
    psa: 'Divergência em 200 hPa sobre a América do Sul e escoamento anticiclônico anômalo favorecem a convecção na faixa da ZCAS, semelhante ao verão (Alvarez et al. 2016).',
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics',
    limits: 'Composição de todos os anos (sem separação por ENOS); fases agrupadas 8–1 no outono, com padrão semelhante ao verão.'
  },

  // --- JJA (INVERNO AUSTRAL) ---
  {
    id: 'JJA-todos-4-5',
    season: 'JJA',
    enso: 'todos',
    phase: 4,
    groupedPhases: [4, 5],
    groupedPhase: '4–5',
    groupNote: 'Composição de todos os anos (sem separação por ENOS) — Alvarez et al. (2016).',
    label: 'JJA · Todos os anos · fases 4–5 (ZCAS seca / frio)',
    source_convection: 'Convecção ativa no Continente Marítimo em fases 4–5 no inverno austral.',
    circulation: 'Convergência em altos níveis (200 hPa) sobre a América do Sul tropical e anomalia anticiclônica no sul do continente.',
    mean: {
      region: 'ZCAS',
      text: 'Chuva reduzida e anomalias frias no litoral da região da ZCAS, associadas a convergência em 200 hPa sobre a América do Sul tropical e anomalia anticiclônica no sul do continente.',
      figure: 'Alvarez et al. (2016), Figs. 4, 7 e Seção 4',
      sign: 'negativo',
      timing: 'composição de fases 4–5'
    },
    extremes: null,
    psa: 'Convergência anômala em 200 hPa sobre a América do Sul tropical e anomalia anticiclônica no sul do continente induzem subsidência e supressão de chuva no litoral da ZCAS no inverno (Alvarez et al. 2016).',
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics',
    limits: 'Composição de todos os anos (junho a novembro, fases 4–5); sinal seco / supressão convectiva no litoral da ZCAS.'
  },

  // --- SON (PRIMAVERA AUSTRAL) ---
  {
    id: 'SON-todos-4-5',
    season: 'SON',
    enso: 'todos',
    phase: 4,
    groupedPhases: [4, 5],
    groupedPhase: '4–5',
    groupNote: 'Composição de todos os anos (sem separação por ENOS) — Alvarez et al. (2016).',
    label: 'SON · Todos os anos · fases 4–5 (ZCAS seca / frio)',
    source_convection: 'Convecção ativa no Continente Marítimo em fases 4–5 na primavera austral.',
    circulation: 'Convergência em 200 hPa sobre a América do Sul tropical e anomalia anticiclônica no sul do continente.',
    mean: {
      region: 'ZCAS',
      text: 'Chuva reduzida e anomalias frias no litoral da região da ZCAS, sob convergência em 200 hPa sobre a América do Sul tropical e anomalia anticiclônica no sul do continente.',
      figure: 'Alvarez et al. (2016), Figs. 4, 8 e Seção 4',
      sign: 'negativo',
      timing: 'composição de fases 4–5'
    },
    extremes: null,
    psa: 'Convergência em 200 hPa sobre o Brasil tropical e anomalia anticiclônica no sul do continente impõem subsidência e reduzem a precipitação na faixa costeira da ZCAS (Alvarez et al. 2016).',
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics',
    limits: 'Composição de todos os anos (junho a novembro, fases 4–5); sinal seco no litoral da ZCAS.'
  },
  {
    id: 'SON-todos-7-8',
    season: 'SON',
    enso: 'todos',
    phase: 7,
    groupedPhases: [7, 8],
    groupedPhase: '7–8',
    groupNote: 'Composição de todos os anos (sem separação por ENOS) — Alvarez et al. (2016).',
    label: 'SON · Todos os anos · fases 7–8 (ZCAS)',
    source_convection: 'Convecção ativa no Pacífico oeste e linha de data / Hemisfério Ocidental (fases 7–8).',
    circulation: 'Divergência em altos níveis (200 hPa) sobre a região da ZCAS, impulsionada por trem de ondas de Rossby excitado pela convecção da MJO.',
    mean: {
      region: 'ZCAS',
      text: 'Chuva aumentada na região da ZCAS associada a divergência em altos níveis (200 hPa), gerada por trem de ondas de Rossby da MJO.',
      figure: 'Alvarez et al. (2016), Figs. 4, 8 e Seção 4',
      sign: 'positivo',
      timing: 'composição de fases 7–8'
    },
    extremes: null,
    psa: 'Trem de ondas de Rossby excitado pela convecção da MJO no Pacífico induz divergência em 200 hPa sobre a região da ZCAS, favorecendo o aumento da precipitação na primavera austral (Alvarez et al. 2016).',
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics',
    limits: 'Composição de todos os anos na primavera austral (SON); fases agrupadas 7–8.'
  }
];

function findDocumentedCase(season, enso, phase) {
  const p = Number(phase);
  // 1. Busca por combinação específica com o ENOS selecionado
  if (enso && enso !== 'todos') {
    const specific = DOCUMENTED_CASES.find(c =>
      c.season === season &&
      c.enso === enso &&
      (Number(c.phase) === p || (c.groupedPhases && c.groupedPhases.includes(p)))
    );
    if (specific) return specific;
  }
  // 2. Fallback para composição de todos os anos (sem separação por ENOS)
  return DOCUMENTED_CASES.find(c =>
    c.season === season &&
    c.enso === 'todos' &&
    (Number(c.phase) === p || (c.groupedPhases && c.groupedPhases.includes(p)))
  ) || null;
}

if (typeof module !== 'undefined') {
  module.exports = { DOCUMENTED_CASES, findDocumentedCase };
}
