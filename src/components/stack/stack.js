// =============================================================================================================================
// - Virgo Component
// - Stack
// =============================================================================================================================
/** Class representating a Stack Component */
export default class Stack {

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

	layout;
	justify;
	transition;
	duration;
	easing;

	rows;
	cols;
	minRows;
	minCols;
	align;
	autoplay;

	pages;
	element;

	#pageWidth;
	#pagesContainer;
	#controlElement;
	#navigationElement;
	#indicatorElement;
	#externalControlElements;
	#externalNavigationElements;
	#externalIndicatorElements;

	// Object computed properties ----------------------------------------------------------------------------------------------

	/**
	 * Get maximum total items inside a page
	 * @return {number} */
	get #pageItemNum () { return this.rows * this.cols; }

	/**
	 * Get instance size and dimension
	 * @return {object} */
	get size () {
		const width		= this.element.getBoundingClientRect().width;
		const height 	= this.element.getBoundingClientRect().height;

		return {
			width, height
		}
	}

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
		this.defaults.layout		= `list`;
		this.defaults.justify		= `start`;
		this.defaults.transition	= `slide`;
		this.defaults.duration		= 300;
		this.defaults.easing		= `ease-out`;
		this.defaults.rows			= 1;
		this.defaults.cols			= 1;
		this.defaults.minRows		= 1;
		this.defaults.minCols		= 1;
		this.defaults.align			= "start";
		this.defaults.autoplay		= 0;
		this.defaults.activeIndex	= 0;
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
		this.pages 			= [];

		this.id 			= element.id 			? element.id 					: proto.defaults.id + proto.totalInstances;
		this.layout			= config["layout"] 		? config["layout"]				: proto.defaults.layout;
		this.justify		= config["justify"] 	? config["justify"]				: proto.defaults.justify;
		this.transition		= config["transition"] 	? config["transition"]			: proto.defaults.transition;
		this.duration		= config["duration"] 	? config["duration"]			: proto.defaults.duration;
		this.easing			= config["easing"] 		? config["easing"]				: proto.defaults.easing;
		this.activeIndex	= config["active"] 		? config["active"]				: proto.defaults.activeIndex;

		this.rows			= config["rows"] 		? parseInt(config["rows"])		: proto.defaults.rows;
		this.cols			= config["cols"] 		? parseInt(config["cols"])		: proto.defaults.cols;
		this.minRows		= config["minRows"] 	? parseInt(config["minRows"])	: proto.defaults.minRows;
		this.minCols		= config["minCols"] 	? parseInt(config["minCols"])	: proto.defaults.minCols;
		this.align			= config["align"] 		? config["align"]				: proto.defaults.align;
		this.autoplay		= config["autoplay"] 	? config["autoplay"]			: proto.defaults.autoplay;

		this.element.id		= this.id;

