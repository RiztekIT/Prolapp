import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingclienteComponent } from './trackingcliente.component';

describe('TrackingclienteComponent', () => {
  let component: TrackingclienteComponent;
  let fixture: ComponentFixture<TrackingclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
