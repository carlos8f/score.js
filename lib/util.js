var symbols = {
  de: { pitch: -1, degree: 1 },
  do: { pitch: 0, degree: 1 },
  di: { pitch: 1, degree: 1 },
  ra: { pitch: 1, degree: 2 },
  re: { pitch: 2, degree: 2 },
  ri: { pitch: 3, degree: 2 },
  me: { pitch: 3, degree: 3 },
  mi: { pitch: 4, degree: 3 },
  fa: { pitch: 5, degree: 4 },
  fi: { pitch: 6, degree: 4 },
  se: { pitch: 6, degree: 5 },
  sol: { pitch: 7, degree: 5 },
  so: { pitch: 7, degree: 5 },
  si: { pitch: 8, degree: 5 },
  le: { pitch: 8, degree: 6 },
  la: { pitch: 9, degree: 6 },
  li: { pitch: 10, degree: 6 },
  te: { pitch: 10, degree: 7 },
  ti: { pitch: 11, degree: 7 }
};

function changePitch (currentPitch, currentSymbol, toSymbol) {
  var doPitch = findDo(currentPitch, currentSymbol);
  var interval = getInterval(currentSymbol, toSymbol);

  if (interval >= 5) {
    // We're going down
    return doPitch - invertPitch(symbols[toSymbol].pitch);
  }
  else {
    // We're going up 
    return doPitch + symbols[toSymbol].pitch;
  }
}
exports.changePitch = changePitch;

function findDo (currentPitch, currentSymbol) {
  var diff = currentPitch - symbols[currentSymbol].pitch;
  return symbols[currentSymbol].degree >= 5 ? 12 + diff : diff;
}
exports.findDo = findDo;

function invertInterval (interval) {
  return 9 - interval;
}
exports.invertInterval = invertInterval;

function invertPitch (pitch) {
  return 12 - pitch;
}
exports.invertPitch = invertPitch;

function getInterval (fromSymbol, toSymbol) {
  var fromDegree = symbols[fromSymbol].degree
    , toDegree = symbols[toSymbol].degree

  if (toDegree < fromDegree) {
    toDegree += 7;
  }
  return toDegree - fromDegree + 1;
}
exports.getInterval = getInterval;
