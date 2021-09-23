const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.accumulator = 0;
  }

  _transform(chunk, encoding, callback) {
    try {
      this.accumulator += chunk.length;
      if (this.accumulator > this.limit) {
        throw new LimitExceededError();
      } else {
        callback(null, chunk);
      }
    } catch (ex) {
      callback(ex);
    }
  }
}

module.exports = LimitSizeStream;
