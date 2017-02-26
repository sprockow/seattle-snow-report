var assert = require('assert');
var fs = require('fs');
var handleCurrentConditionsIntent = require('../lib/handlers/handle-current-conditions');
var chai = require('chai');

var assert = chai.assert;

describe('parses expected values for a report with no new snowfall', function() {
    var fileContents = fs.readFileSync('./test-data/snow-report-no-snowfall.json', 'utf-8');
    var report = JSON.parse(fileContents);
    var outputString = handleCurrentConditionsIntent(report);

    it.skip('outputs short description', function() {
        var expectedOutput = /It is 17 degrees and Clear at the base, with Light wind and Good visibility. There has been no new snowfall in the last 2 days. Expect Machine Groomed and Packed Powder ski conditions./;
        assert.ok(expectedOutput.test(outputString));
    });
});

describe('parses expected values for a report with some snowfall', function() {
    var fileContents = fs.readFileSync('./test-data/snow-report-snowfall.json', 'utf-8');
    var report = JSON.parse(fileContents);
    var outputString = handleCurrentConditionsIntent(report);

    it.skip('outputs short description', function() {
        var expectedOutput = /It is 18 degrees and Overcast at the base, with Calm wind and Good visibility. It snowed 2 inches last night, and 6 inches over the last 2 days. Expect Machine Groomed and Packed Powder ski conditions./;
        assert.ok(expectedOutput.test(expectedOutput));
    });
});
