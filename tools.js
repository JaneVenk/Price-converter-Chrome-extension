function reviverMap(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

function replacerMap(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

function getCurrenciesMapSync() {
  var currencies;

  const url = "https://cdn.cur.su/api/latest.json";

  function load(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        callback(xhr.response);
      }
    };

    xhr.open("GET", url, false);
    xhr.send("");
  }

  load(url, (data) => {
    currencies = data;
  });

  currencies = JSON.parse(currencies);

  const RUB = currencies.rates.RUB;
  const AMD = currencies.rates.AMD;
  const EUR = currencies.rates.EUR;

  const currenciesMap = new Map();

  currenciesMap.set("USD", { value: 1, sign: "$" });
  currenciesMap.set("AMD", { value: AMD, sign: "֏" });
  currenciesMap.set("RUB", { value: RUB, sign: "₽" });
  currenciesMap.set("EUR", { value: EUR, sign: "€" });

  return currenciesMap;
}
