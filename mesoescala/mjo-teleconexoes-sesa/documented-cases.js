// Base de Evidências Científicas Curadas
// Null significa não representado nesta síntese documental (nunca anomalia zero).
const DOCUMENTED_CASES = [
  {
    id: 'DJF-neutro-4',
    season: 'DJF',
    enso: 'neutro',
    phase: 4,
    label: 'DJF · Neutro · fase 4',
    extremes: {
      region: 'SESA',
      text: 'Maior aumento da frequência de extremos no SESA entre as fases em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12'
    },
    mean: null,
    psa: 'Na fase 4 em anos neutros, a convecção suprimida no Pacífico Sul subtropical induz teleconexão via trem de ondas com sinais aproximadamente opostos aos das fases 8–1, favorecendo convergência de umidade sobre o SESA.'
  },
  {
    id: 'DJF-neutro-3',
    season: 'DJF',
    enso: 'neutro',
    phase: 3,
    label: 'DJF · Neutro · fase 3',
    extremes: {
      region: 'SESA',
      text: 'Aumento da frequência de extremos no SESA; segue a fase 4 no destaque em anos neutros.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12'
    },
    mean: null,
    psa: 'Convecção anômala da MJO sobre o Oceano Índico central/leste; o padrão de circulação e dispersão de ondas favorece o transporte de umidade em direção ao SESA.'
  },
  {
    id: 'DJF-el-nino-3',
    season: 'DJF',
    enso: 'el-nino',
    phase: 3,
    label: 'DJF · El Niño · fase 3',
    extremes: {
      region: 'SESA',
      text: 'Maior aumento da frequência de extremos no SESA destacado para El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12'
    },
    mean: null,
    psa: 'Interação construtiva entre o aquecimento anômalo do Pacífico equatorial e a convecção da MJO no Índico, intensificando a anomalia ciclônica e a convergência sobre o SESA.'
  },
  {
    id: 'DJF-la-nina-8',
    season: 'DJF',
    enso: 'la-nina',
    phase: 8,
    label: 'DJF · La Niña · fase 8',
    extremes: null,
    mean: {
      region: 'ZCAS',
      text: 'Anomalias positivas de chuva na região da ZCAS: resposta destacada na fase 8 em La Niña.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12'
    },
    psa: 'Convecção anômala no Pacífico Sul subtropical central/leste nas fases 7–8 induz trem de ondas PSA com resposta remota sobre a ZCAS.'
  },
  {
    id: 'DJF-el-nino-1',
    season: 'DJF',
    enso: 'el-nino',
    phase: 1,
    label: 'DJF · El Niño · fase 1',
    extremes: {
      region: 'CESA',
      text: 'Maior aumento da frequência de extremos no centro-leste da América do Sul destacado para El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12'
    },
    mean: {
      region: 'ZCAS',
      text: 'Anomalias positivas de chuva na região da ZCAS: resposta destacada na fase 1 em El Niño.',
      figure: 'Fernandes & Grimm (2023), Seção 5 e Fig. 12'
    },
    psa: 'Convecção anômala no Pacífico Sul subtropical central/leste nas fases 8–1 induz resposta remota sobre a ZCAS e aumento de extremos no CESA.'
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
