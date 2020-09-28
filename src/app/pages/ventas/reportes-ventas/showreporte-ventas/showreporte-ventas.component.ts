import { Component, OnInit, Input, SimpleChanges, Inject } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { SharedService } from "../../../../services/shared/shared.service";
import { CalendarioService } from "src/app/services/calendario/calendario.service";
import { formatoReporte } from "../../../../Models/formato-reporte";
import { VentasCotizacionService } from "../../../../services/ventas/ventas-cotizacion.service";
import { VentasPedidoService } from "../../../../services/ventas/ventas-pedido.service";

@Component({
  selector: "app-showreporte-ventas",
  templateUrl: "./showreporte-ventas.component.html",
  styleUrls: ["./showreporte-ventas.component.css"],
})
export class ShowreporteVentasComponent implements OnInit {
  constructor(
    public cotizacionService: VentasCotizacionService,
    public pedidosService: VentasPedidoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.ReporteInformacion = this.data;
    console.log(this.ReporteInformacion);
    //Identificar de donde se genero el reporte
    this.identificarTipoDeReporte(
      this.ReporteInformacion.modulo,
      this.ReporteInformacion.unsolocliente
    );
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  ReporteInformacion: any;
  arrcon: Array<any> = [];

  moneda: string;

  //Variables totales reporte
  total: number;
  totalDlls: number;
  //tipoReporte
  tipoReporte: string;
  //reporteporFechas
  reporteFechas: boolean;
  //repoteporEstatus
  reporteEstatus: boolean;

  iniciarTotales() {
    this.total = 0;
    this.totalDlls = 0;
  }

  identificarTipoDeReporte(modulo: string, unCliente: boolean) {
    console.log(unCliente);
    //asignar valores del Reporte
    this.moneda = this.ReporteInformacion.moneda;
    this.reporteFechas = this.ReporteInformacion.filtradoFecha;
    this.reporteEstatus = this.ReporteInformacion.estatus;
    switch (unCliente) {
      case (true):
        this.obtenerReporteUnCliente(modulo, this.ReporteInformacion.idCliente);
        break;
      case (false):
        this.obtenerReporteTodosClientes(modulo);
        break;
    }
  }

  obtenerReporteTodosClientes(modulo: string) {
    console.log('TODOS LOS CLIENTES', modulo);
    this.cotizacionService.getDepDropDownValues().subscribe((dataClientes) => {
      console.log(dataClientes);
      if (modulo == "Cotizacion") {
        this.obtenerReporteCotizacion(dataClientes.length, dataClientes);
      } else if (modulo == "Pedido") {
        this.obtenerReportePedido(dataClientes.length, dataClientes);
      }
    });
  }

  obtenerReporteUnCliente(modulo: string, id: number) {
    console.log('Un CLiente', modulo, id);
    this.cotizacionService.GetCliente(id).subscribe((dataCliente) => {
      console.log(dataCliente);
      if (modulo == "Cotizacion") {
        this.obtenerReporteCotizacion(dataCliente.length, dataCliente);
      } else if (modulo == "Pedido") {
        this.obtenerReportePedido(dataCliente.length, dataCliente);
      }
    });
  }

  obtenerReporteCotizacion(numero: number, data: any) {
    this.arrcon = [];
    // ningun filtro
    if (this.reporteFechas == false && this.reporteEstatus == false) {
      this.filtroGeneralCotizacion(numero, data);
    }
    //buscar reporte por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == false) {
      this.filtroFechaCotizacion(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
    }
    //buscar reporte por Estatus de Cotizacion
    else if (this.reporteFechas == false && this.reporteEstatus == true) {
      this.filtroEstatusCotizacion(numero, data, this.ReporteInformacion.tipoEstatus);
    }
    //buscar reporte por  Estatus Cotizacion y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == true) {
      this.filtroEstatusFechaCotizacion(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.tipoEstatus);
    }
  }
  obtenerReportePedido(numero: number, data: any) {
    this.arrcon = [];
    // ningun filtro
    if (this.reporteFechas == false && this.reporteEstatus == false) {
      this.filtroGeneralPedido(numero, data);
    }
    //buscar reporte por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == false) {
      this.filtroFechaPedido(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
    }
    //buscar reporte por Estatus de Cotizacion
    else if (this.reporteFechas == false && this.reporteEstatus == true) {
      this.filtroEstatusPedido(numero, data, this.ReporteInformacion.tipoEstatus);;
    }
    //buscar reporte por  Estatus Cotizacion y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == true) {
      this.filtroEstatusFechaPedido(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.tipoEstatus);
    }
  }

  //filtro por Id Cliente
  filtroGeneralCotizacion(numero, data) {
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.cotizacionService
        .getReporteClienteId(data[i].IdClientes)
        .subscribe((dataReporte) => {
          if (dataReporte.length > 0) {
            console.log(dataReporte);
            this.iniciarTotales();
            for (let l = 0; l < dataReporte.length; l++) {
              this.total = this.total + +dataReporte[l].Total;
              this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
              this.arrcon[i].Docs.push(dataReporte[l]);
            }
            this.arrcon[i].TotalMXN = this.total;
            this.arrcon[i].TotalDLLS = this.totalDlls;
          } else {
            this.iniciarTotales();
          }
        });
    }
  }
  //filtro por Id Cliente
  filtroGeneralPedido(numero, data) {
    console.log('filtro general pedido');
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.pedidosService.getReporteClienteId(data[i].IdClientes).subscribe((dataReporte) => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
        } else {
          this.iniciarTotales();
        }
      });
    }
  }

  //Filtro por IdCliente y por Las Fechas 
  filtroFechaCotizacion(numero, data, fechaInicial, fechaFinal) {

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

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.cotizacionService.getReporteFechasClienteId(fecha1, fecha2, data[i].IdClientes).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.arrcon[i].Docs.push(dataReporte[l]);

          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }
  //Filtro por IdCliente y por Las Fechas 
  filtroFechaPedido(numero, data, fechaInicial, fechaFinal) {

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

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.pedidosService.getReporteFechasClienteId(fecha1, fecha2, data[i].IdClientes).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }

  //Filtro por IdCliente y Estatus
  filtroEstatusCotizacion(numero, data, estatus) {
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.cotizacionService.getReporteClienteIdEstatus(data[i].IdClientes, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }
  //Filtro por IdCliente y Estatus
  filtroEstatusPedido(numero, data, estatus) {
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.pedidosService.getReporteClienteIdEstatus(data[i].IdClientes, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }

  //Filtro por IdProveedor, Tipo de Compra (Materia Prima), por Las Fechas y Estatus de la Compra 
  filtroEstatusFechaCotizacion(numero, data, fechaInicial, fechaFinal, estatus) {

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

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.cotizacionService.getReporteFechasClienteIdEstatus(fecha1, fecha2, data[i].IdClientes, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }
  //Filtro por IdProveedor, Tipo de Compra (Materia Prima), por Las Fechas y Estatus de la Compra 
  filtroEstatusFechaPedido(numero, data, fechaInicial, fechaFinal, estatus) {

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

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Cliente
      this.cotizacionService.getReporteFechasClienteIdEstatus(fecha1, fecha2, data[i].IdClientes, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
        } else {
          this.iniciarTotales();
        }
      })
    }
  }

  exportarXLS() {
    console.log('export a excel');
    if(this.ReporteInformacion.modulo == 'Cotizacion'){
      this.sharedService.generarExcelReporteVentasCotizaciones(this.arrcon);
      
    }else if(this.ReporteInformacion.modulo == 'Pedido'){
    this.sharedService.generarExcelReporteVentasPedidos(this.arrcon);
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
