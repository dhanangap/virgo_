// =============================================================================================================================
// - Virgo Animation
// - Show
// =============================================================================================================================

/** Hide an element */
export function hide (element: HTMLElement | Element, callback?: Function) : void {
	const target = element as HTMLElement;
	target.style.display = "none";
	if (callback) callback();
}

/** Show an element */
export function show (element: HTMLElement | Element, callback?: Function) : void {
	const target = element as HTMLElement;
	if (target.style.display === "none")		target.style.display 	= "block";
	if (parseFloat(target.style.opacity) === 0)	target.style.opacity 	= "1";
	if (parseFloat(target.style.height) === 0)	target.style.height 	= "auto";
	if (callback) callback();
}
