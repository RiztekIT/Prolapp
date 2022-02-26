import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ReciboPago } from '../../Models/ComplementoPago/recibopago';
import { PagoCFDI } from '../../Models/ComplementoPago/pagocfdi';
import { ReciboPagoMasterPagoCFDI } from '../../Models/ComplementoPago/recibopagoMasterpagoCFDI';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReciboPagoService {

  formt: any;
  tipoCambioPago;

  formData = new ReciboPago();
  row;
  formDataPagoCFDI = new PagoCFDI();

  //formData pago de CFDI cuando se edita 
  formDataPagoCFDIEdit = new PagoCFDI();

  //Saldo Complemento de Pago
  SaldoComplementoPago: number;

  //Saldo de la Factura
  SaldoFactura: number;
  //rfcempresa = 'PLA11011243A';
  rfcempresa = 'PLA11011243A';

  // formDataDF: DetalleFactura;
  // formDataP: Producto;
  IdReciboPago: number;
  master = new Array<ReciboPagoMasterPagoCFDI>();
  ClaveCliente;
  // Moneda: string;
  //Total de Recibo de Pago
  // Total: any;

  constructor(private http: HttpClient) { }

  // URL donde mandaremos el request al servidor para obtener los Datos de la DB
  APIUrl = environment.APIUrl;
  

  //Obtener Lista de ReciboPago
  getRecibosPagoList(): Observable<ReciboPago[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago2');
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago3');
    }

    
  }
  //Obtener Join ReciboPago - Cliente
  getReciboPagoClienteList(): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    this.APIUrl = environment.APIUrl;
    if (this.rfcempresa==='PLA11011243A'){

     
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/ReciboPagoCliente');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/ReciboPagoCliente');
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/ReciboPagoCliente');
    }
  }
  //Obtener Join PagoCFDI - Factura
  getPagoCFDIFacturaList(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/PagoCFDIFactura/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/PagoCFDIFactura/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/PagoCFDIFactura/' + id);
    }
  }
  //Obtener Lista de PagoCFDI
  //Crear Recibo Pago
  addReciboPago(reciboPago: ReciboPago) {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.post(this.APIUrl + '/ReciboPago', reciboPago);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.post(this.APIUrl + '/ReciboPago2', reciboPago);
    } else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.post(this.APIUrl + '/ReciboPago3', reciboPago);
    }
  }
  //Update Recibo Pago
  updateReciboPago(reciboPago: ReciboPago) {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.put(this.APIUrl + '/ReciboPago', reciboPago);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.put(this.APIUrl + '/ReciboPago2', reciboPago);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.put(this.APIUrl + '/ReciboPago3', reciboPago);
    }
  }
  //Obtener Id ultimo ReciboPago
  getUltimoReciboPago(): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any>(this.APIUrl + '/ReciboPago/UltimoReciboPago');
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any>(this.APIUrl + '/ReciboPago2/UltimoReciboPago');
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any>(this.APIUrl + '/ReciboPago3/UltimoReciboPago');
    }
  }
  //Obtener Recibo por IdRecibo
  getReciboId(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago/ReciboPagoId/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago2/ReciboPagoId/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago3/ReciboPagoId/' + id);
    }
  }
  //Obtener Clientes de la Base de Datos
  getDepDropDownValues(): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<Cliente[]>(this.APIUrl + '/cliente2');
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<Cliente[]>(this.APIUrl + '/cliente3');
    }
  }
  //Obtener Folio de Facturas en base a IdCliente
  getClienteFacturaList(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaIdCliente/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/FacturaIdCliente/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/FacturaIdCliente/' + id);
    }
  }
  //Obtener los datos del Cliente en base a una factura
  getFacturaClienteID(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/Factura/FacturaClienteID/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/Factura2/FacturaClienteID/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/Factura3/FacturaClienteID/' + id);
    }
  }
  //Obtener Folio de las Facturas que Correspondan con el IdCliente, Esten Timbradas, Tengan saldo pendiente
  getFacturaPagoCFDI(id: number, folio: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaPagoCFDI/' + id + '/'+ folio);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/FacturaPagoCFDI/' + id + '/'+ folio);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/FacturaPagoCFDI/' + id + '/'+ folio);
    }
  }
  getFacturaPagoCFDIDlls(id: number, folio: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaPagoCFDIDlls/' + id + '/'+ folio);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/FacturaPagoCFDIDlls/' + id + '/'+ folio);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/FacturaPagoCFDIDlls/' + id + '/'+ folio);
    }
  }
  //Obtener Lista de PagosCFDI en base a un ReciboPago
  getReciboPagosCFDI(id: number): Observable<PagoCFDI[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

     
      return this.http.get<PagoCFDI[]>(this.APIUrl + '/ReciboPago/ReciboPagoCFDI/' + id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<PagoCFDI[]>(this.APIUrl + '/ReciboPago2/ReciboPagoCFDI/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<PagoCFDI[]>(this.APIUrl + '/ReciboPago3/ReciboPagoCFDI/' + id);
    }
  }
  //Obtener Folio de las Facturas que correspondan con el IdCliente, esten timbradas (Se ejecutara cundo no haya un pagoCFDI previo)
  getFacturaPrimerPagoCFDI(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/FacturaPrimerPagoCFDI/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/FacturaPrimerPagoCFDI/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/FacturaPrimerPagoCFDI/' + id);
    }
  }
  //Obtener el NoParcialidad de Cierta Factura
  getNoParcialidad(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/UltimoNoParcialidad/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/UltimoNoParcialidad/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/UltimoNoParcialidad/' + id);
    }
  }
  //Crear PagoCFDI
  addPagoCFDI(pagoCFDI: PagoCFDI) {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

     
      return this.http.post(this.APIUrl + '/ReciboPago/PagoCFDI', pagoCFDI);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.post(this.APIUrl + '/ReciboPago2/PagoCFDI', pagoCFDI);
    } else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.post(this.APIUrl + '/ReciboPago3/PagoCFDI', pagoCFDI);
    }
  }
  //Update PagoCFDI
  updatePagoCFDI(pagoCFDI: PagoCFDI) {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.put(this.APIUrl + '/ReciboPago/PagoCFDI', pagoCFDI);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.put(this.APIUrl + '/ReciboPago2/PagoCFDI', pagoCFDI);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.put(this.APIUrl + '/ReciboPago3/PagoCFDI', pagoCFDI);
    }
  }
  //Eliminar Recibo Pago
  deleteReciboPago(id: number) {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.delete(this.APIUrl + '/ReciboPago/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.delete(this.APIUrl + '/ReciboPago2/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.delete(this.APIUrl + '/ReciboPago3/' + id);
    }
  }

  deleteReciboCreado(){
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

     
      return this.http.delete(this.APIUrl + '/ReciboPago/DeletePagoCreado/');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.delete(this.APIUrl + '/ReciboPago2/DeletePagoCreado/');
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.delete(this.APIUrl + '/ReciboPago3/DeletePagoCreado/');
    }
  }
  //Eliminar PagoCFDI
  deletePagoCFDI(id: number) {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

     
      return this.http.delete(this.APIUrl + '/ReciboPago/PagoCFDI/' + id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.delete(this.APIUrl + '/ReciboPago2/PagoCFDI/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.delete(this.APIUrl + '/ReciboPago3/PagoCFDI/' + id);
    }

  }
  //Obtener el Total de cierta Factura
  getTotalFactura(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/TotalFactura/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/TotalFactura/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/TotalFactura/' + id);
    }
  }
  //Obtener la lista CFDI dependiendo del IdFactura
  getPagoCFDIFacturaID(id: number): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/ReciboPago/PagoCFDIFacturaID/' + id);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago2/PagoCFDIFacturaID/' + id);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.get<any[]>(this.APIUrl + '/ReciboPago3/PagoCFDIFacturaID/' + id);
    }
  }

  cancelarPagoCFDI(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.put(this.APIUrl + '/ReciboPago/CancelarPagoCFDI?id='+ id,null);
     
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.put(this.APIUrl + '/ReciboPago2/CancelarPagoCFDI?id='+ id,null);
    }
    else if (this.rfcempresa=='DTM200220KRA'){
      return this.http.put(this.APIUrl + '/ReciboPago3/CancelarPagoCFDI?id='+ id,null);
    }
  }



  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }



  // recibo de pago cliente login

    //Obtener Recibo por IdRecibo
    getReciboClienteId(id: number): Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/cliente/complementodepago/' + id);
    }

}
