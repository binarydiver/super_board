chrome.action.onClicked.addListener(function (tab) {
  console.log("tab", tab.id);
  chrome.action
    .setTitle({ tabId: tab.id, title: "You are on tab:" + tab.id })
    .catch((e) => console.error(e));
});
