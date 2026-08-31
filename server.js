const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(ROOT_DIR, reqPath);

  // Se o caminho for um diretório, procura por index.html dentro dele
  fs.stat(filePath, (statErr, stats) => {
    if (!statErr && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404 Not Found: ${reqPath}`);
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`500 Internal Server Error: ${err.message}`);
        }
        return;
      }

      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n===============================================================`);
  console.log(`🚀 HUB DE DEMONSTRAÇÕES CIENTÍFICAS ONLINE!`);
  console.log(`===============================================================`);
  console.log(`📁 Diretório Raiz     : ${ROOT_DIR}`);
  console.log(`🌐 Hub Principal      : http://localhost:${PORT}/`);
  console.log(`📐 Demo Equação 2º Gr : http://localhost:${PORT}/demos/geometric-quadratic/`);
  console.log(`🌍 Demo Foucault 3D   : http://localhost:${PORT}/demos/foucault-pendulum/`);
  console.log(`🌊 Demo Rossby 2D     : http://localhost:${PORT}/demos/rossby-radius/`);
  console.log(`🌪️ Demo Supercélula   : http://localhost:${PORT}/demos/supercell-splat-spin/`);
  console.log(`===============================================================\n`);
});
