import { DailyForecast, ForecastResponse, ForecastSlot } from '../types/forecast';
import { Units } from '../types/units';
import { toTheme } from './weather-mapper';

export const FORECAST_DAYS = 5;

const MIN_SLOTS_PER_DAY = 3;

const weekdayFormat = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    timeZone: 'UTC',
});

const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
});

// Shift by the city's timezone offset, then read the date and hour as UTC.
const shifted = (unix: number, offset: number) =>
    new Date((unix + offset) * 1000);

const dayKey = (unix: number, offset: number) =>
    shifted(unix, offset).toISOString().slice(0, 10);

const hourOf = (unix: number, offset: number) =>
    shifted(unix, offset).getUTCHours();

const toUtcDate = (iso: string) =>
    new Date(`${iso}T00:00:00Z`);

export const toDailyForecast = (
    response: ForecastResponse,
    units: Units,
    now: number, // Unix timestamp in seconds
): DailyForecast[] => {
    const offset = response.city.timezone;
    const today = dayKey(now, offset);

    const convertTemperature = (celsius: number) =>
        units === 'imperial' ? (celsius * 9) / 5 + 32 : celsius;

    // Group 3-hour forecast slots by city-local date.
    // The list is chronological, and Map preserves insertion order.
    const groups = new Map<string, ForecastSlot[]>();

    for (const slot of response.list) {
        const date = dayKey(slot.dt, offset);
        const group = groups.get(date);

        if (group) {
            group.push(slot);
        } else {
            groups.set(date, [slot]);
        }
    }

    return [...groups.entries()]
        .filter(([, slots]) => slots.length >= MIN_SLOTS_PER_DAY)
        .slice(0, FORECAST_DAYS)
        .map(([date, slots]) => {
            // Select the forecast slot closest to midday.
            const midday = slots.reduce((best, slot) =>
                Math.abs(hourOf(slot.dt, offset) - 12) <
                    Math.abs(hourOf(best.dt, offset) - 12)
                    ? slot
                    : best,
            );

            const condition = midday.weather[0];

            const precipitationProbabilities = slots
                .map((slot) => slot.pop)
                .filter((probability): probability is number =>
                    typeof probability === 'number',
                );

            return {
                date,
                weekday: weekdayFormat.format(toUtcDate(date)),
                shortDate: dateFormat.format(toUtcDate(date)),
                isToday: date === today,

                // Always use the day variant of the icon for daily summaries.
                theme: toTheme(
                    condition.main,
                    condition.icon.replace(/n$/, 'd'),
                ),

                description: condition.description,

                max: convertTemperature(
                    Math.max(...slots.map((slot) => slot.main.temp_max)),
                ),

                min: convertTemperature(
                    Math.min(...slots.map((slot) => slot.main.temp_min)),
                ),

                rainChance: precipitationProbabilities.length
                    ? Math.round(Math.max(...precipitationProbabilities) * 100)
                    : null,
            };
        });
};