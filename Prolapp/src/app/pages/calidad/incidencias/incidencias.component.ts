import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare function steps();
declare function upload();

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styles: []
})
export class IncidenciasComponent implements OnInit {

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

  constructor(public router: Router) { }

  ngOnInit() {
    steps()
    upload()
  }

  recargar(){
    // this.router.navigate(['/incidencias']);
    // this.ngOnInit();
    
    // location.reload();
    
  }

}
