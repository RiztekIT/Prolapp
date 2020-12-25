import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-almacen-inventarios-meses',
  templateUrl: './almacen-inventarios-meses.component.html',
  styleUrls: ['./almacen-inventarios-meses.component.css']
})
export class AlmacenInventariosMesesComponent implements OnInit {

  constructor(public serviceTarima: TarimaService) { }

  ngOnInit() {
    this.checked = 'True'
    this.Bodega = 'Todos'
    this.reporte();
  }

  ngOnDestroy(): void {
    this.subs1.unsubscribe();
    // this.subs2.unsubscribe();
  }

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  arrcon: Array<any> = [];
  totalSacos:number;


  checked;
  Bodega;
  listaBodegas;

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
    { data: [], label: 'Inventario' },    
    
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


  reporte(){
    let dataProd: Array<any> = [
      { Nombre: "PasoTx" },
      { Nombre: "Chihuahua" },
      { Nombre: "Transito" }
    ]
    this.barChartLabels = [];
    this.listaBodegas = dataProd;
    for (let i = 0; i < dataProd.length; i++) {
      if (this.Bodega == 'Todos') {
        this.barChartLabels.push(dataProd[i].Nombre);
      } else if (this.Bodega == dataProd[i].Nombre) {
        this.barChartLabels.push(dataProd[i].Nombre);
      }
    }
    console.log(dataProd);
    this.obtenerReporte(dataProd.length, dataProd);
  }



  iniciarTotales(){
    this.totalSacos = 0;

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

  obtenerReporte(numero: number, data: any) {
    this.arrcon = []; 
          for (let i = 0; i < numero; i++) {
            this.arrcon[i] = data[i];    
             this.datosBodega(data,i);      
      }
  }


  // cambio(event){
  //   this.informacion = event.value;
  //   // console.log(this.moneda);
  //   this.reporte()
  // }
  subs1: Subscription
  datosBodega(bodega, a) {
    console.log(bodega);
    console.log(a);
  this.subs1 =  this.serviceTarima.GetSumatoriaBodega(bodega[a].Nombre).subscribe(dataBodega=>{
      console.log(dataBodega);
      this.barChartData[0].data[a] = dataBodega[0].Sacos;
      this.barChartData[0].label = 'Inventario Sacos'
      this.chart.update();
    })
  }

// datosBodega(bodega, a){
//   console.log(a);
//     let contador = 0;
//     this.serviceTarima.master = [];
//     let sacostotales;
//     this.serviceTarima.getProductos().subscribe((data:any)=>{
//       // console.log(data,'obtner tarimas');
//       for (let l=0; l<data.length; l++){
//         // console.log(data[l].Nombre);
//         // console.log(bodega[i].N);
//         this.serviceTarima.GetTarimaProducto(data[l].Nombre, bodega[a].Nombre).subscribe(datadet =>{
//           // console.log(datadet);
//           if (datadet.length>0){
//             sacostotales = 0;
//             this.serviceTarima.master[contador] = data[l];
//             for (let i=0; i<datadet.length;i++){
//               sacostotales = sacostotales + +datadet[i].Sacos;
//               datadet[i].SacosD = +datadet[i].Sacos;
//               this.serviceTarima.GetTarimaProductoD(datadet[i].Producto,datadet[i].Lote).subscribe(datas=>{
//                 // console.log(datas,'datas');
//                 if (datas.length>0){
//                   for (let d=0; d<datas.length;d++){
//                     datadet[i].SacosD = datadet[i].SacosD - +datas[d].Sacos
//                   }
//                 }else{
//                   datadet[i].SacosD = datadet[i].SacosD
//                 }
//                 this.barChartData[0].data[a] = datadet[i].SacosD;
//               }) 
//             }
//             this.barChartData[0].label = 'Inventario Sacos'
//             this.serviceTarima.master[contador].detalle = datadet;
//             this.serviceTarima.master[contador].Stock = sacostotales;
//             // console.log('MASTER');
//             // console.log(this.serviceTarima.master);
//             contador++;
//             this.chart.update();
//           }
//           //INFORMACION TABLA
//         })
//       }
//     })
//   }
// }

// datosBodega(data,i){
//   console.log(data);
//   this.ordenCargaService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
//     console.log(dataReporte);
//     if(dataReporte.length>0){
//       console.log(dataReporte);
//       this.iniciarTotales();
//       for (let l = 0; l < dataReporte.length; l++) {
      

//           let fecha = new Date(dataReporte[l].FechaExpedicion)
//           let mes = fecha.getMonth();

//           if ( mes == 0){
//             this.totalEneroSacos = this.totalEneroSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 1){
//             this.totalFebreroSacos = this.totalFebreroSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 2){
//             this.totalMarzoSacos = this.totalMarzoSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 3){
//             this.totalAbrilSacos = this.totalAbrilSacos + +dataReporte[l].Total;
//           }
//           if ( mes == 4){
//             this.totalMayoSacos = this.totalMayoSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 5){
//             this.totalJunioSacos = this.totalJunioSacos+ +dataReporte[l].Sacos;
//           }
//           if ( mes == 6){
//             this.totalJulioSacos = this.totalJulioSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 7){
//             this.totalAgostoSacos = this.totalAgostoSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 8){
//             this.totalSeptiembreSacos = this.totalSeptiembreSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 9){
//             this.totalOctubreSacos = this.totalOctubreSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 10){
//             this.totalNoviembreSacos = this.totalNoviembreSacos + +dataReporte[l].Sacos;
//           }
//           if ( mes == 11){
//             this.totalDiciembreSacos = this.totalDiciembreSacos + +dataReporte[l].Sacos;
//           }
//         }
      
//       this.barChartData[0].label = 'Orden Carga Sacos'
//     this.barChartData[0].data[0] = this.totalEneroSacos
//     this.barChartData[0].data[1] = this.totalFebreroSacos
//     this.barChartData[0].data[2] = this.totalMarzoSacos
//     this.barChartData[0].data[3] = this.totalAbrilSacos
//     this.barChartData[0].data[4] = this.totalMayoSacos
//     this.barChartData[0].data[5] = this.totalJunioSacos
//     this.barChartData[0].data[6] = this.totalJulioSacos
//     this.barChartData[0].data[7] = this.totalAgostoSacos
//     this.barChartData[0].data[8] = this.totalSeptiembreSacos
//     this.barChartData[0].data[9] = this.totalOctubreSacos
//     this.barChartData[0].data[10] = this.totalNoviembreSacos
//     this.barChartData[0].data[11] = this.totalDiciembreSacos
   
//     this.chart.update();
     
//   }else{
//     this.iniciarTotales();
    
//   }
//   })
}



