import { Component, OnInit, Inject } from '@angular/core';
import * as html2pdf from 'html2pdf.js';


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
    lecheData();
    historialLeche();
    this.precioleche = window["preciolecheF"];
  }


}
