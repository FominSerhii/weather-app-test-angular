import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityWeatherView } from '../../types/city-weather';
import { CityWeatherComponent } from './city-weather.component';

describe('CityWeatherComponent', () => {
  let fixture: ComponentFixture<CityWeatherComponent>;
  let component: CityWeatherComponent;

  const city: CityWeatherView = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityWeatherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CityWeatherComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('city', city);
    fixture.detectChanges();
  });

  it('renders the city weather details', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h2')?.textContent).toContain('Vienna');
    expect(element.querySelector('.des-wind')?.textContent).toContain(
      'CLEAR SKY',
    );
    expect(element.querySelector('.deg')?.textContent).toContain('20.0');
    expect(element.querySelector('.details')?.textContent).toContain('50%');
  });

  it('emits remove when the remove button is clicked', () => {
    const remove = jasmine.createSpy('remove');
    component.remove.subscribe(remove);

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.remove-btn');
    button.click();

    expect(remove).toHaveBeenCalled();
  });
});