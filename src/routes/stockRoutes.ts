import express from 'express';
import { getStocks } from '../controllers/stockController';

const router = express.Router();

router.get('/:symbol', getStocks);

export default router;
