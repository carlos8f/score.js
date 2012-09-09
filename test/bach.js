var score = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , resolve = require('path').resolve
  , coremidi = require('coremidi')

describe('bach', function () {
  it('parses', function (done) {
    fs.readFile(resolve(__dirname, '../examples/66.6.md'), 'utf8', function (err, data) {
      var parsed = score.parse(data);
      assert.deepEqual(parsed.meta, {
        composer: 'J. S. Bach',
        title: 'Christ ist erstanden',
        form: 'chorale',
        key: "la",
        patch: 52,
        bpm: 60
      });
      assert.equal(parsed.parts.length, 4);
      done();
    });
  });
})