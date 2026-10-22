import { Injectable, computed, inject, signal } from '@angular/core';

import { CityNotFoundError, WeatherApiService } from '../services/weather-api.service';
import {
  GEOLOCATION_MESSAGES,
  GeolocationError,
  getCurrentCoordinates,
} from '../services/geolocation';
import { Units } from '../types/units';
import { WeatherResponse } from '../types/weather-response';
import { parseCities } from '../utils/parse-cities';
import { toCityWeatherProps } from '../utils/weather-mapper';
import { loadCities, loadUnits, saveCities, saveUnits } from '../utils/storage';

const SERVICE_ERROR = 'Weather service error. Check your API key or connection.';

@Injectable({ providedIn: 'root' })
export class WeatherStore {
  private readonly api = inject(WeatherApiService);

  // ---- state (was WeatherState) ----
  private readonly raw = signal<WeatherResponse[]>([]);
  readonly loading = signal(false);
  readonly failed = signal<string[]>([]);
  readonly error = signal<string | null>(null);
  readonly pendingCount = signal(0);
  readonly units = signal<Units>(loadUnits());

  // ---- selectors (was createSelector) ----
  readonly cities = computed(() =>
    this.raw().map((r) => toCityWeatherProps(r, this.units())),
  );

  readonly isEmpty = computed(
    () =>
      !this.loading() &&
      !this.error() &&
      this.cities().length === 0 &&
      this.failed().length === 0,
  );

  // ---- actions (was thunks + reducers) ----
  async fetchWeather(query: string): Promise<void> {
    const cities = parseCities(query);
    if (cities.length === 0) return;

    this.loading.set(true);
    this.failed.set([]);
    this.error.set(null);
    this.pendingCount.set(cities.length);

    const results = await Promise.allSettled(
      cities.map((c) => this.api.fetchCityWeather(c)),
    );

    const data: WeatherResponse[] = [];
    const failed: string[] = [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === 'fulfilled') {
        data.push(r.value);
      } else if (r.reason instanceof CityNotFoundError) {
        failed.push(cities[i]);
      } else {
        // equivalent of rejectWithValue + the rejected reducer
        this.raw.set([]);
        this.error.set(SERVICE_ERROR);
        this.loading.set(false);
        this.pendingCount.set(0);
        return;
      }
    }

    this.raw.set(data);
    this.failed.set(failed);
    this.loading.set(false);
    this.pendingCount.set(0);
    this.persist();
  }

  async fetchByLocation(): Promise<void> {
    this.loading.set(true);
    this.failed.set([]);
    this.error.set(null);
    this.pendingCount.set(1);

    try {
      const coords = await getCurrentCoordinates();
      const res = await this.api.fetchByCoords(coords);
      this.raw.set([res]);
      this.failed.set([]);
      this.persist();
    } catch (e) {
      this.error.set(
        e instanceof GeolocationError ? GEOLOCATION_MESSAGES[e.reason] : SERVICE_ERROR,
      );
    } finally {
      this.loading.set(false);
      this.pendingCount.set(0);
    }
  }

  removeCity(id: number): void {
    this.raw.update((d) => d.filter((c) => c.id !== id));
    this.persist();
  }

  setUnits(units: Units): void {
    this.units.set(units);
    saveUnits(units);
  }

  // Refetch the cities saved in the previous session
  restoreSession(): void {
    const saved = loadCities();
    if (saved.length > 0) void this.fetchWeather(saved.join(','));
  }

  private persist(): void {
    saveCities(this.raw().map((c) => c.name));
  }
}