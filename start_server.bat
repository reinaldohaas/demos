@echo off
title Servidor de Demonstracoes Cientificas
cd /d "%~dp0"
echo ========================================================
echo Iniciando Servidor Local de Demonstracoes...
echo ========================================================
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node server.js
    goto :end
)
where uv >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    uv run python server.py
    goto :end
)
python server.py
:end
pause
