const url = require('url');
const fs = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const readableStream = fs.createReadStream(filepath);
      if (/\/+/.test(pathname)) {
        res.statusCode = 400;
        res.end('Attachment files not supported');
      }
      readableStream.on('data', (chunk) => {
        res.write(chunk);
      });
      readableStream.on('end', () => {
        res.end();
      });
      readableStream.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
