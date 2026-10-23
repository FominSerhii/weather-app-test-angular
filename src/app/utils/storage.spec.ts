import {
    loadCities,
    loadUnits,
    loadTheme,
    saveCities,
    saveUnits,
    saveTheme,
} from './storage';

describe('storage utilities', () => {
    beforeEach(() => localStorage.clear());

    it('saves and loads city names', () => {
        saveCities(['Vienna', 'Prague']);

        expect(loadCities()).toEqual(['Vienna', 'Prague']);
    });

    it('filters invalid city values from stored data', () => {
        localStorage.setItem('weather.cities', '["Vienna", 12, null]');

        expect(loadCities()).toEqual(['Vienna']);
    });

    it('returns an empty city list when stored JSON is invalid', () => {
        localStorage.setItem('weather.cities', '{invalid');

        expect(loadCities()).toEqual([]);
    });

    it('defaults to metric units and persists unit changes', () => {
        expect(loadUnits()).toBe('metric');

        saveUnits('imperial');

        expect(loadUnits()).toBe('imperial');
    });

    it('loads only supported theme values', () => {
        expect(loadTheme()).toBeNull();

        saveTheme('dark');
        expect(loadTheme()).toBe('dark');

        localStorage.setItem('weather-app:theme', 'invalid');
        expect(loadTheme()).toBeNull();
    });
});