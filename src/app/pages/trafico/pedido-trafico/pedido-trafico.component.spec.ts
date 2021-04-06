import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoTraficoComponent } from './pedido-trafico.component';

describe('PedidoTraficoComponent', () => {
  let component: PedidoTraficoComponent;
  let fixture: ComponentFixture<PedidoTraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoTraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
