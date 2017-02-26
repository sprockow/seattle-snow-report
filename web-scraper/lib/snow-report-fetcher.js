var request = require('request');

const snowReportUrl = 'https://www.stevenspass.com/site/mountain/reports/snow-and-weather-report/@@snow-and-weather-report';

function fetchSnowReport(callback) {
    request(snowReportUrl, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return callback(error || new Error(response.statusCode));
      }

    callback(null, body);
    });
}

module.exports = fetchSnowReport;
