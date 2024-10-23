import axios from 'axios';
import Weather from '../models/Weather'; 
import { METRO_CITIES, OPENWEATHER_API_URL, OPENWEATHER_API_KEY } from '../constants/constants';
import { DailySummary } from '../models/DailySummary';
import { IDailySummaryData, IWeatherData, IPastHourWeatherData} from '../interface/interface';

export const fetchWeatherDataByCityName = async (city_id: string): Promise<IWeatherData> => {
  try {
    if (!city_id) {
      throw new Error(`City ID is required.`);
    }

    const response = await axios.get(`${OPENWEATHER_API_URL}`, {
      params: {
        id: city_id,
        appid: OPENWEATHER_API_KEY,
      },
    });

    const weatherData = response.data;

    if (!weatherData) {
      throw new Error(`No weather data available for city: ${city_id}`);
    }

    // Create a weather object to save in DB or use as needed
    const weather = new Weather({
      city: weatherData.name,
      city_id: city_id,
      temperature: weatherData.main?.temp ?? "N/A",
      feels_like: weatherData.main?.feels_like ?? "N/A",
      condition: weatherData.weather?.[0]?.main ?? "Unknown",
      icon: weatherData.weather?.[0]?.icon ?? "default-icon",
      humidity: weatherData.main?.humidity ?? 0,
      pressure: weatherData.main?.pressure ?? 0,
      wind: {
        speed: weatherData.wind?.speed ?? 0,
        deg: weatherData.wind?.deg ?? 0,
      },
      dt: weatherData.dt,
    });

    await weather.save();
    return weather;
  } catch (error) {
    console.error(`Error fetching data for city: ${city_id}`, error);
    throw error;
  }
};

// Fetch weather data for all cities (using METRO_CITIES)
export const fetchWeatherDataForAllCities = async (): Promise<IWeatherData[]> => {
  // Create a list of promises for each city
  const promises = METRO_CITIES.map(async (city) => {
    try {
      const response = await axios.get(`${OPENWEATHER_API_URL}`, {
        params: {
          id: city.cityId,
          appid: OPENWEATHER_API_KEY,
        },
      });

      const weatherData = response.data;

      const weather = new Weather({
        city: weatherData.name,
        city_id: weatherData.id,
        temperature: weatherData.main?.temp ?? "N/A",
        feels_like: weatherData.main?.feels_like ?? "N/A",
        condition: weatherData.weather?.[0]?.main ?? "Unknown",
        icon: weatherData.weather?.[0]?.icon ?? "default-icon",
        humidity: weatherData.main?.humidity ?? 0,
        pressure: weatherData.main?.pressure ?? 0,
        wind: {
          speed: weatherData.wind?.speed ?? 0,
          deg: weatherData.wind?.deg ?? 0,
        },
        dt: new Date(),
      });

      await weather.save(); // Save to DB

      return weather; 
    } catch (error) {
      console.error(`Error fetching data for city: ${city.cityName}`, error);
      throw error;
    }
  });

  return Promise.all(promises); 
};

export const calculateAndSaveDailySummaries = async (date: Date): Promise<void> => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set to the start of the day

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() - 1); // End of the previous day

    for (const city of METRO_CITIES) {
      const result = await Weather.aggregate([
        {
          $match: {
            city_id: city.cityId,
            dt: { $gte: endOfDay, $lt: startOfDay },
          },
        },
        {
          $group: {
            _id: null,
            avgTemp: { $avg: '$temperature' },
            maxTemp: { $max: '$temperature' },
            minTemp: { $min: '$temperature' },
            dominantCondition: { $push: '$condition' },
          },
        },
      ]);

      if (result.length > 0) {
        const { avgTemp, maxTemp, minTemp, dominantCondition } = result[0];

        const conditionFrequency: Record<string, number> = dominantCondition.reduce((acc: Record<string, number>, condition: string) => {
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
        }, {});

        const mostFrequentCondition = Object.keys(conditionFrequency).reduce((a, b) =>
          conditionFrequency[a] > conditionFrequency[b] ? a : b
        );

        // Make changes here to save according to the instances in the data property
        const dailySummary = new DailySummary({
          city_id: city.cityId,
          city: city.cityName,
          date: startOfDay,
          avgTemp,
          maxTemp,
          minTemp,
          mostFrequentCondition,
        });

        await dailySummary.save();
        console.log(`Daily summary saved for ${city.cityName}`);
      } else {
        console.log(`No weather data found for ${city.cityName} on ${startOfDay}`);
      }
    }
  } catch (error) {
    console.error('Error calculating and saving daily summaries:', error);
  }
};

// Fetch temperature for the past few days by city
export const fetchTemperatureForPastDaysByCity = async (city_id: string, past_days_count: number): Promise<IDailySummaryData[] | []> => {
  try {
    const dailySummaries = await DailySummary.find({ city_id })
      .sort({ date: -1 })
      .limit(past_days_count)
      .lean();

    if (!dailySummaries.length) {
      return [];
    }

    return dailySummaries as IDailySummaryData[];
  } catch (error) {
    console.error('Error fetching daily summaries:', error);
    throw new Error('Internal server error');
  }
};

// Fetch temperature for the past few hours by city
export const fetchTemperatureForPastHoursByCity = async (city_id: string, past_hours_count: number): Promise<IPastHourWeatherData[]> => {
  const endTime = new Date(); // Current time
  const startTime = new Date(endTime.getTime() - past_hours_count * 60 * 60 * 1000); // Subtract hours

  try {
    const temperatureData = await Weather.aggregate<IPastHourWeatherData>([
      {
        $match: {
          city_id: city_id,
          dt: { $gte: startTime, $lte: endTime },
        },
      },
      {
        $group: {
          _id: { hour: { $hour: "$dt" } }, // Group by the hour
          city_id: { $first: "$city_id" }, // Include city_id in the result
          avgTemp: { $avg: "$temperature" },
          count: { $sum: 1 },
          avgFeelsLike: { $avg: "$feels_like" },
          avgHumidity: { $avg: "$humidity" },
          avgPressure: { $avg: "$pressure" },
        },
      },
      {
        $sort: { "_id.hour": 1 },
      },
    ]);

    return temperatureData;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw new Error('Internal server error');
  }
};
