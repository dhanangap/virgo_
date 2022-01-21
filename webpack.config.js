const path 		= require("path");
const webpack 	= require("webpack");

module.exports 	= {
	mode	 	: "production",
	entry		: {
		bundle		: "./src/bundle.ts",
		preloader 	: "./src/components/preloader/preloader.js"
	},
	module		: {
		rules 	: [
			{
				test	: /\.tsx?$/,
	        	use		: 'ts-loader',
	        	exclude	: /node_modules/
			}
		]
	},
	resolve		: {
		extensions	: ['.tsx', '.ts', '.js'],
	},
	devtool 	: false,
	plugins		: [
		new webpack.SourceMapDevToolPlugin({ filename: 'virgo.[name].min.js.map' })
	],
	output		: {
		filename	: "virgo.[name].min.js",
		path		: path.resolve(__dirname, "dist"),
		clean 		: true,
		library		: {
			name 	: "Virgo",
			type 	: "umd"
		}
	}
};
