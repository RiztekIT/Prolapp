import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasomercanciaComponent } from './traspasomercancia.component';

describe('TraspasomercanciaComponent', () => {
  let component: TraspasomercanciaComponent;
  let fixture: ComponentFixture<TraspasomercanciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraspasomercanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraspasomercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
