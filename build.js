// =============================================================================================================================
// * Virgo Style Library
// -----------------------------------------------------------------------------------------------------------------------------
// - Build Script
// =============================================================================================================================

// -----------------------------------------------------------------------------------------------------------------------------
// - Import Dependencies
// -----------------------------------------------------------------------------------------------------------------------------
const fs 			= require("fs");
const sass 			= require("sass");
const postcss 		= require("postcss");
const cssnano 		= require("cssnano");
const autoprefixer 	= require("autoprefixer");
const uglify 		= require("uglify-js");

const config = {

	sourceDir: "./src",
	outputDir: "./dist",

	styles: [
		// "utilities",
		"bundle",
	],

};

try {

	config.styles.forEach(style => {
		const styleInput = config.sourceDir + "/" + style + ".scss";
		const styleOutput = config.outputDir + "/" + style + ".min.css";
		console.log(`Compiling: ${styleInput}`);
		if (fs.existsSync(styleInput)) {
			const css = sass.renderSync({ file: styleInput });
			postcss([cssnano, autoprefixer]).process(css.css.toString(), { from: undefined }).then(result => {
				fs.writeFileSync(styleOutput, result.css);
			})
		}
	});

}

catch (e) {
	console.log(e);
}
