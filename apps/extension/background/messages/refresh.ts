import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (_request, _response) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const activeTab = tabs[0];
		if (activeTab?.id === undefined) {
			return;
		}

		chrome.tabs.reload(activeTab.id);
	});
};

export default handler;
