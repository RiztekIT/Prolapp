import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { DocumentosImportacionService } from '../../../../services/importacion/documentos-importacion.service';
import { CompraService } from '../../../../services/compras/compra.service';
import { OrdenDescargaService } from '../../../../services/almacen/orden-descarga/orden-descarga.service';

@Component({
  selector: 'app-importacion-totales',
  templateUrl: './importacion-totales.component.html',
  styleUrls: ['./importacion-totales.component.css']
})
export class ImportacionTotalesComponent implements OnInit {

  constructor(public documentosService: DocumentosImportacionService, public compraService: CompraService, public ordenDescargaService: OrdenDescargaService) { }

  ngOnInit() {
    this.tipoDocumento = 'Compras';

    this.verDocumento();

  }

  //variables 
  arrconDocumento: Array<any> = [];
  tipoDocumento;



  /* GRAFICAS */
  public barChartLabelsDocumento: Label[] = [];

  public barChartTypeDocumento: ChartType = 'bar';

  public barChartLegendDocumento = true;


  public barChartDataDocumento: ChartDataSets[] = [
    { data: [], label: 'Documentos' },

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

  public barChartOptionsDocumento: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return value.toLocaleString("en-US", {});
          },
          beginAtZero: true

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

  //^ Desde aqui se obtienen los datos de la grafica
  verDocumento() {
    this.barChartDataDocumento[0].data = [];
    this.obtenerReporteDocumento();
  }

  obtenerReporteDocumento() {

    this.barChartLabelsDocumento = [];
    this.barChartDataDocumento[0].data = [];

    //^ Verificar con que tipo de Documento se llenara la grafica
    if(this.tipoDocumento == 'Compras'){
      //^ Obtener Compras Terminadas
      this.compraService.getCompraEstatus('Terminada').subscribe(dataCompra=>{
        console.log(dataCompra);
        if(dataCompra.length>0){
          let cantidadDocumentos = 0
          let arrayLength = dataCompra.length;
          if(dataCompra.length > 5){
            arrayLength = 5;
          }
          for (let i = 0; i < arrayLength; i++) {
            this.barChartLabelsDocumento.push('Compra Folio: ' + dataCompra[i].Folio)
          this.documentosService.getDocumentoFolioTipoModulo(dataCompra[i].Folio, 'Compras', 'Importacion').subscribe(resDocumento=>{
            console.log(resDocumento);
            if(resDocumento.length>0){
              cantidadDocumentos = cantidadDocumentos + +resDocumento.length;
              console.log(cantidadDocumentos);
              this.barChartDataDocumento[0].data.push(cantidadDocumentos);
                    this.barChartDataDocumento[0].label = 'Total Documentos Compras';
            }
          })
          }          
        }
      });
    }else if(this.tipoDocumento == 'OrdenDescarga'){
      //^ Obtener Ordenes de Descarga Terminadas
      this.documentosService.getOrdenesDescargadas().subscribe(dataOrden=>{
        console.log(dataOrden);
        if(dataOrden.length>0){
          let cantidadDocumentos = 0;
          let arrayLength = dataOrden.length;
          if(dataOrden.length > 5){
            arrayLength = 5;
          }
          for (let i = 0; i < arrayLength; i++) {
            this.barChartLabelsDocumento.push('Orden Folio: ' + dataOrden[i].Folio)
          this.documentosService.getDocumentoFolioTipoModulo(dataOrden[i].Folio, 'OrdenDescarga', 'Importacion').subscribe(resDocumento=>{
            console.log(resDocumento);
            if(resDocumento.length>0){
              cantidadDocumentos = cantidadDocumentos + +resDocumento.length;
              console.log(cantidadDocumentos);
              this.barChartDataDocumento[0].data.push(cantidadDocumentos);
                    this.barChartDataDocumento[0].label = 'Total Documentos Orden Descarga';
            }
          })
          }          
        }
      })
    }

  }


  cambioDocumento(event) {
    this.tipoDocumento = event.value;
    this.verDocumento()
  }


}
