import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
    city: {
      type: String,
      required: true
    },
    city_id: {
      type: String,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    feels_like: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    humidity: {
      type: Number,
      required: true
    },
    pressure: {
      type: Number,
      required: true
    },
    wind: {
      speed: {
        type: Number,
        required: true
      },
      deg: {
        type: Number,
        required: true
      }
    },
    // Add other fields as needed, such as date, visibility, etc.
    dt: {
      type: Date,
      default: Date.now
    }
  });
  
const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;
