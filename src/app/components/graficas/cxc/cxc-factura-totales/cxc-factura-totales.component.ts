import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ClientesService } from '../../../../services/catalogos/clientes.service';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';

@Component({
  selector: 'app-cxc-factura-totales',
  templateUrl: './cxc-factura-totales.component.html',
  styleUrls: ['./cxc-factura-totales.component.css']
})
export class CxcFacturaTotalesComponent implements OnInit {

  constructor(public clientesService: ClientesService, public facturaService: FacturaService) { }

  ngOnInit() {
    this.moneda = 'MX'
    this.checked = 'True'
    this.Cliente = 'Todos'
    this.verReporte();
  }
  
  arrcon: Array<any> = [];
  
  total: number;
  totalDlls: number;
  // kilogramos:number;
  
  moneda;
  checked;
  Cliente;
  listaClientes;
  
  
   /* GRAFICAS */
   public barChartLabels: Label[] = [];
   public barChartType: ChartType = 'bar';
   public barChartLegend = true;
  
   public barChartData: ChartDataSets[] = [
     { data: [], label: 'Cobranza' },    
     
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
    scales: { xAxes: [{}], yAxes: [{ticks: {
      callback: function(value, index, values) {
        return value.toLocaleString("en-US",{  });
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
  
  
  iniciarTotales(){
    this.total = 0;
    this.totalDlls = 0;
    // this.kilogramos = 0;
  }
  
  cambio(event){
    this.moneda = event.value;
    this.verReporte()
  }
  
  
  verReporte(){
    this.barChartData[0].data = [];
    this.reporte(); 
  }
  
  
  
  reporte(){
    this.clientesService.getClientesList().subscribe(dataClientes => {
      // console.clear();
      console.log(dataClientes);  
      this.barChartLabels = []; 
      this.listaClientes=dataClientes;

      let numeroCliente;
  
      for (let i=0; i< dataClientes.length ;i++){
      // for (let i=0; i<dataClientes.length;i++){
  
        if(this.Cliente == 'Todos'){
          if(i <=5 ){
            this.barChartLabels.push(dataClientes[i].Nombre);    
          }
        }else if(this.Cliente[0].Nombre==dataClientes[i].Nombre) {
          console.log(this.Cliente[0]);
          this.barChartLabels.push(this.Cliente[0].Nombre);  
        }
  
      }
      if(this.Cliente == 'Todos'){
        this.obtenerReporte(dataClientes.length, dataClientes);
      }else{
        this.obtenerReporte(this.Cliente.length, this.Cliente);
      }
    })
  }
  
  obtenerReporte(numero: number, data: any) {
      this.arrcon = []; 
      for (let i = 0; i < numero; i++) {
        this.arrcon[i] = data[i];
        this.arrcon[i].Docs = [];      
        this.datosCliente(data,i);      
      }
  }
  
  
  
  
  
  reporteCliente(event){    
    console.log(event);
  if(event.isUserInput){
  
  this.Cliente= [];
  this.Cliente.push(event.source.value)
  this.barChartLabels = []; 
  this.barChartLabels.push(this.Cliente[0].Nombre)
  this.barChartData[0].data = [];
  this.datosCliente(this.Cliente,0);
  }
  }
  
  
  tipoCliente(event){
    console.log(event.checked);
    this.Cliente = 'Todos'
    if (event.checked){
      this.verReporte();
    }
  }
  
  
  datosCliente(data,i){

    // console.log(data);
    this.facturaService.getFacturasFechasReporte(data[i].IdClientes, '01-01-10', '10-12-20').subscribe(dataReporte => {
      // console.log(dataReporte);
      if(dataReporte.length>0){
        console.log(dataReporte);
        this.iniciarTotales();
        for (let l = 0; l < dataReporte.length; l++) {
            this.total= this.total + +dataReporte[l].Total;          
            this.totalDlls= this.totalDlls + +dataReporte[l].TotalDlls;          
            // this.kilogramos = this.kilogramos + +dataReporte[l].Kg;                 
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
        
        this.arrcon[i].total = this.total;
        this.arrcon[i].totalDlls = this.totalDlls;
        // this.arrcon[i].kilogramos = this.kilogramos;
      
      if (this.moneda=='MX'){
        this.barChartData[0].data.push(this.arrcon[i].total);
        this.barChartData[0].label = 'Factura Mx'
      }else if (this.moneda=='DLLS'){
        this.barChartData[0].data.push(this.arrcon[i].totalDlls);
        this.barChartData[0].label = 'Factura Dlls'
      }
  
       
    }else{
      this.iniciarTotales();
      
    }
    })
  }
}
