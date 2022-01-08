// ================================================================================================
// - Virgo Component
// - Tagger
// ================================================================================================
export class Tagger {

	// [ Class static properties ] ================================================================
	static index;					// Stores all instances on the page

	// [ Object properties ] ======================================================================
	element;						// The instance DOM element
	id;								// String of id for the instance
	targetImage;					// DOM element of image to be tagged

	containerElement;				// DOM element of tag points container
	tagPoints;						// List of tag point DOM elements

	// [ Object computed properties ] =============================================================
	// --------------------------------------------------------------------------------------------
	// • Get the dimension of target image
	// --------------------------------------------------------------------------------------------
	get imageDimension () {
		return this.targetImage.getBoundingClientRect();
	}


	// [ Class static functions ] =================================================================
	// --------------------------------------------------------------------------------------------
	// • Initialize Component
	// --------------------------------------------------------------------------------------------
	static init () {
		// Static variable initial assignment
		this.index = [];
		// Get all corresponding elements to create instances of this class
		let taggers = document.querySelectorAll(".tagger");
		for (let i = 0; i < taggers.length; i++) {
			let tagger = taggers[i];
			this.index.push(new this(i, tagger));
		}

		// Listen to window resize event
		window.addEventListener("resize", () => {
			this.resizeListener();
		});
	}

	// --------------------------------------------------------------------------------------------
	// • Get tagger by id
	// --------------------------------------------------------------------------------------------
	static getById(id) {
		return this.index.find(tagger => tagger.id === id);
	}

	// --------------------------------------------------------------------------------------------
	// • Window resize event listener
	// --------------------------------------------------------------------------------------------
	static resizeListener () {
		for (const tagger of this.index) {
			tagger.repositionTags();
		}
	}

	// [ Object instance functions ] ==============================================================
	// --------------------------------------------------------------------------------------------
	// • Constructor
	// --------------------------------------------------------------------------------------------
	constructor(index, element) {
		// Element reference
		this.element = element;

		// Instance identifier
		this.id 			= this.element.id ? this.element.id : `tagger-${index}`;
		this.element.id 	= this.id;

		// Target image
		this.targetImage 	= this.element.querySelector(".image > img");

		// Initialize tag points
		this.initTagPoints();

	}

	// --------------------------------------------------------------------------------------------
	// • Create tag points
	// --------------------------------------------------------------------------------------------
	initTagPoints () {
		this.tagPoints = [];

		// Tag points container
		this.containerElement = document.createElement("div");
		this.containerElement.classList.add("tag-points");
		this.element.appendChild(this.containerElement);

		// Tag points
		let tagElements = this.element.querySelectorAll(".tags > .tag");
		for (let i = 0; i < tagElements.length; i++) {
			let tagElement	= tagElements[i];
			const label 	= tagElement.dataset["label"] 	? tagElement.dataset["label"] : "";
			const x 		= tagElement.dataset["x"] 		? parseFloat(tagElement.dataset["x"]) : 0;
			const y 		= tagElement.dataset["y"] 		? parseFloat(tagElement.dataset["y"]) : 0;

			let tagPoint	= new TagPoint(this, i, label, x, y);
			this.containerElement.appendChild(tagPoint.element);
			this.tagPoints.push(tagPoint);

			if (tagElement.dataset["click"]) {
				const contentElement = tagElement.querySelector("div") ? tagElement.querySelector("div") : null;
				tagPoint.element.addEventListener("click", () => {
					window[tagElement.dataset["click"]]({
						taggerId: this.id,
						index: i,
						content: contentElement
					});
				});
			}
		}


	}

	// --------------------------------------------------------------------------------------------
	// • Reposition tags
	// --------------------------------------------------------------------------------------------
	repositionTags () {
		for (const tagPoint of this.tagPoints) {
			tagPoint.setPosition();
		}
	}

}

export class TagPoint {

	// [ Object properties ] ======================================================================
	tagger;						// Tagger id
	element;					// Tag point element
	index;						// Tag point index
	label;						// Tag point label
	x;							// Tag point x position in ratio [0..1]
	y;							// Tag point y position in ratio [0..1]

	// [ Object instance functions ] ==============================================================
	// --------------------------------------------------------------------------------------------
	// • Constructor
	// --------------------------------------------------------------------------------------------
	constructor (tagger, index, label, x, y) {
		this.tagger		= tagger;
		this.index 		= index;
		this.label 		= label;
		this.x	 		= x;
		this.y 			= y;
		this.element 	= document.createElement("div");

		// Add attributes to element
		this.element.classList.add("tag-point");
		this.element.dataset["tagger"] 	= this.tagger.id;
		this.element.dataset["index"] 	= this.index;
		this.element.dataset["label"] 	= this.label;
		this.element.dataset["x"] 		= this.x;
		this.element.dataset["y"] 		= this.y;

		this.setPosition();
	}

	setPosition () {
		const xPos 					= (this.tagger.targetImage.clientWidth * this.x);
		const yPos 					= this.tagger.targetImage.clientHeight * this.y;
		this.element.style.left 	= xPos + "px";
		this.element.style.top		= yPos + "px";
	}

}

// Make this class globally available
if (window) window["Tagger"] = Tagger;
