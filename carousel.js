function getAnimationName() {
	return $("#carousel").css("animation-name");
}

function handleStatusError({ greeting, errorMessage }) {
	if (greeting === "statusError") console.error("[fanlights.io]", errorMessage);
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

function insertCarousel() {
	$.get(chrome.runtime.getURL("carousel.html"), (data) => {
		$(data).appendTo("body");
		$("#fanlights").attr("src", videoTabUrl);
		$("#videoTab").click(toggleCarousel);
		$("#carouselFrame").attr("src", carouselFrameUrl);
		chrome.runtime.onMessage.addListener(handleStatusError);
	});
}

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
	if (request.greeting === "enterCarousel") enterCarousel();
});
