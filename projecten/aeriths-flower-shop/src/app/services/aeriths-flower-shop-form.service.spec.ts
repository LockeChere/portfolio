import { TestBed } from '@angular/core/testing';

import { AerithsFlowerShopFormService } from './aeriths-flower-shop-form.service';

describe('AerithsFlowerShopFormService', () => {
  let service: AerithsFlowerShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AerithsFlowerShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
