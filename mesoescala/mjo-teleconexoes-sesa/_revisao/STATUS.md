# STATUS

## Estado
- Branch: revisao, criado do main a partir da base 3376bc9.
- Data e hora: 2026-09-27T16:43:00-03:00.
- Cópia local no branch revisao com o lote de melhorias implementado e validado.
- Arquivos de código da demonstração modificados no lote: `index.html` (cachebuster `?v=20260927d` e rótulos), `documented-cases.js` (remoção de fallback de ENOS), `documented-view.js` (ENOS 'todos', χ200 regional core vazado e opacidade ≤ 0,25, desamontoamento da chuva para o Atlântico, PSA por círculos/nós).

## Em andamento
Lote completo de melhorias implementado e validado no branch `revisao`. Aguardando aprovação do Reinaldo para eventual merge no `main`.

## Feito (nesta rodada)
- Seletor de ENOS: adicionada opção "Todos os anos" (`value="todos"`). Casos do Alvarez aparecem exclusivamente com "Todos os anos"; casos de Fernandes & Grimm aparecem estritamente no ENOS correspondente. Removido o fallback de `findDocumentedCase`.
- TSM Equatorial sob ENOS "Todos os anos": supressão do desenho da elipse da TSM equatorial e exibição do rótulo "Composição de todos os anos".
- Seletores de eventos de interesse: padronizados no formato estrito `"Fonte · Fase(s) — sinal (região)"`. Eventos do Alvarez selecionam automaticamente ENOS = "Todos os anos".
- χ200 sobre a América do Sul (regional): núcleo (core) sem preenchimento (`fill: 'none'`, opacidade 0), `mid` = 0,12, `outer` = 0,10. Opacidade somada no centro = 0,22 ≤ 0,25.
- Desamontoamento de rótulos: texto descritivo do símbolo de precipitação deslocado para o oceano Atlântico com linha guia sutil, evitando sobreposição com SESA, ZCAS e SALLJ.
- PSA por círculos/nós: os centros de anomalia do trem de ondas PSA passam a ser representados por círculos com sinais alternados nos 4 nós conceituais ao longo do arco.
- Atualização de cachebuster para `?v=20260927d`.
- Capturas antes e depois de JJA 4–5 e DJF 8–1 registradas em `_revisao/capturas/`.
- Atualizadas as seis capturas canônicas (`global_DJF_f1`, `global_DJF_f8`, `global_JJA_f8`, `regional_DJF_f8`, `boletim`, `celular_390`).

## Aguardando decisão do Reinaldo
- Aprovação do lote do branch `revisao` para posterior merge no `main`.

## Fontes
- Fernandes & Grimm (2023), Journal of Climate: Seção 5 e Figs. 5, 9 e 12 (VERIFICADO).
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics: Figs. 2 e 5 (VERIFICADO).
- Grimm (2019), Climate Dynamics (VERIFICADO).
- Roy, Arblaster, Wheeler & Lim (2025), Geophysical Research Letters (VERIFICADO).
- Wheeler & Hendon (2004), Monthly Weather Review (VERIFICADO).
- Jones, Mu, Carvalho & Ding (2023), npj Climate and Atmospheric Science (VERIFICADO).
- Acervo completo dos 6 artigos científicos em PDF armazenado em: C:\Users\haas\github\mjo-sesa\ (fora do git da demonstração). Pronto para conferência de El Niño 3 e Neutro 4 de Fernandes & Grimm.

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
