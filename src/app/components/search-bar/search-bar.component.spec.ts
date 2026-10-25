import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;
  let component: SearchBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits the entered query on Enter and clears the input', () => {
    let emittedQuery: string | undefined;
    component.searched.subscribe((query) => (emittedQuery = query));

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('#city-search');
    input.value = 'Vienna, Prague';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      }),
    );
    fixture.detectChanges();

    expect(emittedQuery).toBe('Vienna, Prague');
    expect(input.value).toBe('');
  });

  it('does not emit a blank query', () => {
    let emitted = false;
    component.searched.subscribe(() => (emitted = true));

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('#city-search');
    input.value = '   ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        bubbles: true,
      }),
    );

    expect(emitted).toBeFalse();
  });
});