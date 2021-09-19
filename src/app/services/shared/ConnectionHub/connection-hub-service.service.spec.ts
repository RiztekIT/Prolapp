import { TestBed } from '@angular/core/testing';

import { ConnectionHubServiceService } from './connection-hub-service.service';

describe('ConnectionHubServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnectionHubServiceService = TestBed.get(ConnectionHubServiceService);
    expect(service).toBeTruthy();
  });
});
