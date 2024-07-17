const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const DataSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  price: Number,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'crypto' });

const Data = mongoose.model('Data', DataSchema);

const fetchData = async () => {
  try {
    const symbols = ['BTC', 'ETH', 'XRP', 'LTC', 'BCH'];
    for (const symbol of symbols) {
      try {
        const response = await axios.post(process.env.API_URL, {
          currency: 'USD',
          code: symbol,
          meta: true,
        }, {
          headers: {
            'x-api-key': process.env.API_KEY,
            'Content-Type': 'application/json'
          }
        });

        const data = response.data;

        const newData = new Data({
          symbol: symbol,
          name: data.name,
          price: data.rate,
          timestamp: new Date(),
        });
        console.log(newData)
        await newData.save();
        console.log('Data saved successfully');

      } catch (error) {
        console.error('Error in POST request to API:', error);
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

cron.schedule('*/10 * * * * *', fetchData);

app.get('/data/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    console.log('Requested symbol:', symbol);

    const recentData = await Data.find({ symbol })
      .sort({ timestamp: -1 })
      .limit(20);
    console.log('Recent data:', recentData);

    res.json(recentData);
  } catch (error) {
    console.error('Error fetching recent data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
