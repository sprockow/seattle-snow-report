'use strict';

var AWS = require('aws-sdk');
var moment = require('moment');

var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-west-2'});

function archiveSnowReport(htmlBody, fetchedAt, callback) {
    var momentObj = moment(fetchedAt);

    var s3Path = momentObj.utc(8).format('YYYY/MM/DD/hh:mm a');

    s3.putObject({
        Bucket: 'snow-report',
        Key: `original-reports/${s3Path}.html`,
        ContentType: 'application/json',
        CacheControl: 'max-age=31536000',
        Body: htmlBody
    }, function(error) {
        if (error) {
            return callback(error);
        }

        s3.copyObject({
            Bucket: 'snow-report',
            CopySource:  `snow-report/original-reports/${s3Path}.html`,
            Key: 'latest-fetched-report.html',
            ContentType: 'application/json',
            CacheControl: 'no-cache'
        }, function(error) {

            callback(error);
        });
    });
}

module.exports = archiveSnowReport;
