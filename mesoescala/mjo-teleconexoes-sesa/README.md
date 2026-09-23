# 📘 Documentação Técnica & Especificação Física: MJO, Teleconexões, Jatos e Chuvas no SESA

> **Documento de Especificação de Domínio, Rigor Científico e Arquitetura**  
> *Destinado a pesquisadores, meteorologistas, desenvolvedores e modelos de linguagem (LLMs) para replicação, extensão e criação de visualizações interativas 2D/3D/WebGL de alto impacto.*

---

## 1. 🎯 Visão Geral e Propósito Físico

O objetivo central desta demonstração interativa é ilustrar didática e quantitativamente como fenômenos de **baixa frequência** (escala planetária, intrassazonal e interanual) modulam o ambiente de mesoescala para a gênese de tempestades severas e **Complexos Convectivos de Mesoescala (SCMs / MCCs)** no **SESA** (*Southeastern South America*: Sul do Brasil, Uruguai, Paraguai e Nordeste da Argentina).

Como sintetizado no livro de referência de Mesoescala:
> *"A mesoescala decide se a tempestade ocorre. Estas duas escalas [MJO e ENOS] decidem com que frequência o ambiente que a permite aparece. Nenhum dos dois produz convecção; ambos deslocam o estado básico sobre o qual a convecção se organiza."*

O elo dinâmico e termodinâmico obrigatório de acoplamento vertical entre a grande escala planetária e a mesoescala na América do Sul é o **Jato de Baixos Níveis da América do Sul (SALLJ)**, interagindo em altitude com o **Jato Subtropical (200 hPa)** e o **Jato Polar (300 hPa)**.

---

## 2. 🔬 Fundamentação Física e Dinâmica Rigorosa

### 2.1 Os Cinco Mecanismos Físicos do SALLJ
O Jato de Baixos Níveis da América do Sul não é uma simples corrente de vento, mas o resultado convergente de cinco processos físicos acoplados:

1. **Bloqueio Orográfico ($Fr < 1$)**: Os ventos alísios tropicais de leste encontram a barreira escarpada da Cordilheira dos Andes (~4000 m de altitude média). O escoamento apresenta baixo número de Froude:
   $$Fr = \frac{U}{N h_m} < 1$$
   onde $U$ é a velocidade transversal, $N$ a frequência de Brunt-Väisälä e $h_m$ a altura da montanha. O ar estratificado não possui energia cinética para cavalgar os Andes e sofre deflexão geostrófica para o sul.
2. **Canalização Mecânica**: O relevo atua como uma calha natural que guia o escoamento meridional rente ao flanco leste da cordilheira, concentrando o núcleo do jato entre 1 km e 1,5 km de altitude (~850 hPa).
3. **Gradiente de Pressão Sinótico**: O contraste barométrico zonal entre a crista da Alta Subtropical do Atlântico Sul (ASAS) sobre o oceano e a Baixa Térmica do Chaco / Baixa do Noroeste Argentino (NAL) acelera o vento pelo equilíbrio geostrófico.
4. **Oscilação Diurna da Camada Limite (Mecanismo de Blackadar & Bonner)**: Durante o dia, a turbulência e o atrito com a superfície desaceleram o vento subgeostrófico. Com o desacoplamento térmico ao pôr do sol, cessa o atrito superficial e o vento experimenta uma oscilação inercial livre em torno do vento geostrófico, atingindo velocidade supergeostrófica máxima no final da noite e madrugada (~06:00 UTC).
5. **Forçante Baroclínica Frontal**: A aproximação de cavados baroclínicos ou frentes frias em latitudes médias induz subsidência e ciclogênese a sotavento dos Andes, intensificando o gradiente de pressão e acelerando o SALLJ antes da passagem frontal.

O parâmetro meteorológico crítico não é apenas o vento pontual, mas o **Fluxo Integrado de Umidade na Vertical ($\vec{Q}$)**:
$$\vec{Q} = \frac{1}{g} \int_{p_t}^{p_s} q \, \vec{v} \, dp$$
* A **convergência de umidade** ($\nabla \cdot \vec{Q} < 0$) na saída do jato alimenta diretamente a instabilidade condicional e a convecção profunda no SESA.

