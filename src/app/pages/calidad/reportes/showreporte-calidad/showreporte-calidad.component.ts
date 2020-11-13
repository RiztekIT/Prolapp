import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SharedService } from '../../../../services/shared/shared.service';
import { CalendarioService } from 'src/app/services/calendario/calendario.service';
import { formatoReporte } from '../../../../Models/formato-reporte';
import { IncidenciasService } from '../../../../services/almacen/incidencias/incidencias.service';

@Component({
  selector: 'app-showreporte-calidad',
  templateUrl: './showreporte-calidad.component.html',
  styleUrls: ['./showreporte-calidad.component.css']
})
export class ShowreporteCalidadComponent implements OnInit {


  constructor(public incidenciasService: IncidenciasService, @Inject(MAT_DIALOG_DATA) public data: any, public sharedService: SharedService) { }

  ngOnInit() {
    this.reporte = this.data;
    console.log(this.reporte);
    this.procedencia = this.reporte.procedencia;
    this.identificarTipoDeReporte();

    //Obtener reporte Proveedor(es)
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  reporte: any;
  arrcon: Array<any> = [];

  procedencia: string;

  //Variables totales reporte
  kgTotales: number

  //tipoReporte
  tipoReporte: string;
  //reporteporFechas
  reporteFechas: boolean;
  //repoteporEstatus
  reporteEstatus: boolean;



  identificarTipoDeReporte() {
    //^asignar valores del Reporte
    this.reporteFechas = this.reporte.filtradoFecha;
    this.reporteEstatus = this.reporte.estatus;

    this.obtenerReporte();
    // switch (unProveedor) {
    //   case (true):
    //     console.log('ES UN SOLO PROVEEDOR');
    //     this.obtenerReporteUnProveedor(this.reporteProveedor.idProveedor);
    //     break;
    //   case (false):
    //     console.log('TODOS LOS PROVEEDORES');
    //     this.obtenerReporteTodosProveedores();
    //     break;
    // }
  }


  // obtenerReporteTodosProveedores() {
  //   this.comprasService.getProveedoresList().subscribe(dataProveedores => {
  //     console.log(dataProveedores);
  //     this.obtenerReporte(dataProveedores.length, dataProveedores);
  //   })
  // }

  // obtenerReporteUnProveedor(id: number) {
  //   this.comprasService.getProveedorId(id).subscribe(dataProveedor => {
  //     console.log(dataProveedor);
  //     this.obtenerReporte(dataProveedor.length, dataProveedor);
  //   })
  // }

  obtenerReporte() {
    this.arrcon = [];

    //^ ningun filtro (solo buscar por tipo incidencia) y procedencia
    if (this.reporteFechas == false && this.reporteEstatus == false) {
      this.filtroGeneral(this.reporte.tipoReporte, this.procedencia);
    }
    //^buscar reporte por Tipo de Incidencia y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == false) {
      this.filtroFecha(this.reporte.tipoReporte, this.procedencia, this.reporte.fechaInicial, this.reporte.fechaFinal)
    }
    //^buscar reporte por Estatus de Incidencia
    else if (this.reporteFechas == false && this.reporteEstatus == true) {
      this.filtroEstatus(this.reporte.tipoReporte, this.procedencia, this.reporte.tipoEstatus)
    }
    //^buscar reporte por Tipo de Incidencia y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == true) {
      this.filtroEstatusFecha(this.reporte.tipoReporte, this.procedencia, this.reporte.fechaInicial, this.reporte.fechaFinal, this.reporte.tipoEstatus)
    }

  }


  //^filtro por tipo Incidencia (ALL, Merma, Reparacion, Devolucion) y procedencia
  filtroGeneral(tipoReporte, procedencia) {
      this.arrcon[0] = [];
      this.arrcon[0].Docs = [];
      //^Obtener Reportes
      //^ Si la procedencia es ALL
      if(procedencia == 'ALL'){
        this.incidenciasService.getIncidencias().subscribe(dataReporte => {
          if (dataReporte.length > 0) {
                 this.mostrarDatos(dataReporte, tipoReporte);
          } else {
            this.iniciarTotales();
          }
        })
      }else{
        this.incidenciasService.getIncidenciaProcedencia(procedencia).subscribe(dataReporte => {
          if (dataReporte.length > 0) {
                 this.mostrarDatos(dataReporte, tipoReporte);
          } else {
            this.iniciarTotales();
          }
        })
      }
  }


  //Filtro por Fechas 
  filtroFecha(tipoReporte, procedencia, fechaInicial, fechaFinal) {

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


    console.log('FILTRADO POR FECHA');
    console.log('--------------');
    console.log(fecha1);
    console.log(fecha2);
    console.log('--------------');

    this.arrcon[0] = [];
      this.arrcon[0].Docs = [];
      //^Obtener Reportes
      //^ Si la procedencia es ALL
      if(procedencia == 'ALL'){
        this.incidenciasService.GetIncidenciasFechas(fecha1, fecha2).subscribe(dataReporte => {
          if (dataReporte.length > 0) {
                 this.mostrarDatos(dataReporte, tipoReporte);
          } else {
            this.iniciarTotales();
          }
        })
      }else{
        this.incidenciasService.GetIncidenciasFechasProcedencia(fecha1, fecha2, procedencia).subscribe(dataReporte => {
          if (dataReporte.length > 0) {
                 this.mostrarDatos(dataReporte, tipoReporte);
          } else {
            this.iniciarTotales();
          }
        })
      }
    
  }

  //Filtro por Estatus
  filtroEstatus(tipoReporte, procedencia, estatus) {
    this.arrcon[0] = [];
    this.arrcon[0].Docs = [];
    //^Obtener Reportes
    //^ Si la procedencia es ALL
    if(procedencia == 'ALL'){
      this.incidenciasService.GetIncidenciasEstatus(estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
               this.mostrarDatos(dataReporte, tipoReporte);
        } else {
          this.iniciarTotales();
        }
      })
    }else{
      this.incidenciasService.GetIncidenciasEstatusProcedencia(estatus, procedencia).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
               this.mostrarDatos(dataReporte, tipoReporte);
        } else {
          this.iniciarTotales();
        }
      })
    }
  }
  //Filtro por Fechas y Estatus 
  filtroEstatusFecha(tipoReporte, procedencia, fechaInicial, fechaFinal, estatus) {

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


    console.log('FILTRADO POR FECHA');
    console.log('--------------');
    console.log(fecha1);
    console.log(fecha2);
    console.log('--------------');

    this.arrcon[0] = [];
      this.arrcon[0].Docs = [];
      //^Obtener Reportes
      //^ Si la procedencia es ALL
      if(procedencia == 'ALL'){
        console.log('SIN PROCEDENCIA');
        this.incidenciasService.GetIncidenciasFechasEstatus(fecha1, fecha2, estatus).subscribe(dataReporte => {
          if (dataReporte.length > 0) {
            this.mostrarDatos(dataReporte, tipoReporte);
          } else {
            this.iniciarTotales();
          }
        })
      }else{
        console.log('CON PROCEDENCIA');
        this.incidenciasService.GetIncidenciasFechasProcedenciaEstatus(fecha1, fecha2, procedencia, estatus).subscribe(dataReporte => {
          if (dataReporte.length > 0) {
                 this.mostrarDatos(dataReporte, tipoReporte);
          } else {
            this.iniciarTotales();
          }
        })
      }
    

  }

  //^ Metodo para hacer la sumatoria de los kilogramos totales y llenar los datos del reporte
  mostrarDatos(dataReporte, tipoReporte){
    console.log(dataReporte);
    this.iniciarTotales();
    for (let l = 0; l < dataReporte.length; l++) {
      if (tipoReporte == 'Ambas') {
        console.log('AMBOSSS');
        this.kgTotales = this.kgTotales + +dataReporte[l].Cantidad;
        this.arrcon[0].Docs.push(dataReporte[l]);
      } else if (tipoReporte == 'Merma') {
        console.log('Merma');
        if(dataReporte[l].TipoIncidencia == 'Merma'){
          this.kgTotales = this.kgTotales + +dataReporte[l].Cantidad;               
          this.arrcon[0].Docs.push(dataReporte[l]);              
        }
      } else if (tipoReporte == 'Reparacion') {
        console.log('Reparacion');
        if(dataReporte[l].TipoIncidencia == 'Reparacion'){
          this.kgTotales = this.kgTotales + +dataReporte[l].Cantidad;               
          this.arrcon[0].Docs.push(dataReporte[l]);              
        }              
      } else if (tipoReporte == 'Devolucion') {
        console.log('Reparacion');
        if(dataReporte[l].TipoIncidencia == 'Devolucion'){
          this.kgTotales = this.kgTotales + +dataReporte[l].Cantidad;               
          this.arrcon[0].Docs.push(dataReporte[l]);              
        }            
      }
    }         
    this.arrcon[0].kgTotales = this.kgTotales; 
  }

  iniciarTotales() {
    // this.total = 0;
    // this.totalDlls = 0;
    // this.pesoTotal = 0;
    this.kgTotales = 0;
  }

  exportarXLS() {
    console.log('export a excel');
    this.sharedService.generarExcelReporteCalidad(this.arrcon);
  }

  exportarPDF() {
    setTimeout(() => {
      // setTimeout(this.onExportClick,5)
      const content: Element = document.getElementById('pdfreporte');
      const option = {
        margin: [3, 0, 3, 0],
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
