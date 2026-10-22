import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityWeatherSkeletonComponent } from './city-weather-skeleton.component';

describe('CityWeatherSkeletonComponent', () => {
  let component: CityWeatherSkeletonComponent;
  let fixture: ComponentFixture<CityWeatherSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityWeatherSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityWeatherSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
