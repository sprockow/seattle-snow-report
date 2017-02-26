
const INTENTS = {
  CURRENT_CONDITIONS_INTENT: 'CurrentConditions',
  FORECAST_INTENT: 'Forecast',
  WEEKEND_CONDITIONS_INTENT: 'WeekendConditions',
};

function parseAlexaInput(input) {
  if (typeof input !== 'object') {
    throw new Error('Alexa input must be an object');
  }

  let requestedIntent;

  try {
    requestedIntent = input.request.intent.name;
    if (typeof requestedIntent !== 'string');
  } catch (error) {
    throw new Error('input.request.intent.name must be a string');
  }

  const matchedIntent = Object.keys(INTENTS).find(key => requestedIntent === INTENTS[key]);

  if (!matchedIntent) {
    throw new Error(`Unknown intent: ${requestedIntent}`);
  }

  return {
    requestedIntent,
  };
}

module.exports = parseAlexaInput;
module.exports.INTENTS = INTENTS;
