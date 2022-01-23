import BaseComponent 	from "../BaseComponent";
import ModalConfig 		from "./ModalConfig";
// =============================================================================================================================
// - Virgo Component
// - Modal
// =============================================================================================================================
export default class Modal extends BaseComponent {

	// [ Class static properties ] =============================================================================================

	static defaultClass = "modal";

	static container?	: HTMLElement;
	static backdrop?	: HTMLElement;

	// [ Class static functions ] ==============================================================================================

	static init (selector?: string) : void {
		const elements = document.querySelectorAll(selector ? selector : `.${ this.defaultClass }`);
		if (elements.length > 0) {
			this.initContainer();
		}
		for (const element of elements) {
			const instance = new Modal(element);
			this.register(instance);
			this.container.appendChild(instance.element);
		}
	}

	static initContainer () : void {
		if (!this.container) {
			this.container = document.createElement("div");
			this.container.classList.add("modal-container");
			document.body.appendChild(this.container);
		}

		if (!this.backdrop) {
			this.backdrop = document.createElement("div");
			this.backdrop.classList.add("modal-backdrop");
			this.container.appendChild(this.backdrop);
		}
	}

	// [ Object properties ] ===================================================================================================

	// [ Object computed properties ] ==========================================================================================

	// [ Object instance functions ] ===========================================================================================

	constructor (element: HTMLElement | Element, config?: ModalConfig) {
		super(element);
	}

}
