import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';
import { PagoscxpService } from '../../../../services/cuentasxpagar/pagoscxp.service';

@Component({
  selector: 'app-cxp-pagos-totales',
  templateUrl: './cxp-pagos-totales.component.html',
  styleUrls: ['./cxp-pagos-totales.component.css']
})
export class CxpPagosTotalesComponent implements OnInit {

  constructor(public pagosService: PagoscxpService) { }

  arrcon: Array<any> = [];
  reporteTipoDocumento: any;
  total: number;



  /* GRAFICAS */
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
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
 

  public listTipoDocumentoPago = [
    { tipo: 'Compra Administrativa' },
    { tipo: 'Compra Materia Prima' },
    { tipo: 'Flete' },
    { tipo: 'Comision' }
  ];

  ngOnInit() {
    this.checked = 'True'
    this.tipoDocumento = 'Todos'
    this.ver();

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



  reporte(){

      this.barChartLabels = []; 
      console.log(this.listTipoDocumentoPago);
      for (let i=0; i<this.listTipoDocumentoPago.length;i++){
        // console.log(this.listTipoDocumentoPago[i].tipo);
        if(this.listTipoDocumentoPago[i].tipo == 'Compra Administrativa'){
this.listTipoDocumentoPago[i].tipo = 'CAdministrativa';
        }if(this.listTipoDocumentoPago[i].tipo == 'Compra Materia Prima'){
          this.listTipoDocumentoPago[i].tipo = 'CMateriaPrima';
        }
        if(this.tipoDocumento == 'Todos'){
          this.barChartLabels.push(this.listTipoDocumentoPago[i].tipo);    
        }else if(this.tipoDocumento==this.listTipoDocumentoPago[i].tipo) {
          this.barChartLabels.push(this.listTipoDocumentoPago[i].tipo);  
        }
      }
      // console.log(this.barChartLabels.length);
      
      //this.obtenerReporte(this.barChartLabels.length, this.listaproveedores);
      this.arrcon = [];
       this.filtroGeneral(this.listTipoDocumentoPago.length, this.listTipoDocumentoPago);
  }



  // obtenerReporte(numero: number, data: any) {
  //   this.arrcon = []; 
    
  //     // ningun filtro (solo buscar por administrativo / materia prima)
      
  //         this.filtroGeneral(numero , data, 'Ambas');
      
  //     //buscar reporte por Tipo de Compra y por Fechas
     
    
  // }

  iniciarTotales(){
    this.total = 0;
  }


  filtroGeneral(numero, data){
    console.log(data);
    
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
       //Obtener Reportes por Id Proveedor
       this.datosPago(data,i);

}
 
  
  }

  // cambio(event){
  //   this.moneda = event.value;
  //   console.log(this.moneda);
  //   this.ver()
  // }


  reportepago(event){    
    console.log(event);
if(event.isUserInput){

  this.tipoDocumento = [];
  this.tipoDocumento.push(event.source.value)
  // this.ver();
  //this.filtroGeneral(1,this.proveedor,"Ambas")
  this.barChartLabels = []; 
  this.barChartLabels.push(this.tipoDocumento[0].tipo)
  this.barChartData[0].data = [];
  this.datosPago(this.tipoDocumento, 0 );
}

    
  }

  tipoPago(event){
    console.log(event.checked);
    this.tipoDocumento = 'Todos'
    if (event.checked){
      this.ver();
    }
  }


  datosPago(data,i){
    console.log(data);
    this.pagosService.getReporteTipoDocumento(data[i].tipo).subscribe(dataReporte => {
      console.log(dataReporte);
      this.iniciarTotales();
      if(dataReporte.length>0){
        console.log(dataReporte);
        for (let l = 0; l < dataReporte.length; l++) {
          
            console.log('AMBOSSS');
            this.total = this.total + +dataReporte[l].Cantidad;                
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
        
        this.arrcon[i].Cantidad = this.total;



        // console.log(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}));
  
        this.barChartData[0].data.push(this.arrcon[i].Cantidad);
        this.barChartData[0].label = 'Pagos'
    
       
    }
    })
  }




}
