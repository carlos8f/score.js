var mus = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , resolve = require('path').resolve

describe('basic test', function() {
  var txt;
  before(function() {
    txt = fs.createReadStream(resolve(__dirname, './fixtures/66.6.txt'));
  });
  it('streams', function(done) {
    txt.pipe(mus.parser())
      .on('end', done);
  });
});