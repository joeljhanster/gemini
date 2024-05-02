(async () => {
	const phishyIcon = chrome.runtime.getURL('images/icon-48.png');
	const closeIcon = chrome.runtime.getURL('images/close.png');

	// Function to create a container element for link and image
	function createLinkContainer(link, image) {
		const container = document.createElement('span');
		container.classList.add('suspicious-link-container');
		container.appendChild(link);
		container.appendChild(image);
		return container;
	}

	// Function to add inline style to an element
	function addInlineStyle(element, styles) {
		for (const property in styles) {
			element.style[property] = styles[property];
		}
	}

	function parseBody(body) {
		let parsedText = body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
		return parsedText.replace(/\n/g, '<br />');
	}

	// Function to create the hover popup element
	function createPopupElement(phishyUrl) {
		const popup = document.createElement('div');
		popup.classList.add('suspicious-link-popup');

		// Customize hover content
		popup.innerHTML +=
			`<img class='suspicious-close-icon' src=${closeIcon} data-action='closePopup-${phishyUrl.id}' />` +
			`<h3 class='suspicious-link-popup-header'>${phishyUrl.header}</h3>` +
			`<p class='suspicious-link-popup-content'>${parseBody(phishyUrl.body)}</p>` +
			`<button class='suspicious-link-popup-button' data-action='openChat-${phishyUrl.id}'>Chat to know more</button>`;

		popup.addEventListener('click', function (event) {
			if (event.target) {
				if (
					event.target.matches(`button[data-action='openChat-${phishyUrl.id}']`)
				) {
					console.log(`Opening chat: ${phishyUrl.id}`);
					chrome.runtime.sendMessage({
						type: 'openChat',
						chatId: phishyUrl.id,
					});
					popup.style.display = 'none';
				} else if (
					event.target.matches(`img[data-action='closePopup-${phishyUrl.id}']`)
				) {
					popup.style.display = 'none';
				}
			}
		});

		return popup;
	}

	// Function to show/hide popup on hover
	function showPopupOnHover(icon, popup) {
		icon.addEventListener('mouseover', () => {
			popup.style.display = 'flex';
		});
	}

	// Function to send message to background script
	async function sendMessage(links, urls) {
		const data = await chrome.runtime.sendMessage({
			type: 'checkLinks',
			urls,
		});

		links.forEach((link) => {
			data.items.forEach((phishyUrl) => {
				if (link.href === phishyUrl.url) {
					const image = new Image();
					image.src = phishyIcon;
					image.classList.add('suspicious-link-icon');

					const container = createLinkContainer(link.cloneNode(true), image);
					try {
						link.parentNode.replaceChild(container, link);
					} catch (e) {
						console.error('Failed to find link');
					}

					const popup = createPopupElement(phishyUrl);
					container.appendChild(popup);

					showPopupOnHover(image, popup); // Add hover listeners

					addInlineStyle(container, {
						background: '#FACBCB',
						padding: '0px 8px',
						borderRadius: '6px',
					});
				}
			});
		});
	}

	// Find all anchor tags (<a>) on the page
	const links = document.querySelectorAll('a');
	const urls = Array.from(links).map((link) => link.href);
	sendMessage(links, urls);
})();
