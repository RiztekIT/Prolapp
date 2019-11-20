import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-compras',
  templateUrl: './reporte-compras.component.html',
  styles: []
})
export class ReporteComprasComponent implements OnInit {

  ReporteCompras: any = [
    {
      id: '1',
      cliente: 'Riztek',
      cantidad: '3',
      producto: 'Premium',
      fecha: '2019/11/15',
      estatus: 'Resuelta',
      precio: '$USD 365'
    }, {
      id: '2',
      cliente: 'Lex Impulse',
      cantidad: '25',
      producto: 'Dairy Quenn',
      fecha: '2019/11/20',
      estatus: 'Resuelta',
      precio: '$USD 120 '
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