---

### 2.2 O Dipolo ZCAS vs Bacia do Prata (SESA)
O SALLJ opera em dois regimes macroclimáticos alternados no verão (DJF):
1. **Regime SESA / Bacia do Prata**: O jato permanece confinado à encosta andina até latitudes superiores a 25°S–30°S (Paraguai, Argentina, Rio Grande do Sul e Uruguai), transportando vapor amazônico e ar quente tropical para alimentar SCMs severos. A ZCAS encontra-se suprimida.
2. **Regime ZCAS Ativa**: O jato desprende-se precocemente da borda andina na Bolívia/Mato Grosso (~17°S–20°S) e curva-se para sudeste, despejando a umidade sobre o Sudeste do Brasil (SP, MG, RJ) e oceano adjacente. A Bacia do Prata experimenta subsidência compensatória e tempo seco.
* **Sazonalidade Importante**: No **inverno (JJA)**, a ZCAS está **inativa** (estação seca no Brasil Central); nesse período, o padrão dipolar de monção cessa e os sistemas frontais e ciclogêneses extratropicais assumem o comando sinótico.

---

### 2.3 Acoplamento Vertical com Jatos de Altitude (200 hPa e 300 hPa)
1. **Jato Subtropical (STJ - 200 hPa / ~12 km)**:
   * Localiza-se tipicamente entre 25°S e 35°S.
   * Atua como **guia de ondas planetárias de Rossby** (número de onda estacionário $K_s$).
   * A região de **entrada equatorial** (*equatorial entrance*) de um *jet streak* impõe forte divergência idadeostrófica em altitude ($\nabla \cdot \vec{v}_\chi > 0$). Quando essa divergência sobrepõe-se à convergência de baixos níveis na saída do SALLJ, estabelece-se o **acoplamento vertical** perfeito: descompressão dinâmica explosiva, quebra de inversão de topo e erupção de SCMs.
2. **Jato Polar (PFJ - 300 hPa / ~9 km)**:
   * Localizado entre 45°S e 60°S no Hemisfério Sul.
   * Conduz frentes frias antárticas/patagônicas, pulsos baroclínicos e ciclogêneses intensas no Atlântico Sudoeste (*vento Pampero*).

---

### 2.4 Teoria de Ondas de Rossby & Teleconexão Transpacífica PSA
A convecção tropical anômala associada à MJO gera divergência na alta troposfera ($\nabla \cdot \vec{v}_\chi > 0$). Em um escoamento divergente que cruza gradientes de vorticidade absoluta, forma-se a **Fonte de Rossby** ($S$), formalizada por Sardeshmukh & Hoskins (1988):
$$S = -\nabla \cdot (\vec{v}_\chi \zeta_a) = -\zeta_a \nabla \cdot \vec{v}_\chi - \vec{v}_\chi \cdot \nabla \zeta_a$$
onde $\vec{v}_\chi$ é a velocidade divergente, $\zeta_a = f + \zeta$ é a vorticidade absoluta ($f < 0$ no Hemisfério Sul).
* O primeiro termo representa a geração por divergência sob vorticidade planetária/relativa; o segundo representa a advecção de vorticidade absoluta pelo vento divergente.
* As ondas de Rossby geradas só se propagam para fora dos trópicos onde o escoamento médio zonal é de oeste ($\bar{u} > 0$). O número de onda estacionário total é:
  $$K_s = \left(\frac{\beta_M}{\bar{u}}\right)^{1/2}, \quad \beta_M = \beta - \frac{\partial^2 \bar{u}}{\partial y^2}$$
* O Jato Subtropical aprisiona essas perturbações, guiando o trem de ondas **PSA (Pacific–South American)** através da Nova Zelândia, Mar de Amundsen e Passagem de Drake até o Atlântico Sudoeste.
* Com velocidade de grupo representativa $|c_g| \approx 20\text{ m/s}$, a perturbação percorre a trajetória de $\approx 1.5 \times 10^4\text{ km}$ em um **tempo de trânsito de retardo** estimado:
  $$\tau = \frac{D}{|c_g|} \approx \frac{1.5 \times 10^4\text{ km}}{20\text{ m/s}} \approx 9\text{ dias (faixa típica de 7 a 12 dias)}$$
  Esse retardo dinâmico fundamenta a previsibilidade subsazonal (S2S).

