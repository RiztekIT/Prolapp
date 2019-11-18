import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoVentasComponent } from './pedido-ventas.component';

describe('PedidoVentasComponent', () => {
  let component: PedidoVentasComponent;
  let fixture: ComponentFixture<PedidoVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
