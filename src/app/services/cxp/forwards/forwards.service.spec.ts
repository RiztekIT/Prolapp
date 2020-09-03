import { TestBed } from '@angular/core/testing';

import { ForwardsService } from './forwards.service';

describe('ForwardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForwardsService = TestBed.get(ForwardsService);
    expect(service).toBeTruthy();
  });
});
