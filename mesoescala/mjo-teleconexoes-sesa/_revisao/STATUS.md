# STATUS

## Estado
- Branch: `revisao`, criado do `main`.
- Data e hora: 2026-09-27T21:52:00-03:00.
- Versão de cache: `?v=20260927i`.
- Revisão do lote concluída e validada (χ200 Deemer com losangos e zero elipses, Alvarez sem TSM ENOS, desamontoamento AS, narrativa SALLJ e testes 100% aprovados).
- Arquivos modificados:
  - `documented-view.js`:
    - χ200 substituído pela tabela única de Deemer (NOAA/ESRL PSD), renderizado com losangos (`polygon`, 4 vértices: outer ±60°×±20°, mid ±40°×±14°, core ±22°×±8° só contorno) e zero elipses; legenda creditando G. Deemer.
    - Evento Alvarez suprime elipse de TSM do ENOS e exibe "composição de todos os anos" no mapa e no card de TSM.
    - Desamontoamento da América do Sul: rótulos do SALLJ sobre o Oceano Pacífico sem sobrepor a cordilheira ou cortar na borda; convecção fonte não colide com o jato; rótulos de C e A ajustados para não sobrepor nuvens ou círculos do PSA; textos do mapa contidos nas margens.
    - Narrativa do SALLJ para ZCAS ajustada exatamente para: "curva para leste/nordeste, em direção ao setor ZCAS (Nogués-Paegle & Mo 1997)".
  - `index.html`: cache-buster atualizado para `?v=20260927i`.
  - `verify-model.cjs`: testes estendidos cobrindo a tabela de Deemer, losangos de χ200, zero elipses em χ200, supressão de TSM em Alvarez e narrativa do SALLJ.
  - `_revisao/STATUS.md` e `_revisao/painel.html`: documentação e capturas atualizadas.

## Em andamento
- Revisão aprovada nos testes automatizados e visuais. Pronto para merge.

## Feito (nesta revisão)
1. **χ200 Unificado (G. Deemer) e Losangos (Zero Elipses):**
   - Tabela única de centros `MJO_CHI_CENTERS` sem separação por estação (Deemer, NOAA/ESRL PSD):
     - Fase 1: div 10°E, 2°N | conv 145°E, 1°N
     - Fase 2: div 65°E, -1°N | conv 170°W, 0°N
     - Fase 3: div 75°E, -1°N | conv 110°W, -4°N
     - Fase 4: div 115°E, 2°N | conv 60°W, 2°N
     - Fase 5: div 135°E, 1°N | conv 70°W, 0°N
     - Fase 6: div 130°W, -3°N | conv 55°E, -3°N
     - Fase 7: div 115°W, -3°N | conv 80°E, -1°N
     - Fase 8: div 65°W, -3°N | conv 135°E, 0°N
   - Geometria em losangos de 4 vértices: externo ±60°×±20°, médio ±40°×±14°, núcleo ±22°×±8° (núcleo desenhado exclusivamente com contorno stroke, sem preenchimento).
   - Eliminação de qualquer tag `<ellipse>` no χ200.
   - Crédito inserido: "G. Deemer (compostos NOAA/ESRL PSD, julho–outubro, padrão didático único)".

2. **Evento Alvarez (Composição de todos os anos):**
   - No mapa global, a elipse de TSM do ENOS não é desenhada quando um evento de Alvarez está ativo, sendo substituída pelo rótulo descritivo "Composição de todos os anos (sem separação por ENOS)".
   - No card lateral de TSM, a classe warm/cold é removida e o texto passa a indicar a composição média.

3. **Desamontoamento da América do Sul (visão regional e global):**
   - Rótulos e legenda do SALLJ posicionados a oeste dos Andes sobre o Oceano Pacífico, com `text-anchor: start` na visão regional evitando corte na margem esquerda.
   - Destaque "← fonte: convecção subtropical" deslocado para não sobrepor o rótulo do Jato Subtropical.
   - Rótulos C e A posicionados estrategicamente para evitar colisão com a nuvem convectiva ou com os círculos da EOF1 do PSA.
   - Textos do mapa com limitação estrita para não cortar na borda direita.

4. **Narrativa do SALLJ para a ZCAS:**
   - Ajustada para a redação exata: "curva para leste/nordeste, em direção ao setor ZCAS (Nogués-Paegle & Mo 1997)".

## Fontes
- Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics 46, 245–262 (texto completo, NOAA).
- Fernandes & Grimm (2023), Journal of Climate 36, 7715–7738.
- Wheeler & Hendon (2004), Monthly Weather Review 132, 1917–1932 (Figs. 7 e 8).
- Deemer, G., NOAA/ESRL PSD (compostos de potencial de velocidade 200 hPa).
- Nogués-Paegle & Mo (1997), Journal of the Atmospheric Sciences 54, 966–982 (alternância SALLJ ZCAS × Prata).
- Cavalcanti (2018), Palestra Santa Maria (INPE): slide 12 (EOF1 de v200).

## Validações
- **Teste Automatizado de Regressão (`node verify-model.cjs`):**
  - **1536 configurações** testadas no sandbox: **100% aprovadas sem exceções**.
  - **Pureza do código:** 0 ocorrências de `metric` em todos os arquivos de produção.
  - **χ200 Deemer:** tabela única validada, zero elipses no χ200, 6+ polígonos losangulares conferidos.
  - **Alvarez TSM:** elipse suprimida e faixa neutra conferida.
  - **SALLJ:** traçados e nova narrativa conferidos.
- **Capturas visuais geradas via Chrome DevTools Protocol (`_revisao/capturas/`):**
  - `DJF_3_4_prata.png`: Bacia do Prata, sem TSM ENOS, SALLJ sobre o Pacífico sem corte, C desamontoado da nuvem e PSA.
  - `DJF_lanina_8_zcas.png`: ZCAS, SALLJ curvando para leste/nordeste, fonte desamontoada do jato subtropical.
  - `chi_fase1.png`: Potencial de velocidade 200 hPa fase 1 com losangos de Deemer e crédito didático.
  - `chi_fase4.png`: Potencial de velocidade 200 hPa fase 4 com losangos de Deemer.
  - `chi_fase8.png`: Potencial de velocidade 200 hPa fase 8 com losangos de Deemer.

## Decisões registradas
- 27/09/2026: Tabela única de χ200 de G. Deemer adotada sem divisão sazonal, renderizada em losangos (zero elipses).
- 27/09/2026: TSM de ENOS suprimida nos eventos de Alvarez (todos os anos).
- 27/09/2026: Desamontoamento completo dos elementos cartográficos e rótulos da América do Sul.
- 27/09/2026: Narrativa do SALLJ ZCAS limpa sem menção redundante a convergência no Sudeste.

