# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-27T23:20:00-03:00.
- Versão de cache: `?v=20260927l`.
- Revisão do lote concluída e validada (paralelogramos de χ200 estritamente paralelos entre si com inclinação uniforme em todos os níveis, estrito SESA e ZCAS, 10 casos curados).
- Arquivos modificados:
  - `documented-view.js`:
    - χ200: geometria ajustada para paralelogramos estritamente paralelos entre si:
      - Externo: borda norte em 30°N e borda sul em 30°S (fixas, independentemente da latitude do centro); W = 60°.
      - Médio: H = 20° em torno da latitude do centro; W = 40°.
      - Núcleo (só contorno): H = 10° em torno da latitude do centro; W = 22°.
      - Inclinação estritamente uniforme e paralela em todos os níveis e centros:
        `dlon = -(lat - latC)`, com `dlonNW = -(latN - latC) - W`, `dlonNE = -(latN - latC) + W`, `dlonSE = -(latS - latC) + W`, `dlonSW = -(latS - latC) - W`.
        A inclinação das arestas laterais é idêntica (-1.0 em coordenadas e 0.9524 em pixels de tela), garantindo paralelismo geométrico rigoroso e concentricidade perfeita.
      - Nenhum vértice além de ±30° de latitude.
      - Renderização em polígonos nas visões global e regional com suporte a wrap contínuo nos limites do mapa.
  - `index.html`:
    - Cache-buster atualizado para `?v=20260927l`.
  - `verify-model.cjs`:
    - Testes estendidos verificando a geometria e o paralelismo estrito dos paralelogramos em todas as 8 fases (inclinação lateral constante em -1.0, dimensões W, alturas H=20° e H=10°, limites fixos em ±30° e ausência de elipses no χ200).
  - `_revisao/STATUS.md` e `_revisao/painel.html`: documentação e capturas atualizadas.
  - `_revisao/capturas/`:
    - `chi_fase1.png`: Fase 1 global com paralelogramos estritamente paralelos.
    - `chi_fase4.png`: Fase 4 global com paralelogramos estritamente paralelos.
    - `chi_fase8.png`: Fase 8 global com paralelogramos estritamente paralelos.
    - `chi_fase4_regional.png`: Fase 4 regional com paralelogramos estritamente paralelos sobre a América do Sul.

## Em andamento
- Revisão aprovada nos testes automatizados e visuais. Pronto para merge.

## Feito (nesta revisão)
1. **χ200 com Paralelogramos Estritamente Paralelos e Concêntricos:**
   - Todas as arestas laterais possuem inclinação idêntica constante (slope = -1.0), tornando todos os paralelogramos perfeitamente paralelos entre si.
   - Camada externa fixa entre 30°N e 30°S com W = 60°.
   - Camada média com altura H = 20° e W = 40°.
   - Núcleo com altura H = 10° e W = 22° desenhado exclusivamente com contorno (`fill: none`).
   - Nenhum vértice ultrapassa ±30° de latitude.
   - Aplicação na visão global (com wrap contínuo nas bordas) e na visão regional.

2. **Capturas Visuais Geradas e Verificadas:**
   - `chi_fase1.png`: global fase 1 com paralelismo estrito.
   - `chi_fase4.png`: global fase 4 com paralelismo estrito.
   - `chi_fase8.png`: global fase 8 com paralelismo estrito.
   - `chi_fase4_regional.png`: regional fase 4 com paralelismo estrito.

## Fontes
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
- Wheeler & Hendon (2004), Monthly Weather Review 132, 1917–1932 (Figs. 7 e 8).
- Deemer, G., NOAA/ESRL PSD (compostos de potencial de velocidade 200 hPa).
- Liebmann et al. (2004), Journal of Climate 17, 3829–3842 (SALLJ e dipolo).
- Nogués-Paegle & Mo (1997), Journal of the Atmospheric Sciences 54, 966–982.
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1536 configurações** testadas no sandbox: **100% aprovadas sem exceções**.
  - **Paralelismo Estrito de χ200:** inclinação -1.0 em todas as arestas laterais, dimensões W, alturas H e limites de latitude validados em todas as 8 fases.
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
