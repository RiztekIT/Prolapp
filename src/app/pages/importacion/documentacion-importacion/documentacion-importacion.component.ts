import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare function steps();
declare function upload();

@Component({
  selector: 'app-documentacion-importacion',
  templateUrl: './documentacion-importacion.component.html',
  styles: []
})
export class DocumentacionImportacionComponent implements OnInit {

  incidenciasCliente: any = [
    {
      id: '1',
      cliente: 'Riztek',
      fecha: '2019/11/15',
      tipo: 'Importacion',
      status: 'Pendiente'
    },{
      id: '2',
      cliente: 'Lex Impulse',
      fecha: '2019/11/20',
      tipo: 'Importacion',
      status: 'Guardado'
    }
  ];

  constructor(public router: Router) { }

  ngOnInit() {
    steps();
    upload();
  }

}
