function yahoo() {
	const [, , leagueId, endPoint] = pathname.split("/", 4);
	const teamId = !isNaN(endPoint) ? endPoint : null;

	nameIds = (selector) => {
		let formatted = [];
		$(selector).each(
			(_i, { innerText }) => innerText && formatted.push(formatName(innerText))
		);
		return formatted;
	};

	initMutationObserver = (targetNode, callback = renderDefault) => {
		if (targetNode) {
			const observer = new MutationObserver(callback);
			observer.observe(targetNode, { childList: true });
		}
	};

	renderDefault = () => {
		insertVideoIconsAfter(".playernote:not(.small)", nameIds(".name"));
	};

	renderTxTable = () => {
		insertVideoIconsAfter(".playernote:not(.small)", nameIds("#transactions .Pbot-xs a"));
	};

	switch (pathname) {
		case `/b1/${leagueId}/${teamId}/playerswatch`:
		case `/b1/${leagueId}/${teamId}/team`:
		case `/b1/${leagueId}/${teamId}`:
			renderDefault();
			initMutationObserver($(".stat-target")[0]);
			break;
		case `/b1/${leagueId}/players`:
			renderDefault();
			initMutationObserver($("#players-table-wrapper").get(0));
			break;
		case `/b1/${leagueId}/transactions`:
		case `/b1/${leagueId}`:
			renderTxTable();
			initMutationObserver($("#transactions div")[1], renderTxTable);
			break;
		case `/b1/${leagueId}/${teamId}/dropplayer`:
		case `/b1/${leagueId}/${teamId}/proposetrade`:
		case `/b1/${leagueId}/${teamId}/viewwaiver`:
		case `/b1/${leagueId}/addplayer`:
		case `/b1/${leagueId}/positioneligibility`:
		case `/b1/${leagueId}/buzzindex`:
		case `/b1/${leagueId}/playermatchups`:
		case `/b1/${leagueId}/matchup`:
		case `/b1`:
			// if (document.getElementById("redzone")) {
			// 	const matchupReady = setInterval(() => {
			// 		if (document.getElementById("matchup")) {
			// 			renderDefault();
			// 			initMutationObserver($("#redzone div div div")[0]);
			// 			clearInterval(matchupReady);
			// 		}
			// 	}, 100);
			// } else renderDefault();
			// break;

			return;
		default:
			renderDefault();
	}

	insertCarousel();

	$("#FantasyChatButton")
		.css({ right: "", left: "20px" })
		.click(() => $("#ChatList").css("left", "20px"));
}
