const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 4173;
const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const safePath = path.normalize(urlPath).replace(/^\.+/, '/');
  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to SPA entry for unknown routes so deep links work.
      fs.readFile(path.join(__dirname, 'index.html'), (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(404);
          return res.end('Not found');
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(indexData);
      });
      return;
    }

    res.setHeader('Content-Type', mime[ext] || 'text/plain');
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
