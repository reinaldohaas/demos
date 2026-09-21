import os

target_path = r"C:\Users\haas\github\demos\fisica-1\capitulo-4\apresentacao.html"

# We write the HTML content directly using raw string formatting to avoid double-escaping issues
html_content = r"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capítulo 4: Leis de Newton do Movimento | Apresentação Completa (35 Slides)</title>
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
            padding: 12px 24px;
            background: rgba(15, 23, 42, 0.95);
            border-bottom: 1px solid var(--bg-card-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        header h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            color: var(--accent-cyan);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .slide-select {
            background: rgba(15, 23, 42, 0.9);
            color: var(--accent-cyan);
            border: 1px solid var(--bg-card-border);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
        }

        .nav-btn-small {
            background: rgba(56, 189, 248, 0.1);
            border: 1px solid var(--bg-card-border);
            color: var(--accent-cyan);
            padding: 6px 12px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.85rem;
        }

        .slide-stage {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }

        .slide {
            display: none;
            width: 100%;
            max-width: 1150px;
            height: 100%;
            max-height: 620px;
            background: var(--bg-card);
            border: 1px solid var(--bg-card-border);
            border-radius: 18px;
            padding: 30px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            overflow-y: auto;
        }

        .slide.active {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 25px;
            align-items: center;
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
            font-size: 0.8rem;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 8px;
            display: inline-block;
        }

        .slide-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.65rem;
            color: var(--accent-cyan);
            margin-bottom: 12px;
            grid-column: 1 / -1;
            border-bottom: 2px solid rgba(56, 189, 248, 0.2);
            padding-bottom: 8px;
        }

        .slide-content {
            font-size: 1rem;
            line-height: 1.65;
            color: var(--text-sub);
        }

        .slide-content strong { color: var(--text-main); }

        .highlight-box {
            background: rgba(56, 189, 248, 0.1);
            border-left: 4px solid var(--accent-cyan);
            padding: 12px 16px;
            border-radius: 6px;
            margin: 12px 0;
            color: #ffffff;
            font-size: 0.98rem;
        }

        .canvas-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #0f172a;
            border: 1px solid var(--bg-card-border);
            border-radius: 12px;
            padding: 12px;
        }

        canvas {
            max-width: 100%;
            height: auto;
        }

        .figure-caption {
            font-size: 0.82rem;
            color: var(--text-sub);
            margin-top: 8px;
            text-align: center;
            font-style: italic;
        }

        footer {
            padding: 10px 24px;
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
            padding: 8px 18px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.9rem;
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
        <h1><i class="fa-solid fa-book-bookmark"></i> Capítulo 4: Leis de Newton do Movimento</h1>
        <div class="header-controls">
            <select id="slideJump" class="slide-select" onchange="jumpToSlide(this.value)">
                <!-- Opções preenchidas via JS -->
            </select>
            <a href="index.html" class="nav-btn-small"><i class="fa-solid fa-list"></i> Exercícios Cap 4</a>
        </div>
    </header>

    <div class="slide-stage">

        <!-- SLIDE 1: Capa Oficial -->
        <div class="slide full-width active">
            <span class="slide-num-badge">Slide 1 de 35</span>
            <h2 style="font-family:'Outfit', sans-serif; font-size: 3.2rem; color: var(--accent-cyan); margin-bottom: 15px;">
                Capítulo 4
            </h2>
            <h3 style="font-family:'Outfit', sans-serif; font-size: 2.2rem; color: #ffffff; margin-bottom: 25px;">
                Leis de Newton do movimento
            </h3>
            <p style="font-size: 1.1rem; color: var(--text-sub); max-width: 700px; margin: 0 auto 30px;">
                Física I – Mecânica | Sears & Zemansky | Young & Freedman<br>© 2008 by Pearson Education
            </p>
        </div>

        <!-- SLIDE 2: Força como Grandeza Vetorial -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 2 de 35</span>
                <h3 class="slide-title">Força como Grandeza Vetorial</h3>
                <div class="slide-content">
                    <p>A <b>força</b> é a medida da interação entre dois corpos. É uma grandeza vetorial. Quando diversas forças atuam sobre um corpo, o efeito sobre seu movimento é o mesmo que o produzido pela ação de uma única força agindo sobre o corpo, dada pela soma vetorial (resultante) dessas forças:</p>
                    <div class="highlight-box">
                        \[ \vec{R} = \vec{F}_1 + \vec{F}_2 + \vec{F}_3 + \dots = \sum \vec{F} \]
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide2" width="360" height="240"></canvas>
                <div class="figure-caption">Decomposição e soma de vetores força resultando em \(\vec{R}\).</div>
            </div>
        </div>

        <!-- SLIDE 3: Figura 4.1 Propriedades das Forças -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 3 de 35</span>
                <h3 class="slide-title">Figura 4.1: Algumas Propriedades das Forças</h3>
                <div class="slide-content">
                    <p>Uma força pode ser exercida por contato direto (como um empurrão ou puxão) ou à distância (como a gravidade).</p>
                    <div class="highlight-box">
                        <b>Empurrar:</b> A força \(\vec{F}\) é direcionada para o corpo.<br>
                        <b>Puxar:</b> A força \(\vec{F}\) é direcionada para fora do corpo na direção do barbante/mão.
                    </div>
                    <p>A força é caracterizada por seu módulo, direção e sentido.</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide3" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.1: Algumas propriedades das forças (Empurrar vs Puxar).</div>
            </div>
        </div>

        <!-- SLIDE 4: Figura 4.2 Quatro Tipos de Força -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 4 de 35</span>
                <h3 class="slide-title">Figura 4.2: Quatro Tipos de Força em Mecânica</h3>
                <div class="slide-content">
                    <ul>
                        <li><b>(a) Força Normal (\(\vec{n}\)):</b> Quando um objeto repousa ou empurra uma superfície, a superfície exerce força perpendicular à superfície.</li>
                        <li><b>(b) Força de Atrito (\(\vec{f}\)):</b> Além da normal, a superfície exerce atrito paralelo à superfície.</li>
                        <li><b>(c) Força de Tensão (\(\vec{T}\)):</b> Força de puxar exercida por corda ou cabo.</li>
                        <li><b>(d) Peso (\(\vec{p}\)):</b> Força de atração da gravidade exercida a distância.</li>
                    </ul>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide4" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.2: Os quatro tipos fundamentais de força em mecânica.</div>
            </div>
        </div>

        <!-- SLIDE 5: Figura 4.3 Medindo Forças com Flechas Vetoriais -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 5 de 35</span>
                <h3 class="slide-title">Figura 4.3: Representação Vetorial de Forças</h3>
                <div class="slide-content">
                    <p>Usamos flechas vetoriais para designar as forças aplicadas por um barbante ou por uma vara:</p>
                    <div class="highlight-box">
                        <b>(a) Puxar:</b> Força de 10 N formando um ângulo de \(30^\circ\) sobre a horizontal.<br><br>
                        <b>(b) Empurrar:</b> Força de 10 N formando um ângulo de \(45^\circ\) sob a horizontal.
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide5" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.3: Usando dinamômetro e flechas vetoriais para medir forças.</div>
            </div>
        </div>

        <!-- SLIDE 6: Figura 4.4 Superposição de Forças -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 6 de 35</span>
                <h3 class="slide-title">Figura 4.4: Princípio da Superposição de Forças</h3>
                <div class="slide-content">
                    <p>Duas forças \(\vec{F}_1\) e \(\vec{F}_2\) atuando simultaneamente sobre um ponto A de um corpo equivalem a uma única força resultante \(\vec{R}\):</p>
                    <div class="highlight-box">
                        \[ \vec{R} = \vec{F}_1 + \vec{F}_2 \]
                    </div>
                    <p>A adição de forças segue a <b>regra do paralelogramo</b> da álgebra vetorial.</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide6" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.4: Regra do paralelogramo para superposição de forças.</div>
            </div>
        </div>

        <!-- SLIDE 7: Figura 4.5 Componentes de um Vetor Força -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 7 de 35</span>
                <h3 class="slide-title">Figura 4.5: Vetores Componentes Retangulares</h3>
                <div class="slide-content">
                    <p>Uma força \(\vec{F}\) atuando em um ângulo \(\theta\) com o eixo Ox pode ser substituída por suas componentes retangulares \(\vec{F}_x\) e \(\vec{F}_y\):</p>
                    <div class="highlight-box">
                        \[ F_x = F \cos\theta \quad \text{e} \quad F_y = F \sin\theta \]
                    </div>
                    <p>Os vetores componentes juntos exercem exatamente o mesmo efeito que a força original \(\vec{F}\).</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide7" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.5: Substituição da força \(\vec{F}\) por suas componentes.</div>
            </div>
        </div>

        <!-- SLIDE 8: Figura 4.6 Componentes no Plano Inclinado -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 8 de 35</span>
                <h3 class="slide-title">Figura 4.6: Componentes em Plano Inclinado</h3>
                <div class="slide-content">
                    <p>Em um plano inclinado, orientamos os eixos de modo que o eixo Ox fique paralelo à ladeira e o eixo Oy perpendicular a ela:</p>
                    <div class="highlight-box">
                        <b>\(F_x\):</b> componente paralela à superfície da ladeira.<br>
                        <b>\(F_y\):</b> componente perpendicular à superfície.
                    </div>
                    <p><i>"Cortamos um vetor quando o substituímos por suas componentes."</i></p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide8" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.6: Componentes de \(\vec{F}\) no plano inclinado.</div>
            </div>
        </div>

        <!-- SLIDE 9: Figura 4.7 Componentes da Força Resultante -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 9 de 35</span>
                <h3 class="slide-title">Figura 4.7: Componentes do Vetor Soma (Resultante)</h3>
                <div class="slide-content">
                    <p>Para obter a resultante \(\vec{R} = \sum \vec{F}\) de várias forças:</p>
                    <div class="highlight-box">
                        \[ R_x = F_{1x} + F_{2x} + \dots = \sum F_x \]
                        \[ R_y = F_{1y} + F_{2y} + \dots = \sum F_y \]
                    </div>
                    <p>O componente y de \(\vec{R}\) é a soma dos componentes y, e o mesmo aplica-se para os componentes x.</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide9" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.7: Obtenção de \(R_x\) e \(R_y\) por soma de componentes.</div>
            </div>
        </div>

        <!-- SLIDE 10: Figura 4.8 Exemplo de Três Forças -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 10 de 35</span>
                <h3 class="slide-title">Figura 4.8: Cálculo da Resultante de Três Forças</h3>
                <div class="slide-content">
                    <p><b>(a) Três forças atuando em um ponto:</b> \(\vec{F}_1\) a \(53^\circ\), \(\vec{F}_2\) horizontal e \(\vec{F}_3\) vertical para baixo.</p>
                    <div class="highlight-box">
                        <b>(b) Força resultante \(\vec{R} = \sum \vec{F}\):</b><br>
                        \(R_x = F_{1x} + F_{2x} + F_{3x}\)<br>
                        \(R_y = F_{1y} + F_{2y} + F_{3y}\)<br>
                        Ângulo resultante: \(\theta = 141^\circ\).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide10" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.8: Soma vetorial de três forças e sua resultante.</div>
            </div>
        </div>

        <!-- SLIDE 11: Primeira Lei de Newton -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 11 de 35</span>
                <h3 class="slide-title">A Primeira Lei de Newton</h3>
                <div class="slide-content">
                    <p>A primeira lei de Newton afirma que, quando a soma vetorial das forças que atuam sobre o corpo (a <i>força resultante</i>) é igual a zero, o corpo está em equilíbrio e possui aceleração nula:</p>
                    <div class="highlight-box">
                        \[ \sum \vec{F} = 0 \quad \implies \quad \vec{v} = \text{constante} \]
                    </div>
                    <p>Quando o corpo está em repouso, ele permanece em repouso; quando está em movimento, continua em MRU. Vale em <b>referenciais inerciais</b>.</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide11" width="360" height="240"></canvas>
                <div class="figure-caption">Corpo em equilíbrio estático/dinâmico com \(\sum \vec{F} = 0\).</div>
            </div>
        </div>

        <!-- SLIDE 12: Figura 4.9 Redução de Atrito e Inércia -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 12 de 35</span>
                <h3 class="slide-title">Figura 4.9: Experimento de Inércia com Atrito</h3>
                <div class="slide-content">
                    <p>Quanto mais lisa a superfície, mais longe o disco desliza após tomar uma velocidade inicial:</p>
                    <ul>
                        <li><b>(a) Mesa:</b> O disco desliza pouco devido ao atrito.</li>
                        <li><b>(b) Gelo:</b> O disco desliza um pouco mais.</li>
                        <li><b>(c) Colchão de ar:</b> O atrito é praticamente zero; o disco desliza com velocidade constante.</li>
                    </ul>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide12" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.9: Redução progressiva de atrito e inércia do movimento.</div>
            </div>
        </div>

        <!-- SLIDE 13: Figura 4.10 Aceleração e Resultante Nula -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 13 de 35</span>
                <h3 class="slide-title">Figura 4.10: Força Única vs Força Resultante Nula</h3>
                <div class="slide-content">
                    <div class="highlight-box">
                        <b>(a) Ação de uma única força:</b> Um disco sobre superfície sem atrito acelera no sentido da força \(\vec{F}_1\).<br><br>
                        <b>(b) Soma de forças igual a zero:</b> Quando \(\vec{F}_2 = -\vec{F}_1\), a força resultante é nula (\(\sum \vec{F} = 0 \implies \vec{a} = 0\)).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide13" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.10: Aceleração por força única vs Equilíbrio por forças opostas.</div>
            </div>
        </div>

        <!-- SLIDE 14: Figura 4.11 Viajando em Veículo Acelerando -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 14 de 35</span>
                <h3 class="slide-title">Figura 4.11: Inércia Dentro de um Veículo</h3>
                <div class="slide-content">
                    <ul>
                        <li><b>(a) Arranque:</b> O veículo acelera para a frente; você tende a permanecer em repouso.</li>
                        <li><b>(b) Frenagem:</b> O veículo reduz a velocidade; você tende a continuar se movendo para a frente.</li>
                        <li><b>(c) Curva:</b> O veículo curva; você tende a continuar em linha reta.</li>
                    </ul>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide14" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.11: Efeitos da inércia em arranque, frenagem e curva.</div>
            </div>
        </div>

        <!-- SLIDE 15: Figura 4.12 Crash Test e 1ª Lei de Newton -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 15 de 35</span>
                <h3 class="slide-title">Figura 4.12: Bonecos de Teste de Colisão (Crash Test)</h3>
                <div class="slide-content">
                    <p>A partir do sistema de referência do carro, parece que uma força empurra os bonecos para a frente quando o carro freia repentinamente.</p>
                    <div class="highlight-box">
                        Conforme o carro pára, os bonecos continuam a se mover para a frente como consequência direta da <b>Primeira Lei de Newton</b> (Inércia).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide15" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.12: Inércia dos passageiros durante uma colisão frontal.</div>
            </div>
        </div>

        <!-- SLIDE 16: Segunda Lei de Newton (F = ma) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 16 de 35</span>
                <h3 class="slide-title">Segunda Lei de Newton: Massa e Aceleração</h3>
                <div class="slide-content">
                    <p>A aceleração de um corpo é diretamente proporcional à soma vetorial das forças e inversamente proporcional à sua massa:</p>
                    <div class="highlight-box">
                        \[ \sum \vec{F} = m \vec{a} \implies \begin{cases} \sum F_x = m a_x \\ \sum F_y = m a_y \\ \sum F_z = m a_z \end{cases} \]
                    </div>
                    <p>Unidade no SI: <b>Newton (N)</b> \(1\text{ N} = 1\text{ kg} \cdot \text{m/s}^2\).</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide16" width="360" height="240"></canvas>
                <div class="figure-caption">Segunda Lei de Newton em componentes cartesiana.</div>
            </div>
        </div>

        <!-- SLIDE 17: Figura 4.13 Disco de Hóquei sob Força Resultante -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 17 de 35</span>
                <h3 class="slide-title">Figura 4.13: Efeito da Força Resultante na Aceleração</h3>
                <div class="slide-content">
                    <ul>
                        <li><b>(a) \(\sum \vec{F} = 0 \implies \vec{a} = 0\):</b> Disco com velocidade constante em equilíbrio.</li>
                        <li><b>(b) Força no sentido do movimento:</b> Provoca aceleração constante no mesmo sentido de \(\vec{v}\).</li>
                        <li><b>(c) Força em sentido oposto:</b> Provoca desaceleração no sentido oposto a \(\vec{v}\).</li>
                    </ul>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide17" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.13: Força resultante e aceleração no disco de hóquei.</div>
            </div>
        </div>

        <!-- SLIDE 18: Figura 4.14 Movimento Circular Uniforme -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 18 de 35</span>
                <h3 class="slide-title">Figura 4.14: Visão Aérea de Movimento Circular</h3>
                <div class="slide-content">
                    <p>Um disco preso a uma corda gira em movimento circular uniforme sobre mesa sem atrito:</p>
                    <div class="highlight-box">
                        Em todos os pontos, a aceleração \(\vec{a}\) e a força resultante \(\sum \vec{F}\) apontam no <b>mesmo sentido</b> — sempre orientadas para o centro do círculo (centrípeta).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide18" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.14: Força resultante centrípeta em rotação circular.</div>
            </div>
        </div>

        <!-- SLIDE 19: Figura 4.15 Proporcionalidade Direta F e a -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 19 de 35</span>
                <h3 class="slide-title">Figura 4.15: Aceleração Proporcional à Força</h3>
                <div class="slide-content">
                    <p>Para um corpo de massa constante \(m\):</p>
                    <div class="highlight-box">
                        (a) Força \(\vec{F}_1 \implies\) aceleração \(\vec{a}\)<br>
                        (b) Dobrando a força (\(2\vec{F}_1\)) \(\implies\) dobra a aceleração (\(2\vec{a}\))<br>
                        (c) Metade da força (\(\frac{1}{2}\vec{F}_1\)) \(\implies\) metade da aceleração (\(\frac{\vec{a}}{2}\))
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide19" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.15: Relação linear entre módulo da força e aceleração.</div>
            </div>
        </div>

        <!-- SLIDE 20: Figura 4.16 Proporcionalidade Inversa m e a -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 20 de 35</span>
                <h3 class="slide-title">Figura 4.16: Aceleração Inversamente Proporcional à Massa</h3>
                <div class="slide-content">
                    <p>Aplicando uma mesma força resultante \(\sum \vec{F}\):</p>
                    <div class="highlight-box">
                        (a) Massa \(m_1 \implies\) aceleração \(\vec{a}_1\)<br>
                        (b) Massa maior \(m_2 \implies\) aceleração menor \(\vec{a}_2\)<br>
                        (c) Massa composta \(m_1 + m_2 \implies\) aceleração ainda menor \(\vec{a}_3\)
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide20" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.16: Inversão da aceleração em função da massa.</div>
            </div>
        </div>

        <!-- SLIDE 21: Figura 4.17 Motocicleta de Alto Desempenho -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 21 de 35</span>
                <h3 class="slide-title">Figura 4.17: Aplicação Prática - Motocicletas</h3>
                <div class="slide-content">
                    <p>O projeto de uma motocicleta de corrida depende fundamentalmente da Segunda Lei de Newton (\(a = F/m\)):</p>
                    <div class="highlight-box">
                        <b>Para maximizar a aceleração:</b><br>
                        1. Maximizar a força motriz \(F\) (Motor potente).<br>
                        2. Minimizar a massa \(m\) (Chassi ultraleve).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide21" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.17: Maximização de \(a\) combinando grande \(F\) e pequena \(m\).</div>
            </div>
        </div>

        <!-- SLIDE 22: Figura 4.18 Caixa Empurrada em Piso Encerado -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 22 de 35</span>
                <h3 class="slide-title">Figura 4.18: Exemplo de Caixa Empurrada</h3>
                <div class="slide-content">
                    <p>Caixa de \(m = 40\text{ kg}\) empurrada com força \(F = 20\text{ N}\) sobre piso sem atrito:</p>
                    <div class="highlight-box">
                        <b>Vertical:</b> \(a_y = 0 \implies n - p = 0 \implies n = p = m g\)<br>
                        <b>Horizontal:</b> \(\sum F_x = F = m a_x \implies a_x = \frac{20\text{ N}}{40\text{ kg}} = 0,5\text{ m/s}^2\)
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide22" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.18: DCL e equações de movimento da caixa.</div>
            </div>
        </div>

        <!-- SLIDE 23: Figura 4.19 Pote Deslizando com Atrito -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 23 de 35</span>
                <h3 class="slide-title">Figura 4.19: Pote de Vidro Deslizando com Atrito</h3>
                <div class="slide-content">
                    <p>Pote de \(m = 0,45\text{ kg}\) lançado com \(v_{0x} = 2,8\text{ m/s}\) percorre \(1,0\text{ m}\) até parar:</p>
                    <div class="highlight-box">
                        \[ v_x^2 = v_{0x}^2 + 2 a_x x \implies 0 = (2,8)^2 + 2 a_x (1,0) \implies a_x = -3,92\text{ m/s}^2 \]
                        \[ f = m |a_x| = (0,45\text{ kg})(3,92\text{ m/s}^2) = 1,76\text{ N} \]
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide23" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.19: Frenagem do pote por força de atrito constante.</div>
            </div>
        </div>

        <!-- SLIDE 24: Figura 4.20 Escala de Massa de Uma Lesma -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 24 de 35</span>
                <h3 class="slide-title">Figura 4.20: Unidades de Massa - Slug e Gramas</h3>
                <div class="slide-content">
                    <p>Comparação de ordens de grandeza de massa em diferentes sistemas de unidades:</p>
                    <div class="highlight-box">
                        Uma lesma típica de jardim possui massa de aproximadamente \(10^{-3}\text{ slug}\), o que equivale a cerca de \(15\text{ gramas}\) (ou \(0,015\text{ kg}\)).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide24" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.20: Ilusão de escala e equivalência de unidades de massa.</div>
            </div>
        </div>

        <!-- SLIDE 25: Definição de Peso -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 25 de 35</span>
                <h3 class="slide-title">Definição Rigorosa de Peso</h3>
                <div class="slide-content">
                    <p>O <b>peso \(\vec{p}\)</b> de um corpo é a força de atração gravitacional exercida pela Terra sobre o corpo:</p>
                    <div class="highlight-box">
                        \[ \vec{p} = m \vec{g} \]
                    </div>
                    <p>O peso depende do local (varia com \(g\)), porém a massa \(m\) é constante em qualquer ponto do universo.</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide25" width="360" height="240"></canvas>
                <div class="figure-caption">Relação entre vetor peso \(\vec{p}\) e aceleração da gravidade \(\vec{g}\).</div>
            </div>
        </div>

        <!-- SLIDE 26: Figura 4.21 Queda Livre vs Corpo Suspenso -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 26 de 35</span>
                <h3 class="slide-title">Figura 4.21: Corpo em Queda Livre vs Suspenso</h3>
                <div class="slide-content">
                    <div class="highlight-box">
                        <b>Corpo em Queda Livre:</b> \(\vec{a} = \vec{g}\), a única força atuante é o peso \(\sum \vec{F} = \vec{p} = m\vec{g}\).<br><br>
                        <b>Corpo Suspenso por Fio:</b> \(\vec{a} = 0\), a tensão cancela o peso \(\sum \vec{F} = \vec{T} - \vec{p} = 0 \implies T = p = m g\).
                    </div>
                    <p>A relação \(p = mg\) é a mesma esteja o corpo caindo ou parado!</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide26" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.21: A relação entre massa e peso nos dois estados.</div>
            </div>
        </div>

        <!-- SLIDE 27: Figura 4.22 Queda Livre de Moeda -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 27 de 35</span>
                <h3 class="slide-title">Figura 4.22: Aceleração Constante em Queda Livre</h3>
                <div class="slide-content">
                    <p>A aceleração de um objeto em queda livre (desprezando a resistência do ar) é constante:</p>
                    <div class="highlight-box">
                        \[ \vec{a} = \vec{g} \implies \sum \vec{F} = \vec{p} \]
                    </div>
                    <p>Tanto a força resultante quanto a aceleração permanecem invariáveis durante toda a descida.</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide27" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.22: Aceleração e força resultante em queda livre.</div>
            </div>
        </div>

        <!-- SLIDE 28: Figura 4.23 Peso na Terra vs Peso na Lua -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 28 de 35</span>
                <h3 class="slide-title">Figura 4.23: Medição de Peso na Terra vs Lua</h3>
                <div class="slide-content">
                    <p>Para um mesmo corpo de massa constante \(m = 1,0\text{ kg}\):</p>
                    <div class="highlight-box">
                        <b>(a) Na Terra (\(g = 9,80\text{ m/s}^2\)):</b><br>
                        \(p = m g = 1,0 \times 9,80 = 9,80\text{ N}\)<br><br>
                        <b>(b) Na Lua (\(g = 1,62\text{ m/s}^2\)):</b><br>
                        \(p = m g = 1,0 \times 1,62 = 1,62\text{ N}\)
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide28" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.23: Variação da leitura do dinamômetro conforme a gravidade local.</div>
            </div>
        </div>

        <!-- SLIDE 29: Figura 4.24 Balança de Braços Iguais -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 29 de 35</span>
                <h3 class="slide-title">Figura 4.24: Balança de Braços Iguais</h3>
                <div class="slide-content">
                    <p>Uma balança de braços iguais compara a massa de um corpo (ex: maçã) com uma massa padrão conhecida:</p>
                    <div class="highlight-box">
                        Como ambos os pratos estão sujeitos à mesma aceleração da gravidade local \(g\), o equilíbrio dos torques/pesos (\(p_{desc} = p_{conh}\)) implica igualdade direta das massas (\(m_{desc} = m_{conh}\)).
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide29" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.24: Balança de braços iguais medindo massa por comparação.</div>
            </div>
        </div>

        <!-- SLIDE 30: Terceira Lei de Newton (Ação e Reação) -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 30 de 35</span>
                <h3 class="slide-title">Terceira Lei de Newton e Pares Ação-Reação</h3>
                <div class="slide-content">
                    <p>Quando dois corpos interagem, a força que o primeiro exerce sobre o segundo é exatamente igual em módulo e oposta em sentido à força que o segundo exerce sobre o primeiro:</p>
                    <div class="highlight-box">
                        \[ \vec{F}_{A \text{ em } B} = - \vec{F}_{B \text{ em } A} \]
                    </div>
                    <p><b>Regra de Ouro:</b> Cada força de um par de ação e reação atua separadamente em corpos DIFERENTES!</p>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide30" width="360" height="240"></canvas>
                <div class="figure-caption">Par ação e reação ao chutar uma bola.</div>
            </div>
        </div>

        <!-- SLIDE 31: Figura 4.25 Detalhe do Chute na Bola -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 31 de 35</span>
                <h3 class="slide-title">Figura 4.25: Interação Pé e Bola</h3>
                <div class="slide-content">
                    <p>Quando o pé (corpo A) exerce uma força \(\vec{F}_{A \text{ em } B}\) na bola (corpo B):</p>
                    <div class="highlight-box">
                        A bola responde exercendo a força \(\vec{F}_{B \text{ em } A}\) de mesmo módulo, mesma direção e sentido oposto no pé do jogador.
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide31" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.25: Vetores de força aplicados no pé e na bola.</div>
            </div>
        </div>

        <!-- SLIDE 32: Figura 4.26 Erro Comum: Maçã sobre a Mesa -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 32 de 35</span>
                <h3 class="slide-title">Figura 4.26: Identificação Correta dos Pares</h3>
                <div class="slide-content">
                    <p>As duas forças que atuam SOBRE a maçã (Normal e Peso) NÃO formam um par de ação e reação!</p>
                    <div class="highlight-box">
                        <b>Par 1 (Gravidade):</b> Força da Terra na maçã \(\leftrightarrow\) Força da maçã na Terra.<br><br>
                        <b>Par 2 (Contato):</b> Força da mesa na maçã \(\leftrightarrow\) Força da maçã na mesa.
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide32" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.26: Separação dos pares de ação e reação.</div>
            </div>
        </div>

        <!-- SLIDE 33: Figura 4.27 Pedreiro Puxando Corda e Bloco -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 33 de 35</span>
                <h3 class="slide-title">Figura 4.27: Pedreiro Puxando Bloco por Corda</h3>
                <div class="slide-content">
                    <p>Análise de forças no sistema pedreiro-corda-bloco:</p>
                    <ul>
                        <li><b>(b) Pares reais:</b> Pedreiro puxa corda (\(\vec{F}_{P \text{ em } C}\)) \(\leftrightarrow\) Corda puxa pedreiro.</li>
                        <li><b>(c) NÃO são pares:</b> Força do bloco na corda e do pedreiro na corda (atuam no mesmo objeto: a corda).</li>
                        <li><b>(d) Corda sem massa:</b> As trações nas extremidades são iguais em módulo.</li>
                    </ul>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide33" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.27: Identificação de forças no cabo de guerra com bloco.</div>
            </div>
        </div>

        <!-- SLIDE 34: Figura 4.28 Forças Horizontais no Bloco e Pedreiro -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 34 de 35</span>
                <h3 class="slide-title">Figura 4.28: Atrito no Bloco e no Pedreiro</h3>
                <div class="slide-content">
                    <p>Como o bloco consegue se mover?</p>
                    <div class="highlight-box">
                        <b>Bloco + Corda:</b> Desliza porque a força de puxar \(\vec{F}_{P \text{ em } C}\) supera o atrito do piso no bloco.<br><br>
                        <b>Pedreiro:</b> Permanece firme em repouso porque a reação \(\vec{F}_{C \text{ em } P}\) é contrabalançada pela força de atrito dos sapatos com o piso.
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide34" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.28: Papel do atrito para mover o bloco e segurar o pedreiro.</div>
            </div>
        </div>

        <!-- SLIDE 35: Figura 4.29 O Fato de Caminhar -->
        <div class="slide">
            <div>
                <span class="slide-num-badge">Slide 35 de 35</span>
                <h3 class="slide-title">Figura 4.29: A Física do Caminhar</h3>
                <div class="slide-content">
                    <p>O simples fato de caminhar depende fundamentalmente da Terceira Lei de Newton:</p>
                    <div class="highlight-box">
                        1. Para se mover para a frente, você <b>empurra o solo para trás</b> com os pés.<br><br>
                        2. Em reação, o solo <b>empurra seus pés para a frente</b> com uma força de mesmo módulo.<br><br>
                        É essa força externa fornecida pelo solo que produz a aceleração do seu corpo para a frente!
                    </div>
                </div>
            </div>
            <div class="canvas-container">
                <canvas id="cvSlide35" width="360" height="240"></canvas>
                <div class="figure-caption">Figura 4.29: Força externa de reação do solo ao caminhar.</div>
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

        // Preencher dropdown de slides
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

        // Desenhar simulação específica para cada um dos 35 slides
        function drawCanvasForSlide(slideNum) {
            const canvasId = `cvSlide${slideNum}`;
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,360,240);

            if (slideNum === 2) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,120,70,60);
                drawArrow(ctx, 130, 150, 260, 150, "#22c55e", "Fx");
                drawArrow(ctx, 130, 150, 130, 70, "#a855f7", "Fy");
                drawArrow(ctx, 130, 150, 260, 70, "#fbbf24", "R");
            } else if (slideNum === 3) {
                ctx.fillStyle="#a855f7"; ctx.fillRect(40,80,60,60);
                drawArrow(ctx, 100, 110, 200, 110, "#38bdf8", "Empurrar F");
                ctx.fillStyle="#a855f7"; ctx.fillRect(200,140,60,60);
                drawArrow(ctx, 260, 170, 340, 170, "#22c55e", "Puxar F");
            } else if (slideNum === 4) {
                // Quatro tipos de forca
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,40,40,40); drawArrow(ctx, 80, 40, 80, 10, "#22c55e", "n");
                ctx.fillStyle="#38bdf8"; ctx.fillRect(220,40,40,40); drawArrow(ctx, 220, 75, 180, 75, "#ef4444", "f");
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,150,40,40); drawArrow(ctx, 80, 150, 40, 120, "#fbbf24", "T");
                ctx.fillStyle="#38bdf8"; ctx.fillRect(220,150,40,40); drawArrow(ctx, 240, 190, 240, 230, "#a855f7", "p");
            } else if (slideNum === 5) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,120,70,60);
                drawArrow(ctx, 130, 130, 250, 70, "#fbbf24", "10 N (30°)");
            } else if (slideNum === 6) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,130,70,60);
                drawArrow(ctx, 130, 130, 240, 130, "#38bdf8", "F1");
                drawArrow(ctx, 130, 130, 210, 50, "#a855f7", "F2");
                drawArrow(ctx, 130, 130, 320, 50, "#22c55e", "R");
            } else if (slideNum === 7) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,130,70,60);
                drawArrow(ctx, 130, 140, 260, 60, "#fbbf24", "F");
                drawArrow(ctx, 130, 180, 260, 180, "#38bdf8", "Fx");
                drawArrow(ctx, 60, 140, 60, 60, "#a855f7", "Fy");
            } else if (slideNum === 8) {
                ctx.strokeStyle="#475569"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(40,210); ctx.lineTo(320,210); ctx.lineTo(320,70); ctx.closePath(); ctx.stroke();
                ctx.save(); ctx.translate(180,140); ctx.rotate(-Math.PI/6);
                ctx.fillStyle="#38bdf8"; ctx.fillRect(-25,-25,50,25);
                drawArrow(ctx, 0, -12, 70, -12, "#22c55e", "Fx");
                drawArrow(ctx, 0, -12, 0, -60, "#fbbf24", "Fy");
                ctx.restore();
            } else if (slideNum === 9) {
                drawArrow(ctx, 60, 200, 160, 200, "#38bdf8", "F1x");
                drawArrow(ctx, 160, 200, 260, 200, "#a855f7", "F2x");
                drawArrow(ctx, 60, 200, 260, 70, "#22c55e", "R = ∑F");
            } else if (slideNum === 10) {
                drawArrow(ctx, 180, 140, 100, 60, "#38bdf8", "F1");
                drawArrow(ctx, 180, 140, 240, 140, "#a855f7", "F2");
                drawArrow(ctx, 180, 140, 180, 210, "#ef4444", "F3");
                drawArrow(ctx, 180, 140, 100, 90, "#22c55e", "R (141°)");
            } else if (slideNum === 11) {
                ctx.fillStyle="#eab308"; ctx.beginPath(); ctx.arc(180,120,30,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 110, 120, 150, 120, "#38bdf8", "F1");
                drawArrow(ctx, 250, 120, 210, 120, "#ef4444", "F2=-F1");
                ctx.fillStyle="#22c55e"; ctx.font="bold 15px sans-serif"; ctx.fillText("v = constante (a = 0)", 110, 60);
            } else if (slideNum === 12) {
                ctx.fillStyle="#cbd5e1"; ctx.fillRect(40,70,80,20); ctx.fillText("Mesa (Atrito)", 40, 60);
                ctx.fillStyle="#38bdf8"; ctx.fillRect(140,70,80,20); ctx.fillText("Gelo", 140, 60);
                ctx.fillStyle="#a855f7"; ctx.fillRect(240,70,80,20); ctx.fillText("Colchão de ar", 240, 60);
            } else if (slideNum === 13) {
                ctx.fillStyle="#38bdf8"; ctx.beginPath(); ctx.arc(100,120,25,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 75, 120, 150, 120, "#22c55e", "F1 (a > 0)");
                ctx.fillStyle="#a855f7"; ctx.beginPath(); ctx.arc(260,120,25,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 210, 120, 235, 120, "#38bdf8", "F1");
                drawArrow(ctx, 310, 120, 285, 120, "#ef4444", "F2");
            } else if (slideNum === 14) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,100,240,80);
                ctx.fillStyle="#ef4444"; ctx.beginPath(); ctx.arc(180,140,15,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 180, 80, 260, 80, "#fbbf24", "Inércia");
            } else if (slideNum === 15) {
                ctx.fillStyle="#ef4444"; ctx.fillRect(140,90,80,80);
                ctx.fillStyle="#fff"; ctx.font="bold 14px sans-serif"; ctx.fillText("Crash Dummy", 145, 135);
                drawArrow(ctx, 220, 130, 300, 130, "#22c55e", "v_inércia");
            } else if (slideNum === 16) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(120,100,100,70);
                drawArrow(ctx, 220, 135, 310, 135, "#22c55e", "∑F");
                drawArrow(ctx, 220, 110, 280, 110, "#fbbf24", "a = ∑F/m");
            } else if (slideNum === 17) {
                ctx.fillStyle="#eab308"; ctx.beginPath(); ctx.arc(80,120,20,0,Math.PI*2); ctx.fill();
                ctx.fillStyle="#eab308"; ctx.beginPath(); ctx.arc(180,120,20,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 180, 120, 240, 120, "#22c55e", "a ->");
                ctx.fillStyle="#eab308"; ctx.beginPath(); ctx.arc(280,120,20,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 280, 120, 230, 120, "#ef4444", "a <-");
            } else if (slideNum === 18) {
                ctx.strokeStyle="#38bdf8"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(180,120,60,0,Math.PI*2); ctx.stroke();
                drawArrow(ctx, 180, 60, 180, 100, "#ef4444", "∑F");
                drawArrow(ctx, 180, 60, 240, 60, "#22c55e", "v");
            } else if (slideNum === 19) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(40,60,40,30); drawArrow(ctx, 80, 75, 130, 75, "#22c55e", "a");
                ctx.fillStyle="#38bdf8"; ctx.fillRect(40,110,40,30); drawArrow(ctx, 80, 125, 180, 125, "#22c55e", "2a");
                ctx.fillStyle="#38bdf8"; ctx.fillRect(40,160,40,30); drawArrow(ctx, 80, 175, 105, 175, "#22c55e", "a/2");
            } else if (slideNum === 20) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(40,60,40,30); drawArrow(ctx, 80, 75, 150, 75, "#22c55e", "a1");
                ctx.fillStyle="#a855f7"; ctx.fillRect(40,110,70,30); drawArrow(ctx, 110, 125, 150, 125, "#22c55e", "a2");
                ctx.fillStyle="#fbbf24"; ctx.fillRect(40,160,110,30); drawArrow(ctx, 150, 175, 175, 175, "#22c55e", "a3");
            } else if (slideNum === 21) {
                ctx.fillStyle="#ef4444"; ctx.beginPath(); ctx.arc(180,120,40,0,Math.PI*2); ctx.fill();
                ctx.fillStyle="#fff"; ctx.font="bold 14px sans-serif"; ctx.fillText("F grande", 150, 100); ctx.fillText("m pequena", 145, 135);
            } else if (slideNum === 22) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(120,90,80,90);
                drawArrow(ctx, 40, 135, 120, 135, "#22c55e", "F = 20 N");
                drawArrow(ctx, 160, 90, 160, 30, "#fbbf24", "n");
                drawArrow(ctx, 160, 180, 160, 230, "#ef4444", "p = 392 N");
            } else if (slideNum === 23) {
                ctx.fillStyle="#a855f7"; ctx.fillRect(100,100,40,70);
                drawArrow(ctx, 140, 135, 220, 135, "#38bdf8", "v0 = 2,8 m/s");
                drawArrow(ctx, 100, 135, 40, 135, "#ef4444", "f = 1,76 N");
            } else if (slideNum === 24) {
                ctx.fillStyle="#22c55e"; ctx.beginPath(); ctx.arc(180,120,25,0,Math.PI*2); ctx.fill();
                ctx.fillStyle="#fff"; ctx.font="bold 13px sans-serif"; ctx.fillText("Lesma ~15g", 145, 125);
            } else if (slideNum === 25) {
                ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(180,100,30,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 180, 100, 180, 190, "#ef4444", "p = m g");
                drawArrow(ctx, 220, 100, 220, 170, "#38bdf8", "g");
            } else if (slideNum === 26) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(70,90,50,50); drawArrow(ctx, 95, 140, 95, 200, "#ef4444", "p = mg");
                ctx.fillStyle="#38bdf8"; ctx.fillRect(240,90,50,50); drawArrow(ctx, 265, 140, 265, 200, "#ef4444", "p = mg");
                drawArrow(ctx, 265, 90, 265, 30, "#22c55e", "T = mg");
            } else if (slideNum === 27) {
                ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(180,80,20,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 180, 80, 180, 190, "#ef4444", "p = mg");
            } else if (slideNum === 28) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(70,100,50,50); ctx.fillStyle="#fff"; ctx.fillText("Terra (9,8N)", 55, 170);
                ctx.fillStyle="#a855f7"; ctx.fillRect(240,100,50,50); ctx.fillStyle="#fff"; ctx.fillText("Lua (1,62N)", 230, 170);
            } else if (slideNum === 29) {
                ctx.strokeStyle="#475569"; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(60,100); ctx.lineTo(300,100); ctx.moveTo(180,100); ctx.lineTo(180,180); ctx.stroke();
                ctx.fillStyle="#ef4444"; ctx.beginPath(); ctx.arc(80,130,20,0,Math.PI*2); ctx.fill();
                ctx.fillStyle="#22c55e"; ctx.fillRect(260,110,40,40);
            } else if (slideNum === 30) {
                ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(200,120,25,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 200, 120, 290, 80, "#22c55e", "F_A em B");
                drawArrow(ctx, 185, 120, 110, 150, "#ef4444", "F_B em A");
            } else if (slideNum === 31) {
                ctx.fillStyle="#38bdf8"; ctx.beginPath(); ctx.arc(200,120,30,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 200, 120, 300, 70, "#22c55e", "F_A/B");
                drawArrow(ctx, 180, 120, 90, 160, "#ef4444", "F_B/A");
            } else if (slideNum === 32) {
                ctx.fillStyle="#ef4444"; ctx.beginPath(); ctx.arc(180,100,20,0,Math.PI*2); ctx.fill();
                drawArrow(ctx, 180, 100, 180, 40, "#22c55e", "F_mesa/maçã");
                drawArrow(ctx, 180, 100, 180, 160, "#fbbf24", "F_Terra/maçã");
            } else if (slideNum === 33) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,90,50,80);
                drawArrow(ctx, 110, 130, 200, 130, "#22c55e", "F_C em P");
                drawArrow(ctx, 220, 130, 130, 130, "#ef4444", "F_P em C");
            } else if (slideNum === 34) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(60,90,50,80);
                drawArrow(ctx, 60, 130, 10, 130, "#ef4444", "f_atrito");
                drawArrow(ctx, 110, 130, 190, 130, "#22c55e", "F_tração");
            } else if (slideNum === 35) {
                ctx.fillStyle="#38bdf8"; ctx.fillRect(160,80,40,90);
                drawArrow(ctx, 180, 170, 100, 200, "#ef4444", "Pé empurra solo");
                drawArrow(ctx, 180, 170, 260, 140, "#22c55e", "Solo empurra pé");
            }
        }

        window.onload = () => {
            updateSlide();
        };
    </script>
</body>
</html>
"""

os.makedirs(os.path.dirname(target_path), exist_ok=True)
with open(target_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Successfully fixed MathJax syntax errors in apresentacao.html!")
