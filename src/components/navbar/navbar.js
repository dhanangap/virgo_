import { slideDown, slideUp } from "./effects/_slide.js";

export class Navbar {

    static initNavbar() {

        document.querySelectorAll(".navbar").forEach(navbar => {

            if (navbar.classList.contains("fixed-top")) document.body.classList.add("has-navbar-fixed-top");
            if (navbar.classList.contains("fixed-bottom")) document.body.classList.add("has-navbar-fixed-bottom");
            
            let menu = navbar.querySelector(".menu");
            
            // ----- Dropdown
            navbar.querySelectorAll(".has-dropdown > a").forEach(dropdownToggle => {
                dropdownToggle.addEventListener("click", dropdownToggleListener);
            });

            // ----- Toggle Nav Button
            let toggleNavButton = navbar.querySelector(".toggle-nav-menu");
            if (!toggleNavButton) {
                toggleNavButton = document.createElement("button");
                toggleNavButton.classList.add("toggle-nav-menu");
                toggleNavButton.classList.add("hide-desktop");
                navbar.querySelector(".actions").appendChild(toggleNavButton);
            }
            toggleNavButton.addEventListener("click", (event) => {
                if (menu.classList.contains("open")) {
                    menu.classList.remove("open");
                    toggleNavButton.classList.remove("open");
                } else {
                    menu.classList.add("open");
                    toggleNavButton.classList.add("open");
                }
            });

        });

    }

}

function dropdownToggleListener(event) {
    event.preventDefault();
    if (window.innerWidth) {
        let parentElement = event.target.parentElement;
        let dropdown = parentElement.querySelector(".dropdown");
        if (parentElement.classList.contains("open")) {
            slideUp(dropdown);
            parentElement.classList.remove("open");
        } else {
            parentElement.classList.add("open");
            slideDown(dropdown);
        }
    }
}