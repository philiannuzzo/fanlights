function yahoo() {
	const [, , leagueId, endPoint] = pathname.split("/", 4);
	const teamId = !isNaN(endPoint) ? endPoint : null;

	const nameIds = (selector) => {
		let formatted = [];
		$(selector).each(
			(_i, { innerText }) => innerText && formatted.push(formatName(innerText))
		);
		return formatted;
	};

	const initMutationObserver = (targetNode, callback = renderDefault) => {
		if (targetNode) {
			const observer = new MutationObserver(callback);
			observer.observe(targetNode, { childList: true });
		}
	};

	const renderDefault = () => {
		insertVideoIconsAfter(
			"span.player-status a.playernote:not(.small)",
			nameIds("a.name")
		);
	};

	const renderTxTable = () => {
		insertVideoIconsAfter(
			"a.playernote:not(.small)",
			nameIds("#transactions div.Pbot-xs a:first-child")
		);
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
		case `/b1/${leagueId}/addplayer`:
		case `/b1/${leagueId}/positioneligibility`:
		case `/b1/${leagueId}/buzzindex`:
		case `/b1/${leagueId}/playermatchups`:
		case `/b1/${leagueId}/matchup`:
		case `/b1`:
			return;
		default:
			renderDefault();
	}

	const fantasyChatButton = document.getElementById("FantasyChatButton");
	fantasyChatButton.style.right = "";
	fantasyChatButton.style.left = "20px";
	fantasyChatButton.onclick = () =>
		doWhenReady(
			() => document.getElementsByClassName("ysf-chat-league").length,
			() => (document.getElementById("ChatList").style.left = "20px")
		);

	insertCarousel();
}
