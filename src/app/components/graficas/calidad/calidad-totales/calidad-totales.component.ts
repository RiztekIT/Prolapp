import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { IncidenciasService } from '../../../../services/almacen/incidencias/incidencias.service';
import { OrdenCargaService } from '../../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenDescargaService } from '../../../../services/almacen/orden-descarga/orden-descarga.service';

@Component({
  selector: 'app-calidad-totales',
  templateUrl: './calidad-totales.component.html',
  styleUrls: ['./calidad-totales.component.css']
})
export class CalidadTotalesComponent implements OnInit {

  constructor(public incidenciasService: IncidenciasService, public ocService: OrdenCargaService, public odService: OrdenDescargaService) { }

  ngOnInit() {
    this.ordenIncidencia = 'OrdenCarga';

    this.ordenEvidencia = 'OrdenCarga';

    this.verIncidencia();
    this.verEvidencia();
  }

  //variables Incidencia
  arrconIncidencia: Array<any> = [];
  // totalIncidencia: number;
  ordenIncidencia;
  //variable Evidencia
  arrconEvidencia: Array<any> = [];
  // totalEvidencia: number;
  ordenEvidencia;



  /* GRAFICAS */
  public barChartLabelsIncidencia: Label[] = [];
  public barChartLabelsEvidencia: Label[] = [];
  public barChartTypeIncidencia: ChartType = 'bar';
  public barChartTypeEvidencia: ChartType = 'bar';
  public barChartLegendIncidencia = true;
  public barChartLegendEvidencia = true;

  public barChartDataIncidencia: ChartDataSets[] = [
    { data: [], label: 'Incidencias' },

  ];
  public barChartDataEvidencia: ChartDataSets[] = [
    { data: [], label: 'Evidenciaes' },

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

  public barChartOptionsIncidencia: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return value.toLocaleString("en-US", {});
          },
          beginAtZero: true

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
  public barChartOptionsEvidencia: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return value.toLocaleString("en-US", {});
          },
          beginAtZero: true
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

  verIncidencia() {
    this.barChartDataIncidencia[0].data = [];
    this.obtenerReporteIncidencia();
  }
  verEvidencia() {
    this.barChartDataEvidencia[0].data = [];
  }





  obtenerReporteIncidencia() {
    this.arrconIncidencia = [];

    let merma = {
      tipo: 'Merma'
    }
    let reparacion = {
      tipo: 'Reparacion'
    }

    let tipoIncidencias = new Array();
    tipoIncidencias.push(merma);
    tipoIncidencias.push(reparacion);

    this.barChartLabelsIncidencia = [];
    this.barChartDataIncidencia[0].data = [];

    for (let i = 0; i < tipoIncidencias.length; i++) {
      console.log(tipoIncidencias[i]);
      this.arrconIncidencia[i] = tipoIncidencias[i];
      this.barChartLabelsIncidencia.push(tipoIncidencias[i].tipo)

    }
    this.datosIncidencia(tipoIncidencias, tipoIncidencias.length);
  }

  obtenerReporteEvidencia(numero: number, data: any) {
    // this.arrconEvidencia = [];

    // let merma = {
    //   tipo: 'Merma'
    // }
    // let reparacion = {
    //   tipo: 'Reparacion'
    // }

    // let tipoEvidencias = new Array();
    // tipoEvidencias.push(merma);
    // tipoEvidencias.push(reparacion);

    // this.barChartLabelsEvidencia = [];
    // this.barChartDataEvidencia[0].data = [];

    // for (let i = 0; i < tipoEvidencias.length; i++) {
    //   console.log(tipoEvidencias[i]);
    //   this.arrconEvidencia[i] = tipoEvidencias[i];
    //   this.barChartLabelsEvidencia.push(tipoEvidencias[i].tipo)

    // }
    // this.datosEvidencia(tipoEvidencias, tipoEvidencias.length);
  }




  cambioIncidencia(event) {
    this.ordenIncidencia = event.value;
    this.verIncidencia()
  }
  cambioEvidencia(event) {
    this.ordenEvidencia = event.value;
    this.verEvidencia()
  }


  datosIncidencia(data, i) {
    console.log(data);
    this.incidenciasService.getIncidenciaProcedencia(this.ordenIncidencia).subscribe(dataReporte => {
      // this.iniciarTotalesIncidencia();

      let totalMermas = 0;
      let totalReparaciones = 0;

      console.log(dataReporte);
      if (dataReporte.length > 0) {
        // console.log(dataReporte);
        for (let l = 0; l < dataReporte.length; l++) {
          if (dataReporte[l].TipoIncidencia == 'Merma') {
            totalMermas++;
          } else if (dataReporte[l].TipoIncidencia == 'Reparacion') {
            totalReparaciones++;
          }
        }
        console.log(totalMermas);

        this.arrconIncidencia[0].TotalMerma = totalMermas;
        this.arrconIncidencia[1].TotalReparacion = totalReparaciones;


        if (this.ordenIncidencia == 'OrdenCarga') {
          console.log(this.arrconIncidencia);
          this.barChartDataIncidencia[0].data.push(this.arrconIncidencia[0].TotalMerma);
          this.barChartDataIncidencia[0].data.push(this.arrconIncidencia[1].TotalReparacion);
          this.barChartDataIncidencia[0].label = 'Total Incidencias Orden Carga';
        } else if (this.ordenIncidencia == 'OrdenDescarga') {
          this.barChartDataIncidencia[0].data.push(this.arrconIncidencia[0].TotalMerma);
          this.barChartDataIncidencia[0].data.push(this.arrconIncidencia[1].TotalReparacion);
          this.barChartDataIncidencia[0].label = 'Total Incidencias Orden Descarga';
        }
      }
    })
  }

  // datosEvidencia(data,i){
  //   console.log(data);
  //   this.cotizacionService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
  //     console.log(dataReporte);
  //     if(dataReporte.length>0){
  //       console.log(dataReporte);
  //       this.iniciarTotalesCotizacion();
  //       for (let l = 0; l < dataReporte.length; l++) {
  //           this.totalCotizacion = this.totalCotizacion + +dataReporte[l].Total;          
  //           this.totalDllsCotizacion = this.totalDllsCotizacion + +dataReporte[l].TotalDlls;          
  //           // this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;          
  //           // this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;          
  //           this.arrconCotizacion[i].Docs.push(dataReporte[l]);
  //         }

  //       this.arrconCotizacion[i].TotalMXN = this.totalCotizacion;
  //       this.arrconCotizacion[i].TotalDLLS = this.totalDllsCotizacion;
  //     // this.arrcon[i].sacosTotales = this.sacosTotales;
  //     // this.arrcon[i].pesoTotal = this.pesoTotal;
  //     //this.barChartData[0].data.push(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}))

  //     // if (this.monedaCotizacion=='Pesos'){
  //     //   // console.log(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}));

  //     //   this.barChartDataCotizacion[0].data.push(this.arrconCotizacion[i].TotalMXN);
  //     //   this.barChartDataCotizacion[0].label = 'Pedidos MXN'
  //     // }else if (this.monedaCotizacion=='Dolares'){
  //     //   console.log(this.arrconCotizacion[i].TotalDLLS.toLocaleString("en-US",{style:"currency", currency:"USD"}));
  //     //   this.barChartDataCotizacion[0].data.push(this.arrconCotizacion[i].TotalDLLS)
  //     //   this.barChartDataCotizacion[0].label = 'Pedidos USD'
  //     // }

  //   }else{
  //     this.iniciarTotalesEvidencia();

  //   }
  //   })
  // }


}
