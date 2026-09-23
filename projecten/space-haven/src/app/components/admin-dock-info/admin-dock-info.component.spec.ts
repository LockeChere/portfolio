import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDockInfoComponent } from './admin-dock-info.component';

describe('AdminDockInfoComponent', () => {
  let component: AdminDockInfoComponent;
  let fixture: ComponentFixture<AdminDockInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDockInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
