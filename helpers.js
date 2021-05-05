videoIcon = (id) =>
	` <img class="fl-video-icon" id=${id} src=${videoIconUrl} />`;

formatName = (name) => {
	var rExps = [
		{ re: /[\xC0-\xC6]/g, ch: "A" },
		{ re: /[\xE0-\xE6]/g, ch: "a" },
		{ re: /[\xC8-\xCB]/g, ch: "E" },
		{ re: /[\xE8-\xEB]/g, ch: "e" },
		{ re: /[\xCC-\xCF]/g, ch: "I" },
		{ re: /[\xEC-\xEF]/g, ch: "i" },
		{ re: /[\xD2-\xD6]/g, ch: "O" },
		{ re: /[\xF2-\xF6]/g, ch: "o" },
		{ re: /[\xD9-\xDC]/g, ch: "U" },
		{ re: /[\xF9-\xFC]/g, ch: "u" },
		{ re: /[\xD1]/g, ch: "N" },
		{ re: /[\xF1]/g, ch: "n" },
	];
	for (var i = 0, len = rExps.length; i < len; i++)
		name = name.replace(rExps[i].re, rExps[i].ch);
	return escape(name);
};

handleClick = (e) => {
	e.stopPropagation();
	if (getAnimationName() === "enterCarousel") exitCarousel();
	chrome.runtime.sendMessage({
		greeting: "initiateCarousel",
		playerName: e.target.id,
	});
};

insertVideoIcons = (selector, playerNames) => {
	$(selector).after((i) => videoIcon(playerNames[i]));
	$(".fl-video-icon").click(handleClick);
};
