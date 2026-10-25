import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityChipsComponent } from './city-chips.component';

describe('CityChipsComponent', () => {
  let component: CityChipsComponent;
  let fixture: ComponentFixture<CityChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityChipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
