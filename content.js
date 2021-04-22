const { hostname, pathname } = document.location;

const videoIconUrl = chrome.runtime.getURL("videoIcon.png");
const carouselFrameUrl = chrome.runtime.getURL("carouselFrame.html");
const videoTabUrl = chrome.runtime.getURL("/icons/icon-19.png");

chrome.runtime.sendMessage({ greeting: "showPageIcon" });
if (hostname === "baseball.fantasysports.yahoo.com") yahoo();
