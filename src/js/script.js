import { Button } from "./_button.js";
import { Form } from "./_form.js";
import { Navbar } from "./_navbar.js";
import { Slider } from "./_slider.js";
import { Modal } from "./_modal.js";

document.addEventListener('DOMContentLoaded', function () {
    
    Form.initForms();
    Button.initDropdownButtons();
    Navbar.initNavbar();
    Slider.init();
    Modal.init();

}, false);