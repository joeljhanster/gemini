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
	function createPopupElement(icon, response) {
		const popup = document.createElement('div');
		popup.classList.add('suspicious-link-popup');

		const iconRect = icon.getBoundingClientRect();
		popup.style.top = `${iconRect.top + icon.offsetHeight}px`;
		popup.style.left = `${iconRect.left + icon.offsetWidth}px`;

		popup.innerHTML = `<h3>${response.header}</h3><p>${response.body}</p>`; // Customize content
		return popup;
	}

	// Function to show/hide popup on hover
	function showPopupOnHover(icon, popup) {
		icon.addEventListener('mouseover', () => {
			popup.style.display = 'block';
		});
	}

	// Function to send message to background script
	async function sendMessage(link) {
		const response = await chrome.runtime.sendMessage({
			type: 'checkLink',
			url: link.href,
		});

		if (response.isSuspicious) {
			const image = new Image();
			image.src = phishyIcon;
			image.classList.add('suspicious-link-icon');

			const container = createLinkContainer(link.cloneNode(true), image);
			link.parentNode.replaceChild(container, link);

			const popup = createPopupElement(image, response);
			document.body.appendChild(popup); // Append popup to body

			showPopupOnHover(image, popup); // Add hover listeners

			addInlineStyle(container, {
				background: '#FACBCB',
				padding: '0px 8px',
				borderRadius: '6px',
			});
		}
	}

	// Find all anchor tags (<a>) on the page
	const links = document.querySelectorAll('a');

	// Loop through each link and send message to background script
	links.forEach((link) => {
		sendMessage(link);
	});
})();
