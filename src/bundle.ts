import DropdownComponent from "./components/Dropdown/DropdownComponent/DropdownComponent";
import TabComponent from "./components/Tab/TabComponent/TabComponent";
if (window) {

	// Initialize components
	window.addEventListener('DOMContentLoaded', (event) => {
		DropdownComponent.init();
		TabComponent.init();
	});
}

export {
	DropdownComponent as Dropdown,
	TabComponent as Tab,
};