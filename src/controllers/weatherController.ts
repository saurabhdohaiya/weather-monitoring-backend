import { Request, Response } from 'express';
import { 
  fetchWeatherDataForAllCities, 
  fetchWeatherDataByCityName, 
  fetchTemperatureForPastHoursByCity,
  fetchTemperatureForPastDaysByCity
} from '../services/weatherService';
import { IWeatherData } from '../interface/interface';

export const getCurrentWeather = async (req: Request, res: Response): Promise<void> => {
  const city_id = req.query.city_id as string;
  try {
    if (city_id) {
      const weatherData: IWeatherData = await fetchWeatherDataByCityName(city_id);
      if (!weatherData) {
        res.status(404).json({ message: `Weather data for city "${city_id}" not found.` });
        return;
      }
      res.status(200).json(weatherData);
      return;
    } else {
      const allCitiesWeatherData = await fetchWeatherDataForAllCities();
      res.status(200).json(allCitiesWeatherData);
      return;
    }
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWeatherHistory = async (req: Request, res: Response): Promise<void> => {
  const city_id = req.query.city_id as string;
  const past_days_count = req.query.past_days_count ? parseInt(req.query.past_days_count as string) : undefined;
  const past_hours_count = req.query.past_hours_count ? parseInt(req.query.past_hours_count as string) : undefined;

  try {
    if (!city_id) {
      res.status(400).json({ message: 'Missing required parameter: city_id' });
      return; 
    }

    if (past_hours_count) {
      const weatherHistory = await fetchTemperatureForPastHoursByCity(city_id, past_hours_count);
      if (!weatherHistory || weatherHistory.length === 0) {
        res.status(200).json([]); // Return an empty array if no data found for hours
        return;
      }
      res.status(200).json(weatherHistory);
      return;
    } 
    
    if (past_days_count) {
      const weatherHistory = await fetchTemperatureForPastDaysByCity(city_id, past_days_count);
      if (!weatherHistory || weatherHistory.length === 0) {
        res.status(200).json([]); // Return an empty array if no data found for days
        return; 
      }
      res.status(200).json(weatherHistory);
      return;
    } 
    
    res.status(400).json({ message: 'Invalid or missing parameters for weather history.' });
    return; 
  } catch (error) {
    console.error('Error fetching weather history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

