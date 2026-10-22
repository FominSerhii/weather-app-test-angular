
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { loadTheme, saveTheme } from '../utils/storage';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly document = inject(DOCUMENT);

    private readonly isBrowser = isPlatformBrowser(this.platformId);

    private readonly colorSchemeMediaQuery = this.isBrowser
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    readonly mode = signal<ThemeMode>(
        this.getInitialTheme(),
    );

    constructor() {
        this.applyTheme(this.mode());

        // Follow the operating system theme until the user selects one explicitly.
        this.colorSchemeMediaQuery?.addEventListener('change', (event) => {
            if (!loadTheme()) {
                this.setTheme(event.matches ? 'dark' : 'light', false);
            }
        });
    }

    toggle(): void {
        const nextTheme = this.mode() === 'dark' ? 'light' : 'dark';

        this.setTheme(nextTheme, true);
    }

    private getInitialTheme(): ThemeMode {
        if (!this.isBrowser) {
            return 'light';
        }

        return loadTheme() ??
            (this.colorSchemeMediaQuery?.matches ? 'dark' : 'light');
    }

    private setTheme(theme: ThemeMode, persist: boolean): void {
        this.mode.set(theme);

        if (persist && this.isBrowser) {
            saveTheme(theme);
        }

        this.applyTheme(theme);
    }

    private applyTheme(theme: ThemeMode): void {
        if (!this.isBrowser) {
            return;
        }

        this.document.documentElement.dataset['theme'] = theme;
    }
}
