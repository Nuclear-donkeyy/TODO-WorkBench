const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/renderer/index.tsx', // React入口文件
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
    clean: false, // 不清理dist目录，保留其他文件
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      process: require.resolve('process/browser.js'),
      Buffer: require.resolve('buffer'),
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify'),
      events: require.resolve('events/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.renderer.json',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'styles.css',
          to: 'styles.css',
          noErrorOnMissing: true, // 如果文件不存在也不报错
        },
      ],
    }),
  ],
  devtool: 'source-map',
};
