# MJO, Estações, ENOS & Teleconexões com o SESA — Demonstração Didática

A aplicação combina exploração interativa completa de escalas planetárias com rigor científico documental, utilizando `documented-cases.js`, `documented-view.js`, `map-regions.js` e a cartografia global contínua Natural Earth 1:110m (`world-land.js`).

### Arquitetura & Regra Central de Validade Científica:
> **Todas as 96 combinações (4 estações × 3 estados de ENOS × 8 fases da MJO) são selecionáveis na interface, mas somente os resultados com suporte bibliográfico verificado recebem destaques gráficos.**

Quando uma combinação selecionada não possui evidência cadastrada na base de dados curada:
- O mapa global permanece plenamente funcional com a cartografia física, oceanos, a referência esquemática da fase da MJO e a TSM correspondente.
- **ZCAS e SESA permanecem permanentemente delimitadas e identificadas** como domínios geográficos de referência.
- A **base visual permanente** (Jato Subtropical com espessura modulada pelo ENOS e latitude pela estação, SALLJ em seta única, TSM equatorial qualitativa) permanece preservada em todas as seleções.
- Não são geradas anomalias, extremos ou respostas de circulação inventadas.
- A ausência de resultado é indicada discretamente como *"Sem resultado específico verificado nesta síntese"*, sem equivaler a efeito nulo ou ausência de influência física na natureza.
- A interface **nunca** troca automaticamente a fase, o ENOS, a estação, a variável ou o enquadramento escolhidos pelo usuário.

### Principais Características da Interface:
1. **Controles Completos:**
   - **4 Estações:** DJF (Verão), MAM (Outono), JJA (Inverno) e SON (Primavera).
   - **3 Estados de ENOS:** El Niño, Neutro e La Niña.
   - **8 Fases da MJO:** 1 a 8, cobrindo o ciclo completo ao longo do equador.
   - **Atalhos Rápidos:** Botões para seleção imediata dos casos com destaque documentado na literatura em DJF.
2. **Visão Global como Padrão:** Mapa amplo (1200×560 px) centrado no Oceano Pacífico, ilustrando o arco completo de teleconexões Índico–Pacífico–América do Sul. Alternador disponível para visão regional da América do Sul (640×520 px).
3. **Prioridade Visual ao Mapa:** O mapa ocupa a posição central superior; análises conceituais aprofundadas foram organizadas em painéis recolhíveis (`<details>`).
4. **Separação Rigorosa de Variáveis:** Camadas independentes para *Extremos de chuva* e *Chuva média*. Extremos de precipitação não são inferidos como risco de granizo ou tornados.
5. **Sem Parâmetros ou Cálculos Fictícios:** Sem geradores combinatórios livres, sem probabilidades sintéticas e sem percentuais artificiais.
6. **TSM Equatorial Qualitativa:** Representação do sinal no Pacífico equatorial central/leste (El Niño quente, La Niña fria e Neutro próximo à média), claramente identificada como qualitativa.
7. **MJO no Contexto Global:** Alternância mutuamente exclusiva para cada uma das 8 fases entre *Convecção NOAA* (dipolos tropicais de convecção/precipitação ativa em verde e suprimida em marrom baseados no NOAA CPC / Wheeler & Hendon), *Trilha 1–8* (marcações nominais ao longo do equador com fase ativa destacada e números clicáveis diretamente no mapa) ou *Nenhuma* (sem exibição tropical da MJO). Ao ligar uma visualização, a outra é desligada automaticamente.
8. **Teleconexão PSA Não Permanente:** Corredor conceitual de propagação de ondas de Rossby (defasagem de 7 a 12 dias) traçado exclusivamente nas combinações com mecanismo verificado na literatura, sem centros A/B fictícios.
9. **Jatos (Base Visual Permanente):** Jato Subtropical (~200 hPa) em traçado único com espessura representando a modulação pelo ENOS e posição norte–sul acompanhando a estação; SALLJ (~850 hPa) em seta única a leste dos Andes em direção ao SESA. Sem jato polar e sem equações arbitrárias de velocidade ou latitude.
10. **Rótulo Geográfico Rigoroso:** Mantido estritamente "SESA" no topo da região, sem "Bacia do Prata" no rótulo e sem "Andes (Bloqueio Orográfico)" no mapa.
11. **Legenda Inicialmente Oculta:** Exibida e recolhida por botão de alternância acessível com ARIA.
12. **Narração Completa & Acessibilidade:** Toda combinação selecionável possui texto explicativo gerado na tela e síntese de voz disponível (com controles de narrar, pausar/retomar, parar e silenciar). Ao alterar controles com a fala ativa, falas anteriores são canceladas e a nova combinação é narrada automaticamente. O glossário foi removido desta demonstração conforme instrução.

