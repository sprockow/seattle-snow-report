'use strict';

var SnowReportParser = require('./lib/snow-report-parser');
var fetchSnowReport = require('./lib/snow-report-fetcher');
var publishSnowReport = require('./lib/snow-report-publisher');
var archiveSnowReport = require('./lib/original-report-archiver');

var logger = Object.assign({}, {
    warn: console.log,
    error: console.error,
    log: console.log,
    info: console.info
});
var snowReportParser = Object.create(SnowReportParser);
Object.assign(snowReportParser, {
    logger: logger
});

module.exports.scraper = function(event, context, callback) {

    var startTime = (new Date()).getTime();

    fetchSnowReport((error, body) => {
      if (error) {
          var fetchError = new Error(`Failed to fetch Stevens Snow Report page. ${error.message}`);
          fetchError.stack = fetchError.stack.concat(error.stack);
          return callback(fetchError);
      }
      console.log('fetched snow report', (new Date()).getTime() - startTime);

      archiveSnowReport(body, new Date(), function(error) {
          // we don't need to fail on this
          if (error) {
              // TODO output known error message
            console.error(error);
          }
      });

      var snowReport;
      try {
        snowReport = snowReportParser.parseDocument(body);
      } catch (parseError) {
        // TODO wrap error and output single error with known error message (PARSE_ERROR)
        return callback(parseError);
      }

      console.log('parsed snow report', (new Date()).getTime() - startTime);

      publishSnowReport(snowReport, (error) => {
          if (error) {
              var wrappedError = new Error(`Failed to publish snow-report. ${error.message}`);
              wrappedError.stack = wrappedError.stack.concat(error.stack);
              return callback(wrappedError);
          }

          console.log('published snow report', (new Date()).getTime() - startTime);
          callback(error, snowReport);
      });

    });
};
