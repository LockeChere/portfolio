import { TestBed } from '@angular/core/testing';

import { FontSizeServiceService } from './font-size-service.service';

describe('FontSizeServiceService', () => {
  let service: FontSizeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontSizeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
