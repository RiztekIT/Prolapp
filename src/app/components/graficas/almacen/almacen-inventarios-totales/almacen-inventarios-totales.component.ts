import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { ProductosService } from 'src/app/services/catalogos/productos.service';
import { Producto } from '../../../../Models/catalogos/productos-model';


@Component({
  selector: 'app-almacen-inventarios-totales',
  templateUrl: './almacen-inventarios-totales.component.html',
  styleUrls: ['./almacen-inventarios-totales.component.css']
})
export class AlmacenInventariosTotalesComponent implements OnInit {

  constructor(public productoService: ProductosService, public serviceTarima: TarimaService) { }

  ngOnInit() {
    this.checked = 'True'
    this.Bodega = 'Todos'
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

  sacos: number;

  checked;
  Bodega;
  listaBodegas;

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
    this.sacos = 0;
  }

  verReporte() {
    this.barChartData[0].data = [];
    this.reporte();
  }



  reporte() {

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

  obtenerReporte(numero: number, data: any) {
    this.arrcon = [];
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.datosBodega(data, i);
    }
    // console.log(this.arrcon);
  }





  reporteBodega(event) {
    console.log(event);
    if (event.isUserInput) {
      this.Bodega = [];
      this.Bodega.push(event.source.value)
      this.barChartLabels = [];
      this.barChartLabels.push(this.Bodega[0].Nombre)
      this.barChartData[0].data = [];
      this.datosBodega(this.Bodega, 0);
    }
  }


  tipoProducto(event) {
    console.log(event.checked);
    this.Bodega = 'Todos'
    if (event.checked) {
      this.verReporte();
    }
  }


  // this.ocService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
  //   console.log(dataReporte);
  //   if (dataReporte.length > 0) {
  //     console.log(dataReporte);
  //     this.iniciarTotales();
  //     for (let l = 0; l < dataReporte.length; l++) {
  //       this.sacos = this.sacos + +dataReporte[l].Sacos;
  //     }
  //     this.arrcon[i].sacos = this.sacos;
  //     this.barChartData[0].data.push(this.arrcon[i].sacos);
  //     this.barChartData[0].label = 'Orden Carga Sacos'
  //   } else {
  //     this.iniciarTotales();

  //   }
  // })
  subs1: Subscription
  datosBodega(bodega, a) {
    console.log(bodega);
    console.log(a);
   this.subs1 = this.serviceTarima.GetSumatoriaBodega(bodega[a].Nombre).subscribe(dataBodega=>{
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
  //                 this.barChartData[0].label = 'Orden Carga Sacos'
  //               }) 
  //             }
  //             this.serviceTarima.master[contador].detalle = datadet;
  //             this.serviceTarima.master[contador].Stock = sacostotales;
  //             // console.log('MASTER');
  //             // console.log(this.serviceTarima.master);
  //             contador++;
  //           }
  //           // this.chart.update();
  //           //INFORMACION TABLA
  //         })
  //       }
  //     })
  //   }
  

}
