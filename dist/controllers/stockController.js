"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStocks = exports.fetchStockData = void 0;
const axios_1 = __importDefault(require("axios"));
const Stock_1 = __importDefault(require("../models/Stock"));
const fetchLiveCoinWatchData = (symbol_1, ...args_1) => __awaiter(void 0, [symbol_1, ...args_1], void 0, function* (symbol, retries = 3) {
    const apiUrl = 'https://api.livecoinwatch.com/coins/single';
    const maxRetries = 3;
    const initialDelay = 1000;
    try {
        const response = yield axios_1.default.post(apiUrl, {
            currency: 'USD',
            code: symbol,
            meta: true
        }, {
            headers: {
                'x-api-key': 'ef8afdb8-c7a0-4e44-852e-691ea43c43bf'
            }
        });
        return response.data.rate;
    }
    catch (error) {
        if (retries > 0 && error.response && error.response.status === 503) {
            const delay = initialDelay * Math.pow(2, maxRetries - retries);
            console.log(`Retrying in ${delay}ms (${retries} retries left) for ${symbol} due to 503 error...`);
            yield new Promise(resolve => setTimeout(resolve, delay));
            return fetchLiveCoinWatchData(symbol, retries - 1);
        }
        console.error(`Error fetching data for ${symbol}:`, error.response ? error.response.data : error.message);
        throw error;
    }
});
const fetchStockData = () => __awaiter(void 0, void 0, void 0, function* () {
    const symbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'XRP', 'TONCOIN', 'DOGE', 'ADA'];
    for (const symbol of symbols) {
        try {
            const price = yield fetchLiveCoinWatchData(symbol);
            const newStock = new Stock_1.default({ symbol, price });
            yield newStock.save();
        }
        catch (error) {
            console.error(`Error saving data for ${symbol}:`, error);
        }
    }
});
exports.fetchStockData = fetchStockData;
const getStocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol } = req.params;
        const stocks = yield Stock_1.default.find({ symbol: symbol.toUpperCase() }).sort({ timestamp: -1 }).limit(20);
        res.json(stocks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getStocks = getStocks;
