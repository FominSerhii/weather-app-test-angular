import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonApp } from '@ionic/angular';
import { WeatherComponent } from './components/weather/weather.component';

@Component({
  selector: 'app-root',
  imports: [
    IonApp, 
    WeatherComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-app>
      <app-weather />
    </ion-app>
  `,
})
export class AppComponent {}