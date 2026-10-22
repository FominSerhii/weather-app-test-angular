import { 
  ChangeDetectionStrategy, 
  Component, 
  output, 
  signal 
} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})

export class SearchBarComponent {
  readonly searched = output<string>();
  protected readonly query = signal('');

  protected onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
  }

  protected submit(e: Event): void {
    e.preventDefault();
    if (!this.query().trim()) return;
    this.searched.emit(this.query());
    this.query.set('');
  }
}
