import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from '../actions/dataActions';

const ChangeSymbolModal = () => {
  const [symbol, setSymbol] = useState('');
  const dispatch = useDispatch();

  const handleChangeSymbol = () => {
    dispatch(fetchData(symbol));
  };

  return (
    <div>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter crypto symbol"
      />
      <button onClick={handleChangeSymbol}>Change Symbol</button>
    </div>
  );
};

export default ChangeSymbolModal;
