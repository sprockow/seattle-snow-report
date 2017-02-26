'use strict';

import handlerMap from './lib/handler-router';
import Alexa from 'alexa-sdk';

module.exports.stevensSnowReport = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlerMap);
  alexa.execute();
};
