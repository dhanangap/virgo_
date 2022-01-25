import Component 			from "../../Base/Component"
import ComponentInterface 	from "../../Base/ComponentInterface";
import TabComponent 		from "../TabComponent/TabComponent";

export default class TabPage extends Component {

	tab?: TabComponent;
	index?: number;

	get active () : boolean {
		return this.element.classList.contains("active");
	}

	set active (isActive: boolean) {
		if (isActive) {
			this.element.classList.add("active");
		} else {
			this.element.classList.remove("active");
		}
	}

	constructor(element: HTMLElement | Element, config?: ComponentInterface) {
		super(element, config);
		if (config) {
			this.tab = config.tab;
			this.index = config.index;
			this.active = (config.active != undefined) ? config.active : false;
		}
		if (this.index !== undefined) {
			this.element.dataset["index"] = this.index.toString();
		}
		this.update();
	}

	update(): void {
		this.active = (this.index === this.tab.active);
		this.element.classList.remove("before", "after");
		if (!this.active) {
			if (this.index < this.tab.active) {
				this.element.classList.add("before");
			}
			else {
				this.element.classList.add("after");
			}
		}
	}
}