const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React
    './app/index.jsx',
    // the entry point of our app
  ],
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
    {
      test: /\.jpg/,
      use: ['url-loader'],
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
