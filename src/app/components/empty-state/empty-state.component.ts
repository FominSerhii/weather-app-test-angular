import { ChangeDetectionStrategy, Component, output } from '@angular/core';

const EXAMPLE = 'Bratislava, Trnava, Vienna';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})

export class EmptyStateComponent {
  readonly tried = output<string>();
  protected readonly example = EXAMPLE;
}

