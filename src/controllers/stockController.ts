import axios from 'axios';
import Stock from '../models/Stock';

const fetchLiveCoinWatchData = async (symbol:string, retries = 3) => {
  const apiUrl = 'https://api.livecoinwatch.com/coins/single';
  const maxRetries = 3;
  const initialDelay = 1000;

  try {
    const response = await axios.post(apiUrl, {
      currency: 'USD',
      code: symbol,
      meta: true
    }, {
      headers: {
        'x-api-key': 'ef8afdb8-c7a0-4e44-852e-691ea43c43bf' //api key here
      }
    });
    return response.data.rate;
  } catch (error:any) {
    if (retries > 0 && error.response && error.response.status === 503) {
      const delay = initialDelay * Math.pow(2, maxRetries - retries);
      console.log(`Retrying in ${delay}ms (${retries} retries left) for ${symbol} due to 503 error...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchLiveCoinWatchData(symbol, retries - 1);
    }
    console.error(`Error fetching data for ${symbol}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchStockData = async () => {
  const symbols = await Stock.distinct('symbol').exec();
  for (const symbol of symbols) {
    try {
      const price = await fetchLiveCoinWatchData(symbol);
      const newStock = new Stock({ symbol, price });
      await newStock.save();
    } catch (error) {
      console.error(`Error saving data for ${symbol}:`, error);
    }
  }
};

export const getStocks = async (req:any, res:any) => {
  try {
    const { symbol } = req.params;
    const stocks = await Stock.find({ symbol: symbol.toUpperCase() }).sort({ timestamp: -1 }).limit(20);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
