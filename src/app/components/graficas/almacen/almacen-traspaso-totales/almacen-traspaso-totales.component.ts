import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import { ClientesService } from '../../../../services/catalogos/clientes.service';
import { VentasCotizacionService } from '../../../../services/ventas/ventas-cotizacion.service';
import { TraspasoMercanciaService } from '../../../../services/importacion/traspaso-mercancia.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-almacen-traspaso-totales',
  templateUrl: './almacen-traspaso-totales.component.html',
  styleUrls: ['./almacen-traspaso-totales.component.css']
})
export class AlmacenTraspasoTotalesComponent implements OnInit {


  constructor(public traspasoService: TraspasoMercanciaService, public cotizacionService: VentasCotizacionService,) {}
  
  ngOnInit() {
    this.informacion = 'Kg'
    this.checked = 'True'
    this.verReporte();
  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    // this.subs2.unsubscribe();
  }

  arrcon: Array<any> = [];

  sacos: number;
  kilogramos: number;

  informacion;
  checked;

  /* GRAFICAS */
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Traspaso Mercancia' },

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
    this.sacos = 0;
    this.kilogramos = 0;
  }

  cambio(event) {
    this.informacion = event.value;
    this.verReporte()
  }


  verReporte() {
    this.barChartData[0].data = [];
    this.barChartLabels = [];
    this.arrcon[0] = [];
    this.datosTraspaso();
  }
subs1: Subscription
  datosTraspaso() {
    this.subs1 = this.traspasoService.getTraspasoMercancia().subscribe(dataReporte => {
      console.log(dataReporte);
      this.iniciarTotales();
      if (dataReporte.length > 0) {
        console.log(dataReporte);
        for (let l = 0; l < dataReporte.length; l++) {
          this.sacos = this.sacos + +dataReporte[l].SacosTotales;
          this.kilogramos = this.kilogramos + +dataReporte[l].KilogramosTotales;
        }
        this.barChartLabels.push('Traspaso');
        if (this.informacion == 'Sacos') {
          this.barChartData[0].data.push(this.sacos);
          this.barChartData[0].label = 'Traspaso Sacos'
        } else if (this.informacion == 'Kg') {
          this.barChartData[0].data.push(this.kilogramos)
          this.barChartData[0].label = 'Traspaso Kilogramos'
        }
      }
    })
  }

}
