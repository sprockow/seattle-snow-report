var assert = require('assert');
var fs = require('fs');
var chai = require('chai');
var AWS = require('aws-sdk');

var assert = chai.assert;
var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-west-2'});

var fileContents;
before(function(done) {
    s3.getObject({
        Bucket: 'snow-report',
        Key: 'index.json'
    }, function(error, response) {
        if (error) {
            return done(error);
        }
        fileContents = response.Body.toString('utf-8');
        done();
    });
});

var output;
beforeEach(function() {
    output = JSON.parse(fileContents);
});

describe('parses expected values', function() {
    it('- snow accumulation', function() {
        assert.typeOf(output.snowAccumulation.overnightAmount, 'number');
        assert.typeOf(output.snowAccumulation.snowFallOver24Hours, 'number');
        assert.typeOf(output.snowAccumulation.snowFallOver48Hours, 'number');
    });
    it('- description', function() {
        assert.property(output, 'description');
        assert.typeOf(output.description, 'string');
        assert.isAtLeast(output.description.length, 20);
    });
    it('- snow conditions', function() {
        assert.deepProperty(output, 'groomedConditions.groomed');
        assert.deepProperty(output, 'groomedConditions.nonGroomed');
    });

    it('- observed conditions', function() {
        assert.deepProperty(output, 'conditions.base.wind');
        assert.deepProperty(output, 'conditions.base.visibility');
        assert.deepProperty(output, 'conditions.base.description');
        assert.deepProperty(output, 'conditions.base.temperature.farenheit');

        assert.deepProperty(output, 'conditions.top.wind');
        assert.deepProperty(output, 'conditions.top.visibility');
        assert.deepProperty(output, 'conditions.top.description');
        assert.deepProperty(output, 'conditions.top.temperature.farenheit');
    });

    it(' - 6 forecasts', function() {
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
        assert.typeOf(output.snowDepths.base, 'number');
        assert.isAtLeast(output.snowDepths.base, 1);
        assert.deepProperty(output, 'snowDepths.top');
        assert.typeOf(output.snowDepths.top, 'number');
        assert.isAtLeast(output.snowDepths.top, 1);
        assert.deepProperty(output, 'snowDepths.season');
        assert.typeOf(output.snowDepths.season, 'number');
        assert.isAtLeast(output.snowDepths.season, 1);
    });
});
