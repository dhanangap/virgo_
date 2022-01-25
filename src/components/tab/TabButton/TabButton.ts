import Component 			from "../../base/Component"
import ComponentInterface 	from "../../base/ComponentInterface";
import TabComponent 		from "../TabComponent/TabComponent";

export default class TabButton extends Component {

	tab?: TabComponent;
	target?: number | string;

	get active(): boolean {
		return this.element.classList.contains("active");
	}

	set active(isActive: boolean) {
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
			this.target = config.target;
		}
		if (this.target !== undefined) {
			this.element.dataset["target"] = this.target + "";
		}
		this.initEvents();
		this.update();
	}

	initEvents () : void {
		this.element.addEventListener("click", () => {
			this.tab.goTo(this.target);
		});
	}

	update () : void {
		this.active = (this.target === this.tab.active);
	}

}