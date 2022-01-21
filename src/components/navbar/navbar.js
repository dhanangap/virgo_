// ================================================================================================
// - Virgo Component
// - Navbar
// ================================================================================================
export default class Navbar {

	// [ Object properties ] ======================================================================
	element;					// The carousel DOM element

    #menu;
    #menuToggle;

	// [ Class static functions ] =================================================================
	// --------------------------------------------------------------------------------------------
	// • Initialize Component
	// --------------------------------------------------------------------------------------------
	static init(selector = ".navbar") {
		// Initialize the value of static properties
		this.selector = selector;
		// Initialize the instances of this class
		let navbarElements = document.querySelectorAll(this.selector);
		if (navbarElements.length > 0) {
			for (let index = 0; index < navbarElements.length; index++) {
				const navbarElement = navbarElements[index];
				const navbar = new this(navbarElement);
			}
		}

	}

	// [ Object instance functions ] ==============================================================
	// --------------------------------------------------------------------------------------------
	// • Constructor
	// --------------------------------------------------------------------------------------------
	constructor (element) {

		this.element = element;
		this.resize();

        this.#menu = this.element.querySelector(".menu");

        // Menu toggle
        this.#menuToggle = this.element.querySelector(".menu-toggle");
        if (this.#menuToggle) {
            this.#menuToggle.addEventListener("click", () => {
               this.toggleMenu();
            });
        }

        // Add window resize event listener
        window.addEventListener("resize", () => {
            this.resize();
        });

		// Add event listener to dropdown menu toggle
		const dropdowns = this.element.querySelectorAll(".has-dropdown > a");
		for (const dropdown of dropdowns) {
			dropdown.addEventListener("click", (event) => {
				event.preventDefault();
				this.toggleDropdown(dropdown.parentElement);
			});
		}

	}

    // --------------------------------------------------------------------------------------------
	// • Toggle Menu
	// --------------------------------------------------------------------------------------------
    toggleMenu () {
        this.#menu.classList.toggle("open");
		if (this.#menuToggle) {

			let icon = this.#menuToggle.querySelector(".icon");
			if (!icon) return;

			if (this.#menu.classList.contains("open")) {
				icon.innerHTML = "close";
			} else {
				icon.innerHTML = "menu";
			}
		}
    }

	// --------------------------------------------------------------------------------------------
	// • Update element's UI and functionalities
	// --------------------------------------------------------------------------------------------
	resize () {
		// ----- Smaller screen
		if (this.element.getBoundingClientRect().width <= 640) {

		} else {

		}
	}

	// --------------------------------------------------------------------------------------------
	// • Toggle Dropdown Menu
	// --------------------------------------------------------------------------------------------
	toggleDropdown (parentElement) {
		const dropdownElement = parentElement.querySelector(".dropdown");
		if (parentElement.classList.contains("open")) {
			parentElement.classList.remove("open");
		} else {
			parentElement.classList.add("open");
		}
	}

}

// Make this class globally available
if (window) window["Navbar"] = Navbar;
