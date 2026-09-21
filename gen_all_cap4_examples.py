import os

cap4_dir = r"C:\Users\haas\github\demos\fisica-1\capitulo-4"

# Helper CSS template for standard interactive pages
common_css = """
        :root {
            --bg-dark: #070a12;
            --bg-card: rgba(15, 23, 42, 0.88);
            --bg-card-border: rgba(56, 189, 248, 0.25);
            --accent-cyan: #38bdf8;
            --accent-purple: #a855f7;
            --accent-gold: #fbbf24;
            --accent-emerald: #10b981;
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
            background-image: 
                radial-gradient(circle at 10% 10%, rgba(56, 189, 248, 0.12) 0%, transparent 45%),
                radial-gradient(circle at 90% 90%, rgba(168, 85, 247, 0.12) 0%, transparent 45%);
            background-attachment: fixed;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .top-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .back-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--bg-card-border);
            color: var(--accent-cyan);
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.2s;
        }

        .back-btn:hover { background: rgba(56, 189, 248, 0.2); }

        .statement-box {
            background: rgba(10, 16, 30, 0.92);
            border-left: 5px solid var(--accent-cyan);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .statement-box h2 {
            font-family: 'Outfit', sans-serif;
            color: var(--accent-cyan);
            font-size: 1.5rem;
            margin-bottom: 8px;
        }

        .statement-box p {
            line-height: 1.6;
            color: var(--text-sub);
        }

        .content-grid {
            display: grid;
            grid-template-columns: 420px 1fr;
            gap: 20px;
        }

        .card {
            background: var(--bg-card);
            border: 1px solid var(--bg-card-border);
            border-radius: 14px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .card h3 {
            font-family: 'Outfit', sans-serif;
            color: var(--accent-cyan);
            margin-bottom: 12px;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .controls-group {
            margin-bottom: 15px;
        }

        .controls-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-sub);
            margin-bottom: 5px;
        }

        .controls-group input[type="range"] {
            width: 100%;
            accent-color: var(--accent-cyan);
        }

        .value-disp {
            font-weight: bold;
            color: var(--accent-gold);
            float: right;
        }

        canvas {
            width: 100%;
            background: #0f172a;
            border-radius: 10px;
            border: 1px solid var(--bg-card-border);
        }

        .solution-step {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 12px;
        }

        .solution-step h4 {
            color: var(--accent-gold);
            font-size: 1rem;
            margin-bottom: 6px;
        }

        @media (max-width: 900px) {
            .content-grid { grid-template-columns: 1fr; }
        }
"""

def generate_example_html(title, desc, filename, canvas_draw_script, controls_html, solution_html):
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | FSC5101 Física I</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
    <style>{common_css}</style>
</head>
<body>
    <div class="container">
        <div class="top-nav">
            <a href="index.html" class="back-btn">← Voltar aos Exercícios do Cap 4</a>
            <a href="apresentacao.html" class="back-btn" style="color:var(--accent-gold);">🖥️ Ver Apresentação</a>
        </div>

        <div class="statement-box">
            <h2><i class="fa-solid fa-atom"></i> {title}</h2>
            <p>{desc}</p>
        </div>

        <div class="content-grid">
            <div class="card">
                <h3><i class="fa-solid fa-sliders"></i> Parâmetros Interativos</h3>
                {controls_html}
                <div style="margin-top:15px;">
                    <canvas id="simCanvas" width="380" height="260"></canvas>
                </div>
            </div>

            <div class="card">
                <h3><i class="fa-solid fa-book-open"></i> Resolução Didática Passo a Passo</h3>
                {solution_html}
            </div>
        </div>
    </div>

    <script>
        function drawArrow(ctx, fromx, fromy, tox, toy, color, label="") {{
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
            if(label) {{
                ctx.font = "bold 13px sans-serif";
                ctx.fillText(label, (fromx + tox)/2 + 5, (fromy + toy)/2 - 5);
            }}
        }}

        {canvas_draw_script}

        window.onload = () => {{
            updateSimulation();
        }};
    </script>
