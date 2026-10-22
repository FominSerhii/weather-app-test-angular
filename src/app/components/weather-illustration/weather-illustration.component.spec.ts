import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherIllustrationComponent } from './weather-illustration.component';

describe('WeatherIllustrationComponent', () => {
  let component: WeatherIllustrationComponent;
  let fixture: ComponentFixture<WeatherIllustrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherIllustrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherIllustrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
