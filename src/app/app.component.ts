import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WeatherComponent } from './components/weather/weather.component';

@Component({
  selector: 'app-root',
  imports: [WeatherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="App"><app-weather /></div>`,
})
export class AppComponent { }