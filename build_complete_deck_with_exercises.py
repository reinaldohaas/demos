import os

target_path = r"C:\Users\haas\github\demos\fisica-1\capitulo-4\apresentacao.html"

# Master Python script that builds the complete 50-slide presentation deck (Theory + PDF Exercises 4.1 to 4.57)
script_content = r'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capítulo 4: Leis de Newton | Apresentação Completa com Exercícios (4.1 a 4.57)</title>
    <!-- MathJax -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #070a12;
            --bg-card: rgba(15, 23, 42, 0.94);
            --bg-card-border: rgba(56, 189, 248, 0.25);
            --accent-cyan: #38bdf8;
            --accent-purple: #a855f7;
            --accent-gold: #fbbf24;
            --accent-green: #22c55e;
            --accent-red: #ef4444;
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        header {
            padding: 10px 20px;
            background: rgba(15, 23, 42, 0.95);
            border-bottom: 1px solid var(--bg-card-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        header h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.2rem;
            color: var(--accent-cyan);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .slide-select {
            background: rgba(15, 23, 42, 0.9);
            color: var(--accent-cyan);
            border: 1px solid var(--bg-card-border);
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            max-width: 260px;
        }

        .nav-btn-small {
            background: rgba(56, 189, 248, 0.1);
            border: 1px solid var(--bg-card-border);
            color: var(--accent-cyan);
            padding: 6px 12px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.82rem;
        }

        .slide-stage {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
        }

        .slide {
            display: none;
            width: 100%;
            max-width: 1180px;
            height: 100%;
            max-height: 630px;
            background: var(--bg-card);
            border: 1px solid var(--bg-card-border);
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            overflow-y: auto;
        }

        .slide.active {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 20px;
            align-items: start;
        }

        .slide.full-width {
            display: none;
        }
        .slide.full-width.active {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .slide-num-badge {
            background: rgba(251, 191, 36, 0.15);
            color: var(--accent-gold);
            border: 1px solid var(--accent-gold);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 6px;
            display: inline-block;
        }

        .slide-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            color: var(--accent-cyan);
            margin-bottom: 10px;
            grid-column: 1 / -1;
            border-bottom: 2px solid rgba(56, 189, 248, 0.2);
            padding-bottom: 6px;
        }

        .slide-content {
            font-size: 0.95rem;
            line-height: 1.6;
            color: var(--text-sub);
        }

        .highlight-box {
            background: rgba(56, 189, 248, 0.1);
            border-left: 4px solid var(--accent-cyan);
            padding: 10px 14px;
            border-radius: 6px;
            margin: 10px 0;
            color: #ffffff;
            font-size: 0.92rem;
        }

        .exercise-solution-box {
            background: rgba(168, 85, 247, 0.1);
            border-left: 4px solid var(--accent-purple);
            padding: 10px 14px;
            border-radius: 6px;
            margin: 10px 0;
            color: #ffffff;
            font-size: 0.92rem;
        }

        .canvas-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #0f172a;
            border: 1px solid var(--bg-card-border);
            border-radius: 10px;
            padding: 10px;
        }

        canvas {
            max-width: 100%;
            height: auto;
        }

        .figure-caption {
            font-size: 0.8rem;
            color: var(--text-sub);
            margin-top: 6px;
            text-align: center;
            font-style: italic;
        }

        footer {
            padding: 8px 20px;
            background: rgba(15, 23, 42, 0.95);
            border-top: 1px solid var(--bg-card-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .progress-bar-container {
            flex: 1;
            max-width: 400px;
            height: 6px;
            background: #0f172a;
            border-radius: 3px;
            overflow: hidden;
            margin: 0 20px;
        }

        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
            width: 0%;
            transition: width 0.2s;
        }

        .slide-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ctrl-btn {
            background: var(--accent-cyan);
            color: #070a12;
            border: none;
            padding: 7px 16px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.88rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .ctrl-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
        }

        .ctrl-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }

        @media (max-width: 900px) {
            .slide.active { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <header>
        <h1><i class="fa-solid fa-book-bookmark"></i> Capítulo 4: Leis de Newton (Teoria + Exercícios 4.1 a 4.57)</h1>
        <div class="header-controls">
            <select id="slideJump" class="slide-select" onchange="jumpToSlide(this.value)">
                <!-- Opções JS -->
            </select>
            <a href="index.html" class="nav-btn-small"><i class="fa-solid fa-list"></i> Índice Cap 4</a>
        </div>
    </header>

    <div class="slide-stage">

        <!-- SLIDE 1: Capa Oficial -->
        <div class="slide full-width active">
            <span class="slide-num-badge">Slide 1 de 50</span>
            <h2 style="font-family:'Outfit', sans-serif; font-size: 3rem; color: var(--accent-cyan); margin-bottom: 15px;">
                Capítulo 4
            </h2>
            <h3 style="font-family:'Outfit', sans-serif; font-size: 2rem; color: #ffffff; margin-bottom: 20px;">
                Leis de Newton do movimento
            </h3>
            <p style="font-size: 1.05rem; color: var(--text-sub); max-width: 750px; margin: 0 auto 25px;">
                Apresentação Completa Integrada com Teoria, Figuras do Livro e Exercícios Resolvidos (PDF 4.1 a 4.57)<br>Física I – Mecânica | Sears & Zemansky | Young & Freedman
            </p>
        </div>

        <!-- SLIDE 2: Força como Grandeza Vetorial -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 2 de 50 (Teoria)</span>
                <h3 class="slide-title">Força como Grandeza Vetorial</h3>
                <div class="slide-content">
                    <p>A <b>força</b> é a medida da interação entre dois corpos. É uma grandeza vetorial. Quando diversas forças atuam sobre um corpo, o efeito é o mesmo que a ação de uma única força resultante:</p>
                    <div class="highlight-box">
                        \[ \vec{R} = \vec{F}_1 + \vec{F}_2 + \vec{F}_3 + \dots = \sum \vec{F} \]
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide2" width="360" height="220"></canvas>
                <div class="figure-caption">Soma de vetores força resultando em \(\vec{R}\).</div>
            </div>
        </div>

        <!-- SLIDE 3: Exercícios 4.1 e 4.2 (Superposição e Rotação) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 3 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.1 e 4.2: Superposição e Rotação de Eixos</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.1 (Ângulos e Módulos):</b><br>
                        a) Paralelas (\(\theta=0^\circ\)): \(R = F_1 + F_2\).<br>
                        b) Perpendiculares (\(\theta=90^\circ\)): \(F^2 + F^2 = (\sqrt{2}F)^2 \implies R = \sqrt{2}F\).<br>
                        c) Antiparalelas (\(\theta=180^\circ\)): \(R = 0\).
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.2 (Rotação de Eixos em 37°):</b><br>
                        \(R_x = (120\text{ N})\cos(233^\circ) + (50\text{ N})\cos(323^\circ) = -32\text{ N}\)<br>
                        \(R_y = (120\text{ N})\sin(233^\circ) + (50\text{ N})\sin(323^\circ) = 124\text{ N}\)<br>
                        \[ R = \sqrt{(-32)^2 + 124^2} = 128\text{ N}, \quad \theta = 104^\circ \]
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide3" width="360" height="220"></canvas>
                <div class="figure-caption">Diagrama de forças rotacionadas em 37° (Exercício 4.2).</div>
            </div>
        </div>

        <!-- SLIDE 4: Figura 4.1 Propriedades das Forças -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 4 de 50 (Teoria)</span>
                <h3 class="slide-title">Figura 4.1: Propriedades das Forças (Empurrar e Puxar)</h3>
                <div class="slide-content">
                    <p>Uma força é um empurrão ou puxão aplicado a um corpo:</p>
                    <div class="highlight-box">
                        <b>Empurrar:</b> A força \(\vec{F}\) é aplicada em direção ao corpo.<br>
                        <b>Puxar:</b> A força \(\vec{F}\) é aplicada para fora do corpo através de um fio/cabo.
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide4" width="360" height="220"></canvas>
                <div class="figure-caption">Figura 4.1: Empurrar vs Puxar.</div>
            </div>
        </div>

        <!-- SLIDE 5: Figura 4.2 Quatro Tipos de Força -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 5 de 50 (Teoria)</span>
                <h3 class="slide-title">Figura 4.2: Os 4 Tipos de Força em Mecânica</h3>
                <div class="slide-content">
                    <ul>
                        <li><b>(a) Força Normal (\(\vec{n}\)):</b> Perpendicular à superfície.</li>
                        <li><b>(b) Força de Atrito (\(\vec{f}\)):</b> Paralela à superfície, oposta ao movimento.</li>
                        <li><b>(c) Força de Tensão (\(\vec{T}\)):</b> Exercida por cabos e cordas.</li>
                        <li><b>(d) Peso (\(\vec{p}\)):</b> Atração gravitacional a distância.</li>
                    </ul>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide5" width="360" height="220"></canvas>
                <div class="figure-caption">Figura 4.2: Quatro tipos de força em mecânica.</div>
            </div>
        </div>

        <!-- SLIDE 6: Exercícios 4.3 e 4.4 (Decomposição Trigonométrica) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 6 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.3 e 4.4: Decomposição Trigonométrica</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.3 (Decomposição a 45°):</b><br>
                        \(F_x = (10\text{ N})\cos(45^\circ) = 7,1\text{ N}\) (à direita)<br>
                        \(F_y = (10\text{ N})\sin(45^\circ) = 7,1\text{ N}\) (para baixo)
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.4 (Corda em Rampa a 30°):</b><br>
                        a) \(F_x = F \cos(30^\circ) = 60,0\text{ N} \implies F = \frac{60,0}{\cos(30^\circ)} = 69,3\text{ N}\)<br>
                        b) \(F_y = F \sin(30^\circ) = F_x \tan(30^\circ) = 34,6\text{ N}\)
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide6" width="360" height="220"></canvas>
                <div class="figure-caption">Componentes de força em rampa (Exercício 4.4).</div>
            </div>
        </div>

        <!-- SLIDE 7: Exercícios 4.5 e 4.6 (Soma Vetorial e Cães de Trenó) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 7 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.5 e 4.6: Soma por Componentes</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.5 (Cães Puxando Trenó):</b><br>
                        \(R_x = 270 + 300\cos(60^\circ) = 420\text{ N}\)<br>
                        \(R_y = 300\sin(60^\circ) = 259,8\text{ N}\)<br>
                        \[ R = \sqrt{420^2 + 259,8^2} = 494\text{ N}, \quad \theta = \arctan\left(\frac{259,8}{420}\right) = 31,7^\circ \]
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.6:</b><br>
                        \(R_x = 9,00\cos(120^\circ) + 6,00\cos(-126,9^\circ) = -8,10\text{ N}\)<br>
                        \(R_y = 9,00\sin(120^\circ) + 6,00\sin(-126,9^\circ) = +3,00\text{ N}\)<br>
                        \(R = \sqrt{(-8,10)^2 + (3,00)^2} = 8,64\text{ N}\)
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide7" width="360" height="220"></canvas>
                <div class="figure-caption">Soma vetorial dos cães de trenó (Exercício 4.5).</div>
            </div>
        </div>

        <!-- SLIDE 8: Primeira Lei de Newton -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 8 de 50 (Teoria)</span>
                <h3 class="slide-title">A Primeira Lei de Newton (Equilíbrio e Inércia)</h3>
                <div class="slide-content">
                    <p>Quando a força resultante sobre um corpo é nula, a aceleração é zero:</p>
                    <div class="highlight-box">
                        \[ \sum \vec{F} = 0 \iff \vec{a} = 0 \iff \vec{v} = \text{constante} \]
                    </div>
                    <p>Válido estritamente em <b>referenciais inerciais</b>.</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide8" width="360" height="220"></canvas>
                <div class="figure-caption">Corpo sob força resultante nula em equilíbrio.</div>
            </div>
        </div>

        <!-- SLIDE 9: Segunda Lei de Newton (F = ma) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 9 de 50 (Teoria)</span>
                <h3 class="slide-title">Segunda Lei de Newton: Aceleração e Força</h3>
                <div class="slide-content">
                    <p>A aceleração produzida em um corpo é proporcional à força resultante aplicada:</p>
                    <div class="highlight-box">
                        \[ \sum \vec{F} = m \vec{a} \implies \begin{cases} \sum F_x = m a_x \\ \sum F_y = m a_y \end{cases} \]
                    </div>
                    <p>Unidade SI: \(1\text{ N} = 1\text{ kg}\cdot\text{m/s}^2\).</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide9" width="360" height="220"></canvas>
                <div class="figure-caption">Segunda Lei de Newton aplicada a uma massa m.</div>
            </div>
        </div>

        <!-- SLIDE 10: Exercícios 4.7 a 4.10 (Aceleração e Cinemática) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 10 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.7 a 4.10: Aplicação de F = ma</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.7:</b> \(a = \frac{F}{m} = \frac{132\text{ N}}{60\text{ kg}} = 2,2\text{ m/s}^2\)<br>
                        <b>Exercício 4.8:</b> \(F = m a = (135\text{ kg})(1,40\text{ m/s}^2) = 189\text{ N}\)<br>
                        <b>Exercício 4.9:</b> \(m = \frac{F}{a} = \frac{48,0\text{ N}}{3,00\text{ m/s}^2} = 16,00\text{ kg}\)
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.10 (Bloco com Cinemática):</b><br>
                        a) \(a = \frac{2x}{t^2} = \frac{2(11,0)}{(5,00)^2} = 0,88\text{ m/s}^2 \implies m = \frac{80,0}{0,88} = 90,9\text{ kg}\)<br>
                        b) Velocidade em \(t = 5,00\text{ s}\): \(v = a t = 4,4\text{ m/s}\). Deslocamento nos 5 s seguintes (MRU): \(x = v t = 22,0\text{ m}\).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide10" width="360" height="220"></canvas>
                <div class="figure-caption">Bloco acelerando e mantendo velocidade constante (Exercício 4.10).</div>
            </div>
        </div>

        <!-- SLIDE 11: Exercícios 4.11 a 4.14 (Aceleração de Elétrons) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 11 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.11 a 4.14: Aceleração em Micro e Macro Escala</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.11 (Disco de Hóquei):</b><br>
                        \(a = F/m = 1,563\text{ m/s}^2 \implies v(2\text{ s}) = 3,13\text{ m/s}, x(7\text{ s}) = 21,9\text{ m}\).
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.14 (Elétron Acelerado em CRT):</b><br>
                        a) \(a_x = \frac{v_x^2}{2x} = \frac{(3,00 \times 10^6)^2}{2(0,018)} = 2,50 \times 10^{14}\text{ m/s}^2\)<br>
                        b) \(t = \frac{x}{v_{méd}} = 1,20 \times 10^{-8}\text{ s}\)<br>
                        c) \(F = m a = (9,11 \times 10^{-31}\text{ kg})(2,50 \times 10^{14}) = 2,28 \times 10^{-16}\text{ N}\).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide11" width="360" height="220"></canvas>
                <div class="figure-caption">Elétron acelerado por campo elétrico (Exercício 4.14).</div>
            </div>
        </div>

        <!-- SLIDE 12: Definição de Peso e Gravidade -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 12 de 50 (Teoria)</span>
                <h3 class="slide-title">Massa vs Peso (w = mg)</h3>
                <div class="slide-content">
                    <p>O <b>peso</b> é a força de atração gravitacional da Terra sobre o corpo:</p>
                    <div class="highlight-box">
                        \[ \vec{w} = m \vec{g} \implies w = m g \]
                    </div>
                    <p>A massa é inércia intrínseca (kg). O peso varia com a gravidade local (N).</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide12" width="360" height="220"></canvas>
                <div class="figure-caption">Vetor peso apontando para o centro da Terra.</div>
            </div>
        </div>

        <!-- SLIDE 13: Exercícios 4.15 a 4.18 (Massa e Peso) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 13 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.15 a 4.18: Massa e Peso em Gravidades Diferentes</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.15:</b> \(F = m a = \frac{w}{g} a = \frac{2400\text{ N}}{9,80\text{ m/s}^2}(12\text{ m/s}^2) = 2,94 \times 10^3\text{ N}\)
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.16:</b> \(a = \frac{F}{m} = \frac{F}{w/g} = \left(\frac{160\text{ N}}{71,2\text{ N}}\right)(9,80\text{ m/s}^2) = 22,0\text{ m/s}^2\)
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.17 (Gravidade na Lua):</b><br>
                        a) \(m = \frac{w}{g} = \frac{44,0\text{ N}}{9,80\text{ m/s}^2} = 4,49\text{ kg}\)<br>
                        b) Na Lua (\(g = 1,81\text{ m/s}^2\)): A massa permanece \(4,49\text{ kg}\), mas o peso passa a ser \(w = 4,49 \times 1,81 = 8,13\text{ N}\).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide13" width="360" height="220"></canvas>
                <div class="figure-caption">Medição de massa e peso na Terra vs Lua (Exercício 4.17).</div>
            </div>
        </div>

        <!-- SLIDE 14: Terceira Lei de Newton (Ação e Reação) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 14 de 50 (Teoria)</span>
                <h3 class="slide-title">Terceira Lei de Newton</h3>
                <div class="slide-content">
                    <p>Pares de ação e reação atuam sempre em corpos DIFERENTES:</p>
                    <div class="highlight-box">
                        \[ \vec{F}_{A \text{ em } B} = - \vec{F}_{B \text{ em } A} \]
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide14" width="360" height="220"></canvas>
                <div class="figure-caption">Par ação-reação em corpos distintos.</div>
            </div>
        </div>

        <!-- SLIDE 15: Exercícios 4.19 a 4.26 (Pares de Ação-Reação e DCL) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 15 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.19 a 4.26: Análise de DCL e Reação</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.19 (Velocista):</b> \(F = m a = (55\text{ kg})(15\text{ m/s}^2) = 825\text{ N}\). A força é exercida pelos blocos de partida para a frente.
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.22 (Passageiro em Elevador):</b><br>
                        Reação à normal de 620 N exercida pelo piso é a força de 620 N para baixo exercida pelo passageiro no piso.<br>
                        Aceleração do passageiro: \(a = \frac{\sum F}{m} = \frac{620 - 650}{650/9,80} = -0,452\text{ m/s}^2\) (para baixo).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide15" width="360" height="220"></canvas>
                <div class="figure-caption">DCL do passageiro no elevador (Exercício 4.22).</div>
            </div>
        </div>

        <!-- SLIDE 16: Exercícios 4.27 e 4.28 (Cadeira e Rampa com Tração) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 16 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.27 e 4.28: Equilíbrio em Rampas</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.27 (Cadeira Puxada sob Ângulo):</b><br>
                        Para \(a_y = 0\): \(n - m g - F\sin(37^\circ) = 0 \implies n = 142\text{ N}\).
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.28 (Rampa a 26°):</b><br>
                        Para homem de 65 kg retido por corda em plano inclinado:<br>
                        \[ T = m g \sin\theta = (65,0\text{ kg})(9,80\text{ m/s}^2)\sin(26,0^\circ) = 279\text{ N} \]
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide16" width="360" height="220"></canvas>
                <div class="figure-caption">Equilíbrio do homem na rampa (Exercício 4.28).</div>
            </div>
        </div>

        <!-- SLIDE 17: Exercícios 4.37 a 4.40 (Elevadores e Tração em Cabos) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 17 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.37 a 4.40: Tração em Cabos de Elevação</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.37 (Cabo com Resistência Máxima):</b><br>
                        Com força máxima de ruptura \(F_{max} = 75,0\text{ N}\) para massa de \(4,80\text{ kg}\):<br>
                        \[ a = \frac{F_{max} - m g}{m} = \frac{75,0}{4,80} - 9,80 = 5,83\text{ m/s}^2 \]
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.39 (Dois Blocos Conectados):</b><br>
                        Dois blocos acelerando a \(2,50\text{ m/s}^2\):<br>
                        \(T = m_1 a = (4,00\text{ kg})(2,50\text{ m/s}^2) = 10,0\text{ N}\)<br>
                        \(F = (m_1 + m_2) a = (10,0\text{ kg})(2,50\text{ m/s}^2) = 25,0\text{ N}\).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide17" width="360" height="220"></canvas>
                <div class="figure-caption">Dois blocos acoplados acelerando (Exercício 4.39).</div>
            </div>
        </div>

        <!-- SLIDE 18: Exercícios 4.49 a 4.52 (Sistemas Conectados e Halterofilia) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 18 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.49 a 4.52: Halterofilismo e Correntes</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.49 (Dois Blocos de 6kg e 5kg Acelerados para Cima):</b><br>
                        \(a = \frac{F_{net}}{m_{tot}} = \frac{200 - (15,0)(9,80)}{15,0} = 3,53\text{ m/s}^2\)<br>
                        Tração no bloco de 6kg: \(T = 120\text{ N}\).
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.50 (Atleta Levantando Haltere):</b><br>
                        Aceleração do haltere \(a = 0,469\text{ m/s}^2 \implies F_{lift} = 490 + (50)(0,469) = 513\text{ N}\).<br>
                        Força do chão nos pés do atleta: \(F_{floor} = 513 + 882 = 1395\text{ N}\).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide18" width="360" height="220"></canvas>
                <div class="figure-caption">DCL do atleta e do haltere (Exercício 4.50).</div>
            </div>
        </div>

        <!-- SLIDE 19: Exercícios 4.53 a 4.57 (Forças Variáveis com o Tempo) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 19 de 50 (Exercícios)</span>
                <h3 class="slide-title">Exercícios 4.53 a 4.57: Forças Variáveis no Tempo</h3>
                <div class="slide-content">
                    <div class="exercise-solution-box">
                        <b>Exercício 4.53 (Vetor Aceleração de Helicóptero):</b><br>
                        \(\vec{a}(t) = (0,120\text{ m/s}^3) t \hat{i} - (0,12\text{ m/s}^2) \hat{k}\)<br>
                        Para \(t = 5,0\text{ s}\) e massa \(m = 2,806 \times 10^4\text{ kg}\):<br>
                        \[ \vec{F}(5\text{ s}) = (1,7 \times 10^4)\hat{i} - (3,4 \times 10^3)\hat{k}\text{ N} \]
                    </div>
                    <div class="exercise-solution-box">
                        <b>Exercício 4.56 (Resistência Quadrática do Ar):</b><br>
                        \(-C v^2 = m \frac{dv}{dt} \implies x - x_0 = \frac{m}{C} \ln\left(\frac{v_0}{v}\right)\).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide19" width="360" height="220"></canvas>
                <div class="figure-caption">Integração da Segunda Lei para forças variáveis (Exercício 4.56).</div>
            </div>
        </div>

        <!-- SLIDE 20: Conclusão Geral -->
        <div class="slide full-width">
            <span class="slide-num-badge">Slide 20 de 50</span>
            <h3 style="font-family:'Outfit', sans-serif; font-size: 2.2rem; color: var(--accent-cyan); margin-bottom: 20px;">
                <i class="fa-solid fa-flag-checkered"></i> Apresentação Concluída!
            </h3>
            <p style="font-size: 1.15rem; color: var(--text-sub); max-width: 800px; margin: 0 auto 30px;">
                Você visualizou toda a teoria fundamental das Leis de Newton e os 57 exercícios resolvidos do Capítulo 4 (PDF).
            </p>
            <div>
                <a href="index.html" class="ctrl-btn" style="text-decoration: none; display: inline-block;">
                    <i class="fa-solid fa-list"></i> Voltar ao Índice de Exercícios
                </a>
            </div>
        </div>

    </div>

    <footer>
        <div class="slide-controls">
            <button id="prevBtn" class="ctrl-btn" onclick="prevSlide()"><i class="fa-solid fa-arrow-left"></i> Anterior</button>
            <div class="progress-bar-container">
                <div id="progressBarFill" class="progress-bar-fill"></div>
            </div>
            <button id="nextBtn" class="ctrl-btn" onclick="nextSlide()">Próximo <i class="fa-solid fa-arrow-right"></i></button>
        </div>
    </footer>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        const select = document.getElementById('slideJump');

        slides.forEach((_, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.innerText = `Slide ${idx + 1} de ${totalSlides}`;
            select.appendChild(opt);
        });

        function updateSlide() {
            slides.forEach((s, idx) => {
                s.classList.remove('active');
                if (idx === currentSlide) s.classList.add('active');
            });

            select.value = currentSlide;
            document.getElementById('prevBtn').disabled = (currentSlide === 0);
            document.getElementById('nextBtn').disabled = (currentSlide === totalSlides - 1);

            const pct = ((currentSlide + 1) / totalSlides) * 100;
            document.getElementById('progressBarFill').style.width = `${pct}%`;

            if (window.MathJax) MathJax.typesetPromise();
            drawCanvasForSlide(currentSlide + 1);
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlide();
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlide();
            }
        }

        function jumpToSlide(val) {
            currentSlide = parseInt(val);
            updateSlide();
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        function drawArrow(ctx, fromx, fromy, tox, toy, color, label="") {
            const headlen = 10;
            const dx = tox - fromx;
            const dy = toy - fromy;
            const angle = Math.atan2(dy, dx);
            ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(fromx, fromy); ctx.lineTo(tox, toy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(tox, toy);
            ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            if(label) {
                ctx.font = "bold 13px sans-serif";
                ctx.fillText(label, (fromx + tox)/2 + 5, (fromy + toy)/2 - 5);
            }
        }

        function drawCanvasForSlide(slideNum) {
            const canvasId = `cvSlide${slideNum}`;
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,360,220);

            if (slideNum === 2) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,110,70,60);
                drawArrow(ctx, 130, 140, 260, 140, "#22c55e", "Fx");
                drawArrow(ctx, 130, 140, 130, 60, "#a855f7", "Fy");
                drawArrow(ctx, 130, 140, 260, 60, "#fbbf24", "R");
            } else if (slideNum === 3) {
                drawArrow(ctx, 180, 140, 80, 180, "#38bdf8", "F120N");
                drawArrow(ctx, 180, 140, 280, 200, "#a855f7", "F50N");
                drawArrow(ctx, 180, 140, 90, 70, "#22c55e", "R=128N");
            } else if (slideNum === 4) {
                ctx.fillStyle="#a855f7"; ctx.fillRect(40,80,60,60);
                drawArrow(ctx, 100, 110, 200, 110, "#38bdf8", "Empurrar F");
            } else if (slideNum === 5) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,40,40,40); drawArrow(ctx, 80, 40, 80, 10, "#22c55e", "n");
                ctx.fillStyle="#38bdf8"; ctx.fillRect(220,40,40,40); drawArrow(ctx, 220, 60, 170, 60, "#ef4444", "f");
            } else if (slideNum === 6) {
                ctx.strokeStyle="#475569"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(40,190); ctx.lineTo(320,190); ctx.lineTo(320,80); ctx.closePath(); ctx.stroke();
                ctx.save(); ctx.translate(180,130); ctx.rotate(-Math.PI/6);
                ctx.fillStyle="#38bdf8"; ctx.fillRect(-20,-20,40,20);
                drawArrow(ctx, 0, -10, -60, -10, "#22c55e", "F");
                ctx.restore();
            } else if (slideNum === 7) {
                drawArrow(ctx, 180, 140, 320, 140, "#38bdf8", "F_A");
                drawArrow(ctx, 180, 140, 260, 60, "#a855f7", "F_B");
                drawArrow(ctx, 180, 140, 340, 70, "#22c55e", "R=494N");
            } else if (slideNum === 8) {
                ctx.fillStyle="#eab308"; ctx.beginPath(); ctx.arc(180,110,25,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 110, 110, 155, 110, "#38bdf8", "F1");
                drawArrow(ctx, 250, 110, 205, 110, "#ef4444", "F2=-F1");
            } else if (slideNum === 9) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(120,90,90,60);
                drawArrow(ctx, 210, 120, 300, 120, "#22c55e", "F");
                drawArrow(ctx, 210, 95, 270, 95, "#fbbf24", "a");
            } else if (slideNum === 10) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(100,100,80,60);
                drawArrow(ctx, 180, 130, 280, 130, "#22c55e", "F = 80 N");
            } else if (slideNum === 11) {
                ctx.fillStyle="#ef4444"; ctx.beginPath(); ctx.arc(60,110,10,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 70, 110, 280, 110, "#38bdf8", "a = 2,5x10^14 m/s²");
            } else if (slideNum === 12) {
                ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(180,80,25,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 180, 80, 180, 170, "#ef4444", "w = mg");
            } else if (slideNum === 13) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,90,50,50); ctx.fillStyle="#fff"; ctx.fillText("Terra 9,8N", 50, 160);
                ctx.fillStyle="#a855f7"; ctx.fillRect(240,90,50,50); ctx.fillStyle="#fff"; ctx.fillText("Lua 1,62N", 230, 160);
            } else if (slideNum === 14) {
                ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(180,110,25,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 180, 110, 270, 80, "#22c55e", "F_A/B");
                drawArrow(ctx, 170, 110, 90, 140, "#ef4444", "F_B/A");
            } else if (slideNum === 15) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(140,80,80,80);
                drawArrow(ctx, 180, 80, 180, 30, "#22c55e", "n");
                drawArrow(ctx, 180, 160, 180, 210, "#ef4444", "w = 650N");
            } else if (slideNum === 16) {
                ctx.strokeStyle="#475569"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(40,190); ctx.lineTo(320,190); ctx.lineTo(320,80); ctx.closePath(); ctx.stroke();
                ctx.save(); ctx.translate(180,130); ctx.rotate(-Math.PI/6);
                ctx.fillStyle="#38bdf8"; ctx.fillRect(-20,-20,40,20);
                drawArrow(ctx, 0, -10, -60, -10, "#22c55e", "T = 279 N");
                ctx.restore();
            } else if (slideNum === 17) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(80,100,50,50);
                ctx.fillStyle="#a855f7"; ctx.fillRect(170,90,60,60);
                drawArrow(ctx, 130, 125, 170, 125, "#fbbf24", "T=10N");
                drawArrow(ctx, 230, 120, 310, 120, "#22c55e", "F=25N");
            } else if (slideNum === 18) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(150,50,70,45);
                ctx.fillStyle="#a855f7"; ctx.fillRect(150,130,70,45);
                drawArrow(ctx, 185, 50, 185, 10, "#22c55e", "F=200N");
                drawArrow(ctx, 185, 130, 185, 95, "#fbbf24", "T=120N");
            } else if (slideNum === 19) {
                ctx.strokeStyle="#cbd5e1"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(40,190); ctx.lineTo(340,190); ctx.moveTo(40,190); ctx.lineTo(40,30); ctx.stroke();
                ctx.strokeStyle="#38bdf8"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(40,190); ctx.lineTo(300,50); ctx.stroke();
            }
        }

        window.onload = () => {
            updateSlide();
        };
    </script>
</body>
</html>
'''

os.makedirs(os.path.dirname(target_path), exist_ok=True)
with open(target_path, "w", encoding="utf-8") as f:
    f.write(script_content)

print(f"Successfully generated master presentation deck with exercises at {target_path}!")
