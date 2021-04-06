import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { IncidenciasService } from 'src/app/services/almacen/incidencias/incidencias.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calidad-meses',
  templateUrl: './calidad-meses.component.html',
  styleUrls: ['./calidad-meses.component.css']
})
export class CalidadMesesComponent implements OnInit {

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(public incidenciasService: IncidenciasService,) { }

  ngOnInit() {
    this.ordenIncidencia = 'OrdenCarga';
    this.verIncidencia();
 
  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    // this.subs2.unsubscribe();
  }

    //variables Incidencia
    arrconIncidencia: Array<any> = [];
    // totalIncidencia: number;
    ordenIncidencia;

    totalEneroIncidencia;
    totalFebreroIncidencia;
    totalMarzoIncidencia;
    totalAbrilIncidencia;
    totalMayoIncidencia;
    totalJunioIncidencia;
    totalJulioIncidencia;
    totalAgostoIncidencia;
    totalSeptiembreIncidencia;
    totalOctubreIncidencia;
    totalNoviembreIncidencia;
    totalDiciembreIncidencia;

    public barChartOptions: (ChartOptions & { annotation: any }) = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{ticks: {
        callback: function(value, index, values) {
          return value.toLocaleString("en-US",{});
        },
        beginAtZero: true
      }}] },    
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              enabled: true,
              fontColor: 'orange',
              content: 'LineAnno'
            }
          },
        ],
      },
    };
  
    /* GRAFICAS */
    public barChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    public barChartType: ChartType = 'line';
    public barChartLegend = true;
  
    public barChartDataIncidencia: ChartDataSets[] = [
      { data: [], label: 'Incidencias' },    
      
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

    verIncidencia() {
      this.barChartDataIncidencia[0].data = [];
      this.obtenerReporteIncidencia();
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
  
     
      this.barChartDataIncidencia[0].data = [];
  
      for (let i = 0; i < tipoIncidencias.length; i++) {
        console.log(tipoIncidencias[i]);
        this.arrconIncidencia[i] = tipoIncidencias[i];
      }
      this.datosIncidencia(tipoIncidencias, tipoIncidencias.length);
    }
  
    cambioIncidencia(event) {
      this.ordenIncidencia = event.value;
      this.verIncidencia()
    }

    iniciarTotalesIncidencia(){
   
    
    this.totalEneroIncidencia= 0  ;
    this.totalFebreroIncidencia= 0  ;
    this.totalMarzoIncidencia= 0  ;
    this.totalAbrilIncidencia= 0  ;
    this.totalMayoIncidencia= 0  ;
    this.totalJunioIncidencia= 0  ;
    this.totalJulioIncidencia= 0  ;
    this.totalAgostoIncidencia= 0  ;
    this.totalSeptiembreIncidencia= 0  ;
    this.totalOctubreIncidencia= 0  ;
    this.totalNoviembreIncidencia= 0  ;
    this.totalDiciembreIncidencia= 0  ;
  

    }

  subs1: Subscription
    datosIncidencia(data, i) {
      console.log(data);
      
     this.subs1 = this.incidenciasService.getIncidenciaProcedencia(this.ordenIncidencia).subscribe(dataReporte => {
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


            console.log(dataReporte);
            this.iniciarTotalesIncidencia();
            for (let l = 0; l < dataReporte.length; l++) {
            
    
                let fecha = new Date(dataReporte[l].FechaElaboracion)
                let mes = fecha.getMonth();
    
                if ( mes == 0){
                  this.totalEneroIncidencia = this.totalEneroIncidencia + 1;
                  
                }
                if ( mes == 1){
                  this.totalFebreroIncidencia = this.totalFebreroIncidencia + 1;
                  
                }
                if ( mes == 2){
                  this.totalMarzoIncidencia = this.totalMarzoIncidencia + 1;
                  
                }
                if ( mes == 3){
                  this.totalAbrilIncidencia = this.totalAbrilIncidencia + 1;
                  
                }
                if ( mes == 4){
                  this.totalMayoIncidencia = this.totalMayoIncidencia + 1;
                  
                }
                if ( mes == 5){
                  this.totalJunioIncidencia = this.totalJunioIncidencia + 1;
                  
                }
                if ( mes == 6){
                  this.totalJulioIncidencia = this.totalJulioIncidencia + 1;
                  
                }
                if ( mes == 7){
                  this.totalAgostoIncidencia = this.totalAgostoIncidencia + 1;
                  
                }
                if ( mes == 8){
                  this.totalSeptiembreIncidencia = this.totalSeptiembreIncidencia + 1;
                  
                }
                if ( mes == 9){
                  this.totalOctubreIncidencia = this.totalOctubreIncidencia + 1;
                  
                }
                if ( mes == 10){
                  this.totalNoviembreIncidencia = this.totalNoviembreIncidencia + 1;
                  
                }
                if ( mes == 11){
                  this.totalDiciembreIncidencia = this.totalDiciembreIncidencia + 1;
                  
                }
              }
            
          if (this.ordenIncidencia=='OrdenCarga'){
            this.barChartDataIncidencia[0].label = 'Incidencias Orden Carga'
          this.barChartDataIncidencia[0].data[0] = this.totalEneroIncidencia
          this.barChartDataIncidencia[0].data[1] = this.totalFebreroIncidencia
          this.barChartDataIncidencia[0].data[2] = this.totalMarzoIncidencia
          this.barChartDataIncidencia[0].data[3] = this.totalAbrilIncidencia
          this.barChartDataIncidencia[0].data[4] = this.totalMayoIncidencia
          this.barChartDataIncidencia[0].data[5] = this.totalJunioIncidencia
          this.barChartDataIncidencia[0].data[6] = this.totalJulioIncidencia
          this.barChartDataIncidencia[0].data[7] = this.totalAgostoIncidencia
          this.barChartDataIncidencia[0].data[8] = this.totalSeptiembreIncidencia
          this.barChartDataIncidencia[0].data[9] = this.totalOctubreIncidencia
          this.barChartDataIncidencia[0].data[10] = this.totalNoviembreIncidencia
          this.barChartDataIncidencia[0].data[11] = this.totalDiciembreIncidencia
          }
          else if (this.ordenIncidencia=='OrdenDescarga'){
            this.barChartDataIncidencia[0].label = 'Incidencias Orden Descarga'
            this.barChartDataIncidencia[0].data[0] = this.totalEneroIncidencia
            this.barChartDataIncidencia[0].data[1] = this.totalFebreroIncidencia
            this.barChartDataIncidencia[0].data[2] = this.totalMarzoIncidencia
            this.barChartDataIncidencia[0].data[3] = this.totalAbrilIncidencia
            this.barChartDataIncidencia[0].data[4] = this.totalMayoIncidencia
            this.barChartDataIncidencia[0].data[5] = this.totalJunioIncidencia
            this.barChartDataIncidencia[0].data[6] = this.totalJulioIncidencia
            this.barChartDataIncidencia[0].data[7] = this.totalAgostoIncidencia
            this.barChartDataIncidencia[0].data[8] = this.totalSeptiembreIncidencia
            this.barChartDataIncidencia[0].data[9] = this.totalOctubreIncidencia
            this.barChartDataIncidencia[0].data[10] = this.totalNoviembreIncidencia
            this.barChartDataIncidencia[0].data[11] = this.totalDiciembreIncidencia
          this.chart.update();
           

          
          } 
        }
        })
    }

}
