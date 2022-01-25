import TabComponent from "./components/tab/TabComponent";

if (window) {
	window.addEventListener('DOMContentLoaded', (event) => {
		TabComponent.init();
	});
}

export {
	TabComponent as Tab
};