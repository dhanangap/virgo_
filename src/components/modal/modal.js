// ==========================================================================================================
// - Virgo Component
// - Modal
// ==========================================================================================================
export default class Modal {

	// [ Class static properties ] ==========================================================================
	static index;						// Stores all class instances on the page
	static containerElement;			// DOM element of modal container
	static backdropElement;				// DOM element of modal backdrop

	static openModal;					// The id of currently open modal

	// [ Object properties ] ================================================================================
	element;							// DOM element of modal instance
	id;									// String of id for the modal
	transition;							// Open and close transition effect
	// ["fade", "slideLeft", "slideRight", "none"]
	duration;							// Transition duration in miliseconds

	toggleElements;						// List of modal toggle DOM elements

	// [ Object computed properties ] =======================================================================
	// State of modal instance["closed", "open"]
	get state () 						{ return this.element.dataset["state"]; }
	set state (value)					{ this.element.dataset["state"] = value; }

	// [ Class static functions ] ===========================================================================
	// ------------------------------------------------------------------------------------------------------
	// • Initialize Component
	// ------------------------------------------------------------------------------------------------------
	static init () {
		// Initial value assignment of static properties
		this.index = [];
		// Initialize container and backdrop elements
		this.initContainer();
		this.initBackdrop();
		// Register all component instances to index
		let modalElements = document.querySelectorAll(".modal");
		for (let modalIndex = 0; modalIndex < modalElements.length; modalIndex++) {
			let modalElement = modalElements[modalIndex];
			this.index.push(new this(modalIndex, modalElement));
		}
		// Initialize openModal property
		this.openModal = null;
		// Initialize toggle elements
		this.initModalToggles();
	}

	// ------------------------------------------------------------------------------------------------------
	// • Get modal by id
	// ------------------------------------------------------------------------------------------------------
	static getById(id) {
		return this.index.find(modal => modal.id === id);
	}

	// ------------------------------------------------------------------------------------------------------
	// • Initialize container element
	// ------------------------------------------------------------------------------------------------------
	static initContainer () {
		if (!this.containerElement) {
			// Check for existing modal container on the page
			this.containerElement = document.querySelector(".modal-container");
			// No existing modal container, create a new one
			if (!this.containerElement) {
				this.containerElement = document.createElement("div");
				this.containerElement.classList.add("modal-container");
				this.containerElement.dataset["state"] = "hidden";
				document.body.appendChild(this.containerElement);
			}
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// • Initialize backdrop element
	// ------------------------------------------------------------------------------------------------------
	static initBackdrop() {
		if (this.containerElement) {
			// Check for existing backdrop element inside modal container
			this.backdropElement = this.containerElement.querySelector(".modal-backdrop");
			// No existing backdrop, create a new one
			if (!this.backdropElement) {
				this.backdropElement = document.createElement("div");
				this.backdropElement.classList.add("modal-backdrop");
				this.containerElement.appendChild(this.backdropElement);
			}
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// • Initialize modal toggles (triggers)
	// ------------------------------------------------------------------------------------------------------
	static initModalToggles () {
		let toggleElements = document.querySelectorAll(`[data-modal-toggle]`);
		for (let toggle of toggleElements) {
			const modal = this.index.find(modal => modal.id === toggle.dataset["modalToggle"]);
			if (modal) {
				toggle.addEventListener("click", () => {
					modal.toggle();
				});
			}
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// • Open modal container
	// ------------------------------------------------------------------------------------------------------
	static openContainer () {
		this.containerElement.dataset["state"] = "visible";
		this.containerElement.animate([
			{ opacity: 0 },
			{ opacity: 1 },
		], {
			duration: 300,
			easing: "ease-out"
		});
	}

	// ------------------------------------------------------------------------------------------------------
	// • Close modal container
	// ------------------------------------------------------------------------------------------------------
	static closeContainer() {
		this.containerElement.animate([
			{ opacity: 1 },
			{ opacity: 0 },
		], {
			duration: 300,
			easing: "ease-out"
		});
		setTimeout(() => {
			this.containerElement.dataset["state"] = "hidden";
			this.openModal = null;
		}, 300);
	}

	// ------------------------------------------------------------------------------------------------------
	// • Close all open modals
	// ------------------------------------------------------------------------------------------------------
	static closeAll () { }

	// ------------------------------------------------------------------------------------------------------
	// • Open modal by id
	// ------------------------------------------------------------------------------------------------------
	static open(id, data = undefined) {
		let modal = this.getById(id);
		if (modal) {
			modal.open(data);
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// • Close modal by id
	// ------------------------------------------------------------------------------------------------------
	static close(id) {
		let modal = this.getById(id);
		if(moda) {
			modal.close();
		}
	}

	// [ Object instance functions ] ========================================================================
	// ------------------------------------------------------------------------------------------------------
	// • Constructor
	// ------------------------------------------------------------------------------------------------------
	constructor (index, element) {
		this.element = element;

		// Set identifier
		this.id = this.element.id ? this.element.id : `modal-${index}`;
		this.element.id = this.id;

		// Assign transition and duration
		this.transition = this.element.dataset["transition"] ? this.element.dataset["transition"] : "fade";
		this.duration = this.element.dataset["duration"] ? parseInt(this.element.dataset["duration"]) : 300;

		// Assign "closed" to modal state
		this.state = "closed";

		// Move modal element to container
		Modal.containerElement.appendChild(this.element);

		// Add event listener to close button
		let closeButton = this.element.querySelector("button.close");
		if (closeButton) {
			closeButton.addEventListener("click", () => {
				this.close();
			});
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// • Open modal instance
	// ------------------------------------------------------------------------------------------------------
	open (data = undefined) {
		Modal.openContainer();
		// Open animation
		if (this.transition !== "none") {

			// Fade transition
			this.element.animate([
				{ opacity: 0 },
				{ opacity: 1 },
			], {
				duration: this.duration,
				easing: "ease-out"
			});
			this.element.style.opacity = 1;

		}
		// Set modal state to "closed"
		this.state = "open";
	}

	// ------------------------------------------------------------------------------------------------------
	// • Close modal instance
	// ------------------------------------------------------------------------------------------------------
	close () {
		// Close animation
		if (this.transition !== "none") {

			// Fade transition
			this.element.animate([
				{ opacity: 1 },
				{ opacity: 0 },
			], {
				duration: this.duration,
				easing: "ease-out"
			});
			this.element.style.opacity = 0;

		}
		setTimeout(() => {
			// Set modal state to "closed"
			this.state = "closed";
			Modal.closeContainer();
		}, this.duration);
	}

	// ------------------------------------------------------------------------------------------------------
	// • Toggle open or close modal instance
	// ------------------------------------------------------------------------------------------------------
	toggle(data = undefined) {
		if (this.state === "closed")	{ this.open(data); }
		else							{ this.close(); }
	}

}

// Make this class globally available
if (window) window["Modal"] = Modal;
