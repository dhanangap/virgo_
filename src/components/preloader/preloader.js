// =============================================================================================================================
// - Virgo
// - Preloader
// =============================================================================================================================
export default class Preloader {

	static element;
	static background;
	static backgroundFragments;
	static spinner;
	static loadingText;

	static intervalId;
	static cycleCount = 0;
	static isFinished = false;

	static init () {
		let body = document.querySelector("body[data-preloader]");
		if (!body) return;

		this.element = document.createElement("div");
		this.element.classList.add("preloader");
		body.appendChild(this.element);

		this.background = document.createElement("div");
		this.background.classList.add("background");
		this.element.appendChild(this.background);

		this.backgroundFragments = [];
		for (let i = 1; i <= 12; i++) {
			let fragment = document.createElement("div");
			this.background.appendChild(fragment);
			this.backgroundFragments.push(fragment);
			fragment.style.width = `100%`;
			fragment.style.height = `${100 / 12}%`;
		}

		this.spinner = document.createElement("div");
		this.spinner.classList.add("spinner");
		for (let i = 1; i <= 12; i++) {
			let fragment = document.createElement("div");
			this.spinner.appendChild(fragment);
		}
		this.element.appendChild(this.spinner);

		this.loadingText = document.createElement("div");
		this.loadingText.classList.add("loading-text");
		this.loadingText.textContent = "Loading";
		this.element.appendChild(this.loadingText);


		body.dataset["preloader"] = "loading";
		this.intervalId = setInterval(() => {
			if (this.isFinished && this.cycleCount > 0) {
				this.finishing();
				clearInterval(this.intervalId);
			}
			this.cycleCount++;
		}, 1200);

	}

	static finish () {
		let body = document.querySelector("body[data-preloader]");
		if (!body) return;

		this.isFinished = true;
	}

	static finishing () {
		let body = document.querySelector("body[data-preloader]");
		const duration = 300 + ((this.backgroundFragments.length - 1) * 100);
		body.dataset["preloader"] = "finishing";


		for (var i = 0; i < this.backgroundFragments.length; i++) {
			let fragment = this.backgroundFragments[i];
			setTimeout(() => {
				fragment.animate([
					{ transform: `translate3d(0,0,0)` },
					{ transform: `translate3d(100%,0,0)` }
				], {
					duration: 300,
					easing: "cubic-bezier(0.5, 0, 0.5, 1)"
				});
				fragment.style.transform = `translate3d(100%,0,0)`;
			}, (i * 100));
		}

		setTimeout(() => {
			this.element.style.display = `none`;
		}, duration);

	}

}

// Make this class globally available
if (window) window["Preloader"] = Preloader;

Preloader.init();
