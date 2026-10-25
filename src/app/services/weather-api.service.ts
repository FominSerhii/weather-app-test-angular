import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Coordinates } from '../types/coordinates';
import { WeatherResponse } from '../types/weather-response';
import { ForecastResponse } from '../types/forecast';

const WEATHER_API_URL =
    'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const DEFAULT_UNITS = 'metric';

export class CityNotFoundError extends Error {
    constructor(public readonly cityName: string) {
        super(`City not found: ${cityName}`);

        this.name = 'CityNotFoundError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
    private readonly httpClient = inject(HttpClient);

    fetchCityWeather(cityName: string): Promise<WeatherResponse> {
        return this.fetchWeather({ q: cityName }, cityName);
    }

    fetchByCoords(coordinates: Coordinates): Promise<WeatherResponse> {
        const { lat, lon } = coordinates;

        return this.fetchWeather({ lat, lon }, `${lat},${lon}`);
    }

    private async fetchWeather(
        queryParameters: Record<string, string | number>,
        locationLabel: string,
    ): Promise<WeatherResponse> {
        try {
            return await firstValueFrom(
                this.httpClient.get<WeatherResponse>(WEATHER_API_URL, {
                    params: {
                        ...queryParameters,
                        units: DEFAULT_UNITS,
                        appid: environment.owmApiKey,
                    },
                }),
            );
        } catch (error: unknown) {
            if (error instanceof HttpErrorResponse && error.status === 404) {
                throw new CityNotFoundError(locationLabel);
            }

            throw error;
        }
    }

    fetchForecast({ lat, lon }: Coordinates): Promise<ForecastResponse> {
        return firstValueFrom(
            this.httpClient.get<ForecastResponse>(FORECAST_API_URL, {
                params: {
                    lat,
                    lon,
                    units: DEFAULT_UNITS,
                    appid: environment.owmApiKey,
                },
            }),
        );
    }
}