const defaultOptions = { highBitrate: false, formatTable: true };

function saveOptions() {
	const highBitrate = document.getElementById("highBitrate").checked;
	const formatTable = document.getElementById("formatTable").checked;

	chrome.storage.sync.set({ highBitrate, formatTable }, () => {
		let status = document.getElementById("status");
		status.textContent = "Options saved.";
		setTimeout(() => (status.textContent = ""), 5000);
	});
}

function restoreOptions() {
	chrome.storage.sync.get(defaultOptions, (result) => {
		document.getElementById("highBitrate").checked = result.highBitrate;
		document.getElementById("formatTable").checked = result.formatTable;
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("highBitrate").addEventListener("change", saveOptions);
document.getElementById("formatTable").addEventListener("change", saveOptions);
