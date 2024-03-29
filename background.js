const { runtime, tabs, pageAction, storage, windows } = chrome;

//
storage.local.clear();

const lookupBase = "https://typeahead.mlb.com/api/v1/typeahead/suggestions/";
const searchBase = "https://www.mlb.com/data-service/en/search?tags.slug=playerid-";

let popupId, popupTabId;

popupData = (url) => ({
	url,
	type: "popup",
	width: 1280,
	height: 750,
	left: screen.width / 2 - 640,
	top: screen.height / 2 - 375, // firefox bug 1271047
});

function sendMessageWrapper(tabId, greeting, payload) {
	tabs.sendMessage(tabId, { greeting, ...payload });
}

async function fetchWrapper(resource, options = {}) {
	const timeout = options.timeout ? options.timeout : 5000;
	const abortController = new AbortController();
	const fetchTimeout = setTimeout(() => abortController.abort(), timeout);
	const response = await fetch(resource, { ...options, signal: abortController.signal });
	clearTimeout(fetchTimeout);
	return response;
}

function createPopup(url) {
	windows.create(popupData(url), (popup) => (popupId = popup.id));
}

function updatePopup(url) {
	windows.update(popupId, { focused: true }, () => {
		if (runtime.lastError) return createPopup(url);
		sendMessageWrapper(popupTabId, "updatePopup", { url });
	});
}

function resetPopup(tabId, heightOffset) {
	windows.update(popupId, { width: 1280, height: 720 + heightOffset }, () => {
		if (popupTabId !== tabId) popupTabId = tabId;
	});
}

function playHighlight(url) {
	storage.sync.get(null, ({ highBitrate }) => {
		if (highBitrate) url = url.replace("4000K", "16000K");
		popupId ? updatePopup(url) : createPopup(url);
	});
}

async function initiateCarousel(nameId, tabId) {
	try {
		const lookup = await fetchWrapper(lookupBase + nameId);
		if (!lookup.ok) throw new Error("Lookup status " + lookup.status);
		const { players } = await lookup.json();
		if (!players.length) throw new Error("Player lookup failed");
		const search = await fetchWrapper(searchBase + players[0].playerId);
		if (!search.ok) throw new Error("Search status " + search.status);
		const { docs } = await search.json();

		playHighlight(docs[0].url);
		sendMessageWrapper(tabId, "populateCarousel", { docs });
	} catch ({ name, message }) {
		const errorMessage = name === "AbortError" ? "The request timed out" : message;
		sendMessageWrapper(tabId, "logError", { errorMessage });
	}
}

runtime.onInstalled.addListener((details) => {
	if (details.reason === "install") tabs.create({ url: "options.html" });
});

runtime.onMessage.addListener(({ greeting, url, nameId, heightOffset }, sender) => {
	const tabId = sender.tab.id;

	if (greeting === "showPageIcon") pageAction.show(tabId);
	else if (greeting === "playHighlight") playHighlight(url);
	else if (greeting === "initiateCarousel") initiateCarousel(nameId, tabId);
	else if (greeting === "carouselReady") sendMessageWrapper(tabId, "enterCarousel");
	else if (greeting === "popupReady") resetPopup(tabId, heightOffset);
});
