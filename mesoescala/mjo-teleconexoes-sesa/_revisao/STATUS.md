# STATUS

## Estado
- Branch: revisao, criado do main a partir da base 3376bc9.
- Data e hora: 2026-09-27T19:42:00-03:00.
- Cópia local no branch revisao com restauração completa do Sandbox, seletor de ENOS de 3 opções e regras didáticas.
- Arquivos modificados no lote: `index.html` (cachebuster `?v=20260927g`), `documented-cases.js` (suporte a Alvarez em qualquer ENOS e retorno duplo), `documented-view.js` (sandbox 96 combinações, modo default 'none', losangos no χ200, atalhos sem interferir em modos), `_revisao/PROTOCOLO.md` (regras permanentes de estabilidade e regressão), `STATUS.md`, capturas de validação.

## Em andamento
Lote completo de restauração do Sandbox testado e validado. Aguardando aprovação para merge no `main`.

## Feito (nesta rodada)
- **Seletor de ENOS:** voltado estritamente às 3 opções canônicas (El Niño, Neutro, La Niña). Removido "Todos os anos" da interface.
- **Restauração do Sandbox:** todas as 96 combinações (4 estações × 3 ENOS × 8 fases) operam livremente:
  - Base sempre desenhada: TSM equatorial correspondente ao ENOS, Jato Subtropical modulado por ENOS e estação, SALLJ (~850 hPa), polígonos e identificadores de ZCAS e SESA, e teleconexão PSA (em DJF e MAM).
  - Padrões de "MJO nos trópicos" ativos exclusivamente conforme o modo selecionado (Nenhuma / χ200 / dipolos / trilha), iniciando por padrão em "Nenhuma".
  - Casos documentados apenas acrescentam destaque e texto sobre a base; quando não há caso catalogado, exibe "Sem resultado documentado para esta combinação" e toda a base cartográfica e física permanece ativa.
- **Composições de todos os anos (Alvarez et al. 2016):** aplicam-se a qualquer ENOS selecionado naquela estação e fase. Se houver caso específico do ENOS (Fernandes & Grimm 2023), o painel e o resumo exibem os dois em conjunto (primeiro o específico, depois "Média de todos os anos (Alvarez et al.)").
- **Eventos de interesse como atalhos puros:** apenas ajustam estação, fase, ENOS (quando específico; mantendo o atual se Alvarez) e amplitude = 1,5, sem alterar o modo "MJO nos trópicos" nem desativar controles.
- **Amplitude RMM < 1:** os padrões tropicais da MJO (χ200, dipolos, realce da trilha) e os destaques de casos desaparecem totalmente; a base permanente permanece 100% íntegra.
- **Modo padrão e marcadores de χ200:** inicialização em "Nenhuma"; trilha fixa de Wheeler & Hendon (2004, Fig. 7); marcadores em losango nos centros de divergência e convergência do χ200.
- **Regra permanente:** adicionada ao `PROTOCOLO.md` proibindo restrições ou mudanças de comportamento de controles sem solicitação explícita e exigindo teste de regressão das 96 combinações em todo lote.

## Aguardando decisão do Reinaldo
- Retorno do Consultor sobre as figuras exportadas e aprovação para futuros passos. Sem merge no `main`.

## Resumo da Verificação Científica Documental — Etapa 1 (2026-09-27)
- **Relatório detalhado:** salvo em `C:\Users\haas\github\mjo-sesa\verificacao_casos.md` (fora do repositório).
- **Status dos casos de Fernandes & Grimm (2023) e Alvarez et al. (2016):** todos marcados como **NÃO VERIFICADO** (o Consultor fará a conferência diretamente pelas figuras exportadas).
- **Código:** mantidas as referências de figuras/páginas originais sem alteração em `documented-cases.js`.
- **Casos pendentes checados:** El Niño · fase 3 e Neutro · fase 4 (Fernandes & Grimm 2023) — marcados como **NÃO VERIFICADO**, aguardando validação do Consultor.
- **Páginas e Figuras-Chave Identificadas:**
  - **Wheeler & Hendon (2004):**
    - Setores das fases no diagrama RMM: **Figura 7**, p. 1923 (PDF p. 7).
    - Compostos de OLR por fase (DJF): **Figura 8**, p. 1924 (PDF p. 8).
  - **Fernandes & Grimm (2023):**
    - Extremos e chuva por fase e ENOS: **Figura 12**, p. 7733 (PDF p. 19).
  - **Palestra Cavalcanti (2018):**
    - EOF1 de v200 NDJFMA (PSA intrassazonal): **Slide 12** (p. 12).
  - **Complemento Haas (2026):**
    - Espaço de fase da MJO: **Figura 1.1**, p. 9.
    - Dipolo ZCAS–Bacia do Prata e PSA: **Figura 1.2**, p. 11.
