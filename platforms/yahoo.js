function yahoo() {
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

	// formatTable = () =>
	// 	$("th.Ta-c").each(function () {
	// 		if ($(this).text() === "Highlight" || $(this).text() === "Forecast") {
	// 			$("thead .Ta-c:not(.pos,.edit)").replaceWith("<th></th>");
	// 			$("tbody .Ta-c:not(.pos,.edit)").replaceWith("<td></td>");
	// 			return;
	// 		}
	// 	});

	playerNames = (selector) => {
		let formatted = [];
		$(selector).each(function () {
			formatted.push(formatName($(this).text()));
		});
		return formatted;
	};

	initMutationObserver = () => {
		const targetNode = document
			.getElementsByClassName("playernote")[0]
			.closest("section");
		const observer = new MutationObserver(() => render());
		observer.observe(targetNode, { childList: true });
	};

	render = () => {
		const names = playerNames(".name");
		insertVideoIcons(".playernote:not(.small)", names);
	};

	if (isTeam || endPoints.includes(endPoint)) render();
	insertCarousel();
	return (isTeam || endPoint === "players") && initMutationObserver();
}
