export class Tagger {

	static init () {

		// ---------- Initialize all tagger elements
		let taggers = document.querySelectorAll(".tagger");
		for (let index = 0; index < taggers.length; index++) {
			const tagger = taggers[index];

			// ---------- Identifier
			let id = tagger.id;
			if (!id) {
				id = `tagger-${index}`;
				tagger.id = id;
			}

			// ---------- Target Image
			let targetImage = tagger.querySelector(".image > img");
			if(!targetImage) return;
			let targetRect = targetImage.getBoundingClientRect();

			// ---------- Tags
			let tags = tagger.querySelectorAll(".tags > .tag");
			let tagPoints = document.createElement("div");
			tagPoints.classList.add("tag-points");
			tagger.appendChild(tagPoints);
			for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
				const tag = tags[tagIndex];
				const x = tag.dataset["x"] ? parseFloat(tag.dataset["x"]) : 0;
				const y = tag.dataset["y"] ? parseFloat(tag.dataset["y"]) : 0;
				const label = tag.dataset["label"] ? tag.dataset["label"] : "";
				// - Add tagPoint to tagger
				let tagPoint = document.createElement("div");
				tagPoint.classList.add("tag-point");
				tagPoint.dataset["tagger"] = id;
				tagPoint.dataset["index"] = tagIndex;
				tagPoint.dataset["x"] = x;
				tagPoint.dataset["y"] = y;
				tagPoint.dataset["label"] = label;
				tagPoints.appendChild(tagPoint);
				// - Adjust tagPoint position
				const xPos = (targetRect.x - window.scrollX) + (targetImage.clientWidth * x);
				tagPoint.style.left = xPos + "px";
				const yPos = (window.scrollY) + (targetImage.clientHeight * y);
				tagPoint.style.top = yPos + "px";
				// - Add event listener
				const contentElement = tag.querySelector("div") ? tag.querySelector("div") : null;
				if (tag.dataset["click"]) {
					tagPoint.addEventListener("click", () => {
						window[tag.dataset["click"]]({
							taggerId: id,
							index: tagIndex,
							content: contentElement
						});
					});
				}
			}
			
		}

	}

}