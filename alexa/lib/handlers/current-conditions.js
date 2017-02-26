function _transformInchMeasurement(inchValue) {
    if (inchValue === 1) {
        return `${inchValue} inch`;
    }
    return `${inchValue} inches`;
}

function _transformSnowAccumulation(snowReport) {
    var snowAccumulation = snowReport.snowAccumulation;

    if (snowAccumulation.snowFallOver48Hours < 1) {
        return `There has been no new snowfall in the last 2 days.`;
    }

    return `It snowed ${_transformInchMeasurement(snowAccumulation.overnightAmount)} last night, and ${_transformInchMeasurement(snowAccumulation.snowFallOver48Hours)} over the last 2 days.`;
}

function _transformGroomConditions(snowReport) {
  const {groomed, nonGroomed} = snowReport.groomedConditions;

  return `Expect ${groomed} and ${nonGroomed} ski conditions.`
}

function _transformBaseConditions(snowReport, options) {
    const baseConditions = snowReport.conditions.base;

    const {description, temperature, wind, visibility} = baseConditions;

    return `It is ${temperature.farenheit} degrees and ${description} at the base, with ${windAdjective} wind and ${visibilityAdjective} visibility.`;
}

function _transformTopConditions(snowReport, options) {
    var baseConditions = snowReport.conditions.base;

    var description = baseConditions.description;
    var temperature = baseConditions.temperature.farenheit;
    var windAdjective = baseConditions.wind;
    var visibilityAdjective = baseConditions.visibility;

    return `It is ${temperature} degrees and ${description} up top, with ${windAdjective} wind and ${visibilityAdjective} visibility.`;
}

function _handleCurrentConditionsIntent(snowReport, options) {
    return `${_transformBaseConditions(snowReport)} ${_transformSnowAccumulation(snowReport)} ${_transformGroomConditions(snowReport)}`
}

export default function createCurrentConditionsIntentHandler({fetchSnowReport, logger}) {

  return function () {
    fetchSnowReport((err, snowReport) => {
      if (err) {
        this.emit(':tell', 'Unable to fetch snow report');
        return;
      }
      const stringResponse = _handleCurrentConditionsIntent(snowReport);
      this.emit(':tell', stringResponse);
    });
  }
}