</body>
</html>
"""

# -------------------------------------------------------------
# EXEMPLO 4.2: Componentes e Rotação de Eixos (Exercícios 4.1, 4.2, 4.5)
# -------------------------------------------------------------
ex42_title = "Exemplo 4.2: Superposição de Forças e Rotação de Eixos"
ex42_desc = "Demonstração da soma de forças por componentes cartesianas e por rotação de eixos coordenados em 37° (Exercícios 4.1 a 4.5 do PDF)."
ex42_controls = """
    <div class="controls-group">
        <label>Força F1 (N): <span id="f1Disp" class="value-disp">120</span></label>
        <input type="range" id="f1Val" min="50" max="250" value="120" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Força F2 (N): <span id="f2Disp" class="value-disp">50</span></label>
        <input type="range" id="f2Val" min="20" max="150" value="50" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Ângulo entre Forças (°): <span id="angDisp" class="value-disp">90</span></label>
        <input type="range" id="angVal" min="0" max="180" value="90" oninput="updateSimulation()">
    </div>
"""
ex42_solution = """
    <div class="solution-step">
        <h4>1. Superposição de Forças (Exercício 4.1)</h4>
        <p>Duas forças de módulo iguais a \\(F\\) resultam em \\(\\sqrt{2}F\\) quando são perpendiculares (\\(\\theta = 90^\\circ\\)), pois:</p>
        \\[ F_{res}^2 = F^2 + F^2 + 2 F^2 \\cos(90^\\circ) = 2 F^2 \\implies F_{res} = \\sqrt{2}F \\]
    </div>
    <div class="solution-step">
        <h4>2. Rotação de Eixos (Exercício 4.2)</h4>
        <p>No novo sistema de coordenadas rotacionado em \\(37^\\circ\\):</p>
        \\[ R_x = (120\\text{ N})\\cos(233^\\circ) + (50\\text{ N})\\cos(323^\\circ) = -32\\text{ N} \\]
        \\[ R_y = (120\\text{ N})\\sin(233^\\circ) + (50\\text{ N})\\sin(323^\\circ) = 124\\text{ N} \\]
        \\[ R = \\sqrt{(-32)^2 + 124^2} = 128\\text{ N}, \\quad \\theta = 104^\\circ \\]
    </div>
    <div class="solution-step">
        <h4>3. Adição em Cães Puxando Trenó (Exercício 4.5)</h4>
        <p>Cão A (270 N) e Cão B (300 N) a \\(60^\\circ\\):</p>
        \\[ R = \\sqrt{270^2 + 300^2 + 2(270)(300)\\cos(60^\\circ)} = 494\\text{ N}, \\quad \\theta = 31,7^\\circ \\]
    </div>
