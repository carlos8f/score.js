require('fs').createReadStream('66.6.txt', {encoding: 'utf8'})
  .pipe(require('../').render())
  .pipe(require('coremidi')())