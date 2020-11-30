import { Component, OnInit, Input, SimpleChanges, Inject } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { SharedService } from "../../../../services/shared/shared.service";
import { formatoReporte } from "../../../../Models/formato-reporte";
import { OrdenCargaService } from '../../../../services/almacen/orden-carga/orden-carga.service';
import { DocumentosImportacionService } from '../../../../services/importacion/documentos-importacion.service';
import { TraspasoMercanciaService } from '../../../../services/importacion/traspaso-mercancia.service';

@Component({
  selector: 'app-showreporte-importacion',
  templateUrl: './showreporte-importacion.component.html',
  styleUrls: ['./showreporte-importacion.component.css']
})
export class ShowreporteImportacionComponent implements OnInit {

  constructor(
    
    public traspasoService: TraspasoMercanciaService,
    public documentosService: DocumentosImportacionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.ReporteInformacion = this.data;
    console.log(this.ReporteInformacion);
    //Identificar de donde se genero el reporte
    this.identificarTipoDeReporte(
      this.ReporteInformacion.modulo,
      this.ReporteInformacion.unDocumento
    );
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  ReporteInformacion: any;
  arrcon: Array<any> = [];

  

  //Variables totales reporte
  totalSacos: number;
  totalKg: number;
  // //tipoReporte
  // tipoReporte: string;
  // //reporteporFechas
  // reporteFechas: boolean;
  // //repoteporEstatus
  // reporteEstatus: boolean;

  iniciarTotales() {
    this.totalSacos = 0;
    this.totalKg = 0;
  }

  identificarTipoDeReporte(modulo: string, unDocumento: boolean) {
this.totalKg = 0;
this.totalSacos = 0;
    
    if(modulo == 'Documento'){
      this.obtenerReporteDocumento();
    }else if (modulo == 'Traspaso'){
      this.obtenerReporteTraspaso();
    }
    
  }

  obtenerReporteDocumento() {
    this.arrcon = [];
    //^ buscar por todos los documentos y sin fecha
    if (this.ReporteInformacion.unDocumento == false && this.ReporteInformacion.filtradoFecha == false) {
      console.log('Se filtraran todos los documentos y sin fecha');
      this.filtroTodosDocumentos();
    }
    //^ buscar reporte por Fechas y todos los documentos
    else if (this.ReporteInformacion.filtradoFecha == true && this.ReporteInformacion.unDocumento == false) {
      console.log('filtrar por todos los documentos y con fecha');
      this.filtroTodosDocumentosFechas();
    }
    //^ buscar reporte por un Documento y sin fecha
    else if (this.ReporteInformacion.unDocumento == true && this.ReporteInformacion.filtradoFecha == false) {
      console.log('filtrar por un documento y sin fechas');
      this.filtroUnDocumentos();
    }
    //^ buscar reporte por un Documento y con Fechas
    else if (this.ReporteInformacion.unDocumento == true && this.ReporteInformacion.filtradoFecha == true) {
      console.log('filtrar por un documento y con fechas');
      this.filtroUnDocumentosFechas();
    }
  }
  obtenerReporteTraspaso() {
    this.arrcon = [];

    //^ buscar sin ningun filtro
    if (this.ReporteInformacion.estatusTraspaso == false && this.ReporteInformacion.filtradoFecha == false) {
      console.log('Se filtraran sin estatus y sin fecha');
      this.filtroTraspasoGeneral();
    }
    //^ buscar reporte por Fechas y sin estatus
    else if (this.ReporteInformacion.filtradoFecha == true && this.ReporteInformacion.estatusTraspaso == false) {
      console.log('filtrar por fecha y sin estatus');
      this.filtroTraspasoFechas();
    }
    //^ buscar reporte por  estatus y sin fecha
    else if (this.ReporteInformacion.estatusTraspaso == true && this.ReporteInformacion.filtradoFecha == false) {
      console.log('filtrar por estatus y sin fecha');
      this.filtroTraspasoEstatus();
    }
    //^ buscar reporte por estatus y con Fechas
    else if (this.ReporteInformacion.estatusTraspaso == true && this.ReporteInformacion.filtradoFecha == true) {
      console.log('filtrar por estatus y fechas');
      this.filtroTraspasoFechasEstatus();
    }
  }

   //^ buscar por todos los documentos y sin fecha
  filtroTodosDocumentos() {
    this.documentosService.getReporteDocumentos().subscribe(dataDocumentos=>{
     console.log(dataDocumentos);
     if(dataDocumentos.length>0){
       for (let i = 0; i < dataDocumentos.length; i++) {
        this.arrcon[i] = dataDocumentos[i];    
      }
    }
    })
  }

    //^ buscar reporte por Fechas y todos los documentos
    filtroTodosDocumentosFechas() {
    let fecha1;
    let fecha2;

    let dia = this.ReporteInformacion.fechaInicial.getDate();
    let mes = this.ReporteInformacion.fechaInicial.getMonth() + 1;
    let anio = this.ReporteInformacion.fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = this.ReporteInformacion.fechaFinal.getDate();
    let mes2 = this.ReporteInformacion.fechaFinal.getMonth() + 1;
    let anio2 = this.ReporteInformacion.fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2
      this.documentosService.getReporteDocumentoFechas(fecha1, fecha2).subscribe(dataDocumentos=>{
       console.log(dataDocumentos);
       if(dataDocumentos.length>0){
         for (let i = 0; i < dataDocumentos.length; i++) {
          this.arrcon[i] = dataDocumentos[i];    
        }
      }
      })
    }

    //^ buscar reporte por un Documento y sin fecha
  filtroUnDocumentos() {
    this.documentosService.getReporteDocumentoModuloTipoFolio(this.ReporteInformacion.documentoModulo, this.ReporteInformacion.documentoTipo, this.ReporteInformacion.documentoFolio).subscribe(dataDocumentos=>{
     console.log(dataDocumentos);
     if(dataDocumentos.length>0){
       for (let i = 0; i < dataDocumentos.length; i++) {
        this.arrcon[i] = dataDocumentos[i];    
      }
    }
    })
  }
  
  //^ buscar reporte por Fechas y un  documentos
  filtroUnDocumentosFechas() {
    let fecha1;
    let fecha2;

    let dia = this.ReporteInformacion.fechaInicial.getDate();
    let mes = this.ReporteInformacion.fechaInicial.getMonth() + 1;
    let anio = this.ReporteInformacion.fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = this.ReporteInformacion.fechaFinal.getDate();
    let mes2 = this.ReporteInformacion.fechaFinal.getMonth() + 1;
    let anio2 = this.ReporteInformacion.fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

      this.documentosService.getReporteDocumentoModuloTipoFolioFecha(this.ReporteInformacion.documentoModulo, this.ReporteInformacion.documentoTipo, this.ReporteInformacion.documentoFolio, fecha1, fecha2).subscribe(dataDocumentos=>{
       console.log(dataDocumentos);
       if(dataDocumentos.length>0){
         for (let i = 0; i < dataDocumentos.length; i++) {
          this.arrcon[i] = dataDocumentos[i];    
        }
      }
      })
    }

    //^ buscar sin ningun filtro
    filtroTraspasoGeneral(){
      this.traspasoService.getReporteTraspasoBodegas(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino).subscribe(dataDocumentos=>{
        console.log(dataDocumentos);
        this.iniciarTotales();
        if(dataDocumentos.length>0){
          for (let i = 0; i < dataDocumentos.length; i++) {
           this.arrcon[i] = dataDocumentos[i];    
           this.totalKg = this.totalKg + +dataDocumentos[i].KilogramosTotales;
           this.totalSacos = this.totalSacos + +dataDocumentos[i].SacosTotales;
           this.arrcon[i].Docs = [];           
           this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle=>{
             let sacos: number = 0;
             let kilos: number = 0;
            dataDetalle.forEach(element => {   
              sacos = sacos + +element.Sacos;            
              kilos = kilos + +element.PesoTotal;                          
              this.arrcon[i].Docs.push(element);
              this.arrcon[i].sac = sacos;
              this.arrcon[i].kil = kilos;
             });
           })         
         }
       }
       })
    }

