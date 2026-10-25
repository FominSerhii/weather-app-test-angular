import { ForecastResponse, ForecastSlot } from '../types/forecast';
import { toDailyForecast } from './forecast-mapper';

const offset = 3600;

function makeSlot(
  localDate: string,
  localHour: number,
  tempMin: number,
  tempMax: number,
  pop?: number,
  condition = 'Clear',
): ForecastSlot {
  const hour = String(localHour).padStart(2, '0');
  const timestamp =
    Date.parse(`${localDate}T${hour}:00:00Z`) / 1000 - offset;

  return {
    dt: timestamp,
    main: {
      temp: tempMax,
      temp_min: tempMin,
      temp_max: tempMax,
    },
    weather: [
      {
        main: condition,
        description: condition.toLowerCase(),
        icon: condition === 'Clear' ? '01n' : '11n',
      },
    ],
    ...(pop === undefined ? {} : { pop }),
  };
}

function makeResponse(list: ForecastSlot[]): ForecastResponse {
  return {
    list,
    city: {
      timezone: offset,
      coord: {
        lat: 48.21,
        lon: 16.37,
      },
    },
  };
}

describe('toDailyForecast', () => {
  it('groups slots by city-local date, derives daily values, and limits to five days', () => {
    const dates = Array.from({ length: 6 }, (_, index) => {
      const day = new Date(Date.UTC(2026, 9, 23 + index));
      return day.toISOString().slice(0, 10);
    });

    const slots = dates.flatMap((date) =>
      [6, 9, 12, 15].map((hour, index) =>
        makeSlot(
          date,
          hour,
          8 + index,
          18 + index,
          index / 4,
        ),
      ),
    );

    const result = toDailyForecast(
      makeResponse(slots),
      'metric',
      Date.parse('2026-10-23T09:00:00Z') / 1000,
    );

    expect(result.length).toBe(5);
    expect(result[0].date).toBe('2026-10-23');
    expect(result[0].isToday).toBeTrue();
    expect(result[0].max).toBe(21);
    expect(result[0].min).toBe(8);
    expect(result[0].rainChance).toBe(75);
  });

  it('converts daily temperatures to Fahrenheit and returns null without precipitation data', () => {
    const date = '2026-10-23';

    const slots = [6, 9, 12, 15].map((hour) =>
      makeSlot(
        date,
        hour,
        0,
        20,
        undefined,
        'Thunderstorm',
      ),
    );

    const result = toDailyForecast(
      makeResponse(slots),
      'imperial',
      Date.parse('2026-10-23T09:00:00Z') / 1000,
    );

    expect(result[0].max).toBe(68);
    expect(result[0].min).toBe(32);
    expect(result[0].rainChance).toBeNull();
    expect(result[0].theme).toBe('thunderstorm');
  });

  it('omits city-local dates with fewer than three forecast slots', () => {
    const slots = [
      makeSlot('2026-10-23', 6, 8, 18),
      makeSlot('2026-10-23', 9, 8, 18),
      makeSlot('2026-10-24', 6, 8, 18),
      makeSlot('2026-10-24', 9, 8, 18),
    ];

    const result = toDailyForecast(
      makeResponse(slots),
      'metric',
      Date.parse('2026-10-23T09:00:00Z') / 1000,
    );

    expect(result.length).toBe(0);
  });
});