"""
ex42_script = """
    function updateSimulation() {
        const f1 = parseFloat(document.getElementById('f1Val').value);
        const f2 = parseFloat(document.getElementById('f2Val').value);
        const angDeg = parseFloat(document.getElementById('angVal').value);
        const angRad = angDeg * Math.PI / 180;

        document.getElementById('f1Disp').innerText = f1;
        document.getElementById('f2Disp').innerText = f2;
        document.getElementById('angDisp').innerText = angDeg;

        const rx = f1 + f2 * Math.cos(angRad);
        const ry = f2 * Math.sin(angRad);
        const r = Math.sqrt(rx*rx + ry*ry);

        const canvas = document.getElementById('simCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,380,260);

        ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(40,220); ctx.lineTo(340,220); ctx.moveTo(40,220); ctx.lineTo(40,40); ctx.stroke();

        const scale = 0.8;
        drawArrow(ctx, 40, 220, 40 + f1*scale, 220, '#38bdf8', 'F1');
        drawArrow(ctx, 40, 220, 40 + (f2*Math.cos(angRad))*scale, 220 - (f2*Math.sin(angRad))*scale, '#a855f7', 'F2');
        drawArrow(ctx, 40, 220, 40 + rx*scale, 220 - ry*scale, '#22c55e', `R=${Math.round(r)}N`);

        if (window.MathJax) MathJax.typesetPromise();
    }
"""

with open(os.path.join(cap4_dir, "exemplo-4-2.html"), "w", encoding="utf-8") as f:
    f.write(generate_example_html(ex42_title, ex42_desc, "exemplo-4-2.html", ex42_script, ex42_controls, ex42_solution))

print("Created exemplo-4-2.html!")

# -------------------------------------------------------------
# EXEMPLO 4.3: Segunda Lei de Newton: F = ma e Cinemática (Exercícios 4.7 a 4.14)
# -------------------------------------------------------------
ex43_title = "Exemplo 4.3: Segunda Lei de Newton (F = ma) e Movimento Acelerado"
ex43_desc = "Relação entre força resultante, massa e aceleração em sistemas 1D e 2D (Exercícios 4.7 a 4.14 do PDF)."
ex43_controls = """
    <div class="controls-group">
        <label>Força Resultante F (N): <span id="fDisp" class="value-disp">132</span></label>
        <input type="range" id="fVal" min="10" max="300" value="132" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Massa m (kg): <span id="mDisp" class="value-disp">60</span></label>
        <input type="range" id="mVal" min="5" max="150" value="60" oninput="updateSimulation()">
    </div>
"""
ex43_solution = """
    <div class="solution-step">
        <h4>1. Segunda Lei de Newton Fundamental (Exercício 4.7)</h4>
        \\[ a = \\frac{F}{m} = \\frac{132\\text{ N}}{60\\text{ kg}} = 2,2\\text{ m/s}^2 \\]
    </div>
    <div class="solution-step">
        <h4>2. Força em Função da Aceleração (Exercício 4.8)</h4>
        \\[ F = m \\cdot a = (135\\text{ kg})(1,40\\text{ m/s}^2) = 189\\text{ N} \\]
    </div>
    <div class="solution-step">
        <h4>3. Aceleração de Elétrons em Tubos (Exercício 4.14)</h4>
        <p>Para um elétron (\\(m = 9,11 \\times 10^{-31}\\text{ kg}\\)) acelerado até \\(v = 3,00 \\times 10^6\\text{ m/s}\\) em \\(1,80\\text{ cm}\\):</p>
        \\[ a_x = \\frac{v_x^2}{2x} = \\frac{(3,00 \\times 10^6)^2}{2(0,018)} = 2,50 \\times 10^{14}\\text{ m/s}^2 \\]
        \\[ F = m a = (9,11 \\times 10^{-31})(2,50 \\times 10^{14}) = 2,28 \\times 10^{-16}\\text{ N} \\]
    </div>
"""
ex43_script = """
    function updateSimulation() {
        const F = parseFloat(document.getElementById('fVal').value);
        const m = parseFloat(document.getElementById('mVal').value);
        const a = (F / m).toFixed(2);

        document.getElementById('fDisp').innerText = F;
        document.getElementById('mDisp').innerText = m;

        const canvas = document.getElementById('simCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,380,260);

        ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(30,200); ctx.lineTo(350,200); ctx.stroke();

        ctx.fillStyle = '#38bdf8'; ctx.fillRect(100,130,90,70);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 15px sans-serif'; ctx.fillText(`m = ${m} kg`, 110, 170);

        drawArrow(ctx, 190, 165, 300, 165, '#22c55e', `F = ${F} N`);
        drawArrow(ctx, 190, 120, 260, 120, '#fbbf24', `a = ${a} m/s²`);

        if (window.MathJax) MathJax.typesetPromise();
    }
"""

with open(os.path.join(cap4_dir, "exemplo-4-3.html"), "w", encoding="utf-8") as f:
    f.write(generate_example_html(ex43_title, ex43_desc, "exemplo-4-3.html", ex43_script, ex43_controls, ex43_solution))

print("Created exemplo-4-3.html!")

# -------------------------------------------------------------
# EXEMPLO 4.4: Terceira Lei de Newton e DCL (Exercícios 4.19 a 4.26)
# -------------------------------------------------------------
ex44_title = "Exemplo 4.4: Terceira Lei de Newton e Diagrama de Corpo Livre"
ex44_desc = "Pares de Ação e Reação, forças de contato e construção de DCLs para blocos encostados e caminhões (Exercícios 4.19 a 4.26 do PDF)."
ex44_controls = """
    <div class="controls-group">
        <label>Massa do Bloco A (kg): <span id="maDisp" class="value-disp">4</span></label>
        <input type="range" id="maVal" min="1" max="10" value="4" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Massa do Bloco B (kg): <span id="mbDisp" class="value-disp">6</span></label>
        <input type="range" id="mbVal" min="1" max="10" value="6" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Empurrão F (N): <span id="fEmpDisp" class="value-disp">25</span></label>
        <input type="range" id="fEmpVal" min="5" max="100" value="25" oninput="updateSimulation()">
    </div>
"""
ex44_solution = """
    <div class="solution-step">
        <h4>1. Pares Ação-Reação (Exercício 4.24)</h4>
        <p>Em dois blocos A e B empurrados por força \\(F\\):</p>
        \\[ a = \\frac{F}{m_A + m_B} \\]
        <p>A força de contato que A exerce em B (\\(F_{AB}\\)) e que B exerce em A (\\(F_{BA}\\)) formam um par ação-reação:</p>
        \\[ F_{AB} = - F_{BA} = m_B \\cdot a \\]
    </div>
    <div class="solution-step">
        <h4>2. Caixa na Carroceria de Caminhão (Exercício 4.26)</h4>
        <p>A força de atrito que a carroceria exerce na caixa acelera a caixa para a frente, e a reação é o atrito que a caixa exerce na carroceria para trás.</p>
    </div>
"""
ex44_script = """
    function updateSimulation() {
        const ma = parseFloat(document.getElementById('maVal').value);
        const mb = parseFloat(document.getElementById('mbVal').value);
        const F = parseFloat(document.getElementById('fEmpVal').value);

        document.getElementById('maDisp').innerText = ma;
        document.getElementById('mbDisp').innerText = mb;
        document.getElementById('fEmpDisp').innerText = F;

        const a = (F / (ma + mb)).toFixed(2);
        const fab = (mb * a).toFixed(1);

        const canvas = document.getElementById('simCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,380,260);

        ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(20,200); ctx.lineTo(360,200); ctx.stroke();

        ctx.fillStyle = '#38bdf8'; ctx.fillRect(80,120,60,80); ctx.fillStyle="#fff"; ctx.fillText(`A (${ma}k)`, 90, 160);
        ctx.fillStyle = '#a855f7'; ctx.fillRect(140,100,80,100); ctx.fillStyle="#fff"; ctx.fillText(`B (${mb}k)`, 160, 150);

        drawArrow(ctx, 20, 160, 80, 160, '#22c55e', `F=${F}N`);
        drawArrow(ctx, 140, 160, 190, 160, '#fbbf24', `F_AB=${fab}N`);

        if (window.MathJax) MathJax.typesetPromise();
    }
"""

with open(os.path.join(cap4_dir, "exemplo-4-4.html"), "w", encoding="utf-8") as f:
    f.write(generate_example_html(ex44_title, ex44_desc, "exemplo-4-4.html", ex44_script, ex44_controls, ex44_solution))

print("Created exemplo-4-4.html!")

# -------------------------------------------------------------
# EXEMPLO 4.5: Aplicações com DCL: Rampas, Cadeiras e Prego (Exercícios 4.27 a 4.36)
# -------------------------------------------------------------
ex45_title = "Exemplo 4.5: Aplicações Práticas de DCL (Rampas e Cadeiras)"
ex45_desc = "Análise de forças normais, peso e tração em cadeiras inclinadas e martelos (Exercícios 4.27 a 4.36 do PDF)."
ex45_controls = """
    <div class="controls-group">
        <label>Massa do Homem/Cadeira (kg): <span id="mCadDisp" class="value-disp">65</span></label>
        <input type="range" id="mCadVal" min="20" max="120" value="65" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Ângulo do Plano Inclinado (°): <span id="angPlanoDisp" class="value-disp">26</span></label>
        <input type="range" id="angPlanoVal" min="5" max="60" value="26" oninput="updateSimulation()">
    </div>
"""
ex45_solution = """
    <div class="solution-step">
        <h4>1. Cadeira Puxada sob Ângulo (Exercício 4.27)</h4>
        <p>Para a cadeira em equilíbrio vertical (\\(a_y = 0\\)):</p>
        \\[ n - m g - F \\sin(37^\\circ) = 0 \\implies n = m g + F \\sin(37^\\circ) \\]
    </div>
    <div class="solution-step">
        <h4>2. Tração na Corda em Rampa (Exercício 4.28)</h4>
        <p>Para segurar um homem de 65 kg em uma rampa sem atrito a \\(26^\\circ\\):</p>
        \\[ T = m g \\sin\\theta = (65\\text{ kg})(9,80\\text{ m/s}^2)\\sin(26,0^\\circ) = 279\\text{ N} \\]
    </div>
"""
ex45_script = """
    function updateSimulation() {
        const m = parseFloat(document.getElementById('mCadVal').value);
        const angDeg = parseFloat(document.getElementById('angPlanoVal').value);
        const angRad = angDeg * Math.PI / 180;

        document.getElementById('mCadDisp').innerText = m;
        document.getElementById('angPlanoDisp').innerText = angDeg;

        const T = (m * 9.80 * Math.sin(angRad)).toFixed(1);

        const canvas = document.getElementById('simCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,380,260);

        ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(40,220); ctx.lineTo(340,220); ctx.lineTo(340,220 - 300*Math.tan(angRad)); ctx.closePath(); ctx.stroke();

        ctx.save(); ctx.translate(180, 220 - 140*Math.tan(angRad)); ctx.rotate(-angRad);
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(-25,-25,50,25);
        drawArrow(ctx, 0, -12, -70, -12, '#22c55e', `T = ${T} N`);
        ctx.restore();

        if (window.MathJax) MathJax.typesetPromise();
    }
"""

with open(os.path.join(cap4_dir, "exemplo-4-5.html"), "w", encoding="utf-8") as f:
    f.write(generate_example_html(ex45_title, ex45_desc, "exemplo-4-5.html", ex45_script, ex45_controls, ex45_solution))

print("Created exemplo-4-5.html!")

# -------------------------------------------------------------
# EXEMPLO 4.6: Sistemas Conectados: Elevadores, Halteres e Correntes (Exercícios 4.37 a 4.52)
# -------------------------------------------------------------
ex46_title = "Exemplo 4.6: Sistemas Conectados, Elevadores e Correntes"
ex46_desc = "Dinâmica de múltiplos corpos acoplados por cabos, tração em elevação e halterofilismo (Exercícios 4.37 a 4.52 do PDF)."
ex46_controls = """
    <div class="controls-group">
        <label>Massa Bloco Superior m1 (kg): <span id="m1Disp" class="value-disp">6</span></label>
        <input type="range" id="m1Val" min="1" max="20" value="6" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Massa Bloco Inferior m2 (kg): <span id="m2Disp" class="value-disp">5</span></label>
        <input type="range" id="m2Val" min="1" max="20" value="5" oninput="updateSimulation()">
    </div>
    <div class="controls-group">
        <label>Força para Cima F (N): <span id="fUpDisp" class="value-disp">200</span></label>
        <input type="range" id="fUpVal" min="100" max="400" value="200" oninput="updateSimulation()">
    </div>
"""
ex46_solution = """
    <div class="solution-step">
        <h4>1. Aceleração do Conjunto (Exercício 4.49)</h4>
        \\[ a = \\frac{F - (m_1 + m_2)g}{m_1 + m_2} = \\frac{200 - (11)(9,80)}{11} = \\frac{92,2}{11} = 3,53\\text{ m/s}^2 \\]
    </div>
    <div class="solution-step">
        <h4>2. Tração na Corda Intermediária</h4>
        <p>Analisando o bloco inferior (\\(m_2 = 5\\text{ kg}\\)):</p>
        \\[ T - m_2 g = m_2 a \\implies T = m_2(g + a) = 5(9,80 + 3,53) = 120\\text{ N} \\]
    </div>
"""
ex46_script = """
    function updateSimulation() {
        const m1 = parseFloat(document.getElementById('m1Val').value);
        const m2 = parseFloat(document.getElementById('m2Val').value);
        const F = parseFloat(document.getElementById('fUpVal').value);

        document.getElementById('m1Disp').innerText = m1;
        document.getElementById('m2Disp').innerText = m2;
        document.getElementById('fUpDisp').innerText = F;

        const mTot = m1 + m2;
        const a = ((F - mTot * 9.80) / mTot).toFixed(2);
        const T = (m2 * (9.80 + parseFloat(a))).toFixed(1);

        const canvas = document.getElementById('simCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,380,260);

        ctx.fillStyle = '#38bdf8'; ctx.fillRect(150,60,80,50); ctx.fillStyle="#fff"; ctx.fillText(`m1 = ${m1}kg`, 160, 90);
        ctx.fillStyle = '#a855f7'; ctx.fillRect(150,150,80,50); ctx.fillStyle="#fff"; ctx.fillText(`m2 = ${m2}kg`, 160, 180);

        drawArrow(ctx, 190, 60, 190, 10, '#22c55e', `F = ${F}N`);
        drawArrow(ctx, 190, 150, 190, 110, '#fbbf24', `T = ${T}N`);

        if (window.MathJax) MathJax.typesetPromise();
    }
"""

with open(os.path.join(cap4_dir, "exemplo-4-6.html"), "w", encoding="utf-8") as f:
    f.write(generate_example_html(ex46_title, ex46_desc, "exemplo-4-6.html", ex46_script, ex46_controls, ex46_solution))

print("Created exemplo-4-6.html!")

# -------------------------------------------------------------
# EXEMPLO 4.7: Forças Variáveis e Equações Diferenciais (Exercícios 4.53 a 4.57)
# -------------------------------------------------------------
ex47_title = "Exemplo 4.7: Forças Variáveis no Tempo e Cálculo Integral"
ex47_desc = "Integração da Segunda Lei de Newton para forças dependentes do tempo e velocidade (Exercícios 4.53 a 4.57 do PDF)."
ex47_controls = """
    <div class="controls-group">
        <label>Tempo t (s): <span id="tDisp" class="value-disp">5.0</span></label>
        <input type="range" id="tVal" min="0" max="10" step="0.5" value="5.0" oninput="updateSimulation()">
    </div>
"""
ex47_solution = """
    <div class="solution-step">
        <h4>1. Vetor Aceleração de Helicóptero (Exercício 4.53)</h4>
        \\[ \\vec{a}(t) = (0,120\\text{ m/s}^3) t \\hat{i} - (0,12\\text{ m/s}^2) \\hat{k} \\]
        <p>Para \\(t = 5,0\\text{ s}\\) e peso \\(w = 2,75 \\times 10^5\\text{ N}\\) (\\(m = 2,806 \\times 10^4\\text{ kg}\\)):</p>
        \\[ \\vec{F}(5\\text{ s}) = (1,7 \\times 10^4)\\hat{i} - (3,4 \\times 10^3)\\hat{k} \\text{ N} \\]
    </div>
    <div class="solution-step">
        <h4>2. Atrito Quadrático com a Velocidade (Exercício 4.56)</h4>
        \\[ -C v^2 = m \\frac{dv}{dt} \\implies -\\frac{C}{m} dt = \\frac{dv}{v^2} \\implies x - x_0 = \\frac{m}{C} \\ln\\left(\\frac{v_0}{v}\\right) \\]
    </div>
"""
ex47_script = """
    function updateSimulation() {
        const t = parseFloat(document.getElementById('tVal').value);
        document.getElementById('tDisp').innerText = t.toFixed(1);

        const ax = (0.120 * t).toFixed(2);

        const canvas = document.getElementById('simCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,380,260);

        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40,220); ctx.lineTo(360,220); ctx.moveTo(40,220); ctx.lineTo(40,40); ctx.stroke();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40,220); ctx.lineTo(40 + t*30, 220 - ax*30); ctx.stroke();

        if (window.MathJax) MathJax.typesetPromise();
    }
"""

with open(os.path.join(cap4_dir, "exemplo-4-7.html"), "w", encoding="utf-8") as f:
    f.write(generate_example_html(ex47_title, ex47_desc, "exemplo-4-7.html", ex47_script, ex47_controls, ex47_solution))

print("Created exemplo-4-7.html!")

# -------------------------------------------------------------
# INDICE DO CAPÍTULO 4 (index.html)
# -------------------------------------------------------------
index_html = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capítulo 4: Leis de Newton do Movimento | FSC5101</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #070a12;
            --bg-card: rgba(15, 23, 42, 0.9);
            --bg-card-border: rgba(56, 189, 248, 0.25);
            --accent-cyan: #38bdf8;
            --accent-gold: #fbbf24;
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background-color: var(--bg-dark); color: var(--text-main); padding: 40px 20px; }
        .container { max-width: 1000px; margin: 0 auto; }
        .back-nav { margin-bottom: 24px; }
        .back-btn { background: rgba(255,255,255,0.08); border: 1px solid var(--bg-card-border); color: var(--accent-cyan); padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 700; }
        .header { text-align: center; margin-bottom: 35px; }
        .header h1 { font-family: 'Outfit', sans-serif; font-size: 2.4rem; color: var(--accent-cyan); margin-bottom: 8px; }
        
        .hero-banner {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
            border: 1px solid var(--accent-cyan);
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: center;
        }
        .hero-banner h2 { font-family: 'Outfit', sans-serif; color: var(--accent-gold); font-size: 1.6rem; margin-bottom: 10px; }
        .hero-btn { background: var(--accent-cyan); color: #020617; padding: 12px 24px; border-radius: 10px; font-weight: 800; text-decoration: none; display: inline-block; margin-top: 10px; }

        .card { background: var(--bg-card); border: 1px solid var(--bg-card-border); border-radius: 14px; padding: 22px; margin-bottom: 16px; text-decoration: none; color: inherit; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
        .card:hover { border-color: var(--accent-cyan); transform: translateY(-2px); }
        .card-btn { background: rgba(56, 189, 248, 0.15); color: var(--accent-cyan); border: 1px solid var(--accent-cyan); padding: 8px 16px; border-radius: 8px; font-weight: 700; }
    </style>
</head>
<body>
    <div class="container">
        <div class="back-nav"><a href="../index.html" class="back-btn">← Voltar ao Índice Geral</a></div>
        <div class="header">
            <h1>⚖️ Capítulo 4: Leis de Newton do Movimento</h1>
            <p>Exercícios, Demonstrações Interativas e Apresentação de Slidedeck Completa</p>
        </div>

        <div class="hero-banner">
            <h2><i class="fa-solid fa-desktop"></i> Apresentação do Capítulo 4</h2>
            <p style="color:var(--text-sub); font-size:1.05rem;">Acesse os slides didáticos com diagramas vetoriais e visualizações interativas das 3 Leis de Newton.</p>
            <a href="apresentacao.html" class="hero-btn"><i class="fa-solid fa-play"></i> Abrir Apresentação de Slides →</a>
        </div>

        <h3 style="color:var(--accent-cyan); margin-bottom:16px; font-family:'Outfit', sans-serif; font-size:1.4rem;">Exemplos e Exercícios Resolvidos (PDF 4.1 a 4.57)</h3>

        <a href="exemplo-4-1.html" class="card">
            <div>
                <div style="font-weight:700; font-size:1.2rem; margin-bottom:6px;">Exemplo 4.1: Leis de Newton em Plano Inclinado com Atrito</div>
                <div style="color:var(--text-sub); font-size:0.92rem;">Superposição de forças, plano inclinado com atrito e força resultante.</div>
            </div>
            <div class="card-btn">Abrir →</div>
        </a>

        <a href="exemplo-4-2.html" class="card">
            <div>
                <div style="font-weight:700; font-size:1.2rem; margin-bottom:6px;">Exemplo 4.2: Superposição de Forças e Rotação de Eixos (4.1 a 4.6)</div>
                <div style="color:var(--text-sub); font-size:0.92rem;">Forças perpendiculares, decomposição cartesiana e invariância por rotação de eixos.</div>
            </div>
            <div class="card-btn">Abrir →</div>
        </a>

        <a href="exemplo-4-3.html" class="card">
            <div>
                <div style="font-weight:700; font-size:1.2rem; margin-bottom:6px;">Exemplo 4.3: Segunda Lei de Newton (F = ma) e Movimento (4.7 a 4.14)</div>
                <div style="color:var(--text-sub); font-size:0.92rem;">Aceleração de blocos, desaceleração com atrito e campo elétrico em elétrons.</div>
            </div>
            <div class="card-btn">Abrir →</div>
        </a>

        <a href="exemplo-4-4.html" class="card">
            <div>
                <div style="font-weight:700; font-size:1.2rem; margin-bottom:6px;">Exemplo 4.4: Terceira Lei de Newton e DCL (4.15 a 4.26)</div>
                <div style="color:var(--text-sub); font-size:0.92rem;">Ação e reação, blocos encostados e forças de atrito na carroceria de caminhões.</div>
            </div>
            <div class="card-btn">Abrir →</div>
        </a>

        <a href="exemplo-4-5.html" class="card">
            <div>
                <div style="font-weight:700; font-size:1.2rem; margin-bottom:6px;">Exemplo 4.5: Aplicações Práticas de DCL (4.27 a 4.36)</div>
                <div style="color:var(--text-sub); font-size:0.92rem;">Rampas, cadeiras puxadas sob ângulo, martelo com prego e salto de atletas.</div>
            </div>
            <div class="card-btn">Abrir →</div>
        </a>

        <a href="exemplo-4-6.html" class="card">
            <div>
                <div style="font-weight:700; font-size:1.2rem; margin-bottom:6px;">Exemplo 4.6: Sistemas Conectados e Elevadores (4.37 a 4.52)</div>
                <div style="color:var(--text-sub); font-size:0.92rem;">Tração em cabos, elevação de halterofilistas e correntes com múltiplos elos.</div>
            </div>
            <div class="card-btn">Abrir →</div>
        </a>

        <a href="exemplo-4-7.html" class="card">
            <div>
                <div style="font-weight:700; font-size:1.2rem; margin-bottom:6px;">Exemplo 4.7: Forças Variáveis e Equações Diferenciais (4.53 a 4.57)</div>
                <div style="color:var(--text-sub); font-size:0.92rem;">Forças dependentes do tempo F(t), resistência quadrática do ar e cálculo integral.</div>
            </div>
            <div class="card-btn">Abrir →</div>
        </a>

    </div>
</body>
</html>
"""

with open(os.path.join(cap4_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

print("Updated capitulo-4/index.html!")
