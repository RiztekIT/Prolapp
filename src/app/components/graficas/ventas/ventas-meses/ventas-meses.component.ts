import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { VentasPedidoService } from '../../../../services/ventas/ventas-pedido.service';
import { VentasCotizacionService } from '../../../../services/ventas/ventas-cotizacion.service';

@Component({
  selector: 'app-ventas-meses',
  templateUrl: './ventas-meses.component.html',
  styleUrls: ['./ventas-meses.component.css']
})
export class VentasMesesComponent implements OnInit {

  constructor(public pedidoService: VentasPedidoService, public cotizacionService: VentasCotizacionService) { }

  ngOnInit() {
    this.monedaPedido = 'Pesos'
    this.checkedPedido = 'True'
    this.ClientePedido = 'Todos'
    this.monedaCotizacion = 'Pesos'
    this.checkedCotizacion = 'True'
    this.ClienteCotizacion = 'Todos'
    this.reportePedido();
    this.reporteCotizacion();
  }

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  arrconPedido: Array<any> = [];
  totalPedido: number;
  totalDllsPedido:number;

  arrconCotizacion: Array<any> = [];
  totalCotizacion: number;
  totalDllsCotizacion:number;

  monedaPedido;
  checkedPedido;
  ClientePedido;
  listaClientesPedido;

  monedaCotizacion;
  checkedCotizacion;
  ClienteCotizacion;
  listaClientesCotizacion;


  totalEneroPedido;
  totalFebreroPedido;
  totalMarzoPedido;
  totalAbrilPedido;
  totalMayoPedido;
  totalJunioPedido;
  totalJulioPedido;
  totalAgostoPedido;
  totalSeptiembrePedido;
  totalOctubrePedido;
  totalNoviembrePedido;
  totalDiciembrePedido;

  totalEneroCotizacion;
  totalFebreroCotizacion;
  totalMarzoCotizacion;
  totalAbrilCotizacion;
  totalMayoCotizacion;
  totalJunioCotizacion;
  totalJulioCotizacion;
  totalAgostoCotizacion;
  totalSeptiembreCotizacion;
  totalOctubreCotizacion;
  totalNoviembreCotizacion;
  totalDiciembreCotizacion;

  totalEneroDllsPedido;
  totalFebreroDllsPedido;
  totalMarzoDllsPedido;
  totalAbrilDllsPedido;
  totalMayoDllsPedido;
  totalJunioDllsPedido;
  totalJulioDllsPedido;
  totalAgostoDllsPedido;
  totalSeptiembreDllsPedido;
  totalOctubreDllsPedido;
  totalNoviembreDllsPedido;
  totalDiciembreDllsPedido;

  totalEneroDllsCotizacion;
  totalFebreroDllsCotizacion;
  totalMarzoDllsCotizacion;
  totalAbrilDllsCotizacion;
  totalMayoDllsCotizacion;
  totalJunioDllsCotizacion;
  totalJulioDllsCotizacion;
  totalAgostoDllsCotizacion;
  totalSeptiembreDllsCotizacion;
  totalOctubreDllsCotizacion;
  totalNoviembreDllsCotizacion;
  totalDiciembreDllsCotizacion;

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
  public barChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;

