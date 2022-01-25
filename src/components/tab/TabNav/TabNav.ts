import Component 			from "../../Base/Component"
import ComponentInterface 	from "../../Base/ComponentInterface";
import TabButton 			from "../TabButton/TabButton";
import TabComponent 		from "../TabComponent/TabComponent";
import TabNavOverflow		from "./TabNavOverflow.html";

export default class TabNav extends Component {

	tab?: TabComponent;
	buttons: Array<TabButton> = [];

	constructor (element: HTMLElement | Element, config?: ComponentInterface) {
		super(element, config);
		if (config) this.tab = config.tab;
		this.initButtons("button");
		this.initEvents();
		this.update();
		this.updateOverflowNav();
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

	initEvents () : void {
		this.element.addEventListener("scroll", (event) => {
			this.updateOverflowNav();
		});
	}

	update () : void {
		if (this.element.scrollWidth > this.element.offsetWidth) {
			this.addOverflowNav();
		} else {
			this.removeOverflowNav();
		}
	}

	// Add overflow navigation buttons if content is wider than container
	addOverflowNav () {
		if (!this.tab.element.querySelector(".tab-nav-overflow")) {
			let overflow = document.createElement("div");
			overflow.setAttribute("class", "tab-nav-overflow");
			overflow.innerHTML = TabNavOverflow;
			this.tab.element.appendChild(overflow);

			const prevButton = overflow.querySelector(".tab-nav-prev");
			if (prevButton) {
				prevButton.addEventListener("click", () => {
					this.element.scroll({
						left: this.element.scrollLeft - (this.element.scrollWidth / 3),
						behavior: "smooth"
					});
				});
			}
			
			const nextButton = overflow.querySelector(".tab-nav-next");
			if (nextButton) {
				nextButton.addEventListener("click", () => {
					this.element.scroll({
						left: this.element.scrollLeft + (this.element.scrollWidth / 3),
						behavior: "smooth"
					});
				});
			}
		}
	}

	// Remove overflow navigation buttons if content is smaller than container
	removeOverflowNav () {
		let overflow = this.tab.element.querySelector(".tab-nav-overflow");
		if (overflow) overflow.remove();
	}

	// Show or hide overflow nav button based on scroll position
	updateOverflowNav () {
		// Back button
		if (this.element.scrollLeft > 0) {
			let button = this.tab.element.querySelector(".tab-nav-overflow .tab-nav-prev");
			if (button) button.classList.remove("hidden");
		} else {
			let button = this.tab.element.querySelector(".tab-nav-overflow .tab-nav-prev");
			if (button) button.classList.add("hidden");
		}
		// Next button
		if (this.element.scrollLeft < (this.element.scrollWidth - this.element.offsetWidth)) {
			let button = this.tab.element.querySelector(".tab-nav-overflow .tab-nav-next");
			if (button) button.classList.remove("hidden");
		} else {
			let button = this.tab.element.querySelector(".tab-nav-overflow .tab-nav-next");
			if (button) button.classList.add("hidden");
		}
	}

}