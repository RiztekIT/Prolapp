import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styles: []
})
export class ReportesComponent implements OnInit {

  incidenciasCliente: any = [
    {
      id: '1',
      cliente: 'Riztek',
      fecha: '2019/11/15',
      tipo: 'Queja',
      status: 'Resuelta'
    },{
      id: '2',
      cliente: 'Lex Impulse',
      fecha: '2019/11/20',
      tipo: 'Merma',
      status: 'Resuelta'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
