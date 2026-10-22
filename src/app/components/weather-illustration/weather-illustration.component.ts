import { Component, input } from '@angular/core';
import { WeatherTheme } from '../../types/weather-theme';

@Component({
  selector: 'app-weather-illustration',
  imports: [],
  templateUrl: './weather-illustration.component.html',
  styleUrl: './weather-illustration.component.css'
})
export class WeatherIllustrationComponent {
  readonly theme = input.required<WeatherTheme>();
}
