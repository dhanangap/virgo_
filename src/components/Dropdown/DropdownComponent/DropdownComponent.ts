import Component from "../../Base/Component";
import ComponentInterface from "../../base/ComponentInterface";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

export default class DropdownComponent extends Component {
	
	// * Static Properties and Methods

	static className: string = "dropdown";

	static init(selector?: string, config?: ComponentInterface): void {
		super.init(selector, config);
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.closeAll();
			}
		});
		document.addEventListener("click", (event) => {
			if (!this.isInsideDropdown(event.target)) {
				this.closeAll();
			}
		});
	}

	static closeAll () : void {
		for (const dropdown of this.instances) {
			(dropdown as DropdownComponent).close();
		}
	}

	static isInsideDropdown (clickedElement: EventTarget) : boolean {
		let value = false;
		let i = 0;
		
		while (value === false && i < this.instances.length) {
			const dropdown = this.instances[i] as DropdownComponent;
			value = dropdown.element.contains(clickedElement as Node);
			i++;
		}

		return value;
	}

	// * Object Properties and Methods

	transition: string = "none";
	button?: DropdownButton;
	menu?: DropdownMenu;
	
	get isOpen () : boolean {
		return this.element.dataset["state"] === "open";
	}

	set isOpen (value: boolean) {
		if (value) {
			this.element.dataset["state"] = "open";
		} else {
			this.element.removeAttribute("data-state");
		}
	}
	
	constructor(element: HTMLElement | Element, config?: any) {
		super(element, config);
		if (config) this.transition = config.transition ? config.transition : "none";

		this.button = new DropdownButton(this.element.querySelector("button"), { parent: this });
		this.menu = new DropdownMenu(this.element.querySelector(".menu"), { parent: this });
	}

	toggleOpen () : void {
		this.isOpen = !this.isOpen;
	}

	close () : void {
		this.isOpen = false;
	}

}