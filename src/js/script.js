import { Button } from "./_button.js";
import { Form } from "./_form.js";
import { Navbar } from "./_navbar.js";
import { Slider } from "./_slider.js";
import { Modal } from "./_modal.js";
import { Tab } from "./_tab.js";
import { Tagger } from "./_tagger.js";
import { Carousel } from "./_carousel.js";
import { Gallery } from "./_gallery.js";

window.onload = () => {
    Form.initForms();
    Button.initDropdownButtons();
    Navbar.initNavbar();
    Slider.init();
    Modal.init();
    Tab.init();
    Tagger.init();
    Carousel.init();
    Gallery.init();
};

window.Modal = Modal;