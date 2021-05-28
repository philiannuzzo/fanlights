function yahoo() {
	const [, , leagueId, endPoint] = pathname.split("/", 4);
	const teamId = !isNaN(endPoint) ? endPoint : null;

	playerNames = (selector) => {
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
		insertVideoIconsAfter(".playernote:not(.small)", playerNames(".name"));
	};

	renderTxTable = () => {
		insertVideoIconsAfter(".playernote:not(.small)", playerNames("#transactions .Pbot-xs a"));
	};

	switch (pathname) {
		case `/b1/${leagueId}/${teamId}/team`:
		case `/b1/${leagueId}/${teamId}`:
			renderDefault();
			initMutationObserver($("section.ysf-rosterswap-manager")[0]);
			break;
		case `/b1/${leagueId}/${teamId}/playerswatch`:
			renderDefault();
			initMutationObserver($("#playerswatchform div")[0]);
			break;
		case `/b1/${leagueId}/players`:
			renderDefault();
			initMutationObserver($("#players-table-wrapper")[0]);
			break;
		case `/b1/${leagueId}/transactions`:
		case `/b1/${leagueId}`:
			renderTxTable();
			initMutationObserver($("#transactions div")[1], renderTxTable);
			break;
		case `/b1/${leagueId}/${teamId}/dropplayer`:
		case `/b1/${leagueId}/${teamId}/proposetrade`:
		case `/b1/${leagueId}/${teamId}/viewwaiver`:
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
}
