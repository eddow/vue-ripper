var webpack = require("webpack"),
	path = require("path"),
	externals = require('webpack-node-externals');

module.exports = {
	mode: 'development',	//This is meant to be bundled afterward anyway
	context: path.resolve(__dirname, 'src'),
	entry: {
		'vue-ripper': ['./index.ts'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "dist"),
		libraryTarget: 'umd',
		library: 'vue-ripper',
		umdNamedDefine: true
	},
	externals: [
		externals()
	],
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			loader: 'ts-loader'
		}, {
			enforce: 'pre',
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: "source-map-loader"
		}]
	},
	resolve: {
		extensions: [".ts"]
	}
};