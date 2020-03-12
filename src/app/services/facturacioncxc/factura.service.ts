import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Cliente } from '../../Models/catalogos/clientes-model';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import { DetalleFactura } from '../../Models/facturacioncxc/detalleFactura-model';
import { Producto } from '../../Models/catalogos/productos-model';
import { Saldos } from 'src/app/Models/cxc/saldos-model';


import {Observable, BehaviorSubject } from 'rxjs';

import {Subject} from 'rxjs';
import { facturaMasterDetalle } from 'src/app/Models/facturacioncxc/facturamasterdetalle';



@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http:HttpClient) { }
  //  formData: Factura;
   formData = new Factura();
   saldoF;
   formDataDF: DetalleFactura;
   formDataP: Producto;
   IdFactura: number;
   master = new Array<facturaMasterDetalle>();
   Moneda: string;
   Cliente;
   saldos = new Saldos();


  // readonly APIUrl = "https://localhost:7002/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  //Obtener lista de Facturas
  getFacturasList(): Observable <Factura[]> {
    return this.http.get<Factura[]>(this.APIUrl + '/Factura');
  }
  getFacturasListCLiente(): Observable <any[]> {
    return this.http.get<[]>(this.APIUrl + '/Factura/FacturaCliente');
  }
  //Obtener Lista de Detalles Factura
  getDetallesFacturaList(id: number): Observable <DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(this.APIUrl + '/Factura/DetalleFactura/'+ id);
  }
  
  getDetallesFactura(): Observable <DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(this.APIUrl + '/Factura/DetalleFactura/');
  }

  getDetallesFacturaListProducto(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/Factura/DetalleFacturaProducto/'+ id);
  }
//Join Tabla Factura con Cliente
  getFacturasClienteID(id:number): Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaCliente/'+id)
  }
  getFacturasClienteFolio(id:string): Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaClienteFolio/'+id)
  }

  
  //Obtener los datos del Cliente en base a una factura
  
  getFacturaClienteID(id:number): Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaClienteID/'+id)
  }
  //Obtener ultima factura Creada
  getUltimaFactura(): Observable<any> {
    return this.http.get<Factura[]>(this.APIUrl + '/Factura/UltimaFactura');
  }
  //Obtener Factura por Id
  getFacturaId(id:number): Observable<any> {

      
    return this.http.get<Factura[]>(this.APIUrl + '/Factura/Id/' + id);
  }
  //Obtener el ultimo Folio
  getFolio(): Observable<any>{
    return this.http.get<Factura[]>(this.APIUrl+'/Factura/Folio');
  }
  //Eliminar Factura y sus Detalles de Factura
  deleteFactura(id:number) {
    return this.http.delete(this.APIUrl + '/Factura/' + id);
  }
  deleteFacturaCreada() {
    return this.http.delete(this.APIUrl + '/Factura/DeleteFacturaCreada');
  }
  // Eliminar detalle factura
  deleteDetalleFactura(id:number) {
    return this.http.delete(this.APIUrl + '/Factura/DeleteDetalleFactura/' + id);
  }
  //Insertar nueva factura
  addFactura(factura: Factura) {
    return this.http.post(this.APIUrl + '/Factura', factura);
  }
 //Insertar Detalle Factura
 addDetalleFactura(detalleFactura: DetalleFactura) {
   return this.http.post(this.APIUrl + '/Factura/InsertDetalleFactura', detalleFactura);
  }
  //Editar Factura
  updateFactura(factura: Factura) {
  return this.http.put(this.APIUrl+ '/Factura', factura);
}
updateCancelarFactura(id: number) {
  return this.http.put(this.APIUrl+ '/Factura/Cancelar/' + id, null);
}

updatePagadaFactura(id: String) {
  return this.http.put(this.APIUrl+ '/Factura/Pagada/' + id, null);
}
  //Editar Detalle Factura
  updateDetalleFactura(detalleFactura: DetalleFactura) {
  return this.http.put(this.APIUrl+ '/Factura/UpdateDetalleFactura', detalleFactura);
}
//Obtener Productos
getProductos(): Observable<any>{
  return this.http.get<Producto[]>(this.APIUrl + '/Factura/getProductos');
}
//Obtener Clientes de la Base de Datos
getDepDropDownValues(): Observable<any>{
  return this.http.get<Cliente[]>(this.APIUrl+'/cliente/Facturar');
}
//Obtener Vendedor de la Base de Datos
getvendedor(id:number): Observable<any>{
  return this.http.get<any[]>(this.APIUrl+'/vendedor/'+id);
}

//Obtener Reportes
getReportes(id: number): Observable<any>{
  return this.http.get<any[]>(this.APIUrl + '/Factura/Reporte/' + id)
}
getReportesU(id: number): Observable<any>{
  return this.http.get<any[]>(this.APIUrl + '/Factura/ReporteU/' + id)
}
getReportesM(id: number): Observable<any>{
  return this.http.get<any[]>(this.APIUrl + '/Factura/ReporteM/' + id)
}

//Obtener JOIN Recibo pago-> PAgoCFDI por ID Factura
getPagosCFDI(id: number): Observable<any>{
  return this.http.get<any[]>(this.APIUrl + '/Factura/PagoCFDI/' + id)
}

addSaldos(saldo: Saldos){
  return this.http.post(this.APIUrl + '/Saldos', saldo)
}


// private _listeners = new Subject<any>(); 
private _listeners = new Subject<any>(); 
listen(): Observable<any> {
  return this._listeners.asObservable();
}
filter(filterBy: string) {
  // this._listeners.
  
  this._listeners.next(filterBy);
  // this._listeners.complete();
}
private _listeners2 = new Subject<any>(); 
listen2(): Observable<any> {
  return this._listeners2.asObservable();
}
filter2(filterBy: string) {
  this._listeners2.next(filterBy);
}
}
