import axios from 'axios';

export const fetchData = (symbol) => async (dispatch) => {
  try {
    const response = await axios.get(`/data/${symbol}`);
    dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
