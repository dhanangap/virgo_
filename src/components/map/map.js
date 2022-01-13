// =============================================================================================================================
// - Virgo Component
// - Map
// =============================================================================================================================
/** Class representating a Map Component */
export class Map {

	// =========================================================================================================================
	// - Static Properties
	// =========================================================================================================================

	static isInitialized;
	static apiKey;
	static defaults				= {};
	static registry				= [];

	// =========================================================================================================================
	// - Object Properties
	// =========================================================================================================================

	id;
	element;
	map;

	// =========================================================================================================================
	// - Static Methods
	// =========================================================================================================================
	static init (config) {
		this.apiKey = config.apiKey;
		this.maps 	= config.maps;

		// Load Google Maps API
		let script		= document.createElement('script');
		script.src		= `https://maps.googleapis.com/maps/api/js?key=${ this.apiKey }&callback=Map.loaded`;
		script.async 	= true;
		// Add script to head
		document.head.appendChild(script);
	}

	static loaded () {
		for (let mapConfig of this.maps) {
			let map = new Map(mapConfig);
		}
	}

	// =========================================================================================================================
	// - Object Methods
	// =========================================================================================================================

	/** Construct a new instance */
	constructor (config) {
		this.map = new google.maps.Map(document.querySelector(config.selector), {
			center: { lat: -34.397, lng: 150.644 },
			zoom: 8,
		});
	}

}

// Make this class available globally
window["Map"] = Map;
