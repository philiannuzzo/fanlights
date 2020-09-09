getAnimationName = () => $("#carousel").css("animation-name");

exitCarousel = () =>
	$("#carousel").css({
		"animation-name": "exitCarousel",
		"animation-duration": "300ms",
		bottom: "-265px",
	});

enterCarousel = () =>
	$("#carousel").css({
		"animation-name": "enterCarousel",
		"animation-duration": "200ms",
		bottom: "0px",
	});

toggleCarousel = () =>
	getAnimationName() === "enterCarousel" ? exitCarousel() : enterCarousel();

insertCarousel = async () => {
	await $.get(chrome.runtime.getURL("carousel.html"), (data) =>
		$(data).appendTo("body")
	);
	$("#fanlights").attr("src", videoTabUrl);
	$("#videoTab").click(toggleCarousel);
	$("#carouselFrame").attr("src", carouselFrameUrl);
};

populateCarousel = (docs) => {
	chrome.runtime.sendMessage({ greeting: "playHighlight", url: docs[0].url });
	chrome.runtime.sendMessage(
		{ greeting: "populateCarousel", docs: docs },
		({ farewell }) => farewell === "isPopulated" && enterCarousel()
	);
};
