const { runtime, tabs, pageAction, storage, windows } = chrome;

const lookupBase = "https://typeahead.mlb.com/api/v1/typeahead/suggestions/";
const searchBase =
	"https://www.mlb.com/data-service/en/search?tags.slug=playerid-";

let leftDefault = screen.width / 2 - 620;
let topDefault = screen.height / 2 - 363;
let popupId;

popupData = (url, left = leftDefault, top = topDefault) => ({
	url,
	type: "popup",
	height: 726,
	width: 1240,
	left,
	top,
});

createPopup = (url, left, top) =>
	windows.create(popupData(url, left, top), (popup) => {
		popupId = popup.id;
		windows.update(popupId, { left, top }); // firefox bug 1271047
	});

replacePopup = (popupId, url) =>
	windows.get(popupId, (details) => {
		if (runtime.lastError) return createPopup(url);
		windows.remove(popupId, () => createPopup(url, details.left, details.top));
	});

playHighlight = (url) => {
	storage.sync.get(null, ({ highBitrate }) => {
		if (highBitrate) url = url.replace("4000K", "16000K");
		popupId ? replacePopup(popupId, url) : createPopup(url);
	});
};

initiateCarousel = async (playerName, tabId) => {
	try {
		const lookup = await fetch(lookupBase + playerName);
		if (!lookup.ok) throw new Error("Lookup status " + lookup.status);
		const { players } = await lookup.json();

		const search = await fetch(searchBase + players[0].playerId);
		if (!search.ok) throw new Error("Search status " + search.status);
		const { docs } = await search.json();

		tabs.sendMessage(tabId, { greeting: "populateCarousel", docs });

		playHighlight(docs[0].url);
	} catch (error) {
		console.error(error);
	}
};

runtime.onInstalled.addListener(
	({ reason }) => reason === "install" && tabs.create({ url: "options.html" })
);

runtime.onMessage.addListener(
	({ greeting, url, playerName, left, top }, sender) => {
		const tabId = sender.tab.id;

		switch (greeting) {
			case "showPageIcon":
				pageAction.show(tabId);
				break;
			case "playHighlight":
				playHighlight(url);
				break;
			case "initiateCarousel":
				initiateCarousel(playerName, tabId);
				break;
			case "isPopulated":
				tabs.sendMessage(tabId, { greeting: "enterCarousel" });
				break;
			case "popupRemoved":
				leftDefault = left;
				topDefault = top;
		}
	}
);
