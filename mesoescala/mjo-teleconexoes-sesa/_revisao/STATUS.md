# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-29T10:45:00-03:00.
- Versão de cache: `?v=20260929a`.
- Revisão concluída e validada (layout despoluído com mapa no topo em destaque absoluto, remoção dos controles manuais redundantes, sandbox direto das 96 permutações de Alice Grimm, aviso operacional ao previsor, e unificação do trem de ondas PSA de Alvarez e Grimm com diferenciação da fonte convectiva: Ciclone Tropical/Pacífico Oeste vs. Eixo da ZCPS/SPCZ).
- Arquivos modificados:
  - `index.html`:
    - Reestruturação do layout com mapa (#panelMap) no topo absoluto logo abaixo do cabeçalho.
    - Cartão de diagnóstico "⚠️ AVISO AO PREVISOR · SESA & ZCAS" posicionado diretamente sob o mapa.
    - Matriz Sandbox das 96 permutações (8 fases × 3 ENOS × 4 abas de estação) compacta e tátil logo abaixo do aviso ao previsor.
    - Ocultação dos controles legados manuais redundantes (`#legacyControlsContainer` com `display:none`) para manter compatibilidade e acessibilidade sem poluição visual.
    - Bump de versão de cache para `?v=20260929a`.
  - `documented-view.js`:
    - Implementação de `getPsaSourceType(season, enso, phase)` diferenciando a forçante convectiva entre Ciclone Tropical (Pacífico Oeste/Central) e Eixo da ZCPS (SPCZ).
    - Unificação do trem de ondas PSA de Alvarez e Grimm com indicação clara da fonte física no traçado global e regional.
    - Matriz do sandbox reformatada para células compactas táteis de clique rápido.
    - Painel de diagnóstico reestruturado como "⚠️ AVISO AO PREVISOR · SESA & ZCAS" com síntese física de impacto, extremos, teleconexão PSA e fundamentação de Alice Grimm.
  - `verify-model.cjs`:
    - Suíte de 15 testes automatizados aprovada com 100% de sucesso.
    - 0 ocorrências de `metric` mantidas em todos os arquivos de produção.

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
- Grimm, Ferraz & Gomes (1998), Journal of Climate 11, 2863–2880.
- Grimm, Barros & Doyle (2000), Journal of Climate 13, 35–58.
- Grimm (2003), Journal of Climate 16, 263–282.
- Grimm (2004), Climate Dynamics 22, 123–145.
- Grimm & Tedeschi (2009), Journal of Climate 22, 1589–1609.
- Grimm (2011), Interannual Climate Variability in South America.

## Setor Sandbox: As 96 Permutações (Alice Grimm et al.)
1. **Espaço Físico das 96 Permutações:**
   - 4 estações $\times$ 3 estados de ENOS $\times$ 8 fases de MJO = 96 permutações físicas catalogadas com rigor em `grimm-matrix-data.js`.
   - Inserção dos 10 casos curados da literatura ("Eventos de Interesse" de Fernandes & Grimm 2023 e Alvarez et al. 2016) como subconjunto de referência com selo dourado (`⭐ Curado`).
2. **Interface Interativa do Estudante:**
   - Abas por estação (`DJF`, `MAM`, `JJA`, `SON`), cada uma contendo uma matriz responsiva de 24 células (8 fases $\times$ 3 colunas de ENOS: La Niña, Neutro, El Niño).
   - Codificação semântica de cores para impacto no SESA (verde para chuva acima/extremos, vermelho para estiagem/seca severa, ardósia para transição climatológica).
   - Sincronização bidirecional: clicar em qualquer célula da matriz atualiza instantaneamente o mapa principal, diagrama RMM, jatos, SALLJ e painel de diagnóstico; alternar os seletores manuais do mapa reflete o destaque na célula ativa.
   - Cartão de Diagnóstico Físico com a forçante de fundo interanual (Alice Grimm), gatilho intra-sazonal da MJO, resposta no SESA e citações bibliográficas completas.
   - Botões de acesso rápido `#sandboxModeBtn` (no header superior) e `#btnOpenSandbox` (ao lado de "Eventos de interesse:"), com recurso de recolher/expandir (`#btnToggleSandboxView`).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1920 configurações** testadas no sandbox: **100% aprovadas sem exceções**.
  - **15 baterias de validação estrita** aprovadas (incluindo integridade das 96 permutações, mapeamento dos 10 casos curados, diagnósticos de Alice Grimm, compostos CPC/NOAA nas 8 fases global/regional, SALLJ 4 estados, TSM vibrante, MJO pontilhada, controle PSA/SALLJ/Jato/Caixas).
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
