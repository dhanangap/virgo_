export class Slider {

    static timingFunction = "cubic-bezier(0.370, 0.140, 0.110, 0.995)";
    static transitionDuration = 1;

    static init() {

        let sliders = document.querySelectorAll(".slider");

        for (let index = 0; index < sliders.length; index++) {
            let slider = sliders[index];

            // ----- Variables

            let id;
            
            let indicator;
            let navigation;
            let nextButton;
            let prevButton;
            let slides;

            let totalSlides;
            let activeSlide;

            // ----- Initialize Elements
            if (slider.id === "") {
                slider.id = "slider-" + index;
            }
            id = slider.id;

            indicator = slider.querySelector(".indicator");
            if (!indicator) {
                indicator = document.createElement("div");
                indicator.classList.add("indicator");
                slider.appendChild(indicator);
            }

            navigation = slider.querySelector(".navigation");
            if (!navigation) {
                navigation = document.createElement("div");
                navigation.classList.add("navigation");
                slider.appendChild(navigation);
            }

            nextButton = navigation.querySelector(".next");
            if (!nextButton) {
                nextButton = document.createElement("button");
                nextButton.classList.add("slider-nav-next");
                nextButton.dataset["target"] = id;
                navigation.appendChild(nextButton);
            }

            prevButton = navigation.querySelector(".prev");
            if (!prevButton) {
                prevButton = document.createElement("button");
                prevButton.classList.add("slider-nav-prev");
                prevButton.dataset["target"] = id;
                navigation.appendChild(prevButton);
            }

            slides = slider.querySelector(".slides");
            if (!slides) {
                slides = document.createElement("div");
                slides.classList.add("slides");
                slider.appendChild(slides);
            }

            // ----- Initialize State

            totalSlides = slides.querySelectorAll(".slide").length;

            if (!slider.dataset["active"]) {
                slider.dataset["active"] = 0;
            };
            activeSlide = parseInt(slider.dataset["active"]);

            // ----- Initialize Indicator
            // Internal indicator
            for (let i = 0; i < totalSlides; i++) {
                let button = document.createElement("button");
                if (activeSlide === i) button.classList.add("active");
                button.dataset["target"] = id;
                button.dataset["index"] = i;
                indicator.addEventListener("click", indicatorButtonListener);
                indicator.appendChild(button);
            }
            // External indicator(s)
            let externalIndicators = document.querySelectorAll(`.slider-indicator[data-slider="${id}"]`);
            for (const indicator of externalIndicators) {
                for (let i = 0; i < totalSlides; i++) {
                    let button = document.createElement("button");
                    if (activeSlide === i) button.classList.add("active");
                    button.dataset["target"] = id;
                    button.dataset["index"] = i;
                    indicator.addEventListener("click", indicatorButtonListener);
                    indicator.appendChild(button);
                }
            }

            // ----- Set Active Slide
            this.setActiveIndex(id, activeSlide);

        };

        // ----- Initialize Navigation Buttons
        document.querySelectorAll(".slider-nav-prev").forEach(button => {
            button.addEventListener("click", navigationPrevButtonListener);
        });
        document.querySelectorAll(".slider-nav-next").forEach(button => {
            button.addEventListener("click", navigationNextButtonListener);
        });

    }

    // ===== Navigate to specific slide
    static setActiveIndex(sliderId, targetIndex) {

        let slider = document.querySelector("#" + sliderId);
        if (!slider) return;
        
        let slides = slider.querySelector(".slides");
        if (!slides) return;

        let slideElements = slides.querySelectorAll(".slide");
        if (!slideElements) return;

        const transition = slider.dataset["transition"];
        
        // ----- Set active index
        let target;
        const currentActiveIndex = parseInt(slider.dataset["active"]);

        if (targetIndex === "prev") {
            target = (currentActiveIndex === 0) ? (slideElements.length - 1) : (currentActiveIndex - 1);
        }
        else if (targetIndex === "next") {
            target = (currentActiveIndex === (slideElements.length - 1)) ? 0 : (currentActiveIndex + 1);
        }
        else {
            target = parseInt(targetIndex);
        }

        let targetSlide = slides.querySelectorAll(".slide")[target];
        if (!targetSlide) return;

        slider.dataset["active"] = target;

        // ----- Update indicator
        // Internal
        slider.querySelectorAll(".indicator button").forEach(button => {
            let index = parseInt(button.dataset["index"]);
            button.classList.remove("active");
            if (index === target) {
                button.classList.add("active");
            }
        });
        // External
        document.querySelectorAll(`.slider-indicator[data-slider=${sliderId}] button`).forEach(button => {
            let index = parseInt(button.dataset["index"]);
            button.classList.remove("active");
            if (index === target) {
                button.classList.add("active");
            }
        });

        // ----- Update slide
        let currentSlide = slideElements[currentActiveIndex];
        let nextSlide = slideElements[target];

        // First time
        if (currentActiveIndex === target) {
            nextSlide.classList.add("active");
        }

        // Fade
        else if (transition === "fade") {
            const currentStyle = getComputedStyle(currentSlide);
            // - Prepare current slide
            currentSlide.style.display = currentStyle.display;
            currentSlide.style.opacity = 1;
            currentSlide.style.zIndex = 8000;
            // - Prepare next slide
            nextSlide.style.display = currentStyle.display;
            nextSlide.style.opacity = 0;
            nextSlide.style.zIndex = 8001;
            // - Start transition
            setTimeout(() => {
                const transition = `opacity ${this.transitionDuration}s ${this.timingFunction}`;
                currentSlide.style.transition = transition;
                nextSlide.style.transition = transition;
                currentSlide.style.opacity = 0;
                nextSlide.style.opacity = 1;
            }, 5);
            // - Cleanup
            setTimeout(() => {
                currentSlide.style.transition = null;
                nextSlide.style.transition = null;
            }, this.transitionDuration * 1000);
        }

        // Fade
        else if (transition === "slide") {
            const direction = target - currentActiveIndex;
            const currentStyle = getComputedStyle(currentSlide);
            const currentWidth = currentSlide.getBoundingClientRect().width;

            // - Prepare current slide
            currentSlide.style.display = currentStyle.display;
            currentSlide.style.opacity = 1;
            currentSlide.style.zIndex = 8000;
            // - Prepare next slide
            nextSlide.style.display = currentStyle.display;
            nextSlide.style.opacity = 0.5;
            if (targetIndex === "prev" || direction < 0) {
                nextSlide.style.transform = `translateX(-${currentWidth}px)`;
            } else {
                nextSlide.style.transform = `translateX(${currentWidth}px)`;
            }
            nextSlide.style.zIndex = 8001;
            // - Start transition
            setTimeout(() => {
                const transition = `all ${this.transitionDuration}s ${this.timingFunction}`;
                currentSlide.style.transition = transition;
                nextSlide.style.transition = transition;
                currentSlide.style.opacity = 0.6;
                if (targetIndex === "prev" || direction < 0) {
                    currentSlide.style.transform = `translateX(${currentWidth}px)`;
                } else {
                    currentSlide.style.transform = `translateX(-${currentWidth}px)`;
                }
                nextSlide.style.opacity = 1;
                nextSlide.style.transform = `translateX(0)`;
            }, 5);
            // - Cleanup
            setTimeout(() => {
                currentSlide.style.transition = null;
                nextSlide.style.transition = null;
            }, this.transitionDuration * 1000);
        }

        // No transition
        else {
            currentSlide.classList.remove("active");
            nextSlide.classList.add("active");
        }
    }

}

function indicatorButtonListener (event) {
    let button = event.target;
    let sliderId = button.dataset["target"];
    let index = button.dataset["index"];
    Slider.setActiveIndex(sliderId, index);
}

function navigationPrevButtonListener(event) {
    let button = event.currentTarget;
    let sliderId = button.dataset["target"];
    let index = "prev";
    Slider.setActiveIndex(sliderId, index);
}

function navigationNextButtonListener(event) {
    let button = event.currentTarget;
    let sliderId = button.dataset["target"];
    let index = "next";
    Slider.setActiveIndex(sliderId, index);
}

