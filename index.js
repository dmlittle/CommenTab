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

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === 'commentabCreate' && tab) {
    chrome.tabs.executeScript(tab.id, { code: `var TAB_ID = 'tab_${tab.id}'; var ACTION = 'create';` }, function () {
      chrome.tabs.executeScript(tab.id, { file: 'comment.js' });
    });
  }
});

chrome.tabs.onCreated.addListener(function (tab) {
  var TAB_ID = `tab_${tab.id}`;

  var updateStorage = {};
  updateStorage[TAB_ID] = [];

  chrome.storage.local.set(updateStorage);
});

chrome.tabs.onRemoved.addListener(function (tab_id) {
  var TAB_ID = `tab_${tab_id}`;

  chrome.storage.local.get(TAB_ID, function (data) {
    var comments = data[TAB_ID].map(function (comment_id) { return `${TAB_ID}_${comment_id}`; });

    chrome.storage.local.remove([TAB_ID].concat(comments));
  });
});

chrome.tabs.onCreated.addListener(load_css);
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  if (info.status == 'complete') {
    load_css(tab);

    chrome.tabs.executeScript(tab.id, { code: `var TAB_ID = 'tab_${tab.id}'; var ACTION = 'restore';` }, function () {
      chrome.tabs.executeScript(tab.id, { file: 'comment.js' });
    });
  }
});
