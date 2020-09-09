const { runtime, tabs, pageAction, storage } = chrome;

const leftPos = screen.width / 2 - 620;
const topPos = screen.height / 2 - 360;
const features = `width=1240,height=720,left=${leftPos},top=${topPos}`;

runtime.onInstalled.addListener(
	({ reason }) => reason === "install" && tabs.create({ url: "options.html" })
);

runtime.onMessage.addListener(({ greeting, url }, { tab }) => {
	switch (greeting) {
		case "showPageIcon":
			pageAction.show(tab.id);
			break;
		case "playHighlight":
			storage.sync.get(null, ({ highBitrate }) => {
				if (highBitrate) url = url.replace("4000K", "16000K");
				window.open(url, "fanlights", features);
			});
	}
});
