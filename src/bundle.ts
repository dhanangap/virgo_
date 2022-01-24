// -----------------------------------------------------------------------------------------------------------------------------
// - Import Components
// -----------------------------------------------------------------------------------------------------------------------------
import Accordion	from "./components/Accordion/Accordion";
import Modal		from "./components/Modal/Modal";
import Tab			from "./components/Tab/Tab.js";

import Carousel		from "./components/carousel/carousel.js";
import Gallery		from "./components/gallery/gallery.js";
import Map			from "./components/map/map.js";
import Rating		from "./components/rating/rating.js";
import Slider		from "./components/slider/slider.js";
import Stack		from "./components/stack/stack.js";
import Tagger		from "./components/tagger/tagger.js";

// -----------------------------------------------------------------------------------------------------------------------------
// - Browser Environment
// -----------------------------------------------------------------------------------------------------------------------------
if (window) {
	window.addEventListener('DOMContentLoaded', (event) => {
	    Accordion.init();
	    Modal.init();
	    Tab.init();
	});
}

// -----------------------------------------------------------------------------------------------------------------------------
// - Expose Components
// -----------------------------------------------------------------------------------------------------------------------------
export {
	Accordion,
	Carousel,
	Gallery,
	Map,
	Modal,
	Rating,
	Slider,
	Stack,
	Tab,
	Tagger
};
