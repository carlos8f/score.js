var Stream = require('stream')
  , inherits = require('util').inherits
  , tokens = require('./lib/tokens')
  , yaml = require('js-yaml')

function MusParser() {
  Stream.call(this);
  this.readable = true;
  this.writable = true;

  this.buf = '';
  this.pattern = null;
  this.offset = 0;
  this.callbacks = null;
  this.headers = {};
  this.voice = null;
  this.init();
}
inherits(MusParser, Stream);

MusParser.prototype.init = function() {
  var startPattern = /^\s*?(\-\-\-)\r?\n|\s*(?:\(([^\)]+)\))?\s*\|{1,2}/;
  this.pattern = startPattern;
  var self = this;
  this.callback = function start(match) {
    if (match[1] === '---') {
      self.pattern = /\r?\n\-\-\-\r?\n/;
      self.callback = function captureMeta(match) {
        self.headers = yaml.load(match.input.substring(0, match.input.length - match[0].length));
        self.emit('headers', self.headers);
        self.pattern = startPattern;
        self.callback = start;
      };
    }
    else {
      self.start(match);
    }
  };
};

MusParser.prototype.start = function(match) {
  this.voice = match[2];
};

MusParser.prototype.write = function(chunk) {
  this.buf += chunk;
  this.scan();
};

MusParser.prototype.scan = function() {
  while (this.offset++ < this.buf.length) {
    var match = this.buf.substr(0, this.offset).match(this.pattern);
    if (match) {
      console.log(match);
      var ret = this.callback.call(this, match);
      if (typeof ret === 'undefined') {
        ret = match.input.length;
      }
      if (ret !== false) {
        this.buf = this.buf.substr(ret);
        this.offset = 0;
      }
    }
  }
};

MusParser.prototype.end = function(chunk) {
  if (chunk) this.write(chunk);
};

exports.parser = function parser(stream) {
  var p = new MusParser(stream);
  p.on('data', function (token, idx) {
    console.log('token: %s, idx: %d', token, idx);
  });
  return p;
};
