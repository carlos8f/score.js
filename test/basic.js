var parser = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , resolve = require('path').resolve
  , isArray = require('util').isArray

describe('basic test', function () {
  var content;
  before(function (done) {
    fs.readFile(resolve(__dirname, './fixtures/66.6.txt'), 'utf8', function(err, data) {
      content = data;
      done();
    });
  });

  it('parses ok', function () {
    try {
      var parsed = parser.parse(content);
    }
    catch (e) {
      console.error(e);
      throw e;
    }

    // Validate header
    assert.equal(parsed.meta.composer, 'J. S. Bach');
    assert.equal(parsed.meta.title, 'Christ ist erstanden');
    assert.equal(parsed.meta.form, 'chorale');

    // Validate parts
    assert(isArray(parsed.parts), 'parts is array');
    console.log('measures', parsed.parts[0].measures);
  });
});
