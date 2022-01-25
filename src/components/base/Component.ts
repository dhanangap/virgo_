import ComponentData from "./ComponentData";
import ComponentInterface from "./ComponentInterface";

export default class Component implements ComponentInterface {

	// * Static Properties and Methods

	static className		: string 			= "component";
	static registry			: Array<Component>	= [];

	static generateId () : string {
		return this.className + "-" + this.registry.length;
	}

	static init (selector?: string, config?: ComponentInterface) : void {
		const query 	= selector ? selector : `.${this.className}`;
		const elements 	= document.querySelectorAll(query);
		for (const element of elements) {
			this.registry.push(new this(element as HTMLElement, {
				...(element as HTMLElement).dataset,
				...config,
				selector: query,
				id: this.generateId()
			}));
		}
	}

	// * Object Properties and Methods

	id? 		: string;
	element? 	: HTMLElement;
	selector?	: string;
	data		: ComponentData;
	config?		: ComponentInterface;

	constructor (element: HTMLElement | Element, config?: ComponentInterface) {

		const defaultId = config.id ? config.id : undefined;
		
		this.element 	= element as HTMLElement;
		this.id 		= this.element.id ? this.element.id : defaultId;
		this.selector	= config.selector ? config.selector : undefined;
		this.data 		= {};
		this.config		= config;

		if (this.id) this.element.id = this.id;

	}

}