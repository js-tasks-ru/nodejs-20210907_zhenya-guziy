const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.acc = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkArr = chunk.toString().split(os.EOL);
    const chunkArrLen = chunkArr.length;
    if (chunkArrLen === 1) {
      this.acc += chunkArr[0];
    } else {
      this.push(this.acc + chunkArr[0]);
      for (let i = 1; i < chunkArrLen - 1; i++) {
        this.push(chunkArr[i]);
      }
      this.acc = chunkArr[chunkArrLen - 1];
    }
    callback();
  }

  _flush(callback) {
    callback(null, this.acc);
  }
}

module.exports = LineSplitStream;
