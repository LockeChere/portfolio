import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockInfoComponent } from './dock-info.component';

describe('DockInfoComponent', () => {
  let component: DockInfoComponent;
  let fixture: ComponentFixture<DockInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
