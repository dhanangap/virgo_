// ================================================================================================
// - Virgo Component
// - Gallery
// ================================================================================================
export class Gallery {

	// [ Class static properties ] ================================================================
	// Stores all galleries on the page.
	static index;

	// [ Object properties ] ======================================================================
	element;					// The gallery DOM element
	id;							// String of id for the gallery
	cols;						// Number of columns in one gallery page
	rows;						// Number of rows in one gallery page
	transition;					// Gallery page transition ["default", "slide", "fade", "none"]
	duration;					// Page transition duration in miliseconds
	modal;						// Custom modal id
	activePageIndex;			// Index of current active gallery page

	items;						// Stores all item DOM elements inside the gallery
	pages;						// Stores all gallery pages

	pagesElement;				// DOM element of gallery pages container
	controlElement;				// DOM element of gallery control
	indicatorElement;			// DOM element of gallery indicator
	navigationElement;			// DOM element of gallery navigation

	navlock;					// Navigation lock { true: prevent navigation event }
	scrollAmount;				// The amount of scrolling applied to gallery
	isScrolling;				// State of scrolling { true: gallery is being scrolled }

	externalIndicators;			// Stores DOM elements of external indicators
	externalNavigations;		// Stores DOM elements of external navigations

	// [ Computed properties ] ====================================================================
	// --------------------------------------------------------------------------------------------
	// • Get total pages inside the gallery
	// --------------------------------------------------------------------------------------------
	get totalPages()			{ return Math.ceil(this.items.length / this.numPageItems) }
	
	// --------------------------------------------------------------------------------------------
	// • Maximum items inside one gallery page
	// --------------------------------------------------------------------------------------------
	get numPageItems()			{ return this.cols * this.rows; }

	// [ Class static functions ] =================================================================
	// --------------------------------------------------------------------------------------------
	// • Initialize Component
	// --------------------------------------------------------------------------------------------
	static init() {
		// Initialize the value of static properties
		this.index = [];
		this.externalIndicators = {};
		this.externalNavigations = {};
		// Initialize the instances of this class
		let galleryElements = document.querySelectorAll(".gallery");
		if (galleryElements.length > 0) {
			for (let index = 0; index < galleryElements.length; index++) {
				const galleryElement = galleryElements[index];
				this.index.push(new this(index, galleryElement));
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
		for (const gallery of this.index) {
			gallery.resize();
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Initialize external indicators of the component
	// --------------------------------------------------------------------------------------------
	static initExternalIndicators() {
		let externalIndicators = document.querySelectorAll("[data-gallery-indicator]");
		for (const indicator of externalIndicators) {
			const galleryId = indicator.dataset["galleryIndicator"];
			const gallery = this.index.find(gallery => gallery.id === galleryId);

			if (gallery) {
				if (!this.externalIndicators[galleryId]) this.externalIndicators[galleryId] = [];
				this.externalIndicators[galleryId].push(indicator);
				gallery.initExternalIndicators();
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Initialize external navigations of the component
	// --------------------------------------------------------------------------------------------
	static initExternalNavigations() {
		let externalNavigations = document.querySelectorAll("[data-gallery-navigation]");
		for (const navigation of externalNavigations) {
			const galleryId = navigation.dataset["galleryNavigation"];
			const gallery = this.index.find(gallery => gallery.id === galleryId);

			if (gallery) {
				if (!this.externalNavigations[galleryId]) this.externalNavigations[galleryId] = [];
				this.externalNavigations[galleryId].push(navigation);

				// Add event listeners
				let prevButton = navigation.querySelector(`[data-navigation="prev"]`);
				let nextButton = navigation.querySelector(`[data-navigation="next"]`);
				if (prevButton) {
					prevButton.addEventListener("click", () => {
						gallery.back();
					});
				}
				if (nextButton) {
					nextButton.addEventListener("click", () => {
						gallery.forward();
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
		this.id = element.id ? element.id : `gallery-${index}`;
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
	// • Create gallery pages and organize items into pages
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

		for (let pageIndex = 0; pageIndex < this.totalPages; pageIndex++) {
			let page = document.createElement("div");
			page.classList.add("page");
			if (pageIndex === this.activePageIndex) page.classList.add("active");
			this.pagesElement.appendChild(page);
			this.pages.push(page);
		}

		// - Process items inside pages
		for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
			// Move item to designated page
			const pageNum = Math.floor(itemIndex / this.numPageItems);
			let item = this.items[itemIndex];
			this.pages[pageNum].appendChild(item);

			// Adjust item size
			item.style.width = `${1 / this.cols * 100}%`;
			item.style.height = `${1 / this.rows * 100}%`;

			// Add click event listener
			item.addEventListener("click", () => {
				// Custom click event
				if (item.dataset["click"] && item.dataset["click"] !== "") {
					this.customClickEvent(item);
				}
				// Default click event
				else {
					this.defaultClickEvent(item);
				}
			});
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
		if (Gallery.externalIndicators[this.id]) {
			for (let indicatorElement of Gallery.externalIndicators[this.id]) {
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
			this.cols = Math.min(this.cols, 2);
		} else {
			this.cols = this.element.dataset["cols"] ? parseInt(this.element.dataset["cols"]) : 1;
		}

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
		if (Gallery.externalIndicators[this.id]) {
			for (const indicatorElement of Gallery.externalIndicators[this.id]) {
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

	// --------------------------------------------------------------------------------------------
	// • Handle custom click event
	// --------------------------------------------------------------------------------------------
	customClickEvent (itemElement) {
		const functionName = itemElement.dataset["click"];
		if (!functionName) return;
		const fn = window[functionName];
		if (!fn) return;
		// Execute function
		fn({
			galleryId: this.id,
			itemData: Object.assign({}, itemElement.dataset),
			trigger: itemElement
		});
	}

	// --------------------------------------------------------------------------------------------
	// • Handle default click event
	// --------------------------------------------------------------------------------------------
	// - Show popup when user clicks one of gallery items.
	// --------------------------------------------------------------------------------------------
	defaultClickEvent (itemElement) {
		// - Display default popup when custom modal id is not provided.
		if (!this.modal) {}
		// - Display custom modal
		else {
			// ...
		}

	}
	
}