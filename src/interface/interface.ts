export interface IWind{
  speed: number;
  deg: number;
}

export interface IWeatherData {
  city: string;
  city_id: string;
  temperature: number;
  feels_like?: number;
  condition: string;
  icon: string;
  humidity: number;
  pressure: number;
  wind?: IWind | null;
  dt: Date;
}


export interface IDailySummaryData { 
  city_id: string;
  city: string;
  date: Date;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  mostFrequentCondition: string;
}

export interface IPastHourWeatherData {
  _id: { hour: number }; 
  city_id: string;       
  avgTemp: number;       
  count: number;         
  avgFeelsLike: number;  
  avgHumidity: number;   
  avgPressure: number;   
}