import { TestBed } from '@angular/core/testing';

import { AdminGuardServiceService } from './admin-guard-service.service';

describe('AdminGuardServiceService', () => {
  let service: AdminGuardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGuardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
