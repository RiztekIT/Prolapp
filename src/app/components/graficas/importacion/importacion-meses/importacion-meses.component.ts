import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective, Color } from 'ng2-charts';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { CompraService } from 'src/app/services/compras/compra.service';
import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

@Component({
  selector: 'app-importacion-meses',
  templateUrl: './importacion-meses.component.html',
  styleUrls: ['./importacion-meses.component.css']
})
export class ImportacionMesesComponent implements OnInit {

  constructor(public documentosService: DocumentosImportacionService, public compraService: CompraService, public ordenDescargaService: OrdenDescargaService) { }


  ngOnInit() {
    this.tipoDocumento = 'Compras';
    this.verDocumento();
  }

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  //variables 
  arrconDocumento: Array<any> = [];
  tipoDocumento;

    totalEneroDocumento;
    totalFebreroDocumento;
    totalMarzoDocumento;
    totalAbrilDocumento;
    totalMayoDocumento;
    totalJunioDocumento;
    totalJulioDocumento;
    totalAgostoDocumento;
    totalSeptiembreDocumento;
    totalOctubreDocumento;
    totalNoviembreDocumento;
    totalDiciembreDocumento;

  //Variables tipo Documento
  checked: boolean = true;
  Documento;

    public barChartOptions: (ChartOptions & { annotation: any }) = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{ticks: {
        callback: function(value, index, values) {
          return value.toLocaleString("en-US",{});
        },
        beginAtZero: true
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


    iniciarTotalesDocumento(){
   
    
    this.totalEneroDocumento= 0  ;
    this.totalFebreroDocumento= 0  ;
    this.totalMarzoDocumento= 0  ;
    this.totalAbrilDocumento= 0  ;
    this.totalMayoDocumento= 0  ;
    this.totalJunioDocumento= 0  ;
    this.totalJulioDocumento= 0  ;
    this.totalAgostoDocumento= 0  ;
    this.totalSeptiembreDocumento= 0  ;
    this.totalOctubreDocumento= 0  ;
    this.totalNoviembreDocumento= 0  ;
    this.totalDiciembreDocumento= 0  ;
  

    }

     //^ Variable para checar si seleccionaron todos los documentos
  tipoDocument(event) {
    // console.log(event.checked);
    this.Documento = 'Todos'
    if (event.checked) {
      this.verDocumento();
    }
  }

  reporteDocumento(event) {
    // console.log(event);
    if (event.isUserInput) {
      this.Documento = [];
      this.Documento.push(event.source.value)
      this.barChartDataDocumento[0].data = [];
      this.obtenerReporteDocumento();
    }
  }

   //^ Lista Documentos Mostrar
   public listaDocumentos: Array<Object> = [
    { tipo: 'Factura' },
    { tipo: 'Certificado Libre Venta' },
    { tipo: 'Certificado Origen' },
    { tipo: 'USDA' },
    { tipo: 'PESPI' },
    { tipo: 'Certificado Analisis' }
  ];

  //^ Lista Documentos por Clave
  public listaDocumentosClave: Array<any> = [
    { tipo: 'Factura' },
    { tipo: 'CLV' },
    { tipo: 'CO' },
    { tipo: 'USDA' },
    { tipo: 'PESPI' },
    { tipo: 'CA' }
  ];

     //^ Desde aqui se obtienen los datos de la grafica
  verDocumento() {
    this.barChartDataDocumento[0].data = [];
    this.iniciarTotalesDocumento();
    this.obtenerReporteDocumento();
  }

  obtenerReporteDocumento() {

   
    this.barChartDataDocumento[0].data = [];

    this.iniciarTotalesDocumento();

    //^ Verificar con que tipo de Documento se llenara la grafica
    // if(this.tipoDocumento == 'Compras'){
      //^ Obtener Compras Terminadas
      // this.compraService.getCompraEstatus('Terminada').subscribe(dataCompra=>{
        // console.log(dataCompra);
        // let arrayLength = dataCompra.length;
        // if(dataCompra.length > 5){
        //   arrayLength = 5;
        // }
        if(this.checked == true){
          let cantidadDocumentos = 0

          for (let i = 0; i < this.listaDocumentosClave.length; i++) {

            this.documentosService.getDocumentoTipoModulo(this.listaDocumentosClave[i].tipo, 'Importacion').subscribe(resDocumento => {
              // console.log(resDocumento);
              // if (resDocumento.length > 0) {
                // cantidadDocumentos = cantidadDocumentos + +resDocumento.length;
                // console.log(cantidadDocumentos);
                // this.barChartDataDocumento[0].data.push(cantidadDocumentos);
                // this.barChartDataDocumento[0].label = 'Total Documentos';
                
              // }
            // })

          // this.documentosService.getDocumentoFolioTipoModulo(dataCompra[i].Folio, 'Compras', 'Importacion').subscribe(resDocumento=>{
            console.log(resDocumento);
            if(resDocumento.length>0){
              cantidadDocumentos = cantidadDocumentos + +resDocumento.length;
              
              for (let i = 0; i < resDocumento.length; i++) {

              let fecha = new Date(resDocumento[0].Vigencia)
              let mes = fecha.getMonth();
  
              if ( mes == 0){
                this.totalEneroDocumento = this.totalEneroDocumento + 1;
                
              }
              if ( mes == 1){
                this.totalFebreroDocumento = this.totalFebreroDocumento + 1;
                
              }
              if ( mes == 2){
                this.totalMarzoDocumento = this.totalMarzoDocumento + 1;
                
              }
              if ( mes == 3){
                this.totalAbrilDocumento = this.totalAbrilDocumento + 1;
                
              }
              if ( mes == 4){
                this.totalMayoDocumento = this.totalMayoDocumento + 1;
                
              }
              if ( mes == 5){
                this.totalJunioDocumento = this.totalJunioDocumento + 1;
                
              }
              if ( mes == 6){
                this.totalJulioDocumento = this.totalJulioDocumento + 1;
                
              }
              if ( mes == 7){
                this.totalAgostoDocumento = this.totalAgostoDocumento + 1;
                
              }
              if ( mes == 8){
                this.totalSeptiembreDocumento = this.totalSeptiembreDocumento + 1;
                
              }
              if ( mes == 9){
                this.totalOctubreDocumento = this.totalOctubreDocumento + 1;
                
              }
              if ( mes == 10){
                this.totalNoviembreDocumento = this.totalNoviembreDocumento + 1;
                
              }
              if ( mes == 11){
                this.totalDiciembreDocumento = this.totalDiciembreDocumento + 1;
                
              }
 
          
     
          this.barChartDataDocumento[0].label = 'Documentos Compras'
        this.barChartDataDocumento[0].data[0] = this.totalEneroDocumento
        this.barChartDataDocumento[0].data[1] = this.totalFebreroDocumento
        this.barChartDataDocumento[0].data[2] = this.totalMarzoDocumento
        this.barChartDataDocumento[0].data[3] = this.totalAbrilDocumento
        this.barChartDataDocumento[0].data[4] = this.totalMayoDocumento
        this.barChartDataDocumento[0].data[5] = this.totalJunioDocumento
        this.barChartDataDocumento[0].data[6] = this.totalJulioDocumento
        this.barChartDataDocumento[0].data[7] = this.totalAgostoDocumento
        this.barChartDataDocumento[0].data[8] = this.totalSeptiembreDocumento
        this.barChartDataDocumento[0].data[9] = this.totalOctubreDocumento
        this.barChartDataDocumento[0].data[10] = this.totalNoviembreDocumento
        this.barChartDataDocumento[0].data[11] = this.totalDiciembreDocumento

            }

            }
          })
          }   
          // this.chart.update();       
        }else if(this.checked == false){

          let tipo: string = '';

      switch (this.Documento[0].tipo) {
        case "Factura":
          tipo = 'Factura';
          break;
        case "Certificado Libre Venta":
          tipo = 'CLV';
          break;
        case "Certificado Origen":
          tipo = 'CO';
          break;
        case "USDA":
          tipo = 'USDA';
          break;
        case "PESPI":
          tipo = 'PESPI';
          break;
        case "Certificado Analisis":
          tipo = 'CA';
          break;
      }

          let cantidadDocumentos = 0
          
            this.documentosService.getDocumentoTipoModulo(tipo, 'Importacion').subscribe(resDocumento => {
            console.log(resDocumento);
            if(resDocumento.length>0){
              cantidadDocumentos = cantidadDocumentos + +resDocumento.length;
              
              for (let i = 0; i < resDocumento.length; i++) {

              let fecha = new Date(resDocumento[0].Vigencia)
              let mes = fecha.getMonth();
  
              if ( mes == 0){
                this.totalEneroDocumento = this.totalEneroDocumento + 1;
                
              }
              if ( mes == 1){
                this.totalFebreroDocumento = this.totalFebreroDocumento + 1;
                
              }
              if ( mes == 2){
                this.totalMarzoDocumento = this.totalMarzoDocumento + 1;
                
              }
              if ( mes == 3){
                this.totalAbrilDocumento = this.totalAbrilDocumento + 1;
                
              }
              if ( mes == 4){
                this.totalMayoDocumento = this.totalMayoDocumento + 1;
                
              }
              if ( mes == 5){
                this.totalJunioDocumento = this.totalJunioDocumento + 1;
                
              }
              if ( mes == 6){
                this.totalJulioDocumento = this.totalJulioDocumento + 1;
                
              }
              if ( mes == 7){
                this.totalAgostoDocumento = this.totalAgostoDocumento + 1;
                
              }
              if ( mes == 8){
                this.totalSeptiembreDocumento = this.totalSeptiembreDocumento + 1;
                
              }
              if ( mes == 9){
                this.totalOctubreDocumento = this.totalOctubreDocumento + 1;
                
              }
              if ( mes == 10){
                this.totalNoviembreDocumento = this.totalNoviembreDocumento + 1;
                
              }
              if ( mes == 11){
                this.totalDiciembreDocumento = this.totalDiciembreDocumento + 1;
                
              }
 
          
     
          this.barChartDataDocumento[0].label = 'Documentos'
        this.barChartDataDocumento[0].data[0] = this.totalEneroDocumento
        this.barChartDataDocumento[0].data[1] = this.totalFebreroDocumento
        this.barChartDataDocumento[0].data[2] = this.totalMarzoDocumento
        this.barChartDataDocumento[0].data[3] = this.totalAbrilDocumento
        this.barChartDataDocumento[0].data[4] = this.totalMayoDocumento
        this.barChartDataDocumento[0].data[5] = this.totalJunioDocumento
        this.barChartDataDocumento[0].data[6] = this.totalJulioDocumento
        this.barChartDataDocumento[0].data[7] = this.totalAgostoDocumento
        this.barChartDataDocumento[0].data[8] = this.totalSeptiembreDocumento
        this.barChartDataDocumento[0].data[9] = this.totalOctubreDocumento
        this.barChartDataDocumento[0].data[10] = this.totalNoviembreDocumento
        this.barChartDataDocumento[0].data[11] = this.totalDiciembreDocumento

            }

            }
          })
             
          // this.chart.update();
        }
      // });
  //   }else if(this.tipoDocumento == 'OrdenDescarga'){
  //     //^ Obtener Ordenes de Descarga Terminadas
  //     this.documentosService.getOrdenesDescargadas().subscribe(dataOrden=>{
  //       console.log(dataOrden);
  //       if(dataOrden.length>0){
  //         let cantidadDocumentos = 0;
  //         let arrayLength = dataOrden.length;
  //         if(dataOrden.length > 5){
  //           arrayLength = 5; 
  //         }
  //         for (let i = 0; i < arrayLength; i++) {
  //         this.documentosService.getDocumentoFolioTipoModulo(dataOrden[i].Folio, 'OrdenDescarga', 'Importacion').subscribe(resDocumento=>{
  //           console.log(resDocumento);
  //           if(resDocumento.length>0){
  //             cantidadDocumentos = cantidadDocumentos + +resDocumento.length;
              
  //             for (let i = 0; i < resDocumento.length; i++) {

  //             let fecha = new Date(resDocumento[0].Vigencia)
  //             let mes = fecha.getMonth();
  
  //             if ( mes == 0){
  //               this.totalEneroDocumento = this.totalEneroDocumento + 1;
                
  //             }
  //             if ( mes == 1){
  //               this.totalFebreroDocumento = this.totalFebreroDocumento + 1;
                
  //             }
  //             if ( mes == 2){
  //               this.totalMarzoDocumento = this.totalMarzoDocumento + 1;
                
  //             }
  //             if ( mes == 3){
  //               this.totalAbrilDocumento = this.totalAbrilDocumento + 1;
                
  //             }
  //             if ( mes == 4){
  //               this.totalMayoDocumento = this.totalMayoDocumento + 1;
                
  //             }
  //             if ( mes == 5){
  //               this.totalJunioDocumento = this.totalJunioDocumento + 1;
                
  //             }
  //             if ( mes == 6){
  //               this.totalJulioDocumento = this.totalJulioDocumento + 1;
                
  //             }
  //             if ( mes == 7){
  //               this.totalAgostoDocumento = this.totalAgostoDocumento + 1;
                
  //             }
  //             if ( mes == 8){
  //               this.totalSeptiembreDocumento = this.totalSeptiembreDocumento + 1;
                
  //             }
  //             if ( mes == 9){
  //               this.totalOctubreDocumento = this.totalOctubreDocumento + 1;
                
  //             }
  //             if ( mes == 10){
  //               this.totalNoviembreDocumento = this.totalNoviembreDocumento + 1;
                
  //             }
  //             if ( mes == 11){
  //               this.totalDiciembreDocumento = this.totalDiciembreDocumento + 1;
                
  //             }
 
          
     
  //         this.barChartDataDocumento[0].label = 'Documentos Orden Descarga'
  //       this.barChartDataDocumento[0].data[0] = this.totalEneroDocumento
  //       this.barChartDataDocumento[0].data[1] = this.totalFebreroDocumento
  //       this.barChartDataDocumento[0].data[2] = this.totalMarzoDocumento
  //       this.barChartDataDocumento[0].data[3] = this.totalAbrilDocumento
  //       this.barChartDataDocumento[0].data[4] = this.totalMayoDocumento
  //       this.barChartDataDocumento[0].data[5] = this.totalJunioDocumento
  //       this.barChartDataDocumento[0].data[6] = this.totalJulioDocumento
  //       this.barChartDataDocumento[0].data[7] = this.totalAgostoDocumento
  //       this.barChartDataDocumento[0].data[8] = this.totalSeptiembreDocumento
  //       this.barChartDataDocumento[0].data[9] = this.totalOctubreDocumento
  //       this.barChartDataDocumento[0].data[10] = this.totalNoviembreDocumento
  //       this.barChartDataDocumento[0].data[11] = this.totalDiciembreDocumento
  //           }



  //           }
  //         })
  //         }          
  //       }
  //     })
  //   }

  }


  cambioDocumento(event) {
    this.tipoDocumento = event.value;
    this.verDocumento()
  }

  
    // datosIncidencia(data, i) {
    //   console.log(data);
      
    //   this.incidenciasService.getIncidenciaProcedencia(this.ordenIncidencia).subscribe(dataReporte => {
    //     // this.iniciarTotalesIncidencia();
  
    //     let totalMermas = 0;
    //     let totalReparaciones = 0;
  
    //     console.log(dataReporte);
    //     if (dataReporte.length > 0) {
    //       // console.log(dataReporte);
    //       for (let l = 0; l < dataReporte.length; l++) {
    //         if (dataReporte[l].TipoIncidencia == 'Merma') {
    //           totalMermas++;
    //         } else if (dataReporte[l].TipoIncidencia == 'Reparacion') {
    //           totalReparaciones++;
    //         }
    //       }
    //       console.log(totalMermas);
  
    //       this.arrconIncidencia[0].TotalMerma = totalMermas;
    //       this.arrconIncidencia[1].TotalReparacion = totalReparaciones;


    //         console.log(dataReporte);
    //         this.iniciarTotalesIncidencia();
    //         for (let l = 0; l < dataReporte.length; l++) {
            
    
    //             let fecha = new Date(dataReporte[l].FechaElaboracion)
    //             let mes = fecha.getMonth();
    
    //             if ( mes == 0){
    //               this.totalEneroIncidencia = this.totalEneroIncidencia + 1;
                  
    //             }
    //             if ( mes == 1){
    //               this.totalFebreroIncidencia = this.totalFebreroIncidencia + 1;
                  
    //             }
    //             if ( mes == 2){
    //               this.totalMarzoIncidencia = this.totalMarzoIncidencia + 1;
                  
    //             }
    //             if ( mes == 3){
    //               this.totalAbrilIncidencia = this.totalAbrilIncidencia + 1;
                  
    //             }
    //             if ( mes == 4){
    //               this.totalMayoIncidencia = this.totalMayoIncidencia + 1;
                  
    //             }
    //             if ( mes == 5){
    //               this.totalJunioIncidencia = this.totalJunioIncidencia + 1;
                  
    //             }
    //             if ( mes == 6){
    //               this.totalJulioIncidencia = this.totalJulioIncidencia + 1;
                  
    //             }
    //             if ( mes == 7){
    //               this.totalAgostoIncidencia = this.totalAgostoIncidencia + 1;
                  
    //             }
    //             if ( mes == 8){
    //               this.totalSeptiembreIncidencia = this.totalSeptiembreIncidencia + 1;
                  
    //             }
    //             if ( mes == 9){
    //               this.totalOctubreIncidencia = this.totalOctubreIncidencia + 1;
                  
    //             }
    //             if ( mes == 10){
    //               this.totalNoviembreIncidencia = this.totalNoviembreIncidencia + 1;
                  
    //             }
    //             if ( mes == 11){
    //               this.totalDiciembreIncidencia = this.totalDiciembreIncidencia + 1;
                  
    //             }
    //           }
            
    //       if (this.ordenIncidencia=='OrdenCarga'){
    //         this.barChartDataIncidencia[0].label = 'Incidencias Orden Carga'
    //       this.barChartDataIncidencia[0].data[0] = this.totalEneroIncidencia
    //       this.barChartDataIncidencia[0].data[1] = this.totalFebreroIncidencia
    //       this.barChartDataIncidencia[0].data[2] = this.totalMarzoIncidencia
    //       this.barChartDataIncidencia[0].data[3] = this.totalAbrilIncidencia
    //       this.barChartDataIncidencia[0].data[4] = this.totalMayoIncidencia
    //       this.barChartDataIncidencia[0].data[5] = this.totalJunioIncidencia
    //       this.barChartDataIncidencia[0].data[6] = this.totalJulioIncidencia
    //       this.barChartDataIncidencia[0].data[7] = this.totalAgostoIncidencia
    //       this.barChartDataIncidencia[0].data[8] = this.totalSeptiembreIncidencia
    //       this.barChartDataIncidencia[0].data[9] = this.totalOctubreIncidencia
    //       this.barChartDataIncidencia[0].data[10] = this.totalNoviembreIncidencia
    //       this.barChartDataIncidencia[0].data[11] = this.totalDiciembreIncidencia
    //       }
    //       else if (this.ordenIncidencia=='OrdenDescarga'){
    //         this.barChartDataIncidencia[0].label = 'Incidencias Orden Descarga'
    //         this.barChartDataIncidencia[0].data[0] = this.totalEneroIncidencia
    //         this.barChartDataIncidencia[0].data[1] = this.totalFebreroIncidencia
    //         this.barChartDataIncidencia[0].data[2] = this.totalMarzoIncidencia
    //         this.barChartDataIncidencia[0].data[3] = this.totalAbrilIncidencia
    //         this.barChartDataIncidencia[0].data[4] = this.totalMayoIncidencia
    //         this.barChartDataIncidencia[0].data[5] = this.totalJunioIncidencia
    //         this.barChartDataIncidencia[0].data[6] = this.totalJulioIncidencia
    //         this.barChartDataIncidencia[0].data[7] = this.totalAgostoIncidencia
    //         this.barChartDataIncidencia[0].data[8] = this.totalSeptiembreIncidencia
    //         this.barChartDataIncidencia[0].data[9] = this.totalOctubreIncidencia
    //         this.barChartDataIncidencia[0].data[10] = this.totalNoviembreIncidencia
    //         this.barChartDataIncidencia[0].data[11] = this.totalDiciembreIncidencia
          // this.chart.update();
           

          
    //       } 
    //     }
    //     })
    // }
}
