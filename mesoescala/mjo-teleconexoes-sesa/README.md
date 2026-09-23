# 📘 Documentação Técnica & Especificação Física: MJO, Teleconexões, Jatos e Chuvas no SESA

> **Documento de Especificação de Domínio e Arquitetura**  
> *Destinado a desenvolvedores, meteorologistas e modelos de linguagem (LLMs) para replicação, extensão e criação de visualizações interativas 3D/WebGL de alto impacto.*

---

## 1. 🎯 Visão Geral e Propósito Físico

O objetivo central desta aplicação é demonstrar interativamente como fenômenos de **baixa frequência** (escala planetária e intrassazonal/interanual) modulam a ocorrência de tempestades severas e **Complexos Convectivos de Mesoescala (SCMs)** no **SESA** (*Southeastern South America*: Sul do Brasil, Uruguai, Paraguai e Norte da Argentina).

Como sintetizado no livro de referência:
> *"A mesoescala decide se a tempestade ocorre. Estas duas escalas [MJO e ENOS] decidem com que frequência o ambiente que a permite aparece. Nenhum dos dois produz convecção; ambos deslocam o estado básico sobre o qual a convecção se organiza."*

O elo físico obrigatório de transmissão entre a escala planetária e a mesoescala é o **Jato de Baixos Níveis da América do Sul (SALLJ)**, acoplado em altitude com o **Jato Subtropical (200 hPa)** e interagindo com o **Jato Polar (300 hPa)**.

---

## 2. 🌊 Os Componentes Físicos e Mecanismos Dinâmicos

### 2.1 O SALLJ como Jato de Barreira e Vetor de Umidade
O SALLJ é gerado pelo ajuste geostrófico contra a Cordilheira dos Andes: os ventos alísios de leste encontram a barreira orográfica, não possuem energia cinética para transpô-la (número de Froude $Fr < 1$) e são defletidos para o sul, formando uma corrente estreita com núcleo entre 1 km e 1,5 km de altitude (~850 hPa).

O parâmetro meteorológico crítico não é apenas a velocidade do vento, mas o **Fluxo Integrado de Umidade na Vertical ($\vec{Q}$)**:
$$\vec{Q} = \frac{1}{g} \int_{p_t}^{p_s} q \, \vec{v} \, dp$$
* A **convergência de $\vec{Q}$** ($\nabla \cdot \vec{Q} < 0$) na região de saída do jato é a fonte termodinâmica primária de vapor e instabilidade que alimenta os maiores SCMs do planeta.

### 2.2 O Dipolo ZCAS vs Bacia do Prata (SESA)
O SALLJ possui dois modos de entrega de umidade determinados pela grande escala:
1. **Modo SESA / Bacia do Prata Ativa**: O jato permanece confinado e colado à encosta dos Andes até latitudes ao sul de 25°S (Paraguai, RS, Uruguai), descarregando umidade na Bacia do Prata. A ZCAS permanece suprimida.
2. **Modo ZCAS Ativa**: O jato desprende-se precocemente da barreira dos Andes na altura da Bolívia/Mato Grosso (~17°S-20°S) e curva-se para leste/sudeste, canalizando vapor diretamente para São Paulo, Minas Gerais e Rio de Janeiro. A Bacia do Prata/SESA experimenta estiagem e subsidência.

### 2.3 Os Dois Jatos em Altitude (200 hPa e 300 hPa)
1. **Jato Subtropical (STJ - 200 hPa / ~12 km)**:
   * Localizado entre 25°S e 35°S.
   * Atua como **guia de ondas de Rossby** (concentra número de onda estacionário $K_s$ alto).
   * Sua região de **entrada equatorial** (*equatorial entrance*) de um *jet streak* impõe forte divergência idadeostrófica em altitude ($\nabla \cdot \vec{v}_\chi > 0$) diretamente sobre a convergência de baixos níveis do SALLJ $\implies$ **Acoplamento Vertical**, disparando ascensão explosiva e SCMs.
2. **Jato Polar (PFJ - 300 hPa / ~9 km)**:
   * Localizado entre 45°S e 60°S no Hemisfério Sul.
   * Associado à baroclinia profunda, frentes frias antárticas/patagônicas e sistemas frontais intensos (*Pampero* e ciclogêneses no Atlântico Sudoeste).

