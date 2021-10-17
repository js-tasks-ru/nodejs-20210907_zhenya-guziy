const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (/\/+/.test(pathname)) {
        res.statusCode = 400;
        res.end('Attachment files not supported');
        return;
      }
      fs.unlink(filepath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('file not exists');
          } else {
            res.statusCode = 500;
            res.end('internal server error');
          }
        } else {
          res.statusCode = 200;
          res.end('file removed');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
