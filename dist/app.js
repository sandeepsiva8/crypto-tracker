"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const stockController_1 = require("./controllers/stockController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/stocks', stockRoutes_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/stock-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
setInterval(stockController_1.fetchStockData, 5000);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
