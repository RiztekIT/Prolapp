import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MercanciaComponent } from './mercancia.component';

describe('MercanciaComponent', () => {
  let component: MercanciaComponent;
  let fixture: ComponentFixture<MercanciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MercanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
