var fs = require('fs');
var inspect = require('eyes').inspector();
var minimist = require('minimist');
var SnowReportParser = require('../lib/snow-report-parser');

var args = minimist(process.argv.splice(2));

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

var fileContents = fs.readFileSync(args.path, 'utf-8');

var output = snowReportParser.parseDocument(fileContents);
inspect(output);
