import Component from "../base/Component"
import ComponentInterface from "../base/ComponentInterface";
import TabButton from "./TabButton";
import TabComponent from "./TabComponent";

export default class TabNav extends Component {

	tab?: TabComponent;
	buttons: Array<TabButton> = [];

	constructor (element: HTMLElement | Element, config?: ComponentInterface) {
		super(element, config);
		if (config) this.tab = config.tab;
		this.initButtons("button");
	}

	initButtons (selector: string) : void {
		const elements = this.element.querySelectorAll(selector);
		for (let i = 0; i < elements.length; i++) {
			this.buttons.push(new TabButton(elements[i], {
				selector,
				id: elements[i].id ? elements[i].id : undefined,
				tab: this.tab,
				target: i
			}));
		}
	}

}