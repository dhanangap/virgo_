import Component from "../../Base/Component";
import DropdownComponent from "../DropdownComponent/DropdownComponent";

export default class DropdownButton extends Component {
	
	parent?: DropdownComponent;

	constructor(element: HTMLElement | Element, config?: any) {
		super(element, config);
		if (config) {
			this.parent = config.parent;
		}
		this.element.addEventListener("click", () => {
			this.parent.toggleOpen();
		});
	}

}