# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-29T15:10:00-03:00.
- Versão de cache: `?v=20260929c`.
- Revisão concluída e validada:
  1. Matriz de 96 células reestruturada estritamente em **3 camadas documentadas**, sem texto livre ou inventado.
  2. Referência visível em cada célula e nos painéis (autor, ano, figura/página).
  3. Remoção do cartão operacional "Aviso ao previsor" (`#sandboxDiagnosticCard`), alinhando o simulador ao foco didático.
  4. Eliminação estrita de frases proibidas (`"estiagem severa"`, `"enchentes"`, `"ZCAS precoce"`, `"chuva persistente"`, `"Clima climatologia de primavera"`).
  5. Remoção de citações não lidas (`Grimm 1998`, `2003`, `2004`, `2011` e `Grimm & Tedeschi 2009`), mantendo exclusivamente fontes validadas: `Grimm, Barros & Doyle (2000)` e `Fernandes & Grimm (2023)`.
  6. Diagrama RMM Wheeler & Hendon (2004) permanentemente posicionado no topo e à direita do mapa.
  7. Pureza de código: 0 ocorrências de `metric` em todos os arquivos de produção.
  8. Suíte de testes automatizados (`verify-model.cjs` com 1920 configurações e 15 suites) 100% aprovada.
  9. Estado padrão do sandbox e simulador configurado para El Niño com atuação máxima da MJO para o SESA (DJF, El Niño, Fase 3, amplitude 1.5 e evento de referência `DJF-el-nino-3` ativo).

## Arquivos Modificados
- `grimm-matrix-data.js`:
  - Reconstrução completa da função geradora `buildGrimmCell(season, enso, phase)` com as 3 camadas científicas:
    - **Camada 1 (Fundo ENOS):** Independe da fase. Ativa apenas em `SON`: El Niño *"mais chuva no SESA na primavera"* / La Niña *"menos chuva no SESA na primavera"* (Grimm, Barros & Doyle 2000, J. Climate 13, resumo). Demais estações nulas (aguarda Reinaldo).
    - **Camada 2 (Sinal MJO):** Alvarez et al. (2016), composição de todos os anos sem separar ENOS (rótulo `"média de todos os anos, sem separar ENOS"`), idêntico nas 3 colunas de ENOS para os casos aprovados:
      - DJF 3-4 (SESA: `Alvarez et al. 2016, Figs. 4c, 5b, 7b e 10c`), DJF 8-1 (ZCAS: `Alvarez et al. 2016, Figs. 4a,b e 10a`).
      - MAM 1 (ZCAS: `Alvarez et al. 2016, Figs. 4d e 11b`).
      - JJA 8 (ZCAS: `Alvarez et al. 2016, Figs. 4k e 12a`).
      - SON 7-8 (ZCAS: `Alvarez et al. 2016, Figs. 4i e 13a`), SON 1 (SESA: `Alvarez et al. 2016, Figs. 4j e 13b`).
    - **Camada 3 (MJO × ENOS):** Fernandes & Grimm (2023), exclusivamente para `DJF`:
      - La Niña 8 (ZCAS: `Fernandes & Grimm 2023, Figs. 5 e 8`).
      - El Niño 1 (ZCAS: `Fernandes & Grimm 2023, Figs. 5 e 8`).
      - El Niño 3 (SESA: `Fernandes & Grimm 2023, Figs. 5 e 8`).
      - Neutro 4 (SESA: `Fernandes & Grimm 2023, Figs. 5 e 8`).
      - Em MAM, JJA e SON: nota explícita *"Combinação MJO × ENOS não estudada nesta estação"*.
    - **Células sem camadas:** Rótulo explícito *"Sem resultado publicado para esta combinação"*.
- `index.html`:
  - Removido o `#sandboxDiagnosticCard` ("Aviso ao previsor").
  - Atualizados textos de descrição para enfatizar a abordagem didática e as 3 camadas científicas.
  - Diagrama RMM posicionado permanentemente no topo à direita dentro de `.top-main-stage`.
- `documented-view.js`:
  - Atualização do painel `#result` e `#caseSummary` para renderizar as 3 camadas com citações completas visíveis.
  - Atualização de `renderGrimmSandboxMatrix()`: renderização das 3 camadas e suas citações tanto na tabela geral (3×8) quanto nos cards de foco por regime.
  - Limpeza de textos em `ensoMeta` removendo expressões informais e citações não lidas.
  - Remoção completa da função legada `updateGrimmSandboxDiagnostic()`.
- `guia-el-nino.html`:
  - Removidas citações a Grimm 1998, 2003 e 2004.
  - Substituição da expressão proibida "Chuva persistente" por "Mais chuva no SESA".
  - Substituição do cabeçalho "Dossiê do Previsor" por "Guia Didático".
- `verify-model.cjs`:
  - Atualização da Suíte 15 validando estritamente a arquitetura de 3 camadas nas 96 permutações.
  - Testes de integridade garantindo ausência de `#sandboxDiagnosticCard`.
  - Verificação automatizada de ausência de frases proibidas e citações não lidas em todas as células.
  - 100% de aprovação nas 15 suítes e 1920 configurações.

## Fontes Validadas
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
- Grimm, Barros & Doyle (2000), Climate variability in southern South America associated with El Niño and La Niña events. Journal of Climate 13, 35–58.
- Wheeler & Hendon (2004), Monthly Weather Review 132, 1917–1932 (Figs. 7 e 8).
- Deemer, G., NOAA/ESRL PSD (compostos de potencial de velocidade 200 hPa).
- NOAA/CPC (Wheeler & Hendon 2004 composites, Climate Prediction Center).
- Liebmann et al. (2004), Journal of Climate 17, 3829–3842 (SALLJ e dipolo).
- Muza et al. (2009), Journal of Climate (SEBr e dipolos).
- Nogués-Paegle & Mo (1997), Journal of the Atmospheric Sciences 54, 966–982.
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1920 configurações** testadas no sandbox: **100% aprovadas sem exceções**.
  - **15 baterias de validação estrita** aprovadas (incluindo integridade das 96 permutações em 3 camadas, mapeamento dos 10 casos curados, ausência de frases proibidas e citações não lidas, compostos CPC/NOAA nas 8 fases global/regional, SALLJ 4 estados, TSM vibrante, MJO pontilhada, controles PSA/SALLJ/Jato/Caixas).
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
