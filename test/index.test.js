const fsPath = require('path');
const promisfy = require('util').promisify;
const exec = promisfy(require('child_process').exec);

const { describe } = require('riteway');

const { parseAttributes, pairAttributes } = require('../lib');

const fixturesDir = fsPath.join(__dirname, 'fixtures');
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
  let stderr ;
  let exitcode;

  [error, stdout, stderr, exitcode] = [undefined, '', '', 0];
  try {
    ({ error, stdout, stderr } = await exec(`echo ${fixturesDir}/invalid.adoc | ${bin} --stdin`));
  }
  catch(err) {
    ({ error, stdout, stderr, code: exitcode } = err);
  }

  assert({
    given: 'AsciiDoc with invalid YAML on stdin',
    should: 'exit with a non-zero status code',
    actual: exitcode,
    expected: 1
  });

  [error, stdout, stderr, exitcode] = [undefined, '', '', 0];
  try {
    ({ error, stdout, stderr } = await exec(`echo ${fixturesDir}//valid.adoc | ${bin} --stdin`));
  }
  catch(err) {
    ({ error, stdout, stderr, code: exitcode } = err);
  }

  assert({
    given: 'AsciiDoc with valid YAML on stdin',
    should: 'report success',
    actual: /OK/.test(stdout.trim()),
    expected: true
  });

  [error, stdout, stderr, exitcode] = [undefined, '', '', 0];
  try {
    ({ error, stdout, stderr } = await exec(`echo ${fixturesDir}/invalid.adoc | ${bin} --stdin --pass`));
  }
  catch(err) {
    ({ error, stdout, stderr, code: exitcode } = err);
  }

  assert({
    given: 'AsciiDoc with invalid YAML on stdin and --pass option',
    should: 'not return a non-zero exit status code',
    actual: /OK/.test(stdout.trim()),
    expected: false
  });

  [error, stdout, stderr, exitcode] = [undefined, '', '', 0];
  try {
    ({ error, stdout, stderr } = await exec(`echo ${fixturesDir}/attributes.adoc | ${bin} --stdin -a invalid`));
  }
  catch(err) {
    ({ error, stdout, stderr, code: exitcode } = err);
  }

  assert({
    given: 'AsciiDoc with invalid conditional YAML on stdin',
    should: 'exit with a non-zero status code',
    actual: exitcode,
    expected: 1
  });

  const ml = `${fixturesDir}/invalid.adoc
  ${fixturesDir}/invalid.adoc`;

  [error, stdout, stderr, exitcode] = [undefined, '', '', 0];
  try {
    ({ error, stdout, stderr } = await exec(`echo "${ml}" | ${bin} --stdin`));
  }
  catch(err) {
    ({ error, stdout, stderr, code: exitcode } = err);
  }

  assert({
    given: 'multiple AsciiDoc files on stdin',
    should: 'report success for each file',
    actual: (stdout.trim().split(/\n/).filter(v => /Scanning/.test(v))).length,
    expected: 2
  });

});
