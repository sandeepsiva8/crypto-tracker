import mongoose, { Schema, Document } from 'mongoose';

export interface StockDocument extends Document {
  symbol: string;
  price: number;
  timestamp: Date;
}

const StockSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<StockDocument>('Stock', StockSchema);
