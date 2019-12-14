import { Component, OnInit, Inject } from '@angular/core';


declare function lecheData();
declare function historialLeche();

@Component({
  selector: 'app-leche-historial',
  templateUrl: './leche-historial.component.html',
  styles: []
})
export class LecheHistorialComponent implements OnInit {

  precioleche:string;

  constructor(  ) { }

  ngOnInit() {

  }


}
