import { AnimationConfig, AnimationConfigDefault } from "./AnimationConfig";
import { getActualContentVerticalDimension } from "../helpers/dimension";
// =============================================================================================================================
// - Virgo Animation
// - Slide
// =============================================================================================================================

/** Show element using slide up animation */
export function slideDown (element: HTMLElement | Element, config?: AnimationConfig, callback?: Function) {
	const target 			= element as HTMLElement;
	const targetDimension	= getActualContentVerticalDimension(target);
	const conf 				= { ...AnimationConfigDefault, ...config };

	console.log(targetDimension);


	target.style.display = "";
	target.animate([
		{ height: "0px", paddingTop: "0px", paddingBottom: "0px" },
		{
			height: targetDimension.height + "px",
			paddingTop: targetDimension.paddingTop + "px",
			paddingBottom: targetDimension.paddingBottom + "px"
		},
	], {
		duration: conf.duration,
		easing	: conf.easing
	});

	setTimeout(() => {
		target.style.height = "auto";
		target.style.paddingTop = targetDimension.paddingTop + "px";
		target.style.paddingBottom = targetDimension.paddingBottom + "px";
		if (callback) callback();
	}, conf.duration - 10);
}

/** Hide element using slide up animation */
export function slideUp (element: HTMLElement | Element, config?: AnimationConfig, callback?: Function) {
	const target 			= element as HTMLElement;
	const targetDimension	= getActualContentVerticalDimension(target);
	const conf 				= { ...AnimationConfigDefault, ...config };

	target.animate([
		{
			height: targetDimension.height + "px",
			paddingTop: targetDimension.paddingTop + "px",
			paddingBottom: targetDimension.paddingBottom + "px"
		},
		{ height: "0px", paddingTop: "0px", paddingBottom: "0px" },
	], {
		duration: conf.duration,
		easing	: conf.easing,
	});

	setTimeout(() => {

		target.style.display = "none";

		if (callback) callback();
	}, conf.duration - 10);
}
