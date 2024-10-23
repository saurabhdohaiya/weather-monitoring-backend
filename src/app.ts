import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes';
import cron from 'node-cron';
import cors from 'cors';
import { fetchWeatherDataForAllCities, calculateAndSaveDailySummaries } from './services/weatherService';
import connectDB from './constants/db';

dotenv.config();

const app = express();

const startServer = async () => {
  try {
    await connectDB();

    app.use(express.json());
    app.use(cors());

    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: "Health Great!" });
    });

    app.use('/api/weather', weatherRoutes);

    const fetchWeatherData = async () => {
      try {
        await fetchWeatherDataForAllCities();
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    await fetchWeatherData();

    // Uncomment and use this if you want to calculate and save daily summaries this should be schedule once everyday
    cron.schedule('1 0 * * *', async () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      await calculateAndSaveDailySummaries(date);
      console.log('Daily weather summaries calculated and saved every minute.');
    });

  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
export default app;
