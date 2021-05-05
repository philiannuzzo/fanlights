function yahoo(options) {
	const [, , leagueId, endPoint, subEndPoint] = pathname.split("/", 5);
	const isTeam = !isNaN(endPoint) && (!subEndPoint || subEndPoint === "team");
	const endPoints = [
		"players",
		"startingrosters",
		"playernotes",
		// "matchup",
		// "positioneligibility",
		"injuries",
		"cantcutlist",
		"playerchanges",
		"statcorrections",
		"research",
		"buzzindex",
		"whoshot",
		"keystosuccess",
		"assistantmanager",
		"playermatchups",
		"draftanalysis",
	];
	let playerNames = [];

	formatTable = () =>
		$("th.Ta-c").each(function () {
			if ($(this).text() === "Highlight" || $(this).text() === "Forecast") {
				$("thead .Ta-c:not(.pos,.edit)").replaceWith("<th></th>");
				$("tbody .Ta-c:not(.pos,.edit)").replaceWith("<td></td>");
				return;
			}
		});

	populatePlayerNames = (selector) =>
		$(selector).each(function () {
			playerNames.push(formatName($(this).text()));
		});

	initMutationObserver = () => {
		const targetNode = document
			.getElementsByClassName("fl-video-icon")[0]
			.closest("section");
		const observer = new MutationObserver(() => {
			playerNames = [];
			render();
		});
		observer.observe(targetNode, { childList: true });
	};

	render = () => {
		if (isTeam || endPoints.includes(endPoint)) {
			if (options.formatTable && (isTeam || endPoint === "players"))
				formatTable();
			populatePlayerNames(".name");
			insertVideoIcons(".playernote:not(.small)", playerNames);
		}
	};

	render();
	insertCarousel();
	return (isTeam || endPoint === "players") && initMutationObserver();
}
