const fsPath = require('path');
const promisfy = require('util').promisify;
const exec = promisfy(require('child_process').exec);

const { describe } = require('riteway');

const { parseAttributes, pairAttributes } = require('../lib');

const pkg = require(fsPath.join(__dirname, '..', 'package.json'));
const bin = pkg['bin']['asciidoc-validate-yaml'];

describe('#parseAttributes', async assert => {
  assert({
    given: 'an attribute pair',
    should: 'split into key and value',
    actual: parseAttributes(['key1=value1'])['key1'],
    expected: 'value1'
  });

  assert({
    given: 'an attribute pair with empty value',
    should: 'split into key and empty string value',
    actual: parseAttributes(['key1='])['key1'],
    expected: ''
  });

  assert({
    given: 'an attribute only',
    should: 'split into key and empty string value',
    actual: parseAttributes(['key1'])['key1'],
    expected: ''
  });

  assert({
    given: 'invalid arguments',
    should: 'ignore every invalid argument',
    actual: Object.keys(parseAttributes(['%', '^key', '^abc=123', ''])).length,
    expected: 0
  });
});

describe('#pairAttributes', async assert => {
  assert({
    given: 'an attribute pair',
    should: 'concat into string',
    actual: pairAttributes({ key: 'value' }),
    expected: 'Attributes: key=value'
  });
});

describe('CLI childprocess', async assert => {
  let error;
  let stdout;
  let stderr;
  let exitcode;

  try {
    ({ error, stdout, stderr } = await exec(`echo ./test/fixtures/invalid.adoc | ${bin} --stdin`));
  }
  catch(err) {
    ({ error, stdout, stderr, code: exitcode } = err);
  }

  assert({
    given: 'AsciiDoc with invalid YAML',
    should: 'exit with a non-zero status code',
    actual: exitcode,
    expected: 1
  });

  try {
    ({ error, stdout, stderr } = await exec(`echo ./test/fixtures/valid.adoc | ${bin} --stdin`));
  }
  catch(err) {
    ({ error, stdout, stderr, code: exitcode } = err);
  }

  assert({
    given: 'AsciiDoc with valid YAML',
    should: 'report success',
    actual: /OK/.test(stdout.trim()),
    expected: true
  });

});
