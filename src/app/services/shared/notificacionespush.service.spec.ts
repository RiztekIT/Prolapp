import { TestBed } from '@angular/core/testing';

import { NotificacionespushService } from './notificacionespush.service';

describe('NotificacionespushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificacionespushService = TestBed.get(NotificacionespushService);
    expect(service).toBeTruthy();
  });
});
