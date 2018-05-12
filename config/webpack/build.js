var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var CopyAssetsPlugin = require('./copy-asset-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLess = new ExtractTextPlugin({
  filename: "public/css/[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});


var config = {
  bail: true,

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app', 'app/redux'],
  },

  entry: {
    app: './src/client.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-helmet',
      'react-redux',
      'react-router-redux',
      'redux',
      'redux-connect',
      'redux-thunk'
    ]
  },

  output: {
    path: path.resolve('./build/'),
    publicPath: '/',
    filename: 'public/js/[name].[chunkhash].js'
  },

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.tsx?$/,
      loader: 'tslint-loader'
    },
      {
        test: /\.tsx?$/,
        loader: ['babel-loader?plugins=react-hot-loader/babel', 'awesome-typescript-loader']
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve('./src/app'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader?modules&importLoaders=10&localIdentName=public/css/[local]___[hash:base64:5]',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        exclude: path.resolve('./src/app'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader',
          ]
        })
      },
      {
        test: /\.less$/,
        include: path.resolve('./src/app'),
        use: extractLess.extract({
          use: [{
              loader: "css-loader", options: {
                sourceMap: true,
                minimize: true,
              },
          }, {
              loader: "less-loader", options: {
                sourceMap: true,
                strictMath: true,
                noIeCompat: true,
                minimize: true,
                paths: [
                    path.resolve(__dirname, "node_modules")
                ]
              }
          }],
        })
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file-loader?name=public/fonts/[hash].[ext]'
      },
      {
        test: /\.(woff|woff2)(\?.*)?$/,
        loader: 'file-loader?name=public/fonts/[hash].[ext]'
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=public/fonts/[hash].[ext]'
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=public/fonts/[hash].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
      }
    ]
  },

  plugins: [
    extractLess,
    new WebpackCleanupPlugin(),
    new CopyAssetsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('public/css/[name].[hash].css'),
    new ManifestPlugin({
      fileName: './public/manifest.json'
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      }
    }),
  ]
};

module.exports = config;
