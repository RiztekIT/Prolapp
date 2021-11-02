import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { MasterOrdenCarga } from 'src/app/Models/almacen/OrdenCarga/masterOrdenCarga-model';
import { MasterDetalleOrdenCarga } from 'src/app/Models/almacen/OrdenCarga/masterDetalleOrdenCarga-model';
import { ClienteDireccion } from 'src/app/Models/cliente-direccion/clienteDireccion-model';
import { Cliente } from '../../../Models/catalogos/clientes-model';
import { environment } from 'src/environments/environment';
import { DetalleOrdenCarga } from '../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';
import { OrdenCargaInfo } from '../../../Models/almacen/OrdenCarga/ordenCargaInfo-model';

//export const APIUrl = "http://riztekserver.ddns.net:44361/api";
 





@Injectable({
  providedIn: 'root'
})

export class OrdenCargaService {

  constructor(private http: HttpClient) { }

  //form data para guardar los datos de la Orden de Carga
  formData = new OrdenCarga;
  //form data para guardar los datos de los detalles de orden de carga
  formDataDOC:any;
  //Id Orden de Carga
  IdOrdenCarga: number;
  //Master donde se guardara el master 
  master = new Array<MasterOrdenCarga>();
  //formrow para guardar los datos del row para mostrarlos en PDF
  formrow: any;
  formDataCliente = new Cliente();
  APIUrl = environment.APIUrl;

  getOrdenCargaList(): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(this.APIUrl + '/OrdenCarga');
  }

  //Obtener orden de carga por ID
  getOrdenCargaID(id: number): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(this.APIUrl + '/OrdenCarga/' + id);
    
  }

  getOCID(id: number): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(this.APIUrl + '/OrdenCarga/OrdenCargaID/' + id);
  }

  getDetalleOrdenCargaList(id: number): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(this.APIUrl + '/OrdenCarga/DetalleOrdenCarga/' + id);
  }

//Obtiene todos los detalles orden de carga en base a ID ORDEN CARGA
  getOrdenCargaIDList(id: number): Observable<DetalleOrdenCarga[]> {
    return this.http.get<DetalleOrdenCarga[]>(this.APIUrl + '/OrdenCarga/MasterID/' + id);
  }
  getOrdenCargaIDList2(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/OrdenCarga/ordenCargaTemporal/' + id);
  }
  //Obtener Detalle Orden Carga por ID Orden Carga, LOTE y Clave Producto
  getDetalleOrdenCargaIdLoteClave(id: number, lote: string, clave: string): Observable<DetalleOrdenCarga[]> {
    return this.http.get<DetalleOrdenCarga[]>(this.APIUrl + '/OrdenCarga/DetalleOrdenCarga/' + id + '/' + lote + '/' + clave);
  }

  getUltimoFolio(): Observable<any> {
    return this.http.get(this.APIUrl + '/OrdenCarga/UltimoFolio/');
  }

  updateOrdenCarga(ordencarga: OrdenCarga) {
    return this.http.put(this.APIUrl + '/OrdenCarga', ordencarga);
  }
  updatedetalleOrdenCargaEstatus(Id: number, Estatus: string) {
    return this.http.put(this.APIUrl + '/OrdenCarga/EstatusDetalle/' + Id + '/' + Estatus, null);
  }
  addOrdenCarga(ordencarga: OrdenCarga) {
    return this.http.post(this.APIUrl + '/OrdenCarga', ordencarga)
  }
  addOrdenCarga2(ordencarga: OrdenCarga) {
    return this.http.post(this.APIUrl + '/OrdenCarga/AddOrdenCarga', ordencarga)
  }

  addDetalleOrdenCarga(detalleOC: DetalleOrdenCarga){
    return this.http.post(this.APIUrl + '/OrdenCarga/AddDetalleOrdenCarga', detalleOC)
  }
  updateDetalleOrdenCarga(detalleOC: DetalleOrdenCarga){
    return this.http.put(this.APIUrl + '/OrdenCarga/UpdateDetalleOrdenCarga', detalleOC)
  }

  
  deleteOrdenCarga(id: number) {
    return this.http.delete(this.APIUrl + '/OrdenCarga/BorrarOrdenCarga/' + id)
  }
  //Actualizar saldo de DetalleOrdenCarga por ID
  updateDetalleOrdenCargaSaldo(id: number, saldo: string) {
    return this.http.put(this.APIUrl + '/OrdenCarga/UpdateSaldo/' + id + '/' + saldo, null);
  }
  //get Direcciones en base a ID CLIENTE
  getDireccionID(id: number): Observable<ClienteDireccion[]> {
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/Pedido/DireccionID/' + id);
  }
  //get Direcciones en base a ID CLIENTE
  getDireccionesCliente(id: number): Observable<ClienteDireccion[]> {
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/Pedido/DireccionCliente/' + id);
  }
//agregar chofer a una OC ya creada
  updatedetalleOrdenCargaChofer(Id: number, Chofer: string) {
    return this.http.put(this.APIUrl + '/OrdenCarga/ChoferDetalle/' + Id + '/' + Chofer, null);
  }

  //^ Campos Extra a la Orden de Carga
  // ***************************ORDEN CARGA INFO************************ */
