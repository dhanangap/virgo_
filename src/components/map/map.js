// =============================================================================================================================
// - Virgo Component
// - Map
// =============================================================================================================================
/** Class representating a Map Component */
export class Map {

	// -------------------------------------------------------------------------------------------------------------------------
	// - Static Properties and Methods
	// -------------------------------------------------------------------------------------------------------------------------

	static apiKey;
	static initCallback;
	static isInitialized = false;
	static registry = [];
	static Popup;

	/** Initialize Map Class */
	static init (config, callback = undefined) {
		// Check whether API Key is provided
		if (!config.apiKey) {
			console.error("Please provide Google Maps JavaScript API Key.");
			return;
		}
		// Initialize static properties
		this.apiKey 	= config.apiKey;
		if (callback)	this.initCallback = callback;
		// Load Google Maps JavaScript API script
		this.loadScript();
	}

	/** Load API script from Google */
	static loadScript () {
		let script		= document.createElement('script');
		script.src		= `https://maps.googleapis.com/maps/api/js?key=${ this.apiKey }&libraries=drawing&callback=Map.loaded`;
		script.async 	= true;
		// Add script to head
		document.head.appendChild(script);
	}

	/** Method to run after script has been loaded */
	static loaded () {
		this.isInitialized = true;
		this.Popup = class Popup extends google.maps.OverlayView {

			position;
			container;

			constructor (position, content, data) {
				super();
				this.position	= position;

				this.container	= document.createElement("div");
				this.container.classList.add("popup-container");

				const tip = document.createElement("div");
				tip.classList.add("popup-tip");
				this.container.appendChild(tip);

				if (typeof content === "string") {
					const contentElement = document.createElement("div");
					contentElement.classList.add("popup-content");
					contentElement.innerHTML = nunjucks.renderString(content, data);
					tip.appendChild(contentElement);
				} else {
					const contentElement = content.cloneNode(true);
					contentElement.classList.add("popup-content");
					tip.appendChild(contentElement);
				}

				this.constructor.preventMapHitsAndGesturesFrom(this.container);
			}

			onAdd () {
				this.getPanes().floatPane.appendChild(this.container);
			}

			onRemove () {
				if (this.container.parentElement) {
					this.container.parentElement.removeChild(this.container);
				}
			}

			draw () {
				const divPosition 			= this.getProjection().fromLatLngToDivPixel(this.position);
				this.container.style.left	= divPosition.x + "px";
				this.container.style.top	= divPosition.y + "px";
			}

		} // Popup

		if (this.initCallback) this.initCallback();
	}

	// -------------------------------------------------------------------------------------------------------------------------
	// - Object Properties and Methods
	// -------------------------------------------------------------------------------------------------------------------------

	id;
	element;

	map;
	center;
	zoom;
	mapConfig;

	locations;
	customMarker;
	customMarkerClickEvent;
	customPopup;

	/** Create Map instance */
	constructor (selector, config) {

		// Check whether Map class has been initialized
		if (!this.constructor.isInitialized) {
			console.error("Please initialize Map class first using Map.init(config).");
			return;
		}

		// Initialize map element
		this.element = document.querySelector(selector);
		if (!this.element) {
			console.error(`Element with selector ${selector} is not found.`);
			return;
		}

		// Element identifier
		this.id = this.element.id ? this.element.id : `map-${ this.constructor.registry.length }`;
		this.element.id = this.id;

		// Initialize Google Map instance
		if (config.mapConfig) this.mapConfig = config.mapConfig;
		this.center	= config.center ? config.center : this.mapConfig.center;
		this.zoom	= config.zoom ? config.zoom : this.mapConfig.zoom;
		this.map 	= new google.maps.Map(this.element, {
			...this.mapConfig,
			center: this.center,
			zoom: this.zoom
		});

		// Initialize locations
		this.locations 				= [];
		this.customMarker 			= config.customMarker 		? config.customMarker 					: undefined;
		this.customMarkerClickEvent = config.customClickEvent 	? config.customMarkerClickEvent 		: undefined;
		this.customPopup 			= config.customPopup 		? config.customPopup					: undefined;
		if (config.locations) {
			config.locations.forEach(locationData => {
				const locationId = `location-` + this.locations.length;
				const location = new MapLocation(locationId, this, {
					...locationData,
					customClickEvent: this.customMarkerClickEvent
				});
			});
		}

		this.map.addListener("click", () => {
			this.locations.forEach(location => {
				location.removePopup();
			})
		})

	} // constructor

	/** Pan map to desired position */
	pan (position) {
		this.map.panTo(new google.maps.LatLng(position.lat + 0.085, position.lng - 0.06));
	}


} // Map

// =============================================================================================================================
// - Virgo Component
// - Map Location
// =============================================================================================================================
/** Class representating a Map Location */
export class MapLocation {
	id;
	title;
	address;
	position;
	photos;
	phone;
	data;

	parentMap;
	marker;

	popup;
	customClickEvent;

	externalTriggers;

	/** Create Map Location instance */
	constructor (id, parentMap, config) {
		this.parentMap 	= parentMap;

		this.id 		= id;
		this.title 		= config.title 		? config.title 			: null;
		this.address 	= config.address 	? config.address 		: null;
		this.photos 	= config.photos 	? config.photos 		: [];
		this.phone 		= config.phone 		? config.phone 			: [];
		this.data 		= config.data 		? config.data 			: {};

		if (config.photo) this.photos.push(config.photo);

		this.externalTriggers = [];

		this.position 	= {
			lat: config.lat,
			lng: config.lng
		};

		this.drawMarker();

		this.parentMap.locations.push(this);
	} // constructor

	/** Draw marker on the parent map */
	drawMarker () {
		let markerConfig = {
			position	: this.position,
			map			: this.parentMap.map
		}
		if (this.parentMap.customMarker) markerConfig.icon = this.parentMap.customMarker;
		this.marker = new google.maps.Marker(markerConfig);
		this.marker.addListener("click", () => {
			this.markerClicked();
		});
	}

	/** Clicked marker event */
	markerClicked () {
		this.parentMap.pan(this.position);

		this.parentMap.locations.forEach(location => {
			location.removePopup();
		});

		if (this.parentMap.customPopup) this.drawPopup();
		if (this.customClickEvent) this.customClickEvent();

		this.externalTriggers.forEach(trigger => {
			if (trigger.eventHandler) trigger.eventHandler();
		});

	}

	triggerMarkerClick () {
		this.markerClicked();
	}

	/** Draw custom popup */
	drawPopup () {
		this.popup = new Map.Popup(
			new google.maps.LatLng(this.position.lat, this.position.lng),
			this.parentMap.customPopup,
			{
				title: this.title,
				address: this.address,
				photos: this.photos,
				phone: this.phone
			}
		);
		this.popup.setMap(this.parentMap.map);
	}

	/** Remove custom popup */
	removePopup () {
		if (this.popup) this.popup.setMap(null);
	}

	registerTrigger (element, eventHandler = undefined) {
		element.addEventListener("click", () => {
			this.triggerMarkerClick();
		});
		this.externalTriggers.push({
			element, eventHandler
		});
	}

} // Location




// Make this class available globally
window["Map"] 			= Map;
window["MapLocation"] 	= MapLocation;
