/*eslint-disable*/

const fs = require('fs');
const chai = require('chai');
const assert = chai.assert;

const SnowReportSkill = require('../SnowReportSkill');
const parseSnowReport = require('../lib/parse-alexa-input');
const formatAlexaOutput = require('../lib/alexa-output-utility');
const INTENTS = require('../lib/parse-alexa-input').INTENTS;

let successfulSnowReportFetcher;
let unsuccessfulSnowReportFetcher;
let currentConditionsIntentParser;

beforeEach(() => {
  currentConditionsIntentParser = function () {
    return {
      requestedIntent: INTENTS.CURRENT_CONDITIONS_INTENT,
    };
  };

  successfulSnowReportFetcher = (function () {
    const snowReport = fs.readFileSync('./test-data/snow-report-snowfall.json', 'utf-8');

    return function (callback) {
      callback(null, snowReport);
    };
  }());

  unsuccessfulSnowReportFetcher = (function () {
    const snowReport = fs.readFileSync('./test-data/snow-report-snowfall.json', 'utf-8');

    return function (callback) {
      callback(null, snowReport);
    };
  }());
});


describe.skip('given a current condition request intent and an expected snow report', (done) => {
  let skill;
  beforeEach(() => {
    skill = Object.assign({}, SnowReportSkill,
      {
        fetchSnowReport: successfulSnowReportFetcher,
        parseAlexaInput: currentConditionsIntentParser,
        formatAlexaOutput,
      });
  });

  it('outputs short description', () => {
    skill.respondToUserRequest({}, (error, output) => {
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
