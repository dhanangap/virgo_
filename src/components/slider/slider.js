// ================================================================================================
// - Virgo Component
// - Slider
// ================================================================================================
export class Slider {

	// [ Class static properties ] ================================================================
	static index;					// Stores all instances on the page
	static externalIndicators;		// DOM element of external indicators
	static externalNavigations;		// DOM element of external navigations

	static defaultTransition;		// Slider default transition
	static defaultDuration;			// Slider default transition duration
	static defaultEasing;			// Slider default transition timing function

	// [ Object properties ] ======================================================================
	element;						// The slider DOM element
	id;								// String of id for the slider
	transition;						// Slider transition ["default", "slide", "fade", "none"]
	duration;						// Slider transition duration in miliseconds
	easing;							// Slider timing function
	activeSlideIndex;				// Index of currently active slide
	slides;							// Stores all slide DOM elements inside the slider

	slidesElement;					// DOM element of slides container
	controlElement;					// DOM element of slider control
	indicatorElement;				// DOM element of slider indicator
	navigationElement;				// DOM element of slider navigation

	navlock;						// Navigation lock { true: prevent navigation event }
	scrollAmount;					// The amount of scrolling applied to slider
	isScrolling;					// State of scrolling { true: slider is being scrolled }

	externalIndicators;				// Stores DOM elements of external indicators
	externalNavigations;			// Stores DOM elements of external navigations

	isFlexible;						// True if slider dimension is set to flexible

	// [ Computed properties ] ====================================================================
	// --------------------------------------------------------------------------------------------
	// • Get total slides
	// --------------------------------------------------------------------------------------------
	get totalSlides ()				{ return this.slides.length; }

