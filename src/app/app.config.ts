import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { WeatherStore } from './state/weather.store';
import { ThemeService } from './services/theme.service';
import { provideIonicAngular } from '@ionic/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAppInitializer(() => {
      inject(ThemeService);
      inject(WeatherStore).restoreSession();
    }), provideIonicAngular({}), provideIonicAngular({}),
  ],
};