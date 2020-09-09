var page = 0;
var activeId;

getThumbPath = (i) => `docs[${i + page * 3}].image.cuts[0].src`;
getTitlePath = (i) => `docs[${i + page * 3}].title`;
getUrlPath = (i) => `docs[${i + page * 3}].url`;
getIdPath = (i) => `docs[${i + page * 3}].id`;
getTimePath = (i) => `docs[${i + page * 3}].date`;
getDurationPath = (i) => `docs[${i + page * 3}].duration`;

formatTime = (timestamp) => {
	const date = timestamp.split("T")[0];
	let today = new Date();
	today = today.toISOString().split("T")[0];
	const formatted = timestamp.split(".")[0].replace("T", " "); // YYYY-MM-DD hh:mm:ss
	return date === today
		? "<span class='new'>NEW</span> " + formatted
		: formatted;
};

formatTitle = (title) => title.substring(0, 50);

handleClick = (url, id) => {
	chrome.runtime.sendMessage({ greeting: "playHighlight", url });
	$(".active").removeClass("active");
	$("#" + id).addClass("active");
	activeId = id;
};

reset = () => {
	$(".newer").attr("disabled", true);
	$(".older").attr("disabled", false);
	$(".thumb")
		.removeClass("active")
		.first()
		.addClass(function () {
			activeId = this.id;
			return "active";
		});
};

hydrate = (request) => {
	$(".thumb")
		.attr("src", (i) => _.get(request, getThumbPath(i)))
		.attr("id", (i) => _.get(request, getIdPath(i)))
		.each(function (i) {
			$(this)
				.off("click")
				.click(() => handleClick(_.get(request, getUrlPath(i)), this.id));
			activeId === this.id
				? $(this).addClass("active")
				: $(this).removeClass("active");
		});
	$(".title-container").each(function (i) {
		$(this)
			.off("click")
			.click(() =>
				handleClick(_.get(request, getUrlPath(i)), _.get(request, getIdPath(i)))
			);
	});
	$(".title").html((i) => formatTitle(_.get(request, getTitlePath(i))));
	$(".time").html((i) => formatTime(_.get(request, getTimePath(i))));
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
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.greeting === "populateCarousel") {
		page = 0;
		hydrate(request);
		$("#initialContainer").css("display", "none");
		$("#carouselContainer").css("display", "block");
		reset();
		sendResponse({ farewell: "isPopulated" });
	}
});
