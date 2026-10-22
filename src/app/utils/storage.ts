import { Units } from '../types/units';

const CITIES_KEY = 'weather.cities';
const UNITS_KEY = 'weather.units';
const THEME_KEY = 'weather-app:theme';

export const loadCities = (): string[] => {
    try {
        const v = JSON.parse(localStorage.getItem(CITIES_KEY) ?? '[]');
        return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
    } catch {
        return [];
    }
};

export const saveCities = (cities: string[]): void => {
    try {
        localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
    } catch {
        // ignore  
    }
};

export const loadUnits = (): Units => {
    if (typeof localStorage === 'undefined') {
        return 'metric'; 
    }
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

export const loadTheme = (): 'light' | 'dark' | null => {
    try {
        const v = localStorage.getItem(THEME_KEY);
        return v === 'light' || v === 'dark' ? v : null;
    } catch { return null; }
};

export const saveTheme = (mode: 'light' | 'dark'): void => {
    try { 
        localStorage.setItem(THEME_KEY, mode); 
    } catch { 
        /* storage unavailable */ 
    }
};