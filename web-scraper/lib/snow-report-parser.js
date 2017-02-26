var cheerio = require('cheerio');
var moment = require('moment');

function _parseConditions($, location, options) {
    var conditionDivs = $('h2:contains("Observed Conditions")').next().find(`h3:contains("${location}")`).siblings('.row_boxes-box-content');

    // if this doesn't exist it might be because a location is closed ( instead of 'top', search 'mid')
    if (conditionDivs.length < 1) {
        throw new Error(`No observered conditions for ${location}`);
    }

    var currentConditionRawString = conditionDivs.find('div:contains("Current Conditions")').text();
    var parsedConditionString = currentConditionRawString.split(':')[1].trim();

    var temperatureRawString = conditionDivs.find('div:contains("Temperature")').text();
    var parsedTemperatureString = temperatureRawString.split(':')[1].trim();
    var convertedTemperatureObject = parsedTemperatureString.split('/').reduce((memo, rawString) => {
        if (/°F/.test(rawString)) {
            var intString = rawString.replace(/°F/, '')
            var intValue = parseInt(rawString);
            return Object.assign({
                farenheit: intValue
            }, memo);
        } else if (/°C/.test(rawString)) {
            var intString = rawString.replace(/°C/, '')
            var intValue = parseInt(rawString);
            return Object.assign({
                celsius: intValue
            }, memo);
        }
        return memo;
    }, {});

    var windRawString = conditionDivs.find('div:contains("Wind")').text();
    var parsedWindString = windRawString.split(':')[1].trim();

    var visibilityString = conditionDivs.find('div:contains("Visibility")').text();
    var parsedVisibilityString = visibilityString.split(':')[1].trim();

    return {
        description: parsedConditionString,
        temperature: convertedTemperatureObject,
        wind: parsedWindString,
        visibility: parsedVisibilityString
    };
}

function parseForecast(forecastElement) {
    var $element = cheerio(forecastElement);
    var day = $element.find('h3').text();

    var isNight = /Night/.test(day);

    var summary = $element.find('.weather-icon').text().trim();
    var temperatureInFarenheit = $element.find('.weather-icon').next().find('span').eq(1).text();
    var farenheit = parseInt(temperatureInFarenheit);
    var description = $element.find('.page-report-forecast-summary').text().trim();

    var isTentative = description === '' ? true : false;

    const temperature = { farenheit };

    return {
        day,
        summary,
        description,
        isTentative,
        isNight,
        temperature
    };
}

function parseForecasts($, options) {
    var forecastDivs = $('.page-report-first-weather-records, .page-report-second-weather-records').find('.row_boxes-box');

    var forecastObjects = forecastDivs.toArray().map(parseForecast);

    return forecastObjects;
}

function parseSurfaceCondition($groomedConditionsContainer, type) {
    var groomedConditionsString =  $groomedConditionsContainer.find(`h3:contains("${type}")`).siblings('.row_boxes-box-content').find('p').text();

    return groomedConditionsString && groomedConditionsString.trim();
}

function parseSurfaceConditions($document, options) {
    var $groomedConditionsContainer = $document('h2:contains("Surface Conditions")').next();

    var groomedRunConditions = parseSurfaceCondition($groomedConditionsContainer, 'On Groomed Runs');
    var nonGroomedRunConditions = parseSurfaceCondition($groomedConditionsContainer, 'Off Groomed Runs');

    return {
        groomed: groomedRunConditions,
        nonGroomed: nonGroomedRunConditions
    }
}

function parseSnowDepth($snowDepthContainer, type) {
    var snowDepthDiv = $snowDepthContainer.find(`h3:contains("${type}")`).siblings('.row_boxes-box-content').find('.page-report-snowdepth-value');

    if (snowDepthDiv.length < 1) {
        throw new Error(`No new depth exists for location ${type}`);
    }

    var snowDepthString = snowDepthDiv.text().trim();
    var snowDepthValue = parseInt(snowDepthString.replace('″', ''));

    return snowDepthValue;
}

