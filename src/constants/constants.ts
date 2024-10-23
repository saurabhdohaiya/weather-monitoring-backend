import dotenv from 'dotenv';

dotenv.config();

export const API_CALL_INTERVAL = Number(process.env.API_CALL_INTERVAL) || 5;
export const METRO_CITIES = [
  { cityName: 'Delhi', cityId: '1273294' },
  { cityName: 'Mumbai', cityId: '1275339' },
  { cityName: 'Chennai', cityId: '1264527' },
  { cityName: 'Bengaluru', cityId: '1277333' },
  { cityName: 'Kolkata', cityId: '1275004' },
  { cityName: 'Hyderabad', cityId: '1269843' }
];
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
export const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
