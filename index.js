'use strict';

function load_css (tab) {
  if (tab) {
    chrome.tabs.insertCSS(tab.id, { file: 'style.css' });
  }
}

chrome.contextMenus.create({
  id: 'commentabCreate',
  title: 'Create Sticky Note',
  contexts: ['all']
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'commentabCreate' && tab) {
    chrome.tabs.executeScript(tab.id, { file: 'comment.js' });
  }
});

chrome.tabs.onCreated.addListener(load_css);
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  if (info.status == 'complete') {
    load_css(tab);
  }
});
