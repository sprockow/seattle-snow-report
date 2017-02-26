var assert = require('assert');
var fs = require('fs');
var SnowReportParser = require('../lib/snow-report-parser');
var chai = require('chai');
var moment = require('moment');

var assert = chai.assert;

var testLogger;
var fileContents;

before(function() {
    fileContents = fs.readFileSync('./test-data/snow-report-12-15.html', 'utf-8');
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
        assert.equal(output.alertMessage, undefined);
    });
    it('- snow accumulation', function() {
        assert.equal(output.snowAccumulation.overnightAmount, 2);
        assert.equal(output.snowAccumulation.snowFallOver24Hours, 4);
        assert.equal(output.snowAccumulation.snowFallOver48Hours, 6);
    });
    it('- observed conditions', function() {
        assert.equal(output.conditions.base.wind, 'Calm');
        assert.equal(output.conditions.base.visibility, 'Good');
        assert.equal(output.conditions.base.description, 'Overcast');
        assert.equal(output.conditions.base.temperature.farenheit, 18);

        assert.equal(output.conditions.top.wind, 'Calm');
        assert.equal(output.conditions.top.visibility, 'Good');
        assert.equal(output.conditions.top.description, 'Overcast');
        assert.equal(output.conditions.top.temperature.farenheit, 14);
    });

    it('- snow conditions', function() {
        assert.equal(output.groomedConditions.groomed, 'Machine Groomed');
        assert.equal(output.groomedConditions.nonGroomed, 'Packed Powder');
    });

    it('- description', function() {
        assert.property(output, 'description');
        assert.ok(/We had big smiles/.test(output.description), 'Contains first paragraph');
        assert.ok(/Early season conditions still exist/.test(output.description), 'Contains last paragraph');
    });
    it('- updated at string', function() {
        assert.property(output, 'lastUpdatedAt');
        var parsedDate = moment(output.lastUpdatedAt);
        assert.equal(parsedDate.month(), 11);
        assert.equal(parsedDate.date(), 15);
        assert.equal(parsedDate.year(), 2016);
        assert.equal(parsedDate.hour(), 13);
        assert.equal(parsedDate.minute(), 28);
    });
    it('- 6 forecasts', function() {
        assert.equal(output.forecasts.length, 6);
        assert.ok(output.forecasts.every((forecast) => {
            return forecast.day;
        }), 'each forecast has a day');
        output.forecasts.forEach((forecast, index) => {
            assert.property(forecast, 'day', `forecast ${index} does not contain a day property`);
            assert.property(forecast, 'summary', `forecast ${index} does not contain a summary property`);
            assert.property(forecast, 'description', `forecast ${index} does not contain a description property`);
            assert.property(forecast, 'isTentative', `forecast ${index} does not contain a isTentative property`);
            assert.deepProperty(forecast, 'temperature.farenheit', `forecast ${index} does not contain a valid temperature object`);

            if (forecast.description === '') {
                assert.equal(forecast.isTentative, true, 'isTentative should be true when no description available');
            } else {
                assert.equal(forecast.isTentative, false, 'isTentative should be false when description available');
            }
        })
    });

    it(' - accumulated snow depth', function() {
        assert.deepProperty(output, 'snowDepths.base');
        assert.equal(output.snowDepths.base, 47);
        assert.deepProperty(output, 'snowDepths.top');
        assert.equal(output.snowDepths.top, 57);
        assert.deepProperty(output, 'snowDepths.season');
        assert.equal(output.snowDepths.season, 120);
    });
});
