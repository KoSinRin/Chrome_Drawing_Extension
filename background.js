let extensionEnabled = true;

chrome.browserAction.onClicked.addListener(function(tab) {
  extensionEnabled = !extensionEnabled;
  chrome.tabs.sendMessage(tab.id, { action: "toggleDrawingLayer", extensionEnabled });
});
