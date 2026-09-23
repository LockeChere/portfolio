import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftcardAdminComponent } from './giftcard-admin.component';

describe('GiftcardAdminComponent', () => {
  let component: GiftcardAdminComponent;
  let fixture: ComponentFixture<GiftcardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftcardAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftcardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
