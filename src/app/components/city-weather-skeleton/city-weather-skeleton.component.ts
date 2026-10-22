import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-city-weather-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  templateUrl: './city-weather-skeleton.component.html',
  styleUrl: './city-weather-skeleton.component.css'
})

export class CityWeatherSkeletonComponent {}
