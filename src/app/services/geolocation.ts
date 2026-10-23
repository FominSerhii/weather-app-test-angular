import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

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

export const getCurrentCoordinates = async (): Promise<Coordinates> => {
    try {
        if (Capacitor.isNativePlatform()) {
            let permission = await Geolocation.checkPermissions();

            if (permission.location !== 'granted') {
                permission = await Geolocation.requestPermissions({
                    permissions: ['location'],
                });
            }

            if (permission.location !== 'granted') {
                throw new GeolocationError('denied');
            }
        }

        const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: GEOLOCATION_TIMEOUT_MS,
            maximumAge: MAXIMUM_LOCATION_AGE_MS,
        });

        return { lat: position.coords.latitude, lon: position.coords.longitude };
    } catch (error) {
        if (error instanceof GeolocationError) throw error;
        throw new GeolocationError(mapGeolocationError(error));
    }
};

function mapGeolocationError(error: unknown): GeolocationFailure {
    const geolocationError = error as {
        code?: number;
        message?: string;
    };

    const errorCode = geolocationError.code;
    const errorMessage = (geolocationError.message ?? '').toLowerCase();

    const isPermissionDenied =
        errorCode === PERMISSION_DENIED_CODE ||
        errorMessage.includes('denied');

    if (isPermissionDenied) {
        return 'denied';
    }

    const isTimeout =
        errorCode === TIMEOUT_CODE ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('timed out');

    if (isTimeout) {
        return 'timeout';
    }

    return 'unavailable';
}