---

### 2.5 Espaço de Fase Wheeler & Hendon (2004) e Amplitude ($A$)
O espaço RMM polar é composto pelos coeficientes $RMM_1$ e $RMM_2$:
$$A = \sqrt{RMM_1^2 + RMM_2^2}, \quad \theta = \operatorname{atan2}(RMM_2, RMM_1)$$
* A convenção meteorológica divide o plano em 8 octantes de 45°:
  * **Fase 1** ($-157.5^\circ$): Hemisfério Ocidental & África
  * **Fase 2** ($-112.5^\circ$): Oceano Índico Ocidental
  * **Fase 3** ($-67.5^\circ$): Oceano Índico Oriental
  * **Fase 4** ($-22.5^\circ$): Continente Marítimo (Indonésia)
  * **Fase 5** ($+22.5^\circ$): Continente Marítimo / Pacífico Oeste
  * **Fase 6** ($+67.5^\circ$): Pacífico Oeste
  * **Fase 7** ($+112.5^\circ$): Pacífico Central
  * **Fase 8** ($+157.5^\circ$): Pacífico Leste / Hemisfério Ocidental
* **Comportamento da Amplitude ($A$)**:
  * Para $A < 1$, a MJO é considerada fraca. A literatura estabelece que a confiança nas composições de fase é baixa e o sinal tropical é difuso.
  * *Critério Didático da Aplicação*: Quando $A < 1$, as anomalias e projeções de jatos são visualmente atenuadas em proporção direta a $A$, acompanhadas do aviso de sinal fraco, ilustrando ao estudante a transição contínua sem sugerir que os processos atmosféricos desaparecem por completo.
* **Resposta Sazonal**:
  * No **DJF (Verão)**: Fases 2, 3 e 4 favorecem cavado no Atlântico Sudoeste e SALLJ na Bacia do Prata (anomalia positiva no SESA). Fases 7 e 8 ativam a ZCAS e deprimem o SESA.
  * No **JJA (Inverno)**: A ZCAS está ausente. As fases 4 e 5 associam-se a anomalias **negativas** de precipitação no SESA.

---

### 2.6 Modulação pelo ENOS e Decomposição de Diferenças Finitas ($R = \nu \bar{r}$)
A precipitação acumulada sazonal $R$ (em mm) é o produto entre o número de eventos/dias chuvosos $\nu$ (frequência) e a precipitação média por evento $\bar{r}$ (em mm/evento):
$$R = \nu \cdot \bar{r}$$
Para variações finitas, a expansão exata inclui o termo cruzado não-linear:
$$\frac{\Delta R}{R} = \frac{\Delta \nu}{\nu} + \frac{\Delta \bar{r}}{\bar{r}} + \left(\frac{\Delta \nu}{\nu}\right)\left(\frac{\Delta \bar{r}}{\bar{r}}\right)$$

* **Consistência Numérica Didática**:
  * El Niño (ilustrativo): $\Delta \nu/\nu = +40\%$, $\Delta \bar{r}/\bar{r} = -10\% \implies \Delta R/R = 0.40 - 0.10 + (0.40)(-0.10) = +26\%$.
  * La Niña (ilustrativo): $\Delta \nu/\nu = -30\%$, $\Delta \bar{r}/\bar{r} = +50\% \implies \Delta R/R = -0.30 + 0.50 + (-0.30)(0.50) = +5\%$.
* **Hipótese de Recarga de CAPE (Autor)**:
  * Proposta didática e física do autor: durante episódios de La Niña, a redução na frequência de passagens frontais ($\Delta \nu < 0$) permite intervalos mais longos de insolação e advecção de ar tropical úmido sem perturbação, acumulando energia potencial convectiva disponível (CAPE). Quando o gatilho sinótico finalmente atua, a liberação é vigorosa, gerando eventos pontuais mais extremos ($\Delta \bar{r} > 0$).
  * Esta dinâmica é apresentada como **hipótese didática de trabalho**, distinguindo severidade convectiva local de precipitação sazonal total.

---

