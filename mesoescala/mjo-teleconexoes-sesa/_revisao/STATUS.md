# STATUS

## Estado
- Branch: revisao, criado do main a partir da base 3376bc9.
- Data e hora: 2026-09-27T17:48:00-03:00.
- Cópia local no branch revisao com o lote de melhorias e correções implementado e validado.
- Arquivos modificados no lote: `index.html` (cachebuster `?v=20260927e`), `documented-view.js` (PSA com 6 centros da EOF1 de v200 Cavalcanti 2018, χ200 global core vazado, texto de chuva e extremos mantido dentro do mapa), `STATUS.md`, capturas canônicas completas.

## Em andamento
Lote completo de correções no branch `revisao`. Aguardando validação do Consultor das figuras exportadas e decisão do Reinaldo.

## Feito (nesta rodada)
- Verificação documental: artigos de Fernandes & Grimm (2023) e Alvarez et al. (2016) marcados integralmente como **NÃO VERIFICADO** no STATUS.md e em `verificacao_casos.md`. Mantidas intactas as figuras/páginas no código para conferência posterior pelo Consultor. Retirado "Roy (VERIFICADO)" das fontes.
- PSA (Cavalcanti 2018, slide 12): representação substituída pelos 6 centros da EOF1 de v em 200 hPa (135°E 40°S −; 175°E 45°S +; 145°W 50°S −; 100°W 50°S +; 65°W 40°S −; 30°W 35°S +), raios proporcionais aos centros (145°W e 100°W maiores; 175°E grande; 65°W e 30°W médios; 135°E pequeno), contorno sem preenchimento, cor própria (`#c084fc`), "+" / "−", linha tracejada ligando os centros e legenda: "Padrão PSA · EOF1 de v em 200 hPa, NDJFMA (Cavalcanti 2018, INPE)".
- χ200 GLOBAL: mesmas regras da visão regional aplicadas ao mapa global (núcleo só com contorno sem preenchimento, `mid <= 0.12`, `outer <= 0.10`, opacidade central somada 0.22 ≤ 0.25).
- Desamontoamento e enquadramento: texto "Extremos mais frequentes" e "Chuva média favorecida" com limite de margem seguro (`maxTx`) para permanecer 100% visível dentro do mapa sem corte na borda direita.
- Capturas do painel refeitas: conexão WebSocket CDP ajustada para a aba ativa da aplicação, aguardando o SVG ter elementos e mais 900 ms de repaint. As seis capturas canônicas (`global_DJF_f1`, `global_DJF_f8`, `global_JJA_f8`, `regional_DJF_f8`, `boletim`, `celular_390`) e os comparativos antes/depois foram todos gerados com sucesso (arquivos completos entre 54 KB e 107 KB, eliminando quadros em branco).
- Atualização de cachebuster para `?v=20260927e`.
- Pendências da ETAPA 2 mantidas: trilha 1–8 pela convenção de Wheeler & Hendon e amplitude < 1 apagando tudo continuam pendentes para momento oportuno; dipolo simples aguarda leitura dos centros pelo Consultor.

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
- 2026-09-27T16:42:27-03:00: console do navegador com 0 erros de JavaScript capturados via CDP Chrome headless.
- 2026-09-27T16:42:27-03:00: narração textual testada em 384 combinações (4 estações × 4 ENOS × 8 fases × 3 variáveis) com 0 falhas, sem undefined/NaN.
- 2026-09-27T16:42:27-03:00: verificação de responsividade mobile nas larguras 360 px, 390 px e 414 px — scrollWidth == innerWidth, sem overflow horizontal; captura em 390 px salva.
- 2026-09-27T16:42:27-03:00: teste de regra de ENOS:
  - DJF + La Niña + fase 8 → Fernandes & Grimm (2023)
  - DJF + Todos os anos + fase 8 → Alvarez et al. (2016)
  - DJF + Neutro + fase 8 → null (sem caso cadastrado)
  - JJA + Todos os anos + fase 4 → Alvarez et al. (2016)
- Capturas antes/depois: `JJA_4_5_antes.png` e `JJA_4_5_depois.png`; `DJF_8_1_antes.png` e `DJF_8_1_depois.png`.
- Seis capturas canônicas salvas em `_revisao/capturas/` até 1200 px de largura.

## Decisões registradas
- 27/09/2026: trabalhar sempre em `revisao`; commit e push autorizados no branch `revisao`. Merge em `main` somente após Reinaldo dizer “aprovado”.
- 27/09/2026: acompanhamento por `STATUS.md`, `painel.html` e capturas a cada lote.
- 27/09/2026: casos Alvarez selecionam ENOS = "Todos os anos"; casos Fernandes & Grimm selecionam o ENOS correspondente.
- 27/09/2026: χ200 regional com core apenas contorno e opacidade total ≤ 0,25.
- 27/09/2026: texto do símbolo de chuva no Atlântico para desamontoar do continente.
