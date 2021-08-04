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
import { environment } from 'src/environments/environment';



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
   master = new Array<any>();
   Moneda: string;
   Cliente;
   saldos = new Saldos();
   tipoCambioPago;
   rfcempresa = 'PLA11011243A';
   ClaveCliente;

   Pedido;
   ClaveSAT
   

   SaldoFacturaMXN: number;
   SaldoFacturaDLLS: number;


  
   readonly APIUrl = environment.APIUrl;
  

  //Obtener lista de Facturas
  getFacturasList(): Observable <Factura[]> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<Factura[]>(this.APIUrl + '/Factura');  
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<Factura[]>(this.APIUrl + '/Factura2');  
    }

    
  }
  getFacturasListCLiente(): Observable <any[]> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<[]>(this.APIUrl + '/Factura/FacturaCliente');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<[]>(this.APIUrl + '/Factura2/FacturaCliente');
    }
    
  }
  getFacturasListCLienteProd(): Observable <any[]> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<[]>('https://erpprolapp.ddns.net:44361/api' + '/Factura/FacturaCliente');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<[]>('https://erpprolapp.ddns.net:44361/api' + '/Factura2/FacturaCliente');
    }
    
  }

  //Obtener Lista de Detalles Factura
  getDetallesFacturaList(id: number): Observable <DetalleFactura[]> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<DetalleFactura[]>(this.APIUrl + '/Factura/DetalleFactura/'+ id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<DetalleFactura[]>(this.APIUrl + '/Factura2/DetalleFactura/'+ id);
    }
    
  }
  getDetallesFacturaListProd(id: number): Observable <DetalleFactura[]> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<DetalleFactura[]>('https://erpprolapp.ddns.net:44361/api' + '/Factura/DetalleFactura/'+ id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<DetalleFactura[]>('https://erpprolapp.ddns.net:44361/api' + '/Factura2/DetalleFactura/'+ id);
    }
    
  }
  
  getDetallesFactura(): Observable <DetalleFactura[]> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<DetalleFactura[]>(this.APIUrl + '/Factura/DetalleFactura/');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<DetalleFactura[]>(this.APIUrl + '/Factura2/DetalleFactura/');
    }
    
  }

  getDetallesFacturaListProducto(id: number): Observable<any[]> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/Factura/DetalleFacturaProducto/'+ id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/Factura2/DetalleFacturaProducto/'+ id);
    }
    
  }
//!Join Tabla Factura con Cliente
  getFacturasClienteID(id:number): Observable<any[]>{
     if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaCliente/'+id)
     }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl+ '/Factura2/FacturaCliente/'+id)
     }
    
  }
  getFacturasClienteFolio(id:string): Observable<any[]>{
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaClienteFolio/'+id)
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl+ '/Factura2/FacturaClienteFolio/'+id)
    }
    
  }

  
  //Obtener los datos del Cliente en base a una factura
  
  getFacturaClienteID(id:number): Observable<any[]>{
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaClienteID/'+id)
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl+ '/Factura2/FacturaClienteID/'+id)
    }
    
  }
  getFacturaIDCliente(id:number): Observable<any[]>{
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaidCliente/'+id)
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl+ '/Factura2/FacturaidCliente/'+id)
    }
    
  }
  //Obtener ultima factura Creada
  getUltimaFactura(): Observable<any> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<Factura[]>(this.APIUrl + '/Factura/UltimaFactura');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<Factura[]>(this.APIUrl + '/Factura2/UltimaFactura');
    }
    
  }
  //Obtener Factura por Id
  getFacturaId(id:number): Observable<any> {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<Factura[]>(this.APIUrl + '/Factura/Id/' + id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<Factura[]>(this.APIUrl + '/Factura2/Id/' + id);
    }
      
    
  }

  //Obtener factura entre fechas
  getFacturasFechas(fechaini,fechafinal){
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/Factura/FacturaFechas/' + fechaini+ '/' + fechafinal);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/Factura2/FacturaFechas/' + fechaini+ '/' + fechafinal);
    }
    
  }
  // ^ Obtener factura entre fechas Reporte
  getFacturasFechasReporte(id,fechaini,fechafinal){

    console.log(this.rfcempresa);
    if (this.rfcempresa==='PLA11011243A'){
      return this.http.get<any[]>(this.APIUrl + '/Factura/FacturaFechasReporte/' + id + '/' + fechaini+ '/' + fechafinal);
     }
     else if (this.rfcempresa=='AIN140101ME3'){
       return this.http.get<any[]>(this.APIUrl + '/Factura2/FacturaFechasReporte/' + id + '/' +  fechaini+ '/' + fechafinal);
    }
    
  }

  getFacturasFechas2(fechaini,fechafinal){
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<any[]>(this.APIUrl + '/Factura/FacturaFechas/' + fechaini+ '/' + fechafinal);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<any[]>(this.APIUrl + '/Factura2/FacturaFechas2/' + fechaini+ '/' + fechafinal);
    }
    
  }
  //Obtener el ultimo Folio
  getFolio(): Observable<any>{
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.get<Factura[]>(this.APIUrl+'/Factura/Folio');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.get<Factura[]>(this.APIUrl+'/Factura2/Folio');
    }
    
  }
  //Eliminar Factura y sus Detalles de Factura
  deleteFactura(id:number) {

    if (this.rfcempresa==='PLA11011243A'){

      return this.http.delete(this.APIUrl + '/Factura/' + id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.delete(this.APIUrl + '/Factura2/' + id);
    }
    
  }
  deleteFacturaCreada() {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.delete(this.APIUrl + '/Factura/DeleteFacturaCreada');
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.delete(this.APIUrl + '/Factura2/DeleteFacturaCreada');
    }
    
  }
  // Eliminar detalle factura
  deleteDetalleFactura(id:number) {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.delete(this.APIUrl + '/Factura/DeleteDetalleFactura/' + id);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.delete(this.APIUrl + '/Factura2/DeleteDetalleFactura/' + id);
    }
    
  }
  //Insertar nueva factura
  addFactura(factura: Factura) {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.post(this.APIUrl + '/Factura', factura);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.post(this.APIUrl + '/Factura2', factura);
    }
    
  }
 //Insertar Detalle Factura
 addDetalleFactura(detalleFactura: DetalleFactura) {
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.post(this.APIUrl + '/Factura/InsertDetalleFactura', detalleFactura);
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.post(this.APIUrl + '/Factura2/InsertDetalleFactura', detalleFactura);
  }
   
  }
  //Editar Factura
  updateFactura(factura: Factura) {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.put(this.APIUrl+ '/Factura', factura);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.put(this.APIUrl+ '/Factura2', factura);
    }
  
}
updateCancelarFactura(id: number) {
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.put(this.APIUrl+ '/Factura/Cancelar/' + id, null);
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.put(this.APIUrl+ '/Factura2/Cancelar/' + id, null);
  }

}

