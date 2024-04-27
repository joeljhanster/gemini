async function checkSuspiciousUrl(url) {
	const response = await fetch('http://127.0.0.1:8080/api/v1/chats', {
		method: 'POST',
		body: JSON.stringify({ type: 'URL', url }),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();
	console.log(data);

	// Simulate a basic check based on keywords in the URL
	return {
		isSuspicious: true,
		header: 'You found a suspicious link',
		body: 'URL scams involve deceptive tactics where cybercriminals create URLs (Uniform Resource Locators) that appear legitimate but actually lead to malicious websites or fraudulent activities. These scams often rely on social engineering techniques to trick users into clicking on the malicious links.',
	};
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	(async () => {
		console.log(
			sender.tab
				? 'from a content script:' + sender.tab.url
				: 'from the extension',
		);

		if (request.type === 'checkLink') {
			const url = request.url;
			console.log(url);
			const response = await checkSuspiciousUrl(url); // Simulate check

			sendResponse(response);
		}
	})();

	return true;
});