//^ Obtener OrdenCargaInfo por IdOrdenCargaInfo
 getOrdenCargaInfoId(id: number): Observable<OrdenCargaInfo[]> {
  return this.http.get<OrdenCargaInfo[]>(this.APIUrl + '/OrdenCarga/OrdenCargaInfoId/' + id);
}
//^ Obtener OrdenCargaInfo por IdOrdenCarga
getOrdenCargaInfoIdOC(id: number): Observable<OrdenCargaInfo[]> {
 return this.http.get<OrdenCargaInfo[]>(this.APIUrl + '/OrdenCarga/OrdenCargaInfoIdOC/' + id);
}
//^ Obtener OrdenCargaInfo por IdOrdenDescarga
getOrdenDescargaInfoIdOD(id: number): Observable<OrdenCargaInfo[]> {
 return this.http.get<OrdenCargaInfo[]>(this.APIUrl + '/OrdenCarga/OrdenCargaInfoIdOD/' + id);
}
//^ Agregar OrdenCargaInfo
addOrdenCargaInfo(ordencargainf: OrdenCargaInfo) {
  return this.http.post(this.APIUrl + '/OrdenCarga/AddOrdenCargaInfo', ordencargainf)
}
//^ Actualizar OrdenCargaInfo
updateOrdenCargaInfo(ordencargainf: OrdenCargaInfo) {
  return this.http.put(this.APIUrl + '/OrdenCarga/UpdateOrdenCargaInfo', ordencargainf)
}
//^ Eliminar OrdenCargaInfo por IdOrdenCargaInfo
deleteOrdenCargaInf(id: number) {
  return this.http.delete(this.APIUrl + '/OrdenCarga/DeleteOrdenCargaInfo/' + id)
}

  // ***************************ORDEN CARGA INFO************************ */
  

  // *******************   REPORTES  ************************* //

    //Obtener reporte por cliente ID
    getReporteClienteId(id: number):Observable<any[]>{
      return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdenCargaCliente/'+id);
    }
//obtener reporte  por cliente ID y por estatus
    getReporteClienteIdEstatus(id:number, estatus:string):Observable<any[]>{
      return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdenCargaClienteEstatus/'+id+'/'+estatus);
    }
//obtener reporte  por Fecha Inicial / final y  cliente ID
    getReporteFechasClienteId(fechaini, fechafinal, id:number):Observable<any[]>{
      return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdenCargaFechaCliente/'+fechaini+'/'+fechafinal+'/'+id);
    }
//obtener reporte  por Fecha Inicial / final ,  cliente ID y estatus
    getReporteFechasClienteIdEstatus(fechaini, fechafinal, id:number, estatus: string):Observable<any[]>{
      return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdenCargaFechaClienteEstatus/'+fechaini+'/'+fechafinal+'/'+id+'/'+estatus);
    }

  // *******************   REPORTES  ************************* //


//    // *******************   REPORTES IMPORTACION TRASPASO ************************* //
// //SE OBTIENEN LOS REPORTES DE IMPORTACION (TRAPASO) DEBIDO A QUE ESTE NO TIENE UN SERVICIO COMO TAL. Y LA INFORMACION VIENE DIRECTAMENTE DE ORDEN DE CARGA.


// //Obtener traspasos por Bodega Origen => Destino
// getReporteTraspasoBodegas(bodegaOrigen: string, bodegaDestino: string):Observable<any[]>{
//   return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegas/'+bodegaOrigen+'/'+bodegaDestino);
// }

// //Obtener traspasos por Bodega Origen => Destino y Fecha de Expedicion
// getReporteTraspasoBodegasFechas(bodegaOrigen: string, bodegaDestino: string, fecha1:string, fecha2:string):Observable<any[]>{
//   return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegasFechas/'+bodegaOrigen+'/'+bodegaDestino+'/'+fecha1+'/'+fecha2);
// }

// //Obtener traspasos por Bodega Origen => Destino y Estatus
// getReporteTraspasoBodegasEstatus(bodegaOrigen: string, bodegaDestino: string, estatus:string):Observable<any[]>{
//   return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegasEstatus/'+bodegaOrigen+'/'+bodegaDestino+'/'+estatus);
// }

// //Obtener traspasos por Bodega Origen => Destino , Fecha de Expedicion y Estatus
// getReporteTraspasoBodegasFechasEstatus(bodegaOrigen: string, bodegaDestino: string, fecha1:string, fecha2:string, estatus:string):Observable<any[]>{
//   return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegasFechasEstatus/'+bodegaOrigen+'/'+bodegaDestino+'/'+fecha1+'/'+fecha2+'/'+estatus);
// }

//     // *******************   REPORTES IMPORTACION TRASPASO ************************* //

  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }


// Subject / Metodo para Actualizar los dashboard TOTALES
  private _actualizarTotales = new Subject<any>();
  listenTotales(): Observable<any> {
    return this._actualizarTotales.asObservable();
  }
  filterTotales(estatusModulos) {
    this._actualizarTotales.next(estatusModulos);
  }

}