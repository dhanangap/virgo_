export class Form {

    static initForms() {
        
        document.querySelectorAll("form").forEach(form => {
            this.addRequiredSymbol(form);
        });

    }

    static addRequiredSymbol(form, char = "*") {
        form.querySelectorAll(`[required]`).forEach(input => {
            input.parentElement.classList.add("required");
        });
        form.querySelectorAll(`[required="false"]`).forEach(input => {
            input.parentElement.classList.remove("required");
        });
    }

}