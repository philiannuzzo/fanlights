const { hostname, pathname, href } = document.location;

const carouselUrl = chrome.runtime.getURL("carousel.html");
const carouselFrameUrl = chrome.runtime.getURL("carouselFrame.html");
const videoTabUrl = chrome.runtime.getURL("/icons/icon-19.png");
const videoIconUrl = chrome.runtime.getURL("/icons/video-icon.png");

switch (hostname) {
	case "mlb-cuts-diamond.mlb.com":
	case "milb-cuts-diamond.mlb.com":
	case "bdata-producedclips.mlb.com":
	case "darkroom-clips.mlb.com":
		$(() => {
			chrome.runtime.onMessage.addListener(({ greeting, url }) => {
				if (greeting === "updatePopup" && href !== url) document.location.href = url;
			});
			chrome.runtime.sendMessage({
				greeting: "popupReady",
				heightOffset: window.outerHeight - window.innerHeight,
			});
		});
		break;
	case "baseball.fantasysports.yahoo.com":
		yahoo();
	default:
		chrome.storage.local.set({
			screenWidth: window.screen.width,
			screenHeight: window.screen.height,
		});
}
