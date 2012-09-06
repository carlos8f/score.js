var mus = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , resolve = require('path').resolve

describe('basic', function () {
  it('parses', function (done) {
    fs.readFile(resolve(__dirname, './fixtures/basic.txt'), 'utf8', function (err, data) {
      var parsed = mus.parse(data);
      var expected = {
        "name": "part 1",
        "measures": [
          {
            "events": [
              {
                "type": "note",
                "syllable": "do"
              },
              {
                "type": "note",
                "syllable": "re"
              },
              {
                "type": "note",
                "syllable": "mi"
              },
              {
                "type": "note",
                "syllable": "fa"
              }
            ]
          },
          {
            "events": [
              {
                "type": "note",
                "syllable": "sol"
              },
              {
                "type": "note",
                "syllable": "la"
              },
              {
                "type": "note",
                "syllable": "ti"
              },
              {
                "type": "note",
                "syllable": "do"
              }
            ]
          }
        ]
      };
      assert.deepEqual(parsed.parts[0], expected);

      done();
    });
  });

  it('streams', function (done) {
    var stream = mus.stream();
    fs.createReadStream(resolve(__dirname, './fixtures/basic.txt'), {encoding: 'utf8'}).pipe(stream);

    stream.once('end', function () {
      done();
    });
  });
})