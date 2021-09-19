import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteContactoComponent } from './cliente-contacto.component';

describe('ClienteContactoComponent', () => {
  let component: ClienteContactoComponent;
  let fixture: ComponentFixture<ClienteContactoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteContactoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
