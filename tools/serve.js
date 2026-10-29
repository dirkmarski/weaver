// Static file server for the repo root, for viewing the page (a module script does not run from file://).
// Run: node tools/serve.js   (http://localhost:8000). Tests import serve() and pass port 0 for a free port.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

// Create the server and start listening on 127.0.0.1:port (0 = a free port); returns the server.
export function serve(port) {
  const server = http.createServer((req, res) => {
    let file;
    try {
      const url = decodeURIComponent(req.url.split('?')[0]);
      if (url.includes('\0')) throw new Error('null byte');
      file = path.join(ROOT, url === '/' ? 'index.html' : path.normalize(url));
    } catch {
      return res.writeHead(404).end();
    }
    fs.readFile(file, (err, body) => {
      if (err || !(file === ROOT || file.startsWith(ROOT + path.sep))) return res.writeHead(404).end();
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'text/plain' }).end(body);
    });
  });
  server.listen(port, '127.0.0.1');
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  serve(8000).on('listening', () => console.log('Serving ' + ROOT + ' at http://localhost:8000'));
}
