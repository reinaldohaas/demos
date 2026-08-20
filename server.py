#!/usr/bin/env python3
"""
Servidor Local de Demonstrações Científicas
Desenvolvido para hospedar e testar visualizações interativas localmente.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import socket

DEFAULT_PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def find_available_port(start_port=DEFAULT_PORT, max_attempts=20):
    """Encontra uma porta TCP livre para rodar o servidor."""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return start_port

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP customizado que serve o diretório sem cache para facilitar testes."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    port = find_available_port(DEFAULT_PORT)
    url = f"http://127.0.0.1:{port}"

    print("=" * 65)
    print("🚀 SERVIDOR DE DEMONSTRAÇÕES CIENTÍFICAS INICIADO COM SUCESSO!")
    print("=" * 65)
    print(f"📁 Diretório Servido : {DIRECTORY}")
    print(f"🌐 URL Local         : {url}")
    print(f"🛑 Para encerrar     : Pressione Ctrl + C no terminal")
    print("=" * 65)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", port), NoCacheHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor encerrado.")
            sys.exit(0)

if __name__ == '__main__':
    main()
