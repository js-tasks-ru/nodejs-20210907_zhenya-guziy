const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const limitedStream = new LimitSizeStream({limit: 8, encoding: 'utf-8'}); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл

// обработчик ошибки от лимит стрима
limitedStream.on('error', (error) => {
  console.log(error.code);
});

setTimeout(() => {
  limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
}, 10);
