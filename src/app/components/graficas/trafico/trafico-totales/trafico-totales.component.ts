import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import { OrdenCargaTraficoService } from '../../../../services/trafico/orden-carga-trafico.service';
@Component({
  selector: 'app-trafico-totales',
  templateUrl: './trafico-totales.component.html',
  styleUrls: ['./trafico-totales.component.css']
})
export class TraficoTotalesComponent implements OnInit {

  constructor(public ocService: OrdenCargaService, public pedidoService: VentasPedidoService, public traficoService: OrdenCargaTraficoService) {


  }
  ngOnInit() {
    this.informacion = 'Kg'
    this.checked = 'True'
    this.verReporte();
  }

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  arrcon: Array<any> = [];

  total: number;
  kilogramos: number;

  informacion;
  checked;
  AllOrdenCarga: boolean = true;
  listaOrdenCarga;


  /* GRAFICAS */
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Orden Carga' },

  ];


  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.8)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return value.toLocaleString("en-US", {});
          }
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };


  /* GRAFICAS */
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  iniciarTotales() {
    this.total = 0;
    this.kilogramos = 0;
  }

  // cambio(event){
  //   this.informacion = event.value;
  //   // console.log(this.moneda);
  //   this.verReporte()
  // }


  verReporte() {
    this.barChartData[0].data = [];
    this.reporte();
  }


  //^ Llenar lista de las ordenes de carga
  reporte() {
    this.ocService.getOrdenCargaList().subscribe(data => {
      console.log(data);
      this.barChartLabels = [];
      this.listaOrdenCarga = data;
      for (let i = 0; i < 5; i++) {
        if (this.AllOrdenCarga == true) {
          this.barChartLabels.push('Folio Orden Carga: ' + data[i].Folio);
        }
        // else if(this.AllOrdenCarga == false) {
        //   this.barChartLabels.push('Folio Orden Carga: ' + data[i].Folio);  
        // }

      }
      //  this.obtenerReporte(data.length, data);
      this.datosOrdenCarga(data, data.length);
    })
  }

  // obtenerReporte(numero: number, data: any) {
  //   // this.arrcon = []; 
  //   for (let i = 0; i < numero; i++) {
  //     // this.arrcon[i] = data[i];
  //     // this.arrcon[i].Docs = [];      
  //     this.datosOrdenCarga(data, i);
  //   }
  // }




  //^ Al seleccionar una orden carga
  reporteOrdenCarga(event) {
    console.log(event);
    if (event.isUserInput) {
      // this.listaOrdenCarga= [];
      // this.listaOrdenCarga.push(event.source.value)
      let OrdenSeleccionada = [];
      OrdenSeleccionada.push(event.source.value)
      this.barChartLabels = [];
      this.barChartLabels.push('Folio Orden de Carga: ' + OrdenSeleccionada[0].Folio)
      this.barChartData[0].data = [];
      console.log(OrdenSeleccionada);
      this.datosOrdenCarga(OrdenSeleccionada, 1);
    }
  }



  filtrarOrdenesCarga(event) {
    console.log(event.checked);
    this.barChartData[0].data = [];
    if (this.AllOrdenCarga == true) {
      this.AllOrdenCarga = false;
    } else {
      this.AllOrdenCarga = true;
      this.verReporte();
    }
  }


  datosOrdenCarga(data, maximo) {
    this.barChartData[0].data = [];
    this.iniciarTotales();
    for (let i = 0; i < maximo; i++) {
      this.traficoService.getTraficoOC(data[i].IdOrdenCarga).subscribe(dataReporte => {
        console.log(dataReporte);
        if (dataReporte.length > 0) {
          console.log('si trae datos');
          let total = 0;
          for (let l = 0; l < dataReporte.length; l++) {
            total = total + +dataReporte[l].Total;
          }
          this.barChartData[0].data.push(total);
          this.barChartData[0].label = 'Fletera Total'

        } else {
          this.barChartData[0].data.push(0);
          this.barChartData[0].label = 'Fletera Total'
        }
      })
    }
  }

}