  public barChartDataPedido: ChartDataSets[] = [
    { data: [], label: 'Pedidos' },    
    
  ];
  public barChartDataCotizacion: ChartDataSets[] = [
    { data: [], label: 'Cotizaciones' },    
    
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

  reportePedido(){
    this.pedidoService.getDepDropDownValues().subscribe(dataClientes => {
      console.log(dataClientes);  
      this.listaClientesPedido=dataClientes;
       this.obtenerReportePedido(dataClientes.length, dataClientes);
    })
  }

  reporteCotizacion(){
    this.pedidoService.getDepDropDownValues().subscribe(dataClientes => {
      console.log(dataClientes);  
      this.listaClientesCotizacion=dataClientes;  
       this.obtenerReporteCotizacion(dataClientes.length, dataClientes);
    })
  }




  iniciarTotalesPedido(){
    this.totalPedido = 0;
    this.totalDllsPedido = 0;
  
  this.totalEneroPedido= 0  ;
  this.totalFebreroPedido= 0  ;
  this.totalMarzoPedido= 0  ;
  this.totalAbrilPedido= 0  ;
  this.totalMayoPedido= 0  ;
  this.totalJunioPedido= 0  ;
  this.totalJulioPedido= 0  ;
  this.totalAgostoPedido= 0  ;
  this.totalSeptiembrePedido= 0  ;
  this.totalOctubrePedido= 0  ;
  this.totalNoviembrePedido= 0  ;
  this.totalDiciembrePedido= 0  ;

  this.totalEneroDllsPedido= 0  ;
  this.totalFebreroDllsPedido= 0  ;
  this.totalMarzoDllsPedido= 0  ;
  this.totalAbrilDllsPedido= 0  ;
  this.totalMayoDllsPedido= 0  ;
  this.totalJunioDllsPedido= 0  ;
  this.totalJulioDllsPedido= 0  ;
  this.totalAgostoDllsPedido= 0  ;
  this.totalSeptiembreDllsPedido= 0  ;
  this.totalOctubreDllsPedido= 0  ;
  this.totalNoviembreDllsPedido= 0  ;
  this.totalDiciembreDllsPedido= 0  ;
  }
  iniciarTotalesCotizacion(){
    this.totalCotizacion = 0;
    this.totalDllsCotizacion = 0;
  
  this.totalEneroCotizacion= 0  ;
  this.totalFebreroCotizacion= 0  ;
  this.totalMarzoCotizacion= 0  ;
  this.totalAbrilCotizacion= 0  ;
  this.totalMayoCotizacion= 0  ;
  this.totalJunioCotizacion= 0  ;
  this.totalJulioCotizacion= 0  ;
  this.totalAgostoCotizacion= 0  ;
  this.totalSeptiembreCotizacion= 0  ;
  this.totalOctubreCotizacion= 0  ;
  this.totalNoviembreCotizacion= 0  ;
  this.totalDiciembreCotizacion= 0  ;

  this.totalEneroDllsCotizacion= 0  ;
  this.totalFebreroDllsCotizacion= 0  ;
  this.totalMarzoDllsCotizacion= 0  ;
  this.totalAbrilDllsCotizacion= 0  ;
  this.totalMayoDllsCotizacion= 0  ;
  this.totalJunioDllsCotizacion= 0  ;
  this.totalJulioDllsCotizacion= 0  ;
  this.totalAgostoDllsCotizacion= 0  ;
  this.totalSeptiembreDllsCotizacion= 0  ;
  this.totalOctubreDllsCotizacion= 0  ;
  this.totalNoviembreDllsCotizacion= 0  ;
  this.totalDiciembreDllsCotizacion= 0  ;
  }

  obtenerReportePedido(numero: number, data: any) {
    this.arrconPedido = []; 
          // this.filtroGeneral(numero , data, 'Ambas')
          for (let i = 0; i < numero; i++) {
            this.arrconPedido[i] = data[i];
            this.arrconPedido[i].Docs = [];      
             this.datosClientePedido(data,i);      
      }
  }
  obtenerReporteCotizacion(numero: number, data: any) {
    this.arrconCotizacion = []; 
          // this.filtroGeneral(numero , data, 'Ambas')
          for (let i = 0; i < numero; i++) {
            this.arrconCotizacion[i] = data[i];
            this.arrconCotizacion[i].Docs = [];      
             this.datosClienteCotizacion(data,i);      
      }
  }


  cambioPedido(event){
    this.monedaPedido = event.value;
    // console.log(this.moneda);
    this.reportePedido()
  }
  cambioCotizacion(event){
    this.monedaCotizacion = event.value;
    // console.log(this.moneda);
    this.reporteCotizacion()
  }


  reporteClientePedido(event){    
    console.log(event);
if(event.isUserInput){

  this.ClientePedido = [];
  this.ClientePedido.push(event.source.value)
  this.barChartDataPedido[0].data = [];
  this.datosClientePedido(this.ClientePedido,0);
}

    
  }
  reporteClienteCotizacion(event){    
    console.log(event);
if(event.isUserInput){

  this.ClienteCotizacion = [];
  this.ClienteCotizacion.push(event.source.value)
  // this.ver();
  //this.filtroGeneral(1,this.proveedor,"Ambas")
  this.barChartDataCotizacion[0].data = [];
  this.datosClienteCotizacion(this.ClienteCotizacion,0);
}

    
  }

  tipoClientePedido(event){
    console.log(event.checked);
    this.ClientePedido = 'Todos'
    if (event.checked){
      this.reportePedido();
    }
  }
  tipoClienteCotizacion(event){
    console.log(event.checked);
    this.ClienteCotizacion = 'Todos'
    if (event.checked){
      this.reporteCotizacion();
    }
  }

  datosClientePedido(data,i){
    console.log(data);
    this.pedidoService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
      console.log(dataReporte);
      if(dataReporte.length>0){
        console.log(dataReporte);
        this.iniciarTotalesPedido();
        for (let l = 0; l < dataReporte.length; l++) {
        

            let fecha = new Date(dataReporte[l].FechaDeExpedicion)
            let mes = fecha.getMonth();

            if ( mes == 0){
              this.totalEneroPedido = this.totalEneroPedido + +dataReporte[l].Total;
              this.totalEneroDllsPedido = this.totalEneroDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 1){
              this.totalFebreroPedido = this.totalFebreroPedido + +dataReporte[l].Total;
              this.totalFebreroDllsPedido = this.totalFebreroDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 2){
              this.totalMarzoPedido = this.totalMarzoPedido + +dataReporte[l].Total;
              this.totalMarzoDllsPedido = this.totalMarzoDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 3){
              this.totalAbrilPedido = this.totalAbrilPedido + +dataReporte[l].Total;
              this.totalAbrilDllsPedido = this.totalAbrilDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 4){
              this.totalMayoPedido = this.totalMayoPedido + +dataReporte[l].Total;
              this.totalMayoDllsPedido = this.totalMayoDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 5){
              this.totalJunioPedido = this.totalJunioPedido + +dataReporte[l].Total;
              this.totalJunioDllsPedido = this.totalJunioDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 6){
              this.totalJulioPedido = this.totalJulioPedido + +dataReporte[l].Total;
              this.totalJulioDllsPedido = this.totalJulioDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 7){
              this.totalAgostoPedido = this.totalAgostoPedido + +dataReporte[l].Total;
              this.totalAgostoDllsPedido = this.totalAgostoDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 8){
              this.totalSeptiembrePedido = this.totalSeptiembrePedido + +dataReporte[l].Total;
              this.totalSeptiembreDllsPedido = this.totalSeptiembreDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 9){
              this.totalOctubrePedido = this.totalOctubrePedido + +dataReporte[l].Total;
              this.totalOctubreDllsPedido = this.totalOctubreDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 10){
              this.totalNoviembrePedido = this.totalNoviembrePedido + +dataReporte[l].Total;
              this.totalNoviembreDllsPedido = this.totalNoviembreDllsPedido + +dataReporte[l].TotalDlls;
            }
            if ( mes == 11){
              this.totalDiciembrePedido = this.totalDiciembrePedido + +dataReporte[l].Total;
              this.totalDiciembreDllsPedido = this.totalDiciembreDllsPedido + +dataReporte[l].TotalDlls;
            }
          }
        
      if (this.monedaPedido=='Pesos'){
        this.barChartDataPedido[0].label = 'Pedidos MXN'
      this.barChartDataPedido[0].data[0] = this.totalEneroPedido
      this.barChartDataPedido[0].data[1] = this.totalFebreroPedido
      this.barChartDataPedido[0].data[2] = this.totalMarzoPedido
      this.barChartDataPedido[0].data[3] = this.totalAbrilPedido
      this.barChartDataPedido[0].data[4] = this.totalMayoPedido
      this.barChartDataPedido[0].data[5] = this.totalJunioPedido
      this.barChartDataPedido[0].data[6] = this.totalJulioPedido
      this.barChartDataPedido[0].data[7] = this.totalAgostoPedido
      this.barChartDataPedido[0].data[8] = this.totalSeptiembrePedido
      this.barChartDataPedido[0].data[9] = this.totalOctubrePedido
      this.barChartDataPedido[0].data[10] = this.totalNoviembrePedido
      this.barChartDataPedido[0].data[11] = this.totalDiciembrePedido
      }
      else if (this.monedaPedido=='Dolares'){
        this.barChartDataPedido[0].label = 'Pedidos USD'
        this.barChartDataPedido[0].data[0] = this.totalEneroDllsPedido
        this.barChartDataPedido[0].data[1] = this.totalFebreroDllsPedido
        this.barChartDataPedido[0].data[2] = this.totalMarzoDllsPedido
        this.barChartDataPedido[0].data[3] = this.totalAbrilDllsPedido
        this.barChartDataPedido[0].data[4] = this.totalMayoDllsPedido
        this.barChartDataPedido[0].data[5] = this.totalJunioDllsPedido
        this.barChartDataPedido[0].data[6] = this.totalJulioDllsPedido
        this.barChartDataPedido[0].data[7] = this.totalAgostoDllsPedido
        this.barChartDataPedido[0].data[8] = this.totalSeptiembreDllsPedido
        this.barChartDataPedido[0].data[9] = this.totalOctubreDllsPedido
        this.barChartDataPedido[0].data[10] = this.totalNoviembreDllsPedido
        this.barChartDataPedido[0].data[11] = this.totalDiciembreDllsPedido
      }
      this.chart.update();
       
    }else{
      this.iniciarTotalesPedido();
      
    }
    })
  }

  datosClienteCotizacion(data, i){
    console.log(data);
    this.cotizacionService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
      console.log(dataReporte);
      if(dataReporte.length>0){
        console.log(dataReporte);
        this.iniciarTotalesCotizacion();
        for (let l = 0; l < dataReporte.length; l++) {
        

            let fecha = new Date(dataReporte[l].FechaDeExpedicion)
            let mes = fecha.getMonth();

            if ( mes == 0){
              this.totalEneroCotizacion = this.totalEneroCotizacion + +dataReporte[l].Total;
              this.totalEneroDllsCotizacion = this.totalEneroDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 1){
              this.totalFebreroCotizacion = this.totalFebreroCotizacion + +dataReporte[l].Total;
              this.totalFebreroDllsCotizacion = this.totalFebreroDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 2){
              this.totalMarzoCotizacion = this.totalMarzoCotizacion + +dataReporte[l].Total;
              this.totalMarzoDllsCotizacion = this.totalMarzoDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 3){
              this.totalAbrilCotizacion = this.totalAbrilCotizacion + +dataReporte[l].Total;
              this.totalAbrilDllsCotizacion = this.totalAbrilDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 4){
              this.totalMayoCotizacion = this.totalMayoCotizacion + +dataReporte[l].Total;
              this.totalMayoDllsCotizacion = this.totalMayoDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 5){
              this.totalJunioCotizacion = this.totalJunioCotizacion + +dataReporte[l].Total;
              this.totalJunioDllsCotizacion = this.totalJunioDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 6){
              this.totalJulioCotizacion = this.totalJulioCotizacion + +dataReporte[l].Total;
              this.totalJulioDllsCotizacion = this.totalJulioDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 7){
              this.totalAgostoCotizacion = this.totalAgostoCotizacion + +dataReporte[l].Total;
              this.totalAgostoDllsCotizacion = this.totalAgostoDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 8){
              this.totalSeptiembreCotizacion = this.totalSeptiembreCotizacion + +dataReporte[l].Total;
              this.totalSeptiembreDllsCotizacion = this.totalSeptiembreDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 9){
              this.totalOctubreCotizacion = this.totalOctubreCotizacion + +dataReporte[l].Total;
              this.totalOctubreDllsCotizacion = this.totalOctubreDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 10){
              this.totalNoviembreCotizacion = this.totalNoviembreCotizacion + +dataReporte[l].Total;
              this.totalNoviembreDllsCotizacion = this.totalNoviembreDllsCotizacion + +dataReporte[l].TotalDlls;
            }
            if ( mes == 11){
              this.totalDiciembreCotizacion = this.totalDiciembreCotizacion + +dataReporte[l].Total;
              this.totalDiciembreDllsCotizacion = this.totalDiciembreDllsCotizacion + +dataReporte[l].TotalDlls;
            }
          }
        
      if (this.monedaCotizacion=='Pesos'){
        this.barChartDataCotizacion[0].label = 'Cotizaciones MXN'
      this.barChartDataCotizacion[0].data[0] = this.totalEneroCotizacion
      this.barChartDataCotizacion[0].data[1] = this.totalFebreroCotizacion
      this.barChartDataCotizacion[0].data[2] = this.totalMarzoCotizacion
      this.barChartDataCotizacion[0].data[3] = this.totalAbrilCotizacion
      this.barChartDataCotizacion[0].data[4] = this.totalMayoCotizacion
      this.barChartDataCotizacion[0].data[5] = this.totalJunioCotizacion
      this.barChartDataCotizacion[0].data[6] = this.totalJulioCotizacion
      this.barChartDataCotizacion[0].data[7] = this.totalAgostoCotizacion
      this.barChartDataCotizacion[0].data[8] = this.totalSeptiembreCotizacion
      this.barChartDataCotizacion[0].data[9] = this.totalOctubreCotizacion
      this.barChartDataCotizacion[0].data[10] = this.totalNoviembreCotizacion
      this.barChartDataCotizacion[0].data[11] = this.totalDiciembreCotizacion
      }
      else if (this.monedaCotizacion=='Dolares'){
        this.barChartDataCotizacion[0].label = 'Cotizaciones USD'
        this.barChartDataCotizacion[0].data[0] = this.totalEneroDllsCotizacion
        this.barChartDataCotizacion[0].data[1] = this.totalFebreroDllsCotizacion
        this.barChartDataCotizacion[0].data[2] = this.totalMarzoDllsCotizacion
        this.barChartDataCotizacion[0].data[3] = this.totalAbrilDllsCotizacion
        this.barChartDataCotizacion[0].data[4] = this.totalMayoDllsCotizacion
        this.barChartDataCotizacion[0].data[5] = this.totalJunioDllsCotizacion
        this.barChartDataCotizacion[0].data[6] = this.totalJulioDllsCotizacion
        this.barChartDataCotizacion[0].data[7] = this.totalAgostoDllsCotizacion
        this.barChartDataCotizacion[0].data[8] = this.totalSeptiembreDllsCotizacion
        this.barChartDataCotizacion[0].data[9] = this.totalOctubreDllsCotizacion
        this.barChartDataCotizacion[0].data[10] = this.totalNoviembreDllsCotizacion
        this.barChartDataCotizacion[0].data[11] = this.totalDiciembreDllsCotizacion
      }
      this.chart.update();
       
    }else{
      this.iniciarTotalesCotizacion();
      
    }
    })

  }


  // public randomize(): void {
    
  //     for (let j = 0; j < this.barChartData[0].data.length; j++) {
  //       this.barChartData[0].data[j] = this.generateNumber(j);
  //     }
    
  //   this.chart.update();
  // }
  // private generateNumber(i: number) {
  //   return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  // }

}
