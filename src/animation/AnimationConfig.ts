export interface AnimationConfig {
	duration?	: number;		// Animation duration in miliseconds
	easing?		: string;		// Animation timing function
	fill? 		: FillMode;		// How styles will be applied before and after execution
}

export const AnimationConfigDefault = {
	duration	: 300,
	easing 		: "ease-out",
	fill 		: "forwards"
};
