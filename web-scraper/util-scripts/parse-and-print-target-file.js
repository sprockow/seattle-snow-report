var fetchSnowReport = require('../lib/snow-report-fetcher');
var SnowReportParser = require('../lib/snow-report-parser');
var inspect = require('eyes').inspector();
var minimist = require('minimist');
var fs = require('fs');

var logger = Object.assign({}, {
    warn: function() {},
    error: console.error,
    log: function() {},
    info: function() {}
})

var snowReportParser = Object.create(SnowReportParser);
Object.assign(snowReportParser, {
    logger: logger
});


var args = minimist(process.argv.splice(2));

var fileContents = fs.readFileSync(args.path, 'utf-8');

var data = snowReportParser.parseDocument(fileContents);

console.log(JSON.stringify(data));
