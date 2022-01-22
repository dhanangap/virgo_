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
