import { Component, OnInit } from '@angular/core';

declare function chart();

declare function graficas_line_Compras();

@Component({
  selector: 'app-graficas-compras',
  templateUrl: './graficas-compras.component.html',
  styles: []
})
export class GraficasComprasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    chart();
    graficas_line_Compras();
  }

}
