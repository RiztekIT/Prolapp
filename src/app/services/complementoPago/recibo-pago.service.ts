import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable, Subject } from 'rxjs';
import { ReciboPago } from '../../Models/ComplementoPago/recibopago';
import { PagoCFDI } from '../../Models/ComplementoPago/pagocfdi';
import { ReciboPagoMasterPagoCFDI } from '../../Models/ComplementoPago/recibopagoMasterpagoCFDI';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';

@Injectable({
  providedIn: 'root'
})
export class ReciboPagoService {

  formData = new ReciboPago();
  formDataPagoCFDI = new PagoCFDI;
  // formDataDF: DetalleFactura;
  // formDataP: Producto;
  IdReciboPago: number;
  master = new Array<ReciboPagoMasterPagoCFDI>();
  // Moneda: string;

  constructor(private http:HttpClient) { }

  // URL donde mandaremos el request al servidor para obtener los Datos de la DB
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  //Obtener Lista de ReciboPago
  getRecibosPagoList(): Observable <ReciboPago[]> {
    return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago');
  }
  //Obtener Join ReciboPago - Cliente
  getReciboPagoClienteList(): Observable <any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/ReciboPagoCliente');
  }
  //Obtener Join PagoCFDI - Factura
  getPagoCFDIFacturaList(id:number): Observable <any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/PagoCFDIFactura/'+ id);
  }
  //Obtener Lista de PagoCFDI
  //Crear Recibo Pago
  addReciboPago(reciboPago: ReciboPago) {
    return this.http.post(this.APIUrl + '/ReciboPago', reciboPago);
  }
  //Obtener Id ultimo ReciboPago
  getUltimoReciboPago(): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/ReciboPago/UltimoReciboPago');
  }
  //Obtener Recibo por IdRecibo
  getReciboId(id: number): Observable<any[]>{
    return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago/ReciboPagoId/' + id);
  }
  //Obtener Clientes de la Base de Datos
getDepDropDownValues(): Observable<any>{
  return this.http.get<Cliente[]>(this.APIUrl+'/cliente');
}
//Obtener Folio de Facturas en base a IdCliente
getClienteFacturaList(id: number): Observable<any[]>{
  return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaIdCliente/' + id)
}
//Obtener los datos del Cliente en base a una factura
  
getFacturaClienteID(id:number): Observable<any[]>{
  return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaClienteID/'+id)
}
  //Crear PagoCFDI
  //Eliminar Recibo Pago
  //Eliminar PagoCFDI

  private _listeners = new Subject<any>(); 
listen(): Observable<any> {
  return this._listeners.asObservable();
}
filter(filterBy: string) {
  this._listeners.next(filterBy);
}

}
