# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-28T01:00:00-03:00.
- Versão de cache: `?v=20260927n`.
- Revisão concluída e validada (SALLJ com 4 estados, escalonamento por A e legendas; TSM de El Niño/La Niña vibrantes sobrepostas à MJO; MJO pontilhada com intensidade RMM; eventos de interesse em caixa única com prefixos de estação; PSA e SALLJ com controles dedicados).
- Arquivos modificados:
  - `index.html`:
    - Adicionado seletor `SALLJ` na linha 2 dos controles com opções: `Automático (padrão)`, `Forte`, `Fraco` e `Climatológico`.
    - Unificados todos os eventos de interesse em uma única caixa de seleção (`eventsSelect`), agrupados por `<optgroup>` com prefixos de estação (`DJF`, `MAM`, `JJA`, `SON`).
    - Adicionados controles diretos na barra de ferramentas do mapa: checkboxes `[x] PSA` e `[x] SALLJ`.
    - Cache-buster atualizado para `?v=20260927n`.
  - `documented-view.js`:
    - Implementado `salljState` e função `getEffectiveSalljState`:
      - Modo Automático: DJF fases 3–4 → Forte; DJF fases 8–1 → Fraco; demais → Climatológico (JJA sempre Climatológico com nota de inverno).
      - Forte: seta longa e grossa (base 4.2 px) até o setor SESA.
      - Fraco: seta curta (base 2.2 px) curvando para leste em direção à ZCAS.
      - Climatológico: seta média (3.2 px) ao longo dos Andes.
      - Escalonamento da espessura visual com $f = \min(A, 1)$ no modo Automático; fixo nos modos manuais.
      - Legenda por estado:
        - Forte: "jato forte — mais chuva e extremos no SESA (Liebmann et al. 2004)"
        - Fraco: "jato fraco — umidade desviada para a ZCAS (Liebmann et al. 2004; Muza et al. 2009)"
        - Climatológico JJA auto: "no inverno, altos níveis dominam — Alvarez et al. 2013"
      - Camada liga/desliga independente via `visibleLayers.sallj`.
    - TSM Equatorial de El Niño e La Niña com cores mais fortes, vibrantes e núcleos anômalos, desenhada sobre a MJO tropical.
    - MJO nos trópicos com bordas pontilhadas (`stroke-dasharray`) nos paralelogramos de $\chi_{200}$ e dipolos convecção, com opacidade e espessura proporcionais à amplitude RMM.
    - PSA desacoplada em função dedicada `drawPsa()`, renderizada em projeções global e regional, sincronizada com `#psaToggle`.
  - `verify-model.cjs`:
    - Adicionada matriz de testes para os 4 estados do SALLJ $\times$ DJF fases 3 e 8 $\times$ $A \in \{0.5, 1.5\}$.
    - Validação de escalonamento por amplitude, persistência manual, e legendas por estado.
    - Validação de TSM vibrante, bordas pontilhadas de $\chi_{200}$, e alternância independente de PSA e SALLJ.
    - Total de 1536 configurações + 18 baterias específicas: 100% de aprovação.

## Feito (nesta revisão)
1. **SALLJ com Estados (Automático, Forte, Fraco, Climatológico):**
   - Seletor posicionado na linha 2 dos controles.
   - Resolução física por estação e fase em modo Automático.
   - Traçado longo e espesso até SESA no estado Forte; traçado curto curvando para ZCAS no estado Fraco.
   - Espessura visual modulada por $f = \min(A, 1)$ em Automático e constante nos manuais.
   - Legendas autorais específicas por estado (Liebmann et al. 2004; Muza et al. 2009).
2. **TSM Vibrante de El Niño e La Niña sobreposta à MJO:**
   - Cores saturadas com camada quente/fria interior, sobrepostas aos campos tropicais.
3. **MJO Pontilhada Proporcional ao RMM:**
   - Paralelogramos e dipolos com `stroke-dasharray` e saturação dinâmica proporcional a $A$.
4. **Caixa Única de Eventos de Interesse:**
   - Select único com prefixos de estação (`DJF`, `MAM`, `JJA`, `SON`) e `<optgroup>`.
5. **Restauração e Controle Independente de PSA e SALLJ:**
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
