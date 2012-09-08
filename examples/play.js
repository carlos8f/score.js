#!/usr/bin/env node
require('fs').createReadStream(process.argv[2], {encoding: 'utf8'})
  .pipe(require('../').render())
  .pipe(require('coremidi')())