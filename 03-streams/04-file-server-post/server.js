const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (/\/+/.test(pathname)) {
        res.statusCode = 400;
        res.end('Attachment files not supported');
        return;
      }
      const writableStream = fs.createWriteStream(filepath, {
        flags: 'wx',
      });
      const limitSizeStream = new LimitSizeStream({limit: 1000000});
      req
          .pipe(limitSizeStream)
          .pipe(writableStream);

      writableStream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('file already exist');
          return;
        }
        res.statusCode = 500;
        res.end('Internal server error');
      });
      writableStream.on('finish', () => {
        res.statusCode = 201;
        res.end('file saved');
      });

      limitSizeStream.on('error', (err) => {
        console.log('error');
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('file exceed size');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
        writableStream.destroy();
        fs.unlink(filepath, (err) => {});
      });

      req.on('aborted', () => {
        limitSizeStream.destroy();
        writableStream.destroy();
        fs.unlink(filepath, (err) => {});
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
