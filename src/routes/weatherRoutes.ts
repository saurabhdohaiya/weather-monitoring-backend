import { Router } from 'express';
import {
  getCurrentWeather,
  getWeatherHistory,
} from '../controllers/weatherController';

const router = Router();

router.get('/current', getCurrentWeather);
router.get('/history', getWeatherHistory);

export default router;
