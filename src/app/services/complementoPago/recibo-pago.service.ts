import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ReciboPago } from '../../Models/ComplementoPago/recibopago';
import { PagoCFDI } from '../../Models/ComplementoPago/pagocfdi';
import { ReciboPagoMasterPagoCFDI } from '../../Models/ComplementoPago/recibopagoMasterpagoCFDI';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';

@Injectable({
  providedIn: 'root'
})
export class ReciboPagoService {

  formt: any;

  formData = new ReciboPago();
  formDataPagoCFDI = new PagoCFDI();

  //formData pago de CFDI cuando se edita 
  formDataPagoCFDIEdit = new PagoCFDI();

  //Saldo Complemento de Pago
  SaldoComplementoPago: number;


  // formDataDF: DetalleFactura;
  // formDataP: Producto;
  IdReciboPago: number;
  master = new Array<ReciboPagoMasterPagoCFDI>();
  // Moneda: string;
  //Total de Recibo de Pago
  // Total: any;

  constructor(private http: HttpClient) { }

  // URL donde mandaremos el request al servidor para obtener los Datos de la DB
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  //Obtener Lista de ReciboPago
  getRecibosPagoList(): Observable<ReciboPago[]> {
    return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago');
  }
  //Obtener Join ReciboPago - Cliente
  getReciboPagoClienteList(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/ReciboPagoCliente');
  }
  //Obtener Join PagoCFDI - Factura
  getPagoCFDIFacturaList(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/PagoCFDIFactura/' + id);
  }
  //Obtener Lista de PagoCFDI
  //Crear Recibo Pago
  addReciboPago(reciboPago: ReciboPago) {
    return this.http.post(this.APIUrl + '/ReciboPago', reciboPago);
  }
  //Update Recibo Pago
  updateReciboPago(reciboPago: ReciboPago) {
    return this.http.put(this.APIUrl + '/ReciboPago', reciboPago);
  }
  //Obtener Id ultimo ReciboPago
  getUltimoReciboPago(): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/ReciboPago/UltimoReciboPago');
  }
  //Obtener Recibo por IdRecibo
  getReciboId(id: number): Observable<any[]> {
    return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago/ReciboPagoId/' + id);
  }
  //Obtener Clientes de la Base de Datos
  getDepDropDownValues(): Observable<any> {
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
  }
  //Obtener Folio de Facturas en base a IdCliente
  getClienteFacturaList(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaIdCliente/' + id);
  }
  //Obtener los datos del Cliente en base a una factura
  getFacturaClienteID(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/Factura/FacturaClienteID/' + id);
  }
  //Obtener Folio de las Facturas que Correspondan con el IdCliente, Esten Timbradas, Tengan saldo pendiente
  getFacturaPagoCFDI(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaPagoCFDI/' + id);
  }
  //Obtener Lista de PagosCFDI en base a un ReciboPago
  getReciboPagosCFDI(id: number): Observable<PagoCFDI[]> {
    return this.http.get<PagoCFDI[]>(this.APIUrl + '/ReciboPago/ReciboPagoCFDI/' + id);
  }
  //Obtener Folio de las Facturas que correspondan con el IdCliente, esten timbradas (Se ejecutara cundo no haya un pagoCFDI previo)
  getFacturaPrimerPagoCFDI(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaPrimerPagoCFDI/' + id);
  }
  //Obtener el NoParcialidad de Cierta Factura
  getNoParcialidad(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/UltimoNoParcialidad/' + id);
  }
  //Crear PagoCFDI
  addPagoCFDI(pagoCFDI: PagoCFDI) {
    return this.http.post(this.APIUrl + '/ReciboPago/PagoCFDI', pagoCFDI);
  }
  //Update PagoCFDI
  updatePagoCFDI(pagoCFDI: PagoCFDI) {
    return this.http.put(this.APIUrl + '/ReciboPago/PagoCFDI', pagoCFDI);
  }
  //Eliminar Recibo Pago
  deleteReciboPago(id: number) {
    return this.http.delete(this.APIUrl + '/ReciboPago/' + id);
  }

  deleteReciboCreado(){
    return this.http.delete(this.APIUrl + '/ReciboPago/DeletePagoCreado/');
  }
  //Eliminar PagoCFDI
  deletePagoCFDI(id: number) {
    return this.http.delete(this.APIUrl + '/ReciboPago/PagoCFDI/' + id);

  }
  //Obtener el Total de cierta Factura
  getTotalFactura(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/TotalFactura/' + id);
  }
  //Obtener la lista CFDI dependiendo del IdFactura
  getPagoCFDIFacturaID(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ReciboPago/PagoCFDIFacturaID/' + id);
  }
  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}
