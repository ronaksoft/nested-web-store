var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLess = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var config = {
  externals: nodeModules,
  target: 'node',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app', 'app/redux'],
  },

  entry: './src/server.tsx',

  output: {
    path: path.resolve('./build/public'),
    filename: '../server.js',
    publicPath: '/public/',
    libraryTarget: 'commonjs2'
  },

  module: {
    loaders: [{
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.less$/,
        include: path.resolve('./src'),
        use: extractLess.extract({
          use: [{
              loader: "css-loader", options: {
                sourceMap: true,
              }
          }, {
              loader: "less-loader", options: {
                sourceMap: true,
                strictMath: true,
                noIeCompat: true,
                paths: [
                    path.resolve(__dirname, "node_modules")
                ]
              }
          }],
        })
      }
    ]
  },

  plugins: [
    extractLess,
    new webpack.LoaderOptionsPlugin({
      debug: false,
    })
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
};

const copySync = (src, dest, overwrite) => {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
}

const createIfDoesntExist = dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
}

createIfDoesntExist('./build');
createIfDoesntExist('./build/public');
copySync('./src/favicon.ico', './build/public/favicon.ico', true);

module.exports = config;
