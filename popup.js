const TITLE_APPLY = 'loremizer';
const TITLE_REMOVE = 'Remove loremizer';

const browser = window.chrome || browser;

function getCurrentTab() {
	return new Promise((resolve, reject) => {
		if (window.chrome) {
			browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
				resolve(tabs[0]);
			});
		} else {
			return browser.tabs.query({ active: true, currentWindow: true });
		}
	});
}

function getIconTitle(tabId) {
	return new Promise(resolve => {
		if (window.chrome) {
			browser.browserAction.getTitle({ tabId: tabId }, resolve);
		} else {
			return browser.browserAction.getTitle({ tabId: tabId });
		}
	});
}

function executeScript(tabId, details) {
	return new Promise(resolve => {
		if (window.chrome) {
			browser.tabs.executeScript(tabId, details, resolve);
		} else {
			return browser.tabs.executeScript(tabId, details);
		}
	});
}

function toggle(tab) {
	function gotTitle(title) {
		if (title === TITLE_APPLY) {
			browser.browserAction.setIcon({ tabId: tab.id, path: 'icons/on.png' });
			browser.browserAction.setTitle({ tabId: tab.id, title: TITLE_REMOVE });
			const selectedOptions = [
				...document.querySelectorAll('input[type="checkbox"]:checked')
			].map(input => input.name);

			executeScript(tab.id, {
				file: 'script.js'
			}).then(() => {
				executeScript(tab.id, {
					code: `window.loremiscous(${JSON.stringify(selectedOptions)});`
				});
			});
			onActivation();
		} else {
			browser.browserAction.setIcon({ tabId: tab.id, path: 'icons/off.png' });
			browser.browserAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
			executeScript(tab.id, {
				code: `window.loremiscous();`
			});
			onDeactivation();
		}
	}

	getIconTitle(tab.id).then(gotTitle);
}

function btnClickHandler() {
	getCurrentTab().then(tab => {
		toggle(tab);
	});
}
function onActivation() {
	document.body.classList.add('is-active');
}
function onDeactivation() {
	document.body.classList.remove('is-active');
}
activateBtn.addEventListener('click', btnClickHandler);
deactivateBtn.addEventListener('click', btnClickHandler);

getCurrentTab().then(tab => {
	getIconTitle(tab.id).then(title => {
		if (title === TITLE_REMOVE) {
			onActivation();
		}
	});
});
