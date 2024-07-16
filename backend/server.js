const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const Price = require('./models/Price');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.json());

app.get('/api/prices/:symbol', async (req, res) => {
    try {
        const prices = await Price.find({ symbol: req.params.symbol }).sort({ timestamp: -1 }).limit(20);
        res.json(prices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

cron.schedule('*/10 * * * * *', async () => {
    const symbols = ['GOOG', 'BTC'];
    symbols.forEach(async (symbol) => {
        try {
            const response = await axios.get(`${process.env.API_URL}?symbol=${symbol}&apikey=${process.env.API_KEY}`);
            const price = new Price({
                symbol: symbol,
                price: response.data.price
            });
            await price.save();
        } catch (err) {
            console.log(err.message);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
