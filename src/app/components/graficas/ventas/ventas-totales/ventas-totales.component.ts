import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { VentasCotizacionService } from '../../../../services/ventas/ventas-cotizacion.service';
import { VentasPedidoService } from '../../../../services/ventas/ventas-pedido.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ventas-totales',
  templateUrl: './ventas-totales.component.html',
  styleUrls: ['./ventas-totales.component.css']
})
export class VentasTotalesComponent implements OnInit {

  constructor(public pedidoService: VentasPedidoService, public cotizacionService: VentasCotizacionService) { }

  ngOnInit() {
    this.monedaPedido = 'Pesos'
    this.checkedPedido = 'True'
    this.ClientePedido = 'Todos'

    this.monedaCotizacion = 'Pesos'
    this.checkedCotizacion = 'True'
    this.ClienteCotizacion = 'Todos'
    this.verPedido();
    this.verCotizacion();
  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    if(this.subs2){
      this.subs2.unsubscribe();
    }
    if(this.subs3){
      this.subs3.unsubscribe();
    }
    if(this.subs4){
      this.subs4.unsubscribe();
    }
  }

  arrconPedido: Array<any> = [];
  arrconCotizacion: Array<any> = [];

  totalPedido: number;
  totalDllsPedido:number;

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


   /* GRAFICAS */
   public barChartLabelsPedido: Label[] = [];
   public barChartLabelsCotizacion: Label[] = [];
   public barChartTypePedido: ChartType = 'bar';
   public barChartTypeCotizacion: ChartType = 'bar';
   public barChartLegendPedido = true;
   public barChartLegendCotizacion = true;
 
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

   public barChartOptionsPedido: ChartOptions = {
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
    }
  };
   public barChartOptionsCotizacion: ChartOptions = {
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
    }
  };

  /* GRAFICAS */
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  
  iniciarTotalesPedido(){
    this.totalPedido = 0;
    this.totalDllsPedido = 0;
  }

  iniciarTotalesCotizacion(){
    this.totalCotizacion = 0;
    this.totalDllsCotizacion = 0;
  }

  verPedido(){
    this.barChartDataPedido[0].data = [];
    this.reportePedido(); 
  }
  verCotizacion(){
    this.barChartDataCotizacion[0].data = [];
    this.reporteCotizacion(); 
  }

subs1: Subscription
  reportePedido(){
  this.subs1 =  this.pedidoService.getDepDropDownValues().subscribe(dataClientes => {
      console.log(dataClientes);  
      this.barChartLabelsPedido = []; 
      this.listaClientesPedido=dataClientes;
  
      for (let i=0; i<5;i++){
      // for (let i=0; i<dataClientes.length;i++){

        if(this.ClientePedido == 'Todos'){
          

          this.barChartLabelsPedido.push(dataClientes[i].Nombre);    
        }else if(this.ClientePedido==dataClientes[i].Nombre) {
          this.barChartLabelsPedido.push(dataClientes[i].Nombre);  
          

        }

      }
      // console.log(this.barChartLabels.length);
       this.obtenerReportePedido(dataClientes.length, dataClientes);
    })
  }
subs3: Subscription
  reporteCotizacion(){
   this.subs3 =  this.pedidoService.getDepDropDownValues().subscribe(dataClientes => {
      console.log(dataClientes);  
      this.barChartLabelsCotizacion = []; 
      this.listaClientesCotizacion=dataClientes;
  
      for (let i=0; i<5;i++){
      // for (let i=0; i<dataClientes.length;i++){

        if(this.ClienteCotizacion == 'Todos'){
          

          this.barChartLabelsCotizacion.push(dataClientes[i].Nombre);    
        }else if(this.ClienteCotizacion==dataClientes[i].Nombre) {
          this.barChartLabelsCotizacion.push(dataClientes[i].Nombre);  
          

        }

      }
      // console.log(this.barChartLabels.length);
       this.obtenerReporteCotizacion(dataClientes.length, dataClientes);
    })
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
    this.verPedido()
  }
  cambioCotizacion(event){
    this.monedaCotizacion = event.value;
    // console.log(this.moneda);
    this.verCotizacion()
  }


  reporteClientePedido(event){    
    console.log(event);
if(event.isUserInput){

  this.ClientePedido = [];
  this.ClientePedido.push(event.source.value)
  // this.ver();
  //this.filtroGeneral(1,this.proveedor,"Ambas")
  this.barChartLabelsPedido = []; 
  this.barChartLabelsPedido.push(this.ClientePedido[0].Nombre)
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
  this.barChartLabelsCotizacion = []; 
  this.barChartLabelsCotizacion.push(this.ClienteCotizacion[0].Nombre)
  this.barChartDataCotizacion[0].data = [];
  this.datosClienteCotizacion(this.ClienteCotizacion,0);
}

    
  }

  tipoClientePedido(event){
    console.log(event.checked);
    this.ClientePedido = 'Todos'
    if (event.checked){
      this.verPedido();
    }
  }
  tipoClienteCotizacion(event){
    console.log(event.checked);
    this.ClienteCotizacion = 'Todos'
    if (event.checked){
      this.verCotizacion();
    }
  }
