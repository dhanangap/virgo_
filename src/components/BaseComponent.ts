import BaseComponentConfig from "./BaseComponentConfig";

export default class BaseComponent {

	// [ Class static properties ] =============================================================================================
	static defaultClass : string 			= "component";
	static registry : Array<BaseComponent>	= [];

	// [ Class static computed properties ] ====================================================================================
	static get totalInstances () : number	{
		return this.registry.length;
	}

	// [ Class static functions ] ==============================================================================================
	static register (instance: BaseComponent) : void {
		const id 			= instance.id ? instance.id : this.defaultClass + "-" + this.totalInstances;
		instance.id 		= id;
		instance.element.id = id;
		this.registry.push(instance);
	}

	// [ Object properties ] ===================================================================================================
	id? 	: string;
	element : HTMLElement;

	// [ Object computed properties ] ==========================================================================================


	// [ Object instance functions ] ===========================================================================================
	constructor (element: HTMLElement | Element) {
		this.element		= element as HTMLElement;
		this.id 			= this.element.id ? this.element.id : undefined;
	}

}
