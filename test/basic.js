var mus = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , resolve = require('path').resolve

describe('basic', function () {
  it('parses', function (done) {
    fs.readFile(resolve(__dirname, './fixtures/basic.md'), 'utf8', function (err, data) {
      var expected = {
        "meta": {},
        "parts": [
          {
            "name": "part 1",
            "measures": [
              [
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
              ],
              [
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
            ]
          }
        ]
      };

      assert.deepEqual(mus.parse(data), expected);

      done();
    });
  });
})