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
    console.log(JSON.stringify(score.parts[0]));
    stream.emit('end');
  }

  return stream;
};
