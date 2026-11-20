const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/toraja') reqPath = '/toraja.html';
  if (reqPath === '/bugis') reqPath = '/bugis.html';
  if (reqPath === '/kajang') reqPath = '/kajang.html';
  if (reqPath === '/bira') reqPath = '/bira.html';
  if (reqPath === '/islamic') reqPath = '/islamic.html';
  if (reqPath === '/donggia') reqPath = '/donggia.html';
  if (reqPath === '/studio') reqPath = '/studio.html';
  if (reqPath === '/jawa') reqPath = '/jawa.html';
  if (reqPath === '/bulukumba') reqPath = '/bulukumba.html';
  if (reqPath === '/recca' || reqPath === '/songkorecca') reqPath = '/recca.html';
  if (reqPath === '/jakarta') reqPath = '/jakarta.html';
  if (reqPath === '/cinematic' || reqPath === '/drama') reqPath = '/cinematic.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    if (stats.isDirectory()) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // Support HTTP Range Requests for Audio/Video
    const range = req.headers.range;
    if (range && (contentType.startsWith('audio') || contentType.startsWith('video'))) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType
      });

      const fileStream = fs.createReadStream(filePath, { start, end });
      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server preview undangan berjalan di: http://localhost:${PORT}`);
  console.log(`Contoh link dengan nama tamu: http://localhost:${PORT}/?to=Puang+Bau+Tenri+%26+Keluarga`);
});
