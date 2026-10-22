import { WeatherTheme } from './weather-theme';

export type CityWeatherView = {
  id: number;
  name: string;
  country: string;
  description: string;
  icon: string;
  windSpeed: number;
  temp: number;
  date: string;
  time: string;
  tempUnit: string; // '°C' | '°F'
  windUnit: string; // 'm/s' | 'mph'
  feelsLike: number;
  humidity: number;
  sunrise: string;
  sunset: string;
  theme: WeatherTheme;
};