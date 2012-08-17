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
  this.time = 0;
  this.measure = 0;
  this.pitch = 60;
}
inherits(MusTxtStream, Stream);
module.exports = MusTxtStream;

MusTxtStream.prototype.write = function (chunk) {
  this.buf += chunk;
};

MusTxtStream.prototype.end = function (chunk) {
  if (chunk) this.write(chunk);
  
  this.score = parse(this.buf);
  this.buf = '';
  this.send(this.score);
};

MusTxtStream.prototype.destroy = function () {
  this.destroyed = true;
  this.emit('end');
};

MusTxtStream.prototype.pause = function (chunk) {
  this.paused = true;
  this.time = 0;
};

MusTxtStream.prototype.resume = function (chunk) {
  if (!this.paused) return;
  this.paused = false;
  this.emit('resume');
};

MusTxtStream.prototype.send = function (score) {
  var self = this;

  process.nextTick(function loop () {
    if (self.destroyed) {

    }
    else if (self.paused) {
      self.once('resume', function () {
        process.nextTick(loop);
      });
    }
    else {
      // Emit a single measure.
      var measure = [];
      score.parts.forEach(function (part, channel) {
        var partMeasure = part.measures.shift();
        if (!partMeasure) return;

        // @todo: calculate note length, time offset, sort by start time
        measure.push()
      });

      process.nextTick(loop);
    }
  });
  
  score.parts.forEach(function (part, channel) {
    console.log(channel);
  });
};
