import { Coordinates } from '../types/coordinates';

export type GeolocationFailure =
    | 'unsupported'
    | 'denied'
    | 'unavailable'
    | 'timeout';

export class GeolocationError extends Error {
    constructor(public readonly reason: GeolocationFailure) {
        super(`Geolocation failed: ${reason}`);

        this.name = 'GeolocationError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const GEOLOCATION_MESSAGES: Record<GeolocationFailure, string> = {
    unsupported:
        'Your browser does not support location. Please search for a city.',
    denied:
        'Location access was denied. Allow it in your browser settings or search for a city.',
    unavailable:
        'Your location could not be determined. Please search for a city.',
    timeout:
        'Finding your location took too long. Please try again or search for a city.',
};

const PERMISSION_DENIED_CODE = 1;
const TIMEOUT_CODE = 3;

const GEOLOCATION_TIMEOUT_MS = 10_000;
const MAXIMUM_LOCATION_AGE_MS = 5 * 60 * 1000;

export const getCurrentCoordinates = (): Promise<Coordinates> =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new GeolocationError('unsupported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coordinates: Coordinates = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };

                resolve(coordinates);
            },
            (positionError) => {
                const failureReason = getGeolocationFailure(positionError.code);

                reject(new GeolocationError(failureReason));
            },
            {
                enableHighAccuracy: false,
                timeout: GEOLOCATION_TIMEOUT_MS,
                maximumAge: MAXIMUM_LOCATION_AGE_MS,
            },
        );
    });

function getGeolocationFailure(errorCode: number): GeolocationFailure {
    switch (errorCode) {
        case PERMISSION_DENIED_CODE:
            return 'denied';

        case TIMEOUT_CODE:
            return 'timeout';

        default:
            return 'unavailable';
    }
}