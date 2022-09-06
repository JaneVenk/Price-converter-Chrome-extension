function toNumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setOriginalPriceVisibility(visible) { 
  if (visible) {
    $(".injected-span").css("display", "inline");
    $(".injected-span-item").css("display", "inline");
  } else {
    $(".injected-span").css("display", "none");
    $(".injected-span-item").css("display", "none");
  }
}

function saveOriginalPrice(firstPriceElementClass, safeElementClass) {
  if (!$("." + firstPriceElementClass).has("." + safeElementClass).length) {
    $("." + firstPriceElementClass).each(function () {
      var priceString = $(this).text();
      $(this).append(
        "<span class=" + safeElementClass + "> " + priceString + "</span>"
      );
    });
  }
}

function getPriceCode(priceString) {
  if (priceString.includes("$")) return "USD";
  if (priceString.includes("֏")) return "AMD";
  if (priceString.includes("€")) return "EUR";
  if (priceString.includes("руб.")) return "RUB";
}

function convertPrice(currenciesMap, convertFrom, convertTo, priceNum) {
  const coefficient =
    currenciesMap.get(convertFrom).value / currenciesMap.get(convertTo).value;

  var newPrice = Math.ceil(priceNum / coefficient);

  newPrice = toNumberWithCommas(newPrice);

  return newPrice;
}

function createNewPrice(
  currenciesMap,
  convertTo,
  originalPriceElementClass,
  safeElementClass
) {
  $("." + originalPriceElementClass).each(function () {
    var priceString = $(this)
      .children("." + safeElementClass)
      .text();

    var convertFrom = getPriceCode(priceString);

    const numberArray = priceString.match(/\d+/g);
    var price = "";

    if (numberArray !== null) {
      for (var i = 0; i < numberArray.length; i++) {
        price = price + numberArray[i];
      }

      var oldPrice = toNumberWithCommas(price);

      var oldСurrency = currenciesMap.get(convertFrom).sign;

      var newPrice = convertPrice(currenciesMap, convertFrom, convertTo, price);

      var newCurrency = currenciesMap.get(convertTo).sign;

      var newPriseString = priceString
        .replace(oldPrice, newPrice)
        .replace(oldСurrency, newCurrency);

      if ($(this).has("meta").length) {
        $(this)[0].childNodes[2].nodeValue = "";
      }

      $(this)[0].firstChild.nodeValue = newPriseString;
    }
  });
}

chrome.storage.local.get("lastRefreshDate", function (object) {
  var date = new Date();
  var currentDate = date.getTime();

  const updateCurrenciesIntervalMs = 1200000;

  var timeDelta =
    object.lastRefreshDate == null
      ? updateCurrenciesIntervalMs
      : currentDate - object.lastRefreshDate;

  if (timeDelta >= updateCurrenciesIntervalMs) {
    chrome.storage.local.set({
      lastRefreshDate: currentDate,
      currenciesStorage: JSON.stringify(getCurrenciesMapSync(), replacerMap),
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.storage.local.get("currenciesStorage", function (object) {
    if (request.convertTo) {
      var currenciesMap = JSON.parse(object.currenciesStorage, reviverMap);

      var convertTo = request.convertTo;

      [
        ["p", "injected-span"],
        ["price", "injected-span-item"],
      ].forEach((element) => {
        saveOriginalPrice(element[0], element[1]);
        createNewPrice(currenciesMap, convertTo, element[0], element[1]);
      });

      setOriginalPriceVisibility(request.checkboxState);
    }
  });
});
