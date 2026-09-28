# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-27T21:25:00-03:00.
- Lote Fechado com o Reinaldo integralmente implementado, validado e coberto por testes funcionais automatizados e capturas visuais.
- Arquivos modificados no lote:
  - `documented-cases.js`: base curada restrita aos 8 casos autorizados com sinal aumentado ("mais") e mecanismos físicos dos autores.
  - `documented-view.js`: mecanismos tropical e extratropical no mapa, SALLJ direcional, ocultação de ENOS em eventos Alvarez, trilha 1–8 com repetição do 1 em 165°W, remoção completa de `metric`.
  - `index.html`: seletor de métrica removido, seletor de ENOS envolvido em `id="ensoGroup"`, atalhos de eventos atualizados com os 8 IDs autorizados, cache-buster `?v=20260927h`.
  - `rmm-diagram.js`: suporte a `fromUser = true` nos cliques das fases.
  - `verify-model.cjs`: conjunto completo de asserções cobrindo integridade dos 8 casos, ZERO ocorrências de `metric`, eventos e SALLJ direcional, e regressão de 1536 configurações de sandbox.
  - `_revisao/STATUS.md` e `_revisao/painel.html`: documentação e capturas atualizadas.

## Em andamento
- Lote fechado concluído e aprovado nos testes. Aguardando aprovação de Reinaldo para merge no `main`.

## Feito (neste lote fechado)
1. **Base de casos autorizada (só sinal "mais", só mecanismos físicos dos autores):**
   - **Alvarez et al. (2016)** (composição de todos os anos, sem ENOS; rótulo "mais chance de semana chuvosa"):
     - `DJF` Fases 3–4: Bacia do Prata, $\chi_{200} > 0$ (convergência/subsidência tropical), centro ciclônico C na AS subtropical/extratropical (~38°S 62°W).
     - `DJF` Fases 8 e 1: ZCAS, $\chi_{200} < 0$ (divergência/ascendência tropical), centro anticiclônico A no extremo sul (~50°S 68°W).
     - `MAM` Fase 1: Leste do Brasil, $\chi_{200} < 0$ (divergência tropical), centro ciclônico C sobre a Bacia do Prata (~30°S 55°W).
     - `JJA` Fase 8: Sudeste do Brasil, centro ciclônico C no leste da AS subtropical (~25°S 45°W).
     - `SON` Fases 7–8: ZCAS, $\chi_{200} < 0$ (divergência tropical), centro ciclônico C em torno de 20°S (~20°S 50°W); nota observacional de que o índice de OLR adianta o RMM em uma fase nesta estação.
     - `SON` Fase 1: Bacia do Prata, centro ciclônico C na AS subtropical (~30°S 60°W) proveniente do oeste da Península Antártica; nota observacional de adiantamento de OLR em relação ao RMM.
   - **Fernandes & Grimm (2023)** (estratificados por ENOS, somente DJF):
     - `DJF` La Niña Fase 8: pico de chuva na ZCAS; mecanismo de trem de ondas PSA excitado por convecção reforçada no Pacífico Sul subtropical centro-leste (fases 7+8); marcador qualitativo de fonte posicionado em 25°S 125°W.
     - `DJF` El Niño Fase 1: pico de chuva na ZCAS uma fase depois; fonte convectiva subtropical deslocada um pouco mais a leste (fases 8+1); marcador qualitativo de fonte posicionado em 25°S 110°W.
   - **Remoção:** todos os casos não autorizados foram excluídos da base (sem casos secos/"menos", sem casos antigos de Roy et al. sem validação de chuva regional).

2. **Mecanismos físicos desenhados no mapa:**
   - **Tropical:** destaque do sinal de $\chi_{200}$ sobre a América do Sul tropical com caixa semitransparente identificando convergência/subsidência ($\chi_{200} > 0$) ou divergência/subida ($\chi_{200} < 0$).
   - **Extratropical:** centros ciclônicos ("C") e anticiclônicos ("A") demarcados com círculo tracejado estilizado nas coordenadas especificadas pelos autores, acompanhados da legenda "trem de ondas (Alvarez et al. 2016)".
   - **Amplitude < 1:** todos os destaques de convecção, $\chi_{200}$, trem de ondas e casos documentados desaparecem completamente quando $A < 1$.

3. **Eliminação completa do conceito de "métrica" (`metric`):**
   - Removido o seletor de métrica da interface.
   - Cada caso possui um único texto sintético e coeso (sinal meteorológico + mecanismos dos autores).
   - Narração e painel unificados sem bifurcações.
   - ZERO ocorrências da palavra `metric` em todos os arquivos de produção (`index.html`, `documented-view.js`, `documented-cases.js`, `rmm-diagram.js`, `map-regions.js`).

