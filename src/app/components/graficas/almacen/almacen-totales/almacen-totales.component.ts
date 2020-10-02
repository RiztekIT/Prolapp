import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';

@Component({
  selector: 'app-almacen-totales',
  templateUrl: './almacen-totales.component.html',
  styleUrls: ['./almacen-totales.component.css']
})
export class AlmacenTotalesComponent implements OnInit {

  constructor(public ocService: OrdenCargaService, public pedidoService: VentasPedidoService,) { 


  }
  ngOnInit() {
    this.informacion = 'Kg'
    this.checked = 'True'
    this.Cliente = 'Todos'
    this.verReporte();
  }

  arrcon: Array<any> = [];

  sacos: number;
  kilogramos:number;

  informacion;
  checked;
  Cliente;
  listaClientes;


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
    this.sacos = 0;
    this.kilogramos = 0;
  }

  cambio(event){
    this.informacion = event.value;
    // console.log(this.moneda);
    this.verReporte()
  }
 

  verReporte(){
    this.barChartData[0].data = [];
    this.reporte(); 
  }



  reporte(){
    this.pedidoService.getDepDropDownValues().subscribe(dataClientes => {
      console.log(dataClientes);  
      this.barChartLabels = []; 
      this.listaClientes=dataClientes;
  
      for (let i=0; i<5;i++){
      // for (let i=0; i<dataClientes.length;i++){

        if(this.Cliente == 'Todos'){
          

          this.barChartLabels.push(dataClientes[i].Nombre);    
        }else if(this.Cliente==dataClientes[i].Nombre) {
          this.barChartLabels.push(dataClientes[i].Nombre);  
          

        }

      }
      // console.log(this.barChartLabels.length);
       this.obtenerReporte(dataClientes.length, dataClientes);
    })
  }

  obtenerReporte(numero: number, data: any) {
    this.arrcon = []; 
          // this.filtroGeneral(numero , data, 'Ambas')
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
  // this.ver();
  //this.filtroGeneral(1,this.proveedor,"Ambas")
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
    console.log(data);
    this.ocService.getReporteClienteId(data[i].IdClientes).subscribe(dataReporte => {
      console.log(dataReporte);
      if(dataReporte.length>0){
        console.log(dataReporte);
        this.iniciarTotales();
        for (let l = 0; l < dataReporte.length; l++) {
            this.sacos= this.sacos + +dataReporte[l].Sacos;          
            this.kilogramos = this.kilogramos + +dataReporte[l].Kg;          
            // this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;          
            // this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;          
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
        
        this.arrcon[i].sacos = this.sacos;
        this.arrcon[i].kilogramos = this.kilogramos;
      // this.arrcon[i].sacosTotales = this.sacosTotales;
      // this.arrcon[i].pesoTotal = this.pesoTotal;
      //this.barChartData[0].data.push(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}))
      
      if (this.informacion=='Sacos'){
        // console.log(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}));
  
        this.barChartData[0].data.push(this.arrcon[i].sacos);
        this.barChartData[0].label = 'Orden Carga Sacos'
      }else if (this.informacion=='Kg'){
        // console.log(this.arrcon[i].TotalDLLS.toLocaleString("en-US",{style:"currency", currency:"USD"}));
        this.barChartData[0].data.push(this.arrcon[i].kilogramos)
        this.barChartData[0].label = 'Orden Carga Kilogramos'
      }
      // this.barChartData[1].data.push(this.arrcon[i].TotalDLLS)/*  */
       
    }else{
      this.iniciarTotales();
      
    }
    })
  }

}
