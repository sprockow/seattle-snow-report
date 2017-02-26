import { INTENTS } from './parse-alexa-input';
import createCurrentConditionsIntentHandler from './handlers/current-conditions';
import fetchSnowReport from './snow-report-fetcher';

const handlers = {};

handlers[INTENTS.CURRENT_CONDITIONS_INTENT] = createCurrentConditionsIntentHandler({
  fetchSnowReport,
});

module.exports = handlers;
