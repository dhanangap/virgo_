// -----------------------------------------------------------------------------------------------------------------------------
// - Import Components
// -----------------------------------------------------------------------------------------------------------------------------
import Accordion	from "./components/accordion/accordion.js";
import Carousel		from "./components/carousel/carousel.js";
import Gallery		from "./components/gallery/gallery.js";
import Map			from "./components/map/map.js";
import Modal		from "./components/modal/modal.js";
import Rating		from "./components/rating/rating.js";
import Slider		from "./components/slider/slider.js";
import Stack		from "./components/stack/stack.js";
import Tab			from "./components/tab/tab.js";
import Tagger		from "./components/tagger/tagger.js";

// -----------------------------------------------------------------------------------------------------------------------------
// - Browser Environment
// -----------------------------------------------------------------------------------------------------------------------------
if (window) {
	window.Accordion 	= Accordion;
	window.Carousel		= Carousel;
	window.Gallery		= Gallery;
	window.Map			= Map;
	window.Modal		= Modal;
	window.Rating		= Rating;
	window.Slider		= Slider;
	window.Stack		= Stack;
	window.Tab			= Tab;
	window.Tagger		= Tagger;
}
