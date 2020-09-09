const lookupBase = "https://typeahead.mlb.com/api/v1/typeahead/suggestions/";
const searchBase =
	"https://www.mlb.com/data-service/en/search?tags.slug=playerid-";

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

insertVideoIcons = (selector, playerNames, videoIconUrl) => {
	$(selector).after(
		(i) => ` <img class="videoIcon" src=${videoIconUrl} id=${playerNames[i]} />`
	);
	$(".videoIcon").click(async function () {
		if (getAnimationName() === "enterCarousel") exitCarousel();
		const { players } = await $.get(lookupBase + this.id);
		const { docs } = await $.get(searchBase + players[0].playerId);
		populateCarousel(docs);
	});
};
