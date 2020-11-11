import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';

@Component({
  selector: 'app-cxc-cobranza-meses',
  templateUrl: './cxc-cobranza-meses.component.html',
  styleUrls: ['./cxc-cobranza-meses.component.css']
})
export class CxcCobranzaMesesComponent implements OnInit {

  constructor(public pedidoService: VentasPedidoService, public facturaService: FacturaService) { }

  ngOnInit() {
    this.informacion = 'Mx'
    this.checked = 'True'
    this.Cliente = 'Todos'
    this.reporte();
  }

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  arrcon: Array<any> = [];
  total: number;
  totalDlls:number;


  informacion;
  checked;
  Cliente;
  listaClientes;

 

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


  reporte(){
    this.pedidoService.getDepDropDownValues().subscribe(dataClientes => {
      console.log(dataClientes);  
      this.listaClientes=dataClientes;
       this.obtenerReporte(dataClientes.length, dataClientes);
    })
  }



  iniciarTotales(){
    this.total = 0;
    this.totalDlls = 0;
  
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

  obtenerReporte(numero: number, data: any) {
    this.arrcon = []; 
          for (let i = 0; i < numero; i++) {
            this.arrcon[i] = data[i];
            this.arrcon[i].Docs = [];      
             this.datosCliente(data,i);      
      }
  }


  cambio(event){
    this.informacion = event.value;
    this.reporte()
  }

datosCliente(data,i){
  console.log(data);
  this.facturaService.getReportes(data[i].IdClientes).subscribe(dataReporte => {
    console.log(dataReporte);
    if(dataReporte.length>0){
      console.log(dataReporte);
      this.iniciarTotales();
      for (let l = 0; l < dataReporte.length; l++) {
      

          let fecha = new Date(dataReporte[l].FechaDeExpedicion)
          let mes = fecha.getMonth();

          if ( mes == 0){
            this.totalEneroDlls = this.totalEneroDlls + +dataReporte[l].TotalDlls;
            this.totalEnero = this.totalEnero + +dataReporte[l].Total;
          }
          if ( mes == 1){
            this.totalFebreroDlls = this.totalFebreroDlls + +dataReporte[l].TotalDlls;
            this.totalFebrero = this.totalFebrero + +dataReporte[l].Total;
          }
          if ( mes == 2){
            this.totalMarzoDlls = this.totalMarzoDlls + +dataReporte[l].TotalDlls;
            this.totalMarzo = this.totalMarzo + +dataReporte[l].Total;
          }
          if ( mes == 3){
            this.totalAbrilDlls = this.totalAbrilDlls + +dataReporte[l].TotalTotal;
            this.totalAbril = this.totalAbril + +dataReporte[l].Total;
          }
          if ( mes == 4){
            this.totalMayoDlls = this.totalMayoDlls + +dataReporte[l].TotalDlls;
            this.totalMayo = this.totalMayo + +dataReporte[l].Total;
          }
          if ( mes == 5){
            this.totalJunioDlls = this.totalJunioDlls+ +dataReporte[l].TotalDlls;
            this.totalJunio = this.totalJunio + +dataReporte[l].Total;
          }
          if ( mes == 6){
            this.totalJulioDlls = this.totalJulioDlls + +dataReporte[l].TotalDlls;
            this.totalJulio = this.totalJulio + +dataReporte[l].Total;
          }
          if ( mes == 7){
            this.totalAgostoDlls = this.totalAgostoDlls + +dataReporte[l].TotalDlls;
            this.totalAgosto = this.totalAgosto + +dataReporte[l].Total;
          }
          if ( mes == 8){
            this.totalSeptiembreDlls = this.totalSeptiembreDlls + +dataReporte[l].TotalDlls;
            this.totalSeptiembre = this.totalSeptiembre + +dataReporte[l].Total;
          }
          if ( mes == 9){
            this.totalOctubreDlls = this.totalOctubreDlls + +dataReporte[l].TotalDlls;
            this.totalOctubre = this.totalOctubre + +dataReporte[l].Total;
          }
          if ( mes == 10){
            this.totalNoviembreDlls = this.totalNoviembreDlls + +dataReporte[l].TotalDlls;
            this.totalNoviembre = this.totalNoviembre + +dataReporte[l].Total;
          }
          if ( mes == 11){
            this.totalDiciembreDlls = this.totalDiciembreDlls + +dataReporte[l].TotalDlls;
            this.totalDiciembre = this.totalDiciembre + +dataReporte[l].Total;
          }
        }
      
    if (this.informacion=='Dlls'){
      this.barChartData[0].label = 'Cobranza Dlls'
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
    else if (this.informacion=='Mx'){
      this.barChartData[0].label = 'Cobranza Mx'
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
    this.chart.update();
     
  }else{
    this.iniciarTotales();
    
  }
  })
}


}
