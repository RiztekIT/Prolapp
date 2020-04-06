import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionpedidoComponent } from './cotizacionpedido.component';

describe('CotizacionpedidoComponent', () => {
  let component: CotizacionpedidoComponent;
  let fixture: ComponentFixture<CotizacionpedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotizacionpedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
