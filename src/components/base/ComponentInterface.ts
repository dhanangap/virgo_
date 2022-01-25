import ComponentData from "./ComponentData";

export default interface ComponentInterface {
	
	id?			: string;
	element?	: HTMLElement;
	selector?	: string;
	data?		: ComponentData;

	[prop: string]: any;

}