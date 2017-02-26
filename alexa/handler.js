import Alexa from 'alexa-sdk';
import handlerMap from './lib/handler-router';

export default function stevensSnowReport(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlerMap);
  alexa.execute();
}
