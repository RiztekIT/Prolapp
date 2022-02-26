import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagos } from '../../Models/Pagos/pagos-model';
import { Compras } from '../../Models/Compras/compra-model';
import { FacturaFlete } from '../../Models/trafico/facturaflete-model';
import { Pedido } from '../../Models/Pedidos/pedido-model';

 
 


@Injectable({
  providedIn: 'root'
})
export class PagoscxpService {

  constructor(private http:HttpClient) { }

  //variable para saber el modulo
  modulo: string;

  objetoModulo: any;

  objetoPago: Pagos;

  //saber si es un nuevo pago (true), (flase) se editara
  nuevoPago: boolean;

  APIUrl = environment.APIUrl;

//Obtener Pagos
 getPagos(): Observable <Pagos[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Pagos[]>(this.APIUrl + '/Pagos');
}
//Obtener Pagos
getNewFolio(): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Pagos/GetNewFolio');
}
getPagoId(id: number): Observable <Pagos[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Pagos[]>(this.APIUrl + '/Pagos/GetPagoId/'+id);
}
getPagoFolio(folio: number): Observable <Pagos[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Pagos[]>(this.APIUrl + '/Pagos/GetPagoFolio/'+folio);
}
getPagoTipo(tipo: string): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Pagos/GetPagoTipo/'+tipo);
}
/* getPagoTipo(tipo: string): Observable <Pagos[]>{
  return this.http.get<Pagos[]>(this.APIUrl + '/Pagos/GetPagoTipo/'+tipo);
} */
getPagoFolioTipo(folio:number, tipo: string): Observable <Pagos[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Pagos[]>(this.APIUrl + '/Pagos/GetPagoFolioTipo/'+folio+'/'+tipo);
}

//Insert pago
addPago(pagos: Pagos) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Pagos', pagos);
}
//Update Pago
updatePago(pagos: Pagos) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Pagos', pagos);
  }
  //Eliminar Pago por IdPago
  deletePago(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl+ '/Pagos/BorrarPago/' + id);
  }

  //*******  MODULOS RELACIONADOS A PAGOS *******// 

//Obtener Compras Adminsitrativas
getComprasAdministrativas(): Observable <Compras[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Compras[]>(this.APIUrl + '/Pagos/GetComprasAdministrativas');
}
//Obtener Compras Materia Primas
getComprasMateriaPrima(): Observable <Compras[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Compras[]>(this.APIUrl + '/Pagos/GetComprasMateriaPrima');
}
//Obtener Compras Materia Primas Estatus
getComprasMateriaPrimaEstatus(estatus: string ): Observable <Compras[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Compras[]>(this.APIUrl + '/Pagos/GetComprasMateriaPrimaEstatus/'+estatus);
}
//Obtener Facturas Fletes
getFacturasFletes(): Observable <FacturaFlete[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<FacturaFlete[]>(this.APIUrl + '/Pagos/GetFletes');
}
//Obtener Facturas Fletes Estado
getFacturasFletesEstado(estado:string): Observable <FacturaFlete[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<FacturaFlete[]>(this.APIUrl + '/Pagos/GetFletesEstado/'+estado);
}
//Obtener Comisiones
getComisiones(): Observable <Pedido[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Pedido[]>(this.APIUrl + '/Pagos/GetComisiones');
}
//Obtener Comisiones Estatus
getComisionesEstatus(estado: string): Observable <Pedido[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Pedido[]>(this.APIUrl + '/Pagos/GetComisionesEstado/'+estado);
}

//Get Compra Folio
getCompraFolio(folio:number): Observable <Compras[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Compras[]>(this.APIUrl + '/Pagos/GetCompraFolio/'+folio);
}

//Gel Flete Id
getFacturaFleteId(id:number): Observable <FacturaFlete[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<FacturaFlete[]>(this.APIUrl + '/Pagos/GetFleteId/'+id);
}
//Get Comision Folio
getComisionFolio(folio:number): Observable <Pedido[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Pedido[]>(this.APIUrl + '/Pagos/GetPedidoFolio/'+folio);
}

//^ *****************  Reportes Pagos ***************** //

//^ Obtener reporte sin filtros
getReporteGeneral(): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Reportes/GetPagosGeneral');
}

//^ Obtener reporte por Tipo de Documento
getReporteTipoDocumento(documento: string): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Reportes/GetPagosTipoDocumento/'+documento);
}
//^ Obtener reporte por fecha de pago
getReporteFechas(fecha1: string, fecha2: string): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Reportes/GetPagosFechas/'+fecha1+'/'+fecha2);
}

//^ Obtener reporte por Tipo de Documento y fechas
getReporteFechasTipoDocumento(documento: string, fecha1: string, fecha2: string): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Reportes/GetPagosTipoDocumentoFechas/'+documento+'/'+fecha1+'/'+fecha2);
}
//^ *****************  Reportes Pagos ***************** //


  //*******  MODULOS RELACIONADOS A PAGOS *******// 

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}
