import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoscatclientesComponent } from './poscatclientes.component';

describe('PoscatclientesComponent', () => {
  let component: PoscatclientesComponent;
  let fixture: ComponentFixture<PoscatclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoscatclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoscatclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
