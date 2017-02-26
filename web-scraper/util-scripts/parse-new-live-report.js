var fetchSnowReport = require('../lib/snow-report-fetcher');
var SnowReportParser = require('../lib/snow-report-parser');
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
        return console.error(error);
    }

    var data = snowReportParser.parseDocument(body);

    inspect(data);
});
