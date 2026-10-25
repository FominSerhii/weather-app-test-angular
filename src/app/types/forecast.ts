import { WeatherTheme } from './weather-theme';

export type ForecastSlot = {
    dt: number; // Unix timestamp in UTC, 3-hour intervals
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
    };
    weather: {
        main: string;
        description: string;
        icon: string;
    }[];
    pop?: number; // Probability of precipitation, 0..1
};

export type ForecastResponse = {
    list: ForecastSlot[];
    city: {
        timezone: number;
        coord: {
            lat: number;
            lon: number;
        };
    };
};

export type DailyForecast = {
    date: string; // 'YYYY-MM-DD', city-local
    weekday: string;
    shortDate: string;
    isToday: boolean;
    theme: WeatherTheme;
    description: string;
    max: number;
    min: number;
    rainChance: number | null; // Percentage
};

export type ForecastStatus = 'loading' | 'ready' | 'error';

export type ForecastState = {
    status: ForecastStatus;
    data?: ForecastResponse;
    fetchedAt?: number;
};

export type ForecastView = {
    status: ForecastStatus;
    days: DailyForecast[];
};