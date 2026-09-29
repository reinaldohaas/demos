# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-28T22:20:00-03:00.
- Versão de cache: `?v=20260928a`.
- Revisão concluída e validada (ampliação dos controles de alternância direta no mapa para Jato Subtropical e Caixas SESA e ZCAS; sincronização com legendas; 100% de aprovação nos testes automatizados).
- Arquivos modificados:
  - `index.html`:
    - Adicionado seletor `SALLJ` na linha 2 dos controles com opções: `Automático (padrão)`, `Forte`, `Fraco` e `Climatológico`.
    - Unificados todos os eventos de interesse em uma única caixa de seleção (`eventsSelect`), agrupados por `<optgroup>` com prefixos de estação (`DJF`, `MAM`, `JJA`, `SON`).
    - Ampliados os controles diretos na barra de ferramentas do mapa: checkboxes `[x] PSA`, `[x] SALLJ`, `[x] Jato Subtropical` e `[x] Caixas SESA e ZCAS`.
    - Atualizada a seção "Configuração das Camadas da Base" na legenda com controles sincronizados para todas as feições (incluindo controles individuais `Caixa SESA` e `Caixa ZCAS`).
    - Cache-buster atualizado para `?v=20260928a`.
  - `documented-view.js`:
    - Implementados `visibleLayers.jets`, `visibleLayers.sesa`, `visibleLayers.zcas` e getter/setter composto `visibleLayers.boxes`.
    - Jato Subtropical (`drawJets`) e caixas delimitadoras de SESA e ZCAS (`drawMap`) condicionadas estritamente às respectivas camadas ativas.
    - Sincronização bidirecional entre checkboxes da barra do mapa (`#jetsToggle`, `#boxesToggle`), caixas individuais (`#sesaToggle`, `#zcasToggle`) e opções da legenda.
    - `setClimateState` atualizado para suportar `opts.visibleLayers`.
    - Implementado `salljState` e função `getEffectiveSalljState`:
      - Modo Automático: DJF fases 3–4 → Forte; DJF fases 8–1 → Fraco; demais → Climatológico (JJA sempre Climatológico com nota de inverno).
      - Forte: seta longa e grossa (base 4.2 px) até o setor SESA.
      - Fraco: seta curta (base 2.2 px) curvando para leste em direção à ZCAS.
      - Climatológico: seta média (3.2 px) ao longo dos Andes.
      - Escalonamento da espessura visual com $f = \min(A, 1)$ no modo Automático; fixo nos modos manuais.
      - Legenda por estado (Liebmann et al. 2004; Muza et al. 2009; Alvarez et al. 2013).
  - `verify-model.cjs`:
    - Adicionada validação de controle e alternância direta para Jato Subtropical (`jetsToggle`), Caixas SESA e ZCAS (`boxesToggle`), e controles individuais (`sesaToggle`, `zcasToggle`).
    - 1536 configurações de sandbox + 13 baterias de validação estrita com 100% de aprovação.
    - ZERO ocorrências de `metric` em todo o código.

## Feito (nesta revisão)
1. **Controles Expandidos na Barra do Mapa (Item 5):**
   - Inclusão de `[x] Jato Subtropical` (`#jetsToggle`) e `[x] Caixas SESA e ZCAS` (`#boxesToggle`).
   - Suporte a alternância individual de `Caixa SESA` (`#sesaToggle`) e `Caixa ZCAS` (`#zcasToggle`).
   - Sincronização em tempo real com as opções da legenda.
2. **SALLJ com Estados (Automático, Forte, Fraco, Climatológico):**
   - Seletor posicionado na linha 2 dos controles com escalonamento por amplitude e legendas por estado.
3. **TSM Vibrante de El Niño e La Niña sobreposta à MJO:**
   - Cores saturadas com camada interior, sobrepostas aos campos tropicais.
4. **MJO Pontilhada Proporcional ao RMM:**
   - Paralelogramos e dipolos com `stroke-dasharray` e saturação dinâmica proporcional a $A$.
5. **Caixa Única de Eventos de Interesse:**
   - Select único com prefixos de estação (`DJF`, `MAM`, `JJA`, `SON`) e `<optgroup>`.
6. **Restauração e Controle Independente de PSA e SALLJ:**
   - Toggles diretos `#psaToggle` e `#salljToggle` na barra do mapa.

## Fontes
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
- Wheeler & Hendon (2004), Monthly Weather Review 132, 1917–1932 (Figs. 7 e 8).
- Deemer, G., NOAA/ESRL PSD (compostos de potencial de velocidade 200 hPa).
- Liebmann et al. (2004), Journal of Climate 17, 3829–3842 (SALLJ e dipolo).
- Muza et al. (2009), Journal of Climate (SEBr e dipolos).
- Nogués-Paegle & Mo (1997), Journal of the Atmospheric Sciences 54, 966–982.
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1536 configurações** testadas no sandbox: **100% aprovadas sem exceções**.
  - **18 baterias de validação estrita** aprovadas (SALLJ 4 estados $\times$ DJF 3 e 8 $\times$ A {0.5, 1.5}, TSM vibrante, MJO pontilhada, controle PSA/SALLJ).
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
