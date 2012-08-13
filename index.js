exports.parse = require('./build/mus.txt').parse;
exports.stream = function () {
  return new exports.MusTxtStream;
};
exports.MusTxtStream = require('./lib/stream');