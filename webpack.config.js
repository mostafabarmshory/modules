const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const JSONMinifyPlugin = require('node-json-minify');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		basket: './src/basket.js',
		user: './src/user.js',
		'vw-studio-removeEmptyElement': './src/vw-studio-removeEmptyElement.js',
	},
	plugins: [
		new CleanWebpackPlugin(),
		//			new CopyWebpackPlugin([
		//		        {
		//		            /* i18n */
		//		            from: path.join(__dirname, 'src', '_locales'),
		//		            transform: function(content) {
		//		                // minify json
		//		                return JSONMinifyPlugin(content.toString());
		//		            },
		//		            to: path.join(__dirname, 'build', '_locales')
		//		        }
		//		    ])
	],
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