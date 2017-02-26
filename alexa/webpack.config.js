// webpack.config.js
var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './handler.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs',
    path: '.webpack',
    filename: 'handler.js', // this should match the first part of function handler in serverless.yml
  },
  module: {
   loaders: [{
     test: /\.js$/,
     loaders: ['babel'],
     exclude: /node_modules/,
   },
   {
     test: /\.json$/,
     loader: "json-loader",
     exclude: /node_modules/,
   }]
 }
};
