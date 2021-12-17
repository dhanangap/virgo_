export class Button {

    static initDropdownButtons() {


        document.querySelectorAll(".button-dropdown").forEach(container => {

            const documentHeight = document.documentElement.getBoundingClientRect().height;

            const button = container.querySelector("button");
            const dropdown = container.querySelector(".dropdown");
            
            const buttonHeight = button.getBoundingClientRect().height;
            const dropdownHeight = dropdown.getBoundingClientRect().height;
            const posTop = button.getBoundingClientRect().top + window.scrollY + buttonHeight + 4;
            const posLeft = button.getBoundingClientRect().left + window.scrollX;

            const defaultDropdownDisplay = dropdown.style.display;
            if (!dropdown.dataset.state) dropdown.dataset.state = "hidden";
            dropdown.style.display = "none";

            let arrow = document.createElement("i");

            if (documentHeight > (posTop + dropdownHeight)) {
                // Bottom
                dropdown.style.top = posTop + "px";
                arrow.classList.add("icon-caret-down");
            } else {
                // Top
                dropdown.style.top = (posTop - (dropdownHeight + buttonHeight + 8)) + "px";
                arrow.classList.add("icon-caret-up");
            }
            dropdown.style.left = posLeft + "px";
            button.append(arrow);

            button.onclick = (event) => {
                if (dropdown.dataset.state === "hidden") {
                    this.openDropdown(container, defaultDropdownDisplay);
                }
                else if (dropdown.dataset.state === "shown") {
                    this.closeDropdown(container);
                }
            }
        });

    }

    static openDropdown(container, defaultDisplay) {
        const dropdown = container.querySelector(".dropdown");
        dropdown.style.display = defaultDisplay;
        setTimeout(() => {
            dropdown.dataset.state = "shown";
        }, 10);
        setTimeout(() => {
            document.addEventListener("click", closeDropdownListener);
        }, 10);
    }

    static closeDropdown(container) {
        const dropdown = container.querySelector(".dropdown");
        dropdown.dataset.state = "hidden";
        setTimeout(() => {
            dropdown.style.display = "none";
        }, 300);
    }

}

function closeDropdownListener(container) {
    document.querySelectorAll(".button-dropdown").forEach(container => {
        Button.closeDropdown(container);
        document.removeEventListener("click", closeDropdownListener)
    });
}