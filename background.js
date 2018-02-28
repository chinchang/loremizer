const CSS = "body { border: 20px solid red; }";
const TITLE_APPLY = "loremiscous";
const TITLE_REMOVE = "Remove loremiscous";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

const browser = chrome;

/*
Toggle CSS: based on the current title, insert or remove the CSS.
Update the page action's title and icon to reflect its state.
*/
function toggleCSS(tab) {

  function gotTitle(title) {
    console.log(title);
    if (title === TITLE_APPLY) {
      browser.browserAction.setIcon({tabId: tab.id, path: "icons/on.svg"});
      browser.browserAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
      browser.tabs.executeScript(tab.id, {
        file: 'script.js'
      });
    } else {
      browser.browserAction.setIcon({tabId: tab.id, path: "icons/off.svg"});
      browser.browserAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
      // browser.tabs.removeCSS({code: CSS});
    }
  }

  if (window.chrome) {
    browser.browserAction.getTitle({tabId: tab.id}, gotTitle);
  } else {
    var gettingTitle = browser.browserAction.getTitle({tabId: tab.id});
    gettingTitle.then(gotTitle);
  }
}

/*
Toggle CSS when the page action is clicked.
*/
browser.browserAction.onClicked.addListener(toggleCSS);