### 2.4 Teleconexão: Fonte de Rossby e Trem de Ondas PSA
A convecção tropical da MJO atua como fonte de divergência em altitude. Em um escoamento divergente que cruza gradientes de vorticidade absoluta, gera-se vorticidade e ondas de Rossby (Sardeshmukh & Hoskins, 1988):
$$S = -\nabla \cdot (\vec{v}_\chi \zeta_a) = -\zeta_a \nabla \cdot \vec{v}_\chi - \vec{v}_\chi \cdot \nabla \zeta_a$$
* Como $f < 0$ no Hemisfério Sul, o sinal de $S$ inverte-se em relação ao Hemisfério Norte.
* A onda estacionária só existe onde $\bar{u} > 0$ com número de onda:
  $$K_s = \left(\frac{\beta_M}{\bar{u}}\right)^{1/2}, \quad \beta_M = \beta - \frac{\partial^2 \bar{u}}{\partial y^2}$$
* O Jato Subtropical guia o trem de ondas **PSA (Pacific–South American)** do Pacífico Tropical através da Nova Zelândia, Mar de Amundsen e Drake Passage até o Atlântico Sudoeste.
* Com velocidade de grupo $|c_g| \approx 20\text{ m/s}$, a distância de $1.5 \times 10^4\text{ km}$ é percorrida em um **tempo de trânsito de retardo**:
  $$\tau = \frac{D}{|c_g|} \approx \frac{1.5 \times 10^4\text{ km}}{20\text{ m/s}} \approx 9\text{ dias (1 semana a 10 dias)}$$
  Esse retardo é a base física da previsão subsazonal (S2S): a fase de hoje no Índico prevê o padrão do SESA na semana seguinte.

### 2.5 Ciclo das 8 Fases da MJO (Wheeler & Hendon, 2004)
No espaço de fase polar $(RMM_1, RMM_2)$, com amplitude $A = \sqrt{RMM_1^2 + RMM_2^2}$:
* **Fases 2 e 3 (Oceano Índico)** e **Fase 4 (Continente Marítimo)**:
  * No verão (DJF), disparam trem PSA com cavado no Atlântico Sudoeste.
  * SALLJ estendido para o sul $\implies$ **SESA Ativo** (anomalia de precipitação $+60\%$ a $+100\%$, frequência de SCMs dobrada $\times 2$). ZCAS suprimida.
* **Fases 7 e 8 (Pacífico Central / Hemisfério Ocidental)**:
  * Disparam anomalia anticiclônica no Atlântico Sudoeste.
  * SALLJ desprende-se cedo e vira para o Sudeste $\implies$ **ZCAS Ativa** ($+30\%$ a $+80\%$ de chuva em SP/MG/RJ). SESA sob seca/subsidência.
* **De junho a novembro (inverno/primavera)**: fases 4 e 5 reduzem a chuva no SESA.

### 2.6 Modulação pelo ENOS: Frequência vs Intensidade ($R = \nu \bar{r}$)
Decompondo a precipitação acumulada sazonal:
$$R = \nu \bar{r} \implies \frac{\delta R}{R} = \frac{\delta \nu}{\nu} + \frac{\delta \bar{r}}{\bar{r}}$$
* **El Niño**: Age por $\delta \nu > 0$. Jato subtropical acelerado e deslocado para o equador $\implies$ mais episódios de jato, mais dias armados, chuva contínua distribuída, solo encharcado.
* **La Niña**: Age por $\delta \bar{r} > 0$. Menos episódios de jato ($\delta \nu < 0$), porém o tempo de recarga entre passagens frontais é longo; a atmosfera sobre a Bacia do Prata acumula CAPE sem ser purgada $\implies$ quando um episódio de SALLJ finalmente ocorre, ele descarrega chuva extrema por evento!

