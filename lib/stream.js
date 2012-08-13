var Stream = require('stream')
  , inherits = require('util').inherits
  , parse = require('../').parse

var MESSAGE_CONTROLCHANGE = 0xB;
var MESSAGE_PROGRAMCHANGE = 0xC;
var MESSAGE_MSBCONTROL = 0;
var MESSAGE_LSBCONTROL = 32;
var MESSAGE_NOTEON = 0x9;
 
function messageStatus (code) {
  return code << 4 | channel;
}

function MusTxtStream () {
  Stream.call(this);
  this.readable = true;
  this.writable = true;

  this.buf = '';
}
inherits(MusTxtStream, Stream);
module.exports = MusTxtStream;

MusTxtStream.prototype.write = function (chunk) {
  this.buf += chunk;
};

MusTxtStream.prototype.end = function (chunk) {
  if (chunk) this.write(chunk);
  
  this.score = parse(this.buf);
  this.send(this.score);
};

MusTxtStream.prototype.send = function (score) {
  var self = this;
  score.parts.forEach(function (part, channel) {
    console.log(channel);
  });
};