### 2.7 A Régua do Logito: Formulação e Contexto Observacional de Salio et al. (2007)
A probabilidade $P$ de ocorrência de um SCM compõe-se linearmente no **logito** ($\text{logit} = \ln \frac{P}{1-P}$):
$$\ln\left(\frac{P}{1-P}\right) = a_0 + a_1 x_{\text{SALLJ}} + a_2 x_{\text{ENOS}} + a_3 A \cos(\phi - \phi_0)$$

* **Origem e Calibração dos Coeficientes**:
  * O termo base e o degrau do SALLJ são fundamentados na climatologia observacional de **Salio, Nicolini & Zipser (2007)** para a estação quente (setembro a maio de 2000–2003) no SESA:
    * Frequência diária sem SALLJ: $P = 12\% \implies a_0 = \ln(0.12/0.88) \approx -1.99$.
    * Frequência diária com SALLJ: $P = 41\% \implies \text{logit} = \ln(0.41/0.59) \approx -0.36$.
    * Variação no logito devido ao SALLJ: $\Delta_{\text{SALLJ}} \approx -0.36 - (-1.99) = +1.63$.
    * *Razão de Chances (Odds Ratio)*: $\text{OR} = \exp(1.63) \approx 5.1$. A presença do jato multiplica as chances diárias de convecção por cinco.
  * **Designação Explícita de Parâmetros Didáticos**:
    * Os acréscimos relativos à MJO ($\Delta \text{logit} \approx +0.65$ para Fase 3, etc.) e ao ENOS ($\Delta \text{logit} = +0.75$ em El Niño, $-0.40$ em La Niña) são **parâmetros qualitativos didáticos/ilustrativos** (rotulados com `ilust.`), destinados a demonstrar a não-linearidade da transformação sigmoide $\sigma(z) = \frac{1}{1 + e^{-z}}$, na qual o mesmo incremento gera saltos de probabilidade diferentes dependendo da posição na curva.
    * A demonstração **não emite alertas determinísticos** de desastre ou cheia, restringindo-se a diagnósticos diagnósticos de favorabilidade relativa e anomalias estatísticas qualitativas.

---

## 3. 🌿 Preservação Cultural e Glossário de Termos Regionais

A terminologia respeita integralmente as diretrizes do livro (`DIRETRIZES-AUTOR.md`) e o glossário etimológico consolidado (`ferramentas/glossario.json`):

