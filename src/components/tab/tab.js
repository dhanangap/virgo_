export class Tab {

    static transitionDuration = 0.3;
    static transitionEasing = "ease-out";

    static init() {

        let tabs = document.querySelectorAll(".tab");
        if (tabs.length > 0) {

            // ===== Initialize elements
            for (let index = 0; index < tabs.length; index++) {
                
                let tab = tabs[index];
                let id = tab.id ? tab.id : `tab-${index}`;
                tab.id = id;

                // ----- Tab Identifier
                let activeTabIndex = tab.dataset["active"] ? parseInt(tab.dataset["active"]) : 0;
                tab.dataset["active"] = activeTabIndex;
;

                // ----- Tab Pages
                let tabPages = tab.querySelectorAll(".tab-pages > .tab-page");
                if (!tabPages) return;
                
                for (let i = 0; i < tabPages.length; i++) {
                    let tabPage = tabPages[i];
                    tabPage.classList.remove("active");
                    if (i === activeTabIndex) tabPage.classList.add("active");
                }

                // Fix height issue for tabs with transition property
                let pagesContainer = tab.querySelector(".tab-pages");
                let activePage = pagesContainer.querySelector(".tab-pages > .tab-page.active");
                pagesContainer.style.height = activePage.getBoundingClientRect().height + "px";

                // ----- Navigation
                // - Internal
                let tabNavigation = tab.querySelector(".navigation");
                if (tabNavigation) {
                    let tabNavButtons = tabNavigation.querySelectorAll("button");
                    if (tabNavButtons) {
                        // Add data-tab attribute and active status
                        for (let i = 0; i < tabNavButtons.length; i++) {
                            // Active status
                            let button = tabNavButtons[i];
                            button.classList.remove("active");
                            // Data attributes
                            button.classList.add("tab-nav-button");
                            button.dataset["tab"] = id;
                            button.dataset["target"] = i;
                        }
                    }
                }
            }

            // ===== Add event listener to tab nav buttons
            for (const button of document.querySelectorAll(".tab-nav-button")) {
                const tabId = button.dataset["tab"];
                const index = button.dataset["target"];
                
                if (tabId && index) {
                    const tab = document.querySelector(`#${tabId}`);
                    if (tab) {
                        button.classList.remove("active")
                        if (parseInt(tab.dataset["active"]) === parseInt(index)) {
                            button.classList.add("active")
                        }
                        button.addEventListener("click", tabNavListener);
                    }
                }
            }
            
        }

    }

    // ===== Activate tab page
    static activate(tabId, index) {
        let tab = document.querySelector(`#${tabId}`);
        if (!tab) return;
        
        let pagesContainer = tab.querySelector(".tab-pages");
        if (!pagesContainer) return;

        let pages = pagesContainer.querySelectorAll(".tab-page");
        if (pages.length === 0) return;
        
        let currentPage = pages[parseInt( tab.dataset["active"] )];
        let targetPage = pages[index];

        if (!currentPage || !targetPage) return;        

        // ------ Start tab page activation
        const transition = tab.dataset["transition"];
        tab.dataset["active"] = index;
        
        // - No transition effect
        if (!transition) {
            currentPage.classList.remove("active");
            targetPage.classList.add("active");
        }
        
        // - Transition: Fade
        else if (transition === "fade") {
            currentPage.dataset["state"] = "transition-out";
            targetPage.dataset["state"] = "transition-in";
            pagesContainer.style.height = targetPage.getBoundingClientRect().height + "px";
            setTimeout(() => {
                currentPage.classList.remove("active");
            }, this.transitionDuration * 1000);
            setTimeout(() => {
                targetPage.classList.add("active");
            }, this.transitionDuration * 1000);
        }
        
        // ----- Tab navigation
        let buttons = document.querySelectorAll(`.tab-nav-button[data-tab=${tabId}]`);
        for (const button of buttons) {
            button.classList.remove("active");
            if (parseInt(button.dataset["target"]) === index) button.classList.add("active");
        }

    }

}

function tabNavListener (event) {
    const id = event.currentTarget.dataset["tab"];
    const index = event.currentTarget.dataset["target"];
    if (!id || !index) return;

    Tab.activate(id, parseInt(index));
}