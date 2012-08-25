var util = require('../lib/util')
  , assert = require('assert')

describe('util', function () {
  it('should getInterval correctly', function () {
    assert.equal(util.getInterval('do', 'do'), 1);
    assert.equal(util.getInterval('do', 'de'), 1);
    assert.equal(util.getInterval('do', 'ra'), 2);
    assert.equal(util.getInterval('do', 're'), 2);
    assert.equal(util.getInterval('do', 'mi'), 3);
    assert.equal(util.getInterval('do', 'fi'), 4);
    assert.equal(util.getInterval('do', 'sol'), 5);
    assert.equal(util.getInterval('do', 'si'), 5);
    assert.equal(util.getInterval('do', 'la'), 6);
    assert.equal(util.getInterval('do', 'le'), 6);
    assert.equal(util.getInterval('do', 'ti'), 7);
    assert.equal(util.getInterval('do', 'te'), 7);
    assert.equal(util.getInterval('re', 'fa'), 3);
    assert.equal(util.getInterval('fa', 're'), 6);
    assert.equal(util.getInterval('la', 'te'), 2);
    assert.equal(util.getInterval('la', 'do'), 3);
    assert.equal(util.getInterval('sol', 'mi'), 6);
    assert.equal(util.getInterval('sol', 'do'), 4);
    assert.equal(util.getInterval('re', 'fi'), 3);
    assert.equal(util.getInterval('se', 'te'), 3);
  });

  it('should findDo correctly', function () {
    assert.equal(util.findDo(60, 'do'), 60);
    assert.equal(util.findDo(60, 're'), 58);
    assert.equal(util.findDo(60, 'mi'), 56);
    assert.equal(util.findDo(60, 'fa'), 55);
    assert.equal(util.findDo(60, 'sol'), 65);
    assert.equal(util.findDo(60, 'la'), 63);
    assert.equal(util.findDo(60, 'ti'), 61);
    assert.equal(util.findDo(44, 'do'), 44);
    assert.equal(util.findDo(44, 're'), 42);
    assert.equal(util.findDo(44, 'mi'), 40);
    assert.equal(util.findDo(44, 'fa'), 39);
    assert.equal(util.findDo(44, 'sol'), 49);
    assert.equal(util.findDo(44, 'la'), 47);
    assert.equal(util.findDo(44, 'ti'), 45);
  });

  it('should invertInterval correctly', function () {
    assert.equal(util.invertInterval(1), 8);
    assert.equal(util.invertInterval(2), 7);
    assert.equal(util.invertInterval(3), 6);
    assert.equal(util.invertInterval(4), 5);
    assert.equal(util.invertInterval(5), 4);
    assert.equal(util.invertInterval(6), 3);
    assert.equal(util.invertInterval(7), 2);
    assert.equal(util.invertInterval(8), 1);
  });

  it('should invertPitch correctly', function () {
    assert.equal(util.invertPitch(0), 12);
    assert.equal(util.invertPitch(1), 11);
    assert.equal(util.invertPitch(2), 10);
    assert.equal(util.invertPitch(3), 9);
    assert.equal(util.invertPitch(4), 8);
    assert.equal(util.invertPitch(5), 7);
    assert.equal(util.invertPitch(6), 6);
    assert.equal(util.invertPitch(7), 5);
    assert.equal(util.invertPitch(8), 4);
    assert.equal(util.invertPitch(9), 3);
    assert.equal(util.invertPitch(10), 2);
    assert.equal(util.invertPitch(11), 1);
    assert.equal(util.invertPitch(12), 0);
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
    assert.equal(util.changePitch(65, 'do', 'sol'), 60);
    assert.equal(util.changePitch(70, 'do', 'fi'), 76);
    assert.equal(util.changePitch(55, 'ti', 'do'), 56);
    assert.equal(util.changePitch(55, 'te', 'do'), 57);
    assert.equal(util.changePitch(55, 'la', 'do'), 58);
    assert.equal(util.changePitch(55, 'le', 'do'), 59);
    assert.equal(util.changePitch(55, 'sol', 'do'), 60);
    assert.equal(util.changePitch(55, 'se', 'do'), 61);
    assert.equal(util.changePitch(55, 'le', 're'), 52);
    assert.equal(util.changePitch(55, 'le', 'fa'), 61);
    assert.equal(util.changePitch(55, 'la', 're'), 62);
    assert.equal(util.changePitch(55, 'sol', 're'), 50);
  });
});