const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const validate = require('webpack-validator');

const autoprefixer = require('autoprefixer');
const combineLoaders = require('webpack-combine-loaders');

const webpackConfig = {
  context: path.resolve(__dirname, 'src'),

  devServer: {
    host: '0.0.0.0',
    port: '8080',

    contentBase: path.resolve(__dirname, './index.tmpl.html'),
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

  devtool: 'source-map', //javascript sourcemaps

  entry: {
    app: ['babel-polyfill',
      './index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [
          path.resolve(__dirname, 'src')
        ],
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/css')
        ],
        loader: combineLoaders([
          {
            loader: 'style'
          },
          {
            loader: 'css',
            query: {
              modules: true,
              sourceMap: true,
               localIdentName: '[local]',
              importLoaders: true
            }
          },
          {
            loader: 'postcss'
          }
        ])
      },
      // {
      //   test: /\.css$/,
      //   include: [path.resolve(__dirname, 'src/css')],
      //   loader: 'style!css-loader?sourceMap=1&modules&importLoaders=1&localIdentName=[local]!postcss-loader'
      // },
      {
        test: /\.json$/, include: [path.resolve(__dirname), 'src'],
        loader: "json-loader"
      },
      {
        test: /\.png$/, include: [path.resolve(__dirname, 'src/css/images')],
        loader: "url-loader", query: {mimetype: "image/png"}
      },
      {
        test: /\.jpg$/, include: [path.resolve(__dirname, 'src/css/images')],
        loader: "url-loader", query: {mimetype: "image/jpg"}
      },
      {
        test: /\.gif$/, include: [path.resolve(__dirname, 'src/css/images')],
        loader: "url-loader", query: {mimetype: "image/gif"}
      }
      //         { test   : /\.jsx?$/, exclude: /[\\\/]node_modules[\\\/](?!react-redux-grid)/, loader : 'babel-loader' },
      //         { test: /\.css$/, loader: 'style-loader!css-loader' },
      //         { test: /\.css$/, loader: 'style-loader!css-loader!css-loader' },
      //         { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      //         // { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
      //         { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      //         { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      //         { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loaders: ['url-loader?limit=10000&mimetype=application/font-woff' ] },
      //         { test: /\.styl$/, exclude: /[\\\/]node_modules[\\\/](?!react-redux-grid)/, loaders: ['style-loader', 'css-loader', 'stylus-loader'] }

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.tmpl.html',
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

  postcss: (webpack) => {
    return [
      require('postcss-import')({
        addDependencyTo: webpack,
        path: [ 'css' ],
        root: path.resolve(__dirname, '/'),
        skipDuplicates: true
      }),
      require('postcss-cssnext')()
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
