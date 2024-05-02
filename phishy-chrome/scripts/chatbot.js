(async () => {
	const phishyIcon = chrome.runtime.getURL('images/icon-128.png');
	const closeIcon = chrome.runtime.getURL('images/close.png');

	async function sendMessage(chatId, message) {
		console.log(`${message} sent for ${chatId}`);
		const history = document.getElementById('chatbot-user-history');
		history.innerHTML += generateHistoryHTML({
			role: 'user',
			parts: [message],
		});
		history.scrollIntoView({ behavior: 'smooth', block: 'end' });

		const chat = await chrome.runtime.sendMessage({
			type: 'sendMessage',
			chatId,
			message,
		});

		const lastChat = chat.userHistory.pop();
		history.innerHTML += generateHistoryHTML(lastChat);
		history.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}

	function parseBody(body) {
		let parsedText = body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
		return parsedText.replace(/\n/g, '<br />');
	}

	function generateHistoryHTML(convo) {
		return (
			`<div class='chat'>` +
			`<span class='chat-role'>${
				convo.role === 'user' ? 'You' : 'Phishy'
			}</span>` +
			`<span class='chat-message'>${parseBody(convo.parts[0])}</span>` +
			'</div>'
		);
	}

	function createChatbotContainer() {
		const container = document.createElement('div');
		container.setAttribute('id', 'chatbot-container');
		container.classList.add('chatbot-container');

		const image = new Image();
		image.src = closeIcon;
		image.classList.add('close-icon');
		image.onclick = function () {
			container.style.display = 'none';
		};

		container.appendChild(image);

		return container;
	}

	function createChatbotHeader() {
		const header = document.createElement('div');
		header.classList.add('chatbot-header');

		const image = new Image();
		image.src = phishyIcon;
		image.classList.add('chatbot-icon');

		const title = document.createElement('span');
		title.setAttribute('id', 'chatbot-title');
		title.classList.add('chatbot-title');

		const subtitle = document.createElement('span');
		subtitle.setAttribute('id', 'chatbot-subtitle');
		subtitle.classList.add('chatbot-subtitle');

		header.appendChild(image);
		header.appendChild(title);
		header.appendChild(subtitle);

		return header;
	}

	function createChatbotBody() {
		const body = document.createElement('div');
		body.classList.add('chatbot-body');

		const context = document.createElement('div');
		context.classList.add('chatbot-context');
		context.innerHTML =
			`<span id='chatbot-context-header' class='chatbot-context-header'></span>` +
			`<span id='chatbot-context-body' class='chatbot-context-body'></span>`;

		const history = document.createElement('div');
		history.setAttribute('id', 'chatbot-user-history');
		context.appendChild(history);

		const inputDiv = document.createElement('div');
		inputDiv.classList.add('chatbot-input-div');

		const input = document.createElement('input');
		input.setAttribute('id', 'chatbot-input');
		input.classList.add('chatbot-input');
		input.placeholder = 'Ask more questions';
		inputDiv.appendChild(input);

		const button = document.createElement('button');
		button.setAttribute('id', 'chatbot-send-button');
		button.classList.add('chatbot-send-button');
		button.innerHTML = 'Send';
		inputDiv.appendChild(button);

		const footerText = document.createElement('span');
		footerText.classList.add('chatbot-footer-text');
		footerText.innerHTML = 'Powered by Gemini';

		const footer = document.createElement('div');
		footer.classList.add('chatbot-footer');
		footer.appendChild(inputDiv);
		footer.appendChild(footerText);

		body.appendChild(context);
		body.appendChild(footer);

		input.addEventListener('keyup', (event) => {
			if (event.key === 'Enter' || event.keyCode === 13) {
				button.click();
			}
			if (event.target && event.target.value != '') {
				button.style.color = 'black';
				button.disabled = false;
			} else {
				button.style.color = 'gray';
				button.disabled = true;
			}
		});

		return body;
	}

	const container = createChatbotContainer();
	const header = createChatbotHeader();
	const body = createChatbotBody();

	container.appendChild(header);
	container.appendChild(body);

	document.body.appendChild(container);

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.type === 'loadChat') {
			const chat = request.chat;
			console.log(`chatbot opening chat: ${chat.id}`);

			const container = document.getElementById('chatbot-container');
			container.style.display = 'flex';

			const title = document.getElementById('chatbot-title');
			const subtitle = document.getElementById('chatbot-subtitle');
			const header = document.getElementById('chatbot-context-header');
			const body = document.getElementById('chatbot-context-body');
			const history = document.getElementById('chatbot-user-history');
			const input = document.getElementById('chatbot-input');
			const button = document.getElementById('chatbot-send-button');

			title.innerHTML = 'Suspicious URL';
			subtitle.innerHTML = chat.url;
			header.innerHTML = chat.header;
			body.innerHTML = parseBody(chat.body);
			const historyHTML = chat.userHistory
				.map((convo) => generateHistoryHTML(convo))
				.join('');

			history.innerHTML = historyHTML;

			button.onclick = async function () {
				const message = input.value;
				input.value = '';
				button.style.color = 'gray';
				button.disabled = true;
				await sendMessage(chat.id, message);
			};
		}
	});
})();
