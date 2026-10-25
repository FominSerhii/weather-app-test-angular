import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { CityWeatherView } from '../../types/city-weather';

@Component({
  selector: 'app-city-chips',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './city-chips.component.html',
  styleUrl: './city-chips.component.css'
})
export class CityChipsComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly cities = input.required<CityWeatherView[]>();
  readonly selectedId = input.required<number | null>();
  readonly selected = output<number>();

  protected onKeydown(event: KeyboardEvent): void {
    const list = this.cities();
    const current = list.findIndex((c) => c.id === this.selectedId());
    let next = current;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (current + 1) % list.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (current - 1 + list.length) % list.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = list.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.selected.emit(list[next].id);
    this.host.nativeElement
      .querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]
      ?.focus();
  }
}
