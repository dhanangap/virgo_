/** Get total content height inside element (including margin, padding, and border).*/
export function getContentHeight (element: HTMLElement | Element) : number {
	let height = 0;
	for (const childNode of element.children) {
		const child 	= childNode as HTMLElement;
		const styles 	= window.getComputedStyle(child);

		height = height + child.offsetHeight;
		height = height + parseFloat(styles.getPropertyValue("margin-top"));
		height = height + parseFloat(styles.getPropertyValue("margin-bottom"));
	}

	return height;
}
