@echo off
title Servidor de Demonstracoes Cientificas
cd /d "%~dp0"
echo ========================================================
echo Iniciando Servidor Local de Demonstracoes...
echo ========================================================
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python padrao nao encontrado, tentando via uv...
    uv run python server.py
)
pause
