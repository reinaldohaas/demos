# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-28T23:05:00-03:00.
- Versão de cache: `?v=20260928b`.
- Revisão concluída e validada (inclusão dos compostos oficiais de anomalia de precipitação tropical do CPC/NOAA como opção nos trópicos para as 8 fases, visões global e regional, escala de 11 níveis, ativos base64 embutidos para operação offline e 100% de aprovação nos testes automatizados).
- Arquivos modificados:
  - `index.html`:
    - Adicionada opção `Precipitação tropical · compostos CPC/NOAA (mm/dia)` (`value="cpc_precip"`) no seletor `MJO nos trópicos:`.
    - Adicionado painel expansível na seção "Legenda & Guia" exibindo o mapa de referência oficial de 8 painéis do CPC/NOAA com texto explicativo e critérios estatísticos de 95%.
    - Incluído script `cpc-mjo-precip-data.js` e bump de cache-buster para `?v=20260928b`.
  - `cpc-mjo-precip-data.js` (novo):
    - Dados embutidos em base64 com georreferenciamento exato para projeção global (faixa 30°N–30°S, 20°E–380°E, 1200x210) e recorte regional América do Sul (15°N–30°S, 85°W–35°W, 400x288) para as 8 fases.
  - `documented-view.js`:
    - `mjoMode` atualizado para suportar `'cpc_precip'`.
    - Implementadas funções `drawMjoCpcPrecipitation()` e `drawCpcPrecipColorbar(x, y, w, h)`.
    - Renderização na visão global com contornos 30°N/30°S, opacidade proporcional ao RMM, identificação de fase e barra de escala de 11 níveis.
    - Renderização na visão regional sobreposta à América do Sul com moldura e barra de escala compacta.
    - `drawMap` unificado para despachar `drawMjoTropicalVisualizations()` tanto na visão global quanto na regional.
  - `verify-model.cjs`:
    - Adicionado Teste 14 validando os compostos CPC/NOAA em todas as 8 fases, global e regional, presença de colorbar e inatividade para $A < 1$.
    - Expandido o teste de regressão do sandbox para 1920 configurações (4 estações $\times$ 3 ENOS $\times$ 8 fases $\times$ 5 modos MJO $\times$ 2 amplitudes $\times$ 2 visões).
    - Validação de 0 ocorrências de `metric` estendida para incluir `cpc-mjo-precip-data.js`.

## Feito (nesta revisão)
1. **Compostos Oficiais de Precipitação Tropical CPC/NOAA (8 Fases):**
   - Disponível como opção direta junto ao χ200 no seletor `MJO nos trópicos:`.
   - Projeção e alinhamento georreferenciado perfeitos com os contornos continentais em escala global e regional.
   - Escala oficial de 11 níveis (tons marrons para seca e verdes/azuis para chuva intensa) com atribuição a Wheeler & Hendon (2004).
   - Disponível offline sem dependência externa via dados base64 embutidos em `cpc-mjo-precip-data.js`.
2. **Controles Expandidos na Barra do Mapa (Item 5):**
   - Inclusão de `[x] Jato Subtropical` (`#jetsToggle`) e `[x] Caixas SESA e ZCAS` (`#boxesToggle`).
   - Suporte a alternância individual de `Caixa SESA` (`#sesaToggle`) e `Caixa ZCAS` (`#zcasToggle`).
   - Sincronização em tempo real com as opções da legenda.
3. **SALLJ com Estados (Automático, Forte, Fraco, Climatológico):**
   - Seletor posicionado na linha 2 dos controles com escalonamento por amplitude e legendas por estado.
4. **TSM Vibrante de El Niño e La Niña sobreposta à MJO:**
   - Cores saturadas com camada interior, sobrepostas aos campos tropicais.
5. **MJO Pontilhada Proporcional ao RMM:**
   - Paralelogramos e dipolos com `stroke-dasharray` e saturação dinâmica proporcional a $A$.
6. **Caixa Única de Eventos de Interesse:**
   - Select único com prefixos de estação (`DJF`, `MAM`, `JJA`, `SON`) e `<optgroup>`.
7. **Restauração e Controle Independente de PSA e SALLJ:**
   - Toggles diretos `#psaToggle` e `#salljToggle` na barra do mapa.

## Fontes
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
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
  - **14 baterias de validação estrita** aprovadas (incluindo compostos CPC/NOAA nas 8 fases global/regional, SALLJ 4 estados $\times$ DJF 3 e 8 $\times$ A {0.5, 1.5}, TSM vibrante, MJO pontilhada, controle PSA/SALLJ/Jato/Caixas).
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
