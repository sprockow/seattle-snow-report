const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export default function fetchSnowReport(callback) {
  s3.getObject({
    Bucket: 'snow-report',
    Key: 'index.json',
  }, (error, response) => {
    let snowReport;

    if (error) {
      return callback(error);
    }

    try {
      snowReport = JSON.parse(response.Body);
    } catch (parseError) {
            // TODO wrap error
      return callback(parseError);
    }

    if (error) {
      return callback(error);
    }

    return callback(null, snowReport);
  });
}
