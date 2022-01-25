import Component from "../../Base/Component";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

export default class DropdownComponent extends Component {
	
	// * Static Properties and Methods

	static className: string = "dropdown";

	// * Object Properties and Methods

	transition: string = "none";
	button?: DropdownButton;
	menu?: DropdownMenu;
	
	constructor(element: HTMLElement | Element, config?: any) {
		super(element, config);
		if (config) this.transition = config.transition ? config.transition : "none";

		this.button = new DropdownButton(this.element.querySelector("button"));
		this.menu = new DropdownMenu(this.element.querySelector(".menu"));
	}

}