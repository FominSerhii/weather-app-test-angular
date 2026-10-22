import { 
  ChangeDetectionStrategy, 
  Component, 
  input, 
  output 
} from '@angular/core';

import { Units } from '../../types/units';

@Component({
  selector: 'app-unit-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './unit-toggle.component.html',
  styleUrl: './unit-toggle.component.css'
})

export class UnitToggleComponent {
  readonly units = input.required<Units>();
  readonly changed = output<Units>();

  protected readonly options: {
    value: Units;
    label: string;
    aria: string;
  }[] = [
      {
        value: 'metric',
        label: '°C',
        aria: 'Celsius',
      },
      {
        value: 'imperial',
        label: '°F',
        aria: 'Fahrenheit',
      },
    ];
}
