import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CompraService } from '../../../../services/compras/compra.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SharedService } from '../../../../services/shared/shared.service';
import { CalendarioService } from 'src/app/services/calendario/calendario.service';
import { formatoReporte } from '../../../../Models/formato-reporte';
import { EnviarfacturaService } from '../../../../services/facturacioncxc/enviarfactura.service';
import Swal from 'sweetalert2';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';


@Component({
  selector: 'app-showreporte-compras',
  templateUrl: './showreporte-compras.component.html',
  styleUrls: ['./showreporte-compras.component.css']
})
export class ShowreporteComprasComponent implements OnInit {


  constructor(public comprasService: CompraService, @Inject(MAT_DIALOG_DATA) public data: any, public sharedService: SharedService,
    public EnviarfacturaService: EnviarfacturaService, public traspasoSVC: TraspasoMercanciaService,) { }

  ngOnInit() {
    this.reporteProveedor = this.data;
    console.log(this.reporteProveedor);
    console.log('%c⧭', 'color: #86bf60', this.data);
    if (this.reporteProveedor.tipoReporte == 'Ambas' || this.reporteProveedor.tipoReporte == 'MateriaPrima' || this.reporteProveedor.tipoReporte == 'Administrativa') {
      this.moneda = this.reporteProveedor.moneda;
      this.identificarTipoDeReporte(this.reporteProveedor.unsoloproveedor);

      if (this.data.tipoReporte == 'Ambas' && this.data.moneda == 'ALL') {
        this.EnviarfacturaService.titulo = 'Reporte Compras'

      } else if (this.data.tipoReporte == 'Ambas' && this.data.moneda == 'MXN') {
        this.EnviarfacturaService.titulo = 'Reporte Compras MXN'

      } else if (this.data.tipoReporte == 'Ambas' && this.data.moneda == 'DLLS') {
        this.EnviarfacturaService.titulo = 'Reporte Compras DLLS'

      }
    } else if (this.reporteProveedor.tipoReporte == 'Factura') {
      console.log('Filtro Factura');
      this.EnviarfacturaService.titulo = 'Reporte Compras Factura';
      this.obtenerReporteFacturas(this.data.idProveedor);
    }

    //Obtener reporte Proveedor(es)
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  reporteProveedor: any;
  arrcon: Array<any> = [];

  moneda: string;

  //Variables totales reporte
  total: number;
  totalDlls: number;
  pesoTotal: number;
  sacosTotales: number

  //tipoReporte
  tipoReporte: string;
  //reporteporFechas
  reporteFechas: boolean;
  //repoteporEstatus
  reporteEstatus: boolean;



  identificarTipoDeReporte(unProveedor: boolean) {
    //asignar valores del Reporte
    this.reporteFechas = this.reporteProveedor.filtradoFecha;
    this.reporteEstatus = this.reporteProveedor.estatus;
    switch (unProveedor) {
      case (true):
        console.log('ES UN SOLO PROVEEDOR');
        this.obtenerReporteUnProveedor(this.reporteProveedor.idProveedor);
        break;
      case (false):
        console.log('TODOS LOS PROVEEDORES');
        this.obtenerReporteTodosProveedores();
        break;
    }
  }


  obtenerReporteTodosProveedores() {
    this.comprasService.getProveedoresList().subscribe(dataProveedores => {
      console.log(dataProveedores);
      this.obtenerReporte(dataProveedores.length, dataProveedores);
    })
  }

  obtenerReporteUnProveedor(id: number) {
    this.comprasService.getProveedorId(id).subscribe(dataProveedor => {
      console.log(dataProveedor);
      this.obtenerReporte(dataProveedor.length, dataProveedor);
    })
  }

  obtenerReporte(numero: number, data: any) {
    this.arrcon = [];

    // ningun filtro (solo buscar por administrativo / materia prima)
    if (this.reporteFechas == false && this.reporteEstatus == false) {
      this.filtroGeneral(numero, data, this.reporteProveedor.tipoReporte);
    }
    //buscar reporte por Tipo de Compra y por Fechas
    else if (this.reporteFechas == true && this.reporteEstatus == false) {
      this.filtroFecha(numero, data, this.reporteProveedor.tipoReporte, this.reporteProveedor.fechaInicial, this.reporteProveedor.fechaFinal)
    }
    //buscar reporte por Estatus de Compra (COMPRAS QUE NO SON ADMINISTRATIVAS)
    else if (this.reporteFechas == false && this.reporteEstatus == true) {
      this.filtroEstatus(numero, data, this.reporteProveedor.tipoEstatus)
    }
    //buscar reporte por Tipo de Compra y por Fechas (COMPRAS QUE NO SON ADMINISTATIVAS)
    else if (this.reporteFechas == true && this.reporteEstatus == true) {
      this.filtroEstatusFecha(numero, data, this.reporteProveedor.fechaInicial, this.reporteProveedor.fechaFinal, this.reporteProveedor.tipoEstatus)
    }

  }


  //filtro por IdProveedor y Tipo Compra (Administrativa, MateriaPrima)
  filtroGeneral(numero, data, tipoReporte) {
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.comprasService.getReporteProveedorId(data[i].IdProveedor).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            if (tipoReporte == 'Ambas') {
              console.log('AMBOSSS');
              this.total = this.total + +dataReporte[l].Total;
              this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
              this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
              this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
              this.arrcon[i].Docs.push(dataReporte[l]);
            } else if (tipoReporte == 'MateriaPrima') {
              console.log('MATERIA PRIMA');
              if (dataReporte[l].Estatus != 'Administrativa') {
                console.log(dataReporte[l].Estatus);
                this.total = this.total + +dataReporte[l].Total;
                this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
                this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
                this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
                this.arrcon[i].Docs.push(dataReporte[l]);
              }
            } else if (tipoReporte == 'Administrativa') {
              console.log('ADMINISSSS');
              if (dataReporte[l].Estatus == 'Administrativa') {
                this.total = this.total + +dataReporte[l].Total;
                this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
                this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
                this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
                this.arrcon[i].Docs.push(dataReporte[l]);
              }
            }
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
          this.arrcon[i].sacosTotales = this.sacosTotales;
          this.arrcon[i].pesoTotal = this.pesoTotal;
        } else {
          this.iniciarTotales();
        }
      })
    }


  }
  //Filtro por IdProveedor, Tipo de Compra (Administrativa / Materia Prima) y por Las Fechas 
  filtroFecha(numero, data, tipoReporte, fechaInicial, fechaFinal) {

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
    console.log('///////////////');
    console.log(fecha1);
    console.log(fecha2);
    console.log('///////////////');

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.comprasService.getReporteFechasProveedorId(fecha1, fecha2, data[i].IdProveedor).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            if (tipoReporte == 'Ambas') {
              console.log('AMBOSSS');
              this.total = this.total + +dataReporte[l].Total;
              this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
              this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
              this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
              this.arrcon[i].Docs.push(dataReporte[l]);
            } else if (tipoReporte == 'MateriaPrima') {
              console.log('MATERIA PRIMA');
              if (dataReporte[l].Estatus != 'Administrativa') {
                console.log(dataReporte[l].Estatus);
                this.total = this.total + +dataReporte[l].Total;
                this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
                this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
                this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
                this.arrcon[i].Docs.push(dataReporte[l]);
              }
            } else if (tipoReporte == 'Administrativa') {
              console.log('ADMINISSSS');
              if (dataReporte[l].Estatus == 'Administrativa') {
                this.total = this.total + +dataReporte[l].Total;
                this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
                this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
                this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
                this.arrcon[i].Docs.push(dataReporte[l]);
              }
            }
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
          this.arrcon[i].sacosTotales = this.sacosTotales;
          this.arrcon[i].pesoTotal = this.pesoTotal;
        } else {
          this.iniciarTotales();
        }
      })
    }


  }
  //Filtro por IdProveedor y Estatus (En este caso debe de ser Compra de Materia prima)
  filtroEstatus(numero, data, estatus) {
    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.comprasService.getReporteProveedorIdEstatus(data[i].IdProveedor, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
            this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
            this.arrcon[i].Docs.push(dataReporte[l]);
          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
          this.arrcon[i].sacosTotales = this.sacosTotales;
          this.arrcon[i].pesoTotal = this.pesoTotal;
        } else {
          this.iniciarTotales();
        }
      })
    }

  }
  //Filtro por IdProveedor, Tipo de Compra (Materia Prima), por Las Fechas y Estatus de la Compra 
  filtroEstatusFecha(numero, data, fechaInicial, fechaFinal, estatus) {

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
    console.log('///////////////');
    console.log(fecha1);
    console.log(fecha2);
    console.log('///////////////');

    for (let i = 0; i < numero; i++) {
      this.arrcon[i] = data[i];
      this.arrcon[i].Docs = [];
      //Obtener Reportes por Id Proveedor
      this.comprasService.getReporteFechasProveedorIdEstatus(fecha1, fecha2, data[i].IdProveedor, estatus).subscribe(dataReporte => {
        if (dataReporte.length > 0) {
          console.log(dataReporte);
          this.iniciarTotales();
          for (let l = 0; l < dataReporte.length; l++) {
            this.total = this.total + +dataReporte[l].Total;
            this.totalDlls = this.totalDlls + +dataReporte[l].TotalDlls;
            this.sacosTotales = this.sacosTotales + +dataReporte[l].SacosTotales;
            this.pesoTotal = this.pesoTotal + +dataReporte[l].PesoTotal;
            this.arrcon[i].Docs.push(dataReporte[l]);

          }
          this.arrcon[i].TotalMXN = this.total;
          this.arrcon[i].TotalDLLS = this.totalDlls;
          this.arrcon[i].sacosTotales = this.sacosTotales;
          this.arrcon[i].pesoTotal = this.pesoTotal;
        } else {
          this.iniciarTotales();
        }
      })
    }

  }

  iniciarTotales() {
    this.total = 0;
    this.totalDlls = 0;
    this.pesoTotal = 0;
    this.sacosTotales = 0;
  }

  exportarXLS() {
    console.log('export a excel');
    this.sharedService.generarExcelReporteCompras(this.arrcon);
  }

  exportarPDF() {
    let variableFormato = new formatoReporte();
    let header;
    let nombre;
    let array = []
    if(this.EnviarfacturaService.empresa.RFC=='PLA11011243A'){
      header = variableFormato.header;
      nombre = this.EnviarfacturaService.empresa.RazonSocial;
      array[0] = -3
      array[1] = 0
      array[2] = 25  
      array[3] = 3  
    }else if(this.EnviarfacturaService.empresa.RFC=='AIN140101ME3'){
      header = variableFormato.headerAbarrotodo;
      nombre = this.EnviarfacturaService.empresa.RazonSocial;
      array[0] = -2
      array[1] = .5
      array[2] = 15  
      array[3] = 2.2 
    }
    else if(this.EnviarfacturaService.empresa.RFC=='DTM200220KRA'){
      header = variableFormato.headerAbarrotodo;
      nombre = this.EnviarfacturaService.empresa.RazonSocial;
      array[0] = -2
      array[1] = .5
      array[2] = 15  
      array[3] = 2.2 
    }
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
        // let variableFormato = new formatoReporte();
        // console.log(variableFormato);
        var totalPages = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.setTextColor(70);
        for (var i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          // pdf.addImage(variableFormato.header, "PNG", -3, 0, 25, 3)
          // pdf.text('Pro lactoIngredientes S. de R.L. M.I. de C.V.', 1, 26);
          pdf.addImage(header, "PNG", array[0], array[1], array[2], array[3])
          pdf.text(nombre, 1, 26);
          pdf.addImage(variableFormato.footer, "PNG", 18, 25, 2, 2);
        }
      }).save();
    }, 1000);
    setTimeout(() => { }, 1000);

  }

  arrayFinal: any;
  facturas = new Array<any>();
  fechaInicial = new Date();
  fechaFinal = new Date();

  obtenerReporteFacturas(idProveedor) {
    this.arrayFinal = []
    this.facturas = []


    let fecha1;
    let fecha2;


    this.fechaInicial = this.data.fechaInicial;
    this.fechaFinal = this.data.fechaFinal;

    let dia = this.fechaInicial.getDate();
    let mes = this.fechaInicial.getMonth() + 1;
    let anio = this.fechaInicial.getFullYear();
    fecha1 = anio + '-' + mes + '-' + dia

    let dia2 = this.fechaFinal.getDate();
    let mes2 = this.fechaFinal.getMonth() + 1;
    let anio2 = this.fechaFinal.getFullYear();
    fecha2 = anio2 + '-' + mes2 + '-' + dia2

    console.log(fecha1);
    console.log(fecha2);





    Swal.fire({
      title: 'Cargando ...',
      onBeforeOpen() {
        Swal.showLoading()
      },
      onAfterClose() {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    })
    let query = 'select * from Compras where FechaElaboracion between ' + "'" + fecha1 + "'" + ' and ' + "'" + fecha2 + "' and IdProveedor ="  + idProveedor;
    let consulta = {
      'consulta': query
    };
    console.log(consulta);
    this.traspasoSVC.getQuery(consulta).subscribe((dataFactura: any) => {
      console.log('%c⧭', 'color: #aa00ff', dataFactura);
      dataFactura.forEach((element, i) => {
      this.facturas[i] = dataFactura[i];
      this.facturas[i].detalles = [];

        let query2 = 'select OrdenTemporal.* from Compras left join OrdenDescarga on Compras.PO = OrdenDescarga.PO  left join OrdenTemporal on OrdenDescarga.IdOrdenDescarga = OrdenTemporal.IdOrdenDescarga where Compras.PO != '+"''"+' and IdCompra = ' + dataFactura[i].IdCompra
        let consulta2 = {
          'consulta': query2
        };
        // // console.log(consulta2);
        
        
        console.log('%c⧭', 'color: #e50000', consulta2);

        this.traspasoSVC.getQuery(consulta2).subscribe((dataDetalle: any) => {
        console.log('%c⧭', 'color: #733d00', dataDetalle);

          this.facturas[i] = dataFactura[i];
          this.facturas[i].detalles = dataDetalle;          
          this.arrayFinal = this.facturas;
          console.log(this.arrayFinal);
        })
        if (i == dataFactura.length - 1) {
          Swal.close();
        }
      });
    })
  }


  exportarPDFactura() {
    let variableFormato = new formatoReporte();
    let header;
    let nombre;
    let array = []
    if(this.EnviarfacturaService.empresa.RFC=='PLA11011243A'){
      header = variableFormato.header;
      nombre = this.EnviarfacturaService.empresa.RazonSocial;
      array[0] = -3
      array[1] = 0
      array[2] = 25  
      array[3] = 3  
    }else if(this.EnviarfacturaService.empresa.RFC=='AIN140101ME3'){
      header = variableFormato.headerAbarrotodo;
      nombre = this.EnviarfacturaService.empresa.RazonSocial;
      array[0] = -2
      array[1] = .5
      array[2] = 15  
      array[3] = 2.2 
    }else if(this.EnviarfacturaService.empresa.RFC=='DTM200220KRA'){
      header = variableFormato.headerAbarrotodo;
      nombre = this.EnviarfacturaService.empresa.RazonSocial;
      array[0] = -2
      array[1] = .5
      array[2] = 15  
      array[3] = 2.2 
    }
    setTimeout(() => {
      const content: Element = document.getElementById('pdf2');
      const option = {    
        margin: [3, .2, 3, .2],
        filename: 'Reporte.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 1, logging: true, scrollY: -2},
        jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
        pagebreak: { avoid: '.pgbreak' }
      };

      
      html2pdf().from(content).set(option).toPdf().get('pdf').then(function (pdf) {
        // console.log(variableFormato);
        var totalPages = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.setTextColor(70);
        for (var i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.addImage(header, "PNG", array[0], array[1], array[2], array[3])
          pdf.text(nombre, 1, 26);
          pdf.addImage(variableFormato.footer, "PNG", 18, 25, 2, 2);
        }
      }).save();
    }, 1000);
    setTimeout(() => { }, 1000);
  }
}
