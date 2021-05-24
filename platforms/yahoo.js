function yahoo() {
	const [, , leagueId, endPoint, subEndPoint] = pathname.split("/", 5);
	const isTeam = !isNaN(endPoint) && (!subEndPoint || subEndPoint === "team");
	const endPoints = [
		"players",
		"startingrosters",
		"playernotes",
		// "matchup",
		// "positioneligibility",
		// "buzzindex",
		"injuries",
		"cantcutlist",
		"playerchanges",
		"statcorrections",
		"research",
		"whoshot",
		"keystosuccess",
		"assistantmanager",
		"playermatchups",
		"draftanalysis",
	];

	playerNames = (selector) => {
		let formatted = [];
		$(selector).each(
			(_i, { innerText }) => innerText && formatted.push(formatName(innerText))
		);
		return formatted;
	};

	initMutationObserver = () => {
		const targetNode = document
			.getElementsByClassName("playernote")[0]
			.closest("section");
		const observer = new MutationObserver(render);
		observer.observe(targetNode, { childList: true });
	};

	render = () =>
		insertVideoIcons(".playernote:not(.small)", playerNames(".name"));

	if (isTeam || endPoints.includes(endPoint)) {
		render();
		insertCarousel();
		if (isTeam || endPoint === "players") initMutationObserver();
	}
}
