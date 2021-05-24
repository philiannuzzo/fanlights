const { runtime, tabs, pageAction, storage, windows } = chrome;

const lookupBase = "https://typeahead.mlb.com/api/v1/typeahead/suggestions/";
const searchBase =
	"https://www.mlb.com/data-service/en/search?tags.slug=playerid-";

let popupId, popupTabId;

popupData = (url) => ({
	url,
	type: "popup",
	width: 1240,
	height: 726,
	left: screen.width / 2 - 620,
	top: screen.height / 2 - 363,
});

function sendMessageWrapper(tabId, greeting, payload) {
	console.log(...arguments);
	tabs.sendMessage(tabId, { greeting, ...payload });
}

function createPopup(url) {
	windows.create(popupData(url), (popup) => (popupId = popup.id));
}

function updatePopup(popupId, url) {
	windows.update(popupId, { focused: true }, () => {
		if (runtime.lastError) return createPopup(url);
		sendMessageWrapper(popupTabId, "updatePopup", { url });
	});
}

function playHighlight(url) {
	storage.sync.get(null, ({ highBitrate }) => {
		if (highBitrate) url = url.replace("4000K", "16000K");
		popupId ? updatePopup(popupId, url) : createPopup(url);
	});
}

async function initiateCarousel(playerName, tabId) {
	try {
		const lookup = await fetch(lookupBase + playerName);
		if (!lookup.ok) throw new Error("Lookup status " + lookup.status);
		const { players } = await lookup.json();

		const search = await fetch(searchBase + players[0].playerId);
		if (!search.ok) throw new Error("Search status " + search.status);
		const { docs } = await search.json();

		playHighlight(docs[0].url);
		sendMessageWrapper(tabId, "populateCarousel", { docs });
	} catch (error) {
		sendMessageWrapper(tabId, "statusError", { errorMessage: error.message });
	}
}

runtime.onInstalled.addListener((details) => {
	if (details.reason === "install") tabs.create({ url: "options.html" });
});

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
			sendMessageWrapper(tabId, "enterCarousel");
			break;
		case "popupReady":
			popupTabId = tabId;
	}
});
