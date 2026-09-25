// Limites geográficos e polígonos de referência da demonstração MJO-ENOS-SESA
// SESA: Sul do Brasil (PR, SC, RS), Uruguai e Nordeste da Argentina (25°S a 40°S, 64°W a 48°W)
// ZCAS: Faixa diagonal de convergência da Monção Sul-Americana (Sul da Amazônia ao Atlântico Subtropical)

const REGIONS = {
  SOUTH_AMERICA_COORDS: [
    [-80, 8], [-77, 8], [-75, 11], [-71, 12], [-62, 10], [-60, 9], [-50, 1], [-45, -2],
    [-35, -5], [-35, -9], [-38, -13], [-40, -19], [-43, -23], [-48, -26], [-52, -32],
    [-54, -34], [-57, -37], [-65, -42], [-66, -46], [-68, -52], [-65, -55], [-70, -55],
    [-74, -52], [-74, -45], [-73, -40], [-72, -35], [-71, -30], [-70, -20], [-76, -14],
    [-81, -5], [-80, 0], [-79, 3], [-80, 8]
  ],
  SESA_POLY: [
    [-64, -25], [-54, -25], [-48, -28], [-48, -37], [-53, -40], [-63, -40], [-64, -31], [-64, -25]
  ],
  ZCAS_POLY: [
    [-65, -9], [-55, -11], [-42, -18], [-34, -23], [-37, -27], [-46, -24], [-55, -17], [-66, -14], [-65, -9]
  ],
  // Fronteiras internacionais da América do Sul (traçado discreto de orientação)
  COUNTRY_BORDERS: [
    // Brasil - Uruguai
    [[-58.4, -30.2], [-56.9, -30.6], [-55.6, -31.3], [-54.0, -31.8], [-53.4, -32.5], [-53.4, -33.7]],
    // Brasil - Argentina (Rio Uruguai e Rio Iguaçu)
    [[-57.6, -30.2], [-56.0, -28.2], [-54.8, -27.3], [-54.0, -26.0], [-54.5, -25.6]],
    // Brasil - Paraguai (Rio Paraná e Rio Apa)
    [[-54.5, -25.6], [-54.3, -24.1], [-55.5, -22.3], [-57.9, -22.1]],
    // Argentina - Uruguai (Rio Uruguai e Rio da Prata)
    [[-58.4, -30.2], [-58.1, -32.0], [-58.4, -34.0], [-57.8, -34.5]],
    // Argentina - Paraguai (Rio Pilcomayo e Paraná)
    [[-62.6, -22.3], [-58.5, -25.3], [-57.6, -27.4], [-54.5, -25.6]],
    // Brasil - Bolívia
    [[-57.9, -22.1], [-57.8, -19.0], [-58.5, -17.5], [-60.4, -16.3], [-65.3, -10.8], [-68.7, -11.0]],
    // Argentina - Chile (Cordilheira dos Andes)
    [[-67.0, -22.9], [-68.5, -25.0], [-69.8, -28.0], [-70.1, -32.0], [-70.6, -35.0], [-71.4, -39.0], [-72.0, -44.0], [-73.2, -49.0], [-68.6, -52.6], [-68.6, -55.0]],
    // Bolívia - Chile / Peru
    [[-67.0, -22.9], [-68.2, -20.5], [-69.0, -18.0], [-69.5, -16.5], [-69.0, -15.5]],
    // Brasil - Peru / Colômbia / Venezuela
    [[-68.7, -11.0], [-70.5, -9.5], [-73.0, -7.5], [-70.0, -4.2], [-69.8, -1.0], [-66.8, 1.2], [-65.0, 1.8], [-60.0, 5.0]]
  ],
  // Limites estaduais brasileiros discretos (Sul, Sudeste e Centro-Oeste)
  BRAZIL_STATE_BORDERS: [
    // RS - SC (Rio Pelotas / Rio Uruguai)
    [[-53.8, -27.2], [-52.0, -27.4], [-51.0, -27.9], [-50.0, -28.2], [-49.7, -29.3]],
    // SC - PR (Rio Iguaçu / Serra do Mar)
    [[-53.8, -26.1], [-52.0, -26.2], [-51.1, -26.0], [-50.0, -26.0], [-48.6, -26.0]],
    // PR - SP (Rio Paranapanema)
    [[-53.0, -22.6], [-51.5, -22.8], [-50.0, -23.0], [-49.0, -23.5], [-48.1, -24.7]],
    // PR - MS / SP - MS (Rio Paraná)
    [[-54.3, -24.1], [-53.5, -22.5], [-52.0, -21.0], [-51.0, -20.0]],
    // SP - RJ (Serra da Bocaina / Vale do Paraíba)
    [[-44.9, -22.5], [-44.6, -23.0], [-44.7, -23.4]],
    // SP - MG (Serra da Mantiqueira / Rio Grande)
    [[-51.0, -20.0], [-49.0, -20.0], [-47.5, -20.2], [-46.5, -21.8], [-45.0, -22.5]],
    // RJ - MG (Serra dos Órgãos / Paraíba do Sul)
    [[-44.5, -22.3], [-43.0, -22.0], [-41.8, -21.3]],
    // MG - ES
    [[-41.8, -21.3], [-41.5, -20.3], [-41.0, -18.5]],
    // MG - BA
    [[-44.3, -15.0], [-42.5, -15.5], [-40.5, -15.8], [-39.8, -18.0]],
    // MG - GO
    [[-48.0, -16.0], [-47.0, -16.5], [-46.5, -17.5], [-47.5, -19.5], [-49.0, -20.0]],
    // MS - MT / GO - MT
    [[-58.0, -18.0], [-55.0, -17.8], [-53.0, -17.5]]
  ],
  // Rótulos geográficos discretos de referência
  GEO_LABELS: [
    { text: 'BRASIL', lon: -51, lat: -14, size: 14, weight: '700', letterSpacing: 3.5, color: '#385675' },
    { text: 'ARGENTINA', lon: -65, lat: -34, size: 12, weight: '600', letterSpacing: 2.5, color: '#2f4963' },
    { text: 'URUGUAI', lon: -56, lat: -32.8, size: 9.5, weight: '600', letterSpacing: 1.5, color: '#3b5875' },
    { text: 'PARAGUAI', lon: -59, lat: -23.5, size: 9.5, weight: '600', letterSpacing: 1.5, color: '#3b5875' },
    { text: 'BOLÍVIA', lon: -64, lat: -17, size: 10, weight: '600', letterSpacing: 1.5, color: '#3b5875' },
    { text: 'CHILE', lon: -72, lat: -31, size: 9.5, weight: '600', letterSpacing: 1.5, color: '#2f4963' }
  ],
  // Rótulos discretos de estados brasileiros (auxiliares)
  STATE_LABELS: [
    { text: 'RS', lon: -53.5, lat: -29.8 },
    { text: 'SC', lon: -50.8, lat: -27.1 },
    { text: 'PR', lon: -51.5, lat: -24.8 },
    { text: 'SP', lon: -48.8, lat: -22.2 },
    { text: 'RJ', lon: -42.5, lat: -22.4 },
    { text: 'MG', lon: -44.5, lat: -18.8 },
    { text: 'ES', lon: -40.5, lat: -19.5 },
    { text: 'MS', lon: -55.0, lat: -20.5 }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = { REGIONS };
}
