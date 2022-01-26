import Component from "../../Base/Component";
import DropdownComponent from "../DropdownComponent/DropdownComponent";

export default class DropdownMenu extends Component {

	parent?: DropdownComponent;

	constructor(element: HTMLElement | Element, config?: any) {
		super(element, config);
		if (config) this.parent = config.parent ? config.parent : undefined;
	}

	updatePosition () {
		const parentBounds 			= this.parent.element.getBoundingClientRect();
		this.element.style.top		= (parentBounds.top + parentBounds.height + 5) + "px";
		this.element.style.left		= parentBounds.left + "px";
		this.element.style.width	= parentBounds.width + "px";
	}

}