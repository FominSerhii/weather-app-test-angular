import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitToggleComponent } from './unit-toggle.component';

describe('UnitToggleComponent', () => {
  let fixture: ComponentFixture<UnitToggleComponent>;
  let component: UnitToggleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitToggleComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('units', 'metric');
    fixture.detectChanges();
  });

  it('marks the selected unit as pressed', () => {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );

    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('emits the selected unit when clicked', () => {
    const changed = jasmine.createSpy('changed');
    component.changed.subscribe(changed);

    const imperialButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('[aria-label="Fahrenheit"]');
    imperialButton.click();

    expect(changed).toHaveBeenCalledWith('imperial');
  });
});