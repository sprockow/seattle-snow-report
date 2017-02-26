var fs = require('fs');
var chai = require('chai');
var assert = chai.assert;

var SnowReportSkill = require('../SnowReportSkill');
var parseSnowReport = require('../lib/parse-alexa-input');
var formatAlexaOutput = require('../lib/alexa-output-utility');
var INTENTS = require('../lib/parse-alexa-input').INTENTS;

var successfulSnowReportFetcher;
var unsuccessfulSnowReportFetcher;
var currentConditionsIntentParser;

beforeEach(function() {

  currentConditionsIntentParser = function() {
    return {
      requestedIntent: INTENTS.CURRENT_CONDITIONS_INTENT
    }
  };

  successfulSnowReportFetcher = (function() {
    var snowReport = fs.readFileSync('./test-data/snow-report-snowfall.json', 'utf-8');

    return function(callback) {
      callback(null, snowReport);
    };
  }());

  unsuccessfulSnowReportFetcher = (function() {
    var snowReport = fs.readFileSync('./test-data/snow-report-snowfall.json', 'utf-8');

    return function(callback) {
      callback(null, snowReport);
    };
  }());
});


describe.skip('given a current condition request intent and an expected snow report', function(done) {
    var skill;
    beforeEach(function() {
        skill = Object.assign({}, SnowReportSkill,
          {
            fetchSnowReport: successfulSnowReportFetcher,
            parseAlexaInput: currentConditionsIntentParser,
            formatAlexaOutput: formatAlexaOutput
          });
    });

    it('outputs short description', function() {

       skill.respondToUserRequest({}, function(error, output) {
         console.log(error);
         console.log(output);

        assert.notOk(output);
          assert.ok(output);
          assert.property('reponse.outputSpeech.text', output);
          assert.typeOf(output.reponse.outputSpeech.text, 'string');

          done();
        });

    });
});
