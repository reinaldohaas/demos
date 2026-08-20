$PSScriptRoot = Split-Path -Parent -MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot
Write-Host "Iniciando Servidor Local de Demonstracoes..." -ForegroundColor Cyan
python server.py
