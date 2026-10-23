import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
} from '@ionic/angular';

import { WeatherStore } from '../../state/weather.store';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UnitToggleComponent } from '../unit-toggle/unit-toggle.component';
import { LocationButtonComponent } from '../location-button/location-button.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { CityWeatherComponent } from '../city-weather/city-weather.component';
import { CityWeatherSkeletonComponent } from '../city-weather-skeleton/city-weather-skeleton.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

const MAX_SKELETONS = 5;

@Component({
  selector: 'app-weather',
  host: { class: 'ion-page' },
  imports: [
    FaIconComponent,
    SearchBarComponent,
    UnitToggleComponent,
    LocationButtonComponent,
    EmptyStateComponent,
    CityWeatherComponent,
    CityWeatherSkeletonComponent,
    ThemeToggleComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  protected readonly store = inject(WeatherStore);
  protected readonly faFrown = faFrown;

  protected readonly skeletons = computed(() => {
    const skeletonCount = Math.min(
      this.store.pendingCount(),
      MAX_SKELETONS,
    );

    return Array.from(
      { length: skeletonCount },
      (_, index) => index,
    );
  });
}
