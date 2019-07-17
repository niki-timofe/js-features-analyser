/* eslint-env jest */
const pluginTester = require('babel-plugin-tester');
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const rimraf = require('rimraf');

const plugin = require('../src');

const tests = globby.sync("**/code.js", {
  cwd: __dirname
}).map(test => {
  const outputDestination = path.join(__dirname, test.replace('code.js', 'features.json'));
  const expectedOutput = path.join(__dirname, test.replace('code.js', 'expected.json'))
  return {
    title: test.match(/.*\/(.*)\/code.js/)[1],
    fixture: test,
    pluginOptions: {
      outputDestination: outputDestination
    },
    setup() {
      rimraf.sync(outputDestination);
      return function teardown() {
        const data = JSON.parse(fs.readFileSync(outputDestination, 'utf-8'));
        const expected = JSON.parse(fs.readFileSync(expectedOutput, 'utf-8'));
        try {
          expect(data).toEqual(expected);
        } finally {
          rimraf.sync(outputDestination);
        }
      }
    }
  }
})
pluginTester({
  babelOptions: {
    parserOpts: {},
    generatorOpts: {
      compact: false
    },
  },
  plugin,
  filename: __filename,
  tests
})