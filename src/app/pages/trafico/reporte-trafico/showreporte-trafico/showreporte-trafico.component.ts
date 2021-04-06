import { Component, OnInit, Input, SimpleChanges, Inject } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { SharedService } from "../../../../services/shared/shared.service";
import { formatoReporte } from "../../../../Models/formato-reporte";
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenCargaTraficoService } from '../../../../services/trafico/orden-carga-trafico.service';

@Component({
  selector: 'app-showreporte-trafico',
  templateUrl: './showreporte-trafico.component.html',
  styleUrls: ['./showreporte-trafico.component.css']
})
export class ShowreporteTraficoComponent implements OnInit {

  constructor(
    public ocService: OrdenCargaService,
    public traficoService: OrdenCargaTraficoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.ReporteInformacion = this.data;
    console.log(this.ReporteInformacion);
    //Identificar de donde se genero el reporte
    this.identificarTipoDeReporte(
      this.ReporteInformacion.modulo
    );
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  ReporteInformacion: any;
  arrcon: Array<any> = [];


  //Variables totales reporte
  kg: number;
  total: number;


  iniciarTotales() {
    this.total = 0;
    this.kg = 0;
  }

  identificarTipoDeReporte(modulo: string) {
    this.kg = 0;
    this.total = 0;

    if (modulo == 'Trafico') {
      this.obtenerReporteDocumento();
    } else if (modulo == '') {

    }

  }

  obtenerReporteDocumento() {
    this.arrcon = [];
    //^ buscar por todos los fletes
    if (this.ReporteInformacion.filtrarOrdenCarga == false && this.ReporteInformacion.estatus == false && this.ReporteInformacion.filtrarFletera == false) {
      console.log('Sin filtro');
      this.sinFiltro();
    }
    //^ buscar reporte por Fletera
    else if (this.ReporteInformacion.filtrarOrdenCarga == false && this.ReporteInformacion.estatus == false && this.ReporteInformacion.filtrarFletera == true) {
      console.log('filtrar por fletera');
      this.filtrarFletera();
    }
    //^ buscar reporte por Ordencarga
    else if (this.ReporteInformacion.filtrarOrdenCarga == true && this.ReporteInformacion.estatus == false && this.ReporteInformacion.filtrarFletera == false) {
      console.log('filtrar por OC');
      this.filtrarOrdenCarga();
    }
    //^ buscar reporte por Estatus
    else if (this.ReporteInformacion.filtrarOrdenCarga == false && this.ReporteInformacion.estatus == true && this.ReporteInformacion.filtrarFletera == false) {
      console.log('filtrar por estatus');
      this.filtrarEstatus();
    }
    //^ buscar reporte por Fletera y Estatus
    else if (this.ReporteInformacion.filtrarOrdenCarga == false && this.ReporteInformacion.estatus == true && this.ReporteInformacion.filtrarFletera == true) {
      console.log('filtrar por fletera y estatus');
      this.filtrarFleteraEstatus();
    }
    //^ buscar reporte por Oc y Fletera
    else if (this.ReporteInformacion.filtrarOrdenCarga == true && this.ReporteInformacion.estatus == false && this.ReporteInformacion.filtrarFletera == true) {
      console.log('filtrar por OC y Fletera');
      this.filtrarOrdenCargaFletera();
    }
    //^ buscar reporte por OC y estatus
    else if (this.ReporteInformacion.filtrarOrdenCarga == true && this.ReporteInformacion.estatus == true && this.ReporteInformacion.filtrarFletera == false) {
      console.log('filtrar por OC y estatus');
      this.filtrarOrdenCargaEstatus();
    }
    //^ buscar reporte por Oc, Estatus y fletera
    else if (this.ReporteInformacion.filtrarOrdenCarga == true && this.ReporteInformacion.estatus == true && this.ReporteInformacion.filtrarFletera == true) {
      console.log('filtrar por todo');
      this.filtrarOrdenCargaEstatusFletera();
    }
  }


  sinFiltro() {
    this.traficoService.getTraficoGeneral().subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }
  filtrarFletera() {
    this.traficoService.getTraficoFletera(this.ReporteInformacion.fletera).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }
  filtrarOrdenCarga() {
    this.traficoService.getTraficoOC(this.ReporteInformacion.idClienteProveedor).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }
  filtrarEstatus() {
    this.traficoService.getTraficoEstatus(this.ReporteInformacion.tipoEstatus).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }
  filtrarFleteraEstatus() {
    this.traficoService.getTraficoFleteraEstatus(this.ReporteInformacion.fletera, this.ReporteInformacion.tipoEstatus).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }
  filtrarOrdenCargaFletera() {
    this.traficoService.getTraficoOCFletera(this.ReporteInformacion.idClienteProveedor, this.ReporteInformacion.fletera).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }
  filtrarOrdenCargaEstatus() {
    this.traficoService.getTraficoOCEstatus(this.ReporteInformacion.idClienteProveedor, this.ReporteInformacion.tipoEstatus).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }
  filtrarOrdenCargaEstatusFletera() {
    this.traficoService.getTraficoOCEstatusFletera(this.ReporteInformacion.idClienteProveedor, this.ReporteInformacion.tipoEstatus,  this.ReporteInformacion.fletera).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.arrcon[i] = data[i];
          this.total = this.total + +data[i].Total;
          this.kg = this.kg + +data[i].Kg;
        }
      }
    })
  }


  exportarXLS() {
    console.log('export a excel');
    this.sharedService.generarExcelReporteTraficoFlete(this.arrcon);
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
