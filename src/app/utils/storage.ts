import { Units } from '../types/units';

const CITIES_KEY = 'weather.cities';
const UNITS_KEY = 'weather.units';

export const loadCities = (): string[] => {
    try {
        const v = JSON.parse(localStorage.getItem(CITIES_KEY) ?? '[]');
        return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
    } catch {
        return [];
    }
};

export const saveCities = (cities: string[]): void => {
    try { localStorage.setItem(CITIES_KEY, JSON.stringify(cities)); } catch { /* ignore */ }
};

export const loadUnits = (): Units => {
    try {
        return localStorage.getItem(UNITS_KEY) === 'imperial' ? 'imperial' : 'metric';
    } catch {
        return 'metric';
    }
};

export const saveUnits = (units: Units): void => {
    try { 
        localStorage.setItem(UNITS_KEY, units); 
    } catch { 
        // ignore 
    }
};