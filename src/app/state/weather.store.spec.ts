import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ClockService } from '../services/clock.service';
import {
    CityNotFoundError,
    WeatherApiService,
} from '../services/weather-api.service';
import { WeatherResponse } from '../types/weather-response';
import { WeatherStore } from './weather.store';

const response = (name: string, id: number): WeatherResponse => ({
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
    id,
    name,
    cod: 200,
});

describe('WeatherStore', () => {
    let store: WeatherStore;
    let api: jasmine.SpyObj<WeatherApiService>;

    beforeEach(() => {
        localStorage.clear();

        api = jasmine.createSpyObj<WeatherApiService>(
            'WeatherApiService',
            ['fetchCityWeather', 'fetchByCoords'],
        );

        TestBed.configureTestingModule({
            providers: [
                WeatherStore,
                { provide: WeatherApiService, useValue: api },
                { provide: PLATFORM_ID, useValue: 'server' },
                { provide: ClockService, useValue: { now: signal(1_700_000_000) } },
            ],
        });

        store = TestBed.inject(WeatherStore);
    });

    it('loads weather for each parsed city and persists the successful results', async () => {
        api.fetchCityWeather.and.callFake(async (city) =>
            response(city, city === 'Vienna' ? 1 : 2),
        );

        await store.fetchWeather('Vienna, Prague');

        expect(api.fetchCityWeather).toHaveBeenCalledTimes(2);
        expect(store.cities().map((city) => city.name)).toEqual([
            'Vienna',
            'Prague',
        ]);
        expect(store.loading()).toBeFalse();
        expect(store.pendingCount()).toBe(0);
        expect(JSON.parse(localStorage.getItem('weather.cities') ?? '[]')).toEqual([
            'Vienna',
            'Prague',
        ]);
    });

    it('keeps successful cities and reports cities that were not found', async () => {
        api.fetchCityWeather.and.callFake(async (city) => {
            if (city === 'Missing') {
                throw new CityNotFoundError(city);
            }
            return response(city, 1);
        });

        await store.fetchWeather('Vienna, Missing');

        expect(store.cities().map((city) => city.name)).toEqual(['Vienna']);
        expect(store.failed()).toEqual(['Missing']);
        expect(store.error()).toBeNull();
    });

    it('sets a service error when a request fails unexpectedly', async () => {
        api.fetchCityWeather.and.rejectWith(new Error('network failure'));

        await store.fetchWeather('Vienna');

        expect(store.error()).toBeTruthy();
        expect(store.cities()).toEqual([]);
        expect(store.loading()).toBeFalse();
        expect(store.pendingCount()).toBe(0);
    });

    it('removes a city and persists the remaining cities', async () => {
        api.fetchCityWeather.and.callFake(async (city) =>
            response(city, city === 'Vienna' ? 1 : 2),
        );

        await store.fetchWeather('Vienna, Prague');
        store.removeCity(1);

        expect(store.cities().map((city) => city.name)).toEqual(['Prague']);
        expect(JSON.parse(localStorage.getItem('weather.cities') ?? '[]')).toEqual([
            'Prague',
        ]);
    });

    it('persists unit changes', () => {
        store.setUnits('imperial');

        expect(store.units()).toBe('imperial');
        expect(localStorage.getItem('weather.units')).toBe('imperial');
    });
});