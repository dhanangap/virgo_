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

	components: [
		"accordion",
		"carousel",
		"gallery",
		"modal",
		"nav",
		"navbar",
		"preloader",
		"rating",
		"slider",
		"stack",
		"tagger",
	],

	styles: [
		"base",
		"layout",
		"components",
		"utilities",
		"bundle",
	],

};

try {

	const componentsOutDir = config.outputDir + "/components";
	if (!fs.existsSync(componentsOutDir)) fs.mkdirSync(componentsOutDir);

	config.components.forEach(component => {
		const outDir = componentsOutDir + "/" + component;

		if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

		// Compile style
		const styleInput = config.sourceDir + "/components/" + component + "/" + component + ".scss";
		const styleOutput = outDir + "/" + component + ".min.css";
		console.log(`Compiling: ${styleInput}`);
		if (fs.existsSync(styleInput)) {
			const css = sass.renderSync({ file: styleInput });
			postcss([cssnano, autoprefixer]).process(css.css.toString()).then(result => {
				fs.writeFileSync(styleOutput, result.css);
			})
		}

		// Compile scripts
		const jsInput = config.sourceDir + "/components/" + component + "/" + component + ".js";
		const jsOutput = outDir + "/" + component + ".min.js";
		console.log(`Compiling: ${jsInput}`);
		if (fs.existsSync(jsInput)) {
			const js = fs.readFileSync(jsInput, "utf8");
			fs.writeFileSync(jsOutput, uglify.minify(js).code);
		}

	});

	config.styles.forEach(style => {
		const styleInput = config.sourceDir + "/" + style + ".scss";
		const styleOutput = config.outputDir + "/" + style + ".min.css";
		console.log(`Compiling: ${styleInput}`);
		if (fs.existsSync(styleInput)) {
			const css = sass.renderSync({ file: styleInput });
			postcss([cssnano, autoprefixer]).process(css.css.toString()).then(result => {
				fs.writeFileSync(styleOutput, result.css);
			})
		}
	});

}

catch (e) {
	console.log(e);
}
