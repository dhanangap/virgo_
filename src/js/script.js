import { Button } from "./_button.js";
import { Form } from "./_form.js";
import { Navbar } from "./_navbar.js";

document.addEventListener('DOMContentLoaded', function () {
    
    Form.initForms();
    Button.initDropdownButtons();
    Navbar.initNavbar();

}, false);