const path 		= require("path");

module.exports 	= {
	mode	 	: "production",
	entry		: "./src/virgo.js",
	output		: {
		filename	: "virgo.js",
		path		: path.resolve(__dirname, "dist"),
	},
};
