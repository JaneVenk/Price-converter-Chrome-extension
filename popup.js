$(function () {
  chrome.storage.local.get("currenciesStorage", function (object) {
    var currenciesMap = JSON.parse(object.currenciesStorage, reviverMap);

    $("#rubRate").text(currenciesMap.get("RUB").value.toFixed(2));
    $("#amdRate").text(currenciesMap.get("AMD").value.toFixed(2));
  });

  function setCurrentCurrencyTo(currency) {
    chrome.storage.local.get(["checkboxStateStorage"], function (object) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          convertTo: currency,
          checkboxState: object.checkboxStateStorage,
        });
      });
    });

    chrome.storage.local.set({ convertToStorage: currency });
  }

  $("#rubleButton").click(function () {
    setCurrentCurrencyTo("RUB");
    close();
  });

  $("#dramButton").click(function () {
    setCurrentCurrencyTo("AMD");
    close();
  });

  $("#dollarButton").click(function () {
    setCurrentCurrencyTo("USD");
    close();
  });

  chrome.storage.local.get(["checkboxStateStorage"], function (object) {
    $("#checkbox").prop("checked", object.checkboxStateStorage);
  });

  $("#checkbox").click(function () {
    var checkbox = $("#checkbox");
    var isChecked = checkbox.is(":checked");

    chrome.storage.local.set({ checkboxStateStorage: isChecked });

    chrome.storage.local.get(["convertToStorage"], function (object) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          convertTo: object.convertToStorage,
          checkboxState: isChecked,
        });
      });
    });
  });
});
