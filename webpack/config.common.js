const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const rootPath = path.resolve(__dirname, '../');
const distPath = rootPath + '/dist/';
const sourcePath = rootPath + '/src';
module.exports = {
  entry: {
    'index': [
      path.resolve(rootPath, 'src/index.js')]
  },
  output: {
    filename: '[hash].bundle.js',
    path: distPath,
    publicPath: '/static'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader", // translates CSS into CommonJS
          options: {
            sourceMap: true,
            modules: { // 必须启用css模块才能使用带hash的className
              localIdentName: '[path][name]__[local]' // 设置className格式
            }
          }
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'], //表示这几种文件的后缀名可以省略，按照从前到后的方式来进行补全
    alias: {
      utils: sourcePath + '/utils',
      config: sourcePath + '/config'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Application',
      template: path.resolve(rootPath, 'index.html')
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new CleanWebpackPlugin()
  ]
};