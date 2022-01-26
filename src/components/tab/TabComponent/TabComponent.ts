import Component from "../../Base/Component";
import TabNav from "../TabNav/TabNav";
import TabPage from "../TabPage/TabPage";
import { getContentHeight } from "../../../helper/Dimension";

export default class TabComponent extends Component {

	// * Static Properties and Methods

	static className: string = "tab";

	// * Object Properties and Methods

	active		: number			= 0;
	transition	: string			= "none";
	nav 		: TabNav			= undefined;
	pages 		: Array<TabPage>	= [];

	constructor (element: HTMLElement | Element, config?: any) {
		super(element, config);

		let navSelector = ".nav";
		let pageSelector = ".pages .page";

		if (config) {
			this.active = isNaN(parseInt(config.active)) ? config.active : parseInt(config.active);
			this.transition = config.transition ? config.transition : "none";
			if (config.navSelector) navSelector = config.navSelector;
			if (config.pageSelector) pageSelector = config.pageSelector;
		}

		this.initNav(navSelector);
		this.initPages(pageSelector);
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
		let pageContainer = this.element.querySelector(".pages") as HTMLElement;
		let page = this.pages.find(page => page.active);
		if (pageContainer && page) {
			pageContainer.style.height = page.element.scrollHeight + "px";
		}
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