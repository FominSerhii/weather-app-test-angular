import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherIllustrationComponent } from './weather-illustration.component';

describe('WeatherIllustrationComponent', () => {
  let fixture: ComponentFixture<WeatherIllustrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherIllustrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherIllustrationComponent);
  });

  it('renders the clear-day illustration with an accessible label', () => {
    fixture.componentRef.setInput('theme', 'clear-day');
    fixture.detectChanges();

    const illustration: HTMLElement =
      fixture.nativeElement.querySelector('[role="img"]');

    expect(illustration.classList).toContain('weather-art--clear-day');
    expect(illustration.getAttribute('aria-label')).toBe('clear day');
    expect(illustration.querySelector('.sun')).toBeTruthy();
  });

  it('renders the clear-night illustration', () => {
    fixture.componentRef.setInput('theme', 'clear-night');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.moon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.stars')).toBeTruthy();
  });

  it('renders clouds for cloudy weather', () => {
    fixture.componentRef.setInput('theme', 'clouds');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.cloud').length).toBe(2);
  });

  it('renders rain for rainy and stormy weather', () => {
    for (const theme of ['rain', 'thunderstorm']) {
      fixture.componentRef.setInput('theme', theme);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.rain')).toBeTruthy();
    }
  });

  it('renders snow for snowy weather', () => {
    fixture.componentRef.setInput('theme', 'snow');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.snow')).toBeTruthy();
  });

  it('renders mist for misty weather', () => {
    fixture.componentRef.setInput('theme', 'mist');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.mist')).toBeTruthy();
  });
});