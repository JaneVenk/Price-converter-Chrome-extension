function handleUpdated(tabId, changeInfo, tab) {
  var url = tab.url;

  if (url === undefined && changeInfo.status != "complete") return;

  chrome.storage.local.get(
    ["convertToStorage", "checkboxStateStorage"],
    function (object) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          convertTo: object.convertToStorage,
          checkboxState: object.checkboxStateStorage,
        });
      });
    }
  );
}

chrome.tabs.onUpdated.addListener(handleUpdated);

chrome.history.onVisited.addListener(function (result) {
  if (result.url.includes("www.list.am")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.pageAction.show(tabs[0].id);
    });
  }
});
