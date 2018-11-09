var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: './src/scripts/index.js',
  output: {
      path: path.resolve('./static/webpack_bundles/'),
      filename: "[name].scripts.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$|\.css$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  mode: 'development',
  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new ExtractTextPlugin({
      filename: '[name].styles.css',
      allChunks: true
    }),
  ]
}