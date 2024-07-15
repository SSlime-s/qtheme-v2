import { sendToBackground } from "@plasmohq/messaging";
import { type UseStore, promisifyRequest, set } from "idb-keyval";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
	matches: ["https://q.trap.jp/*", "https://q.ex.trap.jp/*"],
	all_frames: true,
	run_at: "document_start",
};

async function refresh() {
	await sendToBackground({
		name: "refresh",
	});
}

const TRAQ_THEME_DB_NAME = "traQ_S-store/app/themeSettings";
const TRAQ_THEME_STORE_NAME = "store";

async function updateIndexedDbTheme(theme: string) {
	const db = indexedDB.open(TRAQ_THEME_DB_NAME, 1);
	const dbp = await promisifyRequest(db);

	const store: UseStore = async (txMode, callback) => {
		const db = dbp;
		const tx = db
			.transaction(TRAQ_THEME_STORE_NAME, txMode)
			.objectStore(TRAQ_THEME_STORE_NAME);
		return callback(tx);
	};

	const saveTheme = {
		type: "custom",
		custom: JSON.parse(theme),
	};

	await set("key", saveTheme, store);
	await refresh();
}

chrome.runtime.onMessage.addListener((message, _, _sendResponse) => {
	if (message.name === "setTheme") {
		console.debug("setTheme", message.body);

		updateIndexedDbTheme(message.body.theme);
	}
});
