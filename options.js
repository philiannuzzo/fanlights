const defaultOptions = { highBitrate: false };

function saveOptions() {
	const highBitrate = document.getElementById("highBitrate").checked;

	chrome.storage.sync.set({ highBitrate }, () => {
		let status = document.getElementById("status");
		status.textContent = "Options saved.";
		setTimeout(() => (status.textContent = ""), 5000);
	});
}

function restoreOptions() {
	chrome.storage.sync.get(defaultOptions, (result) => {
		document.getElementById("highBitrate").checked = result.highBitrate;
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("highBitrate").addEventListener("change", saveOptions);
