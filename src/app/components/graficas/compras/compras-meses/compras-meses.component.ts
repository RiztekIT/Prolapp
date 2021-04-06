import { Component, OnInit, ViewChild } from '@angular/core';
import { CompraService } from 'src/app/services/compras/compra.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { getDate, getMonth } from 'date-fns';
// import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compras-meses',
  templateUrl: './compras-meses.component.html',
  styleUrls: ['./compras-meses.component.css']
})
export class ComprasMesesComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(public comprasService: CompraService) { }

  arrcon: Array<any> = [];
  reporteProveedor: any;
  total: number;
  totalDlls:number;
  pesoTotal: number;
  sacosTotales: number


  /* GRAFICAS */
  public barChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  // public lineChartPlugins = [pluginAnnotations];
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


  totalEnero;
  totalFebrero;
  totalMarzo;
  totalAbril;
  totalMayo;
  totalJunio;
  totalJulio;
  totalAgosto;
  totalSeptiembre;
  totalOctubre;
  totalNoviembre;
  totalDiciembre;

  totalEneroDlls;
  totalFebreroDlls;
  totalMarzoDlls;
  totalAbrilDlls;
  totalMayoDlls;
  totalJunioDlls;
  totalJulioDlls;
  totalAgostoDlls;
  totalSeptiembreDlls;
  totalOctubreDlls;
  totalNoviembreDlls;
  totalDiciembreDlls;
  

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
    
    //this.barChartData[0].data[0] = [];

    
    this.reporte();
    
    
  }
