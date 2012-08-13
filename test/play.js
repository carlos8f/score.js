var parser = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , resolve = require('path').resolve
  , isArray = require('util').isArray
  , spawn = require('child_process').spawn

describe('stream test', function () {
  var content, parsed;
  before(function (done) {
    fs.readFile(resolve(__dirname, './fixtures/66.6.txt'), 'utf8', function (err, data) {
      content = data;
      done();
    });
  });

  var instrument, destStream;
  process.on('exit', function() {
    if (instrument) {
      instrument.kill();
    }
  });
  it('creates destination stream', function(done) {
    instrument = spawn(resolve(__dirname, '../node_modules/.bin/mac-synth'), ['--verbose']);
    instrument.stdout.once('data', function(chunk) {
      destStream = midistream.writable(chunk.toString().match(/"(mac\-synth\/.*?)"/)[1]);
      done();
    });
  });

  it('streams', function (done) {
    done();
  });
});
