# -*- coding: utf-8 -*-
"""
Builder for MJO, Seasons, ENSO, Teleconnections, SALLJ and SESA Precipitation Interactive Demo.
Generates an advanced, high-performance HTML/JS/CSS application with full scientific grounding.
"""
import os
import json

OUTPUT_DIR = r"C:\Users\haas\github\demos\mesoescala\mjo-teleconexoes-sesa"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "index.html")
ONEDRIVE_DIR = r"C:\Users\haas\OneDrive\Documentos\disciplinas\FSC5101_Fisica_I\demos\mesoescala\mjo-teleconexoes-sesa"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ONEDRIVE_DIR, exist_ok=True)

html_content = r'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MJO, Estações, ENOS, Teleconexões, SALLJ & Chuvas no SESA</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    
    <!-- FontAwesome 6.5.1 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- KaTeX para Fórmulas Matemáticas -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

    <style>
        :root {
            --bg-dark: #050813;
            --bg-surface: #0a1122;
            --card-bg: rgba(13, 22, 42, 0.94);
            --card-border: rgba(56, 189, 248, 0.28);
            --card-border-glow: rgba(56, 189, 248, 0.65);
            --accent-cyan: #38bdf8;
            --accent-blue: #3b82f6;
            --accent-emerald: #10b981;
            --accent-gold: #fbbf24;
            --accent-orange: #f97316;
            --accent-rose: #f43f5e;
            --accent-purple: #a855f7;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --text-dim: #64748b;
            --font-main: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-title: 'Outfit', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-dark);
            background-image: 
                radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.08) 0%, transparent 45%),
                radial-gradient(circle at 85% 85%, rgba(168, 85, 247, 0.08) 0%, transparent 45%),
                linear-gradient(180deg, #070c1a 0%, #03060d 100%);
            color: var(--text-main);
            font-family: var(--font-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }

        /* Top Header */
        header {
            padding: 12px 24px;
            background: rgba(10, 17, 34, 0.96);
            border-bottom: 1px solid var(--card-border);
            backdrop-filter: blur(14px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 14px;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .header-title-box {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .back-btn {
            background: rgba(56, 189, 248, 0.12);
            color: var(--accent-cyan);
            border: 1px solid rgba(56, 189, 248, 0.35);
            padding: 8px 14px;
            border-radius: 9px;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }

        .back-btn:hover {
            background: var(--accent-cyan);
            color: #020617;
            transform: translateX(-2px);
        }

        .header-title {
            font-family: var(--font-title);
            font-size: 1.35rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            background: linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #fbbf24 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
            font-size: 0.78rem;
            color: var(--text-muted);
            margin-top: 2px;
        }

        /* Control Strip in Header */
        .controls-top-bar {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .control-group-pill {
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(15, 23, 42, 0.85);
            padding: 4px 8px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pill-label {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-right: 2px;
        }

        .btn-select-pill {
            background: transparent;
            border: 1px solid transparent;
            color: var(--text-muted);
            font-family: var(--font-mono);
            font-size: 0.76rem;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.18s ease;
        }

        .btn-select-pill:hover {
            background: rgba(56, 189, 248, 0.15);
            color: var(--text-main);
        }

        .btn-select-pill.active {
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
            color: #020617;
            border-color: var(--accent-cyan);
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.45);
        }

        .btn-enso-pill.active[data-enso="el-nino"] {
            background: linear-gradient(135deg, #f97316, #ef4444);
            color: #ffffff;
            border-color: #f97316;
            box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
        }

        .btn-enso-pill.active[data-enso="la-nina"] {
            background: linear-gradient(135deg, #0284c7, #38bdf8);
            color: #020617;
            border-color: #38bdf8;
            box-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
        }

        .btn-enso-pill.active[data-enso="neutro"] {
            background: linear-gradient(135deg, #475569, #64748b);
            color: #ffffff;
            border-color: #94a3b8;
        }

        .play-cycle-btn {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid var(--accent-emerald);
            color: var(--accent-emerald);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .play-cycle-btn:hover {
            background: var(--accent-emerald);
            color: #020617;
        }

        /* Voice Narration Controls */
        .voice-btn {
            background: rgba(168, 85, 247, 0.18);
            border: 1px solid rgba(168, 85, 247, 0.4);
            color: #d8b4fe;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .voice-btn:hover {
            background: var(--accent-purple);
            color: #020617;
        }

        /* Climate Summary Ribbon */
        .climate-ribbon {
            background: rgba(15, 23, 42, 0.7);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding: 6px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 0.78rem;
            color: var(--text-muted);
        }

        .climate-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 8px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Layout Grid */
        .app-container {
            display: grid;
            grid-template-columns: 1fr 450px;
            gap: 16px;
            padding: 16px 20px;
            flex: 1;
            max-width: 1920px;
            margin: 0 auto;
            width: 100%;
        }

        @media (max-width: 1300px) {
            .app-container {
                grid-template-columns: 1fr;
            }
        }

        /* Left Column: Interactive Map & Viewport Controls */
        .main-stage {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .map-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .map-toolbar {
            padding: 10px 16px;
            background: rgba(15, 23, 42, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .view-tabs {
            display: flex;
            gap: 6px;
        }

        .view-tab {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-muted);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .view-tab.active, .view-tab:hover {
            background: rgba(56, 189, 248, 0.18);
            border-color: var(--accent-cyan);
            color: var(--text-main);
        }

        .layer-toggles {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .layer-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-muted);
            padding: 5px 9px;
            border-radius: 7px;
            font-size: 0.73rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.18s;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .layer-btn.active {
            border-color: currentColor;
            background: rgba(255, 255, 255, 0.12);
        }

        .layer-btn[data-layer="stj"].active { color: #38bdf8; }
        .layer-btn[data-layer="pfj"].active { color: #c084fc; }
        .layer-btn[data-layer="sallj"].active { color: #34d399; }
        .layer-btn[data-layer="rain"].active { color: #38bdf8; }
        .layer-btn[data-layer="rossby"].active { color: #fbbf24; }
        .layer-btn[data-layer="olr"].active { color: #f97316; }
        .layer-btn[data-layer="particles"].active { color: #67e8f9; }

        .canvas-container {
            position: relative;
            width: 100%;
            height: 560px;
            background: #040711;
            cursor: grab;
            overflow: hidden;
        }

        .canvas-container:active {
            cursor: grabbing;
        }

        #mapCanvas {
            width: 100%;
            height: 100%;
            display: block;
        }

        /* HUD Overlays on Map */
        .map-hud-legend {
            position: absolute;
            bottom: 12px;
            left: 14px;
            background: rgba(7, 12, 24, 0.9);
            border: 1px solid rgba(56, 189, 248, 0.3);
            border-radius: 10px;
            padding: 10px 14px;
            backdrop-filter: blur(8px);
            font-size: 0.72rem;
            color: var(--text-main);
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 6px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            max-width: 340px;
        }

        .legend-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .legend-line {
            width: 24px;
            height: 4px;
            border-radius: 2px;
        }

        .legend-badge {
            width: 12px;
            height: 12px;
            border-radius: 3px;
        }

        .map-controls-floating {
            position: absolute;
            top: 14px;
            right: 14px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            z-index: 20;
        }

        .map-control-btn {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid var(--card-border);
            color: var(--text-main);
            width: 34px;
            height: 34px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.18s;
            font-size: 0.85rem;
        }

        .map-control-btn:hover {
            background: var(--accent-cyan);
            color: #020617;
        }

        .map-tooltip {
            position: absolute;
            background: rgba(10, 18, 35, 0.96);
            border: 1px solid var(--accent-cyan);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.76rem;
            color: var(--text-main);
            pointer-events: none;
            display: none;
            z-index: 50;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
            white-space: nowrap;
        }

        /* Bottom Section of Left Column: Vertical Cross Section & Teleconnection Status */
        .bottom-dash {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        @media (max-width: 900px) {
            .bottom-dash {
                grid-template-columns: 1fr;
            }
        }

        .sub-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 14px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .card-header-mini {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 6px;
        }

        .card-header-mini h3 {
            font-family: var(--font-title);
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--accent-cyan);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .cross-section-canvas {
            width: 100%;
            height: 180px;
            background: #040814;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            display: block;
        }

        /* Right Column: RMM Diagram, Logit Ruler, & Physical Insight */
        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        /* Wheeler-Hendon RMM Diagram Card */
        .rmm-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .rmm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .rmm-header h2 {
            font-family: var(--font-title);
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--accent-gold);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .rmm-canvas-box {
            position: relative;
            width: 100%;
            height: 270px;
            background: #060a16;
            border-radius: 12px;
            border: 1px solid rgba(251, 191, 36, 0.25);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #rmmCanvas {
            width: 100%;
            height: 100%;
            display: block;
            cursor: crosshair;
        }

        .rmm-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            background: rgba(15, 23, 42, 0.6);
            padding: 8px;
            border-radius: 10px;
            text-align: center;
        }

        .metric-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .metric-label {
            font-size: 0.68rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
        }

        .metric-value {
            font-family: var(--font-mono);
            font-size: 0.92rem;
            font-weight: 700;
            color: var(--text-main);
        }

        /* Logit Ruler Card */
        .logit-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .logit-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logit-header h2 {
            font-family: var(--font-title);
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--accent-emerald);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .logit-ruler-canvas {
            width: 100%;
            height: 140px;
            background: #050a17;
            border-radius: 10px;
            border: 1px solid rgba(16, 185, 129, 0.25);
            display: block;
        }

        .logit-controls {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 0.78rem;
        }

        .logit-control-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .logit-control-row select, .logit-control-row input[type="range"] {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: var(--text-main);
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 0.76rem;
        }

        /* Diagnostic Card */
        .diagnostic-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 0.8rem;
            line-height: 1.5;
        }

        .diag-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.78rem;
            width: fit-content;
        }

        .diag-status-badge.favoravel {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .diag-status-badge.desfavoravel {
            background: rgba(244, 63, 94, 0.2);
            color: #fb7185;
            border: 1px solid rgba(244, 63, 94, 0.4);
        }

        .diag-status-badge.neutro {
            background: rgba(251, 191, 36, 0.2);
            color: #fcd34d;
            border: 1px solid rgba(251, 191, 36, 0.4);
        }

        /* Theory & Terminology Section */
        .theory-section {
            margin: 10px 20px 30px 20px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            overflow: hidden;
        }

        .theory-header {
            padding: 14px 20px;
            background: rgba(15, 23, 42, 0.95);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: var(--font-title);
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--accent-cyan);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .theory-body {
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            font-size: 0.85rem;
            line-height: 1.6;
            color: #cbd5e1;
        }

        .theory-block h4 {
            color: var(--accent-gold);
            font-family: var(--font-title);
            font-size: 0.95rem;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .equation-box {
            background: rgba(0, 0, 0, 0.35);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 10px;
            margin: 8px 0;
            text-align: center;
            overflow-x: auto;
        }

        .term-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.78rem;
            margin-top: 6px;
        }

        .term-table th, .term-table td {
            padding: 6px 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: left;
        }

        .term-table th {
            background: rgba(56, 189, 248, 0.15);
            color: var(--accent-cyan);
            font-weight: 700;
        }

        .term-table tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.02);
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="header-title-box">
            <a href="../../index.html" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Demos</a>
            <div>
                <h1 class="header-title">MJO, Estações, ENOS & Chuvas no SESA</h1>
                <p class="header-subtitle">Modulação de Baixa Frequência, Jato de Baixos Níveis (SALLJ), Jato Subtropical (200 hPa) & Jato Polar (300 hPa)</p>
            </div>
        </div>

        <!-- Controls: Season, ENSO, MJO Phase & Voice -->
        <div class="controls-top-bar">
            
            <!-- Seletor de Estação do Ano -->
            <div class="control-group-pill">
                <span class="pill-label"><i class="fa-solid fa-calendar-days"></i> Estação:</span>
                <button class="btn-select-pill btn-season-pill active" data-season="DJF" title="Dezembro, Janeiro, Fevereiro (Verão Austral)">☀️ DJF (Verão)</button>
                <button class="btn-select-pill btn-season-pill" data-season="MAM" title="Março, Abril, Maio (Outono Austral)">🍂 MAM (Outono)</button>
                <button class="btn-select-pill btn-season-pill" data-season="JJA" title="Junho, Julho, Agosto (Inverno Austral)">❄️ JJA (Inverno)</button>
                <button class="btn-select-pill btn-season-pill" data-season="SON" title="Setembro, Outubro, Novembro (Primavera Austral)">🌸 SON (Prim.)</button>
            </div>

            <!-- Seletor de Fase do ENOS -->
            <div class="control-group-pill">
                <span class="pill-label"><i class="fa-solid fa-temperature-arrow-up"></i> ENOS:</span>
                <button class="btn-select-pill btn-enso-pill" data-enso="el-nino" title="El Niño: Aquecimento no Pacífico Central/Leste, Jato Subtropical ao norte">🔥 El Niño</button>
                <button class="btn-select-pill btn-enso-pill active" data-enso="neutro" title="Neutro: Climatologia padrão">⚖️ Neutro</button>
                <button class="btn-select-pill btn-enso-pill" data-enso="la-nina" title="La Niña: Pacífico frio, Jato Subtropical ao sul, recarga prolongada">🧊 La Niña</button>
            </div>

            <!-- Seletor de Fases da MJO -->
            <div class="control-group-pill">
                <span class="pill-label"><i class="fa-solid fa-compass"></i> MJO:</span>
                <button class="btn-select-pill btn-phase-pill" data-phase="1">1</button>
                <button class="btn-select-pill btn-phase-pill" data-phase="2">2</button>
                <button class="btn-select-pill btn-phase-pill active" data-phase="3">3</button>
                <button class="btn-select-pill btn-phase-pill" data-phase="4">4</button>
                <button class="btn-select-pill btn-phase-pill" data-phase="5">5</button>
                <button class="btn-select-pill btn-phase-pill" data-phase="6">6</button>
                <button class="btn-select-pill btn-phase-pill" data-phase="7">7</button>
                <button class="btn-select-pill btn-phase-pill" data-phase="8">8</button>
                <button class="play-cycle-btn" id="btnPlayCycle" title="Ciclo completo 45 dias para leste"><i class="fa-solid fa-play"></i> Ciclo 45d</button>
            </div>

            <!-- Voice Narration -->
            <div class="control-group-pill" style="border-color: rgba(168, 85, 247, 0.4);">
                <button class="voice-btn" id="btnVoice"><i class="fa-solid fa-volume-high"></i> Narrar Diagnóstico</button>
                <button class="voice-btn" id="btnVoiceStop" style="display:none; background:rgba(244,63,94,0.2); border-color:var(--accent-rose); color:#fda4af;"><i class="fa-solid fa-stop"></i> Parar</button>
            </div>

        </div>
    </header>

    <!-- Climate Summary Ribbon -->
    <div class="climate-ribbon">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <span class="climate-tag"><i class="fa-solid fa-compass" style="color:var(--accent-gold);"></i> <b>Estado Atual:</b> <span id="ribbonState">Verão (DJF) • ENOS Neutro • MJO Fase 3</span></span>
            <span class="climate-tag"><i class="fa-solid fa-wind" style="color:var(--accent-cyan);"></i> <b>Jato Subtropical (200 hPa):</b> <span id="ribbonSTJ">28°S (58 m/s, entrada equatorial ativa)</span></span>
            <span class="climate-tag"><i class="fa-solid fa-snowflake" style="color:var(--accent-purple);"></i> <b>Jato Polar (300 hPa):</b> <span id="ribbonPFJ">52°S (retraído ao sul)</span></span>
            <span class="climate-tag"><i class="fa-solid fa-water" style="color:var(--accent-emerald);"></i> <b>SALLJ (850 hPa):</b> <span id="ribbonSALLJ">Encostado nos Andes até o Prata (Q = 540 kg/m s)</span></span>
        </div>
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-gold);" id="ribbonDecomp">
            Decomposição R = ν · r̄: ν normal | r̄ normal
        </div>
    </div>

    <!-- App Container -->
    <div class="app-container">
        
        <!-- Left Column: Map & Stage -->
        <div class="main-stage">
            
            <div class="map-card">
                <!-- Toolbar -->
                <div class="map-toolbar">
                    <div class="view-tabs">
                        <button class="view-tab" data-view="global"><i class="fa-solid fa-globe"></i> Global (MJO, PSA & Jatos)</button>
                        <button class="view-tab active" data-view="south-america"><i class="fa-solid fa-map-location-dot"></i> América do Sul & SESA</button>
                        <button class="view-tab" data-view="tropics"><i class="fa-solid fa-sun"></i> Faixa Tropical & Walker</button>
                    </div>

                    <!-- Layer Toggles -->
                    <div class="layer-toggles">
                        <button class="layer-btn active" data-layer="stj" title="Jato Subtropical em 200 hPa (Duto Ks)"><i class="fa-solid fa-wind"></i> Jato Subtrop. (200 hPa)</button>
                        <button class="layer-btn active" data-layer="pfj" title="Jato Polar em 300 hPa"><i class="fa-solid fa-snowflake"></i> Jato Polar (300 hPa)</button>
                        <button class="layer-btn active" data-layer="sallj" title="South American Low-Level Jet (850 hPa)"><i class="fa-solid fa-water"></i> SALLJ (850 hPa)</button>
                        <button class="layer-btn active" data-layer="rain" title="Anomalia de Chuva (SESA vs ZCAS)"><i class="fa-solid fa-cloud-showers-heavy"></i> Chuva Dipolo</button>
                        <button class="layer-btn active" data-layer="rossby" title="Trem de Ondas de Rossby / PSA"><i class="fa-solid fa-wave-square"></i> Trem PSA</button>
                        <button class="layer-btn active" data-layer="olr" title="Envelope de Convecção MJO (OLR)"><i class="fa-solid fa-cloud"></i> OLR MJO</button>
                        <button class="layer-btn active" data-layer="particles" title="Animação de Linhas de Corrente"><i class="fa-solid fa-ellipsis"></i> Partículas</button>
                    </div>
                </div>

                <!-- Canvas Map Container -->
                <div class="canvas-container" id="mapContainer">
                    <canvas id="mapCanvas"></canvas>
                    
                    <!-- Floating Controls -->
                    <div class="map-controls-floating">
                        <button class="map-control-btn" id="btnZoomIn" title="Aumentar Zoom"><i class="fa-solid fa-plus"></i></button>
                        <button class="map-control-btn" id="btnZoomOut" title="Diminuir Zoom"><i class="fa-solid fa-minus"></i></button>
                        <button class="map-control-btn" id="btnResetView" title="Centralizar Visualização"><i class="fa-solid fa-crosshairs"></i></button>
                    </div>

                    <!-- HUD Legend -->
                    <div class="map-hud-legend" id="hudLegend">
                        <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 2px;">Camadas Meteorológicas</div>
                        <div class="legend-row">
                            <div class="legend-line" style="background: #38bdf8;"></div>
                            <span>Jato Subtropical (~200 hPa, Duto Ks de Rossby)</span>
                        </div>
                        <div class="legend-row">
                            <div class="legend-line" style="background: #c084fc;"></div>
                            <span>Jato Polar (~300 hPa, Frente Polar Extratropical)</span>
                        </div>
                        <div class="legend-row">
                            <div class="legend-line" style="background: #34d399; height: 5px;"></div>
                            <span>SALLJ Jato de Baixos Níveis (850 hPa, Fluxo Q)</span>
                        </div>
                        <div class="legend-row">
                            <div class="legend-badge" style="background: #10b981;"></div>
                            <span>Anomalia Positiva de Precipitação (+ Chuva / SCMs)</span>
                        </div>
                        <div class="legend-row">
                            <div class="legend-badge" style="background: #f97316;"></div>
                            <span>Anomalia Negativa de Precipitação (Seca / Subsidência)</span>
                        </div>
                        <div class="legend-row">
                            <div class="legend-badge" style="background: #f43f5e; border-radius: 50%;"></div>
                            <span style="color:#fda4af;">A: Alta/Anticiclone PSA | B: Baixa/Cavado PSA</span>
                        </div>
                    </div>

                    <!-- Tooltip -->
                    <div class="map-tooltip" id="mapTooltip"></div>
                </div>
            </div>

            <!-- Bottom Dashboard (Cross Section & Teleconnection Status) -->
            <div class="bottom-dash">
                <!-- Vertical Atmospheric Coupling Cross-Section -->
                <div class="sub-card">
                    <div class="card-header-mini">
                        <h3><i class="fa-solid fa-layer-group"></i> Acoplamento Vertical no SESA (1000 hPa a 150 hPa)</h3>
                        <span style="font-size:0.72rem; color:var(--text-muted);" id="csLatitudeHeader">Corte Zonal ~28°S (Andes ao Atlântico)</span>
                    </div>
                    <canvas class="cross-section-canvas" id="crossSectionCanvas"></canvas>
                    <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
                        <span><b style="color:#34d399;">850 hPa:</b> SALLJ convergindo umidade</span>
                        <span><b style="color:#38bdf8;">200 hPa:</b> Divergência Jet Streak</span>
                        <span id="verticalCouplingStatus" style="font-weight:700; color:#34d399;">ACOPLADO (SCMs Ativos)</span>
                    </div>
                </div>

                <!-- Rossby Wave Train & Teleconnection Details -->
                <div class="sub-card">
                    <div class="card-header-mini">
                        <h3><i class="fa-solid fa-satellite-dish"></i> Teleconexão PSA & Modulação Estação / ENOS</h3>
                        <span id="rossbyTransitTime" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--accent-gold);">Retardo τ ≈ 9 dias</span>
                    </div>
                    <div style="font-size:0.78rem; line-height:1.5; color:#cbd5e1; display:flex; flex-direction:column; gap:6px;">
                        <div><b>Fonte Tropical:</b> <span id="sourceRossbyText">Aquecimento anômalo no Índico oriental / Continente Marítimo</span></div>
                        <div><b>Duto Subtropical (Ks):</b> <span id="ductRossbyText">Jato Subtropical guia o trem PSA pelo Pacífico Sul</span></div>
                        <div><b>Estado Básico ENOS:</b> <span id="ensoBasicStateText">Neutro (climatologia normal de eventos de jato)</span></div>
                        <div style="background:rgba(255,255,255,0.04); border-left:3px solid var(--accent-cyan); padding:6px 10px; border-radius:4px; font-size:0.74rem;">
                            <i>"A MJO não liga nem desliga a chuva do SESA; ela decide em que latitude o jato de baixos níveis entrega a umidade que já está transportando."</i>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Right Column: RMM Diagram, Logit Ruler, Diagnostic -->
        <div class="sidebar">
            
            <!-- Wheeler-Hendon RMM Diagram -->
            <div class="rmm-card">
                <div class="rmm-header">
                    <h2><i class="fa-solid fa-compass"></i> Diagrama RMM (Wheeler & Hendon)</h2>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">RMM1 vs RMM2</span>
                </div>

                <div class="rmm-canvas-box">
                    <canvas id="rmmCanvas"></canvas>
                </div>

                <div class="rmm-metrics">
                    <div class="metric-item">
                        <span class="metric-label">Fase Ativa</span>
                        <span class="metric-value" id="rmmPhaseVal" style="color:var(--accent-gold);">Fase 3</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Amplitude A</span>
                        <span class="metric-value" id="rmmAmpVal" style="color:var(--accent-cyan);">1.85</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Status MJO</span>
                        <span class="metric-value" id="rmmStatusVal" style="color:var(--accent-emerald);">Ativa (A &gt; 1)</span>
                    </div>
                </div>

                <!-- Amplitude Slider & Simulation Controls -->
                <div style="display:flex; align-items:center; gap:10px; font-size:0.76rem;">
                    <span style="color:var(--text-muted);">Amplitude (A):</span>
                    <input type="range" id="sliderAmp" min="0.2" max="2.8" step="0.05" value="1.85" style="flex:1;">
                    <span id="sliderAmpVal" style="font-family:var(--font-mono); width:28px;">1.85</span>
                </div>
            </div>

            <!-- Régua do Logito (Figura 1.3 & Equação 1.8 do Livro) -->
            <div class="logit-card">
                <div class="logit-header">
                    <h2><i class="fa-solid fa-ruler-combined"></i> A Régua do Logito (Equação 1.8)</h2>
                    <span style="font-size:0.72rem; color:var(--text-muted);">Salio et al. (2007)</span>
                </div>

                <!-- Visual Logit Dual-Ruler Canvas -->
                <canvas class="logit-ruler-canvas" id="logitRulerCanvas"></canvas>

                <!-- Controls for Logit Ingredients -->
                <div class="logit-controls">
                    <div class="logit-control-row">
                        <span><i class="fa-solid fa-water" style="color:#34d399;"></i> SALLJ Presente:</span>
                        <select id="selSALLJ">
                            <option value="1">Sim (+1.63 no logito, ×5.1 nas chances)</option>
                            <option value="0">Não (Climatologia base sem jato: 12%)</option>
                        </select>
                    </div>

                    <div class="logit-control-row">
                        <span><i class="fa-solid fa-scale-balanced" style="color:var(--accent-gold);"></i> Decomposição Sazonal (R = ν · r̄):</span>
                        <span id="decompMetricsBadge" style="font-family:var(--font-mono); font-size:0.76rem; color:var(--accent-cyan);">ν: +25% | r̄: Normal</span>
                    </div>

                    <div class="logit-control-row" style="background:rgba(16,185,129,0.1); padding:6px 8px; border-radius:6px; border:1px solid rgba(16,185,129,0.2);">
                        <span style="font-weight:700; color:var(--accent-emerald);">Probabilidade Final P(SCM no SESA):</span>
                        <span id="finalProbVal" style="font-family:var(--font-mono); font-size:1.05rem; font-weight:800; color:#34d399;">68.4%</span>
                    </div>
                </div>
            </div>

            <!-- Diagnostic Card -->
            <div class="diagnostic-card" id="diagCard">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; color:var(--text-main);" id="diagTitle">Diagnóstico para SESA & Bacia do Prata</span>
                    <span class="diag-status-badge favoravel" id="diagBadge">ALTO RISCO DE CHEIA</span>
                </div>
                <div id="diagDescription" style="color:var(--text-muted);">
                    Fase 3 da MJO no Verão (DJF) com ENOS Neutro: O SALLJ permanece fortemente encostado na barreira dos Andes até o Paraguai e Rio Grande do Sul. Em 200 hPa, a entrada equatorial do jato subtropical impõe divergência vigorosa em altitude sobre o mesmo ponto.
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.74rem; background:rgba(0,0,0,0.25); padding:6px 8px; border-radius:6px;">
                    <div><b>Comportamento SALLJ:</b> <span id="diagSalljBehav" style="color:#34d399;">Encostado nos Andes</span></div>
                    <div><b>Latitude de Curvatura:</b> <span id="diagLatDet" style="color:#38bdf8;">Ao sul de 25°S (Prata)</span></div>
                    <div><b>Dipolo ZCAS:</b> <span id="diagZcasStatus" style="color:#f97316;">Suprimida / Seca</span></div>
                    <div><b>Anomalia SESA:</b> <span id="diagSesaAnom" style="color:#34d399;">+60% a +100%</span></div>
                </div>
            </div>

        </div>

    </div>

    <!-- Collapsible Theory & Documentation Section -->
    <div class="theory-section">
        <div class="theory-header" id="theoryToggle">
            <span><i class="fa-solid fa-book-open"></i> Fundamentos Físicos & Terminologia Regional (Complemento ao Livro de Mesoescala)</span>
            <i class="fa-solid fa-chevron-down" id="theoryIcon"></i>
        </div>
        <div class="theory-body" id="theoryBody">
            <!-- Col 1 -->
            <div class="theory-block">
                <h4><i class="fa-solid fa-water"></i> O SALLJ e o Transporte de Umidade</h4>
                <p>O SALLJ é um jato de barreira: o escoamento de leste dos alísios encontra a Cordilheira dos Andes, não tem energia cinética para transpô-la, e é defletido para sul ao longo dela, gerando uma corrente estreita de norte com máximo entre 1 km e 1,5 km de altura (850 hPa).</p>
                <div class="equation-box">
                    $$\vec{Q} = \frac{1}{g} \int_{p_t}^{p_s} q \vec{v} \, dp$$
                </div>
                <p>A quantidade que interessa à Bacia do Prata não é apenas a velocidade do jato, mas o fluxo de umidade integrado na vertical $\vec{Q}$. A convergência de $\vec{Q}$ na saída do jato sustenta os Complexos Convectivos de Mesoescala (SCMs).</p>
            </div>

            <!-- Col 2 -->
            <div class="theory-block">
                <h4><i class="fa-solid fa-wind"></i> Teleconexões: Fonte de Rossby & Jato Subtropical</h4>
                <p>O envelope convectivo da MJO impõe divergência em altitude nos trópicos. Em um escoamento divergente que atravessa gradientes de vorticidade absoluta, gera-se a Fonte de Ondas de Rossby (Sardeshmukh & Hoskins, 1988):</p>
                <div class="equation-box">
                    $$S = -\nabla \cdot (\vec{v}_\chi \zeta_a) = -\zeta_a \nabla \cdot \vec{v}_\chi - \vec{v}_\chi \cdot \nabla \zeta_a$$
                </div>
                <p>Como $f < 0$ no Hemisfério Sul, o sinal inverte-se. O <b>Jato Subtropical</b> atua como duto condutor com número de onda estacionário $K_s = (\beta_M / \bar{u})^{1/2}$, guiando o trem PSA até a América do Sul com velocidade de grupo $|c_g| \approx 20\text{ m/s}$ e tempo de trânsito $\tau \approx 9\text{ dias}$.</p>
            </div>

            <!-- Col 3 -->
            <div class="theory-block">
                <h4><i class="fa-solid fa-scale-balanced"></i> ENOS, Decomposição Sazonal e a Régua do Logito</h4>
                <p>A composição das modulações do ENOS e da MJO sobre o SALLJ não é aditiva na probabilidade, mas sim no logito:</p>
                <div class="equation-box">
                    $$\ln\left(\frac{P}{1-P}\right) = a_0 + a_1 x_{\text{ENOS}} + a_2 A \cos(\phi - \phi_0) + a_3 x_{\text{ENOS}} A \cos(\phi - \phi_0)$$
                </div>
                <p>A decomposição $R = \nu \bar{r} \implies \frac{\delta R}{R} = \frac{\delta \nu}{\nu} + \frac{\delta \bar{r}}{\bar{r}}$ mostra que o El Niño age aumentando o número de episódios ($\delta \nu > 0$), enquanto La Niña age sobretudo aumentando a intensidade por episódio ($\delta \bar{r} > 0$), devido ao tempo de recarga prolongado de CAPE entre os eventos.</p>
            </div>

            <!-- Col 4: Regional Vocabulary -->
            <div class="theory-block" style="grid-column: 1 / -1;">
                <h4><i class="fa-solid fa-language"></i> Glossário Operacional e Terminologia Regional (Tabela 2.1)</h4>
                <table class="term-table">
                    <thead>
                        <tr>
                            <th>Termo Regional</th>
                            <th>Equivalente Internacional</th>
                            <th>Região / Escopo</th>
                            <th>Interpretação Física & Diagnóstico Operacional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>SALLJ</b></td>
                            <td>South American low-level jet</td>
                            <td>Leste dos Andes, Bacia do Prata</td>
                            <td>Jato de barreira em 850 hPa que transporta umidade amazônica e cisalhamento; alimenta SCMs.</td>
                        </tr>
                        <tr>
                            <td><b>SESA</b></td>
                            <td>Southeastern South America</td>
                            <td>Sul do Brasil, Uruguai, N Argentina</td>
                            <td>Domínio meteorológico amplo de interação Andes-Chaco-ASAS com os maiores SCMs do planeta.</td>
                        </tr>
                        <tr>
                            <td><b>Lestada</b></td>
                            <td>Persistent easterly maritime flow</td>
                            <td>Litoral SC, PR e SP (Serra do Mar)</td>
                            <td>Vento de leste/sudeste persistente contra o relevo por &gt;12h sem queda térmica; nuvem baixa e chuva orográfica.</td>
                        </tr>
                        <tr>
                            <td><b>Sudestada</b></td>
                            <td>Southeasterly windstorm / surge</td>
                            <td>Atlântico Sudoeste, Prata, Uruguai, RS</td>
                            <td>Vento forte de sudeste com ressaca e maré meteorológica (elevação marégrafo); não confundir com Lestada.</td>
                        </tr>
                        <tr>
                            <td><b>Pampero</b></td>
                            <td>Cold surge / frontal blast</td>
                            <td>Argentina, Uruguai, RS</td>
                            <td>Entrada brusca pós-frontal de ar antártico/patagônico com rajadas de SW, queda rápida de T e salto de pressão.</td>
                        </tr>
                        <tr>
                            <td><b>Minuano</b></td>
                            <td>Cold southerly wind</td>
                            <td>Sul do Brasil e Uruguai</td>
                            <td>Vento frio e seco de sul/sudoeste em ar polar estável, céu limpo e baixa umidade após a frente.</td>
                        </tr>
                        <tr>
                            <td><b>Zonda</b></td>
                            <td>Foehn wind</td>
                            <td>Oeste da Argentina (Andes)</td>
                            <td>Vento catabático quente e seco de sotavento; temperatura sobe bruscamente e ponto de orvalho despenca.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Script Logic -->
    <script>
        /* --- DADOS DAS 8 FASES DA MJO --- */
        const MJO_BASE_PHASES = {
            1: {
                phase: 1,
                name: "Hemisfério Ocidental & África",
                tropicalConvection: { lon: 10, lat: 2, rLon: 35, rLat: 16, olr: -20 },
                suppressedConvection: { lon: 105, lat: -4, rLon: 45, rLat: 18, olr: 25 },
                psaCenters: [
                    { lon: -150, lat: -30, type: 'A', strength: 0.5 },
                    { lon: -110, lat: -52, type: 'B', strength: 0.6 },
                    { lon: -70, lat: -62, type: 'A', strength: 0.5 },
                    { lon: -40, lat: -32, type: 'B', strength: 0.4 }
                ],
                salljBase: { curvatureLat: -21, direction: 'eastward', intensity: 14, moistureFlux: 320 },
                stjBase: { latAvg: -29, streakLon: -64, maxSpeed: 46, divergenceOverSesa: 0.2 },
                pfjBase: { latAvg: -54, waveAmp: 7 },
                sesaRainBase: -15,
                zcasRainBase: +25,
                mjoFactor: -0.15
            },
            2: {
                phase: 2,
                name: "Oceano Índico Ocidental",
                tropicalConvection: { lon: 65, lat: -2, rLon: 32, rLat: 16, olr: -25 },
                suppressedConvection: { lon: 155, lat: -6, rLon: 45, rLat: 18, olr: 28 },
                psaCenters: [
                    { lon: -175, lat: -32, type: 'B', strength: 0.6 },
                    { lon: -130, lat: -56, type: 'A', strength: 0.7 },
                    { lon: -85, lat: -64, type: 'B', strength: 0.6 },
                    { lon: -50, lat: -38, type: 'A', strength: 0.5 }
                ],
                salljBase: { curvatureLat: -23, direction: 'south-east', intensity: 16, moistureFlux: 380 },
                stjBase: { latAvg: -30, streakLon: -62, maxSpeed: 48, divergenceOverSesa: 0.4 },
                pfjBase: { latAvg: -53, waveAmp: 8 },
                sesaRainBase: +15,
                zcasRainBase: -10,
                mjoFactor: +0.20
            },
            3: {
                phase: 3,
                name: "Oceano Índico Oriental & Marítimo",
                tropicalConvection: { lon: 92, lat: -4, rLon: 36, rLat: 18, olr: -35 },
                suppressedConvection: { lon: -160, lat: -8, rLon: 45, rLat: 18, olr: 30 },
                psaCenters: [
                    { lon: 165, lat: -35, type: 'A', strength: 0.8 },
                    { lon: -145, lat: -58, type: 'B', strength: 0.9 },
                    { lon: -95, lat: -66, type: 'A', strength: 0.9 },
                    { lon: -58, lat: -42, type: 'B', strength: 0.85 }
                ],
                salljBase: { curvatureLat: -32, direction: 'southward', intensity: 22, moistureFlux: 540 },
                stjBase: { latAvg: -28, streakLon: -60, maxSpeed: 58, divergenceOverSesa: 0.9 },
                pfjBase: { latAvg: -51, waveAmp: 11 },
                sesaRainBase: +75,
                zcasRainBase: -45,
                mjoFactor: +0.65
            },
            4: {
                phase: 4,
                name: "Continente Marítimo (Indonésia)",
                tropicalConvection: { lon: 125, lat: -2, rLon: 40, rLat: 18, olr: -38 },
                suppressedConvection: { lon: -120, lat: -6, rLon: 45, rLat: 18, olr: 28 },
                psaCenters: [
                    { lon: 180, lat: -38, type: 'A', strength: 0.75 },
                    { lon: -135, lat: -60, type: 'B', strength: 0.8 },
                    { lon: -85, lat: -65, type: 'A', strength: 0.85 },
                    { lon: -52, lat: -39, type: 'B', strength: 0.8 }
                ],
                salljBase: { curvatureLat: -30, direction: 'southward', intensity: 20, moistureFlux: 500 },
                stjBase: { latAvg: -29, streakLon: -58, maxSpeed: 55, divergenceOverSesa: 0.8 },
                pfjBase: { latAvg: -52, waveAmp: 10 },
                sesaRainBase: +60,
                zcasRainBase: -35,
                mjoFactor: +0.55
            },
            5: {
                phase: 5,
                name: "Continente Marítimo / Pacífico Oeste",
                tropicalConvection: { lon: 145, lat: 0, rLon: 38, rLat: 18, olr: -28 },
                suppressedConvection: { lon: 50, lat: -4, rLon: 40, rLat: 18, olr: 26 },
                psaCenters: [
                    { lon: -160, lat: -40, type: 'B', strength: 0.6 },
                    { lon: -115, lat: -58, type: 'A', strength: 0.65 },
                    { lon: -70, lat: -60, type: 'B', strength: 0.6 },
                    { lon: -42, lat: -32, type: 'A', strength: 0.5 }
                ],
                salljBase: { curvatureLat: -24, direction: 'south-east', intensity: 15, moistureFlux: 370 },
                stjBase: { latAvg: -31, streakLon: -54, maxSpeed: 47, divergenceOverSesa: 0.3 },
                pfjBase: { latAvg: -53, waveAmp: 8 },
                sesaRainBase: +10,
                zcasRainBase: +5,
                mjoFactor: +0.10
            },
            6: {
                phase: 6,
                name: "Pacífico Oeste",
                tropicalConvection: { lon: 168, lat: 2, rLon: 36, rLat: 18, olr: -30 },
                suppressedConvection: { lon: 75, lat: -4, rLon: 45, rLat: 18, olr: 32 },
                psaCenters: [
                    { lon: -145, lat: -42, type: 'A', strength: 0.7 },
                    { lon: -100, lat: -60, type: 'B', strength: 0.75 },
                    { lon: -58, lat: -60, type: 'A', strength: 0.7 },
                    { lon: -38, lat: -28, type: 'B', strength: 0.6 }
                ],
                salljBase: { curvatureLat: -20, direction: 'eastward', intensity: 17, moistureFlux: 410 },
                stjBase: { latAvg: -32, streakLon: -48, maxSpeed: 50, divergenceOverSesa: -0.2 },
                pfjBase: { latAvg: -55, waveAmp: 9 },
                sesaRainBase: -20,
                zcasRainBase: +35,
                mjoFactor: -0.20
            },
            7: {
                phase: 7,
                name: "Pacífico Central / Linha de Data",
                tropicalConvection: { lon: -170, lat: 0, rLon: 40, rLat: 18, olr: -36 },
                suppressedConvection: { lon: 100, lat: -2, rLon: 45, rLat: 18, olr: 35 },
                psaCenters: [
                    { lon: -130, lat: -45, type: 'B', strength: 0.85 },
                    { lon: -85, lat: -62, type: 'A', strength: 0.9 },
                    { lon: -45, lat: -55, type: 'B', strength: 0.8 },
                    { lon: -38, lat: -30, type: 'A', strength: 0.85 }
                ],
                salljBase: { curvatureLat: -17, direction: 'eastward', intensity: 20, moistureFlux: 510 },
                stjBase: { latAvg: -33, streakLon: -42, maxSpeed: 52, divergenceOverSesa: -0.7 },
                pfjBase: { latAvg: -56, waveAmp: 11 },
                sesaRainBase: -55,
                zcasRainBase: +80,
                mjoFactor: -0.60
            },
            8: {
                phase: 8,
                name: "Pacífico Leste & Hemisfério Ocidental",
                tropicalConvection: { lon: -120, lat: 2, rLon: 42, rLat: 18, olr: -30 },
                suppressedConvection: { lon: 80, lat: -4, rLon: 45, rLat: 18, olr: 30 },
                psaCenters: [
                    { lon: -110, lat: -48, type: 'A', strength: 0.75 },
                    { lon: -70, lat: -64, type: 'B', strength: 0.8 },
                    { lon: -35, lat: -50, type: 'A', strength: 0.75 },
                    { lon: -40, lat: -28, type: 'A', strength: 0.8 }
                ],
                salljBase: { curvatureLat: -18, direction: 'eastward', intensity: 18, moistureFlux: 460 },
                stjBase: { latAvg: -32, streakLon: -44, maxSpeed: 48, divergenceOverSesa: -0.6 },
                pfjBase: { latAvg: -55, waveAmp: 10 },
                sesaRainBase: -50,
                zcasRainBase: +65,
                mjoFactor: -0.50
            }
        };

        /* --- ESTADO GLOBAL DA APLICAÇÃO --- */
        const APP = {
            currentPhase: 3,
            currentSeason: 'DJF', // 'DJF', 'MAM', 'JJA', 'SON'
            currentENSO: 'neutro', // 'el-nino', 'neutro', 'la-nina'
            amplitude: 1.85,
            isCyclePlaying: false,
            cycleTimer: null,
            currentView: 'south-america',
            layers: {
                stj: true,
                pfj: true,
                sallj: true,
                rain: true,
                rossby: true,
                olr: true,
                particles: true
            },
            map: {
                zoom: 1.0,
                panX: 0,
                panY: 0,
                isDragging: false,
                startX: 0,
                startY: 0
            },
            particles: [],
            animFrameId: null,
            speechSynth: window.speechSynthesis || null,
            isSpeaking: false
        };

        /* --- MOTOR DE INTEGRAÇÃO CLIMÁTICA: ESTAÇÃO + ENOS + MJO --- */
        function getComputedClimateState() {
            const base = MJO_BASE_PHASES[APP.currentPhase];
            const season = APP.currentSeason;
            const enso = APP.currentENSO;

            // 1. Moduladores da Estação do Ano
            let seasonStjLatShift = 0;
            let seasonStjSpeedMod = 0;
            let seasonPfjLatShift = 0;
            let seasonSalljMoistMod = 1.0;
            let seasonDesc = "";

            if (season === 'DJF') { // Verão Austral
                seasonStjLatShift = 0; // posição de verão (~28°-32°S)
                seasonStjSpeedMod = 0;
                seasonPfjLatShift = -5; // retrai para sul (~55°-60°S)
                seasonSalljMoistMod = 1.15; // umidade máxima da monção
                seasonDesc = "Verão Austral (DJF): Monção sul-americana no ápice, forte contraste térmico entre o continente e o Atlântico, ZCAS ativa ou Bacia do Prata ativa conforme a latitude de desprendimento do SALLJ.";
            } else if (season === 'MAM') { // Outono
                seasonStjLatShift = 3; // migra para norte (~27°-30°S)
                seasonStjSpeedMod = 4;
                seasonPfjLatShift = 0;
                seasonSalljMoistMod = 0.85;
                seasonDesc = "Outono Austral (MAM): Transição com desativação progressiva da convecção amazônica. O jato subtropical intensifica-se e começa a se deslocar para o equador; ocorrência de Lestadas e primeiras frentes frias.";
            } else if (season === 'JJA') { // Inverno Austral
                seasonStjLatShift = 6; // migra bem ao norte (~24°-27°S)
                seasonStjSpeedMod = 12; // muito mais veloz (>60 m/s)
                seasonPfjLatShift = 6; // expande ao norte (~45°-50°S)
                seasonSalljMoistMod = 0.65; // umidade menor, ar mais frio
                seasonDesc = "Inverno Austral (JJA): Jato Subtropical em sua posição mais ao norte e veloz, funcionando como potente guia de ondas Ks. Jato Polar atuante no Cone Sul com frequentes incursões de Pampero e Minuano. Convecção tropical recuada.";
            } else if (season === 'SON') { // Primavera
                seasonStjLatShift = 2; // ~28°-30°S
                seasonStjSpeedMod = 5;
                seasonPfjLatShift = 2;
                seasonSalljMoistMod = 0.95;
                seasonDesc = "Primavera Austral (SON): Reorganização rápida da umidade na bacia Amazônica e retorno das primeiras ZCAS. Máxima frequência de Complexos Convectivos de Mesoescala (SCMs) e tempo severo sobre a Bacia do Prata.";
            }

            // 2. Moduladores do ENOS (Seção 1.3 do Livro)
            let ensoStjLatShift = 0;
            let ensoStjSpeedMod = 0;
            let ensoSalljFreqMod = 0; // delta nu
            let ensoIntensityMod = 0; // delta r_bar
            let ensoLogitStep = 0;
            let ensoDesc = "";
            let ensoSourceLon = 0;

            if (enso === 'el-nino') {
                ensoStjLatShift = 4; // Desloca para o equador sobre o continente
                ensoStjSpeedMod = 8; // Intensifica o jato subtropical
                ensoSalljFreqMod = +40; // delta nu > 0: muito mais episódios de jato
                ensoIntensityMod = -10; // eventos mais frequentes e solo saturado
                ensoLogitStep = +0.75;
                ensoSourceLon = -140; // Convecção média no Pacífico Central
                ensoDesc = "El Niño: Piscina quente deslocada para o leste. Jato subtropical intensifica-se e migra para o norte, aumentando a frequência de jet streaks sobre o SESA. Ocorre aumento do número de episódios de jato (δν > 0) com solo saturado por chuva persistente.";
            } else if (enso === 'la-nina') {
                ensoStjLatShift = -4; // Desloca para o polo (~35°-38°S)
                ensoStjSpeedMod = -4;
                ensoSalljFreqMod = -30; // delta nu < 0: menos episódios de jato
                ensoIntensityMod = +50; // delta r_bar > 0: tempo de recarga prolongado de CAPE -> eventos violentos isolados!
                ensoLogitStep = -0.40;
                ensoSourceLon = 130; // Convecção tropical concentrada na Indonésia
                ensoDesc = "La Niña: Piscina quente confinada no Pacífico extremo oeste. Jato subtropical recuado para o polo. Menos episódios de jato (δν < 0), porém cada episódio encontra longo tempo de recarga com alta instabilidade acumulada (δr̄ > 0), elevando a severidade extrema.";
            } else { // neutro
                ensoStjLatShift = 0;
                ensoStjSpeedMod = 0;
                ensoSalljFreqMod = 0;
                ensoIntensityMod = 0;
                ensoLogitStep = 0.0;
                ensoSourceLon = 100;
                ensoDesc = "ENOS Neutro: Circulação zonal e temperaturas da superfície do mar próximas da média climatológica.";
            }

            // 3. Posições Finais dos Jatos e do SALLJ
            const stjLat = base.stjBase.latAvg + seasonStjLatShift + ensoStjLatShift;
            const stjSpeed = Math.round(base.stjBase.maxSpeed + seasonStjSpeedMod + ensoStjSpeedMod);
            const pfjLat = base.pfjBase.latAvg + seasonPfjLatShift;
            const salljFlux = Math.round(base.salljBase.moistureFlux * seasonSalljMoistMod * (enso === 'el-nino' ? 1.15 : (enso === 'la-nina' ? 0.9 : 1.0)));
            const salljIntensity = Math.round(base.salljBase.intensity * (enso === 'el-nino' ? 1.1 : 1.0));

            // Anomalia de Chuva combinada
            let sesaRain = base.sesaRainBase;
            let zcasRain = base.zcasRainBase;

            // No Inverno (JJA), fases 4 e 5 reduzem chuva no SESA (Seção 1.4.4)
            if (season === 'JJA' && (APP.currentPhase === 4 || APP.currentPhase === 5)) {
                sesaRain -= 30;
            }
            // Na Primavera (SON), fases 7 e 8 favorecem a ZCAS com umidade desviada (Seção 1.4.4)
            if (season === 'SON' && (APP.currentPhase === 7 || APP.currentPhase === 8)) {
                zcasRain += 25;
                sesaRain -= 20;
            }
            // Impacto do El Niño no SESA (primavera/verão positivo)
            if (enso === 'el-nino') {
                sesaRain += 30;
                zcasRain -= 15;
            } else if (enso === 'la-nina') {
                sesaRain -= 15;
                zcasRain += 20;
            }

            // Status de Acoplamento Vertical
            let coupling = "Parcial";
            let badgeClass = "neutro";
            let diagTitleStatus = "CONDIÇÃO DE TRANSIÇÃO";

            if (sesaRain >= 40) {
                coupling = "TOTALMENTE ACOPLADO (ALTO RISCO DE CHEIA)";
                badgeClass = "favoravel";
                diagTitleStatus = "ALTO RISCO DE SCMs & CHEIA NO SESA";
            } else if (sesaRain <= -30) {
                coupling = "SUPRIMIDO NO SESA / ZCAS DOMINANTE";
                badgeClass = "desfavoravel";
                diagTitleStatus = "ZCAS ATIVA / ESTIAGEM NO SESA";
            } else {
                coupling = "ACOPLAMENTO MODERADO / TRANSIÇÃO";
                badgeClass = "neutro";
                diagTitleStatus = "CONDIÇÕES CLIMATOLÓGICAS MÉDIAS";
            }

            // Decomposição R = nu * r_bar
            let decompNuText = ensoSalljFreqMod >= 0 ? `+${ensoSalljFreqMod}% (Muitos eventos)` : `${ensoSalljFreqMod}% (Eventos raros)`;
            let decompRbarText = ensoIntensityMod >= 0 ? `+${ensoIntensityMod}% (Eventos severos)` : `${ensoIntensityMod}% (Moderados)`;

            return {
                phase: APP.currentPhase,
                season,
                enso,
                stjLat,
                stjSpeed,
                pfjLat,
                salljFlux,
                salljIntensity,
                salljCurvatureLat: base.salljBase.curvatureLat,
                salljDirection: base.salljBase.direction,
                sesaRain,
                zcasRain,
                coupling,
                badgeClass,
                diagTitleStatus,
                mjoFactor: base.mjoFactor * APP.amplitude,
                ensoLogitStep,
                decompNuText,
                decompRbarText,
                seasonDesc,
                ensoDesc,
                name: base.name,
                tropicalConvection: base.tropicalConvection,
                suppressedConvection: base.suppressedConvection,
                psaCenters: base.psaCenters
            };
        }

        /* --- CONFIGURAÇÃO DO CANVAS MAPA --- */
        const mapCanvas = document.getElementById('mapCanvas');
        const ctxMap = mapCanvas.getContext('2d');
        const mapContainer = document.getElementById('mapContainer');
        const tooltip = document.getElementById('mapTooltip');

        function resizeCanvas() {
            const rect = mapContainer.getBoundingClientRect();
            mapCanvas.width = rect.width * window.devicePixelRatio;
            mapCanvas.height = rect.height * window.devicePixelRatio;
            ctxMap.scale(window.devicePixelRatio, window.devicePixelRatio);
            renderMap();
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            renderRMM();
            renderCrossSection();
            renderLogitRuler();
        });

        /* --- PROJEÇÃO E CONVERSÃO DE COORDENADAS --- */
        function lonLatToScreen(lon, lat, width, height) {
            let centerLon = -60;
            let centerLat = -25;
            let scaleFactor = 1.0;

            if (APP.currentView === 'south-america') {
                centerLon = -58;
                centerLat = -28;
                scaleFactor = 2.4 * APP.map.zoom;
            } else if (APP.currentView === 'tropics') {
                centerLon = 80;
                centerLat = 0;
                scaleFactor = 1.1 * APP.map.zoom;
            } else {
                centerLon = -20;
                centerLat = -20;
                scaleFactor = 1.0 * APP.map.zoom;
            }

            let dLon = lon - centerLon;
            while (dLon > 180) dLon -= 360;
            while (dLon < -180) dLon += 360;

            let dLat = lat - centerLat;

            const cx = width / 2 + APP.map.panX;
            const cy = height / 2 + APP.map.panY;

            const pxPerDegLon = (width / 360) * scaleFactor;
            const pxPerDegLat = (height / 180) * scaleFactor;

            return {
                x: cx + dLon * pxPerDegLon,
                y: cy - dLat * pxPerDegLat
            };
        }

        function screenToLonLat(screenX, screenY, width, height) {
            let centerLon = -60;
            let centerLat = -25;
            let scaleFactor = 1.0;

            if (APP.currentView === 'south-america') {
                centerLon = -58;
                centerLat = -28;
                scaleFactor = 2.4 * APP.map.zoom;
            } else if (APP.currentView === 'tropics') {
                centerLon = 80;
                centerLat = 0;
                scaleFactor = 1.1 * APP.map.zoom;
            } else {
                centerLon = -20;
                centerLat = -20;
                scaleFactor = 1.0 * APP.map.zoom;
            }

            const cx = width / 2 + APP.map.panX;
            const cy = height / 2 + APP.map.panY;

            const pxPerDegLon = (width / 360) * scaleFactor;
            const pxPerDegLat = (height / 180) * scaleFactor;

            const dLon = (screenX - cx) / pxPerDegLon;
            const dLat = -(screenY - cy) / pxPerDegLat;

            let lon = centerLon + dLon;
            let lat = centerLat + dLat;

            while (lon > 180) lon -= 360;
            while (lon < -180) lon += 360;

            return { lon, lat };
        }

        /* --- GEOMETRIA DOS CONTINENTES --- */
        const SOUTH_AMERICA_COORDS = [
            [-80, 8], [-77, 8], [-75, 11], [-71, 12], [-62, 10], [-60, 9],
            [-50, 1], [-45, -2], [-35, -5], [-35, -9], [-38, -13], [-40, -19],
            [-43, -23], [-48, -26], [-52, -32], [-54, -34], [-57, -37], [-65, -42],
            [-66, -46], [-68, -52], [-65, -55], [-70, -55], [-74, -52], [-74, -45],
            [-73, -40], [-72, -35], [-71, -30], [-70, -20], [-76, -14], [-81, -5],
            [-80, 0], [-79, 3], [-80, 8]
        ];

        const ANDES_POLY = [
            [-74, 9], [-71, 8], [-70, 4], [-73, -1], [-75, -6], [-76, -12],
            [-69, -16], [-67, -22], [-67, -28], [-68, -35], [-70, -42], [-72, -50],
            [-74, -54], [-71, -54], [-68, -48], [-66, -40], [-64, -32], [-64, -24],
            [-64, -18], [-67, -13], [-72, -5], [-74, 2], [-74, 9]
        ];

        const SESA_POLY = [
            [-64, -22], [-54, -22], [-48, -25], [-48, -34], [-53, -37], [-62, -37], [-64, -28], [-64, -22]
        ];

        const ZCAS_POLY = [
            [-65, -9], [-55, -11], [-42, -18], [-34, -23], [-37, -27], [-46, -24], [-55, -17], [-66, -14], [-65, -9]
        ];

        const CONTINENTS = [
            [[-17, 15], [-17, 21], [-5, 36], [10, 37], [25, 32], [33, 30], [51, 12], [45, 0], [40, -10], [35, -25], [26, -34], [18, -34], [12, -15], [9, 5], [-15, 10], [-17, 15]],
            [[114, -22], [114, -34], [135, -35], [150, -37], [153, -28], [148, -19], [137, -12], [129, -15], [114, -22]],
            [[-9, 36], [-9, 44], [0, 50], [8, 55], [28, 70], [60, 68], [110, 72], [170, 66], [140, 40], [120, 30], [105, 18], [98, 8], [80, 15], [60, 25], [40, 28], [25, 40], [0, 42], [-9, 36]],
            [[-125, 48], [-125, 32], [-110, 23], [-98, 19], [-85, 22], [-80, 26], [-75, 35], [-65, 44], [-60, 52], [-90, 60], [-120, 60], [-125, 48]],
            [[95, 5], [105, 0], [115, -8], [125, -8], [140, -3], [148, -5], [150, -10], [130, -5], [110, 2], [95, 5]],
            [[168, -46], [174, -42], [178, -38], [175, -35], [170, -43], [168, -46]],
            [[-180, -72], [-120, -74], [-60, -65], [0, -70], [60, -68], [120, -66], [180, -72]]
        ];

        /* --- MOTOR DE PARTÍCULAS --- */
        class WindParticle {
            constructor(type) {
                this.type = type;
                this.reset();
            }

            reset() {
                const state = getComputedClimateState();
                this.age = 0;
                this.maxAge = 80 + Math.random() * 80;

                if (this.type === 'sallj') {
                    this.progress = Math.random();
                    this.speed = (0.008 + Math.random() * 0.006) * (state.salljIntensity / 18);
                } else if (this.type === 'stj') {
                    this.lon = -180 + Math.random() * 360;
                    this.lat = state.stjLat + (Math.random() - 0.5) * 4;
                    this.speed = (1.4 + Math.random() * 0.8) * (state.stjSpeed / 50);
                } else if (this.type === 'pfj') {
                    this.lon = -180 + Math.random() * 360;
                    this.lat = state.pfjLat + (Math.random() - 0.5) * 5;
                    this.speed = 1.0 + Math.random() * 0.6;
                }
            }

            update() {
                const state = getComputedClimateState();
                this.age++;
                if (this.age > this.maxAge) {
                    this.reset();
                    return;
                }

                if (this.type === 'sallj') {
                    this.progress += this.speed;
                    if (this.progress > 1) {
                        this.reset();
                        this.progress = 0;
                    }
                } else if (this.type === 'stj') {
                    this.lon += this.speed;
                    if (this.lon > 180) this.lon -= 360;
                    let wave = Math.sin((this.lon + 60) * Math.PI / 60) * 3;
                    this.lat = state.stjLat + wave;
                } else if (this.type === 'pfj') {
                    this.lon += this.speed;
                    if (this.lon > 180) this.lon -= 360;
                    let wave = Math.sin((this.lon + 90) * Math.PI / 45) * 5;
                    this.lat = state.pfjLat + wave;
                }
            }

            getCoordinates() {
                const state = getComputedClimateState();
                if (this.type === 'sallj') {
                    const p = this.progress;
                    let lon, lat;
                    if (state.salljDirection === 'southward') {
                        if (p < 0.3) {
                            let t = p / 0.3;
                            lon = -65 + t * (-63 - -65);
                            lat = -5 + t * (-17 - -5);
                        } else if (p < 0.7) {
                            let t = (p - 0.3) / 0.4;
                            lon = -63 + t * (-59 - -63);
                            lat = -17 + t * (-27 - -17);
                        } else {
                            let t = (p - 0.7) / 0.3;
                            lon = -59 + t * (-55 - -59);
                            lat = -27 + t * (-35 - -27);
                        }
                    } else if (state.salljDirection === 'eastward') {
                        if (p < 0.3) {
                            let t = p / 0.3;
                            lon = -65 + t * (-62 - -65);
                            lat = -5 + t * (-17 - -5);
                        } else {
                            let t = (p - 0.3) / 0.7;
                            lon = -62 + t * (-42 - -62);
                            lat = -17 + t * (-24 - -17) + Math.sin(t * Math.PI) * (-2);
                        }
                    } else {
                        let t = p;
                        lon = -65 + t * (-50 - -65);
                        lat = -5 + t * (-30 - -5);
                    }
                    return { lon, lat };
                } else {
                    return { lon: this.lon, lat: this.lat };
                }
            }
        }

        function initParticles() {
            APP.particles = [];
            for (let i = 0; i < 60; i++) APP.particles.push(new WindParticle('stj'));
            for (let i = 0; i < 50; i++) APP.particles.push(new WindParticle('pfj'));
            for (let i = 0; i < 50; i++) APP.particles.push(new WindParticle('sallj'));
        }
        initParticles();

        /* --- DESENHO DO MAPA --- */
        function renderMap() {
            const width = mapCanvas.width / window.devicePixelRatio;
            const height = mapCanvas.height / window.devicePixelRatio;
            const state = getComputedClimateState();

            ctxMap.clearRect(0, 0, width, height);

            // Fundo Oceânico
            ctxMap.fillStyle = "#040916";
            ctxMap.fillRect(0, 0, width, height);

            // Grade (Graticule)
            ctxMap.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctxMap.lineWidth = 1;
            ctxMap.setLineDash([2, 4]);

            for (let lon = -180; lon <= 180; lon += 30) {
                ctxMap.beginPath();
                for (let lat = -80; lat <= 80; lat += 10) {
                    const pt = lonLatToScreen(lon, lat, width, height);
                    if (lat === -80) ctxMap.moveTo(pt.x, pt.y);
                    else ctxMap.lineTo(pt.x, pt.y);
                }
                ctxMap.stroke();
            }

            for (let lat = -70; lat <= 70; lat += 20) {
                ctxMap.beginPath();
                for (let lon = -180; lon <= 180; lon += 10) {
                    const pt = lonLatToScreen(lon, lat, width, height);
                    if (lon === -180) ctxMap.moveTo(pt.x, pt.y);
                    else ctxMap.lineTo(pt.x, pt.y);
                }
                ctxMap.stroke();
            }
            ctxMap.setLineDash([]);

            // Equador e Trópico
            [0, -23.5].forEach((lat, idx) => {
                ctxMap.beginPath();
                ctxMap.strokeStyle = idx === 0 ? "rgba(56, 189, 248, 0.25)" : "rgba(251, 191, 36, 0.2)";
                ctxMap.lineWidth = 1.2;
                for (let lon = -180; lon <= 180; lon += 5) {
                    const pt = lonLatToScreen(lon, lat, width, height);
                    if (lon === -180) ctxMap.moveTo(pt.x, pt.y);
                    else ctxMap.lineTo(pt.x, pt.y);
                }
                ctxMap.stroke();
            });

            // Continentes
            CONTINENTS.forEach(poly => {
                drawPolygon(poly, width, height, "#0c1527", "rgba(56, 189, 248, 0.25)");
            });

            drawPolygon(SOUTH_AMERICA_COORDS, width, height, "#0e1a32", "rgba(56, 189, 248, 0.5)");
            drawPolygon(ANDES_POLY, width, height, "rgba(217, 119, 6, 0.22)", "rgba(245, 158, 11, 0.45)");

            // Camadas Físicas
            if (APP.layers.olr) renderOLREnvelopes(width, height, state);
            if (APP.layers.rain) renderPrecipitationDipole(width, height, state);
            if (APP.layers.rossby) renderRossbyWaveTrain(width, height, state);
            if (APP.layers.stj) renderSubtropicalJet(width, height, state);
            if (APP.layers.pfj) renderPolarJet(width, height, state);
            if (APP.layers.sallj) renderSALLJ(width, height, state);
            if (APP.layers.particles) renderParticles(width, height);

            renderMapLabels(width, height, state);
        }

        function drawPolygon(coords, w, h, fillColor, strokeColor) {
            if (!coords || coords.length === 0) return;
            ctxMap.beginPath();
            const first = lonLatToScreen(coords[0][0], coords[0][1], w, h);
            ctxMap.moveTo(first.x, first.y);
            for (let i = 1; i < coords.length; i++) {
                const pt = lonLatToScreen(coords[i][0], coords[i][1], w, h);
                ctxMap.lineTo(pt.x, pt.y);
            }
            ctxMap.closePath();
            if (fillColor) {
                ctxMap.fillStyle = fillColor;
                ctxMap.fill();
            }
            if (strokeColor) {
                ctxMap.strokeStyle = strokeColor;
                ctxMap.stroke();
            }
        }

        function renderOLREnvelopes(w, h, state) {
            const time = Date.now() * 0.002;
            const tc = state.tropicalConvection;
            const ptAscent = lonLatToScreen(tc.lon, tc.lat, w, h);
            const rPxX = (w / 360) * tc.rLon * (APP.currentView === 'south-america' ? 2.4 : 1.0) * APP.map.zoom;
            const rPxY = (h / 180) * tc.rLat * (APP.currentView === 'south-america' ? 2.4 : 1.0) * APP.map.zoom;
            const pulse = 1 + Math.sin(time) * 0.06;

            const gradConv = ctxMap.createRadialGradient(ptAscent.x, ptAscent.y, 5, ptAscent.x, ptAscent.y, rPxX * pulse);
            gradConv.addColorStop(0, "rgba(16, 185, 129, 0.45)");
            gradConv.addColorStop(0.5, "rgba(5, 150, 105, 0.28)");
            gradConv.addColorStop(1, "rgba(16, 185, 129, 0.0)");

            ctxMap.save();
            ctxMap.beginPath();
            ctxMap.ellipse(ptAscent.x, ptAscent.y, rPxX * pulse, rPxY * pulse, 0, 0, Math.PI * 2);
            ctxMap.fillStyle = gradConv;
            ctxMap.fill();
            ctxMap.strokeStyle = "rgba(52, 211, 153, 0.6)";
            ctxMap.lineWidth = 1.5;
            ctxMap.setLineDash([4, 4]);
            ctxMap.stroke();
            ctxMap.setLineDash([]);
            ctxMap.restore();

            const sc = state.suppressedConvection;
            const ptDesc = lonLatToScreen(sc.lon, sc.lat, w, h);
            const rPxX2 = (w / 360) * sc.rLon * (APP.currentView === 'south-america' ? 2.4 : 1.0) * APP.map.zoom;
            const rPxY2 = (h / 180) * sc.rLat * (APP.currentView === 'south-america' ? 2.4 : 1.0) * APP.map.zoom;

            const gradSupp = ctxMap.createRadialGradient(ptDesc.x, ptDesc.y, 5, ptDesc.x, ptDesc.y, rPxX2);
            gradSupp.addColorStop(0, "rgba(249, 115, 22, 0.35)");
            gradSupp.addColorStop(0.6, "rgba(234, 88, 12, 0.18)");
            gradSupp.addColorStop(1, "rgba(249, 115, 22, 0.0)");

            ctxMap.save();
            ctxMap.beginPath();
            ctxMap.ellipse(ptDesc.x, ptDesc.y, rPxX2, rPxY2, 0, 0, Math.PI * 2);
            ctxMap.fillStyle = gradSupp;
            ctxMap.fill();
            ctxMap.strokeStyle = "rgba(251, 146, 60, 0.45)";
            ctxMap.lineWidth = 1;
            ctxMap.stroke();
            ctxMap.restore();
        }

        function renderPrecipitationDipole(w, h, state) {
            let sesaColor, sesaStroke;
            if (state.sesaRain > 0) {
                sesaColor = `rgba(16, 185, 129, ${Math.min(0.65, 0.2 + state.sesaRain * 0.005)})`;
                sesaStroke = "rgba(52, 211, 153, 0.85)";
            } else {
                sesaColor = `rgba(249, 115, 22, ${Math.min(0.55, 0.15 + Math.abs(state.sesaRain) * 0.005)})`;
                sesaStroke = "rgba(251, 146, 60, 0.75)";
            }
            drawPolygon(SESA_POLY, w, h, sesaColor, sesaStroke);

            let zcasColor, zcasStroke;
            if (state.zcasRain > 0) {
                zcasColor = `rgba(56, 189, 248, ${Math.min(0.65, 0.2 + state.zcasRain * 0.005)})`;
                zcasStroke = "rgba(56, 189, 248, 0.85)";
            } else {
                zcasColor = `rgba(249, 115, 22, ${Math.min(0.45, 0.15 + Math.abs(state.zcasRain) * 0.005)})`;
                zcasStroke = "rgba(251, 146, 60, 0.65)";
            }
            drawPolygon(ZCAS_POLY, w, h, zcasColor, zcasStroke);
        }

        function renderRossbyWaveTrain(w, h, state) {
            const centers = state.psaCenters;
            if (!centers || centers.length < 2) return;

            ctxMap.beginPath();
            ctxMap.strokeStyle = "rgba(251, 191, 36, 0.45)";
            ctxMap.lineWidth = 2.5;
            ctxMap.setLineDash([6, 6]);

            const startPt = lonLatToScreen(centers[0].lon, centers[0].lat, w, h);
            ctxMap.moveTo(startPt.x, startPt.y);

            for (let i = 1; i < centers.length; i++) {
                const pt = lonLatToScreen(centers[i].lon, centers[i].lat, w, h);
                ctxMap.lineTo(pt.x, pt.y);
            }
            ctxMap.stroke();
            ctxMap.setLineDash([]);

            centers.forEach(c => {
                const pt = lonLatToScreen(c.lon, c.lat, w, h);
                const isHigh = c.type === 'A';

                ctxMap.beginPath();
                ctxMap.arc(pt.x, pt.y, 14 * c.strength, 0, Math.PI * 2);
                ctxMap.fillStyle = isHigh ? "rgba(244, 63, 94, 0.25)" : "rgba(56, 189, 248, 0.25)";
                ctxMap.fill();
                ctxMap.strokeStyle = isHigh ? "#f43f5e" : "#38bdf8";
                ctxMap.lineWidth = 2;
                ctxMap.stroke();

                ctxMap.fillStyle = "#ffffff";
                ctxMap.font = "bold 11px Inter";
                ctxMap.textAlign = "center";
                ctxMap.textBaseline = "middle";
                ctxMap.fillText(c.type, pt.x, pt.y);
            });
        }

        function renderSubtropicalJet(w, h, state) {
            ctxMap.save();
            ctxMap.beginPath();
            ctxMap.strokeStyle = "rgba(56, 189, 248, 0.65)";
            ctxMap.lineWidth = 5;

            for (let lon = -180; lon <= 180; lon += 5) {
                let wave = Math.sin((lon + 60) * Math.PI / 60) * 3;
                let lat = state.stjLat + wave;
                const pt = lonLatToScreen(lon, lat, w, h);
                if (lon === -180) ctxMap.moveTo(pt.x, pt.y);
                else ctxMap.lineTo(pt.x, pt.y);
            }
            ctxMap.stroke();

            // Jet Streak
            const streakLon = -60;
            const stPt = lonLatToScreen(streakLon, state.stjLat, w, h);
            ctxMap.beginPath();
            ctxMap.arc(stPt.x, stPt.y, 16, 0, Math.PI * 2);
            ctxMap.fillStyle = "rgba(56, 189, 248, 0.25)";
            ctxMap.fill();
            ctxMap.strokeStyle = "#38bdf8";
            ctxMap.lineWidth = 2;
            ctxMap.stroke();

            ctxMap.fillStyle = "#38bdf8";
            ctxMap.font = "bold 9px JetBrains Mono";
            ctxMap.textAlign = "center";
            ctxMap.fillText(`${state.stjSpeed} m/s`, stPt.x, stPt.y - 18);
            ctxMap.fillText("Jet Streak 200hPa", stPt.x, stPt.y - 8);

            ctxMap.restore();
        }

        function renderPolarJet(w, h, state) {
            ctxMap.save();
            ctxMap.beginPath();
            ctxMap.strokeStyle = "rgba(192, 132, 252, 0.6)";
            ctxMap.lineWidth = 4;

            for (let lon = -180; lon <= 180; lon += 5) {
                let wave = Math.sin((lon + 90) * Math.PI / 45) * 5;
                let lat = state.pfjLat + wave;
                const pt = lonLatToScreen(lon, lat, w, h);
                if (lon === -180) ctxMap.moveTo(pt.x, pt.y);
                else ctxMap.lineTo(pt.x, pt.y);
            }
            ctxMap.stroke();
            ctxMap.restore();
        }

        function renderSALLJ(w, h, state) {
            ctxMap.save();
            ctxMap.beginPath();
            ctxMap.strokeStyle = "#10b981";
            ctxMap.lineWidth = 6;
            ctxMap.lineCap = "round";

            let pathPoints = [];
            if (state.salljDirection === 'southward') {
                pathPoints = [
                    [-65, -5], [-64, -12], [-63, -18], [-61, -24], [-58, -30], [-55, -35]
                ];
            } else if (state.salljDirection === 'eastward') {
                pathPoints = [
                    [-65, -5], [-63, -13], [-62, -18], [-54, -21], [-46, -23], [-40, -25]
                ];
            } else {
                pathPoints = [
                    [-65, -5], [-63, -14], [-61, -21], [-56, -26], [-52, -31]
                ];
            }

            const first = lonLatToScreen(pathPoints[0][0], pathPoints[0][1], w, h);
            ctxMap.moveTo(first.x, first.y);
            for (let i = 1; i < pathPoints.length; i++) {
                const pt = lonLatToScreen(pathPoints[i][0], pathPoints[i][1], w, h);
                ctxMap.lineTo(pt.x, pt.y);
            }
            ctxMap.stroke();

            for (let i = 1; i < pathPoints.length; i++) {
                const pPrev = lonLatToScreen(pathPoints[i-1][0], pathPoints[i-1][1], w, h);
                const pCurr = lonLatToScreen(pathPoints[i][0], pathPoints[i][1], w, h);
                const angle = Math.atan2(pCurr.y - pPrev.y, pCurr.x - pPrev.x);

                ctxMap.save();
                ctxMap.translate(pCurr.x, pCurr.y);
                ctxMap.rotate(angle);
                ctxMap.beginPath();
                ctxMap.moveTo(-8, -5);
                ctxMap.lineTo(4, 0);
                ctxMap.lineTo(-8, 5);
                ctxMap.fillStyle = "#34d399";
                ctxMap.fill();
                ctxMap.restore();
            }

            const mid = lonLatToScreen(pathPoints[2][0], pathPoints[2][1], w, h);
            ctxMap.fillStyle = "#34d399";
            ctxMap.font = "bold 10px JetBrains Mono";
            ctxMap.fillText(`SALLJ (${state.salljIntensity} m/s | Q=${state.salljFlux})`, mid.x + 12, mid.y);

            ctxMap.restore();
        }

        function renderParticles(w, h) {
            APP.particles.forEach(p => {
                p.update();
                const coords = p.getCoordinates();
                const pt = lonLatToScreen(coords.lon, coords.lat, w, h);

                ctxMap.beginPath();
                if (p.type === 'stj') {
                    ctxMap.fillStyle = "rgba(56, 189, 248, 0.75)";
                    ctxMap.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
                } else if (p.type === 'pfj') {
                    ctxMap.fillStyle = "rgba(192, 132, 252, 0.7)";
                    ctxMap.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
                } else {
                    ctxMap.fillStyle = "rgba(52, 211, 153, 0.9)";
                    ctxMap.arc(pt.x, pt.y, 2.4, 0, Math.PI * 2);
                }
                ctxMap.fill();
            });
        }

        function renderMapLabels(w, h, state) {
            ctxMap.save();
            ctxMap.font = "bold 11px Outfit";

            const sesaPt = lonLatToScreen(-56, -30, w, h);
            ctxMap.fillStyle = state.sesaRain > 0 ? "#34d399" : "#fb923c";
            ctxMap.textAlign = "center";
            ctxMap.fillText("SESA / Bacia do Prata", sesaPt.x, sesaPt.y - 10);
            ctxMap.font = "bold 10px JetBrains Mono";
            ctxMap.fillText(`${state.sesaRain > 0 ? '+' : ''}${state.sesaRain}% Chuva`, sesaPt.x, sesaPt.y + 4);

            const zcasPt = lonLatToScreen(-46, -21, w, h);
            ctxMap.fillStyle = state.zcasRain > 0 ? "#38bdf8" : "#fb923c";
            ctxMap.font = "bold 11px Outfit";
            ctxMap.fillText("ZCAS", zcasPt.x, zcasPt.y - 8);
            ctxMap.font = "bold 10px JetBrains Mono";
            ctxMap.fillText(`${state.zcasRain > 0 ? '+' : ''}${state.zcasRain}%`, zcasPt.x, zcasPt.y + 6);

            const andesPt = lonLatToScreen(-69, -24, w, h);
            ctxMap.fillStyle = "rgba(245, 158, 11, 0.85)";
            ctxMap.font = "italic 10px Inter";
            ctxMap.fillText("▲ Andes (Barreira Orográfica)", andesPt.x, andesPt.y);

            const convPt = lonLatToScreen(state.tropicalConvection.lon, state.tropicalConvection.lat, w, h);
            ctxMap.fillStyle = "#34d399";
            ctxMap.font = "bold 11px Outfit";
            ctxMap.fillText(`MJO Fase ${state.phase}: Convecção Ativa`, convPt.x, convPt.y - 20);

            ctxMap.restore();
        }

        /* --- DIAGRAMA RMM DE WHEELER & HENDON --- */
        const rmmCanvas = document.getElementById('rmmCanvas');
        const ctxRmm = rmmCanvas.getContext('2d');

        function renderRMM() {
            const rect = rmmCanvas.getBoundingClientRect();
            rmmCanvas.width = rect.width * window.devicePixelRatio;
            rmmCanvas.height = rect.height * window.devicePixelRatio;
            ctxRmm.scale(window.devicePixelRatio, window.devicePixelRatio);

            const w = rect.width;
            const h = rect.height;
            const cx = w / 2;
            const cy = h / 2;
            const radius = Math.min(w, h) * 0.42;

            ctxRmm.clearRect(0, 0, w, h);

            ctxRmm.fillStyle = "#050914";
            ctxRmm.fillRect(0, 0, w, h);

            const octantLabels = [
                { num: 5, label: "Continente Marítimo", angle: Math.PI / 8 },
                { num: 6, label: "Pacífico Oeste", angle: 3 * Math.PI / 8 },
                { num: 7, label: "Pacífico Oeste", angle: 5 * Math.PI / 8 },
                { num: 8, label: "Hemisfério Ocidental", angle: 7 * Math.PI / 8 },
                { num: 1, label: "Hemisfério Ocidental & África", angle: -7 * Math.PI / 8 },
                { num: 2, label: "Oceano Índico", angle: -5 * Math.PI / 8 },
                { num: 3, label: "Oceano Índico", angle: -3 * Math.PI / 8 },
                { num: 4, label: "Continente Marítimo", angle: -Math.PI / 8 }
            ];

            ctxRmm.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctxRmm.lineWidth = 1;
            ctxRmm.beginPath();
            ctxRmm.moveTo(cx - radius, cy);
            ctxRmm.lineTo(cx + radius, cy);
            ctxRmm.moveTo(cx, cy - radius);
            ctxRmm.lineTo(cx, cy + radius);
            ctxRmm.stroke();

            ctxRmm.setLineDash([2, 3]);
            for (let i = 0; i < 4; i++) {
                let ang = (i * Math.PI / 4) + (Math.PI / 4);
                ctxRmm.beginPath();
                ctxRmm.moveTo(cx - Math.cos(ang) * radius, cy - Math.sin(ang) * radius);
                ctxRmm.lineTo(cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius);
                ctxRmm.stroke();
            }
            ctxRmm.setLineDash([]);

            const rUnit = radius * 0.45;
            ctxRmm.beginPath();
            ctxRmm.arc(cx, cy, rUnit, 0, Math.PI * 2);
            ctxRmm.fillStyle = "rgba(100, 116, 139, 0.12)";
            ctxRmm.fill();
            ctxRmm.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctxRmm.lineWidth = 1.2;
            ctxRmm.stroke();

            ctxRmm.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctxRmm.font = "9px JetBrains Mono";
            ctxRmm.textAlign = "center";
            ctxRmm.fillText("|RMM| < 1", cx, cy + 3);

            octantLabels.forEach(oct => {
                const isActive = oct.num === APP.currentPhase;
                const dist = radius * 0.82;
                const ox = cx + Math.cos(oct.angle) * dist;
                const oy = cy - Math.sin(oct.angle) * dist;

                ctxRmm.beginPath();
                ctxRmm.arc(ox, oy, 12, 0, Math.PI * 2);
                ctxRmm.fillStyle = isActive ? "rgba(251, 191, 36, 0.3)" : "rgba(15, 23, 42, 0.6)";
                ctxRmm.fill();
                ctxRmm.strokeStyle = isActive ? "#fbbf24" : "rgba(255, 255, 255, 0.2)";
                ctxRmm.lineWidth = isActive ? 2 : 1;
                ctxRmm.stroke();

                ctxRmm.fillStyle = isActive ? "#fbbf24" : "#94a3b8";
                ctxRmm.font = "bold 11px JetBrains Mono";
                ctxRmm.textAlign = "center";
                ctxRmm.textBaseline = "middle";
                ctxRmm.fillText(oct.num, ox, oy);
            });

            const phaseAngs = {
                1: -3 * Math.PI / 4,
                2: -5 * Math.PI / 8,
                3: -Math.PI / 2,
                4: -Math.PI / 8,
                5: Math.PI / 8,
                6: Math.PI / 2,
                7: 3 * Math.PI / 4,
                8: 7 * Math.PI / 8
            };
            const currentAng = phaseAngs[APP.currentPhase];
            const currentDist = rUnit * APP.amplitude;
            const px = cx + Math.cos(currentAng) * currentDist;
            const py = cy - Math.sin(currentAng) * currentDist;

            ctxRmm.beginPath();
            ctxRmm.strokeStyle = "rgba(56, 189, 248, 0.4)";
            ctxRmm.lineWidth = 2;
            for (let i = 1; i <= 8; i++) {
                let a = phaseAngs[i];
                let x = cx + Math.cos(a) * (rUnit * 1.6);
                let y = cy - Math.sin(a) * (rUnit * 1.6);
                if (i === 1) ctxRmm.moveTo(x, y);
                else ctxRmm.lineTo(x, y);
            }
            ctxRmm.closePath();
            ctxRmm.stroke();

            ctxRmm.beginPath();
            ctxRmm.arc(px, py, 7, 0, Math.PI * 2);
            ctxRmm.fillStyle = "#38bdf8";
            ctxRmm.fill();
            ctxRmm.strokeStyle = "#ffffff";
            ctxRmm.lineWidth = 2;
            ctxRmm.stroke();

            ctxRmm.strokeStyle = "rgba(251, 191, 36, 0.8)";
            ctxRmm.lineWidth = 1.5;
            ctxRmm.beginPath();
            ctxRmm.arc(cx, cy, radius * 0.94, -Math.PI/3, Math.PI/3, false);
            ctxRmm.stroke();
            ctxRmm.fillStyle = "#fbbf24";
            ctxRmm.font = "8px Inter";
            ctxRmm.fillText("Propagação p/ Leste →", cx, cy - radius * 0.96);
        }

        /* --- CORTE VERTICAL DA TROPOSFERA --- */
        const crossCanvas = document.getElementById('crossSectionCanvas');
        const ctxCross = crossCanvas.getContext('2d');

        function renderCrossSection() {
            const rect = crossCanvas.getBoundingClientRect();
            crossCanvas.width = rect.width * window.devicePixelRatio;
            crossCanvas.height = rect.height * window.devicePixelRatio;
            ctxCross.scale(window.devicePixelRatio, window.devicePixelRatio);

            const w = rect.width;
            const h = rect.height;
            const state = getComputedClimateState();

            ctxCross.clearRect(0, 0, w, h);

            const levels = [
                { p: 1000, y: h - 20, label: "1000 hPa" },
                { p: 850,  y: h - 50, label: "850 hPa (SALLJ)" },
                { p: 500,  y: h - 95, label: "500 hPa" },
                { p: 200,  y: 35,     label: "200 hPa (Jato Subtrop.)" }
            ];

            levels.forEach(lvl => {
                ctxCross.strokeStyle = "rgba(255, 255, 255, 0.08)";
                ctxCross.lineWidth = 1;
                ctxCross.beginPath();
                ctxCross.moveTo(50, lvl.y);
                ctxCross.lineTo(w - 10, lvl.y);
                ctxCross.stroke();

                ctxCross.fillStyle = "#64748b";
                ctxCross.font = "9px JetBrains Mono";
                ctxCross.textAlign = "right";
                ctxCross.fillText(lvl.label, 46, lvl.y + 3);
            });

            // Andes
            ctxCross.beginPath();
            ctxCross.moveTo(50, h - 20);
            ctxCross.lineTo(95, h - 100);
            ctxCross.lineTo(120, h - 20);
            ctxCross.closePath();
            ctxCross.fillStyle = "rgba(217, 119, 6, 0.4)";
            ctxCross.fill();
            ctxCross.strokeStyle = "#f59e0b";
            ctxCross.lineWidth = 1.5;
            ctxCross.stroke();

            ctxCross.fillStyle = "#f59e0b";
            ctxCross.font = "bold 9px Inter";
            ctxCross.textAlign = "center";
            ctxCross.fillText("Andes", 95, h - 105);

            // SALLJ em 850 hPa
            const isCoupled = state.coupling.includes("ACOPLADO");
            const salljX = isCoupled ? 165 : 220;
            const salljY = h - 50;

            ctxCross.beginPath();
            ctxCross.ellipse(salljX, salljY, 24, 12, 0, 0, Math.PI * 2);
            ctxCross.fillStyle = "rgba(16, 185, 129, 0.35)";
            ctxCross.fill();
            ctxCross.strokeStyle = "#10b981";
            ctxCross.lineWidth = 1.5;
            ctxCross.stroke();

            ctxCross.fillStyle = "#34d399";
            ctxCross.font = "bold 8.5px JetBrains Mono";
            ctxCross.fillText(`SALLJ (${state.salljIntensity} m/s)`, salljX, salljY - 14);

            // Jato Subtropical em 200 hPa
            const stjX = isCoupled ? 180 : 250;
            const stjY = 35;

            ctxCross.beginPath();
            ctxCross.ellipse(stjX, stjY, 32, 14, 0, 0, Math.PI * 2);
            ctxCross.fillStyle = "rgba(56, 189, 248, 0.35)";
            ctxCross.fill();
            ctxCross.strokeStyle = "#38bdf8";
            ctxCross.lineWidth = 1.5;
            ctxCross.stroke();

            ctxCross.fillStyle = "#38bdf8";
            ctxCross.font = "bold 8.5px JetBrains Mono";
            ctxCross.fillText(`STJ (${state.stjSpeed} m/s em ${Math.abs(Math.round(state.stjLat))}°S)`, stjX, stjY - 16);

            // Convecção ou Subsidência
            if (isCoupled) {
                ctxCross.strokeStyle = "#34d399";
                ctxCross.lineWidth = 2;
                for (let x = 150; x <= 195; x += 15) {
                    ctxCross.beginPath();
                    ctxCross.moveTo(x, h - 60);
                    ctxCross.lineTo(x, 55);
                    ctxCross.stroke();

                    ctxCross.beginPath();
                    ctxCross.moveTo(x - 4, 62);
                    ctxCross.lineTo(x, 54);
                    ctxCross.lineTo(x + 4, 62);
                    ctxCross.fillStyle = "#34d399";
                    ctxCross.fill();
                }

                ctxCross.fillStyle = "rgba(255, 255, 255, 0.25)";
                ctxCross.beginPath();
                ctxCross.arc(170, 75, 20, 0, Math.PI * 2);
                ctxCross.arc(190, 80, 24, 0, Math.PI * 2);
                ctxCross.arc(155, 88, 16, 0, Math.PI * 2);
                ctxCross.fill();

                ctxCross.fillStyle = "#fbbf24";
                ctxCross.font = "bold 9px Outfit";
                ctxCross.fillText("SCM Subtropical", 175, 115);
            } else {
                ctxCross.strokeStyle = "rgba(249, 115, 22, 0.7)";
                ctxCross.lineWidth = 1.5;
                for (let x = 160; x <= 220; x += 25) {
                    ctxCross.beginPath();
                    ctxCross.moveTo(x, 55);
                    ctxCross.lineTo(x, h - 55);
                    ctxCross.stroke();

                    ctxCross.beginPath();
                    ctxCross.moveTo(x - 4, h - 63);
                    ctxCross.lineTo(x, h - 55);
                    ctxCross.lineTo(x + 4, h - 63);
                    ctxCross.fillStyle = "#f97316";
                    ctxCross.fill();
                }
                ctxCross.fillStyle = "#f97316";
                ctxCross.font = "bold 9px Outfit";
                ctxCross.fillText("Subsidência / Céu Limpo", 190, 95);
            }
        }

        /* --- RÉGUA DO LOGITO (FIGURA 1.3 DO LIVRO) --- */
        const logitCanvas = document.getElementById('logitRulerCanvas');
        const ctxLogit = logitCanvas.getContext('2d');

        function logitToProb(l) {
            return 1 / (1 + Math.exp(-l));
        }

        function probToLogit(p) {
            return Math.log(p / (1 - p));
        }

        function renderLogitRuler() {
            const rect = logitCanvas.getBoundingClientRect();
            logitCanvas.width = rect.width * window.devicePixelRatio;
            logitCanvas.height = rect.height * window.devicePixelRatio;
            ctxLogit.scale(window.devicePixelRatio, window.devicePixelRatio);

            const w = rect.width;
            const h = rect.height;
            const state = getComputedClimateState();

            ctxLogit.clearRect(0, 0, w, h);

            ctxLogit.fillStyle = "#050915";
            ctxLogit.fillRect(0, 0, w, h);

            const minLogit = -4.0;
            const maxLogit = +2.5;

            function logitToX(l) {
                return 40 + ((l - minLogit) / (maxLogit - minLogit)) * (w - 70);
            }

            const axisY = 45;
            ctxLogit.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctxLogit.lineWidth = 1.5;
            ctxLogit.beginPath();
            ctxLogit.moveTo(35, axisY);
            ctxLogit.lineTo(w - 25, axisY);
            ctxLogit.stroke();

            for (let l = -4; l <= 2; l++) {
                const x = logitToX(l);
                ctxLogit.beginPath();
                ctxLogit.moveTo(x, axisY - 8);
                ctxLogit.lineTo(x, axisY);
                ctxLogit.strokeStyle = "#38bdf8";
                ctxLogit.stroke();

                ctxLogit.fillStyle = "#38bdf8";
                ctxLogit.font = "bold 9px JetBrains Mono";
                ctxLogit.textAlign = "center";
                ctxLogit.fillText((l > 0 ? '+' : '') + l, x, axisY - 12);
            }
            ctxLogit.fillStyle = "#94a3b8";
            ctxLogit.font = "8px Inter";
            ctxLogit.textAlign = "right";
            ctxLogit.fillText("logito", 32, axisY - 12);

            const probs = [0.01, 0.02, 0.05, 0.10, 0.20, 0.30, 0.50, 0.70, 0.85];
            probs.forEach(p => {
                const l = probToLogit(p);
                const x = logitToX(l);
                ctxLogit.beginPath();
                ctxLogit.moveTo(x, axisY);
                ctxLogit.lineTo(x, axisY + 8);
                ctxLogit.strokeStyle = "#f59e0b";
                ctxLogit.stroke();

                ctxLogit.fillStyle = "#fcd34d";
                ctxLogit.font = "8.5px JetBrains Mono";
                ctxLogit.textAlign = "center";
                ctxLogit.fillText(`${Math.round(p * 100)}%`, x, axisY + 18);
            });
            ctxLogit.fillStyle = "#94a3b8";
            ctxLogit.font = "8px Inter";
            ctxLogit.textAlign = "right";
            ctxLogit.fillText("prob. P", 32, axisY + 18);

            // CÁLCULO DINÂMICO
            const hasSallj = document.getElementById('selSALLJ').value === '1';
            let currentLogit = -1.99; // a0 (climatologia sem jato: 12%)

            const stepSallj = hasSallj ? 1.63 : 0;
            const stepMjo = state.mjoFactor;
            const stepEnos = state.ensoLogitStep;

            const finalLogit = currentLogit + stepSallj + stepMjo + stepEnos;
            const finalP = logitToProb(finalLogit);

            document.getElementById('finalProbVal').textContent = `${(finalP * 100).toFixed(1)}%`;
            document.getElementById('decompMetricsBadge').textContent = `ν: ${state.decompNuText} | r̄: ${state.decompRbarText}`;

            const arrowY = 85;
            let startX = logitToX(currentLogit);

            if (hasSallj) {
                let nextX = logitToX(currentLogit + stepSallj);
                drawStepArrow(startX, nextX, arrowY, "#10b981", `SALLJ (+1.63) ×5.1`);
                currentLogit += stepSallj;
                startX = nextX;
            }

            if (Math.abs(stepMjo) > 0.05) {
                let nextX = logitToX(currentLogit + stepMjo);
                drawStepArrow(startX, nextX, arrowY + 16, "#38bdf8", `MJO F${state.phase} (${stepMjo > 0 ? '+' : ''}${stepMjo.toFixed(2)})`);
                currentLogit += stepMjo;
                startX = nextX;
            }

            if (Math.abs(stepEnos) > 0.05) {
                let nextX = logitToX(currentLogit + stepEnos);
                drawStepArrow(startX, nextX, arrowY + 32, "#fbbf24", `ENOS (${stepEnos > 0 ? '+' : ''}${stepEnos.toFixed(2)})`);
                currentLogit += stepEnos;
                startX = nextX;
            }

            const finalX = logitToX(finalLogit);
            ctxLogit.beginPath();
            ctxLogit.moveTo(finalX, axisY + 4);
            ctxLogit.lineTo(finalX - 6, axisY + 14);
            ctxLogit.lineTo(finalX + 6, axisY + 14);
            ctxLogit.closePath();
            ctxLogit.fillStyle = "#34d399";
            ctxLogit.fill();

            ctxLogit.beginPath();
            ctxLogit.arc(finalX, arrowY + 46, 5, 0, Math.PI * 2);
            ctxLogit.fillStyle = "#34d399";
            ctxLogit.fill();
        }

        function drawStepArrow(x1, x2, y, color, label) {
            ctxLogit.beginPath();
            ctxLogit.moveTo(x1, y);
            ctxLogit.lineTo(x2, y);
            ctxLogit.strokeStyle = color;
            ctxLogit.lineWidth = 3;
            ctxLogit.stroke();

            const dir = x2 > x1 ? 1 : -1;
            ctxLogit.beginPath();
            ctxLogit.moveTo(x2, y);
            ctxLogit.lineTo(x2 - dir * 6, y - 4);
            ctxLogit.lineTo(x2 - dir * 6, y + 4);
            ctxLogit.closePath();
            ctxLogit.fillStyle = color;
            ctxLogit.fill();

            ctxLogit.fillStyle = color;
            ctxLogit.font = "8px Inter";
            ctxLogit.textAlign = "center";
            ctxLogit.fillText(label, (x1 + x2) / 2, y - 5);
        }

        /* --- ATUALIZAÇÃO GERAL DA UI --- */
        function updateUI() {
            const state = getComputedClimateState();

            // Ribbon
            const seasonLabels = { DJF: "Verão (DJF)", MAM: "Outono (MAM)", JJA: "Inverno (JJA)", SON: "Primavera (SON)" };
            const ensoLabels = { 'el-nino': "El Niño", 'neutro': "ENOS Neutro", 'la-nina': "La Niña" };
            document.getElementById('ribbonState').textContent = `${seasonLabels[state.season]} • ${ensoLabels[state.enso]} • MJO Fase ${state.phase}`;
            document.getElementById('ribbonSTJ').textContent = `${Math.abs(Math.round(state.stjLat))}°S (${state.stjSpeed} m/s)`;
            document.getElementById('ribbonPFJ').textContent = `${Math.abs(Math.round(state.pfjLat))}°S (Frente Polar)`;
            document.getElementById('ribbonSALLJ').textContent = `${state.salljDirection === 'southward' ? 'Encostado nos Andes' : 'Desprende precoce'} (Q = ${state.salljFlux} kg/m s)`;
            document.getElementById('ribbonDecomp').textContent = `Decomposição R = ν · r̄: ν ${state.decompNuText} | r̄ ${state.decompRbarText}`;

            // Botões de Fases
            document.querySelectorAll('.btn-phase-pill').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.phase) === state.phase);
            });

            // Botões de Estações
            document.querySelectorAll('.btn-season-pill').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.season === state.season);
            });

            // Botões de ENOS
            document.querySelectorAll('.btn-enso-pill').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.enso === state.enso);
            });

            // Painel RMM
            document.getElementById('rmmPhaseVal').textContent = `Fase ${state.phase}`;
            document.getElementById('rmmAmpVal').textContent = APP.amplitude.toFixed(2);
            document.getElementById('rmmStatusVal').textContent = APP.amplitude >= 1.0 ? "Ativa (A > 1)" : "Inativa (Disco)";
            document.getElementById('rmmStatusVal').style.color = APP.amplitude >= 1.0 ? "var(--accent-emerald)" : "var(--text-muted)";

            // Card de Diagnóstico
            document.getElementById('diagTitle').textContent = `Diagnóstico: ${seasonLabels[state.season]} • ${ensoLabels[state.enso]} • Fase ${state.phase}`;
            document.getElementById('diagBadge').textContent = state.diagTitleStatus;
            document.getElementById('diagBadge').className = `diag-status-badge ${state.badgeClass}`;
            document.getElementById('diagDescription').textContent = `${state.seasonDesc} ${state.ensoDesc} A MJO em Fase ${state.phase} (${state.name}) modula o desprendimento do jato: ${state.salljDirection === 'southward' ? 'umidade canalizada para o Sul do Brasil e Prata' : 'umidade defletida para o Sudeste e ZCAS'}.`;

            document.getElementById('diagSalljBehav').textContent = state.salljDirection === 'southward' ? 'Estendido para o Sul (Prata)' : (state.salljDirection === 'eastward' ? 'Desprende precoce (p/ ZCAS)' : 'Transição');
            document.getElementById('diagLatDet').textContent = `${Math.abs(state.salljCurvatureLat)}°S`;
            document.getElementById('diagZcasStatus').textContent = state.zcasRain > 0 ? `Ativa (+${state.zcasRain}%)` : `Suprimida (${state.zcasRain}%)`;
            document.getElementById('diagSesaAnom').textContent = `${state.sesaRain > 0 ? '+' : ''}${state.sesaRain}%`;
            document.getElementById('verticalCouplingStatus').textContent = state.coupling;
            document.getElementById('verticalCouplingStatus').style.color = state.coupling.includes("ACOPLADO") ? "#34d399" : "#fb923c";

            document.getElementById('csLatitudeHeader').textContent = `Corte Zonal ~${Math.abs(Math.round(state.stjLat))}°S (Andes ao Atlântico)`;
            document.getElementById('sourceRossbyText').textContent = `Convecção a ~${state.tropicalConvection.lon}° (${state.name})`;
            document.getElementById('ductRossbyText').textContent = `Jato Subtropical em ${Math.abs(Math.round(state.stjLat))}°S guia o trem PSA com Ks alto`;
            document.getElementById('ensoBasicStateText').textContent = `${ensoLabels[state.enso]}: ν ${state.decompNuText}, r̄ ${state.decompRbarText}`;

            renderMap();
            renderRMM();
            renderCrossSection();
            renderLogitRuler();
        }

        /* --- LISTENERS --- */
        document.querySelectorAll('.btn-phase-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                stopCycle();
                APP.currentPhase = parseInt(btn.dataset.phase);
                updateUI();
            });
        });

        document.querySelectorAll('.btn-season-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                APP.currentSeason = btn.dataset.season;
                updateUI();
            });
        });

        document.querySelectorAll('.btn-enso-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                APP.currentENSO = btn.dataset.enso;
                updateUI();
            });
        });

        const btnPlay = document.getElementById('btnPlayCycle');
        btnPlay.addEventListener('click', () => {
            if (APP.isCyclePlaying) stopCycle();
            else startCycle();
        });

        function startCycle() {
            APP.isCyclePlaying = true;
            btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
            btnPlay.style.background = 'rgba(244, 63, 94, 0.2)';
            btnPlay.style.borderColor = 'var(--accent-rose)';
            btnPlay.style.color = '#fda4af';

            APP.cycleTimer = setInterval(() => {
                let nextPhase = APP.currentPhase + 1;
                if (nextPhase > 8) nextPhase = 1;
                APP.currentPhase = nextPhase;
                updateUI();
            }, 3000);
        }

        function stopCycle() {
            APP.isCyclePlaying = false;
            clearInterval(APP.cycleTimer);
            btnPlay.innerHTML = '<i class="fa-solid fa-play"></i> Ciclo 45d';
            btnPlay.style.background = 'rgba(16, 185, 129, 0.2)';
            btnPlay.style.borderColor = 'var(--accent-emerald)';
            btnPlay.style.color = 'var(--accent-emerald)';
        }

        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                APP.currentView = tab.dataset.view;
                APP.map.zoom = 1.0;
                APP.map.panX = 0;
                APP.map.panY = 0;
                renderMap();
            });
        });

        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const layer = btn.dataset.layer;
                APP.layers[layer] = !APP.layers[layer];
                btn.classList.toggle('active', APP.layers[layer]);
                renderMap();
            });
        });

        const sliderAmp = document.getElementById('sliderAmp');
        const sliderAmpVal = document.getElementById('sliderAmpVal');
        sliderAmp.addEventListener('input', (e) => {
            APP.amplitude = parseFloat(e.target.value);
            sliderAmpVal.textContent = APP.amplitude.toFixed(2);
            updateUI();
        });

        document.getElementById('selSALLJ').addEventListener('change', renderLogitRuler);

        document.getElementById('btnZoomIn').addEventListener('click', () => {
            APP.map.zoom = Math.min(4.0, APP.map.zoom * 1.25);
            renderMap();
        });
        document.getElementById('btnZoomOut').addEventListener('click', () => {
            APP.map.zoom = Math.max(0.6, APP.map.zoom / 1.25);
            renderMap();
        });
        document.getElementById('btnResetView').addEventListener('click', () => {
            APP.map.zoom = 1.0;
            APP.map.panX = 0;
            APP.map.panY = 0;
            renderMap();
        });

        mapContainer.addEventListener('mousedown', (e) => {
            APP.map.isDragging = true;
            APP.map.startX = e.clientX - APP.map.panX;
            APP.map.startY = e.clientY - APP.map.panY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!APP.map.isDragging) return;
            APP.map.panX = e.clientX - APP.map.startX;
            APP.map.panY = e.clientY - APP.map.startY;
            renderMap();
        });

        window.addEventListener('mouseup', () => {
            APP.map.isDragging = false;
        });

        mapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
            APP.map.zoom = Math.max(0.6, Math.min(4.5, APP.map.zoom * zoomFactor));
            renderMap();
        }, { passive: false });

        mapContainer.addEventListener('mousemove', (e) => {
            const rect = mapContainer.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;

            const coords = screenToLonLat(sx, sy, rect.width, rect.height);
            const state = getComputedClimateState();

            let text = `Lon: ${coords.lon.toFixed(1)}° | Lat: ${coords.lat.toFixed(1)}°`;

            if (coords.lat >= -38 && coords.lat <= -22 && coords.lon >= -64 && coords.lon <= -48) {
                text = `<b>SESA / Bacia do Prata</b><br>Anomalia: <b>${state.sesaRain > 0 ? '+' : ''}${state.sesaRain}%</b><br>Acoplamento: ${state.coupling}<br>Frequência ν: ${state.decompNuText}<br>Severidade r̄: ${state.decompRbarText}`;
                tooltip.style.display = 'block';
                tooltip.style.left = `${sx + 15}px`;
                tooltip.style.top = `${sy + 15}px`;
                tooltip.innerHTML = text;
            } else if (coords.lat >= -25 && coords.lat <= -12 && coords.lon >= -60 && coords.lon <= -38) {
                text = `<b>Faixa da ZCAS</b><br>Anomalia: <b>${state.zcasRain > 0 ? '+' : ''}${state.zcasRain}%</b><br>Status: ${state.zcasRain > 0 ? 'Convecção Ativa' : 'Suprimida'}`;
                tooltip.style.display = 'block';
                tooltip.style.left = `${sx + 15}px`;
                tooltip.style.top = `${sy + 15}px`;
                tooltip.innerHTML = text;
            } else {
                tooltip.style.display = 'none';
            }
        });

        mapContainer.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        rmmCanvas.addEventListener('click', (e) => {
            const rect = rmmCanvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = -((e.clientY - rect.top) - rect.height / 2);

            let angle = Math.atan2(y, x);
            let p = 3;
            if (angle >= 0 && angle < Math.PI / 4) p = 5;
            else if (angle >= Math.PI / 4 && angle < Math.PI / 2) p = 6;
            else if (angle >= Math.PI / 2 && angle < 3 * Math.PI / 4) p = 7;
            else if (angle >= 3 * Math.PI / 4 && angle <= Math.PI) p = 8;
            else if (angle >= -Math.PI && angle < -3 * Math.PI / 4) p = 1;
            else if (angle >= -3 * Math.PI / 4 && angle < -Math.PI / 2) p = 2;
            else if (angle >= -Math.PI / 2 && angle < -Math.PI / 4) p = 3;
            else if (angle >= -Math.PI / 4 && angle < 0) p = 4;

            stopCycle();
            APP.currentPhase = p;
            updateUI();
        });

        // Narração por Voz
        const btnVoice = document.getElementById('btnVoice');
        const btnVoiceStop = document.getElementById('btnVoiceStop');

        btnVoice.addEventListener('click', () => {
            if (!APP.speechSynth) {
                alert("Navegador sem suporte a síntese de voz.");
                return;
            }
            speakCurrentDiagnostics();
        });

        btnVoiceStop.addEventListener('click', () => {
            if (APP.speechSynth) {
                APP.speechSynth.cancel();
                APP.isSpeaking = false;
                btnVoiceStop.style.display = 'none';
                btnVoice.innerHTML = '<i class="fa-solid fa-volume-high"></i> Narrar Diagnóstico';
            }
        });

        function speakCurrentDiagnostics() {
            APP.speechSynth.cancel();
            const state = getComputedClimateState();
            const seasonNames = { DJF: "Verão", MAM: "Outono", JJA: "Inverno", SON: "Primavera" };
            const ensoNames = { 'el-nino': "El Niño", 'neutro': "ENOS Neutro", 'la-nina': "La Niña" };

            const textToSpeak = `Diagnóstico climático para a estação de ${seasonNames[state.season]}, sob condições de ${ensoNames[state.enso]}, e Fase ${state.phase} da Oscilação de Madden-Julian. ${state.seasonDesc} ${state.ensoDesc} O Jato de Baixos Níveis encontra-se ${state.salljDirection === 'southward' ? 'encostado na cordilheira dos Andes até a Bacia do Prata, com anomalia de chuva de mais ' + state.sesaRain + ' por cento no SESA.' : 'desprendido precocemente para o Sudeste, alimentando a Zona de Convergência do Atlântico Sul e reduzindo a chuva na Bacia do Prata.'}`;

            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.05;

            utterance.onstart = () => {
                APP.isSpeaking = true;
                btnVoiceStop.style.display = 'inline-flex';
                btnVoice.innerHTML = '<i class="fa-solid fa-volume-high"></i> Narrando...';
            };

            utterance.onend = () => {
                APP.isSpeaking = false;
                btnVoiceStop.style.display = 'none';
                btnVoice.innerHTML = '<i class="fa-solid fa-volume-high"></i> Narrar Diagnóstico';
            };

            APP.speechSynth.speak(utterance);
        }

        const theoryToggle = document.getElementById('theoryToggle');
        const theoryBody = document.getElementById('theoryBody');
        const theoryIcon = document.getElementById('theoryIcon');
        theoryToggle.addEventListener('click', () => {
            const isHidden = theoryBody.style.display === 'none';
            theoryBody.style.display = isHidden ? 'grid' : 'none';
            theoryIcon.className = isHidden ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
        });

        function animateLoop() {
            renderMap();
            APP.animFrameId = requestAnimationFrame(animateLoop);
        }

        window.addEventListener('DOMContentLoaded', () => {
            resizeCanvas();
            updateUI();
            animateLoop();

            if (window.renderMathInElement) {
                renderMathInElement(document.body, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ]
                });
            }
        });
    </script>
</body>
</html>
'''

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Salvo em: {OUTPUT_FILE}")

onedrive_file = os.path.join(ONEDRIVE_DIR, "index.html")
with open(onedrive_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Espelhado para o OneDrive em: {onedrive_file}")
