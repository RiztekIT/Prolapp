import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import { OrdenDescargaService } from '../../../../services/almacen/orden-descarga/orden-descarga.service';
import { ProveedoresService } from '../../../../services/catalogos/proveedores.service';
import { Proveedor } from '../../../../Models/catalogos/proveedores-model';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-almacen-orden-descarga-totales',
  templateUrl: './almacen-orden-descarga-totales.component.html',
  styleUrls: ['./almacen-orden-descarga-totales.component.css']
})
export class AlmacenOrdenDescargaTotalesComponent implements OnInit {

 
  constructor(public odService: OrdenDescargaService, public proveedorService: ProveedoresService,) { 


  }
  ngOnInit() {
    this.informacion = 'Kg'
    this.checked = 'True'
    this.Proveedor = 'Todos'
    this.verReporte();
  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    if(this.subs2){
      this.subs2.unsubscribe();
    }
  }

  arrcon: Array<any> = [];

  sacos: number;
  kilogramos:number;

  informacion;
  checked;
  Proveedor;
listaProveedores;

 //^ Dropdown Proveedor
 proveedorSelect:  string="";
 myControl = new FormControl();
 filteredOptions: Observable<any[]>;
 options: Proveedor[] = [];



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


subs1: Subscription
  reporte(){
    this.subs1 = this.proveedorService.getProveedoresList().subscribe(dataProveedores => {
      console.clear();
      console.log(dataProveedores);  
      this.barChartLabels = []; 
      // this.listaProveedores=dataProveedores;
      this.options = [];
      this.listaProveedores = [];
  
      for (let i=0; i<dataProveedores.length;i++){
      // for (let i=0; i<dataClientes.length;i++){

        let Proveedor = dataProveedores[i];
        this.listaProveedores.push(Proveedor);
        this.options.push(Proveedor)
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

        if(this.Proveedor == 'Todos'){
          

          // this.barChartLabels.push(dataProveedores[i].Nombre);    
        }else if(this.Proveedor==dataProveedores[i].Nombre) {
          this.barChartLabels.push(dataProveedores[i].Nombre);  
          

        }

      }
      // console.log(this.barChartLabels.length);
       this.obtenerReporte(dataProveedores.length, dataProveedores);
    })
  }

  private _filter(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.options.filter(option =>  option.Nombre.toString().toLowerCase().includes(filterValue2));
    } else if (typeof (value) == 'number') {
      const filterValue2 = value.toString();
      return this.options.filter(option =>   option.Nombre.toString().includes(filterValue2));
    }


  }

  obtenerReporte(numero: number, data: any) {
    this.arrcon = []; 
          // this.filtroGeneral(numero , data, 'Ambas')
          for (let i = 0; i < numero; i++) {
            this.arrcon[i] = data[i];
            this.arrcon[i].Docs = [];      
             this.datosProveedor(data,i);      
      }
  }




 
  reporteProveedor(event){    
    console.log(event);
if(event.isUserInput){

  this.Proveedor= [];
  this.Proveedor.push(event.source.value)
  this.proveedorSelect = event.source.value.Nombre;
  // this.ver();
  //this.filtroGeneral(1,this.proveedor,"Ambas")
  this.barChartLabels = []; 
  // this.barChartLabels.push(this.Proveedor[0].Nombre)
  this.barChartData[0].data = [];
  this.datosProveedor(this.Proveedor,0);
}
  }


  tipoProveedor(event){
    console.log(event.checked);
    this.Proveedor = 'Todos'
    this.proveedorSelect = "";
    if (event.checked){
      this.verReporte();
    }
  }

subs2: Subscription
  datosProveedor(data,i){
    console.log(data);
   this.subs2 = this.odService.getReporteProveedorId(data[i].IdProveedor).subscribe(dataReporte => {
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
        this.barChartData[0].label = 'Orden Descarga Sacos'
        this.barChartLabels.push(data[i].Nombre); 
      }else if (this.informacion=='Kg'){
        // console.log(this.arrcon[i].TotalDLLS.toLocaleString("en-US",{style:"currency", currency:"USD"}));
        this.barChartData[0].data.push(this.arrcon[i].kilogramos)
        this.barChartData[0].label = 'Orden Descarga Kilogramos'
        this.barChartLabels.push(data[i].Nombre); 
      }
      // this.barChartData[1].data.push(this.arrcon[i].TotalDLLS)/*  */
       
    }else{
      this.iniciarTotales();
      
    }
    })
  }
}
