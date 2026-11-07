const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json'
};

const BLOCKED_RE = /^\/(\.|scripts\/|docs\/|node_modules\/|package(-lock)?\.json$|server\.js$|.*\.(cjs|mjs|sh|md)$)/i;

const server = http.createServer((req, res) => {
  let rawPath = (req.url || '/').split('?')[0];
  try {
    rawPath = decodeURIComponent(rawPath);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }
  if (rawPath.includes('\0') || BLOCKED_RE.test(rawPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - File Not Found</h1>');
    return;
  }

  let filePath = rawPath === '/' ? '/index.html' : rawPath;

  // If path ends with /, try to serve index.html from that directory
  if (filePath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  const fullPath = path.resolve(__dirname, '.' + filePath);
  if (fullPath !== __dirname && !fullPath.startsWith(__dirname + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // First, try to read the file
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // If file not found and no extension, try adding index.html
        if (!ext) {
          const indexPath = path.join(__dirname, filePath, 'index.html');
          fs.readFile(indexPath, (err2, data2) => {
            if (err2) {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('<h1>404 - File Not Found</h1>');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(data2);
            }
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - File Not Found</h1>');
        }
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
