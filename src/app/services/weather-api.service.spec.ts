import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
    CityNotFoundError,
    WeatherApiService,
} from './weather-api.service';
import { WeatherResponse } from '../types/weather-response';

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

describe('WeatherApiService', () => {
    let service: WeatherApiService;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(WeatherApiService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('requests weather by city with metric units', async () => {
        const resultPromise = service.fetchCityWeather('Vienna');

        const request = http.expectOne(
            (req) => req.url === 'https://api.openweathermap.org/data/2.5/weather',
        );

        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('q')).toBe('Vienna');
        expect(request.request.params.get('units')).toBe('metric');
        expect(request.request.params.has('appid')).toBeTrue();

        request.flush(response);

        await expectAsync(resultPromise).toBeResolvedTo(response);
    });

    it('requests weather by coordinates', async () => {
        const resultPromise = service.fetchByCoords({ lat: 48.21, lon: 16.37 });

        const request = http.expectOne(
            (req) => req.url === 'https://api.openweathermap.org/data/2.5/weather',
        );

        expect(request.request.params.get('lat')).toBe('48.21');
        expect(request.request.params.get('lon')).toBe('16.37');

        request.flush(response);

        await expectAsync(resultPromise).toBeResolvedTo(response);
    });

    it('converts a 404 response into CityNotFoundError', async () => {
        const resultPromise = service.fetchCityWeather('NoSuchCity');

        http.expectOne(
            (req) => req.url === 'https://api.openweathermap.org/data/2.5/weather',
        ).flush(
            { message: 'city not found' },
            { status: 404, statusText: 'Not Found' },
        );

        await expectAsync(resultPromise).toBeRejectedWith(
            jasmine.any(CityNotFoundError),
        );
    });
});