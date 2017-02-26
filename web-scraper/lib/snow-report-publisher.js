'use strict';

var AWS = require('aws-sdk');
var moment = require('moment');

var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-west-2'});

function publishSnowReport(snowReport, callback) {

    var dateString = snowReport.lastUpdatedAt;
    var momentObj = moment(dateString);

    var s3Path = momentObj.format('YYYY/MM/DD/hh:mm a');

    s3.putObject({
        Bucket: 'snow-report',
        Key: `${s3Path}.json`,
        ContentType: 'application/json',
        CacheControl: 'max-age=31536000',
        Body: JSON.stringify(snowReport)
    }, function(error) {
        if (error) {
            return callback(error);
        }

        s3.copyObject({
            Bucket: 'snow-report',
            CopySource:  `snow-report/${s3Path}.json`,
            Key: 'index.json',
            ContentType: 'application/json',
            CacheControl: 'no-cache'
        }, function(error) {

            callback(error);
        });
    });
}

module.exports = publishSnowReport;
