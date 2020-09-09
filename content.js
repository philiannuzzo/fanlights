const { hostname, pathname } = document.location;
const videoIconUrl = chrome.runtime.getURL("videoIcon.png");
const carouselFrameUrl = chrome.runtime.getURL("carouselFrame.html");
const videoTabUrl = chrome.runtime.getURL("/icons/icon-19.png");

// chrome.storage.sync.get(null, (result) => {
// 	if (document.location.hostname == "baseball.fantasysports.yahoo.com")
// 		yahoo(result);
// 	else if (document.location.hostname == "games.espn.com") espn(result);
// });

chrome.runtime.sendMessage({ greeting: "showPageIcon" });
if (hostname === "baseball.fantasysports.yahoo.com") yahoo();