    //^ buscar reporte por Fechas y sin estatus
    filtroTraspasoFechas(){

          let fecha1;
    let fecha2;

let dia = this.ReporteInformacion.fechaInicial.getDate();
    let mes = this.ReporteInformacion.fechaInicial.getMonth() + 1;
    let anio = this.ReporteInformacion.fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = this.ReporteInformacion.fechaFinal.getDate();
    let mes2 = this.ReporteInformacion.fechaFinal.getMonth() + 1;
    let anio2 = this.ReporteInformacion.fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

      this.traspasoService.getReporteTraspasoBodegasFechas(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino, fecha1, fecha2).subscribe(dataDocumentos=>{
        console.log(dataDocumentos);
        this.iniciarTotales();
        if(dataDocumentos.length>0){
          for (let i = 0; i < dataDocumentos.length; i++) {
           this.arrcon[i] = dataDocumentos[i];    
           this.totalKg = this.totalKg + +dataDocumentos[i].KilogramosTotales;
           this.totalSacos = this.totalSacos + +dataDocumentos[i].SacosTotales;
           this.arrcon[i].Docs = [];
           this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle=>{
            let sacos: number = 0;
            let kilos: number = 0;
           dataDetalle.forEach(element => {   
             sacos = sacos + +element.Sacos;            
             kilos = kilos + +element.PesoTotal;                          
             this.arrcon[i].Docs.push(element);
             this.arrcon[i].sac = sacos;
             this.arrcon[i].kil = kilos;
            });
           })
         }
       }
       })
    }
    //^ buscar reporte por Fechas y  estatus
    filtroTraspasoFechasEstatus(){

          let fecha1;
    let fecha2;

let dia = this.ReporteInformacion.fechaInicial.getDate();
    let mes = this.ReporteInformacion.fechaInicial.getMonth() + 1;
    let anio = this.ReporteInformacion.fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = this.ReporteInformacion.fechaFinal.getDate();
    let mes2 = this.ReporteInformacion.fechaFinal.getMonth() + 1;
    let anio2 = this.ReporteInformacion.fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

      this.traspasoService.getReporteTraspasoBodegasFechasEstatus(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino, fecha1, fecha2,this.ReporteInformacion.tipoEstatus ).subscribe(dataDocumentos=>{
        console.log(dataDocumentos);
        if(dataDocumentos.length>0){
          this.iniciarTotales();
          for (let i = 0; i < dataDocumentos.length; i++) {
           this.arrcon[i] = dataDocumentos[i];    
           this.totalKg = this.totalKg + +dataDocumentos[i].KilogramosTotales;
           this.totalSacos = this.totalSacos + +dataDocumentos[i].SacosTotales;
           this.arrcon[i].Docs = [];
           this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle=>{
            let sacos: number = 0;
             let kilos: number = 0;
            dataDetalle.forEach(element => {   
              sacos = sacos + +element.Sacos;            
              kilos = kilos + +element.PesoTotal;                          
              this.arrcon[i].Docs.push(element);
              this.arrcon[i].sac = sacos;
              this.arrcon[i].kil = kilos;
             });
           })
         }
       }
       })
    }

    //^ buscar reporte por  estatus y sin fecha
    filtroTraspasoEstatus(){
      this.traspasoService.getReporteTraspasoBodegasEstatus(this.ReporteInformacion.bodegaOrigen, this.ReporteInformacion.bodegaDestino, this.ReporteInformacion.tipoEstatus).subscribe(dataDocumentos=>{
        console.log(dataDocumentos);
        if(dataDocumentos.length>0){
          this.iniciarTotales();
          for (let i = 0; i < dataDocumentos.length; i++) {
           this.arrcon[i] = dataDocumentos[i];    
           this.totalKg = this.totalKg + +dataDocumentos[i].KilogramosTotales;
           this.totalSacos = this.totalSacos + +dataDocumentos[i].SacosTotales;
           this.arrcon[i].Docs = [];
           this.traspasoService.getDetalleTraspasoMercancia(dataDocumentos[i].IdTraspasoMercancia).subscribe(dataDetalle=>{
            let sacos: number = 0;
             let kilos: number = 0;
            dataDetalle.forEach(element => {   
              sacos = sacos + +element.Sacos;            
              kilos = kilos + +element.PesoTotal;                          
              this.arrcon[i].Docs.push(element);
              this.arrcon[i].sac = sacos;
              this.arrcon[i].kil = kilos;
             });
           })
         }
       }
       })
    }


  //   let fecha1;
  //   let fecha2;

  //   let dia = fechaInicial.getDate();
  //   let mes = fechaInicial.getMonth() + 1;
  //   let anio = fechaInicial.getFullYear();
  //   fecha1 = anio + '-' + mes + '-' + dia

  //   let dia2 = fechaFinal.getDate();
  //   let mes2 = fechaFinal.getMonth() + 1;
  //   let anio2 = fechaFinal.getFullYear();
  //   fecha2 = anio2 + '-' + mes2 + '-' + dia2

 

  exportarXLS() {
    console.log('export a excel');
    if(this.ReporteInformacion.modulo == 'Documento'){
      this.sharedService.generarExcelReporteImportacionDocumentos(this.arrcon);
      
    }else if(this.ReporteInformacion.modulo == 'Traspaso'){
    this.sharedService.generarExcelReporteImportacionTraspaso(this.arrcon);
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
