import os

target_path = r"C:\Users\haas\github\demos\fisica-1\revisao_123.html"

html_content = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz de Revisão Geral - Física 1, 2 e 3</title>
    <!-- MathJax for rendering LaTeX math formulas -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0f172a;
            --bg-card: #1e293b;
            --bg-card-hover: #334155;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent-blue: #38bdf8;
            --accent-green: #22c55e;
            --accent-red: #ef4444;
            --accent-yellow: #eab308;
            --accent-purple: #a855f7;
            --border-color: #475569;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: var(--bg-primary);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }

        header {
            width: 100%;
            max-width: 900px;
            text-align: center;
            margin-bottom: 25px;
            padding: 20px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 16px;
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        header h1 {
            font-size: 2rem;
            color: var(--accent-blue);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }

        header p {
            color: var(--text-muted);
            font-size: 1rem;
        }

        .controls-bar {
            width: 100%;
            max-width: 900px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            background: var(--bg-card);
            padding: 15px 20px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }

        .filter-group {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        .filter-btn {
            background: #0f172a;
            color: var(--text-main);
            border: 1px solid var(--border-color);
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.2s;
        }

        .filter-btn:hover {
            border-color: var(--accent-blue);
            color: var(--accent-blue);
        }

        .filter-btn.active {
            background: var(--accent-blue);
            color: #0f172a;
            border-color: var(--accent-blue);
        }

        .audio-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #0f172a;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .audio-btn {
            background: transparent;
            border: none;
            color: var(--accent-blue);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px 8px;
            transition: transform 0.1s;
        }

        .audio-btn:hover {
            transform: scale(1.15);
        }

        .speed-select {
            background: var(--bg-card);
            color: var(--text-main);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 0.85rem;
        }

        .quiz-container {
            width: 100%;
            max-width: 900px;
            background: var(--bg-card);
            border-radius: 16px;
            border: 1px solid var(--border-color);
            padding: 25px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .badge-info {
            display: flex;
            gap: 10px;
        }

        .badge {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-f1 { background: rgba(56, 189, 248, 0.2); color: var(--accent-blue); border: 1px solid var(--accent-blue); }
        .badge-f2 { background: rgba(168, 85, 247, 0.2); color: var(--accent-purple); border: 1px solid var(--accent-purple); }
        .badge-f3 { background: rgba(234, 179, 8, 0.2); color: var(--accent-yellow); border: 1px solid var(--accent-yellow); }

        .badge-facil { background: rgba(34, 197, 94, 0.2); color: var(--accent-green); border: 1px solid var(--accent-green); }
        .badge-moderada { background: rgba(234, 179, 8, 0.2); color: var(--accent-yellow); border: 1px solid var(--accent-yellow); }
        .badge-dificil { background: rgba(239, 68, 68, 0.2); color: var(--accent-red); border: 1px solid var(--accent-red); }

        .progress-bar-container {
            width: 100%;
            height: 8px;
            background: #0f172a;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
            width: 0%;
            transition: width 0.3s ease;
        }

        .question-box {
            margin-bottom: 20px;
        }

        .question-title {
            font-size: 1.25rem;
            line-height: 1.6;
            margin-bottom: 15px;
            color: #ffffff;
        }

        .diagram-container {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 15px 0 25px 0;
            background: #0f172a;
            border-radius: 12px;
            padding: 15px;
            border: 1px solid var(--border-color);
        }

        canvas {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }

        .options-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 20px;
        }

        .option-btn {
            background: #0f172a;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 14px 18px;
            border-radius: 10px;
            text-align: left;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .option-btn:hover:not(:disabled) {
            background: var(--bg-card-hover);
            border-color: var(--accent-blue);
        }

        .option-btn.selected {
            border-color: var(--accent-blue);
            background: rgba(56, 189, 248, 0.15);
        }

        .option-btn.correct {
            background: rgba(34, 197, 94, 0.25) !important;
            border-color: var(--accent-green) !important;
            color: #ffffff;
        }

        .option-btn.wrong {
            background: rgba(239, 68, 68, 0.25) !important;
            border-color: var(--accent-red) !important;
            color: #ffffff;
        }

        .option-letter {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--bg-card);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
            border: 1px solid var(--border-color);
            flex-shrink: 0;
        }

        .hint-btn {
            background: transparent;
            border: 1px dashed var(--accent-yellow);
            color: var(--accent-yellow);
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-bottom: 15px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }

        .hint-btn:hover {
            background: rgba(234, 179, 8, 0.1);
        }

        .hint-box {
            display: none;
            background: rgba(234, 179, 8, 0.1);
            border-left: 4px solid var(--accent-yellow);
            padding: 12px 16px;
            border-radius: 4px 8px 8px 4px;
            margin-bottom: 20px;
            color: #fef08a;
            font-size: 0.95rem;
        }

        .explanation-box {
            display: none;
            background: #0f172a;
            border-left: 4px solid var(--accent-blue);
            padding: 18px;
            border-radius: 4px 12px 12px 4px;
            margin-bottom: 20px;
            border: 1px solid var(--border-color);
        }

        .explanation-box h4 {
            color: var(--accent-blue);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .explanation-box p {
            line-height: 1.6;
            color: #cbd5e1;
        }

        .action-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }

        .btn-primary {
            background: var(--accent-blue);
            color: #0f172a;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .score-telemetry {
            display: flex;
            gap: 20px;
            font-weight: 600;
            font-size: 1rem;
        }

        .score-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Scorecard Final Screen */
        .scorecard {
            display: none;
            text-align: center;
            padding: 30px;
        }

        .scorecard h2 {
            font-size: 2.2rem;
            color: var(--accent-blue);
            margin-bottom: 15px;
        }

        .medal-icon {
            font-size: 4rem;
            margin: 20px 0;
            color: var(--accent-yellow);
        }

        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 25px 0;
        }

        .stat-card {
            background: #0f172a;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }

        .stat-value {
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--accent-blue);
        }

        .stat-label {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-top: 4px;
        }

        @media (max-width: 600px) {
            .controls-bar {
                flex-direction: column;
                align-items: stretch;
            }
            .filter-group {
                justify-content: center;
            }
            .action-bar {
                flex-direction: column;
                gap: 15px;
            }
            .btn-primary {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>

    <header>
        <h1><i class="fa-solid fa-atom"></i> Quiz de Revisão: Física 1, 2 e 3</h1>
        <p>30 Questões Completas com Diagramas Gráficos, Voz e Resoluções Detalhadas</p>
    </header>

    <div class="controls-bar">
        <div class="filter-group">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold;">Disciplina:</span>
            <button class="filter-btn active" onclick="setDiscipline('todas')">Todas</button>
            <button class="filter-btn" onclick="setDiscipline('Física 1')">Física 1</button>
            <button class="filter-btn" onclick="setDiscipline('Física 2')">Física 2</button>
            <button class="filter-btn" onclick="setDiscipline('Física 3')">Física 3</button>
        </div>

        <div class="audio-controls">
            <button class="audio-btn" onclick="playVoice()" title="Ouvir Pergunta"><i class="fa-solid fa-volume-high"></i></button>
            <button class="audio-btn" onclick="pauseVoice()" title="Pausar"><i class="fa-solid fa-pause"></i></button>
            <button class="audio-btn" onclick="stopVoice()" title="Parar"><i class="fa-solid fa-stop"></i></button>
            <select id="speechRate" class="speed-select" onchange="updateRate()">
                <option value="0.75">0.75x</option>
                <option value="1.0" selected>1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
            </select>
        </div>
    </div>

    <div class="quiz-container">
        <!-- Tela Ativa de Quiz -->
        <div id="quizScreen">
            <div class="progress-header">
                <div class="badge-info">
                    <span id="discBadge" class="badge badge-f1">Física 1</span>
                </div>
                <div class="score-telemetry">
                    <div class="score-item"><i class="fa-solid fa-fire" style="color: #f97316;"></i> <span id="streakCount">0</span></div>
                    <div class="score-item"><i class="fa-solid fa-star" style="color: #eab308;"></i> <span id="scoreCount">0</span></div>
                </div>
            </div>

            <div class="progress-bar-container">
                <div id="progressBar" class="progress-bar-fill"></div>
            </div>

            <div class="question-box">
                <h3 id="questionText" class="question-title">Carregando pergunta...</h3>
                
                <div class="diagram-container">
                    <canvas id="physicsCanvas" width="480" height="240"></canvas>
                </div>

                <button class="hint-btn" onclick="toggleHint()">
                    <i class="fa-solid fa-lightbulb"></i> <span id="hintBtnText">Ver Dica Interativa</span>
                </button>
                
                <div id="hintBox" class="hint-box"></div>

                <div id="optionsGrid" class="options-grid"></div>

                <div id="explanationBox" class="explanation-box">
                    <h4><i class="fa-solid fa-book-open"></i> Resolução Didática Passo a Passo</h4>
                    <p id="explanationText"></p>
                </div>
            </div>

            <div class="action-bar">
                <span id="questionCounter" style="color: var(--text-muted); font-size: 0.9rem;">Questão 1 de 30</span>
                <button id="nextBtn" class="btn-primary" onclick="handleNextAction()" disabled>
                    <span>Confirmar Resposta</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- Tela Final (Scorecard) -->
        <div id="scorecardScreen" class="scorecard">
            <h2><i class="fa-solid fa-trophy"></i> Quiz Concluído!</h2>
            <p style="color: var(--text-muted);">Confira seu desempenho geral na revisão de Física 1, 2 e 3:</p>
            
            <div id="medalContainer" class="medal-icon">
                <i class="fa-solid fa-award"></i>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div id="finalScore" class="stat-value">0</div>
                    <div class="stat-label">Pontuação Total</div>
                </div>
                <div class="stat-card">
                    <div id="finalAccuracy" class="stat-value">0%</div>
                    <div class="stat-label">Taxa de Acerto</div>
                </div>
                <div class="stat-card">
                    <div id="finalMaxStreak" class="stat-value">0</div>
                    <div class="stat-label">Maior Sequência</div>
                </div>
            </div>

            <button class="btn-primary" style="margin: 0 auto;" onclick="restartQuiz()">
                <i class="fa-solid fa-rotate-right"></i> Reiniciar Quiz
            </button>
        </div>
    </div>

    <script>
        // Banco com 30 Questões
        const questionsBank = [
            // --- FÍSICA 1 ---
            {
                id: 1, discipline: "Física 1", difficulty: "Fácil",
                question: "Um automóvel viaja com velocidade constante de 72 km/h (20 m/s) ao longo de uma pista retilínea. Qual é a distância percorrida pelo veículo após 15 segundos?",
                options: ["200 m", "300 m", "400 m", "1080 m"],
                correct: 1,
                hint: "Converta a velocidade para m/s (72 / 3,6 = 20 m/s) e use a fórmula do MRU: \\\\(\\Delta s = v \\\\cdot t\\\\).",
                explanation: "Para calcular o deslocamento em Movimento Retilíneo Uniforme (MRU):<br>1) Velocidade: \\\\(v = 72 \\\\text{ km/h} = 20 \\\\text{ m/s}\\\\).<br>2) Tempo: \\\\(t = 15 \\\\text{ s}\\\\).<br>3) Deslocamento: \\\\(\\Delta s = v \\\\cdot t = 20 \\\\times 15 = 300 \\\\text{ m}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Pista
                    ctx.strokeStyle = "#475569"; ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.moveTo(40, 180); ctx.lineTo(440, 180); ctx.stroke();
                    // Carro
                    ctx.fillStyle = "#38bdf8"; ctx.fillRect(80, 140, 70, 35);
                    ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(100, 175, 10, 0, Math.PI*2); ctx.arc(130, 175, 10, 0, Math.PI*2); ctx.fill();
                    // Vetor velocidade
                    drawArrow(ctx, 150, 155, 230, 155, "#22c55e", "v = 20 m/s");
                }
            },
            {
                id: 2, discipline: "Física 1", difficulty: "Fácil",
                question: "Um bloco de massa m = 5 kg é puxado por uma força resultante horizontal constante de 25 N sobre uma superfície horizontal sem atrito. Qual é a aceleração do bloco?",
                options: ["2 m/s²", "5 m/s²", "10 m/s²", "125 m/s²"],
                correct: 1,
                hint: "Aplique a Segunda Lei de Newton: \\\\(F_{res} = m \\\\cdot a\\\\).",
                explanation: "Pela Segunda Lei de Newton:<br>\\\\(F = m \\\\cdot a \\\\implies a = \\\\frac{F}{m} = \\\\frac{25 \\\\text{ N}}{5 \\\\text{ kg}} = 5 \\\\text{ m/s}^2\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Solo
                    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(40, 180); ctx.lineTo(440, 180); ctx.stroke();
                    // Bloco
                    ctx.fillStyle = "#a855f7"; ctx.fillRect(180, 110, 80, 70);
                    ctx.fillStyle = "#ffffff"; ctx.font = "bold 16px sans-serif"; ctx.fillText("m = 5 kg", 190, 150);
                    // Força
                    drawArrow(ctx, 260, 145, 360, 145, "#eab308", "F = 25 N");
                }
            },
            {
                id: 3, discipline: "Física 1", difficulty: "Fácil",
                question: "Uma força constante de 40 N atua sobre um caixote paralelamente ao seu deslocamento de 6 metros. Qual é o trabalho realizado por essa força?",
                options: ["120 J", "240 J", "160 J", "400 J"],
                correct: 1,
                hint: "O trabalho de uma força constante paralela ao movimento é \\\\(W = F \\\\cdot d \\\\cdot \\\\cos(\\\\theta)\\\\), onde \\\\(\\cos(0^\\\\circ) = 1\\\\).",
                explanation: "O trabalho é dado por:<br>\\\\(W = F \\\\cdot d = 40 \\\\text{ N} \\\\times 6 \\\\text{ m} = 240 \\\\text{ Joules}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 180); ctx.lineTo(440, 180); ctx.stroke();
                    // Caixa inicio e fim
                    ctx.fillStyle = "#334155"; ctx.fillRect(80, 120, 60, 60);
                    ctx.fillStyle = "#38bdf8"; ctx.fillRect(320, 120, 60, 60);
                    // Seta deslocamento
                    drawArrow(ctx, 140, 200, 320, 200, "#38bdf8", "d = 6 m");
                    drawArrow(ctx, 80, 90, 160, 90, "#22c55e", "F = 40 N");
                }
            },
            {
                id: 4, discipline: "Física 1", difficulty: "Moderada",
                question: "Um projétil é lançado com velocidade de 50 m/s sob um ângulo onde sen(θ) = 0,6 e cos(θ) = 0,8. Adotando g = 9,8 m/s², qual é a altura máxima atingida pelo projétil?",
                options: ["30,0 m", "45,9 m", "60,0 m", "91,8 m"],
                correct: 1,
                hint: "A componente vertical da velocidade é \\\\(v_{0y} = v_0 \\\\cdot \\\\sen(\\\\theta)\\\\). A altura máxima é \\\\(H_{máx} = \\\\frac{v_{0y}^2}{2g}\\\\).",
                explanation: "1) Componente vertical: \\\\(v_{0y} = 50 \\\\times 0,6 = 30 \\\\text{ m/s}\\\\).<br>2) Altura máxima: \\\\(H_{máx} = \\\\frac{v_{0y}^2}{2g} = \\\\frac{30^2}{2 \\\\times 9,8} = \\\\frac{900}{19,6} \\\\approx 45,92 \\\\text{ m}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Solo
                    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 200); ctx.lineTo(440, 200); ctx.stroke();
                    // Trajetoria parabolica
                    ctx.strokeStyle = "#eab308"; ctx.setLineDash([5, 5]); ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(60, 200); ctx.quadraticCurveTo(240, 40, 420, 200); ctx.stroke(); ctx.setLineDash([]);
                    // Altura Hmax
                    ctx.strokeStyle = "#ef4444"; ctx.beginPath(); ctx.moveTo(240, 200); ctx.lineTo(240, 120); ctx.stroke();
                    ctx.fillStyle = "#ef4444"; ctx.font = "14px sans-serif"; ctx.fillText("H_máx = 45,9 m", 250, 160);
                }
            },
            {
                id: 5, discipline: "Física 1", difficulty: "Moderada",
                question: "Um carrinho de montanha-russa de 200 kg parte do repouso do topo de uma colina a 20 m de altura. Desprezando o atrito e adotando g = 9,8 m/s², qual é a sua velocidade na base da colina?",
                options: ["14,0 m/s", "19,8 m/s", "25,0 m/s", "392 m/s"],
                correct: 1,
                hint: "Utilize a Conservação da Energia Mecânica: \\\\(m \\\\cdot g \\\\cdot h = \\\\frac{1}{2} m \\\\cdot v^2 \\\\implies v = \\\\sqrt{2gh}\\\\).",
                explanation: "Pela conservação da energia mecânica:<br>\\\\(E_{p} = E_{c} \\\\implies mgh = \\\\frac{1}{2}mv^2 \\\\implies v = \\\\sqrt{2gh}\\\\)<br>\\\\(v = \\\\sqrt{2 \\\\times 9,8 \\\\times 20} = \\\\sqrt{392} \\\\approx 19,8 \\\\text{ m/s}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Pista de montanha russa
                    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.moveTo(40, 60); ctx.bezierCurveTo(150, 60, 200, 200, 440, 200); ctx.stroke();
                    // Carrinho no topo
                    ctx.fillStyle = "#ef4444"; ctx.fillRect(60, 35, 30, 20); ctx.fillText("Topo (h=20m)", 40, 25);
                }
            },
            {
                id: 6, discipline: "Física 1", difficulty: "Moderada",
                question: "Dois blocos se chocam de forma perfeitamente inelástica (ficando grudados). Bloco A (mA = 2 kg) move-se a 6 m/s para a direita, e Bloco B (mB = 4 kg) está inicialmente em repouso. Qual a velocidade final do conjunto?",
                options: ["1,0 m/s", "2,0 m/s", "3,0 m/s", "4,0 m/s"],
                correct: 1,
                hint: "Aplique a Conservação do Momento Linear: \\\\(m_A v_A + m_B v_B = (m_A + m_B) V_f\\\\).",
                explanation: "Pela conservação da quantidade de movimento:<br>\\\\(Q_{antes} = Q_{depois}\\\\)<br>\\\\(2 \\\\times 6 + 4 \\\\times 0 = (2 + 4) \\\\cdot V_f \\\\implies 12 = 6 V_f \\\\implies V_f = 2,0 \\\\text{ m/s}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 180); ctx.lineTo(440, 180); ctx.stroke();
                    // Antes
                    ctx.fillStyle = "#38bdf8"; ctx.fillRect(80, 120, 50, 60); ctx.fillText("A (2kg)", 85, 155);
                    ctx.fillStyle = "#a855f7"; ctx.fillRect(200, 110, 70, 70); ctx.fillText("B (4kg)", 210, 150);
                    drawArrow(ctx, 130, 130, 180, 130, "#22c55e", "6 m/s");
                }
            },
            {
                id: 7, discipline: "Física 1", difficulty: "Moderada",
                question: "Um disco de momento de inércia I = 0,5 kg·m² gira em torno de seu eixo central. Se um torque resultante constante de 4 N·m é aplicado, qual é a aceleração angular α do disco?",
                options: ["2 rad/s²", "4 rad/s²", "8 rad/s²", "16 rad/s²"],
                correct: 2,
                hint: "Use a Segunda Lei de Newton para rotações: \\\\(\\tau = I \\\\cdot \\\\alpha\\\\).",
                explanation: "A analogia rotacional da Segunda Lei de Newton é:<br>\\\\(\\tau = I \\\\cdot \\\\alpha \\\\implies \\\\alpha = \\\\frac{\\\\tau}{I} = \\\\frac{4 \\\\text{ N}\\\\cdot\\\\text{m}}{0,5 \\\\text{ kg}\\\\cdot\\\\text{m}^2} = 8,0 \\\\text{ rad/s}^2\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Disco
                    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(240, 120, 70, 0, Math.PI*2); ctx.stroke();
                    ctx.fillStyle = "#0f172a"; ctx.fill();
                    // Eixo central
                    ctx.fillStyle = "#eab308"; ctx.beginPath(); ctx.arc(240, 120, 6, 0, Math.PI*2); ctx.fill();
                    // Torque seta curva
                    ctx.strokeStyle = "#22c55e"; ctx.beginPath(); ctx.arc(240, 120, 90, -Math.PI*0.3, Math.PI*0.5); ctx.stroke();
                    ctx.fillStyle = "#22c55e"; ctx.font = "14px sans-serif"; ctx.fillText("Torque τ = 4 N·m", 280, 60);
                }
            },
            {
                id: 8, discipline: "Física 1", difficulty: "Difícil",
                question: "Um bloco de 10 kg repousa sobre um plano inclinado de 30°. O coeficiente de atrito estático é μe = 0,6. Com g = 9,8 m/s², o bloco permanece em repouso ou desliza? Qual é o valor da força de atrito?",
                options: ["Desliza, fat = 51,0 N", "Permanece em repouso, fat = 49,0 N", "Desliza, fat = 24,5 N", "Permanece em repouso, fat = 98,0 N"],
                correct: 1,
                hint: "Calcule a componente do peso paralela ao plano \\\\(P_x = m g \\\\sen(30^\\\\circ)\\\\), e o atrito estático máximo \\\\(f_{e,máx} = \\\\mu_e m g \\\\cos(30^\\\\circ)\\\\).",
                explanation: "1) Componente tangencial do peso: \\\\(P_x = 10 \\\\times 9,8 \\\\times \\\\sen(30^\\\\circ) = 49,0 \\\\text{ N}\\\\).<br>2) Atrito estático máximo: \\\\(f_{e,máx} = 0,6 \\\\times 10 \\\\times 9,8 \\\\times \\\\cos(30^\\\\circ) = 0,6 \\\\times 98 \\\\times 0,866 \\\\approx 50,92 \\\\text{ N}\\\\).<br>Como \\\\(P_x (49,0 \\\\text{ N}) < f_{e,máx} (50,92 \\\\text{ N})\\\\), o bloco **não desliza** e a força de atrito equilibra exatamente a força peso paralela: \\\\(f_{at} = 49,0 \\\\text{ N}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Rampa
                    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(60, 200); ctx.lineTo(380, 200); ctx.lineTo(380, 60); ctx.closePath(); ctx.stroke();
                    // Bloco
                    ctx.save(); ctx.translate(220, 140); ctx.rotate(-Math.PI/6);
                    ctx.fillStyle = "#38bdf8"; ctx.fillRect(-30, -30, 60, 30);
                    drawArrow(ctx, 0, -15, -60, -15, "#ef4444", "fat");
                    drawArrow(ctx, 0, -15, 60, -15, "#22c55e", "Px");
                    ctx.restore();
                }
            },
            {
                id: 9, discipline: "Física 1", difficulty: "Difícil",
                question: "Um satélite de massa m é movido de uma órbita circular de raio r1 = R_E para r2 = 2 R_E em torno da Terra. Sabendo que U(r) = -G M m / r, qual o trabalho realizado pela força gravitacional?",
                options: ["-G M m / (2 R_E)", "+G M m / (2 R_E)", "-3 G M m / (2 R_E)", "Zero"],
                correct: 0,
                hint: "O trabalho da força gravitacional (força conservativa) é \\\\(W_g = -\\\\Delta U = -(U_f - U_i)\\\\).",
                explanation: "1) Energia potencial inicial: \\\\(U_i = -\\\\frac{GMm}{R_E}\\\\).<br>2) Energia potencial final: \\\\(U_f = -\\\\frac{GMm}{2R_E}\\\\).<br>3) Trabalho da força conservativa: \\\\(W_g = - (U_f - U_i) = -\\\\left(-\\\\frac{GMm}{2R_E} + \\\\frac{GMm}{R_E}\\\\right) = -\\\\frac{GMm}{2R_E}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Terra
                    ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(240, 120, 35, 0, Math.PI*2); ctx.fill();
                    // Orbitas
                    ctx.strokeStyle = "#94a3b8"; ctx.setLineDash([4, 4]);
                    ctx.beginPath(); ctx.arc(240, 120, 65, 0, Math.PI*2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(240, 120, 100, 0, Math.PI*2); ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = "#eab308"; ctx.beginPath(); ctx.arc(240, 20, 6, 0, Math.PI*2); ctx.fill();
                    ctx.fillText("2 R_E", 250, 25);
                }
            },
            {
                id: 10, discipline: "Física 1", difficulty: "Difícil",
                question: "Uma haste fina homogênea de comprimento L = 1,2 m oscila como pêndulo físico em torno de uma extremidade. Com I = 1/3 M L² e d = L/2, qual é o período T de pequenas oscilações? (g = 9,8 m/s²)",
                options: ["1,20 s", "1,80 s", "2,20 s", "3,14 s"],
                correct: 1,
                hint: "A fórmula do período do pêndulo físico é \\\\(T = 2\\\\pi \\\\sqrt{\\\\frac{I}{M g d}}\\\\). Simplifique para \\\\(T = 2\\\\pi \\\\sqrt{\\\\frac{2L}{3g}}\\\\).",
                explanation: "Substituindo os valores na expressão simplificada do período:<br>\\\\(T = 2\\\\pi \\\\sqrt{\\\\frac{2L}{3g}} = 2\\\\pi \\\\sqrt{\\\\frac{2 \\\\times 1,2}{3 \\\\times 9,8}} = 2\\\\pi \\\\sqrt{\\\\frac{2,4}{29,4}} = 2\\\\pi \\\\times 0,2857 \\\\approx 1,795 \\\\approx 1,80 \\\\text{ s}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Pivô
                    ctx.fillStyle = "#eab308"; ctx.beginPath(); ctx.arc(240, 40, 8, 0, Math.PI*2); ctx.fill();
                    // Haste inclinada
                    ctx.save(); ctx.translate(240, 40); ctx.rotate(Math.PI/8);
                    ctx.fillStyle = "#a855f7"; ctx.fillRect(-6, 0, 12, 140);
                    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(0, 70, 6, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }
            },

            // --- FÍSICA 2 ---
            {
                id: 11, discipline: "Física 2", difficulty: "Fácil",
                question: "Qual é a pressão manométrica exercida por uma coluna de água (ρ = 1000 kg/m³) a uma profundidade h = 5 metros? Adote g = 9,8 m/s².",
                options: ["49 kPa", "98 kPa", "100 kPa", "149 kPa"],
                correct: 0,
                hint: "Utilize o Teorema de Stevin para pressão manométrica: \\\\(P = \\\\rho \\\\cdot g \\\\cdot h\\\\).",
                explanation: "A pressão manométrica hidrostática é dada por:<br>\\\\(P = \\\\rho \\\\cdot g \\\\cdot h = 1000 \\\\text{ kg/m}^3 \\\\times 9,8 \\\\text{ m/s}^2 \\\\times 5 \\\\text{ m} = 49.000 \\\\text{ Pa} = 49 \\\\text{ kPa}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    // Tanque de agua
                    ctx.fillStyle = "rgba(56, 189, 248, 0.3)"; ctx.fillRect(140, 50, 200, 150);
                    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 3; ctx.strokeRect(140, 50, 200, 150);
                    drawArrow(ctx, 360, 50, 360, 200, "#eab308", "h = 5m");
                }
            },
            {
                id: 12, discipline: "Física 2", difficulty: "Fácil",
                question: "Uma onda sonora senoidal propaga-se no ar com frequência de 440 Hz e comprimento de onda λ = 0,78 m. Qual é a velocidade de propagação dessa onda?",
                options: ["300,0 m/s", "343,2 m/s", "564,0 m/s", "1500,0 m/s"],
                correct: 1,
                hint: "Use a Equação Fundamental da Ondulatória: \\\\(v = \\\\lambda \\\\cdot f\\\\).",
                explanation: "A velocidade da onda é o produto da frequência pelo comprimento de onda:<br>\\\\(v = \\\\lambda \\\\cdot f = 0,78 \\\\text{ m} \\\\times 440 \\\\text{ Hz} = 343,2 \\\\text{ m/s}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 3; ctx.beginPath();
                    for(let x=40; x<=440; x+=5) {
                        let y = 120 + 40*Math.sin((x-40)*0.03);
                        if(x===40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    drawArrow(ctx, 145, 60, 355, 60, "#eab308", "λ = 0,78 m");
                }
            },
            {
                id: 13, discipline: "Física 2", difficulty: "Fácil",
                question: "Um gás ideal recebe 500 J de calor de uma fonte térmica e realiza 300 J de trabalho sobre o meio externo. Qual foi a variação da energia interna (ΔU) do gás?",
                options: ["-200 J", "+200 J", "+800 J", "+1500 J"],
                correct: 1,
                hint: "Primeira Lei da Termodinâmica: \\\\(\\Delta U = Q - W\\\\).",
                explanation: "Pela Primeira Lei da Termodinâmica:<br>\\\\(\\Delta U = Q - W = 500 \\\\text{ J} - 300 \\\\text{ J} = +200 \\\\text{ Joules}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 3; ctx.strokeRect(160, 60, 160, 120);
                    ctx.fillStyle = "#ef4444"; ctx.fillRect(165, 80, 150, 20);
                    drawArrow(ctx, 240, 210, 240, 170, "#ef4444", "Q = +500 J");
                    drawArrow(ctx, 240, 70, 240, 30, "#22c55e", "W = 300 J");
                }
            },
            {
                id: 14, discipline: "Física 2", difficulty: "Moderada",
                question: "Um bloco de madeira de volume V = 0,02 m³ flutua na água (ρ = 1000 kg/m³) com 60% de seu volume submerso. Adotando g = 9,8 m/s², qual é a força de empuxo que a água exerce no bloco?",
                options: ["58,8 N", "117,6 N", "196,0 N", "200,0 N"],
                correct: 1,
                hint: "O empuxo é igual ao peso do fluido deslocado: \\\\(E = \\\\rho_{água} \\\\cdot V_{sub} \\\\cdot g\\\\), com \\\\(V_{sub} = 0,60 \\\\cdot V\\\\).",
                explanation: "1) Volume submerso: \\\\(V_{sub} = 0,60 \\\\times 0,02 = 0,012 \\\\text{ m}^3\\\\).<br>2) Empuxo: \\\\(E = 1000 \\\\times 0,012 \\\\times 9,8 = 117,6 \\\\text{ N}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "rgba(56, 189, 248, 0.4)"; ctx.fillRect(40, 120, 400, 90);
                    ctx.fillStyle = "#eab308"; ctx.fillRect(190, 80, 100, 80);
                    drawArrow(ctx, 240, 170, 240, 210, "#ef4444", "Peso");
                    drawArrow(ctx, 240, 110, 240, 50, "#22c55e", "Empuxo E");
                }
            },
            {
                id: 15, discipline: "Física 2", difficulty: "Moderada",
                question: "Água escoa por um tubo horizontal. Na seção 1, o raio é R1 = 4 cm e a velocidade é v1 = 2 m/s. Na seção 2, o raio reduz para R2 = 2 cm. Qual é a velocidade v2 do escoamento na seção 2?",
                options: ["4,0 m/s", "8,0 m/s", "16,0 m/s", "32,0 m/s"],
                correct: 1,
                hint: "Equação da Continuidade para fluido incompressível: \\\\(A_1 v_1 = A_2 v_2 \\\\implies R_1^2 v_1 = R_2^2 v_2\\\\).",
                explanation: "Pela Equação da Continuidade:<br>\\\\(\\pi R_1^2 v_1 = \\\\pi R_2^2 v_2 \\\\implies (4)^2 \\\\times 2 = (2)^2 \\\\times v_2 \\\\implies 16 \\\\times 2 = 4 v_2 \\\\implies v_2 = 8,0 \\\\text{ m/s}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 4; ctx.beginPath();
                    ctx.moveTo(40, 60); ctx.lineTo(240, 60); ctx.lineTo(440, 90);
                    ctx.moveTo(40, 180); ctx.lineTo(240, 180); ctx.lineTo(440, 150); ctx.stroke();
                    drawArrow(ctx, 80, 120, 150, 120, "#38bdf8", "v1 = 2 m/s");
                    drawArrow(ctx, 320, 120, 410, 120, "#22c55e", "v2 = 8 m/s");
                }
            },
            {
                id: 16, discipline: "Física 2", difficulty: "Moderada",
                question: "Uma ambulância com sirene de 800 Hz aproxima-se de um observador parado com velocidade de 34 m/s. Considerando a velocidade do som no ar igual a 340 m/s, qual a frequência percebida pelo observador?",
                options: ["720,0 Hz", "800,0 Hz", "888,9 Hz", "900,0 Hz"],
                correct: 2,
                hint: "Fórmula do Efeito Doppler para fonte se aproximando: \\\\(f_{obs} = f_{fonte} \\\\cdot \\\\frac{v_{som}}{v_{som} - v_{fonte}}\\\\).",
                explanation: "Aplicação direta da fórmula do Efeito Doppler com fonte em aproximação:<br>\\\\(f_{obs} = 800 \\\\times \\\\frac{340}{340 - 34} = 800 \\\\times \\\\frac{340}{306} = 800 \\\\times 1,1111 \\\\approx 888,9 \\\\text{ Hz}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "#ef4444"; ctx.fillRect(80, 130, 80, 40);
                    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2;
                    for(let r=30; r<=120; r+=20) { ctx.beginPath(); ctx.arc(160, 150, r, -Math.PI*0.4, Math.PI*0.4); ctx.stroke(); }
                    ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.arc(380, 150, 12, 0, Math.PI*2); ctx.fill();
                }
            },
            {
                id: 17, discipline: "Física 2", difficulty: "Moderada",
                question: "Uma máquina térmica de Carnot opera entre uma fonte quente a 500 K e uma fonte fria a 300 K. Se em cada ciclo ela absorve 1000 J da fonte quente, qual é o trabalho útil realizado por ciclo?",
                options: ["300 J", "400 J", "500 J", "600 J"],
                correct: 1,
                hint: "O rendimento de Carnot é \\\\(\\eta = 1 - \\\\frac{T_F}{T_Q}\\\\). O trabalho é \\\\(W = \\\\eta \\\\cdot Q_Q\\\\).",
                explanation: "1) Rendimento máximo de Carnot: \\\\(\\eta = 1 - \\\\frac{300}{500} = 0,40\\\\) (40%).<br>2) Trabalho útil: \\\\(W = \\\\eta \\\\cdot Q_Q = 0,40 \\\\times 1000 \\\\text{ J} = 400 \\\\text{ Joules}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "#ef4444"; ctx.fillRect(180, 30, 120, 40); ctx.fillStyle="#fff"; ctx.fillText("Fonte Quente 500K", 185, 55);
                    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(240, 120, 30, 0, Math.PI*2); ctx.stroke();
                    ctx.fillStyle = "#38bdf8"; ctx.fillRect(180, 170, 120, 40); ctx.fillStyle="#fff"; ctx.fillText("Fonte Fria 300K", 195, 195);
                    drawArrow(ctx, 240, 70, 240, 90, "#ef4444", "Q_Q = 1000J");
                    drawArrow(ctx, 270, 120, 340, 120, "#22c55e", "W = 400J");
                }
            },
            {
                id: 18, discipline: "Física 2", difficulty: "Difícil",
                question: "Um gás ideal diatômico (γ = 1,4) expande-se de forma adiabática e reversível de V1 = 1 L e T1 = 400 K até V2 = 32 L. Qual é a temperatura final T2 do gás?",
                options: ["100 K", "200 K", "250 K", "300 K"],
                correct: 0,
                hint: "Em uma expansão adiabática reversível: \\\\(T_1 V_1^{\\\\gamma - 1} = T_2 V_2^{\\\\gamma - 1}\\\\). Note que \\\\(\\gamma - 1 = 0,4 = 2/5\\\\).",
                explanation: "Isolando \\\\(T_2\\\\):<br>\\\\(T_2 = T_1 \\\\left(\\\\frac{V_1}{V_2}\\\\right)^{\\\\gamma - 1} = 400 \\\\times \\\\left(\\\\frac{1}{32}\\\\right)^{0,4}\\\\)<br>Como \\\\(32 = 2^5\\\\), temos \\\\((32)^{-0,4} = (2^5)^{-0,4} = 2^{-2} = \\\\frac{1}{4}\\\\).<br>Logo, \\\\(T_2 = 400 \\\\times \\\\frac{1}{4} = 100 \\\\text{ K}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(60, 20); ctx.lineTo(60, 200); ctx.lineTo(440, 200); ctx.stroke();
                    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 3; ctx.beginPath();
                    ctx.moveTo(90, 40); ctx.quadraticCurveTo(150, 160, 380, 180); ctx.stroke();
                }
            },
            {
                id: 19, discipline: "Física 2", difficulty: "Difícil",
                question: "Um tubo sonoro de comprimento L = 0,85 m é fechado em uma extremidade e aberto na outra. Considerando a velocidade do som no ar v = 340 m/s, qual a frequência do terceiro harmônico (n = 3)?",
                options: ["100 Hz", "200 Hz", "300 Hz", "400 Hz"],
                correct: 2,
                hint: "Para tubos fechados em uma extremidade, os harmônicos permitidos são ímpares com frequência \\\\(f_n = \\\\frac{n \\\\cdot v}{4L}\\\\).",
                explanation: "Para o terceiro harmônico (n = 3):<br>\\\\(f_3 = \\\\frac{3 \\\\cdot v}{4L} = \\\\frac{3 \\\\times 340}{4 \\\\times 0,85} = \\\\frac{1020}{3,4} = 300 \\\\text{ Hz}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(60, 80); ctx.lineTo(380, 80); ctx.lineTo(380, 160); ctx.lineTo(60, 160); ctx.stroke();
                    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 2; ctx.beginPath();
                    ctx.moveTo(380, 120); ctx.quadraticCurveTo(280, 70, 220, 120); ctx.quadraticCurveTo(160, 170, 60, 80); ctx.stroke();
                }
            },
            {
                id: 20, discipline: "Física 2", difficulty: "Difícil",
                question: "Um bloco de gelo de 0,5 kg a 0°C (273 K) funde-se completamente transformando-se em água a 0°C. Com Lf = 3,34 x 10⁵ J/kg, qual a variação de entropia ΔS do gelo durante a fusão?",
                options: ["0 J/K", "611,7 J/K", "1223,4 J/K", "167.000 J/K"],
                correct: 1,
                hint: "Para uma transição de fase isotérmica, a variação de entropia é \\\\(\\Delta S = \\\\frac{Q}{T} = \\\\frac{m \\\\cdot L_f}{T}\\\\).",
                explanation: "1) Calor absorvido: \\\\(Q = m \\\\cdot L_f = 0,5 \\\\text{ kg} \\\\times 3,34 \\\\times 10^5 \\\\text{ J/kg} = 1,67 \\\\times 10^5 \\\\text{ J}\\\\).<br>2) Variação de Entropia: \\\\(\\Delta S = \\\\frac{Q}{T} = \\\\frac{1,67 \\\\times 10^5 \\\\text{ J}}{273 \\\\text{ K}} \\\\approx 611,72 \\\\text{ J/K}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "rgba(56, 189, 248, 0.6)"; ctx.fillRect(180, 90, 80, 80);
                    ctx.fillStyle = "#22c55e"; ctx.font = "16px sans-serif"; ctx.fillText("T = 273 K (constante)", 150, 60);
                }
            },

            // --- FÍSICA 3 ---
            {
                id: 21, discipline: "Física 3", difficulty: "Fácil",
                question: "Duas cargas puntiformes q1 = +2 μC e q2 = +3 μC estão separadas no vácuo por uma distância de 0,3 metros. Qual é a força elétrica repulsiva entre elas? (k0 = 9 x 10⁹ N·m²/C²)",
                options: ["0,3 N", "0,6 N", "1,8 N", "6,0 N"],
                correct: 1,
                hint: "Lei de Coulomb: \\\\(F = k_0 \\\\frac{|q_1 q_2|}{r^2}\\\\). Lembre-se de converter \\\\(\\mu C\\\\) para \\\\(10^{-6} C\\\\).",
                explanation: "Pela Lei de Coulomb:<br>\\\\(F = 9 \\\\times 10^9 \\\\times \\\\frac{(2 \\\\times 10^{-6}) \\\\times (3 \\\\times 10^{-6})}{(0,3)^2} = 9 \\\\times 10^9 \\\\times \\\\frac{6 \\\\times 10^{-12}}{0,09} = 0,6 \\\\text{ N}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(140, 120, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle="#fff"; ctx.fillText("+q1", 130, 125);
                    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(340, 120, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle="#fff"; ctx.fillText("+q2", 330, 125);
                    drawArrow(ctx, 120, 120, 60, 120, "#22c55e", "F");
                    drawArrow(ctx, 360, 120, 420, 120, "#22c55e", "F");
                }
            },
            {
                id: 22, discipline: "Física 3", difficulty: "Fácil",
                question: "Um resistor de resistência R = 12 Ω é submetido a uma diferença de potencial de 36 V. Qual é a corrente elétrica que atravessa o resistor?",
                options: ["0,33 A", "3,0 A", "24,0 A", "432,0 A"],
                correct: 1,
                hint: "Primeira Lei de Ohm: \\\\(U = R \\\\cdot I \\\\implies I = \\\\frac{U}{R}\\\\).",
                explanation: "Pela Lei de Ohm:<br>\\\\(I = \\\\frac{U}{R} = \\\\frac{36 \\\\text{ V}}{12 \\\\text{ }\\\\Omega} = 3,0 \\\\text{ A}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 3; ctx.strokeRect(100, 50, 280, 140);
                    ctx.fillStyle = "#0f172a"; ctx.fillRect(200, 40, 80, 20);
                    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 4; ctx.strokeRect(200, 40, 80, 20);
                    ctx.fillStyle = "#eab308"; ctx.fillText("R = 12 Ω", 210, 30);
                }
            },
            {
                id: 23, discipline: "Física 3", difficulty: "Fácil",
                question: "Um feixe de luz viaja no vácuo (c = 3 x 10⁸ m/s) e incide em um meio transparente com índice de refração n = 1,5. Qual é a velocidade da luz nesse meio?",
                options: ["1,5 x 10⁸ m/s", "2,0 x 10⁸ m/s", "3,0 x 10⁸ m/s", "4,5 x 10⁸ m/s"],
                correct: 1,
                hint: "Definição do índice de refração: \\\\(n = \\\\frac{c}{v} \\\\implies v = \\\\frac{c}{n}\\\\).",
                explanation: "Calculando a velocidade no meio:<br>\\\\(v = \\\\frac{c}{n} = \\\\frac{3 \\\\times 10^8 \\\\text{ m/s}}{1,5} = 2,0 \\\\times 10^8 \\\\text{ m/s}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "rgba(56, 189, 248, 0.2)"; ctx.fillRect(40, 120, 400, 100);
                    ctx.strokeStyle = "#475569"; ctx.beginPath(); ctx.moveTo(40, 120); ctx.lineTo(440, 120); ctx.stroke();
                    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(140, 40); ctx.lineTo(240, 120); ctx.lineTo(300, 210); ctx.stroke();
                }
            },
            {
                id: 24, discipline: "Física 3", difficulty: "Moderada",
                question: "Qual é a intensidade do campo elétrico gerado por uma carga puntual Q = 4 μC a uma distância de r = 2 metros no vácuo? (k0 = 9 x 10⁹ N·m²/C²)",
                options: ["4.500 N/C", "9.000 N/C", "18.000 N/C", "36.000 N/C"],
                correct: 1,
                hint: "Fórmula do campo elétrico de carga puntiforme: \\\\(E = k_0 \\\\frac{|Q|}{r^2}\\\\).",
                explanation: "Substituindo os valores:<br>\\\\(E = 9 \\\\times 10^9 \\\\times \\\\frac{4 \\\\times 10^{-6}}{2^2} = 9 \\\\times 10^9 \\\\times \\\\frac{4 \\\\times 10^{-6}}{4} = 9.000 \\\\text{ N/C}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(180, 120, 18, 0, Math.PI*2); ctx.fill();
                    drawArrow(ctx, 180, 120, 340, 120, "#38bdf8", "E = 9000 N/C");
                }
            },
            {
                id: 25, discipline: "Física 3", difficulty: "Moderada",
                question: "Dois resistores de R1 = 6 Ω e R2 = 12 Ω estão associados em paralelo sob uma tensão constante de 24 V. Qual é a corrente total fornecida pela fonte?",
                options: ["2,0 A", "4,0 A", "6,0 A", "18,0 A"],
                correct: 2,
                hint: "Calcule a resistência equivalente em paralelo: \\\\(R_{eq} = \\\\frac{R_1 \\\\cdot R_2}{R_1 + R_2}\\\\), e depois use \\\\(I_{tot} = \\\\frac{U}{R_{eq}}\\\\).",
                explanation: "1) Resistência equivalente: \\\\(R_{eq} = \\\\frac{6 \\\\times 12}{6 + 12} = \\\\frac{72}{18} = 4 \\\\text{ }\\\\Omega\\\\).<br>2) Corrente total: \\\\(I_{tot} = \\\\frac{U}{R_{eq}} = \\\\frac{24 \\\\text{ V}}{4 \\\\text{ }\\\\Omega} = 6,0 \\\\text{ A}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 3;
                    ctx.strokeRect(80, 50, 320, 140);
                    ctx.beginPath(); ctx.moveTo(240, 50); ctx.lineTo(240, 190); ctx.stroke();
                }
            },
            {
                id: 26, discipline: "Física 3", difficulty: "Moderada",
                question: "Uma partícula com carga q = +5 μC penetra perpendicularmente (θ = 90°) em um campo magnético B = 0,4 T com velocidade v = 2 x 10⁵ m/s. Qual o módulo da força magnética sobre ela?",
                options: ["0,1 N", "0,4 N", "2,0 N", "4,0 N"],
                correct: 1,
                hint: "Força magnética de Lorentz: \\\\(F_m = |q| \\\\cdot v \\\\cdot B \\\\cdot \\\\sen(\\\\theta)\\\\).",
                explanation: "Como \\\\(\\sen(90^\\\\circ) = 1\\\\):<br>\\\\(F_m = (5 \\\\times 10^{-6}) \\\\times (2 \\\\times 10^5) \\\\times 0,4 \\\\times 1 = 1,0 \\\\times 0,4 = 0,4 \\\\text{ N}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.fillStyle = "#475569"; ctx.font = "20px sans-serif";
                    for(let x=200; x<=400; x+=50) for(let y=50; y<=190; y+=50) ctx.fillText("✕", x, y);
                    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(100, 120, 15, 0, Math.PI*2); ctx.fill();
                    drawArrow(ctx, 100, 120, 220, 120, "#22c55e", "v");
                }
            },
            {
                id: 27, discipline: "Física 3", difficulty: "Moderada",
                question: "Uma carga pontual de Q = 8,85 x 10⁻⁹ C está no centro de uma superfície esférica. Com ε0 = 8,85 x 10⁻¹² C²/(N·m²), qual é o fluxo elétrico total ΦE através da esfera?",
                options: ["100 N·m²/C", "1.000 N·m²/C", "8.850 N·m²/C", "Zero"],
                correct: 1,
                hint: "Lei de Gauss: O fluxo elétrico total através de qualquer superfície fechada é \\\\(\\Phi_E = \\\\frac{Q_{enc}}{\\\\varepsilon_0}\\\\).",
                explanation: "Pela Lei de Gauss:<br>\\\\(\\Phi_E = \\\\frac{Q}{\\\\varepsilon_0} = \\\\frac{8,85 \\\\times 10^{-9}}{8,85 \\\\times 10^{-12}} = 10^3 = 1.000 \\\\text{ N}\\\\cdot\\\\text{m}^2/\\\\text{C}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#38bdf8"; ctx.setLineDash([5, 5]); ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.arc(240, 120, 80, 0, Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
                    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(240, 120, 12, 0, Math.PI*2); ctx.fill();
                }
            },
            {
                id: 28, discipline: "Física 3", difficulty: "Difícil",
                question: "Uma espira circular de raio r = 0,1 m (Área A ≈ 0,0314 m²) está perpendicular a um campo magnético que varia de 0,2 T para 1,0 T em Δt = 0,05 s. Qual a fem inducida ε na espira?",
                options: ["0,10 V", "0,50 V", "1,00 V", "2,00 V"],
                correct: 1,
                hint: "Lei de Faraday-Lenz: \\\\(\\varepsilon = \\\\left| \\\\frac{\\\\Delta \\\\Phi_B}{\\\\Delta t} \\\\right| = A \\\\cdot \\\\frac{\\\\Delta B}{\\\\Delta t}\\\\).",
                explanation: "1) Variação do campo magnético: \\\\(\\Delta B = 1,0 - 0,2 = 0,8 \\\\text{ T}\\\\).<br>2) Variação de fluxo: \\\\(\\Delta \\\\Phi_B = A \\\\cdot \\\\Delta B = 0,0314 \\\\times 0,8 = 0,02512 \\\\text{ Wb}\\\\).<br>3) Força eletromotriz: \\\\(\\varepsilon = \\\\frac{0,02512}{0,05} \\\\approx 0,5024 \\\\text{ V} \\\\approx 0,50 \\\\text{ V}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.arc(240, 120, 60, 0, Math.PI*2); ctx.stroke();
                }
            },
            {
                id: 29, discipline: "Física 3", difficulty: "Difícil",
                question: "Um capacitor C = 50 μF é ligado em série com um resistor R = 20 kΩ (20.000 Ω) e uma bateria ideal de 12 V. Qual é a constante de tempo τ do circuito e a carga máxima final no capacitor?",
                options: ["τ = 1,0 s; Q = 600 μC", "τ = 0,5 s; Q = 300 μC", "τ = 2,0 s; Q = 1200 μC", "τ = 10,0 s; Q = 60 μC"],
                correct: 0,
                hint: "Constante de tempo \\\\(\\tau = R \\\\cdot C\\\\) e carga máxima \\\\(Q = C \\\\cdot U\\\\).",
                explanation: "1) Constante de tempo: \\\\(\\tau = (20.000 \\\\text{ }\\\\Omega) \\\\times (50 \\\\times 10^{-6} \\\\text{ F}) = 1,0 \\\\text{ s}\\\\).<br>2) Carga máxima: \\\\(Q_{máx} = (50 \\\\times 10^{-6} \\\\text{ F}) \\\\times 12 \\\\text{ V} = 600 \\\\times 10^{-6} \\\\text{ C} = 600 \\\\mu \\\\text{C}\\\\).",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 3; ctx.strokeRect(100, 50, 280, 140);
                    ctx.fillStyle = "#0f172a"; ctx.fillRect(370, 100, 20, 40);
                    ctx.strokeStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(375, 100); ctx.lineTo(375, 140); ctx.moveTo(385, 100); ctx.lineTo(385, 140); ctx.stroke();
                }
            },
            {
                id: 30, discipline: "Física 3", difficulty: "Difícil",
                question: "Um objeto de 4 cm de altura é colocado a 30 cm de uma lente convergente de distância focal f = 20 cm. Onde se forma a imagem e qual é a sua altura?",
                options: ["p' = 60 cm, imagem invertida de 8 cm", "p' = 30 cm, imagem direita de 4 cm", "p' = 12 cm, imagem invertida de 2 cm", "p' = -60 cm, imagem virtual de 12 cm"],
                correct: 0,
                hint: "Equação de Gauss: \\\\(\\frac{1}{f} = \\\\frac{1}{p} + \\\\frac{1}{p'}\\\\). Ampliação lateral: \\\\(m = -\\\\frac{p'}{p} = \\\\frac{i}{o}\\\\).",
                explanation: "1) Posição da imagem (Gauss):<br>\\\\(\\frac{1}{20} = \\\\frac{1}{30} + \\\\frac{1}{p'} \\\\implies \\\\frac{1}{p'} = \\\\frac{1}{20} - \\\\frac{1}{30} = \\\\frac{1}{60} \\\\implies p' = 60 \\\\text{ cm}\\\\).<br>2) Altura da imagem:<br>\\\\(m = -\\\\frac{60}{30} = -2 \\\\implies i = m \\\\cdot o = -2 \\\\times 4 = -8 \\\\text{ cm}\\\\).<br>Imagem real, invertida e com 8 cm de altura.",
                drawCanvas: (ctx) => {
                    ctx.clearRect(0, 0, 480, 240);
                    ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 120); ctx.lineTo(460, 120); ctx.stroke();
                    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(240, 40); ctx.lineTo(240, 200); ctx.stroke();
                    drawArrow(ctx, 120, 120, 120, 60, "#22c55e", "Objeto");
                    drawArrow(ctx, 380, 120, 380, 210, "#ef4444", "Imagem");
                }
            }
        ];

        // Estado da Aplicação
        let activeDiscipline = "todas";
        let filteredQuestions = [...questionsBank];
        let currentIndex = 0;
        let score = 0;
        let currentStreak = 0;
        let maxStreak = 0;
        let selectedOption = null;
        let synth = window.speechSynthesis;
        let utterance = null;

        // Função para Desenhar Setas no Canvas
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

        // Inicialização
        window.onload = () => {
            filterQuestions();
        };

        function filterQuestions() {
            filteredQuestions = questionsBank.filter(q => {
                return (activeDiscipline === "todas" || q.discipline === activeDiscipline);
            });
            currentIndex = 0;
            score = 0;
            currentStreak = 0;
            maxStreak = 0;
            document.getElementById("scoreCount").innerText = score;
            document.getElementById("streakCount").innerText = currentStreak;
            
            if(filteredQuestions.length === 0) {
                alert("Nenhuma questão encontrada para este filtro!");
                return;
            }
            renderQuestion();
        }

        function setDiscipline(disc) {
            activeDiscipline = disc;
            document.querySelectorAll('.filter-group')[0].querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.innerText.includes(disc) || (disc==='todas' && btn.innerText==='Todas'));
            });
            filterQuestions();
        }

        function renderQuestion() {
            if (currentIndex >= filteredQuestions.length) {
                showScorecard();
                return;
            }

            const q = filteredQuestions[currentIndex];
            selectedOption = null;

            // Interface
            document.getElementById("quizScreen").style.display = "block";
            document.getElementById("scorecardScreen").style.display = "none";
            document.getElementById("questionText").innerHTML = `${currentIndex + 1}. ${q.question}`;
            document.getElementById("questionCounter").innerText = `Questão ${currentIndex + 1} de ${filteredQuestions.length}`;
            
            // Progress Bar
            const progressPercent = ((currentIndex) / filteredQuestions.length) * 100;
            document.getElementById("progressBar").style.width = `${progressPercent}%`;

            // Badges
            const discBadge = document.getElementById("discBadge");
            discBadge.innerText = q.discipline;
            discBadge.className = `badge badge-${q.discipline.toLowerCase().replace(' ', '')}`;

            // Canvas
            const canvas = document.getElementById("physicsCanvas");
            const ctx = canvas.getContext("2d");
            q.drawCanvas(ctx);

            // Dica e Explicação reset
            document.getElementById("hintBox").style.display = "none";
            document.getElementById("hintBox").innerHTML = `💡 <b>Dica:</b> ${q.hint}`;
            document.getElementById("hintBtnText").innerText = "Ver Dica Interativa";
            document.getElementById("explanationBox").style.display = "none";

            // Opções
            const grid = document.getElementById("optionsGrid");
            grid.innerHTML = "";
            const letters = ["A", "B", "C", "D"];

            q.options.forEach((opt, idx) => {
                const btn = document.createElement("button");
                btn.className = "option-btn";
                btn.onclick = () => selectOption(idx);
                btn.innerHTML = `<span class="option-letter">${letters[idx]}</span> <span>${opt}</span>`;
                grid.appendChild(btn);
            });

            // Botão Confirmar
            const nextBtn = document.getElementById("nextBtn");
            nextBtn.disabled = true;
            nextBtn.innerHTML = `<span>Confirmar Resposta</span> <i class="fa-solid fa-arrow-right"></i>`;
            nextBtn.onclick = handleConfirm;

            // MathJax re-render
            if (window.MathJax) {
                MathJax.typesetPromise();
            }

            // Auto-narração se desejado
            stopVoice();
        }

        function selectOption(index) {
            if (document.getElementById("nextBtn").innerText.includes("Próxima")) return;
            selectedOption = index;
            const buttons = document.querySelectorAll(".option-btn");
            buttons.forEach((btn, idx) => {
                btn.classList.toggle("selected", idx === index);
            });
            document.getElementById("nextBtn").disabled = false;
        }

        function toggleHint() {
            const hintBox = document.getElementById("hintBox");
            const isHidden = hintBox.style.display === "none" || hintBox.style.display === "";
            hintBox.style.display = isHidden ? "block" : "none";
            document.getElementById("hintBtnText").innerText = isHidden ? "Ocultar Dica" : "Ver Dica Interativa";
            if (window.MathJax) MathJax.typesetPromise();
        }

        function handleConfirm() {
            const q = filteredQuestions[currentIndex];
            const buttons = document.querySelectorAll(".option-btn");
            
            buttons.forEach(btn => btn.disabled = true);

            if (selectedOption === q.correct) {
                buttons[selectedOption].classList.add("correct");
                score += 100 + (currentStreak * 10);
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
            } else {
                buttons[selectedOption].classList.add("wrong");
                buttons[q.correct].classList.add("correct");
                currentStreak = 0;
            }

            document.getElementById("scoreCount").innerText = score;
            document.getElementById("streakCount").innerText = currentStreak;

            // Mostrar Explicação
            const expBox = document.getElementById("explanationBox");
            document.getElementById("explanationText").innerHTML = q.explanation;
            expBox.style.display = "block";

            if (window.MathJax) MathJax.typesetPromise();

            // Atualizar Botão para Próxima
            const nextBtn = document.getElementById("nextBtn");
            nextBtn.disabled = false;
            nextBtn.innerHTML = `<span>Próxima Questão</span> <i class="fa-solid fa-forward"></i>`;
            nextBtn.onclick = handleNextQuestion;
        }

        function handleNextQuestion() {
            currentIndex++;
            renderQuestion();
        }

        function showScorecard() {
            document.getElementById("quizScreen").style.display = "none";
            document.getElementById("scorecardScreen").style.display = "block";

            document.getElementById("finalScore").innerText = score;
            const accuracy = Math.round((score / (filteredQuestions.length * 100)) * 100) || 0;
            document.getElementById("finalAccuracy").innerText = `${accuracy}%`;
            document.getElementById("finalMaxStreak").innerText = maxStreak;

            const medalContainer = document.getElementById("medalContainer");
            if (accuracy >= 80) {
                medalContainer.innerHTML = `<i class="fa-solid fa-award" style="color: #eab308;"></i><p style="font-size: 1.2rem; color: #eab308; margin-top:8px;">Medalha de Ouro - Excelente!</p>`;
            } else if (accuracy >= 50) {
                medalContainer.innerHTML = `<i class="fa-solid fa-award" style="color: #94a3b8;"></i><p style="font-size: 1.2rem; color: #94a3b8; margin-top:8px;">Medalha de Prata - Bom Trabalho!</p>`;
            } else {
                medalContainer.innerHTML = `<i class="fa-solid fa-award" style="color: #b45309;"></i><p style="font-size: 1.2rem; color: #b45309; margin-top:8px;">Medalha de Bronce - Continue Praticando!</p>`;
            }
        }

        function restartQuiz() {
            filterQuestions();
        }

        // Web Speech API - Síntese de Voz
        function playVoice() {
            stopVoice();
            if ('speechSynthesis' in window) {
                const q = filteredQuestions[currentIndex];
                const cleanText = q.question.replace(/\\\\\(.*?\\\\\)/g, "");
                utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = "pt-BR";
                utterance.rate = parseFloat(document.getElementById("speechRate").value);
                synth.speak(utterance);
            } else {
                alert("Navegador não suporta Síntese de Voz.");
            }
        }

        function pauseVoice() {
            if (synth.speaking) synth.pause();
        }

        function stopVoice() {
            if (synth.speaking || synth.pending) synth.cancel();
        }

        function updateRate() {
            if (synth.speaking) playVoice();
        }
    </script>
</body>
</html>
"""

os.makedirs(os.path.dirname(target_path), exist_ok=True)
with open(target_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Successfully generated {target_path}!")