- **Três Figuras PNG de Alta Resolução (300 DPI) exportadas para `C:\Users\haas\github\mjo-sesa\`:**
  1. `figura_wheeler_hendon_2004_olr_fases.png` (WH04, Fig. 8, p. 1924).
  2. `figura_fernandes_grimm_2023_extremos_fases.png` (FG23, Fig. 12, p. 7733).
  3. `figura_eof1_v200_palestra_cavalcanti_2018.png` (Palestra Cavalcanti 2018, slide 12, p. 12).

## Fontes
- Fernandes & Grimm (2023), Journal of Climate: Seção 5 e Figs. 5, 9 e 12 (NÃO VERIFICADO — aguardando Consultor).
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics: Figs. 2 e 5 (NÃO VERIFICADO — aguardando Consultor).
- Grimm (2019), Climate Dynamics (base de verão).
- Roy, Arblaster, Wheeler & Lim (2025), Geophysical Research Letters.
- Wheeler & Hendon (2004), Monthly Weather Review: Figs. 7 e 8.
- Jones, Mu, Carvalho & Ding (2023), npj Climate and Atmospheric Science.
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).
- Haas (2026), Meteorologia de Mesoescala e de Montanhas (Volume Complementar): Figs. 1.1 e 1.2.


## Validações
- 2026-09-27T19:42:00-03:00: **Teste de regressão completo das 96 combinações × 4 modos × amplitudes {0,5; 1,5} (768 estados testados via CDP Chrome headless):**
  - Erros de JavaScript: **0** (zero falhas no console).
  - Integridade da base permanente: **100% presente** em todos os 768 estados (TSM equatorial modulada por ENOS, Jato Subtropical, SALLJ, polígonos SESA e ZCAS, e PSA nos 384 estados de DJF/MAM).
  - Comportamento de MJO fraca ($A = 0{,}5$): **0 vazamentos** (potencial de velocidade $\chi_{200}$, dipolos, destaques da trilha e símbolos de casos 100% ocultos em todos os 384 estados com $A < 1$; base sempre preservada).
  - Atalhos de eventos de interesse: **9 de 9 atalhos validados**, configurando a estação, fase, ENOS e amplitude sem alterar o modo "MJO nos trópicos".
  - DJF + La Niña + Fase 8: Fernandes & Grimm (2023) E Alvarez et al. (2016) exibidos simultaneamente no painel e no resumo.
  - JJA + El Niño + Fase 4: caso de Alvarez et al. (2016) exibido corretamente no painel e destacado no mapa sobre a base de El Niño.
- Capturas de validação salvas em `_revisao/capturas/`:
  - `DJF_la_nina_f8_duplo.png`: exibição simultânea de Fernandes & Grimm e Alvarez no painel.
  - `JJA_el_nino_f4_alvarez.png`: aplicação de Alvarez em JJA sob El Niño no sandbox com modo "Nenhuma".
  - `chi_A050.png`: base permanente completa (TSM fria, jatos, SESA, ZCAS e PSA) sem nenhum padrão tropical ativo.
  - `trilha_DJF_f6.png`: trilha 1–8 fixa de Wheeler & Hendon (2004) com realce na fase 6.

## Decisões registradas
- 27/09/2026: trabalhar sempre em `revisao`; commit e push autorizados no branch `revisao`. Merge em `main` somente após Reinaldo dizer “aprovado”.
- 27/09/2026: acompanhamento por `STATUS.md`, `painel.html` e capturas a cada lote.
- 27/09/2026: sandbox totalmente aberto com 96 combinações (4 estações × 3 ENOS × 8 fases) e modo padrão "Nenhuma".
- 27/09/2026: casos de todos os anos (Alvarez et al. 2016) válidos para qualquer ENOS; se houver caso específico (Fernandes & Grimm 2023), ambos são apresentados no painel.
- 27/09/2026: eventos de interesse são atalhos puros, sem travar nem alterar o modo de visualização tropical.
- 27/09/2026: regra permanente incremental e teste de regressão obrigatório antes de cada push registrados no PROTOCOLO.md.
