import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionclienteComponent } from './facturacioncliente.component';

describe('FacturacionclienteComponent', () => {
  let component: FacturacionclienteComponent;
  let fixture: ComponentFixture<FacturacionclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
