import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Cliente } from '../../Models/catalogos/clientes-model';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import { DetalleFactura } from '../../Models/facturacioncxc/detalleFactura-model';
import { Producto } from '../../Models/catalogos/productos-model';

import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { facturaMasterDetalle } from 'src/app/Models/facturacioncxc/facturamasterdetalle';



@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http:HttpClient) { }
  //  formData: Factura;
   formData = new Factura();
   formDataDF: DetalleFactura;
   formDataP: Producto;
   IdFactura: number;
   master = new Array<facturaMasterDetalle>();


  // readonly APIUrl = "https://localhost:7002/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  //Obtener lista de Facturas
  getFacturasList(): Observable <Factura[]> {
    return this.http.get<Factura[]>(this.APIUrl + '/Factura');
  }
  getFacturasListCLiente(): Observable <any[]> {
    return this.http.get<any[]>(this.APIUrl + '/Factura/FacturaCliente');
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

  getFacturasClienteID(id:number): Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl+ '/Factura/FacturaCliente/'+id)
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
  return this.http.get<Cliente[]>(this.APIUrl+'/cliente');
}

private _listeners = new Subject<any>(); 
listen(): Observable<any> {
  return this._listeners.asObservable();
}
filter(filterBy: string) {
  this._listeners.next(filterBy);
}
}