4. **Comportamento do ENOS em Eventos de Interesse:**
   - Ao selecionar eventos de Alvarez: estação e fase são fixadas ($A = 1{,}5$); o seletor de ENOS desaparece (`display: none`); o painel identifica "composição de todos os anos (sem separação por ENOS)".
   - Ao selecionar eventos de Fernandes & Grimm: estação, fase e ENOS são fixados ($A = 1{,}5$); o seletor de ENOS permanece visível.
   - Qualquer interação manual do usuário (mudança de estação, fase, clique no RMM, alteração de ENOS) sai do modo evento e restaura o seletor de ENOS imediatamente.
   - No sandbox livre, os casos de Alvarez aparecem sob qualquer ENOS como "Média de todos os anos (Alvarez et al. 2016)" sem ocultar o seletor.

5. **SALLJ direcional (DJF; Nogués-Paegle & Mo 1997):**
   - Na Bacia do Prata (DJF 3–4): seta do SALLJ (~850 hPa) se estende até a Bacia do Prata, reforçando o transporte de umidade para o sul.
   - Na ZCAS (DJF 8–1, La Niña 8, El Niño 1): seta curva para leste/nordeste em direção ao setor ZCAS, reforçando a convergência sobre o Sudeste.
   - Demais combinações e outras estações: traçado neutro curto ao longo dos Andes.
   - Legenda didática incluída: "jato de baixos níveis — alternância ZCAS × Prata (Nogués-Paegle & Mo 1997)".

6. **Trilha RMM 1–8 e Centros de $\chi_{200}$:**
   - Trilha com os 9 pontos de referência de Wheeler & Hendon (2004, Fig. 7): 1: 50°E, 2: 70°E, 3: 90°E, 4: 108°E, 5: 128°E, 6: 148°E, 7: 165°E, 8: 180°, e repetição do 1 em 165°W (ambos destacados na fase 1).
   - Rótulo: "Fases RMM (Wheeler & Hendon 2004)".
   - Marcadores de centros de divergência e convergência do potencial de velocidade em formato de losango (`polygon`).

7. **Download e Verificação dos 7 Artigos Científicos:**
   - Salvos em `C:\Users\haas\github\mjo-sesa\` (fora do repositório):
     1. `Muza_et_al_2009_JCLI.pdf`
     2. `Carvalho_et_al_2002_JCLI.pdf`
     3. `Liebmann_et_al_2004_JCLI.pdf`
     4. `Paegle_et_al_2000_MWR.pdf`
     5. `Alvarez_et_al_2013_ClimDyn.pdf`
     6. `Grimm_et_al_2021_ClimDyn.pdf`
     7. `Minjares_et_al_2025_arXiv.pdf`
   - Todos íntegros e verificados com contagem de páginas via `pypdf`.

## Aguardando decisão do Reinaldo
- Aprovação do lote no branch `revisao` para merge no `main`.

## Fontes
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
- Wheeler & Hendon (2004), Monthly Weather Review 132, 1917–1932 (Figs. 7 e 8).
- Nogués-Paegle & Mo (1997), Journal of the Atmospheric Sciences 54, 966–982 (alternância SALLJ ZCAS × Prata).
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1536 configurações** testadas no sandbox (4 estações × 3 ENOS × 8 fases × 4 modos MJO × 2 amplitudes {0,5; 1,5} × 2 visões): **100% aprovadas sem exceções**.
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
  - **SALLJ direcional:** traçados diferenciados e validados programaticamente para Bacia do Prata, ZCAS e neutro.
  - **Modo evento:** ocultação do seletor ENOS em Alvarez e restauração na interação manual do usuário aprovadas.
- **Capturas visuais geradas via Chrome DevTools Protocol (`_revisao/capturas/`):**
  - `DJF_3_4_prata.png`: Bacia do Prata, SALLJ estendido ao sul, centro C (~38°S 62°W), $\chi_{200} > 0$, seletor ENOS oculto.
  - `DJF_lanina_8_zcas.png`: ZCAS, SALLJ curvando a leste, marcador qualitativo de convecção fonte (25°S 125°W), seletor ENOS visível.
  - `SON_1_prata.png`: Bacia do Prata em SON fase 1, centro C (~30°S 60°W), nota observacional de adiantamento do OLR.
  - `trilha_fase1.png`: Trilha RMM 1–8 com os 9 pontos de referência de Wheeler & Hendon (2004) e duplo destaque da fase 1.

## Decisões registradas
- 27/09/2026: Lote fechado com o Reinaldo: somente casos com sinal aumentado ("mais") e mecanismo físico dos autores.
- 27/09/2026: Remoção total do seletor de métrica e de qualquer referência a `metric`.
- 27/09/2026: SALLJ direcional em DJF (Nogués-Paegle & Mo 1997) integrado ao mapa e à narração.
- 27/09/2026: Ocultação contextual do seletor de ENOS em eventos de "todos os anos" (Alvarez et al. 2016) e restauração em qualquer ação manual.
- 27/09/2026: Trilha RMM 1–8 fixa de Wheeler & Hendon (2004, Fig. 7) com repetição e realce duplo da fase 1 em 165°W.
- 27/09/2026: Commit e push realizados exclusivamente no branch `revisao`.
