const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    symbol: String,
    price: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Price', priceSchema);
