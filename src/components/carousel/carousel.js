// ================================================================================================
// - Virgo Component
// - Carousel
// ================================================================================================
export class Carousel {

	// [ Class static properties ] ================================================================
	// Stores all galleries on the page.
	static selector;
	static index;
	static externalIndicators;  // DOM element of external indicators
	static externalNavigations; // DOM element of external navigations

	// [ Object properties ] ======================================================================
	element;					// The carousel DOM element
	id;							// String of id for the carousel
	cols;						// Number of columns in one carousel page
	rows;						// Number of rows in one carousel page
	transition;					// Carousel page transition ["default", "slide", "fade", "none"]
	duration;					// Page transition duration in miliseconds
	modal;						// Custom modal id
	activePageIndex;			// Index of currently active carousel page

	items;						// Stores all item DOM elements inside the carousel
	pages;						// Stores all carousel pages

	pagesElement;				// DOM element of carousel pages container
	controlElement;				// DOM element of carousel control
	indicatorElement;			// DOM element of carousel indicator
	navigationElement;			// DOM element of carousel navigation

	navlock;					// Navigation lock { true: prevent navigation event }
	scrollAmount;				// The amount of scrolling applied to carousel
	isScrolling;				// State of scrolling { true: carousel is being scrolled }

	externalIndicators;			// Stores DOM elements of external indicators
	externalNavigations;		// Stores DOM elements of external navigations

	// [ Computed properties ] ====================================================================
	// --------------------------------------------------------------------------------------------
	// • Get total pages inside the carousel
	// --------------------------------------------------------------------------------------------
	get totalPages()			{ return Math.ceil(this.items.length / this.numPageItems) }

	// --------------------------------------------------------------------------------------------
	// • Maximum items inside one carousel page
	// --------------------------------------------------------------------------------------------
	get numPageItems() { return this.cols * this.rows; }

	// [ Class static functions ] =================================================================
	// --------------------------------------------------------------------------------------------
	// • Initialize Component
	// --------------------------------------------------------------------------------------------
	static init() {
		// Initialize the value of static properties
		this.selector = ".carousel";
		this.index = [];
		this.externalIndicators = {};
		this.externalNavigations = {};
		// Initialize the instances of this class
		let carouselElements = document.querySelectorAll(this.selector);
		if (carouselElements.length > 0) {
			for (let index = 0; index < carouselElements.length; index++) {
				const carouselElement = carouselElements[index];
				this.index.push(new this(index, carouselElement));
			}
			// Add window resize event listener
			window.addEventListener("resize", () => {
				this.resizeListener();
			});
		}
		// Initialize external controls of all class instances
		this.initExternalIndicators();
		this.initExternalNavigations();

	}

