(async () => {
	const phishyIcon = chrome.runtime.getURL('images/icon-32.png');

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

	// Function to create the hover popup element
	function createPopupElement(phishyUrl) {
		const popup = document.createElement('div');
		popup.classList.add('suspicious-link-popup');

		// Customize hover content
		popup.innerHTML =
			`<h5 class='suspicious-link-popup-header'>${phishyUrl.header}</h5>` +
			`<p class='suspicious-link-popup-content'>${phishyUrl.body}</p>` +
			`<button class='suspicious-link-popup-button' data-action='openChat-${phishyUrl.id}'>Investigate this phish</button>`;

		document.addEventListener('click', function (event) {
			if (
				event.target &&
				event.target.matches(`button[data-action='openChat-${phishyUrl.id}']`)
			) {
				console.log(`Opening chat: ${phishyUrl.id}`);
				chrome.runtime.sendMessage({ type: 'openChat', chatId: phishyUrl.id });
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
					link.parentNode.replaceChild(container, link);

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
