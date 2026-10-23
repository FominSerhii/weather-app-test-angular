import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherStore } from '../../state/weather.store';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { WeatherComponent } from './weather.component';

describe('WeatherComponent', () => {
  let fixture: ComponentFixture<WeatherComponent>;
  let store: jasmine.SpyObj<WeatherStore>;

  beforeEach(async () => {
    store = jasmine.createSpyObj<WeatherStore>(
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
      imports: [WeatherComponent],
      providers: [{ provide: WeatherStore, useValue: store }],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    fixture.detectChanges();
  });

  it('forwards search output to the store', () => {
    const searchBar = fixture.debugElement.query(
      By.directive(SearchBarComponent),
    ).componentInstance as SearchBarComponent;

    searchBar.searched.emit('Vienna, Prague');

    expect(store.fetchWeather).toHaveBeenCalledWith('Vienna, Prague');
  });

  it('shows the loading announcement during a request', () => {
    store.loading.set(true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('[aria-live="polite"]')
        .getAttribute('aria-busy'),
    ).toBe('true');
    expect(
      fixture.nativeElement.querySelector('p.visually-hidden')?.textContent,
    ).toContain('Loading weather');
  });
});