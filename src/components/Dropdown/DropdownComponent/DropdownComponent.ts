import Component from "../../Base/Component";
import ComponentInterface from "../../base/ComponentInterface";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

export default class DropdownComponent extends Component {
	
	// * Static Properties and Methods

	static className: string = "dropdown";
	static dropdownContainer: HTMLElement;

	static init(selector?: string, config?: ComponentInterface): void {
		super.init(selector, config);
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.closeAll();
			}
		});
		document.addEventListener("click", (event) => {
			if (!this.isInsideDropdown(event.x, event.y)) {
				this.closeAll();
			}
		});
		document.addEventListener("scroll", (event) => {
			const dropdowns = this.instances.filter(dropdown => dropdown.isOpen);
			dropdowns.forEach(dropdown => {
				(dropdown as DropdownComponent).menu.updatePosition();
			});

		});
	}

	static closeAll () : void {
		for (const dropdown of this.instances) {
			(dropdown as DropdownComponent).close();
		}
	}

	static isInsideDropdown (x: number, y: number) : boolean {
		let value = false;
		let i = 0;
		
		while (value === false && i < this.instances.length) {
			const dropdown = this.instances[i] as DropdownComponent;
			const dropdownRect = dropdown.element.getBoundingClientRect();
			const menuRect = dropdown.menu.element.getBoundingClientRect();

			const left		= (menuRect.left === 0) ? dropdownRect.left : Math.min(menuRect.left, dropdownRect.left);
			const right		= (menuRect.right === 0) ? dropdownRect.right : Math.max(menuRect.right, dropdownRect.right);
			const top		= (menuRect.top === 0) ? dropdownRect.top : Math.min(menuRect.top, dropdownRect.top);
			const bottom	= (menuRect.bottom === 0) ? dropdownRect.bottom : Math.max(menuRect.bottom, dropdownRect.bottom);

			value = (x >= left) &&
					(x <= right) &&
					(y >= top) &&
					(y <= bottom);

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
			document.body.appendChild(this.menu.element);
			this.menu.updatePosition();
		} else {
			this.element.appendChild(this.menu.element);
			this.element.removeAttribute("data-state");
		}
	}
	
	constructor(element: HTMLElement | Element, config?: any) {
		super(element, config);
		if (config) this.transition = config.transition ? config.transition : "none";

		let menuElement = this.element.querySelector(".dropdown-menu");
		if (!menuElement) {
			menuElement = this.element.querySelector(".dropdown-content")
		}

		this.button = new DropdownButton(this.element.querySelector("button"), { parent: this });
		this.menu = new DropdownMenu(menuElement, { parent: this });

	}

	toggleOpen () : void {
		this.isOpen = !this.isOpen;
	}

	close () : void {
		this.isOpen = false;
	}

}