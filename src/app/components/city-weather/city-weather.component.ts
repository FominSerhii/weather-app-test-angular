import { 
  ChangeDetectionStrategy, 
  Component, 
  input, 
  output 
} from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { CityWeatherView } from '../../types/city-weather';
import { WeatherIllustrationComponent } from '../weather-illustration/weather-illustration.component';

@Component({
  selector: 'app-city-weather',
  imports: [DecimalPipe, UpperCasePipe, WeatherIllustrationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './city-weather.component.html',
  styleUrl: './city-weather.component.css'
})
export class CityWeatherComponent {
  readonly city = input.required<CityWeatherView>();
  readonly remove = output<void>();
}
