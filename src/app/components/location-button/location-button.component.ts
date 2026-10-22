import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-location-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  templateUrl: './location-button.component.html',
  styleUrl: './location-button.component.css'
})

export class LocationButtonComponent {
  readonly disabled = input(false);
  readonly locate = output<void>();
}