### 2.7 A Régua do Logito (Figura 1.3 do Livro)
A probabilidade $P$ de ocorrência de um SCM na pêntada compõe-se linearmente no **logito** ($\text{logit} = \ln \frac{P}{1-P}$), nunca na probabilidade direta:
$$\ln\left(\frac{P}{1-P}\right) = a_0 + a_1 x_{\text{ENOS}} + a_2 A \cos(\phi - \phi_0) + a_3 x_{\text{ENOS}} A \cos(\phi - \phi_0)$$
* **Calibração (Salio, Nicolini & Zipser 2007)**:
  * Climatologia sem jato: $P = 12\% \implies a_0 = -1.99$.
  * Presença do SALLJ: $+1.63$ no logito $\implies P = 41\%$ (multiplica a *odds* por $\times 5.1$!).
  * MJO favorável (Fase 3/4) soma até $+0.90 \implies P > 65\%$.
  * O mesmo degrau de logito rende $+7\%$, $+29\%$ ou $+38\%$ conforme a base de onde parte.

---

## 3. 🏗️ Arquitetura Atual da Aplicação Implementada

A implementação atual reside em:  
📂 `C:\Users\haas\github\demos\mesoescala\mjo-teleconexoes-sesa\index.html`

### 3.1 Pilha Tecnológica
* **HTML5 Canvas 2D de Alta Resolução**: Renderização por vetor dos continentes mundiais, Andes em relevo orográfico destacado, bacias e contornos regionais do SESA e da ZCAS.
* **Motor de Partículas a 60 FPS**: Partículas de vento animadas dinamicamente:
  * *Verde Esmeralda*: Partículas do SALLJ em 850 hPa (trajetória dependente da fase: encostada nos Andes vs defletida para a ZCAS).
  * *Azul Ciano*: Partículas velozes do Jato Subtropical em 200 hPa com modulação por ondas.
  * *Lilás/Púrpura*: Partículas do Jato Polar em 300 hPa em altas latitudes.
* **Espaço de Fase Wheeler-Hendon RMM**:
  * Canvas polar interativo com 8 octantes, círculo de ruído $|RMM| < 1$, seleção por clique em qualquer ângulo e playback de propagação contínua de 45 dias.
* **Corte Vertical da Troposfera (1000 a 150 hPa)**:
  * Ilustra o acoplamento baroclínico e barotrópico em tempo real entre o SALLJ e a entrada equatorial do *jet streak*.
* **Régua Visual do Logito**:
  * Dupla escala animada (logito linear de $-4$ a $+2.5$ vs probabilidade não-linear $1\%$ a $85\%$) com setas deslizantes dos ingredientes (SALLJ, MJO, ENOS).
* **Síntese de Voz Didática (Web Speech API em `pt-BR`)**:
  * Narração automática explicando o diagnóstico físico resultante da combinação ativa.

---

## 4. 🚀 Recomendações para a Próxima LLM / Desenvolvedor: Visualização 3D de Máximo Impacto

Para transformar este protótipo em uma **experiência WebGL 3D cinematográfica de nível internacional**, a próxima LLM deve seguir as seguintes diretrizes:

### 4.1 Uso de Three.js / WebGL / Shaders GLSL Customizados
1. **Globo 3D Fotorrealista**:
   * Esfera 3D com texturas Blue Marble / NASA Black Marble (modo noite), textura de relevo normal/bump map com elevação dos Andes destacada.
   * Shader de atmosfera (*atmospheric rim scattering*) simulando a dispersão de Rayleigh no limbo da Terra.
2. **Campos de Vento Volumétricos em GPU (Instanced Meshes ou GPGPU Float Textures)**:
   * Substituir o Canvas 2D por linhas de corrente 3D em tubos finos iluminados ou milhões de partículas em GPU.
   * O **SALLJ** deve ser renderizado como uma fita/rio de partículas verdes fluindo rente à superfície a leste da parede dos Andes, mostrando claramente como a cordilheira funciona como barreira mecânica.
   * O **Jato Subtropical (200 hPa)** deve voar alto sobre o continente a 12 km de altitude em fita ciano translúcida ondulada, acelerando na entrada do *jet streak*.
   * O **Jato Polar (300 hPa)** circundando a Antártica e modulando as frentes no Cone Sul.
