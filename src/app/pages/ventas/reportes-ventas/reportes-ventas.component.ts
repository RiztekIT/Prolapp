import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes-ventas',
  templateUrl: './reportes-ventas.component.html',
  styles: []
})
export class ReportesVentasComponent implements OnInit {

  ReporteCompras: any = [
    {
      id: '1',
      cliente: 'Riztek',
      cantidad: '3',
      producto: 'Premium',
      fecha: '2019/11/15',
      estatus: 'Resuelta'
    }, {
      id: '2',
      cliente: 'Lex Impulse',
      cantidad: '25',
      producto: 'Dairy Quenn',
      fecha: '2019/11/20',
      estatus: 'Resuelta'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
