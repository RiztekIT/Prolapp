import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosaddeditclientesComponent } from './posaddeditclientes.component';

describe('PosaddeditclientesComponent', () => {
  let component: PosaddeditclientesComponent;
  let fixture: ComponentFixture<PosaddeditclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosaddeditclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosaddeditclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
