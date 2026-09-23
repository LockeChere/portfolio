import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationControlComponent } from './admin-reservation-control.component';

describe('AdminReservationControlComponent', () => {
  let component: AdminReservationControlComponent;
  let fixture: ComponentFixture<AdminReservationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReservationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
