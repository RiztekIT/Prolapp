import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import { OrdenCargaService } from '../../../../services/almacen/orden-carga/orden-carga.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-almacen-traspaso-meses',
  templateUrl: './almacen-traspaso-meses.component.html',
  styleUrls: ['./almacen-traspaso-meses.component.css']
})
export class AlmacenTraspasoMesesComponent implements OnInit {

 
  constructor(public traspasoService: TraspasoMercanciaService, ) { }

  ngOnInit() {
    this.informacion = 'Kg'
    this.checked = 'True'
    // this.Cliente = 'Todos'
    // this.reporte();
    this.verReporte();
  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    // this.subs2.unsubscribe();
  }

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  arrcon: Array<any> = [];
  totalKg: number;
  totalSacos:number;


  informacion;
  checked;
  // Cliente;
  // listaClientes;

 

  totalEneroKg;
  totalFebreroKg;
  totalMarzoKg;
  totalAbrilKg;
  totalMayoKg;
  totalJunioKg;
  totalJulioKg;
  totalAgostoKg;
  totalSeptiembreKg;
  totalOctubreKg;
  totalNoviembreKg;
  totalDiciembreKg;

  totalEneroSacos;
  totalFebreroSacos;
  totalMarzoSacos;
  totalAbrilSacos;
  totalMayoSacos;
  totalJunioSacos;
  totalJulioSacos;
  totalAgostoSacos;
  totalSeptiembreSacos;
  totalOctubreSacos;
  totalNoviembreSacos;
  totalDiciembreSacos;

