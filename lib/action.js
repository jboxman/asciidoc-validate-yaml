const fs = require('fs').promises;
const fsPath = require('path');
const asciidoctor = require(`asciidoctor`)();
const yaml = require('js-yaml');
const entities = require('ent');
const striptags = require('striptags');

const { walkTopics, readStream } = require('.');

const asciidocOptions = {
  doctype: 'article',
  safe: 'unsafe',
  sourcemap: true
}

const memoryLogger = asciidoctor.MemoryLogger.create();
asciidoctor.LoggerManager.setLogger(memoryLogger);

const onlyLang = lang => node => node.getAttribute('language') == lang;

async function main(options = {}, cmd = {}) {
  let data;
  const useStdin = options.stdin ? true : false;
  const topicPath = options.topic ? options.topic : fsPath.join(process.cwd(), '_topic_map.yml');

  if(useStdin) {
    data = await readStream(process.stdin);
    if(!data) {
      console.log('No input on stdin');
      process.exit(0);
    }
    process.exit(0);
  }
  else {
    try {
      data = await fs.readFile(topicPath, { encoding: 'utf8' } );
    }
    catch(err) {
      if(err.code == 'ENOENT') {
        console.error(`Cannot open ${topicPath}`);
      }
      console.log(err.message);
      process.exit(1);
    }
  }

  const sections = data.split(/---\n/).slice(1);
  const buckets = sections.map(section => yaml.load(section));

  for(const bucket of buckets) {
    let doc;
    if(bucket['Dir'] == 'rest_api') continue;
    const paths = walkTopics(bucket);

    for(const { path, title } of paths) {
      const inputPath = fsPath.join(fsPath.dirname(topicPath), `${path}.adoc`);
      console.log(`Scanning ${inputPath}`);

      try {
        doc = asciidoctor.loadFile(inputPath, { ...asciidocOptions, base_dir: fsPath.dirname(inputPath) });
      }
      catch(e) {
        console.error(e.message);
      }
      doc.convert();

      const blocks = doc.findBy({ context: 'listing' }, onlyLang('yaml'));

      if(blocks.length > 0) {
        for(const block of blocks.sort((a, b) => a.parent.getLineNumber() > b.parent.getLineNumber())) {
          const { dir, file, path, lineno } = block.parent.source_location;
          const transforms = [
            // Remove ...
            s => s.replace(/\.\.\.\.?/g, ''),
            // Remove (1) style callouts
            s => s.replace(/[ ]*\([\d\.]+\)[ ]*/g, ''),
            // Remove <img> and <b> callouts
            s => striptags(s, { disallowedTags: new Set(['img', 'b']), encodePlaintextTagDelimiters: false })
          ];
          const yamlBlock = transforms.reduce((yblock, fn) => fn(yblock), block.getContent());
          let o = {};

          // Handle multi-YAML document blocks
          const yamls = yamlBlock.split(/^---$/m);

          for(const partial of yamls) {
            if(!partial) continue;
            try {
              o = yaml.load(entities.decode(partial));
              console.log(`${path} [${lineno}]: OK`);
            }
            catch(e) {
              console.log(`${path} [${lineno}]: Invalid`);
              console.log(`${e.name} ${e.message}`);
            }  
          }

        }
      }
    }
  }
}

module.exports = main;
