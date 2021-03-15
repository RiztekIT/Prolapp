import { TestBed } from '@angular/core/testing';

import { PosserviceService } from './posservice.service';

describe('PosserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PosserviceService = TestBed.get(PosserviceService);
    expect(service).toBeTruthy();
  });
});
