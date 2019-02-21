const TITLE_APPLY = "loremizer";
const TITLE_REMOVE = "Remove loremizer";

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
      browser.browserAction.setIcon({ tabId: tab.id, path: "icons/on.png" });
      browser.browserAction.setTitle({ tabId: tab.id, title: TITLE_REMOVE });
      const selectedOptions = [
        ...document.querySelectorAll('input[type="checkbox"]'),
        ...document.querySelectorAll("[data-setting]")
      ].reduce((obj, input) => {
        obj[input.name] =
          input.type === "checkbox" ? input.checked : input.value;
        return obj;
      }, {});
      const jsonedSettings = JSON.stringify(selectedOptions);

      // Store applied setting to repopulate UI next time popup is opened
      localStorage.setItem(`loremizer${tab.id}`, jsonedSettings);

      executeScript(tab.id, {
        file: "script.js"
      }).then(() => {
        executeScript(tab.id, {
          code: `window.loremiscous(${jsonedSettings});`
        });
      });
      onActivation();
    } else {
      browser.browserAction.setIcon({ tabId: tab.id, path: "icons/off.png" });
      browser.browserAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
      localStorage.setItem(`loremizer${tab.id}`, undefined);

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
  document.body.classList.add("is-active");
}
function onDeactivation() {
  document.body.classList.remove("is-active");
}

activateBtn.addEventListener("click", btnClickHandler);
deactivateBtn.addEventListener("click", btnClickHandler);
textLengthMultiplierInput.addEventListener("change", e => {
  textLengthMultiplierValue.textContent = `${e.target.value}x`;
});
function setUi(settings) {
  for (let name in settings) {
    const el = document.querySelector(`[name=${name}]`);
    if (el.type === "checkbox") {
      el.checked = settings[name];
    } else {
      el.value = settings[name];
    }
  }
  textLengthMultiplierValue.textContent = `${textLengthMultiplierInput.value}x`;
}

// Change review link if it's firefox
if (navigator.userAgent.match(/firefox/i)) {
  reviewLink.href = "https://addons.mozilla.org/en-US/firefox/addon/loremizer/";
}

getCurrentTab().then(tab => {
  getIconTitle(tab.id).then(title => {
    const storageKey = `loremizer${tab.id}`;
    try {
      const result = JSON.parse(localStorage.getItem(storageKey));
      if (result) {
        setUi(result);
      }
    } catch (e) {
      console.log("Settings couldnt get back", e);
    }

    if (title === TITLE_REMOVE) {
      onActivation();
    }
  });
});
