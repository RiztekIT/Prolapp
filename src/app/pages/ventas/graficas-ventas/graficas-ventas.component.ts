import { Component, OnInit } from '@angular/core';

declare function chart();

declare function graficas_line();

@Component({
  selector: 'app-graficas-ventas',
  templateUrl: './graficas-ventas.component.html',
  styles: []
})
export class GraficasVentasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    chart();
    graficas_line();
  }

}
