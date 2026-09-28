# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-28T00:10:00-03:00.
- Versão de cache: `?v=20260927m`.
- Revisão concluída e validada (Jato Subtropical em onda planetária, remoção de Camada (3/3) e cabeçalhos fixos, espaço reorganizado com Guia Geral e Conheça a MJO dentro da Legenda).
- Arquivos modificados:
  - `index.html`:
    - Removidas as linhas de cabeçalho: `"Mesoescala & Escala Planetária · Demonstração Interativa"` e `"MJO, Estações, ENOS & Teleconexões com o SESA"`.
    - Removido o controle `"Camadas (3/3)"` da barra de ferramentas do mapa, mantendo a base visual (TSM, jatos, PSA) permanente.
    - Barra de modos (`Explorar combinações` / `Boletim 45 dias`) e painel unificado de controles (`Estação`, `ENOS`, `Fase`, `Voz`, `Eventos de interesse`) posicionados diretamente no topo.
    - Mapa global e regional junto com o Diagrama RMM & Amplitude no topo imediato, sem necessidade de rolagem vertical.
    - Transferido para a Legenda & Guia:
      - Guia Geral de Exploração destacado no topo da legenda.
      - Descrições detalhadas de cada elemento (Cartografia, Jato Subtropical, SALLJ, MJO, Setores SESA e ZCAS, TSM, PSA, Chuva).
      - Apresentação completa "Conheça a MJO e as pesquisas" em seção recolhível limpa.
      - Configuração opcional de camadas da base (sstLayer, jetsLayer, psaLayer).
    - Cache-buster atualizado para `?v=20260927m`.
  - `documented-view.js`:
    - Jato Subtropical (~200 hPa) modelado como uma onda planetária de Rossby ondulada contínua (`getSubtropicalJetLat`), modulado em latitude pela estação (32°S no DJF, 27°S no JJA) e em espessura pelo ENOS (4.5 px no El Niño, 2.2 px na La Niña).
    - Na visão global: onda contínua sem descontinuidades de 20°E a 380°E (1200 px), com rótulo desobstruído sobre o Pacífico Central.
    - Na visão regional: amostragem densa da onda cruzando o Pacífico, Andes, SESA e Atlântico com seta direcional de fluxo a leste.
    - Rótulo do botão de legenda atualizado para `Legenda & Guia`.
  - `_revisao/STATUS.md` e `_revisao/painel.html`: documentação e capturas atualizadas.
  - `_revisao/capturas/`:
    - `topo_pagina_organizado.png`: Visão do topo da página com espaço limpo e controles no topo.
    - `global_DJF_f1.png`: Jato Subtropical em onda planetária na visão global.
    - `regional_DJF_f4.png`: Jato Subtropical em onda cruzando SESA com seta no Atlântico.
    - `legenda_guia_aberta.png`: Legenda & Guia aberta com Guia Geral e Conheça a MJO integrados.

## Em andamento
- Revisão aprovada nos testes automatizados e visuais. Pronto para merge.

## Feito (nesta revisão)
1. **Remoção de "Camadas (3/3)" e Cabeçalhos:**
   - Eliminado o dropdown `"Camadas (3/3)"` da toolbar; base visual permanente preservada.
   - Removidos `"Mesoescala & Escala Planetária"` e títulos grandes do topo.
2. **Jato Subtropical como Onda Planetária:**
   - Traçado em onda de Rossby contínua em projeção global e regional, modulado por estação e ENOS.
3. **Organização Espacial e Transferência para Legenda:**
   - Controles e mapa trazidos para a área visível principal.
   - Todo o conteúdo explicativo, Guia Geral e "Conheça a MJO" organizados na Legenda & Guia.

2. **Capturas Visuais Geradas e Verificadas:**
   - `chi_fase1.png`: global fase 1 com paralelismo estrito.
   - `chi_fase4.png`: global fase 4 com paralelismo estrito.
   - `chi_fase8.png`: global fase 8 com paralelismo estrito.
   - `chi_fase4_regional.png`: regional fase 4 com paralelismo estrito.

## Fontes
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
- Wheeler & Hendon (2004), Monthly Weather Review 132, 1917–1932 (Figs. 7 e 8).
- Deemer, G., NOAA/ESRL PSD (compostos de potencial de velocidade 200 hPa).
- Liebmann et al. (2004), Journal of Climate 17, 3829–3842 (SALLJ e dipolo).
- Nogués-Paegle & Mo (1997), Journal of the Atmospheric Sciences 54, 966–982.
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1536 configurações** testadas no sandbox: **100% aprovadas sem exceções**.
  - **Paralelismo Estrito de χ200:** inclinação -1.0 em todas as arestas laterais, dimensões W, alturas H e limites de latitude validados em todas as 8 fases.
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
