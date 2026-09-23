import { TestBed } from '@angular/core/testing';

import { SparkleMouseService } from './sparkle-mouse.service';

describe('SparkleMouseService', () => {
  let service: SparkleMouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparkleMouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
