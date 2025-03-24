function yahoo() {
	const [, , leagueId, endPoint] = pathname.split("/", 4);
	const teamId = !isNaN(endPoint) ? endPoint : null;

	const nameIds = (selector) => {
		const formatted = [];
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
			"span.player-status a.playernote:not(.small):not(.yfa-video-forecast)",
			nameIds("a.name")
		);
	};

	const renderTxTable = () => {
		const isFabOffersSelected =
			document.querySelector("#transactions div.navlist .Selected").innerText ===
			"FAB Offers";
		const nameIdSelector = isFabOffersSelected
			? "#transactions td:nth-child(2) > a:first-child"
			: "#transactions td:nth-child(2) > div > a:first-child, #transactions td:nth-child(2) > p > a:first-child";
		insertVideoIconsAfter("a.playernote:not(.small)", nameIds(nameIdSelector));
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
			initMutationObserver($("#transactions div.Bd")[0], renderTxTable);
			break;
		case `/b1/${leagueId}/${teamId}/dropplayer`:
		case `/b1/${leagueId}/${teamId}/proposetrade`:
		case `/b1/${leagueId}/${teamId}/viewwaiver`:
		case `/b1/${leagueId}/${teamId}/viewtrade`:
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

	// const fantasyChatButton = document.getElementById("FantasyChatButton");
	// fantasyChatButton.style.right = "";
	// fantasyChatButton.style.left = "20px";
	// fantasyChatButton.onclick = () =>
	// 	doWhenReady(
	// 		() => document.getElementsByClassName("ysf-chat-league").length,
	// 		() => (document.getElementById("ChatList").style.left = "20px")
	// 	);

	insertCarousel();
}
