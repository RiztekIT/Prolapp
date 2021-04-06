import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: []
})
export class Graficas1Component implements OnInit {

  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [
    350, 450, 100
  ];
  public doughnutChartType: string = 'doughnut';

  graficos: any = {
    'grafico1': {
      'labels': ['Leche Dairy', 'Leche National', 'Leche 3'],
      'data':  [2400, 3000, 4600],
      'type': 'doughnut',
      'leyenda': 'Ventas 2019'
    },
    'grafico2': {
      'labels': ['Egresos', 'Ingresos'],
      'data':  [45000, 60000],
      'type': 'doughnut',
      'leyenda': 'Tesoreria'
    },
    'grafico3': {
      'labels': ['Materia Prima', 'Insumos'],
      'data':  [95000, 59000],
      'type': 'doughnut',
      'leyenda': 'Compras 2019'
    },
    'grafico4': {
      'labels': ['CXP', 'CXC'],
      'data':  [85000, 150000],
      'type': 'doughnut',
      'leyenda': 'Planeacion'
    },
  };
 


  constructor() { }

  ngOnInit() {
  }

}
