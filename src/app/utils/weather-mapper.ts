import { CityWeatherView } from '../types/city-weather';
import { Units } from '../types/units';
import { WeatherResponse } from '../types/weather-response';
import { WeatherTheme } from '../types/weather-theme';

const toTheme = (
  weatherCondition: string,
  iconCode: string,
): WeatherTheme => {
  switch (weatherCondition) {
    case 'Clear':
      return iconCode.endsWith('n') ? 'clear-night' : 'clear-day';

    case 'Clouds':
      return 'clouds';

    case 'Rain':
    case 'Drizzle':
      return 'rain';

    case 'Snow':
      return 'snow';

    case 'Thunderstorm':
      return 'thunderstorm';

    default:
      return 'mist';
  }
};

const local = (
    unix: number, 
    offset: number, 
    opts: Intl.DateTimeFormatOptions, 
    locale: string
) =>
  new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...opts }).format(
    new Date((unix + offset) * 1000),
  );

const TIME: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
};
const DATE: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export const toCityWeatherProps = (response: WeatherResponse, units: Units): CityWeatherView => {
  const imperial = units === 'imperial';
  const conv = (c: number) => (imperial ? (c * 9) / 5 + 32 : c);
  const w = response.weather[0];
  return {
    id: response.id,
    name: response.name,
    country: response.sys.country,
    description: w.description,
    icon: w.icon,
    windSpeed: round1(imperial ? response.wind.speed * 2.23694 : response.wind.speed),
    temp: conv(response.main.temp),
    feelsLike: conv(response.main.feels_like),
    humidity: response.main.humidity,
    tempUnit: imperial ? '°F' : '°C',
    windUnit: imperial ? 'mph' : 'm/s',
    date: local(response.dt, response.timezone, DATE, 'en-GB'),
    time: local(response.dt, response.timezone, TIME, 'en-GB'),
    sunrise: local(response.sys.sunrise, response.timezone, TIME, 'en-GB'),
    sunset: local(response.sys.sunset, response.timezone, TIME, 'en-GB'),
    theme: toTheme(w.main, w.icon),
  };
};