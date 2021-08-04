import { TestBed } from '@angular/core/testing';

import { RedhgfacturacionService } from './redhgfacturacion.service';

describe('RedhgfacturacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedhgfacturacionService = TestBed.get(RedhgfacturacionService);
    expect(service).toBeTruthy();
  });
});
