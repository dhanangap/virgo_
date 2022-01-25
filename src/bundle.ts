import TabComponent from "./components/Tab/TabComponent/TabComponent";
if (window) {

	// Initialize components
	window.addEventListener('DOMContentLoaded', (event) => {
		TabComponent.init();
	});
}

export {
	TabComponent as Tab
};