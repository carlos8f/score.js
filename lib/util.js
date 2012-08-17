var pitches = {
  de: -1,
  do: 0,
  di: 1,
  ra: 1,
  re: 2,
  ri: 3,
  me: 3,
  mi: 4,
  fa: 5,
  fi: 6,
  se: 6,
  sol: 7,
  so: 7,
  si: 8,
  le: 8,
  la: 9,
  li: 10,
  te: 10,
  ti: 11
};

var degrees = {
  de: 1,
  do: 1,
  di: 1,
  ra: 2,
  re: 2,
  ri: 2,
  me: 3,
  mi: 3,
  fa: 4,
  fi: 4,
  se: 5,
  sol: 5,
  so: 5,
  si: 5,
  le: 6,
  la: 6,
  li: 6,
  te: 7,
  ti: 7
};

function changePitch (currentPitch, currentSymbol, newSymbol) {
  var interval = getInterval(currentSymbol, newSymbol)
    , doPitch = findDo(currentPitch, currentSymbol)

  return doPitch + pitches[newSymbol];
}
exports.changePitch = changePitch;

function findDo (currentPitch, currentSymbol) {
  var diff = currentPitch - pitches[currentSymbol];
  return degrees[currentSymbol] > 4 ? 12 + diff : diff;
}

function getInterval (fromSymbol, toSymbol) {
  var fromDegree = degrees[fromSymbol]
    , toDegree = degrees[toSymbol]

  if (toDegree < fromDegree) {
    toDegree += 7;
  }
  return toDegree - fromDegree + 1;
}
exports.getInterval = getInterval;
