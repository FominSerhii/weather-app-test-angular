
import { isPlatformBrowser } from '@angular/common';
import {
    Injectable,
    PLATFORM_ID,
    inject,
    signal,
} from '@angular/core';

const nowSeconds = () => Math.floor(Date.now() / 1000);

const msToNextMinute = () =>
    60_000 - (Date.now() % 60_000) + 50;

@Injectable({ providedIn: 'root' })
export class ClockService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    readonly now = signal(nowSeconds());

    private timeoutId?: ReturnType<typeof setTimeout>;

    private readonly onVisibilityChange = () => {
        if (!document.hidden) {
            this.now.set(nowSeconds());
            this.scheduleNextTick();
        }
    };

    constructor() {
        if (!this.isBrowser) {
            return;
        }

        this.scheduleNextTick();

        // Resync when the user returns to the tab.
        document.addEventListener(
            'visibilitychange',
            this.onVisibilityChange,
        );
    }

    private scheduleNextTick(): void {
        if (!this.isBrowser) {
            return;
        }

        this.timeoutId = setTimeout(() => {
            this.now.set(nowSeconds());
            this.scheduleNextTick();
        }, msToNextMinute());
    }
}
