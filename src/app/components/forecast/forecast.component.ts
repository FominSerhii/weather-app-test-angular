import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

import { ForecastView } from '../../types/forecast';
import { FORECAST_DAYS } from '../../utils/forecast-mapper';
import { WeatherIllustrationComponent } from '../weather-illustration/weather-illustration.component';
@Component({
  selector: 'app-forecast',
  imports: [DecimalPipe, WeatherIllustrationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css'
})
export class ForecastComponent {
  readonly forecast = input.required<ForecastView>();
  readonly retry = output<void>();

  protected readonly dayCount = FORECAST_DAYS;
  protected readonly placeholders = Array.from({ length: FORECAST_DAYS }, (_, i) => i);
}
