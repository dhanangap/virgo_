export function slideDown(element, duration = 0.3) {

    let elementHeight = 0;
    const defaultStyleDisplay = element.style.display;
    const defaultStyleVisibility = element.style.visibility;
    const defaultStylePosition = element.style.position;

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
    element.style.transition = `height ${duration}s ease-out`;
    element.style.height = 0;
    element.style.display = "flex";
    element.style.overflow = "hidden";
    setTimeout(() => {
        element.style.height = elementHeight + "px";
    }, 5);
    setTimeout(() => {
        element.style.height = "auto";
        element.style.transition = `none`;
    }, duration * 1000);
}

export function slideUp(element, duration = 0.3) {
    
    // ----- Calculate dimensions
    const elementHeight = element.getBoundingClientRect().height;
    element.style.height = elementHeight + "px";

    // ----- Start animation
    element.style.transition = `height ${duration}s ease`;
    setTimeout(() => {
        element.style.height = 0;
    }, 5);
    setTimeout(() => {
        element.style.height = "auto";
        element.style.transition = `none`;
        element.style.display = `none`;
    }, duration * 1000);


}