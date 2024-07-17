import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

export const fetchData = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};