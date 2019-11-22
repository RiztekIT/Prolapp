import { Component, OnInit } from '@angular/core';

declare function graficaFlujo();

@Component({
  selector: 'app-dashboard-importacion',
  templateUrl: './dashboard-importacion.component.html',
  styles: []
})
export class DashboardImportacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    graficaFlujo();

  }

}
