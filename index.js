exports.parse = require('./build/mus.txt').parse;

var through = require('through');

exports.stream = function () {
  var stream = through(write, end)
    , buf = ''

  function write (data) {
    buf += data;
  }

  function end () {
    try {
      var score = exports.parse(buf);
    }
    catch (e) {
      stream.emit('error', e);
      stream.destroy();
    }
    stream.emit('end');
  }

  return stream;
};
