# Versão atual: cinco casos documentados em DJF

A página usa `documented-cases.js`, `documented-view.js` e `map-regions.js`. Começa em ENOS neutro/fase 4, seguido de neutro/fase 3; inclui El Niño/fase 3, La Niña/fase 8 e El Niño/fase 1. Resultados ausentes são `null`, nunca anomalia zero. Chuva média e frequência de extremos são camadas separadas. A seleção não esgota a literatura.

Foram retirados o gerador combinatório, a régua de probabilidades, percentuais sintéticos, amplitude contínua, ciclo automático, campos numéricos artificiais de TSM e inferências automáticas de intensidade/posição dos jatos. O PSA é descrito somente nos casos selecionados com suporte bibliográfico, sem coordenadas de centros inventadas. O glossário anterior foi preservado integralmente. `enso-science.js` é legado não carregado pela página.

Fonte principal: Fernandes e Alice M. Grimm (2023), https://doi.org/10.1175/JCLI-D-22-0781.1, discussão e figura 12. As magnitudes e máscaras de significância não foram transcritas; ícones apenas localizam o resultado regional. Teste: `node verify-model.cjs`.

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
