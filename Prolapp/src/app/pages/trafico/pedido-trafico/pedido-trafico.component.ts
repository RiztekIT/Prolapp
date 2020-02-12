import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare function footablePedidosTrafico();


@Component({
  selector: 'app-pedido-trafico',
  templateUrl: './pedido-trafico.component.html',
  styles: []
})
export class PedidoTraficoComponent implements OnInit {

  ReporteCompras: any = [
    {
      id: '1',
      cliente: 'Riztek',
      cantidad: '3',
      producto: 'Premium',
      fecha: '2019/11/15',
      estatus: 'Resuelta',
      precio: '$ 36500',
      fletera: ''
    }, {
      id: '2',
      cliente: 'Lex Impulse',
      cantidad: '25',
      producto: 'Dairy Quenn',
      fecha: '2019/11/20',
      estatus: 'Resuelta',
      precio: '$ 48751',
      fletera: ''
    }
  ];

  fletera: any = [
    'Selecciona Fletera',
    'Castores',
    'Gocar',
    'Pak2go'
  ];

  constructor(public router: Router) { }

  ngOnInit() {
    footablePedidosTrafico();
  }

}
