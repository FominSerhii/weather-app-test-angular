import { WeatherResponse } from '../types/weather-response';
import { toCityWeatherProps } from './weather-mapper';

const response: WeatherResponse = {
    coord: { lon: 16.37, lat: 48.21 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    base: 'stations',
    main: {
        temp: 20,
        feels_like: 19,
        pressure: 1012,
        humidity: 50,
        temp_min: 18,
        temp_max: 22,
    },
    visibility: 10000,
    wind: { speed: 5, deg: 180 },
    clouds: { all: 0 },
    dt: 1_700_000_000,
    sys: {
        type: 2,
        id: 1,
        country: 'AT',
        sunrise: 1_699_000_000,
        sunset: 1_699_040_000,
    },
    timezone: 3600,
    id: 1,
    name: 'Vienna',
    cod: 200,
};

describe('toCityWeatherProps', () => {
    it('maps weather data and formats metric values', () => {
        const result = toCityWeatherProps(response, 'metric', response.dt);

        expect(result.name).toBe('Vienna');
        expect(result.country).toBe('AT');
        expect(result.temp).toBe(20);
        expect(result.feelsLike).toBe(19);
        expect(result.windSpeed).toBe(5);
        expect(result.tempUnit).toBe('°C');
        expect(result.windUnit).toBe('m/s');
        expect(result.theme).toBe('clear-day');
        expect(result.date).toBeTruthy();
        expect(result.time).toBeTruthy();
    });

    it('converts temperatures and wind speed to imperial units', () => {
        const result = toCityWeatherProps(response, 'imperial', response.dt);

        expect(result.temp).toBe(68);
        expect(result.feelsLike).toBeCloseTo(66.2);
        expect(result.windSpeed).toBe(11.2);
        expect(result.tempUnit).toBe('°F');
        expect(result.windUnit).toBe('mph');
    });

    it('maps night clear-weather icons to the night theme', () => {
        const nightResponse: WeatherResponse = {
            ...response,
            weather: [
                { ...response.weather[0], icon: '01n' },
            ],
        };

        expect(toCityWeatherProps(nightResponse, 'metric').theme).toBe(
            'clear-night',
        );
    });
});