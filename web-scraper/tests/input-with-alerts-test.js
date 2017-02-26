var assert = require('assert');
var fs = require('fs');
var SnowReportParser = require('../lib/snow-report-parser');
var chai = require('chai');
var moment = require('moment');

var assert = chai.assert;

var testLogger;
var fileContents;

before(function() {
    fileContents = fs.readFileSync('./test-data/snow-report-high-wind-advisory.html', 'utf-8');
    testLogger = Object.assign({}, {
        error: console.error,
        log: function() {},
        warn: function() {},
        info: function() {}
    });
});

var output;
beforeEach(function() {
    var snowReportParser = Object.create(SnowReportParser);
    Object.assign(snowReportParser, {
        logger: testLogger
    });

    output = snowReportParser.parseDocument(fileContents);
});

describe('parses expected values', function() {
    it('- alerts', function() {
        assert.deepProperty(output, 'alertMessage.title');
        assert.equal(output.alertMessage.title, 'Windy Day Update!');
        assert.deepProperty(output, 'alertMessage.description');
        assert.ok(/High winds/.test(output.alertMessage.description), 'contains high winds');
    });
    it('- snow accumulation', function() {
        assert.deepProperty(output, 'snowAccumulation.overnightAmount');
        assert.deepProperty(output, 'snowAccumulation.snowFallOver24Hours');
        assert.deepProperty(output, 'snowAccumulation.snowFallOver48Hours');
    });
    it('- snow conditions', function() {
        assert.deepProperty(output, 'groomedConditions.groomed');
        assert.deepProperty(output, 'groomedConditions.nonGroomed');
    });
    it('- description', function() {
        assert.property(output, 'description');
    });
    it('- updated at string', function() {
        assert.property(output, 'lastUpdatedAt');
    });
    it('- 6 forecasts', function() {
        assert.equal(output.forecasts.length, 6);
    });

    it(' - accumulated snow depth', function() {
        assert.deepProperty(output, 'snowDepths.base');
        assert.deepProperty(output, 'snowDepths.top');
        assert.deepProperty(output, 'snowDepths.season');
    });
});
