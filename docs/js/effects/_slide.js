export function slideDown(element, duration = 0.3) {

    let elementHeight = 0;
    const defaultStyleDisplay = element.style.display;
    const defaultStyleVisibility = element.style.visibility;
    const defaultStylePosition = element.style.position;
    const defaultElementStyle = element.style;

    // ----- Calculate dimensions
    element.style.display = "flex";
    element.style.visibility = "hidden";
    element.style.position = "absolute";
    elementHeight = element.getBoundingClientRect().height;

    // ----- Revert to default style
    element.style.display = defaultStyleDisplay;
    element.style.visibility = defaultStyleVisibility;
    element.style.position = defaultStylePosition;

    // ----- Start animation
    element.style.height = 0;
    element.style.padding = 0;
    element.style.margin = 0;
    element.style.display = "flex";
    element.style.overflow = "hidden";
    setTimeout(() => {
        element.style.transitionProperty = `height, margin, padding`;
        element.style.transitionDuration = `${duration}s`;
        element.style.transitionTimingFunction = `ease`;
        element.style.height = elementHeight + "px";
        element.style.padding = null;
        element.style.margin = null;
    }, 5);
    setTimeout(() => {
        element.style.height = "auto";
        element.style.transition = `none`;
    }, duration * 1000);
}

export function slideUp(element, duration = 0.3) {
    
    // ----- Calculate dimensions
    const elementHeight = element.getBoundingClientRect().height;
    const defaultStyle = element.style;
    element.style.height = elementHeight + "px";

    // ----- Start animation
    element.style.transitionProperty = `height, margin, padding`;
    element.style.transitionDuration = `${duration}s`;
    element.style.transitionTimingFunction = `ease`;
    setTimeout(() => {
        element.style.height = 0;
        element.style.padding = 0;
        element.style.margin = 0;
    }, 5);
    setTimeout(() => {
        element.style = defaultStyle;
        element.style.height = "auto";
        element.style.transition = `none`;
        element.style.display = `none`;
    }, duration * 1000);


}