  public barChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{ticks: {
      callback: function(value, index, values) {
        return value.toLocaleString("en-US",{});
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
  public barChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  public barChartType: ChartType = 'line';
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


  // reporte(){
  //   // this.pedidoService.getDepDropDownValues().subscribe(dataClientes => {
  //     // console.log(dataClientes);  
  //     // this.listaClientes=dataClientes;
  //  let dataClientes = {
  //       IdClientes: 0
  //     }
  //      this.obtenerReporte(1, dataClientes);
  //   // })
  // }



  iniciarTotales(){
    this.totalSacos = 0;
    this.totalKg = 0;
  
  this.totalEneroKg= 0  ;
  this.totalFebreroKg= 0  ;
  this.totalMarzoKg= 0  ;
  this.totalAbrilKg= 0  ;
  this.totalMayoKg= 0  ;
  this.totalJunioKg= 0  ;
  this.totalJulioKg= 0  ;
  this.totalAgostoKg= 0  ;
  this.totalSeptiembreKg= 0  ;
  this.totalOctubreKg= 0  ;
  this.totalNoviembreKg= 0  ;
  this.totalDiciembreKg= 0  ;

  this.totalEneroSacos= 0  ;
  this.totalFebreroSacos= 0  ;
  this.totalMarzoSacos= 0  ;
  this.totalAbrilSacos= 0  ;
  this.totalMayoSacos= 0  ;
  this.totalJunioSacos= 0  ;
  this.totalJulioSacos= 0  ;
  this.totalAgostoSacos= 0  ;
  this.totalSeptiembreSacos= 0  ;
  this.totalOctubreSacos= 0  ;
  this.totalNoviembreSacos= 0  ;
  this.totalDiciembreSacos= 0  ;
  }

  cambio(event) {
    this.informacion = event.value;
    this.verReporte()
  }


  verReporte() {
    this.barChartData[0].data = [];
    // this.barChartLabels = [];
    // this.arrcon[0] = [];
    this.datosTraspaso();
  }

  // obtenerReporte(numero: number, data: any) {
  //   this.arrcon = []; 
  //         // this.filtroGeneral(numero , data, 'Ambas')
  //           this.arrcon[numero] = data;
  //            this.datosCliente(data,numero);      

  // }


  // cambio(event){
  //   this.informacion = event.value;
  //   // console.log(this.moneda);
  //   this.reporte()
  // }
subs1: Subscription
datosTraspaso(){
  // console.log(data);
  // this.ordenCargaService.getReporteClienteId(data.IdClientes).subscribe(dataReporte => {
   this.subs1 = this.traspasoService.getTraspasoMercancia().subscribe(dataReporte => {
    console.log(dataReporte);
    this.iniciarTotales();
    if(dataReporte.length>0){
      console.log(dataReporte);
      for (let l = 0; l < dataReporte.length; l++) {
      

          let fecha = new Date(dataReporte[l].FechaExpedicion)
          let mes = fecha.getMonth();

          if ( mes == 0){
            this.totalEneroSacos = this.totalEneroSacos + +dataReporte[l].SacosTotales;
            this.totalEneroKg = this.totalEneroKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 1){
            this.totalFebreroSacos = this.totalFebreroSacos + +dataReporte[l].SacosTotales;
            this.totalFebreroKg = this.totalFebreroKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 2){
            this.totalMarzoSacos = this.totalMarzoSacos + +dataReporte[l].SacosTotales;
            this.totalMarzoKg = this.totalMarzoKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 3){
            this.totalAbrilSacos = this.totalAbrilSacos + +dataReporte[l].SacosTotales;
            this.totalAbrilKg = this.totalAbrilKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 4){
            this.totalMayoSacos = this.totalMayoSacos + +dataReporte[l].SacosTotales;
            this.totalMayoKg = this.totalMayoKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 5){
            this.totalJunioSacos = this.totalJunioSacos+ +dataReporte[l].SacosTotales;
            this.totalJunioKg = this.totalJunioKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 6){
            this.totalJulioSacos = this.totalJulioSacos + +dataReporte[l].SacosTotales;
            this.totalJulioKg = this.totalJulioKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 7){
            this.totalAgostoSacos = this.totalAgostoSacos + +dataReporte[l].SacosTotales;
            this.totalAgostoKg = this.totalAgostoKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 8){
            this.totalSeptiembreSacos = this.totalSeptiembreSacos + +dataReporte[l].SacosTotales;
            this.totalSeptiembreKg = this.totalSeptiembreKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 9){
            this.totalOctubreSacos = this.totalOctubreSacos + +dataReporte[l].SacosTotales;
            this.totalOctubreKg = this.totalOctubreKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 10){
            this.totalNoviembreSacos = this.totalNoviembreSacos + +dataReporte[l].SacosTotales;
            this.totalNoviembreKg = this.totalNoviembreKg + +dataReporte[l].KilogramosTotales;
          }
          if ( mes == 11){
            this.totalDiciembreSacos = this.totalDiciembreSacos + +dataReporte[l].SacosTotales;
            this.totalDiciembreKg = this.totalDiciembreKg + +dataReporte[l].KilogramosTotales;
          }
        }
      
    if (this.informacion=='Sacos'){
      this.barChartData[0].label = 'Traspaso Sacos'
    this.barChartData[0].data[0] = this.totalEneroSacos
    this.barChartData[0].data[1] = this.totalFebreroSacos
    this.barChartData[0].data[2] = this.totalMarzoSacos
    this.barChartData[0].data[3] = this.totalAbrilSacos
    this.barChartData[0].data[4] = this.totalMayoSacos
    this.barChartData[0].data[5] = this.totalJunioSacos
    this.barChartData[0].data[6] = this.totalJulioSacos
    this.barChartData[0].data[7] = this.totalAgostoSacos
    this.barChartData[0].data[8] = this.totalSeptiembreSacos
    this.barChartData[0].data[9] = this.totalOctubreSacos
    this.barChartData[0].data[10] = this.totalNoviembreSacos
    this.barChartData[0].data[11] = this.totalDiciembreSacos
    }
    else if (this.informacion=='Kg'){
      this.barChartData[0].label = 'Traspaso Kilogramos'
      this.barChartData[0].data[0] = this.totalEneroKg
      this.barChartData[0].data[1] = this.totalFebreroKg
      this.barChartData[0].data[2] = this.totalMarzoKg
      this.barChartData[0].data[3] = this.totalAbrilKg
      this.barChartData[0].data[4] = this.totalMayoKg
      this.barChartData[0].data[5] = this.totalJunioKg
      this.barChartData[0].data[6] = this.totalJulioKg
      this.barChartData[0].data[7] = this.totalAgostoKg
      this.barChartData[0].data[8] = this.totalSeptiembreKg
      this.barChartData[0].data[9] = this.totalOctubreKg
      this.barChartData[0].data[10] = this.totalNoviembreKg
      this.barChartData[0].data[11] = this.totalDiciembreKg
    }
    this.chart.update();
     
  }
  })
}

}
