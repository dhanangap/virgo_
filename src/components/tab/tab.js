// =============================================================================================================================
// - Virgo Component
// - Tab
// =============================================================================================================================
/** Class representating a Tab Component */
export class Tab {

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
	activeIndex;

	transition;
	duration;
	easing;

	pages;

	element;
	#navElement;
	#pagesElement;

	// Object computed properties ----------------------------------------------------------------------------------------------

	/**
	 * Set instance active page index
	 */
	set activeIndex (index) {
		this.element.dataset["active"] = index;
	}

	/**
	 * Get instance active page index
	 */
	get activeIndex () {
		return parseInt(this.element.dataset["active"]);
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
		this.defaultSelector 		= `[data-component="stack"]`;
		this.defaults.id			= `stack-`;
		this.defaults.transition	= `fade`;
		this.defaults.duration		= 300;
		this.defaults.easing		= `ease-out`;
		this.defaults.activeIndex	= 0;
	}

	static register (instance) {
		this.registry.push(instance);
	}

	// =========================================================================================================================
	// - Object Methods
	// =========================================================================================================================

	/**
	 * Create a Tab
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
		this.activeIndex	= config["active"] 		? config["active"]				: proto.defaults.activeIndex;

		this.element.id		= this.id;

		this.configure();

	} // end of constructor method

	/**
	 * Configure pages, navigation, and external navigation
	 */
	configure () {
		this.initPages();
		this.initNav();
		this.initExternalNav();
	}

	/**
	 * Initialize pages
	 */
	initPages () {}

	/**
	 * Initialize navigation
	 */
	initNav () {}

	/**
	 * Initialize external navigation
	 */
	initExternalNav () {}

	/**
	 * Navigate to specific page
	 */
	goToPage (targetIndex, direction = 1) {}

} // end of Tab class

// Make Tab class globally available
if (window) window["Tab"] = Tab;

// =============================================================================================================================
/** Class representating a Tab Page */
export class TabPage {}

// =============================================================================================================================
/** Class representating a Tab Navigation Button */
export class TabNav {}
