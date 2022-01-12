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
	#navButtons;

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

	/**
	 * Get current active page instance
	 */
	get activePage () {
		return this.pages[this.activeIndex];
	}

	// =========================================================================================================================
	// - Static Methods
	// =========================================================================================================================

	static init (selector = null, config = null) {
		// Initialize default value of class properties
		this.initDefaults();
		// Create class instance from matched elements in the document
		for (let element of document.querySelectorAll(selector ? selector : this.defaultSelector)) {
			let instance = new this(this.totalInstances, element, config);
		}
		// Mark this class as initialized
		this.isInitialized = true;
	}

	static initDefaults () {
		this.defaultSelector 		= `[data-component="tab"]`;
		this.defaults.id			= `tab-`;
		this.defaults.transition	= `fade`;
		this.defaults.duration		= 300;
		this.defaults.easing		= `ease-out`;
		this.defaults.activeIndex	= 0;
	}

	static register (instance) {
		this.registry.push(instance);
	}

	static getById (id) {
		return this.registry.find(el => el.id === id);
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
		this.pages 			= [];
		this.#navButtons	= [];

		Tab.register(this);

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
	initPages () {
		// Get pages container
		if (!this.#pagesElement) {
			this.#pagesElement = this.element.querySelector(".tab-pages");
		}
		if (!this.#pagesElement) return;

		// Iterate through pages
		let pages = this.#pagesElement.querySelectorAll(".tab-page");
		for (let i = 0; i < pages.length; i++) {
			let page = new TabPage(this.id, i, pages[i]);
			this.pages.push(page);
		}
	}

	/**
	 * Initialize navigation
	 */
	initNav () {
		// Get nav container
		if (!this.#navElement) {
			this.#navElement = this.element.querySelector(".tab-nav");
		}
		if (!this.#navElement) return;


		// Iterate through nav buttons
		let buttons = this.#navElement.querySelectorAll("button");
		for (let i = 0; i < buttons.length; i++) {
			let button = new TabNav(this.id, i, buttons[i]);
			this.#navButtons.push(button);
		}
	}

	/**
	 * Initialize external navigation
	 */
	initExternalNav () {}

	/**
	 * Navigate to specific page
	 */
	goToPage (targetIndex, direction = 1) {
		if (targetIndex === this.activeIndex) return;

		let targetPage = this.pages[targetIndex];
		if (targetPage) {
			targetPage.activate();
			this.activePage.deactivate();
			this.activeIndex = targetIndex;
			for (let nav of this.#navButtons) {
				nav.refresh();
			}
		}
	}

} // end of Tab class

// Make Tab class globally available
if (window) window["Tab"] = Tab;

// =============================================================================================================================
/** Class representating a Tab Page */
export class TabPage {

	element;
	tabId;
	index;

	get tab () {
		return Tab.getById(this.tabId);
	}

	get isActive () {
		return this.element.classList.contains("active");
	}

	constructor (tabId, index, element) {
		this.tabId 		= tabId;
		this.index 		= index;
		this.element 	= element;

		this.refresh();
	}

	refresh () {
		if (this.tab.activeIndex === this.index) {
			this.activate();
		} else {
			this.deactivate();
		}
	}

	activate () {
		this.element.classList.add("active");
	}

	deactivate () {
		this.element.classList.remove("active");
	}

}

// =============================================================================================================================
/** Class representating a Tab Navigation Button */
export class TabNav {

	element;

	tabId;
	targetIndex;

	get tab () {
		return Tab.getById(this.tabId);
	}

	get isActive () {
		return this.element.classList.contains("active");
	}

	constructor (tabId, targetIndex, element) {
		this.tabId 			= tabId;
		this.targetIndex 	= targetIndex;
		this.element 		= element;

		this.element.addEventListener("click", () => {
			this.tab.goToPage(this.targetIndex);
		});

		this.refresh();
	}

	refresh () {
		if (this.tab.activeIndex === this.targetIndex) {
			this.activate();
		} else {
			this.deactivate();
		}
	}

	activate () {
		this.element.classList.add("active");
	}

	deactivate () {
		this.element.classList.remove("active");
	}



}