subs1: Subscription
  reporte(){
   this.subs1 = this.comprasService.getProveedoresList().subscribe(dataProveedores => {
      console.log(dataProveedores);  
      // this.barChartLabels = []; 
      this.listaproveedores=dataProveedores;
  
      for (let i=0; i<dataProveedores.length;i++){

        if(this.proveedor == 'Todos'){
          

          // this.barChartLabels.push(dataProveedores[i].Nombre);    
        }else if(this.proveedor==dataProveedores[i].Nombre) {
          // this.barChartLabels.push(dataProveedores[i].Nombre);  
          

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


  this.totalEnero= 0  ;
  this.totalFebrero= 0  ;
  this.totalMarzo= 0  ;
  this.totalAbril= 0  ;
  this.totalMayo= 0  ;
  this.totalJunio= 0  ;
  this.totalJulio= 0  ;
  this.totalAgosto= 0  ;
  this.totalSeptiembre= 0  ;
  this.totalOctubre= 0  ;
  this.totalNoviembre= 0  ;
  this.totalDiciembre= 0  ;

  this.totalEneroDlls= 0  ;
  this.totalFebreroDlls= 0  ;
  this.totalMarzoDlls= 0  ;
  this.totalAbrilDlls= 0  ;
  this.totalMayoDlls= 0  ;
  this.totalJunioDlls= 0  ;
  this.totalJulioDlls= 0  ;
  this.totalAgostoDlls= 0  ;
  this.totalSeptiembreDlls= 0  ;
  this.totalOctubreDlls= 0  ;
  this.totalNoviembreDlls= 0  ;
  this.totalDiciembreDlls= 0  ;
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
  //this.barChartLabels = []; 
  //this.barChartLabels.push(this.proveedor[0].Nombre)
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
            // console.log(getMonth(dataReporte[l].FechaElaboracion.substring(0,10)))
            let fecha = new Date(dataReporte[l].FechaElaboracion)
            let mes = fecha.getMonth();

            if ( mes == 0){
              this.totalEnero = this.totalEnero + +dataReporte[l].Total;
              this.totalEneroDlls = this.totalEneroDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 1){
              this.totalFebrero = this.totalFebrero + +dataReporte[l].Total;
              this.totalFebreroDlls = this.totalFebreroDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 2){
              this.totalMarzo = this.totalMarzo + +dataReporte[l].Total;
              this.totalMarzoDlls = this.totalMarzoDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 3){
              this.totalAbril = this.totalAbril + +dataReporte[l].Total;
              this.totalAbrilDlls = this.totalAbrilDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 4){
              this.totalMayo = this.totalMayo + +dataReporte[l].Total;
              this.totalMayoDlls = this.totalMayoDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 5){
              this.totalJunio = this.totalJunio + +dataReporte[l].Total;
              this.totalJunioDlls = this.totalJunioDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 6){
              this.totalJulio = this.totalJulio + +dataReporte[l].Total;
              this.totalJulioDlls = this.totalJulioDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 7){
              this.totalAgosto = this.totalAgosto + +dataReporte[l].Total;
              this.totalAgostoDlls = this.totalAgostoDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 8){
              this.totalSeptiembre = this.totalSeptiembre + +dataReporte[l].Total;
              this.totalSeptiembreDlls = this.totalSeptiembreDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 9){
              this.totalOctubre = this.totalOctubre + +dataReporte[l].Total;
              this.totalOctubreDlls = this.totalOctubreDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 10){
              this.totalNoviembre = this.totalNoviembre + +dataReporte[l].Total;
              this.totalNoviembreDlls = this.totalNoviembreDlls + +dataReporte[l].TotalDlls;
            }
            if ( mes == 11){
              this.totalDiciembre = this.totalDiciembre + +dataReporte[l].Total;
              this.totalDiciembreDlls = this.totalDiciembreDlls + +dataReporte[l].TotalDlls;
            }



            // console.log(getMonth(dataReporte[l].FechaElaboracion))
         /*    this.total = this.total + +dataReporte[l].Total;          
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;          
                
            this.arrcon[i].Docs.push(dataReporte[l]); */
          }
        
       /*  this.arrcon[i].TotalMXN = this.total;
        this.arrcon[i].TotalDLLS = this.totalDlls;
      this.arrcon[i].sacosTotales = this.sacosTotales;
      this.arrcon[i].pesoTotal = this.pesoTotal; */
      //this.barChartData[0].data.push(this.arrcon[i].TotalMXN.toLocaleString("en-US",{style:"currency", currency:"USD"}))
      
   /*    if (this.moneda=='Pesos'){
        
  
        this.barChartData[0].data.push(this.arrcon[i].TotalMXN);
        this.barChartData[0].label = 'Compras MXN'
      }else if (this.moneda=='Dolares'){
        
        this.barChartData[0].data.push(this.arrcon[i].TotalDLLS)
        this.barChartData[0].label = 'Compras USD'
      } */
      if (this.moneda=='Pesos'){
        this.barChartData[0].label = 'Compras MXN'
      this.barChartData[0].data[0] = this.totalEnero
      this.barChartData[0].data[1] = this.totalFebrero
      this.barChartData[0].data[2] = this.totalMarzo
      this.barChartData[0].data[3] = this.totalAbril
      this.barChartData[0].data[4] = this.totalMayo
      this.barChartData[0].data[5] = this.totalJunio
      this.barChartData[0].data[6] = this.totalJulio
      this.barChartData[0].data[7] = this.totalAgosto
      this.barChartData[0].data[8] = this.totalSeptiembre
      this.barChartData[0].data[9] = this.totalOctubre
      this.barChartData[0].data[10] = this.totalNoviembre
      this.barChartData[0].data[11] = this.totalDiciembre
      }
      else if (this.moneda=='Dolares'){
        this.barChartData[0].label = 'Compras USD'
        this.barChartData[0].data[0] = this.totalEneroDlls
        this.barChartData[0].data[1] = this.totalFebreroDlls
        this.barChartData[0].data[2] = this.totalMarzoDlls
        this.barChartData[0].data[3] = this.totalAbrilDlls
        this.barChartData[0].data[4] = this.totalMayoDlls
        this.barChartData[0].data[5] = this.totalJunioDlls
        this.barChartData[0].data[6] = this.totalJulioDlls
        this.barChartData[0].data[7] = this.totalAgostoDlls
        this.barChartData[0].data[8] = this.totalSeptiembreDlls
        this.barChartData[0].data[9] = this.totalOctubreDlls
        this.barChartData[0].data[10] = this.totalNoviembreDlls
        this.barChartData[0].data[11] = this.totalDiciembreDlls
      }
      this.chart.update();
      // this.barChartData[1].data.push(this.arrcon[i].TotalDLLS)/*  */
       
    }else{
      this.iniciarTotales();
      
    }
    })
  }


  public randomize(): void {
    
      for (let j = 0; j < this.barChartData[0].data.length; j++) {
        this.barChartData[0].data[j] = this.generateNumber(j);
      }
    
    this.chart.update();
  }
  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

}
