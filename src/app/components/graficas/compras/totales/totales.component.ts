import { Component, OnInit } from '@angular/core';
import { CompraService } from 'src/app/services/compras/compra.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compras-totales',
  templateUrl: './totales.component.html',
  styleUrls: ['./totales.component.css']
})
export class TotalesComponent implements OnInit {

  constructor(public comprasService: CompraService) { }
  arrcon: Array<any> = [];
  reporteProveedor: any;
  total: number;
  totalDlls:number;
  pesoTotal: number;
  sacosTotales: number


  /* GRAFICAS */
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Compras' },    
    
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
  moneda;
  checked;
  proveedor;
  listaproveedores;

  ngOnInit() {
    this.moneda = 'Pesos'
    this.checked = 'True'
    this.proveedor = 'Todos'
    this.ver();

  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    if(this.subs2){
      this.subs2.unsubscribe();
    }
  }

  public barChartOptions: ChartOptions = {
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

/*   public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
    console.log(this.barChartData);
  } */
  /*  */

  ver(){
    this.barChartData[0].data = [];
    
    this.reporte();
    
    
  }
subs1: Subscription
  reporte(){
   this.subs1 = this.comprasService.getProveedoresList().subscribe(dataProveedores => {
      console.log(dataProveedores);  
      this.barChartLabels = []; 
      this.listaproveedores=dataProveedores;
  
      for (let i=0; i<dataProveedores.length;i++){

        if(this.proveedor == 'Todos'){
          

          this.barChartLabels.push(dataProveedores[i].Nombre);    
        }else if(this.proveedor==dataProveedores[i].Nombre) {
          this.barChartLabels.push(dataProveedores[i].Nombre);  
          

        }

      }
      console.log(this.barChartLabels.length);
      
      //this.obtenerReporte(this.barChartLabels.length, this.listaproveedores);
       this.obtenerReporte(dataProveedores.length, dataProveedores);
    })
  }



  obtenerReporte(numero: number, data: any) {
    this.arrcon = []; 
    
      // ningun filtro (solo buscar por administrativo / materia prima)
      
          this.filtroGeneral(numero , data, 'Ambas');
      
      //buscar reporte por Tipo de Compra y por Fechas
     
    
  }

  iniciarTotales(){
    this.total = 0;
    this.totalDlls = 0;
    this.pesoTotal = 0;
    this.sacosTotales = 0;
  }


  filtroGeneral(numero, data, tipoReporte){
    console.log(data);
    
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
       //Obtener Reportes por Id Proveedor

       this.datosProveedor(data,i);

}
 
  
  }

  cambio(event){
    this.moneda = event.value;
    console.log(this.moneda);
    this.ver()
  }


  reporteproveedor(event){    
    console.log(event);
if(event.isUserInput){

  this.proveedor = [];
  this.proveedor.push(event.source.value)
  // this.ver();
  //this.filtroGeneral(1,this.proveedor,"Ambas")
  this.barChartLabels = []; 
  this.barChartLabels.push(this.proveedor[0].Nombre)
  this.barChartData[0].data = [];
  this.datosProveedor(this.proveedor,0);
}

    
  }

  tipoproveedor(event){
    console.log(event.checked);
    this.proveedor = 'Todos'
    if (event.checked){
      this.ver();
    }
  }

subs2: Subscription
  datosProveedor(data,i){
    console.log(data);
  this.subs2 =  this.comprasService.getReporteProveedorId(data[i].IdProveedor).subscribe(dataReporte => {
      console.log(dataReporte);
      if(dataReporte.length>0){
        console.log(dataReporte);
        this.iniciarTotales();
        for (let l = 0; l < dataReporte.length; l++) {
          
            console.log('AMBOSSS');
            this.total = this.total + +dataReporte[l].Total;          
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;          
            this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;          
            this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;          
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
        
        this.arrcon[i].TotalMXN = this.total;
        this.arrcon[i].TotalDLLS = this.totalDlls;
      this.arrcon[i].sacosTotales = this.sacosTotales;
      this.arrcon[i].pesoTotal = this.pesoTotal;
      //this.barChartData[0].data.push(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}))
      
      if (this.moneda=='Pesos'){
        console.log(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}));
  
        this.barChartData[0].data.push(this.arrcon[i].TotalMXN);
        this.barChartData[0].label = 'Compras MXN'
      }else if (this.moneda=='Dolares'){
        console.log(this.arrcon[i].TotalDLLS.toLocaleString("en-US",{style:"currency", currency:"USD"}));
        this.barChartData[0].data.push(this.arrcon[i].TotalDLLS)
        this.barChartData[0].label = 'Compras USD'
      }
      // this.barChartData[1].data.push(this.arrcon[i].TotalDLLS)/*  */
       
    }else{
      this.iniciarTotales();
      
    }
    })
  }






}
