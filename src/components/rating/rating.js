// =============================================================================================================================
// - Virgo Component
// - Rating
// =============================================================================================================================
export default class Rating {

	// =========================================================================================================================
	// - Static Properties
	// =========================================================================================================================

	static isInitialized		= false;
	static defaultSelector 		= ``;
	static defaults				= {};
	static registry				= [];

	// =========================================================================================================================
	// - Object Properties
	// =========================================================================================================================

	id;								// instance id
	rating;							// value of rating from 0 to 1.0
	ratio;							// maximum value of rating
	step;							// smallest value increment
	element;						// DOM Element of the instance

	// Object computed properties ----------------------------------------------------------------------------------------------

	get value () {
		return this.rating / this.ratio;
	}

	// =========================================================================================================================
	// - Static Methods
	// =========================================================================================================================

	/**
	 * Create rating elements from page using selector
	 */
	static init (selector = null) {
		if(!this.isInitialized) {
			this.initDefaults();
		}
		let elements = document.querySelectorAll(selector ? selector : this.defaultSelector);
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			this.register(new this(i, element));
		}

	}

	static initDefaults () {
		this.defaultSelector 	= `[data-component="rating"]`;
		this.defaults.id		= `rating-`;
		this.defaults.rating	= 0;
		this.defaults.ratio		= 10;
		this.defaults.step		= 0.1;

		this.isInitialized 		= true;
	}

	static register (instance) {
		this.registry.push(instance);
	}

	// =========================================================================================================================
	// - Object Methods
	// =========================================================================================================================

	constructor (index, element, objectConfig = null) {

		const proto 	= this.constructor;
		const config	= objectConfig 	? objectConfig 	: element.dataset;

		if (!proto.isInitialized)		proto.initDefaults();

		this.id			= element.id	? element.id				: proto.defaults.id + index;
		this.rating 	= config.rating	? parseFloat(config.rating)	: proto.defaults.rating;
		this.ratio 		= config.ratio	? parseInt(config.ratio)	: proto.defaults.ratio;
		this.step 		= config.step	? parseFloat(config.step)	: proto.defaults.step;

		this.element 	= element;

		this.initRating();

	} // end of constructor method

	initRating () {
		this.element.innerHTML = "";
		for (let i = 1; i <= this.ratio; i++) {
			let button 	= document.createElement("button");
			let fill	= document.createElement("div");
			fill.classList.add("fill");
			button.appendChild(fill);
			this.element.appendChild(button);
			// Adjust fill width
			if (Math.floor(this.rating) >= i) {
				fill.style.width = `100%`;
			}
			else if (Math.ceil(this.rating) == i) {
				fill.style.width = `${ (Math.ceil(this.rating) - this.rating) * 100 }%`;
			}
		}
	}

} // end of class
