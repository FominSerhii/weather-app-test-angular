import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { CityWeatherView } from '../../types/city-weather';

@Component({
  selector: 'app-city-weather',
  standalone: true,
  imports: [DecimalPipe, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './city-weather.component.html',
  styleUrl: './city-weather.component.css'
})
export class CityWeatherComponent {
  readonly city = input.required<CityWeatherView>();
  readonly remove = output<void>();
}