3. **Envelope Convectivo OLR em Shader Volumétrico ou Billboard de Nuvens**:
   * Envelopes de nuvens convectivas tropicais que pulsam e se propagam fisicamente ao longo do equador do Índico ao Pacífico.
   * Células de Walker 3D animadas mostrando alças verticais de circulação (subida nos trópicos, divergência superior e subsidência nas zonas secas).
4. **Trem de Ondas PSA como Arcos Geodésicos 3D**:
   * Ondas de geopotencial visualizadas como relevo dinâmico na superfície de 200 hPa (montanhas de alta pressão em vermelho/dourado e vales de baixa pressão em azul/ciano), propagando-se como ondulações em arco de grande círculo pelo Pacífico Sul até a América do Sul.
5. **Câmera Cinematográfica com Presets Interativos**:
   * *Preset 1: Visão Orbital Global* (perspectiva espacial com a Terra girando e a MJO se deslocando).
   * *Preset 2: Visão Aérea dos Andes e Bacia do Prata* (câmera inclinada olhando para o sul a partir da Amazônia ao longo da barreira dos Andes, vendo o rio atmosférico do SALLJ mergulhar na direção do Rio Grande do Sul e Buenos Aires).
   * *Preset 3: Visão de Teleconexão Transpacífica* (arco panorâmico do Pacífico Oeste à Patagônia).

---

## 5. 📊 Matriz de Dados JSON dos Estados

Abaixo encontra-se a matriz canônica de dados para alimentar qualquer visualizador 3D:

```json
{
  "phases": {
    "1": { "name": "Hemisfério Ocidental & África", "olr_center": [10, 2], "sallj_dir": "eastward", "sesa_anom": -15, "zcas_anom": 25 },
    "2": { "name": "Oceano Índico Ocidental", "olr_center": [65, -2], "sallj_dir": "transicao", "sesa_anom": 15, "zcas_anom": -10 },
    "3": { "name": "Oceano Índico Oriental & Marítimo", "olr_center": [92, -4], "sallj_dir": "southward", "sesa_anom": 75, "zcas_anom": -45 },
    "4": { "name": "Continente Marítimo (Indonésia)", "olr_center": [125, -2], "sallj_dir": "southward", "sesa_anom": 60, "zcas_anom": -35 },
    "5": { "name": "Continente Marítimo / Pacífico Oeste", "olr_center": [145, 0], "sallj_dir": "transicao", "sesa_anom": 10, "zcas_anom": 5 },
    "6": { "name": "Pacífico Oeste", "olr_center": [168, 2], "sallj_dir": "eastward", "sesa_anom": -20, "zcas_anom": 35 },
    "7": { "name": "Pacífico Central / Linha de Data", "olr_center": [-170, 0], "sallj_dir": "eastward", "sesa_anom": -55, "zcas_anom": 80 },
    "8": { "name": "Pacífico Leste & Hemisfério Ocidental", "olr_center": [-120, 2], "sallj_dir": "eastward", "sesa_anom": -50, "zcas_anom": 65 }
  },
  "seasons": {
    "DJF": { "name": "Verão", "stj_lat_shift": 0, "pfj_lat_shift": -5, "monsoon_intensity": 1.15 },
    "MAM": { "name": "Outono", "stj_lat_shift": 3, "pfj_lat_shift": 0, "monsoon_intensity": 0.85 },
    "JJA": { "name": "Inverno", "stj_lat_shift": 6, "pfj_lat_shift": 6, "monsoon_intensity": 0.65 },
    "SON": { "name": "Primavera", "stj_lat_shift": 2, "pfj_lat_shift": 2, "monsoon_intensity": 0.95 }
  },
  "enso": {
    "el-nino": { "stj_north_shift": 4, "speed_bonus": 8, "delta_nu": 40, "delta_r_bar": -10, "logit_step": 0.75 },
    "neutro": { "stj_north_shift": 0, "speed_bonus": 0, "delta_nu": 0, "delta_r_bar": 0, "logit_step": 0.0 },
    "la-nina": { "stj_north_shift": -4, "speed_bonus": -4, "delta_nu": -30, "delta_r_bar": 50, "logit_step": -0.40 }
  }
}
```