subs2: Subscription
  datosClientePedido(data,i){
    console.log(data);
   this.subs2 = this.pedidoService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
      console.log(dataReporte);
      if(dataReporte.length>0){
        console.log(dataReporte);
        this.iniciarTotalesPedido();
        for (let l = 0; l < dataReporte.length; l++) {
            this.totalPedido = this.totalPedido + +dataReporte[l].Total;          
            this.totalDllsPedido = this.totalDllsPedido + +dataReporte[l].TotalDlls;          
            // this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;          
            // this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;          
            this.arrconPedido[i].Docs.push(dataReporte[l]);
          }
        
        this.arrconPedido[i].TotalMXN = this.totalPedido;
        this.arrconPedido[i].TotalDLLS = this.totalDllsPedido;
      // this.arrcon[i].sacosTotales = this.sacosTotales;
      // this.arrcon[i].pesoTotal = this.pesoTotal;
      //this.barChartData[0].data.push(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}))
      
      if (this.monedaPedido=='Pesos'){
        console.log(this.arrconPedido[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}));
  
        this.barChartDataPedido[0].data.push(this.arrconPedido[i].TotalMXN);
        this.barChartDataPedido[0].label = 'Pedidos MXN'
      }else if (this.monedaPedido=='Dolares'){
        console.log(this.arrconPedido[i].TotalDLLS.toLocaleString("en-US",{style:"currency", currency:"USD"}));
        this.barChartDataPedido[0].data.push(this.arrconPedido[i].TotalDLLS)
        this.barChartDataPedido[0].label = 'Pedidos USD'
      }
      // this.barChartData[1].data.push(this.arrcon[i].TotalDLLS)/*  */
       
    }else{
      this.iniciarTotalesPedido();
      
    }
    })
  }

  subs4: Subscription
  datosClienteCotizacion(data,i){
    console.log(data);
   this.subs4 =  this.cotizacionService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
      console.log(dataReporte);
      if(dataReporte.length>0){
        console.log(dataReporte);
        this.iniciarTotalesCotizacion();
        for (let l = 0; l < dataReporte.length; l++) {
            this.totalCotizacion = this.totalCotizacion + +dataReporte[l].Total;          
            this.totalDllsCotizacion = this.totalDllsCotizacion + +dataReporte[l].TotalDlls;          
            // this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;          
            // this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;          
            this.arrconCotizacion[i].Docs.push(dataReporte[l]);
          }
        
        this.arrconCotizacion[i].TotalMXN = this.totalCotizacion;
        this.arrconCotizacion[i].TotalDLLS = this.totalDllsCotizacion;
      // this.arrcon[i].sacosTotales = this.sacosTotales;
      // this.arrcon[i].pesoTotal = this.pesoTotal;
      //this.barChartData[0].data.push(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}))
      
      if (this.monedaCotizacion=='Pesos'){
        // console.log(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}));
  
        this.barChartDataCotizacion[0].data.push(this.arrconCotizacion[i].TotalMXN);
        this.barChartDataCotizacion[0].label = 'Pedidos MXN'
      }else if (this.monedaCotizacion=='Dolares'){
        console.log(this.arrconCotizacion[i].TotalDLLS.toLocaleString("en-US",{style:"currency", currency:"USD"}));
        this.barChartDataCotizacion[0].data.push(this.arrconCotizacion[i].TotalDLLS)
        this.barChartDataCotizacion[0].label = 'Pedidos USD'
      }
      // this.barChartData[1].data.push(this.arrcon[i].TotalDLLS)/*  */
       
    }else{
      this.iniciarTotalesCotizacion();
      
    }
    })
  }



}
