var fetchSnowReport = require('../lib/snow-report-fetcher');
var archiveSnowReport = require('../lib/original-report-archiver');
var inspect = require('eyes').inspector();


fetchSnowReport((error, body) => {
  if (error) {
      return callback(error);
  }

  var fetchedTime = new Date();

  archiveSnowReport(body, fetchedTime, (error) => {
      if (error) {
          console.error(error);
          process.exit(-1);
          return;
      }
      inspect(body);
  });

});
