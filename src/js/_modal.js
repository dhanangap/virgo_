export class Modal {

    static init() {
        
        let modals = document.querySelectorAll(".modal");
        if (modals.length > 0) {

            // ===== [ Initialize Modal ]

            // ----- Create container element
            let container = document.createElement("div");
            container.classList.add("modal-container");
            container.dataset["state"] = "hidden";
            document.body.appendChild(container);

            // ----- Create backdrop element
            let backdrop = document.createElement("div");
            backdrop.classList.add("modal-backdrop");
            container.appendChild(backdrop);

            // ----- Initialize modal elements
            for (let i = 0; i < modals.length; i++) {
                let modal = modals[i].cloneNode(true);
                modals[i].remove();
                
                // - Put modal inside container
                container.appendChild(modal);

                // - Set modal identifier
                let id = modal.id ? modal.id : `modal-${i}`;
                modal.id = id;

                // - Initialize close button
                let close = modal.querySelector("button.close");
                if (close) {
                    close.dataset["modal"] = id;
                    close.addEventListener("click", closeListener);
                }

            }

            // ===== Initialize Toggle
            let toggles = document.querySelectorAll(".modal-toggle");
            if (toggles.length > 0) {
                for (const toggle of toggles) {
                    toggle.addEventListener("click", toggleListener);
                }
            }

        }

    }

    // ========== [ Display or Hide Modal ]
    static toggle(modalId, action = "open") {

        // ----- Display container
        
        let container = document.querySelector(`.modal-container`);
        if (!container) return;

        let backdrop = container.querySelector(`.modal-backdrop`);
        if (!backdrop) return;
        
        let modal = container.querySelector(`#${modalId}`);
        if (!modal) return;
        
        let activeId = container.dataset["active"];

        // ----- Close container
        if (action === "close") {
            container.dataset["state"] = "transition-out";
            setTimeout(() => {
                container.dataset["state"] = "hidden";
                container.dataset["active"] = null;
            }, 1500);
            return;
        }
        
        // ----- Toggle display/hide container state
        // - Show container
        if (container.dataset["state"] === "hidden") {
            container.dataset["state"] = "pre-transition";
            container.dataset["active"] = modal.id;
            modal.style.display = "block";
            setTimeout(() => {
                container.dataset["state"] = "transition-in";
            }, 5);
            setTimeout(() => {
                container.dataset["state"] = "visible";
            }, 5);
        }
        // - Toggle active modal
        else if (container.dataset["state"] === "visible" && activeId) {
        }
    }

    static close(modalId) {
        this.toggle(modalId, "close");
    }

}

function toggleListener(event) {
    const id = event.currentTarget.dataset["modal"];
    if (!id) return;
    
    Modal.toggle(id);
}

function closeListener(event) {
    const id = event.currentTarget.dataset["modal"];
    if (!id) return;

    Modal.close(id);
}