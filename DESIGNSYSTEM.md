# 📘 FSC5101 Física I — Guia do Sistema de Design & Diretrizes de Código

> **DOCUMENTO DE CACHE E PADRÕES DO PROJETO**  
> *Mantido de forma persistente em `CACHE.json` e `DESIGNSYSTEM.md`.*

---

## 1. 📁 Arquitetura de Diretórios e Espelhamento Duplo

- **Repositório Git Principal**: `C:\Users\haas\github\demos`
- **Espelho OneDrive**: `C:\Users\haas\OneDrive\Documentos\disciplinas\FSC5101_Fisica_I\demos`
- **Física I (Canônico)**: `fisica-1/capitulo-1` ao `capitulo-5`
- **Meteorologia & Mesoescala**: `mesoescala/supercell-splat-spin` e `mesoescala/rossby-radius`
- **Regra de Ouro de Sincronização**: Qualquer alteração em `github/demos` deve ser espelhada **instantaneamente** para o `OneDrive`.

---

## 2. 🗺️ Navegação em 3 Níveis (Disciplinas → Capítulos → Exercícios)

1. **Nível 1 (Raiz `demos/index.html`)**: Apresenta **apenas os cards das Disciplinas** (Física I, Meteorologia, Geofísica, Pêndulo de Foucault).
2. **Nível 2 (Hub da Disciplina `demos/fisica-1/index.html`)**: Apresenta **apenas os cards dos Capítulos do Livro** (Capítulos 1 ao 5).
3. **Nível 3 (Hub do Capítulo `demos/fisica-1/capitulo-X/index.html`)**: Apresenta **a lista de Exercícios/Exemplos** do capítulo.
4. **Nível 4 (Página do Exercício `exemplo-X-Y.html`)**: Página interativa com Canvas 2D/3D, Telemetria, Resolução Didática Passo a Passo, Painel de Voz e 3 Gráficos Cinemáticos Sincronizados ($x-t$, $v-t$, $a-t$).

---

## 3. 🎨 Padrão Visual e Tipografia

- **Fonte do Corpo**: `Inter, sans-serif` (`0.98rem`, `line-height: 1.6`)
- **Fonte dos Títulos**: `Outfit, sans-serif` (`1.4rem` nos enunciados)
- **Tema Visual**: Dark Neumorphism (`#070a12`, cards `#0f172a`, bordas `#38bdf8`)
- **Ícones**: FontAwesome 6.5.1 (`<i class="fa-solid ..."></i>`)

---

## 4. 📐 Padrão de Vetores Cinemáticos e Sistema Cartesiano

- 📍 **Origem $O (0,0)$**: Indicada por marcador circular amarelo + seta de indicação `📍 Origem O (x = 0)`.
- 🟡 **Vetor Posição $\vec{r}(t)$**: Amarelo Dourado (`#fbbf24`), medido a partir da Origem $O(0,0)$.
- 🔹 **Vetor Deslocamento $\Delta \vec{x}$**: Azul Ciano (`#38bdf8`), estritamente horizontal no Eixo $X$.
- 🟢 **Vetor Velocidade $\vec{v}(t)$**: Verde Emerald (`#10b981`), desenhado a **$-70\text{px}$** acima do objeto (sem colisões).
- 🔴 **Vetor Aceleração $\vec{a}(t)$**: Vermelho Rose (`#f43f5e`), desenhado a **$+65\text{px}$** abaixo do objeto (sem colisões).

---

## 5. 📈 Painel de 3 Gráficos Cinemáticos ($x-t$, $v-t$, $a-t$)

Cada exemplo de movimento inclui um painel de 3 gráficos abaixo ou ao lado do Canvas:
1. 📈 **Gráfico $x(t)$ (Posição)** — Parábola/Curva em amarelo com ponto móvel.
2. 📊 **Gráfico $v(t)$ (Velocidade)** — Reta/Curva em verde com ponto móvel.
3. 📉 **Gráfico $a(t)$ (Aceleração)** — Reta constante/curva em vermelho com ponto móvel.
4. ⏱️ **Linha Guia Vertical**: Uma linha em azul ciano que percorre os 3 gráficos em tempo real acompanhando o tempo $t$.

---

## 6. 🔊 Painel de Controle de Narração por Voz

- **Mecanismo**: Web Speech API (`SpeechSynthesis`) nativa em `pt-BR` com binding `onvoiceschanged`.
- **Botões**: 🔊 **Ouvir Voz**, ⏸️ **Pausar**, ⏹️ **Parar**.
- **Seletor de Velocidade**: `0.75x`, `1.0x (Normal)`, `1.25x`, `1.5x`.

---

## 7. 🌐 Links de Simulações Públicas Incorporadas

Cada deck didático inclui links diretos para simulações públicas de referência:
- 🔗 **PhET Interactive Simulations (University of Colorado Boulder)** — *The Moving Man*
- 🔗 **GeoGebra** — *Cinemática Vetorial Interativa 1D/2D*

---

## 8. 📐 Regra de Separação de Painéis (Quadro Interativo vs. Quadro Estático)

- 🎬 **PRIMEIRO QUADRO (Quadro 1 - Animação Interativa)**:  
  Reservado **exclusivamente para a Simulação Interativa (2D/3D)**, com o Canvas de movimento, a barra de controle de tempo $t$, botões Play/Pause, telemetria em tempo real e gráficos cinemáticos dinâmicos.
  
- 📖 **SEGUNDO QUADRO (Quadro 2 - Conteúdo Estático)**:  
  Reservado **exclusivamente para Conteúdo Estático de Apoio**, contendo o enunciado, a **Tabela de Identificação de Variáveis**, os passos da Resolução Didática com fórmulas e os diagramas/tabelas de referência estática do livro.
