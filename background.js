const { runtime, tabs, pageAction, storage, windows } = chrome;

const lookupBase = "https://typeahead.mlb.com/api/v1/typeahead/suggestions/";
const searchBase =
	"https://www.mlb.com/data-service/en/search?tags.slug=playerid-";

const leftPos = screen.width / 2 - 620;
const topPos = screen.height / 2 - 360;

let popupId;

popupData = (url) => ({
	url,
	type: "popup",
	height: 726,
	width: 1240,
	left: leftPos,
	top: topPos,
});

createPopup = (url) =>
	windows.create(popupData(url), (popup) => (popupId = popup.id));

replacePopup = (popupId, url) =>
	windows.remove(popupId, () => {
		createPopup(url);
		if (runtime.lastError) return;
	});

playHighlight = (url) => {
	storage.sync.get(null, ({ highBitrate }) => {
		if (highBitrate) url = url.replace("4000K", "16000K");
		!popupId ? createPopup(url) : replacePopup(popupId, url);
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

runtime.onMessage.addListener(({ greeting, url, playerName }, sender) => {
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
	}
});
