/*eslint-disable*/

const parseAlexaInput = require('../lib/parse-alexa-input');

const chai = require('chai');
var assert = require('assert');
const fs = require('fs');

var assert = chai.assert;

describe.skip('parses current conditons intent request', () => {
  const alexaInput = JSON.parse(fs.readFileSync('./test-data/current-conditions-intent-request.json', 'utf-8'));

  const parsedInput = parseAlexaInput(alexaInput);

  it('outputs expected schema', () => {
    assert.typeOf(parsedInput, 'object');
    assert.typeOf(parsedInput.requestedIntent, 'string');
  });
  it('outputs expected intent', () => {
    assert.equal(parsedInput.requestedIntent, 'CurrentConditions');
  });
});

describe.skip('parses weekend conditons intent request', () => {
  const alexaInput = JSON.parse(fs.readFileSync('./test-data/weekend-conditions-intent-request.json', 'utf-8'));

  const parsedInput = parseAlexaInput(alexaInput);

  it('outputs expected schema', () => {
    assert.typeOf(parsedInput, 'object');
    assert.typeOf(parsedInput.requestedIntent, 'string');
  });
  it('outputs expected intent', () => {
    assert.equal(parsedInput.requestedIntent, 'WeekendConditions');
  });
});

describe('parses forecast intent request', () => {
  const alexaInput = JSON.parse(fs.readFileSync('./test-data/forecast-intent-request.json', 'utf-8'));

  const parsedInput = parseAlexaInput(alexaInput);

  it('outputs expected schema', () => {
    assert.typeOf(parsedInput, 'object');
    assert.typeOf(parsedInput.requestedIntent, 'string');
  });
  it('outputs expected intent', () => {
    assert.equal(parsedInput.requestedIntent, 'Forecast');
  });
});

describe('parses unknown intent request', () => {
  const alexaInput = {
    request: {
      intent: {
        name: 'UnknownIntent',
      },
    },
  };

  it('throws an exception', () => {
    chai.expect(() => {
      parseAlexaInput(alexaInput);
    }).to.throw('Unknown intent: UnknownIntent');
  });
});
