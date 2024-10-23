import mongoose, { Schema } from 'mongoose';

const DailySummarySchema = new mongoose.Schema({
  city: { type: String, required: true },
  city_id: { type: String, required: true },
  date: { type: Date, required: true },
  avgTemp: { type: Number, required: true }, 
  maxTemp: { type: Number, required: true }, 
  minTemp: { type: Number, required: true }, 
  mostFrequentCondition: { type: String, required: true }, 
});

DailySummarySchema.index({ city_id: 1, date: 1 });

export const DailySummary = mongoose.model('DailySummary', DailySummarySchema);
