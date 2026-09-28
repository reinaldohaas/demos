// Base de Evidências Científicas Documentadas
// Somente casos com sinal aumentado ("mais") e mecanismo físico dos autores.
// Fontes centrais:
// - Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA)
// - Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738, DOI: 10.1175/JCLI-D-22-0781.1

const DOCUMENTED_CASES = [
  // =========================================================================
  // 1. CASOS ESTRATIFICADOS POR ENOS EM DJF — Fernandes & Grimm (2023)
  // =========================================================================
  {
    id: 'DJF-la-nina-8',
    season: 'DJF',
    enso: 'la-nina',
    phase: 8,
    label: 'DJF · La Niña · Fase 8 — pico na ZCAS (Fernandes & Grimm 2023)',
    shortLabel: 'Fernandes & Grimm · La Niña 8 — pico na ZCAS',
    region: 'ZCAS',
    regionName: 'ZCAS',
    sign: 'positivo',
    chance: 'pico de chuva na ZCAS',
    text: 'Pico na ZCAS em La Niña (fase 8). Mecanismo: trem de ondas PSA excitado por convecção reforçada no Pacífico Sul subtropical centro-leste (fases 7+8).',
    source_convection: 'Convecção reforçada no Pacífico Sul subtropical centro-leste (fases 7+8)',
    sourceMarker: { lat: -25, lon: -125, label: 'fonte: convecção subtropical (fases 7+8)' },
    source: 'Fernandes & Grimm (2023), Journal of Climate'
  },
  {
    id: 'DJF-el-nino-1',
    season: 'DJF',
    enso: 'el-nino',
    phase: 1,
    label: 'DJF · El Niño · Fase 1 — pico na ZCAS, uma fase depois (Fernandes & Grimm 2023)',
    shortLabel: 'Fernandes & Grimm · El Niño 1 — pico na ZCAS (fase posterior)',
    region: 'ZCAS',
    regionName: 'ZCAS',
    sign: 'positivo',
    chance: 'pico de chuva na ZCAS (uma fase depois)',
    text: 'Pico na ZCAS em El Niño (fase 1, uma fase depois que em La Niña). Mecanismo: fonte de convecção subtropical no Pacífico Sul centro-leste deslocada um pouco mais a leste (fases 8+1).',
    source_convection: 'Convecção reforçada no Pacífico Sul subtropical centro-leste, um pouco mais a leste (fases 8+1)',
    sourceMarker: { lat: -25, lon: -110, label: 'fonte: convecção subtropical (fases 8+1)' },
    source: 'Fernandes & Grimm (2023), Journal of Climate'
  },

  // =========================================================================
  // 2. COMPOSIÇÕES DE TODOS OS ANOS — Alvarez et al. (2016)
  // Sem ENOS; rótulo: "mais chance de semana chuvosa"
  // =========================================================================

  // --- DJF (VERÃO AUSTRAL) ---
  {
    id: 'DJF-alvarez-3-4',
    season: 'DJF',
    enso: 'todos',
    phase: 3,
    groupedPhases: [3, 4],
    groupedPhase: '3–4',
    label: 'DJF · Fases 3–4 — Bacia do Prata (Alvarez et al. 2016)',
    shortLabel: 'Alvarez · 3–4 — mais chance de semana chuvosa (Bacia do Prata)',
    region: 'SESA',
    regionName: 'Bacia do Prata',
    sign: 'positivo',
    chance: 'mais chance de semana chuvosa',
    text: 'Mais chance de semana chuvosa na Bacia do Prata. Mecanismos: tropical com convergência em altos níveis (χ₂₀₀ > 0 / subsidência sobre a AS tropical) e extratropical com centro ciclônico C sobre a AS subtropical/extratropical (~38°S 62°W).',
    tropicalChi: 'convergencia', // χ > 0 sobre a AS
    extratropical: { type: 'C', lat: -38, lon: -62, desc: 'C sobre a AS subtropical/extratropical (~38°S 62°W)' },
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics'
  },
  {
    id: 'DJF-alvarez-8-1',
    season: 'DJF',
    enso: 'todos',
    phase: 8,
    groupedPhases: [8, 1],
    groupedPhase: '8 e 1',
    label: 'DJF · Fases 8 e 1 — ZCAS (Alvarez et al. 2016)',
    shortLabel: 'Alvarez · 8 e 1 — mais chance de semana chuvosa (ZCAS)',
    region: 'ZCAS',
    regionName: 'ZCAS',
    sign: 'positivo',
    chance: 'mais chance de semana chuvosa',
    text: 'Mais chance de semana chuvosa na ZCAS. Mecanismos: tropical com divergência em altos níveis (χ₂₀₀ < 0 / subida sobre a AS tropical) e extratropical com centro anticiclônico A no extremo sul (~50°S 68°W).',
    tropicalChi: 'divergencia', // χ < 0 sobre a AS
    extratropical: { type: 'A', lat: -50, lon: -68, desc: 'A no extremo sul (~50°S 68°W)' },
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics'
  },

  // --- MAM (OUTONO AUSTRAL) ---
  {
    id: 'MAM-alvarez-1',
    season: 'MAM',
    enso: 'todos',
    phase: 1,
    groupedPhases: [1],
    groupedPhase: '1',
    label: 'MAM · Fase 1 — Leste do Brasil (Alvarez et al. 2016)',
    shortLabel: 'Alvarez · 1 — mais chance de semana chuvosa (Leste do Brasil)',
    region: 'LESTE',
    regionName: 'Leste do Brasil',
    anchor: [-40, -14],
    sign: 'positivo',
    chance: 'mais chance de semana chuvosa',
    text: 'Mais chance de semana chuvosa no leste do Brasil. Mecanismos: tropical com divergência em altos níveis (χ₂₀₀ < 0 / subida sobre a AS tropical) e extratropical com centro ciclônico C sobre a Bacia do Prata (~30°S 55°W).',
    tropicalChi: 'divergencia', // χ < 0 sobre a AS
    extratropical: { type: 'C', lat: -30, lon: -55, desc: 'C sobre a Bacia do Prata (~30°S 55°W)' },
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics'
  },

  // --- JJA (INVERNO AUSTRAL) ---
  {
    id: 'JJA-alvarez-8',
    season: 'JJA',
    enso: 'todos',
    phase: 8,
    groupedPhases: [8],
    groupedPhase: '8',
    label: 'JJA · Fase 8 — Sudeste do Brasil (Alvarez et al. 2016)',
    shortLabel: 'Alvarez · 8 — mais chance de semana chuvosa (Sudeste do Brasil)',
    region: 'SUDESTE',
    regionName: 'Sudeste do Brasil',
    anchor: [-46, -23],
    sign: 'positivo',
    chance: 'mais chance de semana chuvosa',
    text: 'Mais chance de semana chuvosa no sudeste do Brasil. Mecanismo extratropical: centro ciclônico C no leste da AS subtropical (~25°S 45°W).',
    tropicalChi: null,
    extratropical: { type: 'C', lat: -25, lon: -45, desc: 'C no leste da AS subtropical (~25°S 45°W)' },
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics'
  },

  // --- SON (PRIMAVERA AUSTRAL) ---
  {
    id: 'SON-alvarez-7-8',
    season: 'SON',
    enso: 'todos',
    phase: 7,
    groupedPhases: [7, 8],
    groupedPhase: '7–8',
    label: 'SON · Fases 7–8 — ZCAS (Alvarez et al. 2016)',
    shortLabel: 'Alvarez · 7–8 — mais chance de semana chuvosa (ZCAS)',
    region: 'ZCAS',
    regionName: 'ZCAS',
    sign: 'positivo',
    chance: 'mais chance de semana chuvosa',
    note: 'O índice de OLR adianta o RMM em uma fase nesta estação.',
    text: 'Mais chance de semana chuvosa na ZCAS. Mecanismos: tropical com divergência em altos níveis (χ₂₀₀ < 0 / subida sobre a AS tropical) e extratropical com centro ciclônico C em torno de 20°S (~20°S 50°W). Nota em SON: o índice de OLR adianta o RMM em uma fase nesta estação.',
    tropicalChi: 'divergencia', // χ < 0 sobre a AS
    extratropical: { type: 'C', lat: -20, lon: -50, desc: 'C em torno de 20°S (~20°S 50°W)' },
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics'
  },
  {
    id: 'SON-alvarez-1',
    season: 'SON',
    enso: 'todos',
    phase: 1,
    groupedPhases: [1],
    groupedPhase: '1',
    label: 'SON · Fase 1 — Bacia do Prata (Alvarez et al. 2016)',
    shortLabel: 'Alvarez · 1 — mais chance de semana chuvosa (Bacia do Prata)',
    region: 'SESA',
    regionName: 'Bacia do Prata',
    sign: 'positivo',
    chance: 'mais chance de semana chuvosa',
    note: 'O índice de OLR adianta o RMM em uma fase nesta estação.',
    text: 'Mais chance de semana chuvosa na Bacia do Prata. Mecanismo extratropical: centro ciclônico C na AS subtropical (~30°S 60°W), vindo do oeste da Península Antártica (fase 7). Nota em SON: o índice de OLR adianta o RMM em uma fase nesta estação.',
    tropicalChi: null,
    extratropical: { type: 'C', lat: -30, lon: -60, desc: 'C na AS subtropical (~30°S 60°W), vindo do oeste da Península Antártica (fase 7)' },
    source: 'Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics'
  }
];

function findDocumentedCases(season, enso, phase) {
  const p = Number(phase);
  // 1. Caso específico para o ENOS selecionado (Fernandes & Grimm 2023)
  const specific = DOCUMENTED_CASES.find(c =>
    c.season === season &&
    c.enso === enso &&
    (Number(c.phase) === p || (c.groupedPhases && c.groupedPhases.includes(p)))
  ) || null;

  // 2. Caso de média de todos os anos (Alvarez et al. 2016) — válido para qualquer ENOS
  const alvarez = DOCUMENTED_CASES.find(c =>
    c.season === season &&
    c.enso === 'todos' &&
    (Number(c.phase) === p || (c.groupedPhases && c.groupedPhases.includes(p)))
  ) || null;

  return {
    specific,
    alvarez,
    // Caso primário para orientar o destaque principal no mapa: o específico tem precedência
    primary: specific || alvarez
  };
}

function findDocumentedCase(season, enso, phase) {
  return findDocumentedCases(season, enso, phase).primary;
}

if (typeof module !== 'undefined') {
  module.exports = { DOCUMENTED_CASES, findDocumentedCase, findDocumentedCases };
}
