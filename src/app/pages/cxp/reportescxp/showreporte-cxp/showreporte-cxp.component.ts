import { Component, OnInit, Input, SimpleChanges, Inject } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { SharedService } from "../../../../services/shared/shared.service";
import { formatoReporte } from 'src/app/Models/formato-reporte';
import { PagoscxpService } from 'src/app/services/cuentasxpagar/pagoscxp.service';

@Component({
  selector: 'app-showreporte-cxp',
  templateUrl: './showreporte-cxp.component.html',  
  styleUrls: ['./showreporte-cxp.component.css']
})
export class ShowreporteCxpComponent implements OnInit { 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public sharedService: SharedService, public pagoService: PagoscxpService) { }

  ngOnInit() {
    this.ReporteInformacion = this.data;
    console.log(this.ReporteInformacion);
    //Identificar de donde se genero el reporte
    this.identificarTipoDeReporte(this.ReporteInformacion.modulo);
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  ReporteInformacion: any;
  arrcon: Array<any> = [];

   //Variables totales reporte
   total: number;
   //reporteporFechas
   reporteFechas: boolean;
   //repotepor tipo documento
   reporteTipoDocumento: boolean;
 
   iniciarTotales() {
     this.total = 0;
   }

   identificarTipoDeReporte(modulo: string) {
    //asignar valores del Reporte
    this.reporteFechas = this.ReporteInformacion.filtradoFecha;
    this.reporteTipoDocumento = this.ReporteInformacion.pagoFiltro1Boolean;
    switch (modulo) {
      case ('Pago'):
        console.log(modulo);
          this.obtenerReportePago();
        break;
    }
  }


obtenerReportePago() {
  this.arrcon = [];
  //^ ningun filtro
  if (this.reporteFechas == false && this.reporteTipoDocumento == false) {
    this.filtroGeneralPago();
  }
  //^ buscar reporte por Fechas
  else if (this.reporteFechas == true && this.reporteTipoDocumento == false) {
    this.filtroFechaPago(this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
  }
  //^ buscar reporte por Tipo Documento
  else if (this.reporteFechas == false && this.reporteTipoDocumento == true) {
    this.filtroTipoDocumentoPago(this.ReporteInformacion.pagoFiltro1Valor);
  }
  //^ buscar reporte por  Tipo Documento y por Fechas
  else if (this.reporteFechas == true && this.reporteTipoDocumento == true) {
    this.filtroTipoDocumentoFechaPago(this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.pagoFiltro1Valor);
  }
}
 //^ filtro por general
 filtroGeneralPago() {
this.arrcon = new Array<any[]>();
    this.pagoService.getReporteGeneral().subscribe((dataReporte) => {
      this.iniciarTotales();
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.arrcon = dataReporte;
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Cantidad;
          }
        }
      });
}
//^ Filtro por por Fechas 
filtroFechaPago(fechaInicial, fechaFinal) {

  console.log('FILTRO FECHA IDCLIENTE');
  let fecha1;
  let fecha2;

  let dia = fechaInicial.getDate();
  let mes = fechaInicial.getMonth() + 1;
  let anio = fechaInicial.getFullYear();
  fecha1 = anio + '-' + mes + '-' + dia

  let dia2 = fechaFinal.getDate();
  let mes2 = fechaFinal.getMonth() + 1;
  let anio2 = fechaFinal.getFullYear();
  fecha2 = anio2 + '-' + mes2 + '-' + dia2

  this.arrcon = new Array<any[]>();
    this.pagoService.getReporteFechas(fecha1, fecha2).subscribe((dataReporte) => {
      this.iniciarTotales();
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.arrcon = dataReporte;
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Cantidad;
          }
        }
      });

 
}
//^ Filtro por tipo Documento
filtroTipoDocumentoPago(tipoDocumento) {
  this.arrcon = new Array<any[]>();
  this.pagoService.getReporteTipoDocumento(tipoDocumento).subscribe((dataReporte) => {
    this.iniciarTotales();
      if (dataReporte.length > 0) {
        console.log(dataReporte);
        this.arrcon = dataReporte;
        for (let l = 0; l < dataReporte.length; l++) {
          this.total = this.total + +dataReporte[l].Cantidad;
        }
      }
    });
}

//^ Filtro por Fechas y tipo documento
filtroTipoDocumentoFechaPago(fechaInicial, fechaFinal, tipoDocumento) {

  console.log('FILTRO TODO');

  let fecha1;
  let fecha2;

  let dia = fechaInicial.getDate();
  let mes = fechaInicial.getMonth() + 1;
  let anio = fechaInicial.getFullYear();
  fecha1 = anio + '-' + mes + '-' + dia

  let dia2 = fechaFinal.getDate();
  let mes2 = fechaFinal.getMonth() + 1;
  let anio2 = fechaFinal.getFullYear();
  fecha2 = anio2 + '-' + mes2 + '-' + dia2
  this.arrcon = new Array<any[]>();
  this.pagoService.getReporteFechasTipoDocumento(fecha1, fecha2, tipoDocumento).subscribe((dataReporte) => {
    this.iniciarTotales();
      if (dataReporte.length > 0) {
        console.log(dataReporte);
        this.arrcon = dataReporte;
        for (let l = 0; l < dataReporte.length; l++) {
          this.total = this.total + +dataReporte[l].Cantidad;
        }
      }
    });
}

exportarXLS() {
  console.log('export a excel');
  if(this.ReporteInformacion.modulo == 'OrdenCarga'){
    this.sharedService.generarExcelReporteAlmacenOrdenCarga(this.arrcon, 'OrdenCarga');    
  }else if(this.ReporteInformacion.modulo == 'OrdenDescarga'){
    this.sharedService.generarExcelReporteAlmacenOrdenDescarga(this.arrcon);
  }else if(this.ReporteInformacion.modulo == 'Inventario'){
    this.sharedService.generarExcelReporteAlmacenInventario(this.arrcon);
  }else if(this.ReporteInformacion.modulo == 'Traspaso'){
    this.sharedService.generarExcelReporteAlmacenOrdenCarga(this.arrcon, 'Traspaso');    
  }
}

exportarPDF() {
  setTimeout(() => {
    // setTimeout(this.onExportClick,5)
    const content: Element = document.getElementById('pdfreporte');
    const option = {
      margin: [3, 0, 3, .5],
      filename: 'Reporte.pdf',
      image: { type: 'jpeg', quality: 0.5 },
      html2canvas: { scale: 2, logging: true, scrollY: -2, scrollX: -15 },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
      pagebreak: { avoid: '.pgbreak' }
    };

    html2pdf().from(content).set(option).toPdf().get('pdf').then(function (pdf) {
      let variableFormato = new formatoReporte();
      // console.log(variableFormato);
      var totalPages = pdf.internal.getNumberOfPages();
      pdf.setFontSize(10);
      pdf.setTextColor(70);
      for (var i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.addImage(variableFormato.header, "PNG", -3, 0, 25, 3)
        pdf.text('Pro lactoIngredientes S. de R.L. M.I. de C.V.', 1, 26);
        pdf.addImage(variableFormato.footer, "PNG", 18, 25, 2, 2);
      }
    }).save();
  }, 1000);
  setTimeout(() => { }, 1000);

}


}
