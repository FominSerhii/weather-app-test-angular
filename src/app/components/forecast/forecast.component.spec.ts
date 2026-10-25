import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastView } from '../../types/forecast';
import { ForecastComponent } from './forecast.component';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;

  const readyForecast: ForecastView = {
    status: 'ready',
    days: [
      {
        date: '2026-10-23',
        weekday: 'Fri',
        shortDate: '23 Oct',
        isToday: true,
        theme: 'clear-day',
        description: 'clear sky',
        max: 20,
        min: 12,
        rainChance: 25,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
  });

  it('renders forecast days and their weather details', () => {
    fixture.componentRef.setInput('forecast', readyForecast);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelectorAll('.forecast-day').length).toBe(1);

    expect(
      element.querySelector('.forecast-weekday')?.textContent,
    ).toContain('Today');

    expect(
      element.querySelector('.forecast-desc')?.textContent,
    ).toContain('clear sky');

    expect(
      element.querySelector('.forecast-rain')?.textContent,
    ).toContain('25%');
  });

  it('shows loading placeholders while the forecast is loading', () => {
    fixture.componentRef.setInput('forecast', {
      status: 'loading',
      days: [],
    });

    fixture.detectChanges();

    const forecastElement: HTMLElement =
      fixture.nativeElement.querySelector('.forecast');

    expect(forecastElement.getAttribute('aria-busy')).toBe('true');

    expect(
      fixture.nativeElement.querySelectorAll('.forecast-skeleton').length,
    ).toBe(5);
  });

  it('emits retry when the forecast has an error', () => {
    const retry = jasmine.createSpy('retry');
    component.retry.subscribe(retry);

    fixture.componentRef.setInput('forecast', {
      status: 'error',
      days: [],
    });

    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.forecast-error button');

    button.click();

    expect(retry).toHaveBeenCalled();
  });
});