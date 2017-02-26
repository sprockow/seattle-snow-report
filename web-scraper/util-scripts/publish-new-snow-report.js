var SnowReportParser = require('../lib/snow-report-parser');
var fetchSnowReport = require('../lib/snow-report-fetcher');
var publishSnowReport = require('../lib/snow-report-publisher');
var inspect = require('eyes').inspector();

var logger = Object.assign({}, {
    warn: function() {},
    error: function() {},
    log: function() {},
    info: function() {}
})

var snowReportParser = Object.create(SnowReportParser);
Object.assign(snowReportParser, {
    logger: logger
});


fetchSnowReport((error, body) => {
  if (error) {
      return callback(error);
  }

  var snowReport = snowReportParser.parseDocument(body);

  publishSnowReport(snowReport, (error) => {
      if (error) {
          console.error(error);
          process.exit(-1);
          return;
      }
      inspect(snowReport);
  });

});
