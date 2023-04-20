function exitCarousel() {
	Object.assign(carousel.style, {
		animationName: "exitCarousel",
		animationDuration: "300ms",
		bottom: "-265px",
	});
}

function enterCarousel() {
	Object.assign(carousel.style, {
		animationName: "enterCarousel",
		animationDuration: "200ms",
		bottom: "0px",
	});
}

function toggleCarousel() {
	if (carousel.style.animationName === "enterCarousel") exitCarousel();
	else enterCarousel();
}

async function insertCarousel() {
	const response = await fetch(carouselUrl);
	const text = await response.text();
	const clean = DOMPurify.sanitize(text, { SAFE_FOR_JQUERY: true, ADD_TAGS: ["iframe"] });

	$(clean).appendTo("body:first");
	$("#fanlights").attr("src", videoTabUrl);
	$("#videoTab").click(toggleCarousel);
	$("#carouselFrame").attr("src", carouselFrameUrl);

	carousel = document.getElementById("carousel");

	chrome.runtime.onMessage.addListener(({ greeting, errorMessage }) => {
		if (greeting === "enterCarousel") return enterCarousel();
		if (greeting === "logError") console.error("[fanlights.io]", errorMessage);
	});
}
