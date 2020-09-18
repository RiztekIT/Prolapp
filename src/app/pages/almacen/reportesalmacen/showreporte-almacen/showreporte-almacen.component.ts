import { Component, OnInit, Input, SimpleChanges, Inject } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { SharedService } from "../../../../services/shared/shared.service";
import { CalendarioService } from "src/app/services/calendario/calendario.service";
import { formatoReporte } from "../../../../Models/formato-reporte";
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { ClientesService } from '../../../../services/catalogos/clientes.service';
import { ProveedoresService } from '../../../../services/catalogos/proveedores.service';
import { VentasCotizacionService } from '../../../../services/ventas/ventas-cotizacion.service';

@Component({
  selector: 'app-showreporte-almacen',
  templateUrl: './showreporte-almacen.component.html',
  styleUrls: ['./showreporte-almacen.component.css']
})
export class ShowreporteAlmacenComponent implements OnInit {

  constructor(   @Inject(MAT_DIALOG_DATA) public data: any,public sharedService: SharedService, public ocService: OrdenCargaService,
   public odService: OrdenDescargaService, public serviceTarima: TarimaService, public clienteService: ClientesService, public proveedorService: ProveedoresService,
   public cotizacionService: VentasCotizacionService) { }

  ngOnInit() {
    this.ReporteInformacion = this.data;
    console.log(this.ReporteInformacion);
    //Identificar de donde se genero el reporte
    this.identificarTipoDeReporte(this.ReporteInformacion.modulo,this.ReporteInformacion.unsolocliente);
  }

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  ReporteInformacion: any;
  arrcon: Array<any> = [];

   //Variables totales reporte
   sacos: number;
   kg: number;
   //tipoReporte
   tipoReporte: string;
   //reporteporFechas
   reporteFechas: boolean;
   //repoteporEstatus
   reporteEstatus: boolean;
 
   iniciarTotales() {
     this.sacos = 0;
     this.kg = 0;
   }

   identificarTipoDeReporte(modulo: string, unCliente: boolean) {
    console.log(unCliente);
    //asignar valores del Reporte
    this.reporteFechas = this.ReporteInformacion.filtradoFecha;
    this.reporteEstatus = this.ReporteInformacion.estatus;
    switch (modulo) {
      case ('OrdenCarga' || 'Traspaso'):
          if(unCliente == true){
              this.getunCliente(modulo, this.ReporteInformacion.idClienteProveedor);
          }else{
              this.getClientes();
          }
        break;
      case ('OrdenDescarga'):
        if(unCliente == true){
          this.getProveedor(this.ReporteInformacion.idClienteProveedor);
      }else{
          this.getProveedores();
      }
          break;
          case('Inventario'):

          break;
    }
  }

 getunCliente(modulo, id){
  console.log('Un CLiente', modulo, id);
  this.cotizacionService.GetCliente(id).subscribe((dataCliente) => {
    if(modulo == 'OrdenCarga'){
      this.obtenerReporteOrdenCarga(dataCliente.length, dataCliente);
    }else if(modulo == 'Traspaso'){
      this.obtenerReportesTraspaso(dataCliente.length, dataCliente);
    }
  });
 }

 getClientes(){
  this.cotizacionService.getDepDropDownValues().subscribe((dataClientes) => {
    console.log(dataClientes);
      this.obtenerReporteOrdenCarga(dataClientes.length, dataClientes);
  });
 }

 getProveedor(id){
    this.proveedorService.getProveedorId(id).subscribe(datapro=>{
      console.log(datapro);
      this.obtenerReporteOrdenDescarga(datapro.length, datapro);
    })
 }

getProveedores(){
  this.proveedorService.getProveedoresList().subscribe(datapro=>{
    console.log(datapro);
    this.obtenerReporteOrdenDescarga(datapro.length, datapro);
  })
}


obtenerReporteOrdenCarga(numero: number, data: any) {
  this.arrcon = [];
  // ningun filtro
  if (this.reporteFechas == false && this.reporteEstatus == false) {
    // this.filtroGeneralOrdenCarga(numero, data);
  }
  //buscar reporte por Fechas
  else if (this.reporteFechas == true && this.reporteEstatus == false) {
    // this.filtroFechaOrdenCarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
  }
  //buscar reporte por Estatus 
  else if (this.reporteFechas == false && this.reporteEstatus == true) {
    // this.filtroEstatusOrdenCarga(numero, data, this.ReporteInformacion.tipoEstatus);
  }
  //buscar reporte por  Estatus y por Fechas
  else if (this.reporteFechas == true && this.reporteEstatus == true) {
    // this.filtroEstatusFechaOrdenCarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.tipoEstatus);
  }
}

obtenerReportesTraspaso(numero: number, data:any){
  // ningun filtro
  if (this.reporteFechas == false && this.reporteEstatus == false) {
    // this.filtroGeneralOrdenCarga(numero, data);
  }
  //buscar reporte por Fechas
  else if (this.reporteFechas == true && this.reporteEstatus == false) {
    // this.filtroFechaOrdenCarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal);
  }
  //buscar reporte por Estatus 
  else if (this.reporteFechas == false && this.reporteEstatus == true) {
    // this.filtroEstatusOrdenCarga(numero, data, this.ReporteInformacion.tipoEstatus);
  }
  //buscar reporte por  Estatus y por Fechas
  else if (this.reporteFechas == true && this.reporteEstatus == true) {
    // this.filtroEstatusFechaOrdenCarga(numero, data, this.ReporteInformacion.fechaInicial, this.ReporteInformacion.fechaFinal, this.ReporteInformacion.tipoEstatus);
  }
}

obtenerReporteOrdenDescarga(numero: number, data:any){

}
  
}
