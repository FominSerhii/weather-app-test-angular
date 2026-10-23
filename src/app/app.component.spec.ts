import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WeatherStore } from './state/weather.store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const store = jasmine.createSpyObj<WeatherStore>(
      'WeatherStore',
      ['fetchWeather', 'fetchByLocation', 'setUnits', 'removeCity'],
      {
        cities: signal([]),
        loading: signal(false),
        failed: signal([]),
        error: signal(null),
        pendingCount: signal(0),
        units: signal('metric'),
        isEmpty: signal(true),
      },
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: WeatherStore, useValue: store }],
    }).compileComponents();
  });

  it('creates the application root', () => {
    const fixture = TestBed.createComponent(AppComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });
});