const { hostname, pathname } = document.location;

const carouselFrameUrl = chrome.runtime.getURL("carouselFrame.html");
const videoTabUrl = chrome.runtime.getURL("/icons/icon-19.png");
const videoIconUrl = chrome.runtime.getURL("/icons/video-icon.png");

chrome.runtime.sendMessage({ greeting: "showPageIcon" });

switch (hostname) {
	case "baseball.fantasysports.yahoo.com":
		yahoo();
		break;
	case "mlb-cuts-diamond.mlb.com":
	case "bdata-producedclips.mlb.com":
		$(() => chrome.runtime.sendMessage({ greeting: "popupReady" }));
		addEventListener("beforeunload", () =>
			chrome.runtime.sendMessage({
				greeting: "popupRemoved",
				left: screenLeft,
				top: screenTop,
			})
		);
		chrome.runtime.onMessage.addListener(({ greeting, url }) => {
			if (greeting === "updatePopup" && document.location.href !== url)
				document.location.href = url;
		});
}
