import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Coordinates } from '../types/coordinates';
import { WeatherResponse } from '../types/weather-response';

export class CityNotFoundError extends Error {
    constructor(public readonly city: string) {
        super(`City not found: ${city}`);
        this.name = 'CityNotFoundError';
        Object.setPrototypeOf(this, CityNotFoundError.prototype);
    }
}

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    fetchCityWeather(city: string): Promise<WeatherResponse> {
        return this.request({ q: city }, city);
    }

    fetchByCoords({ lat, lon }: Coordinates): Promise<WeatherResponse> {
        return this.request({ lat, lon }, `${lat},${lon}`);
    }

    private async request(
        params: Record<string, string | number>,
        label: string,
    ): Promise<WeatherResponse> {
        try {
            return await firstValueFrom(
                this.http.get<WeatherResponse>(this.baseUrl, {
                    params: { ...params, units: 'metric', appid: environment.owmApiKey },
                }),
            );
        } catch (e) {
            if (e instanceof HttpErrorResponse && e.status === 404) {
                throw new CityNotFoundError(label);
            }
            throw e;
        }
    }
}