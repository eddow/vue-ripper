var webpack = require("webpack"),
	path = require("path"),
	externals = require('webpack-node-externals'),
	VueLoader = require('vue-loader');

module.exports = {
	mode: 'development',	//This is meant to be bundled afterward anyway
	context: path.resolve(__dirname, 'src'),
	entry: {
		'vue-ripper': ['./index.ts'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "dist"),
		libraryTarget: 'uamd',
		library: 'vue-ripper',
		umdNamedDefine: true,
		libraryExport: 'default'
	},
	plugins: [
		new VueLoader.VueLoaderPlugin()
	],
	externals: [
		externals()
	],
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			loader: 'ts-loader',
			options: {
				appendTsSuffixTo: [/\.vue$/]
			}
		}, {
			enforce: 'pre',
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: "source-map-loader"
		}, {
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					ts: 'ts-loader'
				}
			}
		}]
	},
	resolve: {
		extensions: [".ts"]
	}
};