	// --------------------------------------------------------------------------------------------
	// • Window resize event listener
	// --------------------------------------------------------------------------------------------
	static resizeListener() {
		for (const carousel of this.index) {
			carousel.resize();
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Initialize external indicators of the component
	// --------------------------------------------------------------------------------------------
	static initExternalIndicators() {
		let externalIndicators = document.querySelectorAll("[data-carousel-indicator]");
		for (const indicator of externalIndicators) {
			const carouselId = indicator.dataset["carouselIndicator"];
			const carousel = this.index.find(carousel => carousel.id === carouselId);

			if (carousel) {
				if (!this.externalIndicators[carouselId]) this.externalIndicators[carouselId] = [];
				this.externalIndicators[carouselId].push(indicator);
				carousel.initExternalIndicators();
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Initialize external navigations of the component
	// --------------------------------------------------------------------------------------------
	static initExternalNavigations() {
		let externalNavigations = document.querySelectorAll("[data-carousel-navigation]");
		for (const navigation of externalNavigations) {
			const carouselId = navigation.dataset["carouselNavigation"];
			const carousel = this.index.find(carousel => carousel.id === carouselId);

			if (carousel) {
				if (!this.externalNavigations[carouselId]) this.externalNavigations[carouselId] = [];
				this.externalNavigations[carouselId].push(navigation);

				// Add event listeners
				let prevButton = navigation.querySelector(`[data-navigation="prev"]`);
				let nextButton = navigation.querySelector(`[data-navigation="next"]`);
				if (prevButton) {
					prevButton.addEventListener("click", () => {
						carousel.back();
					});
				}
				if (nextButton) {
					nextButton.addEventListener("click", () => {
						carousel.forward();
					});
				}
			}
		}
	}

	// [ Object instance functions ] ==============================================================
	// --------------------------------------------------------------------------------------------
	// • Constructor
	// --------------------------------------------------------------------------------------------
	constructor (index, element) {

		this.element = element;
		// ----- Set identifier
		this.id = element.id ? element.id : `carousel-${index}`;
		element.id = this.id;

		// ----- Variable initializer
		this.cols = element.dataset["cols"] ? parseInt(element.dataset["cols"]) : 1;
		this.rows = element.dataset["rows"] ? parseInt(element.dataset["rows"]) : 1;
		this.transition = element.dataset["transition"] ? element.dataset["transition"] : "default";
		this.duration = element.dataset["duration"] ? parseInt(element.dataset["duration"]) : 500;
		this.modal = element.dataset["modal"] ? element.dataset["modal"] : null;
		this.activePageIndex = element.dataset["active"] ? parseInt(element.dataset["active"]) : 0;
		this.items = element.querySelectorAll(".item");
		this.pages = [];
		this.navlock = false;
		this.scrollAmount = 0;

		this.resize();
		this.initEventListeners();

	}

	// --------------------------------------------------------------------------------------------
	// • Create carousel pages and organize items into pages
	// --------------------------------------------------------------------------------------------
	initPages () {

		// - Create page elements
		if (!this.pagesElement) {
			this.pagesElement = document.createElement("div");
			this.pagesElement.classList.add("pages");
			this.element.appendChild(this.pagesElement);
		}

		this.pages = [];
		this.pagesElement.innerHTML = "";

		// for (let pageIndex = 0; pageIndex < this.totalPages; pageIndex++) {
		// 	let page = document.createElement("div");
		// 	page.classList.add("page");
		// 	if (pageIndex === this.activePageIndex) page.classList.add("active");
		// 	this.pagesElement.appendChild(page);
		// 	this.pages.push(page);
		// }

		// - Process items inside pages
		let pageNum = 0;
		let pageColSpan = 0;
		for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
			let item = this.items[itemIndex];

			// Item col and row span
			let colspan = item.dataset["colspan"] ? parseInt(item.dataset["colspan"]) : 1;
			let rowspan = item.dataset["rowspan"] ? parseInt(item.dataset["rowspan"]) : 1;

			if (colspan > this.cols) {
				colspan = this.cols;
			}

			// Move item to designated page
			if (pageColSpan + colspan > this.cols) {
				pageNum++;
				pageColSpan = colspan;
			} else {
				pageColSpan = pageColSpan + colspan;
			}

			if (!this.pages[pageNum]) {
				let page = document.createElement("div");
				page.classList.add("page");
				if (pageNum === this.activePageIndex) page.classList.add("active");
				this.pagesElement.appendChild(page);
				this.pages.push(page);
			}
			this.pages[pageNum].appendChild(item);


			// Adjust item size
			item.style.width = `${colspan / this.cols * 100}%`;
			item.style.height = `${rowspan / this.rows * 100}%`;

		}
	}

	// --------------------------------------------------------------------------------------------
	// • Create container element for indicator and navigation
	// --------------------------------------------------------------------------------------------
	initControlElement() {
		// - Control element
		if (!this.controlElement) {
			this.controlElement = document.createElement("div");
			this.controlElement.classList.add("control");
			this.element.appendChild(this.controlElement);
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Create indicator container and button elements
	// --------------------------------------------------------------------------------------------
	initIndicator () {
		// - Indicator element
		if (!this.indicatorElement) {
			this.indicatorElement = document.createElement("div");
			this.indicatorElement.classList.add("indicator");
			this.controlElement.appendChild(this.indicatorElement);
		}
		this.indicatorElement.innerHTML = "";

		for (let pageIndex = 0; pageIndex < this.totalPages; pageIndex++) {
			let indicatorButton = document.createElement("button");
			indicatorButton.dataset["target"] = pageIndex;
			if (pageIndex === this.activePageIndex) indicatorButton.classList.add("active");
			this.indicatorElement.appendChild(indicatorButton);
			indicatorButton.addEventListener("click", () => {
				this.setActivePage(pageIndex);
			});
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Create buttons for every external indicators
	// --------------------------------------------------------------------------------------------
	initExternalIndicators () {
		// - Indicator element
		if (Carousel.externalIndicators[this.id]) {
			for (let indicatorElement of Carousel.externalIndicators[this.id]) {
				indicatorElement.innerHTML = "";
				for (let pageIndex = 0; pageIndex < this.totalPages; pageIndex++) {
					let indicatorButton = document.createElement("button");
					indicatorButton.dataset["target"] = pageIndex;
					if (pageIndex === this.activePageIndex) indicatorButton.classList.add("active");
					indicatorElement.appendChild(indicatorButton);
					indicatorButton.addEventListener("click", () => {
						this.setActivePage(pageIndex);
					});
				}
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Create navigation elements
	// --------------------------------------------------------------------------------------------
	initNavigation () {
		// - Navigation element
		if (!this.navigationElement) {
			this.navigationElement = document.createElement("div");
			this.navigationElement.classList.add("navigation");
			this.controlElement.appendChild(this.navigationElement);
		}
		this.navigationElement.innerHTML = "";

		let prevButton = document.createElement("button");
		prevButton.classList.add("prev");
		this.navigationElement.appendChild(prevButton);
		prevButton.addEventListener("click", () => {
			this.back();
		});

		let nextButton = document.createElement("button");
		nextButton.classList.add("next");
		nextButton.addEventListener("click", () => {
			this.forward();
		});
		this.navigationElement.appendChild(nextButton);
	}

	// --------------------------------------------------------------------------------------------
	// • Add event listener to the element
	// --------------------------------------------------------------------------------------------
	initEventListeners () {
		// - Scroll event
		this.element.addEventListener("wheel", (event) => {
			if (Math.abs(event.deltaX) > 0) {
				event.preventDefault();
				this.scroll(event.deltaX);
			}
		});

		// - Touch drag event
		this.element.addEventListener("touchstart", (event) => {
			let startPos = event.touches[0].clientX;

			const touchmove = (moveevent) => {
				const delta = startPos - moveevent.touches[0].clientX;
				this.scroll(delta);
				startPos = moveevent.touches[0].clientX;
			}

			const touchend = () => {
				this.element.removeEventListener("touchmove", touchmove);
				this.element.removeEventListener("touchend", touchend);
			}

			this.element.addEventListener("touchmove", touchmove);
			this.element.addEventListener("touchend", touchend);
		});
	}

	// --------------------------------------------------------------------------------------------
	// • Update element's UI and functionalities
	// --------------------------------------------------------------------------------------------
	resize () {
		// ----- Smaller screen
		if (this.element.getBoundingClientRect().width <= 450) {
			this.cols = Math.min(this.cols, 1);
		} else {
			this.cols = this.element.dataset["cols"] ? parseInt(this.element.dataset["cols"]) : 1;
		}

		if (this.activePageIndex >= this.totalPages) this.activePageIndex = this.totalPages - 1;

		// ----- Prepare element
		if (this.items.length > 0) {

			this.initPages();
			this.initControlElement();
			this.initIndicator();
			this.initNavigation();

			this.initExternalIndicators();

		}
	}

	// --------------------------------------------------------------------------------------------
	// • Navigate to a page
	// --------------------------------------------------------------------------------------------
	setActivePage (index, direction = null) {
		if (!this.navlock) {
			let currentPage = this.pages[this.activePageIndex];
			let targetPage = this.pages[index];
			let transitionDirection = direction ? direction : ((index - this.activePageIndex) / Math.abs(index - this.activePageIndex));
			if (!targetPage) return;

			this.activePageIndex = index;

			// - Update
			this.navlock = true;
			this.updateIndicator();
			this.updatePages(currentPage, targetPage, transitionDirection);

			setTimeout(() => {
				this.navlock = false;
			}, this.duration + 500);
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Update indicator buttons to reflect current conditions
	// --------------------------------------------------------------------------------------------
	updateIndicator () {
		if (this.indicatorElement) {
			let buttons = this.indicatorElement.querySelectorAll("button");
			for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
				let button = buttons[buttonIndex];
				button.classList.remove("active");
				if (buttonIndex === this.activePageIndex) button.classList.add("active");
			}
		}
		if (Carousel.externalIndicators[this.id]) {
			for (const indicatorElement of Carousel.externalIndicators[this.id]) {
				let buttons = indicatorElement.querySelectorAll("button");
				for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
					let button = buttons[buttonIndex];
					button.classList.remove("active");
					if (buttonIndex === this.activePageIndex) button.classList.add("active");
				}
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Page transition
	// --------------------------------------------------------------------------------------------
	updatePages (fromPage, targetPage, direction = 1) {
		if (this.pages) {
			// - Transition
			if (this.transition !== "none") {

				// - Slide / Default
				if (this.transition === "slide" || this.transition === "default") {
					if (fromPage.style.transform === "") {
						fromPage.style.transform = `translate3d(0, 0, 0)`;
					}
					if (targetPage.style.transform === "") {
						targetPage.style.transform = `translate3d(${direction * 100}%, 0, 0)`;
					}
					// Transition
					fromPage.animate(
						[
							{ transform: fromPage.style.transform },
							{ transform: `translate3d(${direction * -100}%, 0, 0)` },
						], {
						duration: this.duration,
						easing: "ease-out"
					}
					);
					targetPage.animate(
						[
							{ transform: targetPage.style.transform },
							{ transform: `translate3d(0, 0, 0)` },
						], {
						duration: this.duration,
						easing: "ease-out"
					}
					);
					setTimeout(() => {
						fromPage.style.transform = ``;
						targetPage.style.transform = `translate3d(0, 0, 0)`;
					}, 300);
				}

			}

			// - Finalizing
			for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
				let page = this.pages[pageIndex];
				page.classList.remove("active");
				if (pageIndex === this.activePageIndex) page.classList.add("active");
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Navigate to previous page
	// --------------------------------------------------------------------------------------------
	back() {
		let targetIndex = this.activePageIndex - 1;
		if (targetIndex < 0) {
			targetIndex = this.totalPages - 1;
		}
		this.setActivePage(targetIndex, -1);
	}

	// --------------------------------------------------------------------------------------------
	// • Navigate to next page
	// --------------------------------------------------------------------------------------------
	forward () {
		let targetIndex = this.activePageIndex + 1;
		if (targetIndex >= this.totalPages) {
			targetIndex = 0;
		}
		this.setActivePage(targetIndex, 1);
	}

	// --------------------------------------------------------------------------------------------
	// • Update UI to respond scrolling and dragging events
	// --------------------------------------------------------------------------------------------
	scroll (amount) {
		const elementWidth = this.element.getBoundingClientRect().width;
		if (!this.navlock) {
			if (this.isScrolling) window.clearTimeout(this.isScrolling);
			this.scrollAmount -= amount;
			if (Math.abs(this.scrollAmount) > elementWidth) {
				this.scrollAmount = Math.sign(this.scrollAmount) * elementWidth;
			}
			let currentPage = this.pages[this.activePageIndex];
			let nextPage;
			if (amount > 0) {
				if (this.activePageIndex + 1 < this.pages.length) {
					nextPage = this.pages[this.activePageIndex + 1];
				} else {
					nextPage = this.pages[0];
				}
				nextPage.style.transform = `translate3d(calc(100% + ${this.scrollAmount}px), 0, 0)`;
			} else {
				if (this.activePageIndex - 1 < 0) {
					nextPage = this.pages[this.pages.length - 1];
				} else {
					nextPage = this.pages[this.activePageIndex - 1];
				}
				nextPage.style.transform = `translate3d(calc(${this.scrollAmount}px - 100%), 0, 0)`;
			}

			currentPage.style.transform = `translate3d(${this.scrollAmount}px, 0, 0)`;

			this.isScrolling = setTimeout(() => {
				this.navlock = true;
				// Navigate forward
				if (this.scrollAmount <= -(0.3 * elementWidth)) {
					this.navlock = false;
					this.forward();
				}
				// Return to backward
				else if (this.scrollAmount >= (0.3 * elementWidth)) {
					this.navlock = false;
					this.back();
				}
				// Do not navigate
				else {
					currentPage.animate([
						{ transform: currentPage.style.transform },
						{ transform: `translate3d(0, 0, 0)` },
					], {
						duration: this.duration,
						easing: "ease-out"
					});
					currentPage.style.transform = `translate3d(0, 0, 0)`;
					if (amount > 0) {
						nextPage.animate([
							{ transform: nextPage.style.transform },
							{ transform: `translate3d(100%, 0, 0)` },
						], {
							duration: this.duration,
							easing: "ease-out"
						});
						nextPage.style.transform = ``;
					} else {
						nextPage.animate([
							{ transform: nextPage.style.transform },
							{ transform: `translate3d(-100%, 0, 0)` },
						], {
							duration: this.duration,
							easing: "ease-out"
						});
						nextPage.style.transform = ``;
					}
					this.navlock = false;
				}
				this.scrollAmount = 0;
			}, 50);
		}
	}
}

// Make this class globally available
if (window) window["Carousel"] = Carousel;
