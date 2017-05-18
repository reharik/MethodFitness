const path = require('path');

const webpack = require('webpack');
const validate = require('webpack-validator');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer');
const precss = require('precss');
const postcssImport = require('postcss-import');

const webpackConfig = {
  context: path.resolve(__dirname, 'src'),

  entry: {
    app: [
      './css/index.css',
      './index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/',
    filename: 'redux-task-calendar.js',
    library: 'calendar',
    libraryTarget: 'umd'
  },

  externals: {
    "react":"react",
    "react-dom":"react-dom",
    "react-hot-loader":"react-hot-loader",
    "react-redux": "react-redux",
    "redux": "redux",
    "redux-logger": "redux-logger",
    "redux-thunk": "redux-thunk"
  },
  node: {
    cldr: "empty",
    fs: "empty"

  },
  module: {
    loaders: [
      { test: /\.jsx?$/, include: [ path.resolve(__dirname, 'src')], loader: 'babel'},
      {
        test: /\.css$/,
        include: [ path.resolve(__dirname, 'src/css') ],
        loader: ExtractTextPlugin.extract('style', 'css-loader?modules&importLoaders=1&localIdentName=redux__task__calendar__[local]!postcss-loader')
        // loader: 'style!css-loader?sourceMap=1&modules&importLoaders=1&localIdentName=[local]!postcss-loader'
      }
    ]
  },

  plugins: [
    //see possible syntax errors at the browser console instead of hmre overlay
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('redux-task-calendar.css', { allChunks: true})
  ],

  postcss() {
    return [
      precss,
      postcssImport({
        addDependencyTo: webpack
      }),
      autoprefixer
    ];
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

module.exports = validate(webpackConfig, {
  rules: {
    'no-root-files-node-modules-nameclash': true, //default
    'loader-enforce-include-or-exclude': false,
    'loader-prefer-include': true
  }
});
