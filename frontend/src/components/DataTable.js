import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../api';

const DataTable = ({ symbol }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.data.data);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const data = await fetchData(symbol);
        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromApi();
  }, [dispatch, symbol]);

  return (
    <div>
      <h2>Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.symbol}</td>
              <td>{entry.price}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;