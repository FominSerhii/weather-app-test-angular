# Weather App

An Angular weather dashboard for searching multiple cities, viewing local weather details and a 5-day forecast, using browser geolocation, and switching temperature units and themes.

## Features

- Search several cities at once (comma separated); unknown cities are reported individually
- "Use my location" via the Geolocation API, with clear errors for denied, unavailable and timeout
- City chips: switch between searched cities (chips wrap to multiple rows, keyboard accessible)
- 5-day forecast per city (OpenWeatherMap 5 day / 3 hour forecast aggregated per day), lazy-loaded and cached for 10 minutes
- °C / °F toggle, converted client-side (no refetch)
- Condition-based themes (clear day/night, clouds, rain, snow, thunderstorm, mist)
- Live local time per city; data auto-refreshes after 10 min when the tab becomes visible
- Retry button on service errors
- Dark mode: follows `prefers-color-scheme`, manual toggle, preference saved
- Saved cities and units restored on reload
- Loading skeletons, ARIA live regions, keyboard-friendly focus styles

## Requirements

- Node.js 20+ and npm
- An [OpenWeather](https://openweathermap.org/api) API key (the free plan covers current weather and the 5-day forecast)

## Setup

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```
Open `http://localhost:4200/`. The app reloads automatically when you change source files.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Karma) |
| `npm run build` | Production build into `dist/` |

## Architecture

- `state/weather.store.ts`: single signal-based store (state, derived view models, selection, actions, persistence)
- `services/`: `WeatherApiService` (current weather and forecast), `geolocation`, `ThemeService`, `ClockService`
- `utils/`: pure helpers (city parsing, weather and forecast mapping, storage)
- `components/`: presentational standalone components; the container is `WeatherComponent`

## CI

GitHub Actions runs lint, tests and build on every push to `main` and on pull requests.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
