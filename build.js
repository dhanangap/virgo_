const fs = require("fs");
const sass = require("sass");
const postcss = require("postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

const config = {

	sourceDir: "./src",
	outputDir: "./dist",

	components: [
		"preloader"
	]

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
		if (fs.existsSync(styleInput)) {
			const css = sass.renderSync({ file: styleInput });
			postcss([cssnano, autoprefixer]).process(css.css.toString()).then(result => {
				fs.writeFileSync(styleOutput, result.css);
			})
		}

	})

}

catch (e) {
	console.log(e);
}
