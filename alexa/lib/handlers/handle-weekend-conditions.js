
function _createForecastSummary(snowReport, day) {
  const matchedForecast = snowReport.forecasts.find((forecast) => {
    return forecast.day === day;
  });

  if (!matchedForecast) {
    return '';
  }

  if (matchedForecast.isTentative) {
    return `Saturday will tentatively be ${matchedForecast.summary}.`;
  }

  return `On Saturday: ${matchedForecast.description}.`;
}

function _handleWeekendConditionsIntent(snowReport) {
  const saturdayForecast = _createForecastSummary(snowReport, 'saturday');
  const sundayForecast = _createForecastSummary(snowReport, 'sunday');

  if (!saturdayForecast && !sundayForecast) {
    return 'Next weekend\'s forecast is not available yet';
  }

  return `${saturdayForecast} ${sundayForecast}`;
}


export default function createWeekendConditionsIntentHandler({ fetchSnowReport }) {
  return function handleWeekendIntent() {
    fetchSnowReport((err, snowReport) => {
      if (err) {
        this.emit(':tell', 'Sorry, unable to fetch snow report');
        return;
      }
      const stringResponse = _handleWeekendConditionsIntent(snowReport);
      this.emit(':tell', stringResponse);
    });
  };
}
