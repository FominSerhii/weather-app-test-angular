import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityWeatherView } from '../../types/city-weather';
import { CityChipsComponent } from './city-chips.component';

describe('CityChipsComponent', () => {
  let component: CityChipsComponent;
  let fixture: ComponentFixture<CityChipsComponent>;

  const cities: CityWeatherView[] = [
    {
      id: 1,
      name: 'Vienna',
      country: 'AT',
      description: 'clear sky',
      icon: '01d',
      windSpeed: 5,
      temp: 20,
      date: 'Fri, 23 Oct',
      time: '13:45',
      tempUnit: '°C',
      windUnit: 'm/s',
      feelsLike: 19,
      humidity: 50,
      sunrise: '06:30',
      sunset: '17:45',
      theme: 'clear-day',
    },
    {
      id: 2,
      name: 'Prague',
      country: 'CZ',
      description: 'cloudy',
      icon: '03d',
      windSpeed: 3,
      temp: 15,
      date: 'Fri, 23 Oct',
      time: '13:45',
      tempUnit: '°C',
      windUnit: 'm/s',
      feelsLike: 14,
      humidity: 60,
      sunrise: '06:40',
      sunset: '17:35',
      theme: 'clouds',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CityChipsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cities', cities);
    fixture.componentRef.setInput('selectedId', 1);
    fixture.detectChanges();
  });

  it('renders city tabs and marks the selected city', () => {
    const tabs: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[role="tab"]'),
    );

    expect(tabs.length).toBe(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('tabindex')).toBe('0');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].textContent).toContain('Prague');
  });

  it('emits the city id when a tab is clicked', () => {
    const selected = jasmine.createSpy('selected');
    component.selected.subscribe(selected);

    const tabs: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[role="tab"]'),
    );
    tabs[1].click();

    expect(selected).toHaveBeenCalledWith(2);
  });

  it('moves selection and focus with the arrow keys', () => {
    const selected = jasmine.createSpy('selected');
    component.selected.subscribe(selected);

    const tabs: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[role="tab"]'),
    );

    // key presses happen on the focused tab
    tabs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );

    expect(selected).toHaveBeenCalledWith(2);
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('supports Home and End navigation', () => {
    const selected = jasmine.createSpy('selected');
    component.selected.subscribe(selected);

    const tabs: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[role="tab"]'),
    );

    tabs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    expect(selected).toHaveBeenCalledWith(2);

    tabs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    expect(selected).toHaveBeenCalledWith(1);
  });
});