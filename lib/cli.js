const program = require('commander');
const mainAction = require('./action');

function cli() {
  program
  //.arguments('')
  .description('Validate YAML listing blocks in Asciidoc files')
  .option('--topic <path>', 'Optional: Path to _topic_map.yml file')
  .action(mainAction);

  program.parse(process.argv);
}

module.exports = cli;
