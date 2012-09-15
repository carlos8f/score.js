var program = require('commander')
  .version(require('../package').version)
  .usage('<command>')

program
  .command('play <file|url|gist_id>')
  .description('play a score')
  .action(require('./play'))

program
  .command('export <file|url|gist_id> <outfile>')
  .description('export a score to standard MIDI file')
  .action(require('./export'))

program
  .command('*')
  .action(function () {
    program.outputHelp();
  })

program.parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
}