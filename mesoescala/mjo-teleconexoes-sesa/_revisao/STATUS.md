# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-27T22:50:00-03:00.
- Versão de cache: `?v=20260927j`.
- Revisão do lote concluída e validada (estrito SESA e ZCAS, 10 casos curados, notas de autor e citações Liebmann 2004).
- Arquivos modificados:
  - `documented-cases.js`:
    - Rótulos estritos: uso exclusivo de "SESA" e "ZCAS" em todas as instâncias de `region` e `regionName`.
    - Casos de Alvarez em MAM (fase 1) e JJA (fase 8) reclassificados para região ZCAS com nota explícita do recorte original do autor ("leste do Brasil" e "sudeste do Brasil / SEBr").
    - Adicionado campo `authorSectorDef` em todos os 10 casos com a definição do setor segundo o respectivo autor.
    - Adicionados 2 novos casos de DJF documentados por Fernandes & Grimm (2023, pp. 7731–7734):
      - `DJF-el-nino-3`: El Niño · Fase 3 — SESA (pico de extremos). Mecanismo: par ciclone–anticiclone do El Niño em 200 hPa projeta-se na circulação da fase 3 e adianta o reforço; Hadley anômala do El Niño favorece chuva no SESA.
      - `DJF-neutro-4`: Neutro · Fase 4 — SESA (maior aumento de extremos no neutro). Mecanismo: convecção suprimida no Pacífico central equatorial e no Pacífico Sul subtropical centro-leste; trem de ondas invertido.
    - Mecanismo ZCAS de Fernandes & Grimm (2023) nas fases DJF La Niña 8 e El Niño 1 detalhado com "fluxo de umidade da Amazônia para a ZCAS e divergência de umidade no SESA".
  - `documented-view.js`:
    - SALLJ: citação de Liebmann et al. (2004) ("jato forte → chuva e extremos no SESA; jato fraco → ZCAS; a fase do trem de ondas ao cruzar os Andes decide o lado") e Nogués-Paegle & Mo (1997) no mapa e na narração.
    - Painel e narração: nota fixa de definição de setores (Fernandes & Grimm, Liebmann et al., Muza et al., Haas); exibição de `authorSectorDef` em cada card de caso.
    - Nota de alerta para La Niña (DJF, fases 2–8): "extremos no SESA diminuem mesmo quando a chuva média aumenta (subsidência favorecida pela La Niña)".
    - Nota física para JJA (inverno): "No inverno, extremos no SESA ligam-se a um ciclone travado por anticiclone perto da Península Antártica (Alvarez et al. 2013); a relação com as fases da MJO não foi estabelecida."
    - Removidas substituições legadas de TTS que convertiam SESA em outros termos.
  - `index.html`:
    - Cache-buster atualizado para `?v=20260927j`.
    - Menu de Eventos de Interesse atualizado com 10 casos e rótulos estritos SESA / ZCAS.
    - Legenda de setores e nota de rodapé atualizadas com nota fixa de recortes de setores.
  - `verify-model.cjs`:
    - Testes estendidos para validar os 10 casos, 0 ocorrências de nomes legados ("Bacia do Prata", "leste do Brasil", "sudeste do Brasil") nas regiões, validação de `authorSectorDef`, presença das notas de La Niña e JJA e citações de Liebmann (2004).
  - `_revisao/STATUS.md` e `_revisao/painel.html`: documentação e capturas atualizadas.

## Em andamento
- Revisão aprovada nos testes automatizados e visuais. Pronto para merge.

## Feito (nesta revisão)
1. **Padronização Estrita de Nomenclatura (SESA e ZCAS):**
   - Eliminados nomes genéricos ou legados como "Bacia do Prata", "leste do Brasil", "sudeste do Brasil".
   - Casos de Alvarez et al. (2016) mapeados para ZCAS com notas contextuais.
   - Nota fixa de recortes de setores inserida no painel, legenda e rodapé.
   - Cada caso informa a definição do seu autor em linha dedicada (`authorSectorDef`).

2. **Novos Casos Curados (DJF, Fernandes & Grimm 2023):**
   - El Niño · Fase 3 (SESA) e Neutro · Fase 4 (SESA) integrados aos seletores e sandbox.
   - Total de casos curados expandido para 10.

3. **Física e Mecanismos Detalhados:**
   - La Niña DJF (fases 2–8): subsidência e divergência de extremos explicadas.
   - JJA Inverno: bloqueio anticiclônico na Península Antártica (Alvarez et al. 2013).
   - SALLJ: acoplamento de Liebmann et al. (2004) e Nogués-Paegle & Mo (1997).

## Fontes
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Alvarez et al. (2013), Climate Dynamics (variabilidade intrassazonal no inverno).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
- Liebmann et al. (2004), Journal of Climate 17, 3829–3842 (SALLJ e dipolo).
- Wheeler & Hendon (2004), Monthly Weather Review 132, 1917–1932 (Figs. 7 e 8).
- Deemer, G., NOAA/ESRL PSD (compostos de potencial de velocidade 200 hPa).
- Nogués-Paegle & Mo (1997), Journal of the Atmospheric Sciences 54, 966–982 (alternância SALLJ ZCAS × SESA).
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1536 configurações** testadas no sandbox: **100% aprovadas sem exceções**.
  - **10 casos curados** verificados com nomes de região estritos (`SESA` ou `ZCAS`).
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
  - **χ200 Deemer:** tabela única validada, zero elipses no χ200, losangos conferidos.
  - **SALLJ & Notas:** citações de Liebmann (2004) e Nogués-Paegle & Mo (1997) validadas.
- **Capturas visuais geradas via Chrome DevTools Protocol (`_revisao/capturas/`):**
  - `DJF_3_4_prata.png`: SESA (Alvarez et al. 2016), sem TSM ENOS, SALLJ sobre o Pacífico, C desamontoado.
  - `DJF_lanina_8_zcas.png`: ZCAS (Fernandes & Grimm 2023), SALLJ curvando para ZCAS, fluxo de umidade e fonte subtropical.
  - `DJF_elnino_3_sesa.png`: El Niño · Fase 3 (SESA), par de circulação 200 hPa e Hadley anômala.
  - `DJF_neutro_4_sesa.png`: Neutro · Fase 4 (SESA), convecção suprimida no Pacífico Central e trem de ondas invertido.
  - `chi_fase1.png`: Potencial de velocidade 200 hPa fase 1 com losangos de Deemer.
  - `chi_fase4.png`: Potencial de velocidade 200 hPa fase 4 com losangos de Deemer.
  - `chi_fase8.png`: Potencial de velocidade 200 hPa fase 8 com losangos de Deemer.

## Decisões registradas
- 27/09/2026: Nomenclatura regional unificada estritamente em SESA e ZCAS.
- 27/09/2026: Inclusão de El Niño · 3 e Neutro · 4 (Fernandes & Grimm 2023).
- 27/09/2026: Inclusão da nota comparativa de definições de setores (Haas, Fernandes & Grimm, Liebmann et al., Muza et al.).
- 27/09/2026: Integração de Liebmann et al. (2004) para dinâmica do SALLJ.
