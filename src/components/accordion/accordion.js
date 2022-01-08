// =============================================================================================================================
// - Virgo Component
// - Accordion
// =============================================================================================================================
/** Class representating a Accordion Component */
export default class Accordion {

	// =========================================================================================================================
	// - Static Properties
	// =========================================================================================================================

	static isInitialized		= false;
	static defaultSelector 		= ``;
	static defaults				= {};
	static registry				= [];

	// Static computed properties ----------------------------------------------------------------------------------------------

	static get totalInstances () {
		return this.registry.length;
	}

	// =========================================================================================================================
	// - Object Properties
	// =========================================================================================================================

	id;

	transition;
	duration;
	easing;

	element;
	#toggleElement;
	#contentElement;

	#contentHeight;
	#contentPadding;
	#contentDisplay;

	/**
	 * Set instance state
	 */
	set state (state) {
		this.element.dataset["state"] = state;
	}

	/**
	 * Get instance state
	 */
	get state () {
		return this.element.dataset["state"];
	}

	// =========================================================================================================================
	// - Static Methods
	// =========================================================================================================================

	static init (selector = null, config = null) {
		// Initialize default value of class properties
		this.initDefaults();
		// Create class instance from matched elements in the document
		for (let element of document.querySelectorAll(selector ? selector : this.defaultSelector)) {
			this.register(new this(this.totalInstances, element, config));
		}
		// Mark this class as initialized
		this.isInitialized = true;
	}

	static initDefaults () {
		this.defaultSelector 		= `[data-component="accordion"]`;
		this.defaults.id			= `accordion-`;
		this.defaults.layout		= `list`;
		this.defaults.transition	= `slide`;
		this.defaults.duration		= 300;
		this.defaults.easing		= `ease-out`;
		this.defaults.state			= `collapsed`;
	}

	static register (instance) {
		this.registry.push(instance);
	}

	// =========================================================================================================================
	// - Object Methods
	// =========================================================================================================================

	/**
	 * Create a Stack
	 * @param {number} index - Index of instance
	 * @param {HTMLElement} element - Instance DOM Element
	 * @param {object} objectConfig - Instance configuration object
	 */
	constructor (index, element, objectConfig = null) {


		const proto 		= this.constructor;
		const config 		= objectConfig 			? objectConfig 					: element.dataset;

		this.element		= element;

		this.id 			= element.id 			? element.id 					: proto.defaults.id + proto.totalInstances;
		this.transition		= config["transition"] 	? config["transition"]			: proto.defaults.transition;
		this.duration		= config["duration"] 	? config["duration"]			: proto.defaults.duration;
		this.easing			= config["easing"] 		? config["easing"]				: proto.defaults.easing;

		this.element.id		= this.id;

		this.#toggleElement		= element.querySelector(".toggle");
		this.#contentElement	= element.querySelector(".content");

		this.#contentHeight 	= this.#contentElement.getBoundingClientRect().height;
		this.#contentPadding	= this.#contentElement.style.padding;
		this.#contentDisplay	= this.#contentElement.style.display;

		this.collapse();

		this.#toggleElement.addEventListener("click", () => {
			this.toggle();
		});

	} // end of constructor method

	collapse () {
		this.state = `collapsed`;

		// Slide transition
		if (this.transition === `slide`) {
			this.#contentElement.animate([
				{ height: this.#contentHeight + "px", padding: this.#contentPadding },
				{ height: 0, padding: 0 },
			], {
				duration: this.duration,
				easing	: this.easing
			});
			setTimeout(() => {
				this.#contentElement.style.height = 0;
				this.#contentElement.style.padding = 0;
				this.#contentElement.style.display = `none`;
			}, this.duration);
		}
		// No transition
		else {
			this.#contentElement.style.height = 0;
			this.#contentElement.style.padding = 0;
			this.#contentElement.style.display = `none`;
		}
	}

	open () {
		this.state = `open`;

		// Slide transition
		if (this.transition === `slide`) {
			this.#contentElement.style.display = this.#contentDisplay;
			this.#contentElement.animate([
				{ height: 0, padding: 0 },
				{ height: this.#contentHeight + "px", padding: this.#contentPadding },
			], {
				duration: this.duration,
				easing	: this.easing
			});
			setTimeout(() => {
				this.#contentElement.style.height = this.#contentHeight + "px";
				this.#contentElement.style.padding = this.#contentPadding;
			}, this.duration);
		}
		// No transition
		else {
			this.#contentElement.style.height = this.#contentHeight + "px";
			this.#contentElement.style.padding = this.#contentPadding;
			this.#contentElement.style.display = this.#contentDisplay;
		}
	}

	toggle () {
		if (this.state === `collapsed`) {
			this.open();
		} else {
			this.collapse();
		}
	}

}

// Make this class globally available
if (window) window["Accordion"] = Accordion;
