const path = require('path');

const webpack = require('webpack');
const validate = require('webpack-validator');

const webpackConfig = {
  context: path.resolve(__dirname, 'src'),

  entry: {
    app: [
      './index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/',
    filename: 'freakin-react-forms.js',
    library: 'freakin-react-forms',
    libraryTarget: 'umd'
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react-hot-loader': 'react-hot-loader'
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, include: [ path.resolve(__dirname, 'src')], loader: 'babel'}
    ]
  },

  plugins: [
    //see possible syntax errors at the browser console instead of hmre overlay
    new webpack.NoErrorsPlugin()
  ],

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
