import Component from "./Component";
import ComponentTemplate from "./Component.html";
import * as Nunjucks from "nunjucks";
import ComponentInterface from "./ComponentInterface";

export default class WebComponent extends HTMLElement {

	componentClass: typeof Component;
	template: string;
	element: HTMLElement;
	component: Component;
	
	constructor(componentClass: typeof Component, template: string, config?: ComponentInterface) {
		super();
		this.attachShadow({ mode: 'open' });
		
		this.componentClass = componentClass ? componentClass : Component;
		this.template = template ? template : ComponentTemplate;

		this.shadowRoot.innerHTML = this.template;
		this.shadowRoot.children[0].innerHTML = this.shadowRoot.host.innerHTML;
		
		this.component = new this.componentClass(this.shadowRoot.children[0], config);
	}

}