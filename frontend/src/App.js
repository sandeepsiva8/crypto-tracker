import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import DataTable from './components/DataTable';
import './App.css';
const App = () => {
  const [symbol, setSymbol] = useState('BTC');

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div>
          <h1>Real-Time Crypto Price Tracker</h1>
          <div>
            <label htmlFor="symbolSelect">Select Cryptocurrency:</label>
            <select id="symbolSelect" className="select-box" value={symbol} onChange={handleSymbolChange}>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="XRP">Ripple (XRP)</option>
              <option value="LTC">Litecoin (LTC)</option>
              <option value="BCH">Bitcoin Cash (BCH)</option>
            </select>
          </div>
          <DataTable symbol={symbol} />
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
