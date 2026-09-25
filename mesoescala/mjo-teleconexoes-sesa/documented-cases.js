// Base de Evidências Científicas Documentadas
// Cada resultado registra: referência, figura/seção, combinação, região, variável, sinal, defasagem e limites.
// Null significa ausência de resultado representado nesta síntese documental (nunca efeito zero).
// Referência central: Fernandes e Alice M. Grimm (2023), Journal of Climate, DOI: 10.1175/JCLI-D-22-0781.1.

const DOCUMENTED_CASES = [
  // --- SEQUÊNCIA MJO 7 → 8 → 1 EM DJF (LA NIÑA) ---
  {
    id: 'DJF-la-nina-7',
    season: 'DJF',
    enso: 'la-nina',
    phase: 7,
    label: 'DJF · La Niña · fase 7',
    source_convection: 'Convecção-fonte precursora no Pacífico Sul subtropical centro-oeste / sudoeste (~160°E–170°W).',
    circulation: 'Início de trem de ondas de Rossby (PSA) dispersando energia em direção à América do Sul.',
    mean: {
      region: 'ZCAS',
      text: 'Início da organização de anomalias positivas de chuva na faixa da ZCAS em La Niña (fase precursora).',
      figure: 'Fernandes & Grimm (2023), Figs. 9 e 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento inicial de extremos de chuva no centro-leste da América do Sul (CESA), antecedendo o pico da fase 8.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    psa: 'Convecção anômala no Pacífico Sul subtropical centro-oeste inicia o trem de ondas PSA. A defasagem entre a divergência tropical e a resposta plenamente estabelecida na América do Sul é de aproximadamente uma fase (Fernandes & Grimm 2023).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Fase precursora; a resposta mais intensa na ZCAS ocorre na fase 8 subsequente.'
  },
  {
    id: 'DJF-la-nina-8',
    season: 'DJF',
    enso: 'la-nina',
    phase: 8,
    label: 'DJF · La Niña · fase 8',
    source_convection: 'Convecção-fonte anômala estabelecida no Pacífico Sul subtropical central (fases 7–8).',
    circulation: 'Trem de ondas PSA maduro com centro anticiclônico anômalo no Atlântico subtropical, favorecendo convergência na ZCAS.',
    mean: {
      region: 'ZCAS',
      text: 'Resposta máxima destacada de chuva média sobre a ZCAS em La Niña (resposta da convecção-fonte nas fases 7–8).',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +7 dias'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento pronunciado da frequência de extremos de chuva na ZCAS e no CESA em La Niña.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
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
    circulation: 'Trem de ondas PSA em declínio e relaxamento gradual sobre o Atlântico subtropical.',
    mean: {
      region: 'ZCAS',
      text: 'Anomalias positivas na ZCAS persistem, mas em declínio e com deslocamento para a borda sul / oceano; a resposta principal ocorreu na fase 8.',
      figure: 'Fernandes & Grimm (2023), Figs. 9 e 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    extremes: {
      region: 'CESA',
      text: 'Extremos no CESA e borda da ZCAS em fase de enfraquecimento em relação à fase 8 em La Niña.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    psa: 'Teleconexão remota residual das fases 7–8 em declínio; relaxamento gradual da anomalia anticiclônica sobre o Atlântico subtropical.',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Evolução em decaimento após o ápice da fase 8 em La Niña; não representa ausência de efeito.'
  },

  // --- SEQUÊNCIA MJO 7 → 8 → 1 EM DJF (EL NIÑO) ---
  {
    id: 'DJF-el-nino-8',
    season: 'DJF',
    enso: 'el-nino',
    phase: 8,
    label: 'DJF · El Niño · fase 8',
    source_convection: 'Convecção-fonte anômala organiza-se no Pacífico Sul subtropical, deslocada para leste (~140°W–120°W) pelo estado básico de El Niño.',
    circulation: 'Fase precursora do trem de ondas PSA: divergência em altos níveis e trem de ondas desenvolvem-se com defasagem de cerca de uma fase até a resposta remota plena.',
    mean: {
      region: 'ZCAS',
      text: 'Início da organização de anomalias positivas na ZCAS sob El Niño (fase precursora da resposta destacada na fase 1).',
      figure: 'Fernandes & Grimm (2023), Figs. 5 e 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento inicial de extremos no CESA e borda da ZCAS sob El Niño, antecedendo o pico da fase 1.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    psa: 'A divergência anômala no Pacífico subtropical centro-leste excita trem de ondas de Rossby; defasagem de cerca de uma fase entre o forçamento da fonte e a resposta madura sobre a América do Sul (Fernandes & Grimm 2023).',
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
      text: 'Resposta máxima destacada de chuva média na ZCAS em El Niño (resposta da convecção-fonte deslocada para leste nas fases 8–1).',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +7 dias'
    },
    extremes: {
      region: 'CESA',
      text: 'Maior aumento da frequência de extremos no centro-leste da América do Sul (CESA) destacado para El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    psa: 'Trem de ondas PSA plenamente estabelecido a partir da fonte subtropical no Pacífico central/leste; acoplamento dinâmico intensifica a convergência na ZCAS e CESA (Fernandes & Grimm 2023, Figs. 5 e 12).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Resposta máxima defasada em relação à fonte (forçante em 8–1, resposta remota de pico na fase 1 condicionada pelo El Niño).'
  },

  // --- SEQUÊNCIA MJO 7 → 8 → 1 EM DJF (ENOS NEUTRO) ---
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
      text: 'Anomalias positivas de chuva na região da ZCAS em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Figs. 4 e 12',
      sign: 'positivo',
      lag: 'concomitante a +7 dias'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento da frequência de extremos na ZCAS e CESA em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    psa: 'Trem de ondas PSA induzido pela convecção subtropical no Pacífico em anos neutros, com anticiclone no Atlântico e favorecimento da ZCAS.',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Composição própria de anos neutros; não presumir idêntica a El Niño ou La Niña nem usar composições de todos os anos.'
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
      text: 'Anomalias de chuva na ZCAS e borda sul em declínio após o pico da fase 8 em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Figs. 4 e 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    extremes: {
      region: 'CESA',
      text: 'Aumento de extremos observável no CESA e borda sul da ZCAS em anos neutros antes da transição suprimida.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    psa: 'Teleconexão remota em relaxamento no Atlântico subtropical em anos neutros.',
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
    circulation: 'Trem de ondas favorece cavado / anomalia ciclônica no Atlântico Sudoeste e convergência do SALLJ estendendo-se ao sul.',
    extremes: {
      region: 'SESA',
      text: 'Aumento da frequência de extremos no SESA em anos neutros; fase precursora que antecede o pico da fase 4.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    mean: null,
    psa: 'Convecção no Oceano Índico reposiciona o escoamento a barlavento dos Andes e favorece o SALLJ para o SESA (Fernandes & Grimm 2023, Figs. 4 e 12).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Fase precursora do pico de extremos observado na fase 4 em anos neutros.'
  },
  {
    id: 'DJF-neutro-4',
    season: 'DJF',
    enso: 'neutro',
    phase: 4,
    label: 'DJF · Neutro · fase 4',
    source_convection: 'Convecção no Continente Marítimo e forçante de convecção suprimida no Pacífico tropical central.',
    circulation: 'Circulação ciclônica anômala bem configurada no Atlântico Sudoeste; SALLJ estendido para sul até a Bacia do Prata.',
    extremes: {
      region: 'SESA',
      text: 'Maior aumento da frequência de extremos no SESA entre todas as fases em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    mean: null,
    psa: 'Forçante suprimida no Pacífico central excita trem de ondas de sinal oposto às fases 8–1, aprofundando o cavado no Atlântico Sudoeste e convergindo umidade no SESA (Fernandes & Grimm 2023, Figs. 4 e 11).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
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
    circulation: 'Interação construtiva entre anomalia equatorial quente e forçamento da MJO no Índico, intensificando a anomalia ciclônica no Atlântico Sudoeste.',
    extremes: {
      region: 'SESA',
      text: 'Maior aumento da frequência de extremos no SESA destacado para El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    mean: null,
    psa: 'Interação construtiva de grande escala: onda excitada no Índico reforçada pelo aquecimento do Pacífico equatorial aprofunda o cavado no Atlântico Sudoeste e acelera o SALLJ para o SESA (Fernandes & Grimm 2023, Figs. 5 e 12).',
    source: 'Fernandes e Alice M. Grimm (2023), Journal of Climate',
    limits: 'Efeito acoplado entre a modulação sazonal do El Niño e a escala intrassazonal da MJO.'
  },
  {
    id: 'DJF-el-nino-4',
    season: 'DJF',
    enso: 'el-nino',
    phase: 4,
    label: 'DJF · El Niño · fase 4',
    source_convection: 'Convecção migra para o Continente Marítimo; forçante no Índico declina.',
    circulation: 'Circulação sobre o SESA em relaxamento após o pico da fase 3 em El Niño.',
    extremes: {
      region: 'SESA',
      text: 'Aumento de extremos no SESA persiste em declínio após o ápice observado na fase 3 sob El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12',
      sign: 'positivo',
      lag: 'concomitante a +5 dias'
    },
    mean: null,
    psa: 'Trem de ondas em atenuação sobre a Bacia do Prata após o pico conjunto da fase 3 em El Niño.',
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