function parseSnowDepths($document, options) {

    var $snowDepthContainer = $document('h2:contains("Base Snow Depths")').next();

    var base = parseSnowDepth($snowDepthContainer, 'Base Snow Depth');
    var top;
    try {
        top = parseSnowDepth($snowDepthContainer, 'Top Snow Depth');
    } catch(error) {
        options.logger.warn('No snow depth exists for the top of the mountain, checking for mid mountain depth');

        try {
            top = parseSnowDepth($snowDepthContainer, 'Mid-Mountain Snow Depth');
        } catch(errorFromCatch) {
            throw new Error('No snow depth exists for either top or mid-mountain. Invalid document');
        }
    }
    var season = parseSnowDepth($snowDepthContainer, 'Season Snowfall');

    return {
        base: base,
        top: top,
        season: season
    };
}

function parseTemperature($temperatureContainer) {
    var amountString = $temperatureContainer.text();
    if (typeof amountString !== 'string') {
        return;
    }

    var parsedAmountString = amountString && amountString.replace('"', '');
    var parsedAmountValue = parseInt(parsedAmountString);

    return parsedAmountValue;
}

function parseUpdatedTime($document) {
    var updatedAtString = $document('.snow_and_weather-report-updated-block div').text();

    if (!updatedAtString) {
        throw new Error('No updated at string');
    }

    var parsedUpdatedAtString = updatedAtString.replace('Updated:', '').trim();

    var updateAtValue = moment(parsedUpdatedAtString, 'dddd, MMMM Do, YYYY hh:mm a').utcOffset(8);

    if (!updateAtValue.isValid()) {
        throw new Error(`Update at string is not valid ${parsedUpdatedAtString}`);
    }

    return updateAtValue.toISOString();
}

function parseVerboseDescription($document) {
    var descriptionText = $document('.snow_and_weather-report-updated-block').next().text();

    if (!descriptionText) {
        throw new Error('No description text available');
    }

    return descriptionText;
}

function parseAlertMessage($document, options) {
    var hasAlert = $document('#alert-bar-wrapper').length > 0;

    if (!hasAlert) {
        return;
    }

    var alertTitle = $document('.modal-title').text();

    if (!alertTitle) {
        options.logger.warn('alert wrapper exists, but no valid modal displayed');
        return;
    }

    var alertDescription = $document('.modal-body').text();

    if (!alertDescription) {
        options.logger.warn('alert wrapper exists, but no description found');
        return;
    }

    return {
        title: alertTitle.trim(),
        description: alertDescription.trim()
    };
}

function _parseDocument (htmlBody, options) {

    var $ = cheerio.load(htmlBody);

    var alertMessage = parseAlertMessage($, options);

    var lastUpdatedAt = parseUpdatedTime($, options);

    var description = parseVerboseDescription($, options);

    var $snowfallAmounts = $('.page-report-snowfall-value');

    var overnightAmount = parseTemperature($snowfallAmounts.eq(0), options);
    var snowFallOver24Hours = parseTemperature($snowfallAmounts.eq(1), options);
    var snowFallOver48Hours = parseTemperature($snowfallAmounts.eq(2), options);

    var baseConditions = _parseConditions($, 'Base', options);
    var topConditions;
    try {
        topConditions = _parseConditions($, 'Top', options);
    } catch(error) {
        options.logger.warn(error);
        topConditions = _parseConditions($, 'Mid', options);
    }

    var forecasts = parseForecasts($, options);


    var snowDepths;
    try {
        snowDepths = parseSnowDepths($, options);
    } catch(error) {
        options.logger.error(error);

        //wrap error and include stack trace
        throw new Error('Invalid document');
    }

    var groomedConditions = parseSurfaceConditions($, options);

    var output = {
        alertMessage,
        lastUpdatedAt,
        description,
        snowAccumulation: {
            overnightAmount: overnightAmount,
            snowFallOver24Hours: snowFallOver24Hours,
            snowFallOver48Hours: snowFallOver48Hours
        },
        conditions: {
            base: baseConditions,
            top: topConditions
        },
        forecasts: forecasts,
        snowDepths: snowDepths,
        groomedConditions: groomedConditions
    }

    return output;
}

var StevensPassReportParser = {
    parseDocument: function(htmlBody) {
        var logger = this.logger;

        if (!logger) {
            throw new Error('Parser must be provided a valid logger');
        }

        return _parseDocument(htmlBody, {
            logger: logger
        });
    }
};

module.exports = StevensPassReportParser;
