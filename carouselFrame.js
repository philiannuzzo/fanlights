var page = 0;
var activeId;
var thumbLoad = 0;

thumbPath = (i) => `docs[${i + page * 3}].image.cuts[0].src`;
titlePath = (i) => `docs[${i + page * 3}].title`;
urlPath = (i) => `docs[${i + page * 3}].url`;
idPath = (i) => `docs[${i + page * 3}].id`;
timePath = (i) => `docs[${i + page * 3}].date`;
durationPath = (i) => `docs[${i + page * 3}].duration`;

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
	$(".active").removeClass("active");
	$("#" + id).addClass("active");
	activeId = id;
}

function reset() {
	$(".newer").attr("disabled", true);
	$(".older").attr("disabled", false);
	$(".thumb")
		.removeClass("active")
		.first()
		.addClass(function () {
			activeId = this.id;
			return "active";
		});
	$("#initialContainer").css("display", "none");
	$("#carouselContainer").css("display", "block");
}

function hydrate(request) {
	$(".thumb")
		.attr("src", (i) => _.get(request, thumbPath(i)))
		.attr("id", (i) => _.get(request, idPath(i)))
		.each(function (i) {
			$(this)
				.off("click")
				.click(() => handleClick(_.get(request, urlPath(i)), this.id));
			activeId === this.id
				? $(this).addClass("active")
				: $(this).removeClass("active");
		});
	$(".title-container").each(function (i) {
		$(this)
			.off("click")
			.click(() =>
				handleClick(_.get(request, urlPath(i)), _.get(request, idPath(i)))
			);
	});
	$(".title").html((i) => formatTitle(_.get(request, titlePath(i))));
	$(".time").html((i) => formatTime(_.get(request, timePath(i))));
	$(".newer")
		.off("click")
		.click(function () {
			page--;
			$(".older").attr("disabled", false);
			if (page === 0) $(this).attr("disabled", true);
			hydrate(request);
		});
	$(".older")
		.off("click")
		.click(function () {
			page++;
			$(".newer").attr("disabled", false);
			if (page === 2) $(this).attr("disabled", true);
			hydrate(request);
		});
}

function resetThumbLoad() {
	thumbLoad = 0;
	$("img.thumb").off("load");
	chrome.runtime.sendMessage({ greeting: "isPopulated" });
}

function handleThumbLoad() {
	thumbLoad++;
	if (thumbLoad === 3) resetThumbLoad();
}

function populateCarousel(request) {
	page = 0;
	$("img.thumb").on("load", handleThumbLoad);
	hydrate(request);
	reset();
}

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
	if (request.greeting === "populateCarousel") populateCarousel(request);
});
