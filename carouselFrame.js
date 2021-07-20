let thumbLoad = 0;
let state = {};

thumbPath = (i) => `docs[${i + state.page * 3}].image.cuts[0].src`;
titlePath = (i) => `docs[${i + state.page * 3}].title`;
urlPath = (i) => `docs[${i + state.page * 3}].url`;
idPath = (i) => `docs[${i + state.page * 3}].id`;
timePath = (i) => `docs[${i + state.page * 3}].date`;
durationPath = (i) => `docs[${i + state.page * 3}].duration`;

function setState(newState) {
	Object.assign(state, newState);
	renderCarousel();
}

function formatTime(timestamp) {
	const date = timestamp.split("T")[0];
	let today = new Date();
	today = today.toISOString().split("T")[0];
	const formatted = timestamp.split(".")[0].replace("T", " "); // YYYY-MM-DD hh:mm:ss
	if (date === today) return "<span class='new'>NEW</span> " + formatted;
	return formatted;
}

function formatTitle(title) {
	return title.substring(0, 55);
}

function handleClick(url, id) {
	chrome.runtime.sendMessage({ greeting: "playHighlight", url });
	setState({ activeId: id });
}

function handleThumbLoad() {
	thumbLoad++;
	if (thumbLoad === 3) {
		thumbLoad = 0;
		chrome.runtime.sendMessage({ greeting: "carouselReady" });
	}
}

function renderCarousel() {
	const { request, activeId, page } = state;

	$(".thumb")
		.attr("src", (i) => _.get(request, thumbPath(i)))
		.attr("id", (i) => _.get(request, idPath(i)))
		.off("click")
		.each((i, e) => {
			$(e).click(() => handleClick(_.get(request, urlPath(i)), e.id));
			activeId === e.id ? $(e).addClass("active") : $(e).removeClass("active");
		});
	$(".title-container")
		.off("click")
		.each((i, e) =>
			$(e).click(() => handleClick(_.get(request, urlPath(i)), _.get(request, idPath(i))))
		);
	$(".title").html((i) => formatTitle(_.get(request, titlePath(i))));
	$(".time").html((i) => formatTime(_.get(request, timePath(i))));
	$(".newer").attr("disabled", page === 0);
	$(".older").attr("disabled", page === 2);
	if ($("#initialContainer").css("display") !== "none") {
		$("#initialContainer").css("display", "none");
		$("#carouselContainer").css("display", "block");
		$(".newer").click(() => setState({ page: state.page - 1 }));
		$(".older").click(() => setState({ page: state.page + 1 }));
	}
}

function populateCarousel(request) {
	$(".thumb").one("load", handleThumbLoad);
	setState({
		request,
		activeId: request.docs[0].id,
		page: 0,
	});
}

chrome.runtime.onMessage.addListener((request) => {
	if (request.greeting === "populateCarousel") populateCarousel(request);
});

window.addEventListener("beforeunload", () => {
	if (!_.isEmpty(state)) chrome.storage.local.set({ carouselState: state });
});

chrome.storage.local.get("carouselState", ({ carouselState }) => {
	if (carouselState) setState(carouselState);
});
