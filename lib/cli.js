const program = require('commander');
const mainAction = require('./action');

function cli() {
  program
  //.arguments('')
  .description('Validate YAML listing blocks in Asciidoc files')
  .option('--pass', 'Always succeed regardless of any validation failures')
  .option('--stdin', 'Read file list from stdin instead of _topic_map.yml')
  .option('--topic <path>', 'Optional: Path to ascii_binder _topic_map.yml file')
  .action(mainAction);

  program.parseAsync(process.argv);
}

module.exports = cli;
