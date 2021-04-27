const { hostname, pathname } = document.location;

const carouselFrameUrl = chrome.runtime.getURL("carouselFrame.html");
const videoTabUrl = chrome.runtime.getURL("/icons/icon-19.png");
const videoIconUrl = chrome.runtime.getURL("/icons/video-icon.png");

chrome.runtime.sendMessage({ greeting: "showPageIcon" });

if (hostname === "baseball.fantasysports.yahoo.com") yahoo();
