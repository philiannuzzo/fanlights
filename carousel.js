function getAnimationName() {
	return $("#carousel").css("animation-name");
}

function exitCarousel() {
	$("#carousel").css({
		"animation-name": "exitCarousel",
		"animation-duration": "300ms",
		bottom: "-265px",
	});
}

function enterCarousel() {
	$("#carousel").css({
		"animation-name": "enterCarousel",
		"animation-duration": "200ms",
		bottom: "0px",
	});
}

function toggleCarousel() {
	if (getAnimationName() === "enterCarousel") exitCarousel();
	else enterCarousel();
}

async function insertCarousel() {
	const response = await fetch(chrome.runtime.getURL("carousel.html"));
	const carousel = await response.text();
	$(carousel).appendTo("body");
	$("#fanlights").attr("src", videoTabUrl);
	$("#videoTab").click(toggleCarousel);
	$("#carouselFrame").attr("src", carouselFrameUrl);
}

chrome.runtime.onMessage.addListener(({ greeting, errorMessage }) => {
	if (greeting === "enterCarousel") enterCarousel();
	else if (greeting === "logError") console.error("[fanlights.io]", errorMessage);
});
