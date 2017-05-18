const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const validate = require('webpack-validator');

const autoprefixer = require('autoprefixer');
const precss = require('precss');
const postcssImport = require('postcss-import');

const webpackConfig = {
  context: path.resolve(__dirname, 'src'),

  devServer: {
    host: '0.0.0.0',
    port: '8080',

    contentBase: path.resolve(__dirname, './../example/index.tmpl.html'),
    historyApiFallback: true,

    hot: true,
    inline: true,

    // --progress - [assets, children, chunks, colors, errors, hash, timings, version, warnings]
    stats: {
      assets: true,
      children: true,
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true, //depends on {errors: true}
      hash: true,
      modules: false,
      publicPath: true,
      reasons: false,
      source: true, //what does this do?
      timings: true,
      version: true,
      warnings: true
    }
  },

  devtool: 'cheap-module-eval-source-map', //javascript sourcemaps

  entry: {
    redux_tabletable: [
      'react-hot-loader/patch',
      './../example/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, include: [ path.resolve(__dirname, 'src'), path.resolve(__dirname, 'example') ], loader: 'babel'},
      {
        test: /\.css$/,
        include: [ path.resolve(__dirname, 'src/css'), path.resolve(__dirname, 'example/css') ],
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[local]!postcss-loader')
        loader: 'style!css-loader?sourceMap=1&modules&importLoaders=1&localIdentName=redux__datatable__[local]!postcss-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './../example/index.tmpl.html',
      inject: true,
      hash: true,
      // cache: true,
      // chunks: ['app'],
      chunksSortMode: 'dependency',
      showErrors: true
    }),
    // Enable multi-pass compilation for enhanced performance
    // in larger projects. Good default.
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),
    //see possible syntax errors at the browser console instead of hmre overlay
    new webpack.NoErrorsPlugin()
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
