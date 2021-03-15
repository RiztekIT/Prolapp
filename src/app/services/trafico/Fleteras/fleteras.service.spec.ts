import { TestBed } from '@angular/core/testing';

import { FleterasService } from './fleteras.service';

describe('FleterasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleterasService = TestBed.get(FleterasService);
    expect(service).toBeTruthy();
  });
});
