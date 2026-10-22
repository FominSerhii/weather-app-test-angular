import { Coordinates } from '../types/coordinates';

export type GeolocationFailure = 'unsupported' | 'denied' | 'unavailable' | 'timeout';

export class GeolocationError extends Error {
    constructor(public readonly reason: GeolocationFailure) {
        super(`Geolocation failed: ${reason}`);
        this.name = 'GeolocationError';
        Object.setPrototypeOf(this, GeolocationError.prototype);
    }
}

export const GEOLOCATION_MESSAGES: Record<GeolocationFailure, string> = {
    unsupported: 'Your browser does not support location. Please search for a city.',
    denied: 'Location access was denied. Allow it in your browser settings or search for a city.',
    unavailable: 'Your location could not be determined. Please search for a city.',
    timeout: 'Finding your location took too long. Please try again or search for a city.',
};

const PERMISSION_DENIED = 1;
const TIMEOUT = 3;

export const getCurrentCoordinates = (): Promise<Coordinates> =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new GeolocationError('unsupported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
            (error) => {
                const reason: GeolocationFailure =
                    error.code === PERMISSION_DENIED ? 'denied'
                        : error.code === TIMEOUT ? 'timeout'
                            : 'unavailable';
                reject(new GeolocationError(reason));
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
        );
    });