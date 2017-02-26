var parseAlexaInput = require('../lib/parse-alexa-input');

var chai = require('chai');
var assert = require('assert');
var fs = require('fs');

var assert = chai.assert;

describe.skip('parses current conditons intent request', function() {

    var alexaInput = JSON.parse(fs.readFileSync('./test-data/current-conditions-intent-request.json', 'utf-8'));

    var parsedInput = parseAlexaInput(alexaInput);

    it('outputs expected schema', function() {
      assert.typeOf(parsedInput, 'object');
      assert.typeOf(parsedInput.requestedIntent, 'string');
    });
    it('outputs expected intent', function() {
        assert.equal(parsedInput.requestedIntent, 'CurrentConditions');
    })
});

describe.skip('parses weekend conditons intent request', function() {

    var alexaInput = JSON.parse(fs.readFileSync('./test-data/weekend-conditions-intent-request.json', 'utf-8'));

    var parsedInput = parseAlexaInput(alexaInput);

    it('outputs expected schema', function() {
      assert.typeOf(parsedInput, 'object');
      assert.typeOf(parsedInput.requestedIntent, 'string');
    });
    it('outputs expected intent', function() {
        assert.equal(parsedInput.requestedIntent, 'WeekendConditions');
    })
});

describe('parses forecast intent request', function() {

    var alexaInput = JSON.parse(fs.readFileSync('./test-data/forecast-intent-request.json', 'utf-8'));

    var parsedInput = parseAlexaInput(alexaInput);

    it('outputs expected schema', function() {
      assert.typeOf(parsedInput, 'object');
        assert.typeOf(parsedInput.requestedIntent, 'string');
    });
    it('outputs expected intent', function() {
      assert.equal(parsedInput.requestedIntent, 'Forecast');
    })
});

describe('parses unknown intent request', function() {

    var alexaInput = {
      request: {
        intent: {
          name: 'UnknownIntent'
        }
      }
    };

    it('throws an exception', function() {
        chai.expect(function() {
          parseAlexaInput(alexaInput)
        }).to.throw('Unknown intent: UnknownIntent');
    });
});
