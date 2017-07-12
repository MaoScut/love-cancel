var { resolve } = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './app/index.jsx'
    // the entry point of our app
  ],
	output: {
		path: resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	devtool: 'inline-source-map',
	devServer: {
		historyApiFallback: true,
		inline: true,
		hot: true,
	},

	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			enforce: "pre",
			loader: "babel-loader",
			include: /node_modules/,
		},
		{
			test: /\.(js|jsx)$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
		}, 
		{
			test: /\.scss$/,
			use: ["style-loader", "css-loader", "sass-loader"],
			exclude: /node_modules/,

		}]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
	],
	resolve: {
		extensions: ['.js', 'jsx']
	},
}