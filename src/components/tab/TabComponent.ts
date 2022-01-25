import Component 	from "../base/Component";
import TabInterface from "./TabInterface";
import TabNav 		from "./TabNav";
import TabPage 		from "./TabPage";

export default class TabComponent extends Component implements TabInterface {

	// * Static Properties and Methods

	static className: string = "tab";

	// * Object Properties and Methods

	active		: number			= 0;
	transition	: string			= "none";
	nav 		: TabNav			= undefined;
	pages 		: Array<TabPage>	= [];

	constructor (element: HTMLElement | Element, config?: any) {
		super(element, config);

		if (config) {
			this.active = isNaN(parseInt(config.active)) ? config.active : parseInt(config.active);
			this.transition = config.transition ? config.transition : "none";
		}
		this.initNav(".nav");
		this.initPages(".pages .page");
		this.initEvents();
		this.updateHeight();
	}

	initNav (selector: string) : void {
		const element = this.element.querySelector(selector);
		this.nav = new TabNav(element, {
			selector,
			id: element.id ? element.id : undefined,
			tab: this,
		});
	}

	initPages (selector: string) : void {
		const elements = this.element.querySelectorAll(selector);
		for (let i = 0; i < elements.length; i++) {
			this.pages.push(new TabPage(elements[i], {
				selector,
				id: elements[i].id ? elements[i].id : undefined,
				tab: this,
				index: i,
				active: (i === this.active),
			}))
		}
	}

	initEvents () : void {
		if (window) {
			window.addEventListener("resize", () => {
				this.updateHeight();
			})
		}
	}

	updateHeight () : void {
		let height = 0;
		let page = this.pages.find(page => page.active);
		const navStyle = window.getComputedStyle(this.nav.element);
		const pageStyle = window.getComputedStyle(page.element);
		height = height + parseFloat(navStyle.getPropertyValue("margin-top"));
		height = height + parseFloat(navStyle.getPropertyValue("margin-bottom"));
		height = height + this.nav.element.offsetHeight + 1;
		height = height + parseFloat(pageStyle.getPropertyValue("margin-top"));
		height = height + parseFloat(pageStyle.getPropertyValue("margin-bottom"));
		height = height + page.element.offsetHeight;

		this.element.style.height = height + "px";
	}

	goTo (index: number | string) : void {
		
		let current = this.pages.find(page => page.index === this.active);
		let target;
		if (typeof index === "number") {
			target = this.pages.find(page => page.index === index);
		}
		else if (typeof index === "string") {
			target = this.pages.find(page => page.id === index);
		}
		if (target) {
			this.active = target.index;
			this.nav.buttons.forEach(button => {
				button.update();
			});
			this.pages.forEach(page => {
				page.update();
			});
			this.updateHeight();
		}
	}

}