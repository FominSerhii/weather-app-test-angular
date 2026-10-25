import { isPlatformBrowser } from '@angular/common';
import {
    Injectable,
    PLATFORM_ID,
    computed,
    inject,
    signal,
} from '@angular/core';

import { CityNotFoundError, WeatherApiService } from '../services/weather-api.service';
import {
    GEOLOCATION_MESSAGES,
    GeolocationError,
    getCurrentCoordinates,
} from '../services/geolocation';
import { ClockService } from '../services/clock.service';

import { Units } from '../types/units';
import { WeatherResponse } from '../types/weather-response';
import { ForecastState, ForecastView } from '../types/forecast';

import { parseCities } from '../utils/parse-cities';
import { toDailyForecast } from '../utils/forecast-mapper';
import { toCityWeatherProps } from '../utils/weather-mapper';
import { loadCities, loadUnits, saveCities, saveUnits } from '../utils/storage';

const SERVICE_ERROR = 'Weather service error. Check your API key or connection.';
const STALE_MS = 10 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class WeatherStore {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);
    private readonly api = inject(WeatherApiService);

    private readonly raw = signal<WeatherResponse[]>([]);
    private readonly clock = inject(ClockService);
    readonly lastUpdated = signal<number | null>(null);

    readonly cities = computed(() => {
        const now = this.clock.now();
        return this.raw().map((r) => toCityWeatherProps(r, this.units(), now));
    });

    readonly loading = signal(false);
    readonly failed = signal<string[]>([]);
    readonly error = signal<string | null>(null);
    readonly pendingCount = signal(0);
    readonly units = signal<Units>(loadUnits());

    readonly isEmpty = computed(
        () =>
            !this.loading() &&
            !this.error() &&
            this.cities().length === 0 &&
            this.failed().length === 0,
    );
    private readonly activeId = signal<number | null>(null);
    readonly selectedId = computed(() => {
        const ids = this.raw().map((r) => r.id);
        const active = this.activeId();
        return active !== null && ids.includes(active) ? active : (ids[0] ?? null);
    });
    readonly selectedCity = computed(
        () => this.cities().find((c) => c.id === this.selectedId()) ?? null,
    );
    private readonly selectedRaw = computed(
        () => this.raw().find((r) => r.id === this.selectedId()) ?? null,
    );
    private readonly forecastCache = signal<Record<number, ForecastState>>({});

    readonly selectedForecast = computed<ForecastView>(() => {
        const id = this.selectedId();
        const entry = id === null ? undefined : this.forecastCache()[id];
        return {
            status: entry?.status ?? 'loading',
            days: entry?.data
                ? toDailyForecast(entry.data, this.units(), this.clock.now())
                : [],
        };
    });

    constructor() {
        if (!this.isBrowser) {
            return;
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshIfStale();
            }
        });
    }

    refreshIfStale(): void {
        const t = this.lastUpdated();
        if (this.loading() || t === null || Date.now() - t < STALE_MS) return;
        const names = this.raw().map((c) => c.name);
        if (names.length) void this.fetchWeather(names.join(','));
    }

    async fetchWeather(query: string): Promise<void> {
        const cities = parseCities(query);

        if (cities.length === 0) {
            return;
        }

        this.loading.set(true);
        this.failed.set([]);
        this.error.set(null);
        this.pendingCount.set(cities.length);

        const results = await Promise.allSettled(
            cities.map((city) => this.api.fetchCityWeather(city)),
        );

        const weatherResponses: WeatherResponse[] = [];
        const failedCities: string[] = [];

        for (let index = 0; index < results.length; index++) {
            const result = results[index];

            if (result.status === 'fulfilled') {
                weatherResponses.push(result.value);
            } else if (result.reason instanceof CityNotFoundError) {
                failedCities.push(cities[index]);
            } else {
                this.raw.set([]);
                this.error.set(SERVICE_ERROR);
                this.loading.set(false);
                this.pendingCount.set(0);
                return;
            }
        }

        this.raw.set(weatherResponses);
        this.failed.set(failedCities);
        this.loading.set(false);
        this.pendingCount.set(0);

        this.persist();
        this.lastUpdated.set(Date.now());
        this.loadSelectedForecast();
    }

    async fetchByLocation(): Promise<void> {
        this.loading.set(true);
        this.failed.set([]);
        this.error.set(null);
        this.pendingCount.set(1);

        try {
            const coordinates = await getCurrentCoordinates();
            const weatherResponse = await this.api.fetchByCoords(coordinates);

            this.raw.set([weatherResponse]);
            this.activeId.set(weatherResponse.id);
            this.failed.set([]);

            this.persist();
            this.lastUpdated.set(Date.now());
            this.loadSelectedForecast();
        } catch (error) {
            this.error.set(
                error instanceof GeolocationError
                    ? GEOLOCATION_MESSAGES[error.reason]
                    : SERVICE_ERROR,
            );
        } finally {
            this.loading.set(false);
            this.pendingCount.set(0);
        }
    }

    removeCity(cityId: number): void {
        this.raw.update((weatherResponses) =>
            weatherResponses.filter((response) => response.id !== cityId),
        );

        this.persist();
        this.loadSelectedForecast();
    }

    setUnits(units: Units): void {
        this.units.set(units);
        saveUnits(units);
    }

    restoreSession(): void {
        const savedCities = loadCities();

        if (savedCities.length > 0) {
            void this.fetchWeather(savedCities.join(','));
        }
    }

    private persist(): void {
        const cityNames = this.raw().map((response) => response.name);

        saveCities(cityNames);
    }

    selectCity(id: number): void {
        this.activeId.set(id);
        this.loadSelectedForecast();
    }

    retryForecast(): void {
        this.loadSelectedForecast(true);
    }

    private loadSelectedForecast(force = false): void {
        const r = this.selectedRaw();
        if (r) void this.loadForecast(r, force);
    }

    private async loadForecast(r: WeatherResponse, force: boolean): Promise<void> {
        const current = this.forecastCache()[r.id];
        const fresh =
            current?.status === 'ready' &&
            Date.now() - (current.fetchedAt ?? 0) < STALE_MS;
        if (!force && (current?.status === 'loading' || fresh)) return;

        this.setForecast(r.id, { status: 'loading', data: current?.data });
        try {
            const data = await this.api.fetchForecast({
                lat: r.coord.lat,
                lon: r.coord.lon,
            });
            this.setForecast(
                r.id, { 
                    status: 'ready', 
                    data, 
                    fetchedAt: Date.now() 
                });
        } catch {
            this.setForecast(
                r.id, { 
                    status: 'error', 
                    data: current?.data 
                });
        }
    }

    private setForecast(id: number, state: ForecastState): void {
        this.forecastCache.update((cache) => ({ ...cache, [id]: state }));
    }
}