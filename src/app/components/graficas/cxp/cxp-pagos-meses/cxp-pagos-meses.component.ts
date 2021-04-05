import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { PagoscxpService } from '../../../../services/cuentasxpagar/pagoscxp.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cxp-pagos-meses',
  templateUrl: './cxp-pagos-meses.component.html',
  styleUrls: ['./cxp-pagos-meses.component.css']
})
export class CxpPagosMesesComponent implements OnInit {

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(public pagosService: PagoscxpService) { }

  arrcon: Array<any> = [];
  reporteTipoDocumento: any;
  total: number;



  /* GRAFICAS */
  public barChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Pagos' },    
    
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
  /*  */

  checked;
  tipoDocumento;

  totalEnero;
  totalFebrero;
  totalMarzo;
  totalAbril;
  totalMayo;
  totalJunio;
  totalJulio;
  totalAgosto;
  totalSeptiembre;
  totalOctubre;
  totalNoviembre;
  totalDiciembre;



  ngOnInit() {
    
    this.barChartData[0].data = [];
    this.datosPago();
    

  }
  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    // this.subs2.unsubscribe();
  }

  public barChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{ticks: {
      callback: function(value, index, values) {
        return value.toLocaleString("en-US",{style:"currency", currency:"USD"});
      }
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
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  iniciarTotales(){
    this.total = 0;

    this.totalEnero= 0  ;
    this.totalFebrero= 0  ;
    this.totalMarzo= 0  ;
    this.totalAbril= 0  ;
    this.totalMayo= 0  ;
    this.totalJunio= 0  ;
    this.totalJulio= 0  ;
    this.totalAgosto= 0  ;
    this.totalSeptiembre= 0  ;
    this.totalOctubre= 0  ;
    this.totalNoviembre= 0  ;
    this.totalDiciembre= 0  ;
  }
subs1: Subscription
  datosPago(){
    
    this.subs1 = this.pagosService.getReporteGeneral().subscribe(dataReporte => {
      console.log(dataReporte);
      this.iniciarTotales();
      if(dataReporte.length>0){
        console.log(dataReporte);
        for (let l = 0; l < dataReporte.length; l++) {
          
            // console.log(getMonth(dataReporte[l].FechaElaboracion.substring(0,10)))
            let fecha = new Date(dataReporte[l].FechaPago)
            let mes = fecha.getMonth();

            if ( mes == 0){
              this.totalEnero = this.totalEnero + +dataReporte[l].Cantidad;
              
            }
            if ( mes == 1){
              this.totalFebrero = this.totalFebrero + +dataReporte[l].Cantidad;
       
            }
            if ( mes == 2){
              this.totalMarzo = this.totalMarzo + +dataReporte[l].Cantidad;
         
            }
            if ( mes == 3){
              this.totalAbril = this.totalAbril + +dataReporte[l].Cantidad;
           
            }
            if ( mes == 4){
              this.totalMayo = this.totalMayo + +dataReporte[l].Cantidad;
             
            }
            if ( mes == 5){
              this.totalJunio = this.totalJunio + +dataReporte[l].Cantidad;
          
            }
            if ( mes == 6){
              this.totalJulio = this.totalJulio + +dataReporte[l].Cantidad;
         
            }
            if ( mes == 7){
              this.totalAgosto = this.totalAgosto + +dataReporte[l].Cantidad;
             
            }
            if ( mes == 8){
              this.totalSeptiembre = this.totalSeptiembre + +dataReporte[l].Cantidad;
             
            }
            if ( mes == 9){
              this.totalOctubre = this.totalOctubre + +dataReporte[l].Cantidad;
             
            }
            if ( mes == 10){
              this.totalNoviembre = this.totalNoviembre + +dataReporte[l].Cantidad;
             
            }
            if ( mes == 11){
              this.totalDiciembre = this.totalDiciembre + +dataReporte[l].Cantidad;
             
            }




          }
        

  
      this.barChartData[0].label = 'Pagos'
      this.barChartData[0].data[0] = this.totalEnero
      this.barChartData[0].data[1] = this.totalFebrero
      this.barChartData[0].data[2] = this.totalMarzo
      this.barChartData[0].data[3] = this.totalAbril
      this.barChartData[0].data[4] = this.totalMayo
      this.barChartData[0].data[5] = this.totalJunio
      this.barChartData[0].data[6] = this.totalJulio
      this.barChartData[0].data[7] = this.totalAgosto
      this.barChartData[0].data[8] = this.totalSeptiembre
      this.barChartData[0].data[9] = this.totalOctubre
      this.barChartData[0].data[10] = this.totalNoviembre
      this.barChartData[0].data[11] = this.totalDiciembre
     
      this.chart.update();

       
    }
    })
  }


  public randomize(): void {
    
      for (let j = 0; j < this.barChartData[0].data.length; j++) {
        this.barChartData[0].data[j] = this.generateNumber(j);
      }
    
    this.chart.update();
  }
  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }


}