updatePagadaFactura(id: String) {
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.put(this.APIUrl+ '/Factura/Pagada/' + id, null);
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.put(this.APIUrl+ '/Factura2/Pagada/' + id, null);
  }
  
}
  //Editar Detalle Factura
  updateDetalleFactura(detalleFactura: DetalleFactura) {
    if (this.rfcempresa==='PLA11011243A'){

      return this.http.put(this.APIUrl+ '/Factura/UpdateDetalleFactura', detalleFactura);
    }
    else if (this.rfcempresa=='AIN140101ME3'){
      return this.http.put(this.APIUrl+ '/Factura2/UpdateDetalleFactura', detalleFactura);
    }
  
}
//Obtener Productos
getProductos(): Observable<any>{
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.get<Producto[]>(this.APIUrl + '/Factura/getProductos');
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<Producto[]>(this.APIUrl + '/Factura2/getProductos');
  }
  
}
//Obtener Clientes de la Base de Datos
getDepDropDownValues(): Observable<any>{
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.get<Cliente[]>(this.APIUrl+'/cliente/Facturar');
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<Cliente[]>(this.APIUrl+'/cliente/Facturar2');
  }
  
}
//Obtener Vendedor de la Base de Datos
getvendedor(id:number): Observable<any>{
  return this.http.get<any[]>(this.APIUrl+'/vendedor/'+id);
}

//! Obtener Reportes
getReportes(id: number): Observable<any>{
   if (this.rfcempresa==='PLA11011243A'){
    return this.http.get<any[]>(this.APIUrl + '/Factura/Reporte/' + id)
   }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<any[]>(this.APIUrl + '/Factura2/Reporte/' + id)
  }
  
}
getReportesU(id: number): Observable<any>{
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.get<any[]>(this.APIUrl + '/Factura/ReporteU/' + id)
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<any[]>(this.APIUrl + '/Factura2/ReporteU/' + id)
  }
  
}
getReportesM(id: number): Observable<any>{
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.get<any[]>(this.APIUrl + '/Factura/ReporteM/' + id)
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<any[]>(this.APIUrl + '/Factura2/ReporteM/' + id)
  }
  
}

//Obtener JOIN Recibo pago-> PAgoCFDI por ID Factura
getPagosCFDI(id: number): Observable<any>{
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.get<any[]>(this.APIUrl + '/Factura/PagoCFDI/' + id)
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<any[]>(this.APIUrl + '/Factura2/PagoCFDI/' + id)
  }
  
}

addSaldos(saldo: Saldos){
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.post(this.APIUrl + '/Saldos', saldo)
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.post(this.APIUrl + '/Saldos', saldo)
  }
  
}

getSaldos(): Observable<any>{
  return this.http.get<any[]>(this.APIUrl + '/Saldos')
}

//GENERAL
  //^ Consultas generales
  getQuery(query) {
    return this.http.post(this.APIUrl + '/TraspasoMercancia/general', query);
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




//Cliente login
getFacturasListCLienteid(id: number): Observable <any[]> {
  return this.http.get<[]>(this.APIUrl + '/cliente/factura/'+ id);
}


getFacturasFechasVentas(fechaini,fechafinal){
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.get<any[]>(this.APIUrl + '/ReporteVentas/Fechas/' + fechaini+ '/' + fechafinal);
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<any[]>(this.APIUrl + '/ReporteVentas/Fechas/' + fechaini+ '/' + fechafinal);
  }
  
}

getDetallesFacturaListVentas(id: number): Observable <DetalleFactura[]> {
  if (this.rfcempresa==='PLA11011243A'){

    return this.http.get<DetalleFactura[]>(this.APIUrl + '/ReporteVentas/DetalleFactura/'+ id);
  }
  else if (this.rfcempresa=='AIN140101ME3'){
    return this.http.get<DetalleFactura[]>(this.APIUrl + '/ReporteVentas/DetalleFactura/'+ id);
  }
  
}

consultaGeneral(query){

  let consulta = {
    'consulta': query
  };
  

  return this.http.post(this.APIUrl + '/General/Consulta', consulta);
  

  
}

}
