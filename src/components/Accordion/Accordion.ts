import AccordionConfig	 		from "./AccordionConfig";
import { getContentHeight } 	from "../../helpers/dimension";
import { hide }					from "../../animation/show";
import { slideDown, slideUp }	from "../../animation/slide";
// =============================================================================================================================
// - Virgo Component
// - Accordion
// =============================================================================================================================
/** Class representating a Accordion Component */
export default class Accordion {

	// =========================================================================================================================
	// - Static Properties
	// =========================================================================================================================

	static isInitialized: boolean		= false;
	static defaultSelector: string		= "";
	static defaults: AccordionConfig	= {};
	static registry: Array<Accordion>	= [];

	// Static computed properties ----------------------------------------------------------------------------------------------

	static get totalInstances () : number {
		return this.registry.length;
	}

	// =========================================================================================================================
	// - Object Properties
	// =========================================================================================================================

	id: string;

	transition: string;
	duration: number;
	easing: string;

	element: HTMLElement;
	#toggleElement: HTMLElement;
	#contentElement: HTMLElement;

	#contentHeight: number;
	#contentPadding: string;
	#contentDisplay: string;

	/**
	 * Set instance state
	 */
	set state (state: string) {
		this.element.dataset["state"] = state;
	}

	/**
	 * Get instance state
	 */
	get state () : string {
		return this.element.dataset["state"];
	}

	// =========================================================================================================================
	// - Static Methods
	// =========================================================================================================================

	static init (selector: string = null, config: AccordionConfig = null) {
		// Initialize default value of class properties
		this.initDefaults();
		// Create class instance from matched elements in the document
		for (let element of document.querySelectorAll(selector ? selector : this.defaultSelector)) {
			this.register(new this(element as HTMLElement, config));
		}
		// Mark this class as initialized
		this.isInitialized = true;
	}

	static initDefaults () {
		this.defaultSelector 		= `[data-component="accordion"]`;
		this.defaults.id			= `accordion-`;
		this.defaults.transition	= `slide`;
		this.defaults.duration		= 300;
		this.defaults.easing		= `ease-out`;
		this.defaults.state			= `collapsed`;
	}

	static register (instance: Accordion) {
		this.registry.push(instance);
	}

	static getById (id: string) : Accordion {
		return this.registry.find(item => item.id === id);
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
	constructor (element: HTMLElement, objectConfig: any = null) {


		const proto 		= Accordion;
		const config 		= objectConfig 			? objectConfig 					: element.dataset;

		this.element		= element;

		this.id 			= element.id 			? element.id 					: proto.defaults.id + proto.totalInstances;
		this.transition		= config["transition"] 	? config["transition"]			: proto.defaults.transition;
		this.duration		= config["duration"] 	? config["duration"]			: proto.defaults.duration;
		this.easing			= config["easing"] 		? config["easing"]				: proto.defaults.easing;

		this.element.id		= this.id;

		this.#toggleElement		= element.querySelector(".toggle");
		this.#contentElement	= element.querySelector(".content");

		const contentStyles 	= window.getComputedStyle(this.#contentElement);

		this.#contentHeight 	= getContentHeight(this.#contentElement);
		this.#contentPadding	= contentStyles.getPropertyValue("padding");

		if (this.state !== "open") {
			hide(this.#contentElement, () => {
				this.state = `collapsed`;
			});
		}

		this.#toggleElement.addEventListener("click", () => {
			this.toggle();
		});

	} // end of constructor method

	collapse () : void {
		this.state = `collapsed`;

		// Slide transition
		if (this.transition === `slide`) {
			slideUp(this.#contentElement);
		}
		// No transition
		else {
			this.#contentElement.style.height = "0px";
			this.#contentElement.style.padding = "0px";
		}
	}

	open () {
		this.state = `open`;

		// Slide transition
		if (this.transition === `slide`) {
			slideDown(this.#contentElement);
		}
		// No transition
		else {
			this.#contentElement.style.height = this.#contentHeight + "px";
			this.#contentElement.style.padding = this.#contentPadding;
		}
	}

	toggle () : void {
		if (this.state === `collapsed`) {
			this.open();
		} else {
			this.collapse();
		}
	}

}
