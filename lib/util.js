var symbols = exports.symbols = {
  do: { alter: 0, degree: 1 },
  di: { alter: 1, degree: 1 },
  ra: { alter: -1, degree: 2 },
  re: { alter: 0, degree: 2 },
  ri: { alter: 1, degree: 2 },
  me: { alter: -1, degree: 3 },
  mi: { alter: 0, degree: 3 },
  fa: { alter: 0, degree: 4 },
  fi: { alter: 1, degree: 4 },
  se: { alter: -1, degree: 5 },
  sol: { alter: 0, degree: 5 },
  si: { alter: 1, degree: 5 },
  le: { alter: -1, degree: 6 },
  la: { alter: 0, degree: 6 },
  li: { alter: 1, degree: 6 },
  te: { alter: -1, degree: 7 },
  ti: { alter: 0, degree: 7 }
};

// Given starting symbol, go up to a symbol, and return
// the total pitch difference.
function moveUp (currentSymbol, targetSymbol) {
  if (typeof currentSymbol === 'string') {
    currentSymbol = symbols[currentSymbol];
  }
  if (typeof targetSymbol === 'string') {
    targetSymbol = symbols[targetSymbol];
  }
  var pitch = -currentSymbol.alter
    , degree = currentSymbol.degree
    , scale = [1, 2, 2, 1, 2, 2, 2]

  while (degree !== targetSymbol.degree) {
    degree++;
    if (degree > scale.length) {
      degree = 1;
    }
    pitch += scale[degree - 1];
  }
  return pitch + targetSymbol.alter;
}
exports.moveUp = moveUp;

// Given starting symbol, go down to a symbol, and return
// the total pitch difference.
function moveDown (currentSymbol, targetSymbol) {
  if (typeof currentSymbol === 'string') {
    currentSymbol = symbols[currentSymbol];
  }
  if (typeof targetSymbol === 'string') {
    targetSymbol = symbols[targetSymbol];
  }
  var pitch = currentSymbol.alter
    , degree = currentSymbol.degree
    , scale = [2, 2, 1, 2, 2, 2, 1]

  while (degree !== targetSymbol.degree) {
    degree--;
    if (degree < 1) {
      degree = scale.length;
    }
    pitch += scale[degree - 1];
  }
  return pitch - targetSymbol.alter;
}
exports.moveDown = moveDown;

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
  var pitchDiff = currentPitch - symbols[currentSymbol].pitch
    , degreeDiff = symbols[currentSymbol].degree
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
