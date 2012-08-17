var util = require('../lib/util')
  , assert = require('assert')

describe('util', function () {
  it('should getInterval correctly', function () {
    assert.equal(util.getInterval('do', 'do'), 1);
    assert.equal(util.getInterval('do', 'de'), 1);
    assert.equal(util.getInterval('do', 'ra'), 2);
    assert.equal(util.getInterval('do', 're'), 2);
    assert.equal(util.getInterval('do', 'mi'), 3);
    assert.equal(util.getInterval('do', 'la'), 6);
    assert.equal(util.getInterval('do', 'ti'), 7);
    assert.equal(util.getInterval('do', 'te'), 7);
    assert.equal(util.getInterval('re', 'fa'), 3);
    assert.equal(util.getInterval('fa', 're'), 6);
    assert.equal(util.getInterval('la', 'te'), 2);
    assert.equal(util.getInterval('sol', 'mi'), 6);
    assert.equal(util.getInterval('sol', 'do'), 4);
    assert.equal(util.getInterval('re', 'fi'), 3);
    assert.equal(util.getInterval('se', 'te'), 3);
  });

  it('should changePitch correctly', function () {
    assert.equal(util.changePitch(60, 'do', 'do'), 60);
    assert.equal(util.changePitch(60, 'do', 'di'), 61);
    assert.equal(util.changePitch(60, 'do', 're'), 62);
    assert.equal(util.changePitch(60, 'do', 'ra'), 61);
    assert.equal(util.changePitch(60, 'mi', 'do'), 56);
    assert.equal(util.changePitch(56, 'ti', 're'), 59);
    assert.equal(util.changePitch(62, 'do', 'mi'), 66);
    assert.equal(util.changePitch(65, 'do', 'fi'), 71);
    assert.equal(util.changePitch(65, 'do', 'sol'), 72);
  });
});