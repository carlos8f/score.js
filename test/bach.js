var mus = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , resolve = require('path').resolve

describe('bach', function () {
  it('parses', function (done) {
    fs.readFile(resolve(__dirname, './fixtures/66.6.txt'), 'utf8', function (err, data) {
      var parsed = mus.parse(data);
      assert.deepEqual(parsed.meta, {
        composer: 'J. S. Bach',
        title: 'Christ ist erstanden',
        form: 'chorale'
      });
      assert.equal(parsed.parts.length, 1);
      done();
    });
  });

  it('streams', function (done) {
    var stream = mus.stream();
    fs.createReadStream(resolve(__dirname, './fixtures/66.6.txt'), {encoding: 'utf8'}).pipe(stream);

    stream.once('end', function () {
      done();
    });
  });
})