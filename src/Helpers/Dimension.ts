import { VerticalDimension } from "./VerticalDimension";

/** Get total content height inside element (including margin, padding, and border).*/
export function getContentHeight (element: HTMLElement | Element) : number {
	let height = 0;
	// - Calculate container padding
	const elementStyles	= window.getComputedStyle(element);
	height = height + parseFloat(elementStyles.getPropertyValue("padding-top"));
	height = height + parseFloat(elementStyles.getPropertyValue("padding-bottom"));

	// - Calculate content height
	for (const childNode of element.children) {
		const child 	= childNode as HTMLElement;
		const styles 	= window.getComputedStyle(child);

		height = height + child.offsetHeight;
		height = height + parseFloat(styles.getPropertyValue("margin-top"));
		height = height + parseFloat(styles.getPropertyValue("margin-bottom"));
	}
	return height;
}

/** Get actual dimension of element and its content even if it is hidden. */
export function getActualContentVerticalDimension (element: HTMLElement | Element) : VerticalDimension {
	let value: VerticalDimension = {
		height: 0,
		paddingTop: 0,
		paddingBottom: 0
	};

	const target 			= element as HTMLElement;
	const targetStyle		= window.getComputedStyle(target);

	const position 			= targetStyle.getPropertyValue("position");
	const display 			= targetStyle.getPropertyValue("display");
	const width 			= targetStyle.getPropertyValue("width");
	const height 			= targetStyle.getPropertyValue("height");
	const padding			= targetStyle.getPropertyValue("padding");
	const paddingTop		= targetStyle.getPropertyValue("padding-top");
	const paddingBottom		= targetStyle.getPropertyValue("padding-bottom");
	const visibility 		= targetStyle.getPropertyValue("visibility");

	// - Calculate target height
	target.style.position		= "absolute";
	target.style.display		= "block";
	target.style.width			= width;
	target.style.height			= "auto";
	target.style.padding		= "";
	target.style.paddingTop		= "";
	target.style.paddingBottom	= "";
	target.style.visibility		= "hidden";


	const computedStyle			= window.getComputedStyle(target);

	value.height 				= getContentHeight(target);
	value.paddingTop 			= parseFloat(computedStyle.getPropertyValue("padding-top"));
	value.paddingBottom 		= parseFloat(computedStyle.getPropertyValue("padding-bottom"));

	// - Return style to previous state
	target.style.position		= "";
	target.style.display		= display;
	target.style.width			= "";
	target.style.height			= height;
	target.style.padding		= "";
	target.style.paddingTop		= "";
	target.style.paddingBottom	= "";
	target.style.visibility		= "";

	return value;
}