	// [ Class static functions ] =================================================================
	// --------------------------------------------------------------------------------------------
	// • Initialize Component
	// --------------------------------------------------------------------------------------------
	static init() {
		// Initialize the value of static properties
		this.index					= [];
		this.externalIndicators		= {};
		this.externalNavigations	= {};

		// Default values
		this.defaultTransition		= "slide";
		this.defaultDuration		= 1000;
		this.defaultEasing 			= "cubic-bezier(0.370, 0.140, 0.110, 0.995)";

		// Initialize the instances of this class
		let sliderElements = document.querySelectorAll(".slider");
		if (sliderElements.length > 0) {
			for (let index = 0; index < sliderElements.length; index++) {
				const sliderElement = sliderElements[index];
				this.index.push(new this(index, sliderElement));
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
		for (const slider of this.index) {
			slider.resize();
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Initialize external indicators of the component
	// --------------------------------------------------------------------------------------------
	static initExternalIndicators() {
		let externalIndicators = document.querySelectorAll("[data-slider-indicator]");
		for (const indicator of externalIndicators) {
			const sliderId = indicator.dataset["sliderIndicator"];
			const slider = this.index.find(slider => slider.id === sliderId);

			if (slider) {
				if (!this.externalIndicators[sliderId]) this.externalIndicators[sliderId] = [];
				this.externalIndicators[sliderId].push(indicator);
				slider.initExternalIndicators();
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Initialize external navigations of the component
	// --------------------------------------------------------------------------------------------
	static initExternalNavigations() {
		let externalNavigations = document.querySelectorAll("[data-slider-navigation]");
		for (const navigation of externalNavigations) {
			const sliderId = navigation.dataset["sliderNavigation"];
			const slider = this.index.find(slider => slider.id === sliderId);

			if (slider) {
				if (!this.externalNavigations[sliderId]) this.externalNavigations[sliderId] = [];
				this.externalNavigations[sliderId].push(navigation);

				// Add event listeners
				let prevButton = navigation.querySelector(`[data-navigation="prev"]`);
				let nextButton = navigation.querySelector(`[data-navigation="next"]`);
				if (prevButton) {
					prevButton.addEventListener("click", () => {
						slider.back();
					});
				}
				if (nextButton) {
					nextButton.addEventListener("click", () => {
						slider.forward();
					});
				}
			}
		}
	}

	// [ Object instance functions ] ==============================================================
	// --------------------------------------------------------------------------------------------
	// • Constructor
	// --------------------------------------------------------------------------------------------
	constructor(index, element) {

		this.element	= element;
		// ----- Set identifier
		this.id 		= element.id ? element.id : `gallery-${index}`;
		element.id		= this.id;

		// ----- Variable initializer
		this.transition			= element.dataset["transition"]	? element.dataset["transition"] 		: Slider.defaultTransition;
		this.duration			= element.dataset["duration"]	? parseInt(element.dataset["duration"]) : Slider.defaultDuration;
		this.easing				= element.dataset["easing"]		? element.dataset["easing"] 			: Slider.defaultEasing;
		this.activeSlideIndex	= element.dataset["active"]		? parseInt(element.dataset["active"]) 	: 0;
		this.isFlexible			= element.classList.contains("flexible") ? true : false;

		element.dataset["active"] = this.activeSlideIndex;

		this.slidesElement		= this.element.querySelector(".slides");

		this.slides 			= this.slidesElement.querySelectorAll(".slide");
		this.navlock 			= false;
		this.scrollAmount 		= 0;

		this.initSlides();
		this.resize();
		this.initEventListeners();

	}

	// --------------------------------------------------------------------------------------------
	// • Initialize slides
	// --------------------------------------------------------------------------------------------
	initSlides () {
		for (let slideIndex = 0; slideIndex < this.totalSlides; slideIndex++) {
			let slide = this.slides[slideIndex];
			if (slideIndex === this.activeSlideIndex) {
				slide.classList.add("active");
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Flexible slide dimension
	// --------------------------------------------------------------------------------------------
	updateFlexibleSize () {
		// If slider is flexible, resize to match its content
		if (this.isFlexible) {
			let slideHeight = this.slides[this.activeSlideIndex].getBoundingClientRect().height;
			this.slidesElement.style.height = `${slideHeight}px`;
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
	initIndicator() {
		// - Indicator element
		if (!this.indicatorElement) {
			this.indicatorElement = document.createElement("div");
			this.indicatorElement.classList.add("indicator");
			this.controlElement.appendChild(this.indicatorElement);
		}
		this.indicatorElement.innerHTML = "";

		for (let slideIndex = 0; slideIndex < this.totalSlides; slideIndex++) {
			let indicatorButton = document.createElement("button");
			indicatorButton.dataset["target"] = slideIndex;
			if (slideIndex === this.activeSlideIndex) indicatorButton.classList.add("active");
			this.indicatorElement.appendChild(indicatorButton);
			indicatorButton.addEventListener("click", () => {
				this.setActiveSlide(slideIndex);
			});
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Create buttons for every external indicators
	// --------------------------------------------------------------------------------------------
	initExternalIndicators() {
		// - Indicator element
		if (Slider.externalIndicators[this.id]) {
			for (let indicatorElement of Slider.externalIndicators[this.id]) {
				indicatorElement.innerHTML = "";
				for (let slideIndex = 0; slideIndex < this.totalSlides; slideIndex++) {
					let indicatorButton = document.createElement("button");
					indicatorButton.dataset["target"] = slideIndex;
					if (slideIndex === this.activeSlideIndex) indicatorButton.classList.add("active");
					indicatorElement.appendChild(indicatorButton);
					indicatorButton.addEventListener("click", () => {
						this.setActiveSlide(slideIndex);
					});
				}
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Create navigation elements
	// --------------------------------------------------------------------------------------------
	initNavigation() {
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
	initEventListeners() {
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
	resize() {

		// ----- Prepare element
		if (this.totalSlides > 0) {
			this.updateFlexibleSize();
			this.initControlElement();
			this.initIndicator();
			this.initNavigation();
			this.initExternalIndicators();
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Navigate to a slide
	// --------------------------------------------------------------------------------------------
	setActiveSlide(index, direction = null) {
		if (!this.navlock) {
			let currentSlide = this.slides[this.activeSlideIndex];
			let targetSlide = this.slides[index];
			let transitionDirection = direction ? direction : ((index - this.activeSlideIndex) / Math.abs(index - this.activeSlideIndex));
			if (!targetSlide) return;

			this.activeSlideIndex = index;

			// - Update
			this.navlock = true;
			this.updateIndicator();
			this.updateSlides(currentSlide, targetSlide, transitionDirection);

			setTimeout(() => {
				this.navlock = false;
			}, this.duration + 500);
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Update indicator buttons to reflect current conditions
	// --------------------------------------------------------------------------------------------
	updateIndicator() {
		if (this.indicatorElement) {
			let buttons = this.indicatorElement.querySelectorAll("button");
			for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
				let button = buttons[buttonIndex];
				button.classList.remove("active");
				if (buttonIndex === this.activeSlideIndex) button.classList.add("active");
			}
		}
		if (Slider.externalIndicators[this.id]) {
			for (const indicatorElement of Slider.externalIndicators[this.id]) {
				let buttons = indicatorElement.querySelectorAll("button");
				for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
					let button = buttons[buttonIndex];
					button.classList.remove("active");
					if (buttonIndex === this.activeSlideIndex) button.classList.add("active");
				}
			}
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Slide transition
	// --------------------------------------------------------------------------------------------
	updateSlides(fromSlide, targetSlide, direction = 1) {
		if (this.slides) {
			// - Transition
			if (this.transition !== "none") {

				// - Slide / Default
				if (this.transition === "slide" || this.transition === "default") {
					if (fromSlide.style.transform === "") {
						fromSlide.style.transform = `translate3d(0, 0, 0)`;
					}
					if (targetSlide.style.transform === "") {
						targetSlide.style.transform = `translate3d(${direction * 100}%, 0, 0)`;
					}
					// Transition
					fromSlide.animate(
						[
							{ transform: fromSlide.style.transform, opacity: fromSlide.style.opacity },
							{ transform: `translate3d(${direction * -100}%, 0, 0)`, opacity: 0.33 },
						], {
						duration: this.duration,
						easing: this.easing
					}
					);
					targetSlide.animate(
						[
							{ transform: targetSlide.style.transform, opacity: targetSlide.style.opacity },
							{ transform: `translate3d(0, 0, 0)`, opacity: 1 },
						], {
						duration: this.duration,
						easing: this.easing
					}
					);
					setTimeout(() => {
						fromSlide.style.transform = ``;
						fromSlide.style.opacity = 0.33;
						targetSlide.style.transform = `translate3d(0, 0, 0)`;
						targetSlide.style.opacity = 1;
					}, this.duration);
				}

				// - Fade
				else if (this.transition === "fade") {
					targetSlide.style.display = "block";
					// Transition
					fromSlide.animate(
						[
							{ opacity: 1 },
							{ opacity: 0 },
						], {
						duration: this.duration,
						easing: this.easing
					}
					);
					targetSlide.animate(
						[
							{ opacity: 0 },
							{ opacity: 1 },
						], {
						duration: this.duration,
						easing: this.easing
					}
					);
					setTimeout(() => {
						fromSlide.style.display = "none";
						fromSlide.style.opacity = 0;
						targetSlide.style.display = "block";
						targetSlide.style.opacity = 1;
					}, this.duration);
				}

			}

			// - Finalizing
			setTimeout(() => {
				for (let slideIndex = 0; slideIndex < this.totalSlides; slideIndex++) {
					let slide = this.slides[slideIndex];
					slide.classList.remove("active");
					if (slideIndex === this.activeSlideIndex) slide.classList.add("active");
					this.updateFlexibleSize();
				}
			}, this.duration);
		}
	}

	// --------------------------------------------------------------------------------------------
	// • Navigate to previous slide
	// --------------------------------------------------------------------------------------------
	back() {
		let targetIndex = this.activeSlideIndex - 1;
		if (targetIndex < 0) {
			targetIndex = this.totalSlides - 1;
		}
		this.setActiveSlide(targetIndex, -1);
	}

	// --------------------------------------------------------------------------------------------
	// • Navigate to next page
	// --------------------------------------------------------------------------------------------
	forward() {
		let targetIndex = this.activeSlideIndex + 1;
		if (targetIndex >= this.totalSlides) {
			targetIndex = 0;
		}
		this.setActiveSlide(targetIndex, 1);
	}

	// --------------------------------------------------------------------------------------------
	// • Update UI to respond scrolling and dragging events
	// --------------------------------------------------------------------------------------------
	scroll(amount) {
		// Disable scroll when transition is set to fade or none
		if (this.transition === "fade" || this.transition === "none") return;

		const elementWidth = this.element.getBoundingClientRect().width;
		const opacity = Math.min(1, Math.abs(this.scrollAmount / elementWidth));

		if (!this.navlock) {
			if (this.isScrolling) window.clearTimeout(this.isScrolling);
			this.scrollAmount -= amount;
			if (Math.abs(this.scrollAmount) > elementWidth) {
				this.scrollAmount = Math.sign(this.scrollAmount) * elementWidth;
			}
			let currentSlide = this.slides[this.activeSlideIndex];
			let nextSlide;
			if (amount > 0) {
				if (this.activeSlideIndex + 1 < this.totalSlides) {
					nextSlide = this.slides[this.activeSlideIndex + 1];
				} else {
					nextSlide = this.slides[0];
				}
				nextSlide.style.transform = `translate3d(calc(100% + ${this.scrollAmount}px), 0, 0)`;
			} else {
				if (this.activeSlideIndex - 1 < 0) {
					nextSlide = this.slides[this.slides.length - 1];
				} else {
					nextSlide = this.slides[this.activeSlideIndex - 1];
				}
				nextSlide.style.transform = `translate3d(calc(${this.scrollAmount}px - 100%), 0, 0)`;
			}

			currentSlide.style.transform = `translate3d(${this.scrollAmount}px, 0, 0)`;
			currentSlide.style.opacity = 1 - opacity;
			nextSlide.style.opacity = opacity;

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
					currentSlide.animate([
						{ transform: currentSlide.style.transform, opacity: currentSlide.style.opacity },
						{ transform: `translate3d(0, 0, 0)`, opacity: 1 },
					], {
						duration: this.duration,
						easing: this.easing
					});
					currentSlide.style.transform = `translate3d(0, 0, 0)`;
					currentSlide.style.opacity = 1;
					if (amount > 0) {
						nextSlide.animate([
							{ transform: nextSlide.style.transform, opacity: nextSlide.style.opacity },
							{ transform: `translate3d(100%, 0, 0)`, opacity: 0.33 },
						], {
							duration: this.duration,
							easing: this.easing
						});
						nextSlide.style.transform = ``;
					} else {
						nextSlide.animate([
							{ transform: nextSlide.style.transform, opacity: nextSlide.style.opacity},
							{ transform: `translate3d(-100%, 0, 0)`, opacity: 0.33 },
						], {
							duration: this.duration,
							easing: this.easing
						});
						nextSlide.style.transform = ``;
					}
					nextSlide.style.opacity = 0.33;
					this.navlock = false;
				}
				this.scrollAmount = 0;
			}, 50);
		}
	}

}

// Make this class globally available
if (window) window["Slider"] = Slider;
