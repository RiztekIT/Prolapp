import { Component, OnInit } from '@angular/core';

declare function printTrafico();
declare function footablePedidosTrafico();

@Component({
  selector: 'app-pedidoscxc',
  templateUrl: './pedidoscxc.component.html',
  styles: []
})
export class PedidoscxcComponent implements OnInit {

  ReporteCompras: any = [
    {
      id: '1',
      cliente: 'Riztek',
      cantidad: '3',
      producto: 'Premium',
      fecha: '2019/11/15',
      estatus: 'Resuelta',
      precio: '$ 36500',
      factura: ''
    }, {
      id: '2',
      cliente: 'Lex Impulse',
      cantidad: '25',
      producto: 'Dairy Quenn',
      fecha: '2019/11/20',
      estatus: 'Resuelta',
      precio: '$ 48751',
      factura: ''
    }
  ];

 

  constructor() { }

  ngOnInit() {
    printTrafico();
    footablePedidosTrafico();
  }

}
