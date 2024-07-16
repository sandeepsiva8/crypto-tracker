import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import stockRoutes from './routes/stockRoutes';
import { fetchStockData } from './controllers/stockController';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/stocks', stockRoutes);

mongoose.connect('mongodb://localhost:27017/stock-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error: Error) => {
  console.error('MongoDB connection error:', error);
});

setInterval(fetchStockData, 5000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