### Fontes Principais & Estudos Complementares:
- **Fernandes, L. A., & Grimm, A. M. (2023):** *ENSO Modulation of Global MJO and Its Impacts on South America*, Journal of Climate, 36(22), 7715–7738, [https://doi.org/10.1175/JCLI-D-22-0781.1](https://doi.org/10.1175/JCLI-D-22-0781.1).
- **Jones, C., Mu, M., Carvalho, L. M. V., & Ding, R. (2023):** *Objective identification and classification of the South American low-level jet*, npj Climate and Atmospheric Science, 6, 201, [https://doi.org/10.1038/s41612-023-00501-4](https://doi.org/10.1038/s41612-023-00501-4).
- **Roy, P., Arblaster, J. M., Wheeler, M. C., & Lim, E.-P. (2025):** *Modulation of Southern Hemisphere extratropical teleconnections by the Madden–Julian Oscillation and ENSO*, Geophysical Research Letters, 52, e2024GL113395, [https://doi.org/10.1029/2024GL113395](https://doi.org/10.1029/2024GL113395).
- **Wheeler, M. C., & Hendon, H. H. (2004):** *An All-Season Real-Time Multivariate MJO Index*, Mon. Wea. Rev., [https://doi.org/10.1175/1520-0493(2004)132<1917:AARMMI>2.0.CO;2](https://doi.org/10.1175/1520-0493(2004)132<1917:AARMMI>2.0.CO;2).

### Matriz Comparativa da Auditoria Científica (Decisões & Alterações):

| Afirmação Anterior | Fonte Examinada | Decisão | Alteração Realizada |
| :--- | :--- | :--- | :--- |
| **Fonte de La Niña 7 no Pacífico Oeste (160°E)** | Fernandes & Grimm (2023), Fig. 9; Roy et al. (2025) | Corrigir localização geográfica da convecção-fonte | A convecção-fonte anômala foi redefinida para a porção central-leste do Pacífico Sul subtropical (20°S–35°S, 140°W–100°W), distinguindo-a do envelope equatorial da MJO no Pacífico oeste. |
| **Janelas de defasagem artificiais (+5 d, +7 d, 7–12 d fixos)** | Fernandes & Grimm (2023); Roy et al. (2025) | Remover defasagens numéricas fixas universais | Removidas tags de defasagem fixa em dias de todos os casos em `documented-cases.js`. O guia PSA foi explicitado como esquema conceitual de propagação de ondas de Rossby, sem atraso pontual universal. |
| **Declínio homogêneo da ZCAS em La Niña 1** | Fernandes & Grimm (2023), Figs. 9 e 12 | Detalhar estrutura espacial da evolução física | Esclarecida a migração meridional do sinal: anomalias positivas deslocam-se para a borda sul da ZCAS (São Paulo, sul de MG e oceano adjacente), enquanto o interior enfraquece. |
| **ZCAS e CESA unificados sem distinção em Neutro 8** | Fernandes & Grimm (2023), Seção 5 e Fig. 12 | Diferenciar limites regionais subcontinentais | Separada a resposta de extremos concentrada no CESA (ao norte de 15°S) da banda principal da ZCAS mais ao sul. |
| **Lacunas na sequência 7 → 8 → 1 em El Niño e Neutro** | Fernandes & Grimm (2023); Roy et al. (2025) | Completar sequência física explícita | Adicionados registros formais para `DJF-el-nino-7` e `DJF-neutro-7` (com resultados de chuva nulos e diagnósticos de convecção/circulação documentados). |
| **Aceleração mecânica arbitrária do SALLJ nas fases 3–4** | Jones et al. (2023); Fernandes & Grimm (2023) | Fundamentar tipos de jato e dinâmica de circulação | Substituída a menção mecânica simplista pela tipologia objetiva de Jatos de Baixos Níveis (modo Central LLJ) e pelo cavado anômalo em altitude no Atlântico Sudoeste. |
| **Botão "Convecção NOAA" com conotação instrumental direta** | Wheeler & Hendon (2004); NOAA CPC | Adequar nomenclatura para refletir esquema conceitual | Renomeado o controle para "Convecção (esquema RMM)" e documentado na legenda que se trata de compostos conceituais didáticos baseados em Wheeler & Hendon (2004). |
| **Jato Subtropical como medida instrumental pontual** | Roy et al. (2025); Jones et al. (2023) | Declarar traçado didático qualitativo de referência | Jato Subtropical (~200 hPa) e anomalias de TSM declarados como referência qualitativa conceitual (modulação de guia de ondas por ENOS/estação), sem atribuição de velocidades pontuais arbitrárias. |
| **Afirmação de "Voz verificada" em ambiente Node.js** | Padrões de teste e CI (mocks DOM/Web Speech API) | Remover declaração indevida de teste físico de áudio | Script `verify-model.cjs` ajustado para validar a integridade estrutural das 96 combinações e geração do texto acessível, sem alegar reprodução acústica em ambiente headless. |
| **Troca de controles com narração pausada tocando áudio** | W3C SpeechSynthesis & UX de acessibilidade | Respeitar estado `isNarrationPaused` | Ajustada a máquina de estados em `documented-view.js`: ao alternar estação, ENOS ou fase enquanto pausado, o texto acessível na tela é atualizado sem reiniciar a reprodução em voz alta. |

### Sequência Física MJO 7 → 8 → 1 e Comparação 3–4 (DJF):
1. **La Niña:** A convecção-fonte subtropical organiza-se no Pacífico Sul central-leste (20°S–35°S, 140°W–100°W) na fase 7 (precursora) e atinge o pico na fase 8; o trem de ondas PSA impõe anomalia anticiclônica no Atlântico subtropical e produz **máximo de anomalias de chuva média na ZCAS na fase 8**. Na fase 1, a resposta na ZCAS não se dissipa repentinamente: desloca-se para a borda sul (SP, sul de MG e oceano adjacente), enquanto os setores central e norte enfraquecem.
2. **El Niño:** A piscina quente deslocada para leste altera o estado básico e o guia de ondas do Jato Subtropical (Roy et al. 2025); a convecção-fonte subtropical ocorre **deslocada para leste nas fases 8–1**. Com a defasagem dinâmica de propagação de ondas, a **resposta destacada na ZCAS e o maior aumento de extremos no CESA (ao norte de 15°S) manifestam-se na fase 1**. Em contrapartida, na fase 3, a forçante no Índico tropical interage construtivamente com o El Niño para gerar o maior aumento de extremos no SESA.
3. **ENOS Neutro:** Composições mostram aumento de chuva na ZCAS e extremos no CESA na fase 8, com declínio na fase 1. Para o SESA, a forçante no Índico e Continente Marítimo nas fases 3–4 produz o **maior aumento da frequência de extremos no SESA na fase 4** (sendo a fase 3 precursora), associado ao transporte por SALLJ do tipo Central (Jones et al. 2023) e cavado no Atlântico Sudoeste.
4. **Distinção de Variáveis e Escalas:** Convecção-fonte, circulação/teleconexão (PSA), chuva média e frequência de extremos são representadas como grandezas distintas. Extremos de precipitação não autorizam inferência de tempo severo (tornados ou granizo). A ausência de resultado documentado em outras combinações é indicada como ausência de registro verificado nesta síntese, nunca como efeito físico nulo.

- **Teste de Verificação Automatizado:** `node verify-model.cjs` (100% aprovado para as 96 combinações básicas, rastreabilidade e integridade estrutural).

---

## Histórico da implementação anterior (não descreve a versão atual)

# 📘 Documentação Técnica & Especificação Física: MJO, Teleconexões, Jatos e Chuvas no SESA

> **Documento de Especificação de Domínio, Rigor Científico e Arquitetura**  
> *Destinado a pesquisadores, meteorologistas, desenvolvedores e modelos de linguagem (LLMs) para replicação, extensão e criação de visualizações interativas 2D/3D/WebGL de alto impacto.*

---

## 1. 🎯 Visão Geral e Propósito Físico

O objetivo central desta demonstração interativa é ilustrar didática e quantitativamente como fenômenos de **baixa frequência** (escala planetária, intrassazonal e interanual) modulam o ambiente de mesoescala para a gênese de tempestades severas e **Sistemas Convectivos de Mesoescala (SCMs; os complexos, CCMs/MCCs, são um subconjunto)** no **SESA** (*Southeastern South America*: Sul do Brasil, Uruguai, Paraguai e Nordeste da Argentina).

Como sintetizado no livro de referência de Mesoescala:
> *"A mesoescala decide se a tempestade ocorre. Estas duas escalas [MJO e ENOS] decidem com que frequência o ambiente que a permite aparece. Nenhum dos dois produz convecção; ambos deslocam o estado básico sobre o qual a convecção se organiza."*

O principal elo dinâmico e termodinâmico de condicionamento ambiental entre a grande escala planetária e a mesoescala na América do Sul é o **Jato de Baixos Níveis da América do Sul (SALLJ)**, interagindo em altitude com o **Jato Subtropical (200 hPa)** e o **Jato Polar (300 hPa)**. Esses mecanismos não disparam convecção de forma determinística ou automática; eles atuam como condicionantes que preparam o perfil termodinâmico (umidade e instabilidade) e o cisalhamento vertical do vento.

---

## 2. 🔬 Fundamentação Física e Dinâmica Rigorosa

### 2.1 Os Cinco Mecanismos Físicos do SALLJ
O Jato de Baixos Níveis da América do Sul não é uma simples corrente de vento, mas o resultado convergente de cinco processos físicos acoplados:

1. **Bloqueio Orográfico ($Fr < 1$)**: Os ventos alísios tropicais de leste encontram a barreira escarpada da Cordilheira dos Andes (~4000 m de altitude média). O escoamento apresenta baixo número de Froude:
   $$Fr = \frac{U}{N h_m} < 1$$
   onde $U$ é a velocidade transversal, $N$ a frequência de Brunt-Väisälä e $h_m$ a altura da montanha. O ar estratificado não possui energia cinética para cavalgar os Andes e sofre deflexão e ajuste geostrófico para o sul.
2. **Canalização Mecânica**: O relevo atua como uma calha topográfica entre os Andes a oeste e o Planalto Brasileiro a leste, guiando o escoamento meridional e concentrando o núcleo do jato entre 1 km e 1,5 km de altitude (~850 hPa).
3. **Gradiente de Pressão Sinótico**: O contraste barométrico zonal entre a crista da Alta Subtropical do Atlântico Sul (ASAS) sobre o oceano e a Baixa Térmica do Chaco / Baixa do Noroeste Argentino (BNOA/NAL) acelera o vento pelo equilíbrio geostrófico.
4. **Ciclo Diurno da Camada Limite (Oscilação inercial de Blackadar)**: Durante o dia, a turbulência e o atrito com a superfície mantêm o vento subgeostrófico. Com o desacoplamento térmico ao pôr do sol, diminui a mistura turbulenta na camada residual e o escoamento sofre uma oscilação inercial livre em torno do vento geostrófico sobre terreno inclinado, podendo atingir velocidades supergeostróficas; horário e intensidade variam. O aquecimento diferencial do relevo também contribui.
5. **Forçantes Sinóticas e Baroclínicas**: Cavados baroclínicos e aproximação de sistemas frontais em latitudes médias intensificam o gradiente barométrico e a advecção quente à frente da frente fria, acelerando o jato.

O parâmetro meteorológico crítico não é apenas o vento pontual, mas o **Fluxo Integrado de Umidade na Vertical ($\vec{Q}$)**:
$$\vec{Q} = \frac{1}{g} \int_{p_t}^{p_s} q \, \vec{v} \, dp$$
* A **convergência de umidade** ($\nabla \cdot \vec{Q} < 0$) na saída do jato descarrega vapor e instabilidade condicional no SESA, condicionando o ambiente para convecção severa.

---

### 2.2 O Dipolo ZCAS vs Bacia do Prata (SESA) e Ciclo Sazonal
O SALLJ apresenta dois modos principais de escoamento e entrega de umidade:
1. **Regime SESA / Bacia do Prata**: O jato permanece confinado à encosta andina até latitudes superiores a 25°S–30°S (Paraguai, Argentina, Rio Grande do Sul e Uruguai), transportando vapor amazônico para alimentar SCMs no SESA.
2. **Regime ZCAS Ativa**: O jato desprende-se precocemente da borda andina (~17°S–20°S) e curva-se para sudeste, canalizando umidade sobre o Sudeste do Brasil (SP, MG, RJ) e oceano adjacente. A Bacia do Prata experimenta subsidência compensatória e redução de chuva.
* **Comportamento Sazonal da ZCAS**:
  * **Verão Austral (DJF)**: Monção sul-americana no ápice; a ZCAS é frequente e estabelece o clássico dipolo com o SESA.
  * **Outono Austral (MAM)**: Transição sazonal com desativação progressiva da monção. Episódios de ZCAS ainda ocorrem (com menor frequência climatológica do que no verão), não devendo ser representada como ausente ou impossível.
  * **Inverno Austral (JJA)**: Estação seca no Brasil Central; a ZCAS encontra-se climatologicamente inativa, predominando o controle frontal e baroclínico de latitudes médias.
  * **Primavera Austral (SON)**: Transição para a estação chuvosa com início da reorganização da monção e da ZCAS.

---

### 2.3 Acoplamento Vertical com Jatos de Altitude (200 hPa e 300 hPa)
1. **Jato Subtropical (STJ - 200 hPa / ~12 km)**:
   * Localiza-se tipicamente entre 25°S e 35°S.
   * Atua como **guia de ondas planetárias de Rossby** (concentrando alto número de onda estacionário $K_s$).
   * A região de **entrada equatorial** (*equatorial entrance*) de um *jet streak* impõe divergência idadeostrófica em altitude ($\nabla \cdot \vec{v}_\chi > 0$). Quando associada à convergência de baixos níveis do SALLJ, favorece sustentação vertical dinâmica para a organização de SCMs, dependente do ambiente termodinâmico pré-existente.
2. **Jato Polar (PFJ - 300 hPa / ~9 km)**:
   * Localizado entre 45°S e 60°S no Hemisfério Sul.
   * Modula o deslocamento de cavados baroclínicos profundos, frentes frias antárticas/patagônicas e irrupções de ar polar (*Pampero* e ciclogêneses no Atlântico Sudoeste).

---

### 2.4 Teoria de Ondas de Rossby & Teleconexão Transpacífica PSA
A divergência tropical anômala associada ao envelope convectivo da MJO gera vorticidade na alta troposfera através da **Fonte de Ondas de Rossby** ($S$), formalizada por Sardeshmukh & Hoskins (1988):
$$S = -\nabla \cdot (\vec{v}_\chi \zeta_a) = -\zeta_a \nabla \cdot \vec{v}_\chi - \vec{v}_\chi \cdot \nabla \zeta_a$$
onde $\vec{v}_\chi$ é a velocidade divergente e $\zeta_a = f + \zeta$ é a vorticidade absoluta.
* **Sinal de $\zeta_a$ no Hemisfério Sul**: Como o parâmetro de Coriolis $f = 2\Omega\sin\phi$ é negativo no Hemisfério Sul, $\zeta_a$ é predominantemente negativa na alta troposfera subtropical média (embora não seja universalmente negativa em todos os pontos, podendo variar perto do equador ou sob forte vorticidade relativa anticiclônica). Assim, a divergência tropical ($\nabla \cdot \vec{v}_\chi > 0$) atua tipicamente como fonte de anomalia anticiclônica em altos níveis.
* **Condições de Validade de $K_s$**: As ondas de Rossby estacionárias só se propagam em regiões de escoamento médio zonal de oeste ($\bar{u} > 0$), com número de onda estacionário total:
  $$K_s = \left(\frac{\beta_M}{\bar{u}}\right)^{1/2}, \quad \beta_M = \beta - \frac{\partial^2 \bar{u}}{\partial y^2}$$
  Linhas de vento de leste ($\bar{u} \le 0$) funcionam como barreiras críticas (*critical lines*) à propagação meridional.
* **Defasagem Temporal e Trajetória**: O trem de ondas PSA (*Pacific–South American*) dispersa energia do Pacífico Tropical até a América do Sul. Com velocidade de grupo típica $|c_g| \sim 15\text{--}25\text{ m/s}$, a perturbação percorre a trajetória em um **tempo de trânsito ilustrativo** estimado em:
  $$\tau \approx 7 \text{ a } 12\text{ dias (escala de referência, não um atraso rígido ou fixo)}$$

---

### 2.5 Relações Fase–Estação–Região da MJO (Alvarez et al., 2016; Grimm, 2019)
Com base na análise de anomalias subsazonais (e.g., Alvarez et al., 2016; NOAA Repository 14494):
* **Verão Austral (DJF)**:
  * **Fases 3 e 4 (Oceano Índico / Continente Marítimo)**: Favorecem cavado anômalo no Atlântico Sudoeste e convergência do SALLJ para a Bacia do Prata $\implies$ **Favorecimento de chuva no SESA** (anomalia esquemática positiva).
  * **Fases 8 e 1 (Hemisfério Ocidental / África)**: Favorecem convergência de umidade sobre o Sudeste do Brasil $\implies$ **Favorecimento da ZCAS** e sinal de supressão no SESA.
* **Primavera Austral (SON)**:
  * **Fases 7 e 8**: Favorecimento de convecção e divergência em altitude na região da ZCAS via propagação de energia de Rossby; fases 3–4 favorecem o SESA.
* **Outono Austral (MAM)**:
  * Transição sazonal: a resposta das anomalias apresenta amplitude climatológica reduzida em comparação ao verão. A ZCAS está em declínio, mas com episódios possíveis.
* **Inverno Austral (JJA)**:
  * A ZCAS está climatologicamente inativa no Brasil Central.
  * *Correção Geográfica Importante*: O sinal de redução de precipitação nas fases 4 e 5 documentado na literatura para o semestre de junho a novembro refere-se à **costa da região da ZCAS (Sudeste do Brasil)**, e **não automaticamente ao SESA**. No SESA durante o inverno, o sinal intrassazonal possui menor magnitude e maior incerteza, sendo condicionado primariamente pela passagem de cavados baroclínicos extratropicais.

---

### 2.6 Amplitude da MJO ($A$): Continuidade e Baixa Confiança
* No espaço de fase Wheeler-Hendon $(RMM_1, RMM_2)$, com $A = \sqrt{RMM_1^2 + RMM_2^2}$:
  * Para $A < 1.0$, o sinal intrassazonal situa-se no interior do círculo de ruído; a literatura de previsão por pêntadas estabelece **baixa confiança estatística nas composições de fase**.
  * **Escolha Didática de Continuidade**: Para eliminar saltos artificiais de valor (onde anomalias saltavam ao cruzar $A = 1.0$), a demonstração adota um escalonamento linear estritamente contínuo com $A$ ($mjoSesaAnom = mjoSesaAnomRaw \cdot (A / 1.5)$). O modelo preserva o indicador de baixa confiança para $A < 1.0$, sem supor que a física atmosférica cesse abruptamente.

---

### 2.7 Decomposição de Diferenças Finitas do ENOS ($R = \nu \bar{r}$)
A precipitação acumulada sazonal $R$ (em mm) é o produto entre a frequência de eventos/dias chuvosos $\nu$ e a precipitação média por evento $\bar{r}$ (em mm/evento):
$$R = \nu \cdot \bar{r}$$
Para variações finitas, a formulação exata inclui o termo quadrático não-linear:
$$\frac{\Delta R}{R} = \frac{\Delta \nu}{\nu} + \frac{\Delta \bar{r}}{\bar{r}} + \left(\frac{\Delta \nu}{\nu}\right)\left(\frac{\Delta \bar{r}}{\bar{r}}\right)$$

* **Consistência Numérica Implementada**:
  * El Niño (ilustrativo): $\Delta \nu/\nu = +40\%$, $\Delta \bar{r}/\bar{r} = -10\% \implies \Delta R/R = 0.40 - 0.10 + (0.40)(-0.10) = +26\%$.
  * La Niña (ilustrativo): $\Delta \nu/\nu = -30\%$, $\Delta \bar{r}/\bar{r} = +50\% \implies \Delta R/R = -0.30 + 0.50 + (-0.30)(0.50) = +5\%$.
* **Hipótese de Recarga de CAPE (Autor)**:
  * Proposta didático-física do autor para a Bacia do Prata: durante a La Niña, o recuo do jato para o sul reduz o número de passagens frontais ($\Delta \nu < 0$). Intervalos maiores de radiação solar e transporte de calor sem purga sinótica permitem o acúmulo de energia potencial convectiva disponível (CAPE), de modo que eventos isolados podem apresentar maior volume ou severidade média por episódio ($\Delta \bar{r} > 0$). Essa hipótese distingue severidade convectiva local de acumulado sazonal integrado.

---

### 2.8 A Régua do Logito: Formulação e Contexto de Salio et al. (2007)
Na régua interativa, a probabilidade diária $P$ de desenvolvimento de SCM no SESA é expressa linearmente no logito:
$$\text{logit}(P) = b_0 + b_J \cdot I(\text{SALLJ}) + b_E(\text{ENOS}) + A \cdot b_M(\text{fase}, \text{estação})$$
onde $P = \frac{1}{1 + e^{-\text{logit}(P)}}$.

* **Base Observacional (Salio, Nicolini & Zipser, 2007)**:
  * Artigo: *"Mesoscale Convective Systems over Southeastern South America and Their Relationship with the South American Low-Level Jet"*, Monthly Weather Review (2007).
  * **População e Amostra**: Análise de 4 anos completos (**2000–2003 em todas as estações**) no SESA.
  * **Definição do Evento**: Desenvolvimento de pelo menos um SCM subtropical no dia.
  * **Resultados Observacionais**:
    * Dias sem SALLJ: desenvolvimento em **12% dos dias** $\implies b_0 = \ln(0.12/0.88) \approx -1.99$.
    * Dias com SALLJ: desenvolvimento em **41% dos dias** $\implies \text{logit} = \ln(0.41/0.59) \approx -0.36$.
    * Variação no logito: $b_J = -0.36 - (-1.99) \approx +1.63$.
    * **Razão de Chances (*Odds Ratio*)**: $\text{OR} = \frac{0.41/0.59}{0.12/0.88} \approx 5.1$.
    * *Ressalva Epistemológica*: Esta comparação observacional bivariada não estabelece causalidade direta isolada nem representa um modelo multivariado calibrado, pois dias com SALLJ co-ocorrem frequentemente com cavados baroclínicos sinóticos.
* **Termos Didático-Ilustrativos**:
  * $b_E(\text{ENOS})$: $+0.70$ (El Niño), $0.00$ (Neutro), $-0.40$ (La Niña).
  * $b_M(\text{fase}, \text{estação})$: Coeficientes didáticos tabelados que demonstram como a não-linearidade da transformação logística faz o mesmo incremento render ganhos percentuais diferentes dependendo da posição na curva.
  * **Valores de Referência com Termos Ilustrativos Zerados**:
    * Sem SALLJ ($I = 0$): $P = 1 / (1 + e^{1.99}) \approx 12.0\%$.
    * Com SALLJ ($I = 1$): $P = 1 / (1 + e^{0.36}) \approx 41.1\%$.

---

## 3. 🌿 Preservação Cultural e Glossário de Termos Regionais

A terminologia respeita integralmente as diretrizes do livro (`DIRETRIZES-AUTOR.md`) e o glossário etimológico consolidado (`ferramentas/glossario.json`):

| Termo | Origem / Categoria | Significado Físico, Contexto Cultural & Operacional |
| :--- | :--- | :--- |
| **Toró** | Popular / Tupi (*tororoma*, jorro d'água) | Chuva que desaba como cachoeira; o nome é associado ao tupi *tororoma*, jorro d'água. Em inglês, *cloudburst*. No radar é célula isolada, sem assinatura de rotação, de taxa alta e duração curta. O sentido técnico proposto pelo autor, ainda em avaliação, descreve uma descarga de água e granizo de taxa extrema, com duração da ordem de um minuto e extensão de poucas dezenas de metros. |
| **Pé d'água** | Popular Brasileiro | Chuva forte que chega de repente, próxima do sentido popular de toró. Mesmo teste do toró no radar. |
| **Pampero** | Regional / Quíchua (*pampa*, planície) | Irrupção de ar frio de sudoeste nos Pampas, com queda de temperatura e rajadas. É o vento do pampa, «planície» em quíchua. Vira para sudoeste com queda de temperatura e subida de pressão na mesma hora. |
| **Minuano** | Regional / Povo Minuano (Guenoa) | Vento frio de sul ou sudoeste no Sul do Brasil, em geral pós-frontal. O nome vem dos minuanos, povo indígena das terras de onde o vento sopra. Chega depois da frente, com pressão subindo, céu limpando e temperatura baixa e estável. |
| **Saci** | Popular / Tradição oral brasileira | Nome popular do redemoinho de poeira que gira no campo, associado ao saci-pererê da tradição oral brasileira. O fenômeno se forma junto ao solo aquecido, sem depender de uma nuvem de tempestade; em inglês, *dust devil*. Não tem nuvem-mãe nem eco de radar. |
| **Lestada** | Regional / Serra do Mar | Vento persistente de leste ou sudeste contra a Serra do Mar, com nuvem baixa, garoa e chuva orográfica. Não é frente costeira: dura mais de doze horas sem passagem frontal e sem queda de temperatura. |
| **Sudestada** | Regional / Bacia do Prata | Vento persistente de sudeste no Prata, no Uruguai e na costa do Rio Grande do Sul, com maré meteorológica e ressaca. Não é Lestada: o marégrafo acusa a elevação antes de o vento atingir o pico, e a Lestada não move o nível do mar. |
| **Zonda** | Regional / Andes Centrais | Foehn do oeste argentino, a sotavento dos Andes, com rajadas fortes, umidade muito baixa e risco de incêndio. A sotavento a temperatura sobe enquanto o ponto de orvalho despenca; o sinal está na razão de mistura, não na umidade relativa. |
| **SESA** | Nomenclatura Técnica | Sudeste da América do Sul: o domínio que reúne os Andes, o Chaco, o Paraguai, o norte da Argentina, o Uruguai, o Sul e o Sudeste do Brasil e o Atlântico Sudoeste. |
| **SALLJ** | Nomenclatura Técnica | Jato de baixos níveis da América do Sul. Corrente intensa a leste dos Andes que transporta umidade, calor e cisalhamento para o SESA. Aparece como máximo de vento entre 850 e 700 hPa a leste da cordilheira, com razão de mistura elevada e convergência na saída. |

---

## 4. 💻 Arquitetura de Software e Implementação

* **Arquivo Único Autossuficiente**: `index.html` executável localmente e em navegadores modernos via GitHub Pages.
* **Canvas Georreferenciado 2D**: Projeção cilíndrica equidistante com vetores de relevo dos Andes, caixas delimitadoras e linhas de corrente animadas a 60 FPS.
* **RMM Wheeler-Hendon**: 8 octantes calibrados com detecção por clique em arco e círculo unitário $|RMM| < 1$.
* **Corte Vertical Troposférico**: Eixo de pressão (1000 a 150 hPa) exibindo a relação geométrica do SALLJ (850 hPa) e do Jato Subtropical (200 hPa), com atenuação contínua com a amplitude da MJO.
* **Régua do Logito**: Renderização de escala dupla comparando logito aditivo e probabilidade sigmoide com setas deslizantes dos ingredientes ambientais.
* **Síntese de Voz**: `SpeechSynthesis` em `pt-BR` narrando os diagnósticos qualitativos sem linguagem determinística.


## Revisão de 24/09/2026 — TSM, jatos e comparação de evidências

### O que é observado e o que é ilustrativo

O painel superior distingue a TSM absoluta da anomalia em relação à referência sazonal. Os campos em `enso-science.js` são funções sintéticas, em °C, no domínio 120°E–80°W e 25°S–25°N. Não são dados de satélite, reanálise ou composições observacionais. O neutro usa anomalia zero somente como referência idealizada; anomalias locais são possíveis na natureza. O estado de TSM não muda ao trocar a fase da MJO. A caixa Niño 3.4 é 5°N–5°S, 170°W–120°W.

Não se atribuem deslocamentos latitudinais fixos dos jatos ao ENOS. A representação enfatiza qualitativamente a intensificação do jato subtropical e o transporte do SALLJ na primavera de El Niño, discutidos por Montini et al. Os ganhos gráficos de 1,18 são escolhas de desenho, não aumentos observados de 18%. Nas demais combinações, conservar a referência gráfica significa ausência de magnitude validada nesta síntese, não ausência de resposta física. Frequência, velocidade e transporte integrado de umidade não são intercambiáveis.

O termo de frequência do exercício R = ν·r̄ não é a frequência de dias com SALLJ da tabela observacional. A hipótese de recarga de CAPE permanece como proposta do autor, sem controlar o diagnóstico dos jatos ou a chuva do mapa. Precipitação por evento não equivale a severidade convectiva.

### Matriz de evidências e limites

| Fonte | Escopo | Uso nesta demonstração | Limite de interpretação |
|---|---|---|---|
| NOAA, ENSO FAQ | Pacífico tropical, acoplamento oceano–atmosfera | Sinal e localização geral das anomalias de TSM | Não fornece os campos sintéticos desenhados |
| Montini et al. (2019), DOI 10.1029/2018JD029634 | 1979–2016; SALLJ em Santa Cruz e Mariscal; estações; reanálise | Tabela 1: diferenças de proporção de dias com jato e significância; discussão da primavera de El Niño | Pontos percentuais, não variação relativa de chuva; não extrapolar os dois locais para toda a América do Sul |
| Alvarez et al. (2016), DOI 10.1007/s00382-015-2581-6 | Relação sazonal MJO–chuva; índices RMM e OMI | DJF: SESA 3–4, ZCAS 8–1; SON: ZCAS 7–8; transição MAM | Redução em 4–5 no período junho–novembro perto da costa da ZCAS não define sinal de chuva no SESA |
| Fernandes e Alice M. Grimm (2023), DOI 10.1175/JCLI-D-22-0781.1 | Monção austral, DJF, composições por ENOS | Máximo na região da ZCAS em fase 8 de La Niña e fase 1 de El Niño; interação não linear | Não extrapolar para todas as estações; magnitudes gráficas não foram extraídas do artigo |
| Salio, Nicolini e Zipser (2007), DOI 10.1175/MWR3305.1 | Amostra 2000–2003, todas as estações, SCMs e dias com/sem SALLJ | Frequências de referência 12% e 41% na régua | Associação bivariada, sem interpretação causal ou calibração dos termos MJO/ENOS |

As fontes respondem a perguntas distintas. A mudança da fase de maior resposta após estratificar por ENOS não contradiz automaticamente uma composição geral por MJO. Não foi estabelecida discordância direta entre Grimm e os demais autores nesta revisão. Uma comparação futura deve manter período, região, definição do jato, classificação do ENOS e significância compatíveis.

### Implementação vigente

- `index.html`: interface e modelo didático; `enso-science.js`: TSM, tabela de frequência e painel bibliográfico. Manter ambos juntos.
- Atenuação contínua A/1,5; a geometria do SALLJ converge para uma referência quando A tende a zero.
- MAM admite ZCAS em transição; JJA fica fora do esquema de ZCAS. O sinal MJO no SESA em JJA é zero como ausência de sinal validado nesta síntese, não como conclusão física de efeito nulo.
- A chuva do mapa contém apenas o exemplo intrassazonal; não soma os +26%/+5% do exercício de decomposição. Em DJF, a ênfase das fases 8/1 depende do ENOS; os números permanecem ilustrativos.
- A régua é um exercício separado: logit(P) = b0 + bJ·I(SALLJ) + bE(ENOS) + A·bM(fase, estação). Os termos b0 e bJ usam os logitos exatos de 0,12 e 0,41; bE e bM não são regressão ajustada. Em JJA bM = 0. Esse exercício aditivo não reproduz a interação não linear de Fernandes e Grimm.

### Referências com acesso direto

- https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ensofaq.shtml
- https://doi.org/10.1029/2018JD029634
- https://repository.library.noaa.gov/view/noaa/14494
- https://doi.org/10.1175/JCLI-D-22-0781.1
- https://doi.org/10.1175/MWR3305.1


### Verificação

Executar `node verify-model.cjs`. O teste cobre 864 combinações, continuidade próxima de A=1, referência em A=0, transição MAM, ausência de parametrização SESA/JJA, máximos condicionais em DJF, sinal das anomalias de TSM, marcação de significância e cálculo real da régua para 12% e 41%. Verificações de interface incluem alternância TSM/anomalia, ENOS, estação, fases, amplitude fraca e console do navegador. Valores ilustrativos não equivalem a validação observacional.


## Simplificação gráfica solicitada — 25/09/2026

O mapa principal inicia na visão global e inclui anomalias esquemáticas de TSM equatorial (vermelho positivo, azul negativo). O jato polar foi retirado da interface e da animação. O jato subtropical usa espessuras 9/6/3 px para El Niño/neutro/La Niña, fatores gráficos de velocidade 1,25/1/0,78 e deslocamentos +3/0/−3 graus sobre a referência sazonal. São escolhas didáticas solicitadas, não composições observacionais nem uma relação universal válida em cada estação e longitude. Substituem a representação anterior sem deslocamento e com ganho apenas em SON. O painel de evidências mantém a distinção entre o desenho simplificado e os resultados dos artigos.

### Revisão visual MJO e PSA — 25/09/2026

A camada MJO agora identifica convecção favorecida/suprimida sem magnitudes sintéticas de OLR; a amplitude zero não mantém manchas residuais. O RMM continua sendo a referência de fase (OLR, u850 e u200).

Removidos os centros PSA arbitrários das oito fases e a linha contínua permanente. A camada apresenta dois exemplos qualitativos em DJF com MJO ativa: La Niña/fase 8 e El Niño/fase 1, conforme Fernandes e Grimm (2023), figuras 9–12. A seta indica ligação, não trajetória calculada; A/B são posições ilustrativas do par de circulação, não coordenadas digitalizadas de composições. Nos outros estados a interface informa que a composição não está representada, sem inferir ausência de teleconexão. Não se trata de uma climatologia completa do PSA.

Referências: https://doi.org/10.1175/JCLI-D-22-0781.1 e https://www.bom.gov.au/climate/mjo/about/WH04.pdf.

### Recuperação da visão global

A visualização inicial voltou a ser global, centrada no Pacífico, com alternância para América do Sul e camadas qualitativas MJO/TSM. O mapa ocupa a largura principal; os textos ficam abaixo. A base cartográfica local `world-land.js` é Natural Earth 1:110m (domínio público), obtida de https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson. Os cinco casos e a separação de variáveis foram mantidos; nenhum gerador de probabilidades foi restaurado.
