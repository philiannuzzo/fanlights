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
		"whoshot",
		"keystosuccess",
		"assistantmanager",
		"playermatchups",
		"draftanalysis",
	];
	let playerNames = [];

	removeHlCol = () =>
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

	if (isTeam || endPoint === "players") removeHlCol();

	if (isTeam) {
		$("#statnav a").removeClass();
		$("#statsubnav a").removeClass().parent().css("padding", "5px 10px");
		populatePlayerNames(".name");
	} else if (endPoints.includes(endPoint)) {
		populatePlayerNames(".name");
	} else if (pathname === `/b1/${leagueId}` || endPoint === "transactions") {
		populatePlayerNames(".Tst-transaction-table .Pbot-xs a:not(.playernote)");
	} else return;

	insertVideoIcons(".playernote:not(.small)", playerNames, videoIconUrl);
	insertCarousel();
}
