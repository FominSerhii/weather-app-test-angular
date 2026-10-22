import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitToggleComponent } from './unit-toggle.component';

describe('UnitToggleComponent', () => {
  let component: UnitToggleComponent;
  let fixture: ComponentFixture<UnitToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
