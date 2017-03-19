import { INTENTS } from './parse-alexa-input';
import createCurrentConditionsIntentHandler from './handlers/current-conditions';
import createWeekendConditionsIntentHandler from './handlers/handle-weekend-conditions';
import fetchSnowReport from './snow-report-fetcher';

const handlers = {
  [INTENTS.CURRENT_CONDITIONS_INTENT]: createCurrentConditionsIntentHandler({
    fetchSnowReport,
  }),
  [INTENTS.WEEKEND_CONDITIONS_INTENT]: createWeekendConditionsIntentHandler({
    fetchSnowReport,
  }),
};

module.exports = handlers;
