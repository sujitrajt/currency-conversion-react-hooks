import React, { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";
import "./App.css";
const BASE_URL = "https://api.exchangeratesapi.io/latest";
function App() {
  const [currencyOptions, setCurrencyOption] = useState([]);
  const [fromcurrency, setFromCurrency] = useState();
  const [tocurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    toAmount = amount * exchangeRate;
    fromAmount = amount;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }
  console.log(currencyOptions);
  useEffect(() => {
    fetch(BASE_URL)
      .then(response => response.json())
      .then(responseData => {
        const firstCurrency = Object.keys(responseData.rates)[11];
        console.log(responseData);
        setCurrencyOption([
          responseData.base,
          ...Object.keys(responseData.rates)
        ]);
        setFromCurrency(firstCurrency);
        setToCurrency(responseData.base);
        setExchangeRate(responseData.rates[firstCurrency]);
      });
  }, []);
  useEffect(() => {
    if (fromcurrency != null && tocurrency != null) {
      fetch(`${BASE_URL}?base=${fromcurrency}&symbols=${tocurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[tocurrency]));
    }
  }, [fromcurrency, tocurrency]);
  const handleFromAmountChange = e => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };
  const handleToAmountChange = e => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };
  return (
    <div>
      <h1>Converter</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromcurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div>=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={tocurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </div>
  );
}

export default App;
