# Geometria Unificada da Equação Quadrática

Uma aplicação web interativa em **HTML5 + CSS3 + Vanilla JavaScript (sem dependências de frameworks)** desenvolvida para demonstrar com rigor visual e matemático a conexão profunda entre:
- A parábola \(f(x) = ax^2 + bx + c\);
- As raízes complexas e a geometria dos círculos no plano complexo (\(f(x) = a \cdot r(x)^2\));
- As raízes reais e a fatoração linear (\(f(x) = r_1(x) \cdot (x - x_2)\));
- A derivada como soma das funções lineares fatoriais (\(f'(x) = r_1(x) + r_2(x)\));
- A interpretação de retas como círculos de raio infinito e curvatura nula (\(R \to \infty \implies \kappa = 1/R \to 0\));
- O colapso contínuo entre raízes complexas conjugadas, raiz real dupla (\(k = 0\)) e raízes reais distintas.

---

## 📐 Estrutura Matemática Central

### 1. Forma Canônica e Unificação dos Casos
Toda função quadrática \(f(x) = ax^2 + bx + c\) com coeficientes reais (\(a \neq 0\)) possui:
- Vértice no eixo real:
  \[h = -\frac{b}{2a}, \quad f(h) = -\frac{\Delta}{4a}\]
- Discriminante:
  \[\Delta = b^2 - 4ac\]
- Parâmetro geométrico de separação \(k\):
  \[k = \frac{\sqrt{|\Delta|}}{2|a|}\]

### 2. O Caso Complexo (\(\Delta < 0\)) e a Métrica dos Círculos
Quando \(\Delta < 0\), as raízes são conjugadas no plano complexo:
\[z_1 = h + ik, \quad z_2 = h - ik\]

Para qualquer ponto de teste \(X = (x, 0)\) sobre o eixo real, a distância euclidiana até ambos os centros complexos é estritamente igual:
\[r(x) = |X - z_1| = |X - z_2| = \sqrt{(x - h)^2 + k^2}\]
\[r(x)^2 = (x - h)^2 + k^2\]

A altura da parábola em qualquer ponto real \(x\) é exatamente:
\[\boxed{f(x) = a \cdot r(x)^2}\]

- **No vértice (\(x = h\)):** O raio atinge seu valor mínimo \(r_{\min} = k\), logo \(f(h) = a k^2\).
- **Interpretação Geométrica:** A parábola é a representação gráfica do quadrado da distância do ponto real aos centros complexos.

### 3. Fatoração e Multiplicação Ponto a Ponto (\(\Delta \ge 0\))
Quando as raízes são reais (\(x_1, x_2\)):
\[f(x) = a(x - x_1)(x - x_2)\]
Definindo as retas fatoriais com inclinação \(a\):
\[r_1(x) = a(x - x_1), \quad r_2(x) = a(x - x_2)\]
A parábola é a multiplicação contínua dessas funções lineares:
\[\boxed{f(x) = r_1(x) \cdot (x - x_2) = \frac{1}{a} r_1(x) r_2(x)}\]

### 4. A Derivada como Soma das Inclinações
Pela regra do produto:
\[f'(x) = \frac{d}{dx}\left[a(x - x_1)(x - x_2)\right] = a(x - x_1) + a(x - x_2) = 2ax + b\]
Portanto:
\[\boxed{f'(x) = r_1(x) + r_2(x)}\]
- Cada reta fatorial tem inclinação \(a\).
- A reta da derivada tem inclinação \(2a\).
- A altura da derivada em qualquer \(x\) é a soma vetorial das alturas das duas retas.

### 5. Da Reta ao Círculo: Limite de Curvatura (\(R \to \infty\))
Na geometria diferencial e na esfera de Riemann:
\[\kappa = \frac{1}{R}\]
Conforme o raio \(R \to \infty\), a curvatura \(\kappa \to 0\), transformando arcos circulares nas retas lineares tangentes.

---

## 💻 Recursos da Aplicação

1. **Painel de Controle em Tempo Real:**
   - Sliders e inputs para \(a, b, c\) com recálculo instantâneo.
   - Ponto de teste \(X = (x, 0)\) arrastável com o mouse no SVG ou ajustável pelo slider.
   - Slider de curvatura/raio \(R\).

2. **Visualização Dupla Sincronizada (Dual SVG Viewport):**
   - **Plano Real \((x, y)\):** Exibe a parábola, retas fatoriais, reta da derivada, vértice, raízes reais e retângulo multiplicador.
   - **Plano Complexo \((\text{Re}, \text{Im})\):** Exibe os centros \(z_1, z_2\), altura \(k\), raios \(r(x)\), triângulo retângulo de Pitágoras e círculos ortogonais \(C_1, C_2\).

3. **Cinco Animações Didáticas Interativas:**
   - **Animar Construção:** Percorre o eixo real variando \(X\), traça os círculos \(C_1, C_2\), os raios e plota o ponto correspondente na parábola.
   - **Multiplicar Fatores:** Demonstra graficamente \(r_1(x) \cdot r_2(x) = f(x)\).
   - **Soma dos Fatores \(\to\) Derivada:** Demonstra a soma vetorial \(r_1(x) + r_2(x) = f'(x)\).
   - **Da Reta ao Círculo:** Demonstra a aproximação contínua \(R \to \infty\) e \(\kappa \to 0\).
   - **Transição \(\Delta\) (\(k \to 0\)):** Varia \(c\) de \(5 \to 4 \to 3\), demonstrando o colapso dos centros complexos em raiz dupla e a separação em raízes reais.

4. **Exemplos Prontos (Presets Rápidos):**
   - **Complexo (\(\Delta < 0\)):** \(f(x) = x^2 - 4x + 5 \implies z_{1,2} = 2 \pm i, f'(x) = 2x - 4\).
   - **Dupla (\(\Delta = 0\)):** \(f(x) = x^2 - 4x + 4 = (x-2)^2 \implies k = 0\).
   - **Reais (\(\Delta > 0\)):** \(f(x) = x^2 - 4x + 3 = (x-1)(x-3)\).
   - **Invertida (\(a < 0\)):** \(f(x) = -x^2 + 4x - 5\).

5. **Semântica Visual e Cores:**
   - 🟣 **Parábola \(f(x)\):** Roxo / Violeta (`#a855f7`)
   - 🔴 **Derivada \(f'(x)\):** Coral / Vermelho (`#ef4444`)
   - 🔵 **Fator 1 / Raiz 1 (\(z_1\)):** Ciano (`#06b6d4`)
   - 🟠 **Fator 2 / Raiz 2 (\(z_2\)):** Âmbar (`#f59e0b`)
   - 🟡 **Ponto Real \(X = (x, 0)\):** Ouro (`#facc15`)
   - 🟢 **Curvatura (\(R\)):** Esmeralda (`#10b981`)

---

## 🚀 Como Executar Localmente

### Opção 1: Abrir direto no Navegador
Dê um duplo clique no arquivo `index.html` ou abra pelo seu navegador preferido.

### Opção 2: Servidor Local (Python)
No terminal na pasta do projeto:
```bash
python -m http.server 8000
```
Acesse no navegador: [http://localhost:8000](http://localhost:8000)

### Opção 3: Servidor Local (Node.js)
```bash
npx serve .
# ou
node test_runner.js
```

---

## 🧪 Suíte de Testes Automatizados

O arquivo `test_runner.js` contém testes unitários cobrindo todos os cálculos:
```bash
node test_runner.js
```

Saída dos testes:
```text
====================================================
INICIANDO TESTES DO MOTOR MATEMÁTICO E IDENTIDADES
====================================================
✅ [PASS] Discriminante Delta = -4
✅ [PASS] Vértice h = 2
✅ [PASS] Parâmetro k = 1
✅ [PASS] Identificado como Raízes Complexas
✅ [PASS] z1 Parte Real = 2
✅ [PASS] z1 Parte Imaginária = +1
✅ [PASS] z2 Parte Real = 2
✅ [PASS] z2 Parte Imaginária = -1
✅ [PASS] Derivada no vértice x=2 é f'(2) = 0
✅ [PASS] Identidade Central f(x) = a * r(x)^2 em x=2
✅ [PASS] Identidade Central f(x) = a * r(x)^2 em x=4
✅ [PASS] f(4) = 4^2 - 4(4) + 5 = 5
✅ [PASS] Raio r(4) = sqrt((4-2)^2 + 1^2) = sqrt(5)
✅ [PASS] Discriminante Delta = 0 (k = 0)
✅ [PASS] Identificado como Raiz Real Dupla (x1 = x2 = 2)
✅ [PASS] Discriminante Delta = 4 (Raízes Reais x1=1, x2=3)
✅ [PASS] Identidade f'(x) = r1(x) + r2(x)
✅ [PASS] Produto dos fatores (x-1)(x-3) = f(x)
✅ [PASS] Identidade f(x) = a * r^2 para a = -1
✅ [PASS] Curvatura kappa -> 0 para R -> infinito
====================================================
RESULTADO DOS TESTES: 33 PASSOU | 0 FALHOU
====================================================
```
