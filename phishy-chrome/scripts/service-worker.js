const API_URL = 'https://phishy-api-udqjod24ha-as.a.run.app';

function getRandomToken() {
	var randomPool = new Uint8Array(32);
	crypto.getRandomValues(randomPool);
	var hex = '';
	for (var i = 0; i < randomPool.length; ++i) {
		hex += randomPool[i].toString(16);
	}
	return hex;
}

async function setUserId() {
	const userId = getRandomToken();
	await chrome.storage.sync.set({ userId });
	console.log(`UserId set: ${userId}`);
}

async function getUserId() {
	return chrome.storage.sync.get(['userId']);
}

async function checkPhishyUrls(urls) {
	const { userId } = await getUserId();
	console.log(`UserId get: ${userId}`);
	const response = await fetch(`${API_URL}/api/v1/chats`, {
		method: 'POST',
		body: JSON.stringify({ userId, type: 'URL', urls }),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();
	console.log(data);

	return data;
}

async function getChatDetails(chatId) {
	const response = await fetch(`${API_URL}/api/v1/chats/${chatId}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
	});

	const data = await response.json();
	console.log(data);

	return data;
}

async function sendChatMessage(chatId, message) {
	const response = await fetch(`${API_URL}/api/v1/chats/${chatId}`, {
		method: 'POST',
		body: JSON.stringify({ message }),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();
	console.log(data);

	return data;
}

chrome.runtime.onInstalled.addListener(async () => {
	chrome.action.setBadgeText({
		text: 'OFF',
	});

	await setUserId();
});

chrome.action.onClicked.addListener(async (tab) => {
	// Retrieve the action badge to check if the extension is 'ON' or 'OFF'
	const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
	// Next state will always be the opposite
	const nextState = prevState === 'ON' ? 'OFF' : 'ON';

	// Set the action badge to the next state
	await chrome.action.setBadgeText({
		tabId: tab.id,
		text: nextState,
	});

	if (nextState === 'ON') {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['scripts/content-script.js', 'scripts/chatbot.js'],
		});
		chrome.scripting.insertCSS({
			target: { tabId: tab.id },
			files: ['scripts/content.css', 'scripts/chatbot.css'],
		});
	} else {
		chrome.tabs.reload(tab.id);
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	(async () => {
		console.log(
			sender.tab
				? 'from a content script:' + sender.tab.url
				: 'from the extension',
		);

		if (request.type === 'checkLinks') {
			const urls = request.urls;
			console.log(urls);
			const response = await checkPhishyUrls(urls);

			sendResponse(response);
		}

		if (request.type === 'openChat') {
			const chatId = request.chatId;
			console.log(chatId);
			const chat = await getChatDetails(chatId);
			await chrome.tabs.sendMessage(sender.tab.id, { type: 'loadChat', chat });
		}

		if (request.type === 'sendMessage') {
			const chatId = request.chatId;
			const message = request.message;
			const response = await sendChatMessage(chatId, message);

			sendResponse(response);
		}
	})();

	return true;
});
