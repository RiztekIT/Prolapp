import { TestBed } from '@angular/core/testing';

import { AddsproductosService } from './addsproductos.service';

describe('AddsproductosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddsproductosService = TestBed.get(AddsproductosService);
    expect(service).toBeTruthy();
  });
});
