/*eslint-disable*/

var assert = require('assert');
const fs = require('fs');
const handleCurrentConditionsIntent = require('../lib/handlers/handle-current-conditions');
const chai = require('chai');

var assert = chai.assert;

describe('parses expected values for a report with no new snowfall', () => {
  const fileContents = fs.readFileSync('./test-data/snow-report-no-snowfall.json', 'utf-8');
  const report = JSON.parse(fileContents);
  const outputString = handleCurrentConditionsIntent(report);

  it.skip('outputs short description', () => {
    const expectedOutput = /It is 17 degrees and Clear at the base, with Light wind and Good visibility. There has been no new snowfall in the last 2 days. Expect Machine Groomed and Packed Powder ski conditions./;
    assert.ok(expectedOutput.test(outputString));
  });
});

describe('parses expected values for a report with some snowfall', () => {
  const fileContents = fs.readFileSync('./test-data/snow-report-snowfall.json', 'utf-8');
  const report = JSON.parse(fileContents);
  const outputString = handleCurrentConditionsIntent(report);

  it.skip('outputs short description', () => {
    const expectedOutput = /It is 18 degrees and Overcast at the base, with Calm wind and Good visibility. It snowed 2 inches last night, and 6 inches over the last 2 days. Expect Machine Groomed and Packed Powder ski conditions./;
    assert.ok(expectedOutput.test(expectedOutput));
  });
});
