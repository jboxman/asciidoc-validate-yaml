const program = require('commander');
const mainAction = require('./action');

async function cli() {
  program
  .description('Validate YAML listing blocks in Asciidoc files')
  .option('-a, --attributes [attributes...]', 'Optional: Attributes such as product-version=1')
  .option('--pass', 'Always succeed regardless of any validation failures', false)
  .option('--stdin', 'Read file list from stdin instead of _topic_map.yml', false)
  .option('--topic <path>', 'Optional: Path to ascii_binder _topic_map.yml file')
  .action(mainAction);

  if(process.argv.length <= 2) {
    program.outputHelp();
    process.exitCode = 1;
  }
  else {
    await program.parseAsync(process.argv);
  }
}

module.exports = cli;