		this.configure();

	} // end of constructor method

	/**
	 * Configure pages, controls, and external controls
	 */
	configure () {
		this.initPages();
		this.initControls();
		this.initExternalControls();
	}

	/**
	 * Initialize pages
	 */
	initPages () {
		// Create pages container if it isn't available yet
		if (!this.#pagesContainer) {
			const existingContainer = this.element.querySelector(".pages");
			if (existingContainer) {
				this.#pagesContainer = existingContainer;
			} else {
				this.#pagesContainer = document.createElement("div");
				this.#pagesContainer.classList.add("pages");
				this.element.appendChild(this.#pagesContainer);
			}
		}

		// Empty pages container content
		this.#pagesContainer.innerHTML = "";

		// Put items inside its respective page
		let items 		= this.element.querySelectorAll(".item");
		let pageIndex 	= 0;
		let pageCols	= 0;
		for (let item of items) {
			const colspan = item.dataset["colspan"] ? parseInt(item.dataset["colspan"]) : 1;

			// Check if current page can contain the item
			// If not, move on to the next page
			if (pageCols + colspan > this.cols) {
				pageIndex++;
				pageCols = 0;
			}

			// Create page element if it isn't available yet
			if (!this.pages[pageIndex]) {
				let page = document.createElement("div");
				page.classList.add("page");
				if (pageIndex === this.activeIndex) page.classList.add("active");
				this.#pagesContainer.appendChild(page);
				this.pages.push(page);
			}

			// Move item element to page
			this.pages[pageIndex].appendChild(item);

			// Update pageCols
			pageCols = pageCols + this.cols;

		}

		// Adjust page positioning
		if (!this.#pageWidth) {
			this.#pageWidth = this.pages[0].getBoundingClientRect().width;
		}

		for (let i = 0; i < this.pages.length; i++) {
			let page = this.pages[i];
			let position = this.calculatePagePosition(i);
			page.style.transform = `translate3d(${ position.x }px, ${ position.y }px, ${ position.z }px)`;
			page.style.zIndex = this.calculatePageZIndex(i);
		}

		// Stack Layout: Add overlay navigation
		if (this.layout === "stack") {
			for (var i = 0; i < this.pages.length; i++) {
				let page 	= this.pages[i];
				let target	= i;
				let item	= page.querySelector(".item");
				let nav		= page.querySelector(".overlay-nav");
				if (!nav) {
					nav = document.createElement("div");
					nav.classList.add("overlay-nav");
					if (item) item.appendChild(nav);
				}
				nav.addEventListener("click", () => {
					this.goToPage(target);
				});
			}
		}


	} // end of initPages method


	calculatePagePosition (pageIndex) {
		let page		= this.pages[pageIndex];
		let startPos	= 0;
		let x			= 0;
		let y			= 0;
		let z			= 0;

		// Center alignment
		if (this.align === "center") {
			startPos = (this.size.width - this.#pageWidth) / 2;
		}

		// List layout
		if (this.layout === "list") {
			x = startPos + ((pageIndex - this.activeIndex) * this.#pageWidth);
		}
		// Stack layout
		else if (this.layout === "stack") {
			x = startPos + ((pageIndex - this.activeIndex) * this.#pageWidth) - ((pageIndex - this.activeIndex) * 240);
			z = -1 * Math.abs((pageIndex - this.activeIndex) * 50);
		}

		return {x, y, z};
	}

	calculatePageZIndex (pageIndex) {
		return (pageIndex === this.activeIndex) ? 7001 : (7000 - Math.abs(pageIndex - this.activeIndex));
	}

	initControls () {
		// Initialize control element if it isn't available yet
		if (!this.#controlElement) {
			const existingControl = this.element.querySelector(".control");
			if (existingControl) {
				this.#controlElement = existingControl;
			} else {
				this.#controlElement = document.createElement("div");
				this.#controlElement.classList.add("control");
				this.element.appendChild(this.#controlElement);
			}
		}

		// Initialize indicator element if it isn't available yet
		if (!this.#indicatorElement) {
			const existingIndicator = this.element.querySelector(".indicator");
			if (existingIndicator) {
				this.#indicatorElement = existingIndicator;
			} else {
				this.#indicatorElement = document.createElement("div");
				this.#indicatorElement.classList.add("indicator");
				this.#controlElement.appendChild(this.#indicatorElement);
			}
		}

		// Initialize navigation element if it isn't available yet
		if (!this.#navigationElement) {
			const existingNavigation = this.element.querySelector(".navigation");
			if (existingNavigation) {
				this.#navigationElement = existingNavigation;
			} else {
				this.#navigationElement = document.createElement("div");
				this.#navigationElement.classList.add("navigation");
				this.#controlElement.appendChild(this.#navigationElement);
			}
		}

		// Initialize indicator elements
		this.#indicatorElement.innerHTML = "";
		for (let i = 0; i < this.pages.length; i++) {
			let button = document.createElement("button");
			button.dataset["target"] = i;
			if (i === this.activeIndex) button.classList.add("active");
			button.addEventListener("click", () => {
				this.goToPage(i);
			});
			this.#indicatorElement.appendChild(button);
		}

		// Initialize navigation elements
		this.#navigationElement.innerHTML = "";

		let prevButton = document.createElement("button");
		prevButton.dataset["nav"] = `prev`;
		this.#navigationElement.appendChild(prevButton);
		prevButton.addEventListener("click", () => {
			this.goToPage((this.activeIndex - 1), -1);
		});

		let nextButton = document.createElement("button");
		nextButton.dataset["nav"] = `next`;
		this.#navigationElement.appendChild(nextButton);

		nextButton.addEventListener("click", () => {
			this.goToPage((this.activeIndex + 1), -1);
		});



	} // end of init control method

	initExternalControls () {

		if (!this.#externalIndicatorElements) {
			this.#externalIndicatorElements = document.querySelectorAll(`[data-indicator="${this.id}"]`);
		}
		for (var i = 0; i < this.#externalIndicatorElements.length; i++) {
			let indicator = this.#externalIndicatorElements[i];
			indicator.innerHTML = "";
			this.#indicatorElement.innerHTML = "";
			for (let i = 0; i < this.pages.length; i++) {
				let button = document.createElement("button");
				button.dataset["target"] = i;
				if (i === this.activeIndex) button.classList.add("active");
				button.addEventListener("click", () => {
					this.goToPage(i);
				});
				indicator.appendChild(button);
			}
		}

	}

	goToPage (targetIndex, direction = 1) {

		let index = targetIndex;
		if (targetIndex < 0) {
			index = this.pages.length - 1;
		}
		else if (targetIndex >= this.pages.length) {
			index = 0;
		}

		let prevIndex = this.activeIndex;
		let targetPage = this.pages[index];
		if (!targetPage) return;

		this.activeIndex = index;
		this.updateIndicators();
		this.updateExternalIndicators();
		this.updatePages(prevIndex, index, direction);
	}

	updateIndicators () {
		let indicatorButtons = this.#indicatorElement.querySelectorAll("button");
		for (let i = 0; i < indicatorButtons.length; i++) {
			let button = indicatorButtons[i];
			button.classList.remove("active");
			if (i === this.activeIndex) button.classList.add("active");
		}
	}

	updateExternalIndicators () {
		if (this.#externalIndicatorElements) {
			for (let indicator of this.#externalIndicatorElements) {
				let indicatorButtons = indicator.querySelectorAll("button");
				for (let i = 0; i < indicatorButtons.length; i++) {
					let button = indicatorButtons[i];
					button.classList.remove("active");
					if (i === this.activeIndex) button.classList.add("active");
				}
			}
		}
	}

	updatePages (fromIndex, targetIndex, direction = 1) {
		for (let i = 0; i < this.pages.length; i++) {
			let page = this.pages[i];
			let position = this.calculatePagePosition(i);
			let targetTransform = `translate3d(${ position.x }px, ${ position.y }px, ${ position.z }px)`;

			page.classList.remove("active");
			if (i === targetIndex) page.classList.add("active");

			// Transition
			// - Slide
			if (this.transition === "slide") {
				page.animate([
					{ transform: page.style.transform },
					{ transform: targetTransform },
				], {
					duration	: this.duration,
					easing		: this.easing
				});
			}

			// Finishing
			page.style.transform 	= targetTransform;
			page.style.zIndex 		= this.calculatePageZIndex(i);
		}
	}


}

// Make this class globally available
if (window) window["Stack"] = Stack;
