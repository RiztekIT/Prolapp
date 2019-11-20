import { Component, OnInit } from '@angular/core';

declare function printTrafico();
@Component({
  selector: 'app-reporte-trafico',
  templateUrl: './reporte-trafico.component.html',
  styles: []
})
export class ReporteTraficoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    printTrafico();
  }

}