| Termo | Origem Linguística / Cultural | Significado Físico-Meteorológico |
| :--- | :--- | :--- |
| **Pampero** | Quíchua (*pampa*, planície) | Vento forte, frio e seco de sudoeste que sopra sobre a Patagônia e os pampas após a passagem de uma frente fria polar, provocando queda brusca na temperatura e rajadas violentas. |
| **Minuano** | Povo Indígena Minuano (Guenoa) | Vento outonal e invernal de oeste/sudoeste, frio, seco e cortante, comum nos campos do Rio Grande do Sul e Uruguai sob regime de alta pressão pós-frontal. |
| **Toró** | Tupi (*tororoma*, jorro d'água contínuo) | Temporal violento e repentino com precipitação intensa, associado a nuvens cumulonimbus de mesoescala com forte corrente descendente (*downburst*). |
| **Pé d'água** | Cultura Popular Brasileira | Chuva torrencial desabando em cortina concentrada e opaca, com rápida inundação de várzeas e riachos. |
| **Saci** | Mitologia Indígena Tupi-Guarani / Afro-brasileira | Vórtice de vento térmico em escala micro (*dust devil* ou redemoinho convectivo) que se desenvolve em dias secos de grande instabilidade superficial. |
| **Lestada** | Regionalismo Náutico / Costeiro | Vento persistente e úmido de leste/sudeste, com nevoeiros, chuviscos marítimos e ressaca nas praias do Sul e Sudeste. |
| **Sudestada** | Bacia do Rio da Prata (Argentina/Uruguai) | Vento forte e contínuo de sudeste que represa as águas do Rio da Prata, provocando inundações costeiras em Buenos Aires e costa uruguaia. |
| **Zonda** | Indígena / Andes Centrais | Vento catabático tipo *föhn*, extremamente quente, seco e asfixiante que desce a encosta oriental dos Andes argentinos em direção a Mendoza e San Juan. |
| **SESA** | Nomenclatura Científica Internacional | *Southeastern South America* (Sul do Brasil, Uruguai, leste do Paraguai e Nordeste da Argentina). |
| **SALLJ** | Nomenclatura Científica Internacional | *South American Low-Level Jet* (Jato de Baixos Níveis da América do Sul ao longo dos Andes). |

---

## 4. 💻 Arquitetura de Software e Pilha Tecnológica

A aplicação é implementada em arquivo autossuficiente (`index.html`), projetada para rodar em navegadores modernos sem dependência de servidores ou empacotadores:

* **Canvas 2D Georreferenciado**:
  * Projeção cilíndrica equidistante (Plate Carrée) estendida de $180^\circ\text{W}$ a $180^\circ\text{E}$ e $60^\circ\text{N}$ a $70^\circ\text{S}$.
  * Traçado vetorial dos litorais continentais, barreira orográfica dos Andes sombreada com gradiente, e caixas delimitadoras do SESA e da ZCAS.
* **Motor Dinâmico de Partículas Vetoriais**:
  * Partículas animadas em tempo real com atenuação estocástica de ciclo de vida.
  * Correntes do SALLJ (850 hPa - verde esmeralda), Jato Subtropical (200 hPa - ciano) com número de onda modulado, e Jato Polar (300 hPa - púrpura).
* **Diagrama Polar RMM Wheeler-Hendon**:
  * Renderização interativa de 8 quadrantes com ângulos de centro trigonométricos exatos.
  * Círculo unitário $|RMM| < 1$, seleção angular por clique do usuário e interpolação de trajetória de 45 dias.
* **Corte Vertical Atmosférico Interativo**:
  * Representação em altitude (1000 hPa a 150 hPa) ilustrando o acoplamento termodinâmico entre o SALLJ e a entrada equatorial do *jet streak* subtropical.
* **Régua Dinâmica do Logito**:
  * Eixo duplo comparando o logito aditivo com a probabilidade logística sigmoide calibrada com os dados de Salio et al. (2007) e degraus didáticos.
* **Síntese de Voz Didática**:
  * API nativa `speechSynthesis` (`pt-BR`) narrando o estado sinótico-climático ativo de forma concisa.

---

## 5. 🚀 Diretrizes para Próximas Versões e Visualizações 3D (WebGL / Three.js)

Para equipes ou LLMs encarregadas de desenvolver uma versão 3D fotorrealista de alto impacto:

1. **Globo 3D e Texturização Fotorrealista**:
   * Utilizar Three.js com malha esférica e texturas NASA Blue Marble / Black Marble.
   * Aplicar Displacement/Normal Maps para a elevação escarpada dos Andes e das cordilheiras mundiais.
   * Shader de atmosfera de espalhamento de Rayleigh na borda do limbo da Terra.
2. **Campos de Vento Volumétricos em GPU (Compute Shaders / GPGPU)**:
   * Linhas de corrente renderizadas como tubos 3D iluminados ou fitas translúcidas de partículas.
   * Mostrar claramente a barreira mecânica dos Andes impedindo o escoamento zonal dos alísios e curvando o SALLJ para o sul.
   * Exibir o Jato Subtropical ondulando a 12 km de altitude e o Jato Polar a 9 km.
3. **Envelope Convectivo OLR e Célula de Walker**:
   * Convecção tropical da MJO representada por volumes de nuvens em shader volumétrico ou *billboards* com pulso de divergência no topo e subsidência nas fases secas.
4. **Trem de Ondas PSA em Arcos Geodésicos**:
   * Perturbações de geopotencial visualizadas como relevo ondulado na superfície de 200 hPa propagando-se em arco de grande círculo do Pacífico Sul à América do Sul.
5. **Câmeras Cinematográficas**:
   * *Preset Panorâmico Global*: Órbita espacial com visão da propagação da MJO no Índico/Pacífico.
   * *Preset Foco nos Andes & Bacia do Prata*: Perspectiva aérea oblíqua a partir da Amazônia, olhando para o sul ao longo dos Andes, destacando o fluxo do SALLJ desaguando no Sul do Brasil.
