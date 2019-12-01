const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
		entry: {
			basket: './src/basket.js',
			user: './src/user.js'
		},
		plugins: [new CleanWebpackPlugin()],
		output: {
			filename: '[name].min.js',
			path: path.resolve(__dirname, 'dist'),
		},
		module: {
			rules: [{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}]
		}
};