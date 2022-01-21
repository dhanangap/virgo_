const path 		= require("path");
const webpack 	= require("webpack");

module.exports 	= {
	mode	 	: "production",
	entry		: {
		bundle		: "./src/bundle.js",
		preloader 	: "./src/components/preloader/preloader.js"
	},
	devtool 	: false,
	plugins		: [
		new webpack.SourceMapDevToolPlugin({ filename: 'virgo.[name].min.js.map' })
	],
	output		: {
		filename	: "virgo.[name].min.js",
		path		: path.resolve(__dirname, "dist"),
		clean 		: true
	}
};
