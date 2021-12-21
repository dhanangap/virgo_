export class Carousel {

    static default = {
        col: 4,
        row: 1
    };

    static init () {

        let carousels = document.querySelectorAll(".carousel");
        if (carousels.length > 0) {

            // ====== Initialize each carousel elements
            for (let index = 0; index < carousels.length; index++) {
                const carousel = carousels[index];
                
                // - Identifier
                let id = carousel.id ? carousel.id : `carousel-${index}`;
                carousel.id = id;

                // - Active Page
                let activePage = carousel.dataset["active"] ? parseInt(carousel.dataset["active"]) : 0;
                carousel.dataset["active"] = activePage;

                // - Carousel dataset
                // Column
                let col = carousel.dataset["col"] ? parseInt(carousel.dataset["col"]) : this.default.col;
                carousel.dataset["col"] = col;
                // Row
                let row = carousel.dataset["row"] ? parseInt(carousel.dataset["row"]) : this.default.row;
                carousel.dataset["row"] = row;
                // Items
                let totalItems = 0;
                let totalColSpan = 0;
                let totalPages = 0;
                let items = carousel.querySelectorAll(".item");
                for (const item of items) {
                    const colspan = item.dataset["colspan"] ? parseInt(item.dataset["colspan"]) : 1;
                    totalItems = totalItems + 1;
                    totalColSpan = totalColSpan + colspan;
                }
                if (totalItems > 0) {
                    totalPages = Math.ceil(totalColSpan / col);
                }

                // Carousel dimension
                let carouselWidth = carousel.getBoundingClientRect().width;
                let carouselHeight = carousel.getBoundingClientRect().height;
                let colWidth = 1 / col;
                let colHeight = carouselHeight / row;

                // - Navigation Container
                let navContainer = document.createElement("div");
                navContainer.classList.add("nav-container");
                carousel.appendChild(navContainer);
                
                //  - Indicator element
                let indicator = document.createElement("div");
                indicator.classList.add("indicator");
                indicator.dataset["carousel"] = id;
                navContainer.appendChild(indicator);
                for (let i = 0; i < totalPages; i++) {
                    let button = document.createElement("button");
                    button.dataset["carousel"] = id;
                    button.dataset["target"] = i;
                    indicator.appendChild(button);
                }

                //  - Navigation element
                let navigation = document.createElement("div");
                navigation.classList.add("navigation");
                navigation.dataset["carousel"] = id;
                navContainer.appendChild(navigation);
                //  - Previous button
                let prevButton = document.createElement("button");
                prevButton.classList.add("carousel-prev", "button", "icon");
                let prevIcon = document.createElement("i");
                prevIcon.classList.add("icon");
                prevIcon.textContent = "arrow_back";
                prevButton.appendChild(prevIcon);
                prevButton.dataset["carousel"] = id;
                navigation.appendChild(prevButton);
                //  - Next button
                let nextButton = document.createElement("button");
                nextButton.classList.add("carousel-next", "button", "icon");
                let nextIcon = document.createElement("i");
                nextIcon.classList.add("icon");
                nextIcon.textContent = "arrow_forward";
                nextButton.appendChild(nextIcon);
                nextButton.dataset["carousel"] = id;
                navigation.appendChild(nextButton);

                // --------- Carousel Items
                let itemIndex = 0;
                let spanBuffer = 0;

                let pageContainer = document.createElement("div");
                pageContainer.classList.add("pages");
                carousel.appendChild(pageContainer);
                
                let page = document.createElement("div");
                page.classList.add("page");
                pageContainer.appendChild(page);
                
                while(itemIndex < totalItems) {
                    let item = items[itemIndex];
                    const itemColSpan = item.dataset["colspan"] ? parseInt(item.dataset["colspan"]) : 1;
                    
                    item.style.width = (colWidth * itemColSpan * 100) + "%";

                    if (spanBuffer >= col) {
                        page = document.createElement("div");
                        page.classList.add("page");
                        pageContainer.appendChild(page);
                        spanBuffer = 0;
                    }

                    page.appendChild(item.cloneNode(true));
                    item.remove();

                    spanBuffer = spanBuffer + itemColSpan;
                    itemIndex++;
                }

                // Adjust page height
                let pageElements = carousel.querySelectorAll(".page");
                for (let i = 0; i < pageElements.length; i++) {
                    let page = pageElements[i];
                    page.style.height = page.getBoundingClientRect().height + "px";
                    if (i === activePage) {
                        page.classList.add("active");
                    } else {
                        page.classList.add("hidden");
                    }
                }
                pageContainer.style.height = pageElements[0].style.height;

            }

        }

        // ===== Add event listeners
        let prevButtons = document.querySelectorAll(".carousel-prev");
        for (const button of prevButtons) {
            button.addEventListener("click", prevButtonListener)
        }
        let nextButtons = document.querySelectorAll(".carousel-next");
        for (const button of nextButtons) {
            button.addEventListener("click", nextButtonListener)
        }

    }

    // ========== [ Navigation ]
    static goToPage(carouselId, target) {
        let carousel = document.querySelector(`#${carouselId}`);
        if (!carousel) return;

        const currentIndex = carousel.dataset["active"] ? parseInt(carousel.dataset["active"]) : 0;

        let pages = carousel.querySelectorAll(".pages > .page");
        if (pages.length <= 0) return;

        let targetIndex = 0;
        let direction = 1;
        if (target === "next") {
            targetIndex = currentIndex + 1;
            if (targetIndex >= pages.length) targetIndex = 0;
        }
        else if (target === "prev") {
            targetIndex = currentIndex - 1;
            if (targetIndex < 0) targetIndex = pages.length - 1;
            direction = -1;
        }
        else {
            targetIndex = parseInt(target);
            if (targetIndex < currentIndex) direction = -1;
        }

        let currentPage = pages[currentIndex];
        if (!currentPage) return;

        let targetPage = pages[targetIndex];
        if (!targetPage) return;

        // - Start transition
        targetPage.style.transform = `translateX(${100 * direction}%)`;
        setTimeout(() => {
            targetPage.classList.remove("hidden");
            currentPage.style.transition = `transform 0.5s ease-out`;
            targetPage.style.transition = `transform 0.5s ease-out`;
        }, 5);
        setTimeout(() => {
            currentPage.style.transform = `translateX(${-100 * direction}%)`;
            targetPage.style.transform = `translateX(0)`;
        }, 5);
        setTimeout(() => {
            targetPage.classList.add("active");
            currentPage.classList.remove("active");
            currentPage.classList.add("hidden");
            currentPage.style.transform = null;
            currentPage.style.transition = null;
            targetPage.style.transform = null;
            targetPage.style.transition = null;
        }, 0.5 * 1000);

        // - Update active index
        carousel.dataset["active"] = targetIndex;

    }

}

// ========== [ Event Listeners ]

// ---------- Indicator Event Listener
function indicatorButtonListener (event) {
    console.log(event.currentTarget);
}

// ---------- Navigation Event Listener
function prevButtonListener(event) {
    const button = event.currentTarget;
    const carouselId = button.dataset["carousel"];
    if (!carouselId) return;

    Carousel.goToPage(carouselId, "prev");
}
function nextButtonListener(event) {
    const button = event.currentTarget;
    const carouselId = button.dataset["carousel"];
    if (!carouselId) return;

    Carousel.goToPage(carouselId, "next");
}