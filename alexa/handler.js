/* eslint-disable import/prefer-default-export */

import Alexa from 'alexa-sdk';
import handlerMap from './lib/handler-router';

function seattleSnowReport(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlerMap);
  alexa.execute();
}

export { seattleSnowReport };
