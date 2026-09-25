// Base de Evidências Científicas Documentadas
// Cada resultado registra: referência, figura/seção, combinação, região, variável, sinal, defasagem e limites.
// Null significa ausência de resultado representado nesta síntese documental (nunca efeito zero).
// Fontes centrais:
// - Fernandes & Grimm (2023), Journal of Climate, DOI: 10.1175/JCLI-D-22-0781.1
// - Jones, Mu, Carvalho & Ding (2023), npj Climate and Atmospheric Science, DOI: 10.1038/s41612-023-00501-4
// - Roy, Arblaster, Wheeler & Lim (2025), Geophysical Research Letters, DOI: 10.1029/2024GL113395

const DOCUMENTED_CASES = [
  // --- SEQUÊNCIA MJO 7 → 8 → 1 EM DJF (LA NIÑA) ---
  {
    id: 'DJF-la-nina-7',
    season: 'DJF',
    enso: 'la-nina',
    phase: 7,
    label: 'DJF · La Niña · fase 7',
    source_convection: 'Convecção-fonte anômala na porção central-leste do Pacífico Sul subtropical (20°S–35°S, 140°W–100°W; Fernandes & Grimm 2023, Fig. 9). Não confundir com o envelope equatorial da MJO, que na fase 7 se encontra no Pacífico oeste.',
    circulation: 'Início da dispersão de trem de ondas de Rossby (PSA) através do guia subtropical em direção à América do Sul.',
    mean: {
      region: 'ZCAS',
      text: 'Início da organização de anomalias de precipitação na região da ZCAS em La Niña (fase precursora da resposta madura).',
      figure: 'Fernandes & Grimm (2023), Figs. 9 e 12',
      sign: 'positivo',
      timing: 'composição de fase / precursora'
    },
    extremes: {
      region: 'CESA',
      text: 'Sinal incipiente de aumento de extremos no CESA (centro-leste), antecedendo a resposta madura da fase 8.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / precursora'
    },
    psa: 'Início de dispersão de trem de ondas de Rossby a partir da fonte subtropical no Pacífico central-leste. Há uma defasagem dinâmica de aproximadamente uma fase entre a divergência na fonte e a resposta madura na América do Sul (Fernandes & Grimm 2023; Roy et al. 2025).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Fase precursora; a resposta mais robusta e destacada na ZCAS ocorre na fase 8 subsequente.'
  },
  {
    id: 'DJF-la-nina-8',
    season: 'DJF',
    enso: 'la-nina',
    phase: 8,
    label: 'DJF · La Niña · fase 8',
    source_convection: 'Convecção-fonte anômala estabelecida no Pacífico Sul subtropical central-leste (fases 7–8).',
    circulation: 'Trem de ondas PSA maduro com centro anticiclônico anômalo no Atlântico subtropical, favorecendo convergência na ZCAS.',
    mean: {
      region: 'ZCAS',
      text: 'Resposta máxima destacada de chuva média sobre a ZCAS em La Niña (resposta remota da convecção-fonte nas fases 7–8).',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento pronunciado da frequência de extremos de chuva na ZCAS e no CESA em La Niña.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    psa: 'Trem de ondas PSA maduro impõe anomalia anticiclônica no Atlântico subtropical e convergência sobre a ZCAS, mantendo subsidência compensatória e supressão de chuva sobre o SESA (dipolo clássico).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Destaque de pico na ZCAS em La Niña com dipolo em relação ao SESA; não extrapolar para ausência de efeito na fase 1.'
  },
  {
    id: 'DJF-la-nina-1',
    season: 'DJF',
    enso: 'la-nina',
    phase: 1,
    label: 'DJF · La Niña · fase 1',
    source_convection: 'Convecção da MJO desloca-se para o hemisfério ocidental / África, enfraquecendo a forçante no Pacífico subtropical.',
    circulation: 'Trem de ondas PSA em transição; enfraquecimento gradual da forçante sobre o Atlântico subtropical.',
    mean: {
      region: 'ZCAS',
      text: 'A anomalia positiva de chuva desloca-se para a borda sul da ZCAS (São Paulo, sul de Minas Gerais e oceano adjacente), enquanto os setores central e norte enfraquecem em relação à fase 8.',
      figure: 'Fernandes & Grimm (2023), Figs. 9 e 12',
      sign: 'positivo',
      timing: 'composição de fase / transição'
    },
    extremes: {
      region: 'CESA',
      text: 'Extremos concentrados na borda sul da ZCAS e faixa costeira de SP/RJ, em declínio no interior do CESA.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / transição'
    },
    psa: 'Teleconexão remota residual das fases 7–8 em declínio; relaxamento gradual da anomalia anticiclônica sobre o Atlântico subtropical.',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Não se trata de declínio homogêneo geral: há migração meridional do sinal para a borda sul da ZCAS e oceano antes da dissipação.'
  },

  // --- SEQUÊNCIA MJO 7 → 8 → 1 EM DJF (EL NIÑO) ---
  {
    id: 'DJF-el-nino-7',
    season: 'DJF',
    enso: 'el-nino',
    phase: 7,
    label: 'DJF · El Niño · fase 7',
    source_convection: 'Convecção da MJO no Pacífico equatorial oeste; sob El Niño, o forçamento subtropical no Pacífico central-leste ainda não se encontra na longitude eficaz para excitar o trem de ondas para a ZCAS.',
    circulation: 'Padrão de ondas sem trem PSA coerente voltado para o reforço da ZCAS em El Niño nesta fase.',
    mean: null,
    extremes: null,
    psa: null,
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate; Roy et al. (2025)',
    limits: 'Em El Niño, o forçamento subtropical que excita a teleconexão para a ZCAS ocorre deslocado para leste apenas nas fases 8–1.'
  },
  {
    id: 'DJF-el-nino-8',
    season: 'DJF',
    enso: 'el-nino',
    phase: 8,
    label: 'DJF · El Niño · fase 8',
    source_convection: 'Convecção-fonte anômala organiza-se no Pacífico Sul subtropical, deslocada para leste (~140°W–120°W) em virtude do estado básico de El Niño (Fernandes & Grimm 2023, Figs. 5 e 9).',
    circulation: 'Fase precursora do trem de ondas PSA: divergência em altos níveis e trem de ondas desenvolvem-se com defasagem dinâmica de cerca de uma fase até a resposta remota plena.',
    mean: {
      region: 'ZCAS',
      text: 'Início da organização de anomalias positivas na ZCAS sob El Niño (fase precursora da resposta destacada na fase 1).',
      figure: 'Fernandes & Grimm (2023), Figs. 5 e 12',
      sign: 'positivo',
      timing: 'composição de fase / precursora'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento inicial de extremos no CESA e borda da ZCAS sob El Niño, antecedendo o pico da fase 1.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / precursora'
    },
    psa: 'A divergência anômala no Pacífico subtropical centro-leste excita trem de ondas de Rossby; defasagem de cerca de uma fase entre o forçamento da fonte e a resposta madura sobre a América do Sul (Fernandes & Grimm 2023; Roy et al. 2025).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Fase precursora; a resposta de maior amplitude na ZCAS e CESA em El Niño desloca-se para a fase 1.'
  },
  {
    id: 'DJF-el-nino-1',
    season: 'DJF',
    enso: 'el-nino',
    phase: 1,
    label: 'DJF · El Niño · fase 1',
    source_convection: 'Convecção-fonte das fases 8–1 culmina em divergência de grande escala sobre o continente / Atlântico tropical.',
    circulation: 'Trem de ondas PSA maduro no Atlântico Sudoeste acoplado à circulação sobre o sudeste e centro-leste da América do Sul.',
    mean: {
      region: 'ZCAS',
      text: 'Resposta máxima destacada de chuva média na ZCAS em El Niño (resposta remota da convecção-fonte deslocada para leste nas fases 8–1).',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    extremes: {
      region: 'CESA',
      text: 'Maior aumento da frequência de extremos no centro-leste da América do Sul (CESA) destacado para El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    psa: 'Trem de ondas PSA plenamente estabelecido a partir da fonte subtropical no Pacífico central/leste; acoplamento dinâmico intensifica a convergência na ZCAS e CESA (Fernandes & Grimm 2023, Figs. 5 e 12).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Resposta máxima defasada em relação à fonte (forçante em 8–1, resposta remota de pico na fase 1 condicionada pelo El Niño).'
  },

  // --- SEQUÊNCIA MJO 7 → 8 → 1 EM DJF (ENOS NEUTRO) ---
  {
    id: 'DJF-neutro-7',
    season: 'DJF',
    enso: 'neutro',
    phase: 7,
    label: 'DJF · Neutro · fase 7',
    source_convection: 'Convecção tropical da MJO sobre a linha de data / Pacífico oeste em transição neutra.',
    circulation: 'Circulação e dispersão de ondas sem padrão teleconectivo PSA coerente voltado para o sudeste do continente.',
    mean: null,
    extremes: null,
    psa: null,
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate; Roy et al. (2025)',
    limits: 'Composição própria de anos neutros; transição precursora que antecede a organização observada nas fases 8–1.'
  },
  {
    id: 'DJF-neutro-8',
    season: 'DJF',
    enso: 'neutro',
    phase: 8,
    label: 'DJF · Neutro · fase 8',
    source_convection: 'Convecção anômala no Pacífico subtropical central e hemisfério ocidental em anos neutros.',
    circulation: 'Trem de ondas com anomalia anticiclônica no Atlântico subtropical, favorecendo convergência na porção central da ZCAS.',
    mean: {
      region: 'ZCAS',
      text: 'Anomalias de chuva média na faixa da ZCAS em anos neutros, com maior significância no setor continental leste.',
      figure: 'Fernandes & Grimm (2023), Figs. 4 e 12',
      sign: 'positivo',
      timing: 'composição de fase'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento da frequência de extremos de chuva concentrado no centro-leste da América do Sul (CESA, setor ao norte de 15°S), diferenciando-se da banda principal da ZCAS mais ao sul.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase'
    },
    psa: 'Trem de ondas PSA induzido pela convecção subtropical no Pacífico em anos neutros, favorecendo a banda da ZCAS.',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Composição específica para anos neutros; distinção espacial entre o CESA (ao norte de 15°S) e a ZCAS principal.'
  },
  {
    id: 'DJF-neutro-1',
    season: 'DJF',
    enso: 'neutro',
    phase: 1,
    label: 'DJF · Neutro · fase 1',
    source_convection: 'Envelope da MJO migra para o hemisfério ocidental / África.',
    circulation: 'Trem de ondas e escoamento em transição no Atlântico subtropical.',
    mean: {
      region: 'ZCAS',
      text: 'Anomalias de chuva na ZCAS e borda sul em transição e declínio após a fase 8 em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Figs. 4 e 12',
      sign: 'positivo',
      timing: 'composição de fase / declínio'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento de extremos observável no CESA e borda sul da ZCAS em anos neutros antes da transição suprimida.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / declínio'
    },
    psa: 'Teleconexão remota residual no Atlântico subtropical em atenuação.',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Evolução documentada na transição para a fase suprimida da ZCAS.'
  },

  // --- COMPARAÇÃO DJF / NEUTRO: FASES 3 E 4 NO SESA ---
  {
    id: 'DJF-neutro-3',
    season: 'DJF',
    enso: 'neutro',
    phase: 3,
    label: 'DJF · Neutro · fase 3',
    source_convection: 'Convecção anômala da MJO sobre o Oceano Índico central/leste.',
    circulation: 'Trem de ondas a partir do Oceano Índico com circulação ciclônica anômala no Atlântico Sudoeste; fase precursora que favorece o ambiente para o SALLJ e extremos no SESA (Fernandes & Grimm 2023; Jones et al. 2023).',
    extremes: {
      region: 'SESA',
      text: 'Aumento da frequência de extremos no SESA em anos neutros; fase precursora que antecede o pico da fase 4.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / precursora'
    },
    mean: null,
    psa: 'Trem de ondas a partir do Oceano Índico com cavado anômalo no Atlântico Sudoeste, favorecendo transporte de umidade para o SESA (Fernandes & Grimm 2023, Figs. 4 e 12; Jones et al. 2023).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate; Jones et al. (2023)',
    limits: 'Fase precursora do pico de extremos observado na fase 4 em anos neutros.'
  },
  {
    id: 'DJF-neutro-4',
    season: 'DJF',
    enso: 'neutro',
    phase: 4,
    label: 'DJF · Neutro · fase 4',
    source_convection: 'Convecção no Continente Marítimo e forçante de convecção suprimida no Pacífico tropical central.',
    circulation: 'Circulação ciclônica anômala em altos níveis no Atlântico Sudoeste e aumento da frequência do tipo Central de SALLJ (Jones et al. 2023), favorecendo transporte de umidade em direção ao SESA.',
    extremes: {
      region: 'SESA',
      text: 'Maior aumento da frequência de extremos no SESA entre todas as fases em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    mean: null,
    psa: 'Forçante de convecção suprimida no Pacífico central gera trem de ondas com sinal oposto às fases 8–1; cavado bem configurado no Atlântico Sudoeste favorece o tipo Central de SALLJ para o SESA (Jones et al. 2023) e ZCAS em subsidência compensatória (Fernandes & Grimm 2023, Figs. 4 e 11).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate; Jones et al. (2023)',
    limits: 'Maior aumento de extremos no SESA em anos neutros; dipolo com a ZCAS suprimida.'
  },

  // --- FASES 3 E 4 NO SESA EM EL NIÑO ---
  {
    id: 'DJF-el-nino-3',
    season: 'DJF',
    enso: 'el-nino',
    phase: 3,
    label: 'DJF · El Niño · fase 3',
    source_convection: 'Convecção da MJO no Oceano Índico sob estado básico de El Niño (piscina quente estendida).',
    circulation: 'Interação entre anomalia equatorial quente e forçamento da MJO no Índico favorece anomalia ciclônica no Atlântico Sudoeste e maior frequência de transporte de umidade pelo SALLJ para o SESA (Jones et al. 2023; Fernandes & Grimm 2023).',
    extremes: {
      region: 'SESA',
      text: 'Maior aumento da frequência de extremos no SESA destacado para El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / madura'
    },
    mean: null,
    psa: 'Interação construtiva de grande escala: onda excitada no Índico reforçada pelo aquecimento do Pacífico equatorial aprofunda o cavado no Atlântico Sudoeste e favorece o SALLJ para o SESA (Fernandes & Grimm 2023, Figs. 5 e 12; Jones et al. 2023).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate; Jones et al. (2023)',
    limits: 'Efeito acoplado entre a modulação sazonal do El Niño e a escala intrassazonal da MJO.'
  },
  {
    id: 'DJF-el-nino-4',
    season: 'DJF',
    enso: 'el-nino',
    phase: 4,
    label: 'DJF · El Niño · fase 4',
    source_convection: 'Convecção migra para o Continente Marítimo; forçante no Índico declina.',
    circulation: 'Circulação ciclônica no Atlântico Sudoeste em declínio após o pico conjunto da fase 3 sob El Niño.',
    extremes: {
      region: 'SESA',
      text: 'Aumento de extremos no SESA persiste em declínio após o ápice observado na fase 3 sob El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      timing: 'composição de fase / declínio'
    },
    mean: null,
    psa: 'Atenuação gradual da resposta ciclônica sobre a Bacia do Prata após o pico da fase 3 em El Niño.',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Evolução em declínio do impacto extremo no SESA durante El Niño.'
  }
];

function findDocumentedCase(season, enso, phase) {
  return DOCUMENTED_CASES.find(c =>
    c.season === season &&
    c.enso === enso &&
    Number(c.phase) === Number(phase)
  ) || null;
}

if (typeof module !== 'undefined') {
  module.exports = { DOCUMENTED_CASES, findDocumentedCase };
}
