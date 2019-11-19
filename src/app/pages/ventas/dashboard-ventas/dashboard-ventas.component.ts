import { Component, OnInit } from '@angular/core';

declare function GraficaVentasChart();

@Component({
  selector: 'app-dashboard-ventas',
  templateUrl: './dashboard-ventas.component.html',
  styles: []
})
export class DashboardVentasComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    GraficaVentasChart();

  }

}
