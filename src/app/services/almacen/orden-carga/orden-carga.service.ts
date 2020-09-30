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

//export const APIUrl = "http://riztekserver.ddns.net:44361/api";
export const APIUrl = environment.APIUrl;


// export const APIUrl = "https://localhost:44361/api";

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

  getOrdenCargaList(): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(APIUrl + '/OrdenCarga');
  }

  //Obtener orden de carga por ID
  getOrdenCargaID(id: number): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(APIUrl + '/OrdenCarga/' + id);
    
  }

  getOCID(id: number): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(APIUrl + '/OrdenCarga/OrdenCargaID/' + id);
  }

  getDetalleOrdenCargaList(id: number): Observable<OrdenCarga[]> {
    return this.http.get<OrdenCarga[]>(APIUrl + '/OrdenCarga/DetalleOrdenCarga/' + id);
  }

//Obtiene todos los detalles orden de carga en base a ID ORDEN CARGA
  getOrdenCargaIDList(id: number): Observable<DetalleOrdenCarga[]> {
    return this.http.get<DetalleOrdenCarga[]>(APIUrl + '/OrdenCarga/MasterID/' + id);
  }
  getOrdenCargaIDList2(id: number): Observable<any[]> {
    return this.http.get<any[]>(APIUrl + '/OrdenCarga/ordenCargaTemporal/' + id);
  }
  //Obtener Detalle Orden Carga por ID Orden Carga, LOTE y Clave Producto
  getDetalleOrdenCargaIdLoteClave(id: number, lote: string, clave: string): Observable<DetalleOrdenCarga[]> {
    return this.http.get<DetalleOrdenCarga[]>(APIUrl + '/OrdenCarga/DetalleOrdenCarga/' + id + '/' + lote + '/' + clave);
  }

  getUltimoFolio(): Observable<any> {
    return this.http.get(APIUrl + '/OrdenCarga/UltimoFolio/');
  }

  updateOrdenCarga(ordencarga: OrdenCarga) {
    return this.http.put(APIUrl + '/OrdenCarga', ordencarga);
  }
  updatedetalleOrdenCargaEstatus(Id: number, Estatus: string) {
    return this.http.put(APIUrl + '/OrdenCarga/EstatusDetalle/' + Id + '/' + Estatus, null);
  }
  addOrdenCarga(ordencarga: OrdenCarga) {
    return this.http.post(APIUrl + '/OrdenCarga', ordencarga)
  }

  addDetalleOrdenCarga(detalleOC: DetalleOrdenCarga){
    return this.http.post(APIUrl + '/OrdenCarga/AddDetalleOrdenCarga', detalleOC)
  }

  
  deleteOrdenCarga(id: number) {
    return this.http.delete(APIUrl + '/OrdenCarga/BorrarOrdenCarga/' + id)
  }
  //Actualizar saldo de DetalleOrdenCarga por ID
  updateDetalleOrdenCargaSaldo(id: number, saldo: string) {
    return this.http.put(APIUrl + '/OrdenCarga/UpdateSaldo/' + id + '/' + saldo, null);
  }
  //get Direcciones en base a ID CLIENTE
  getDireccionID(id: number): Observable<ClienteDireccion[]> {
    return this.http.get<ClienteDireccion[]>(APIUrl + '/Pedido/DireccionID/' + id);
  }
  //get Direcciones en base a ID CLIENTE
  getDireccionesCliente(id: number): Observable<ClienteDireccion[]> {
    return this.http.get<ClienteDireccion[]>(APIUrl + '/Pedido/DireccionCliente/' + id);
  }
//agregar chofer a una OC ya creada
  updatedetalleOrdenCargaChofer(Id: number, Chofer: string) {
    return this.http.put(APIUrl + '/OrdenCarga/ChoferDetalle/' + Id + '/' + Chofer, null);
  }

  /* *************************************************** */
  /* *************************************************** */

  // *******************   REPORTES  ************************* //

    //Obtener reporte por cliente ID
    getReporteClienteId(id: number):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/GetReporteOrdenCargaCliente/'+id);
    }
//obtener reporte  por cliente ID y por estatus
    getReporteClienteIdEstatus(id:number, estatus:string):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/GetReporteOrdenCargaClienteEstatus/'+id+'/'+estatus);
    }
//obtener reporte  por Fecha Inicial / final y  cliente ID
    getReporteFechasClienteId(fechaini, fechafinal, id:number):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/GetReporteOrdenCargaFechaCliente/'+fechaini+'/'+fechafinal+'/'+id);
    }
//obtener reporte  por Fecha Inicial / final ,  cliente ID y estatus
    getReporteFechasClienteIdEstatus(fechaini, fechafinal, id:number, estatus: string):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/GetReporteOrdenCargaFechaClienteEstatus/'+fechaini+'/'+fechafinal+'/'+id+'/'+estatus);
    }

  // *******************   REPORTES  ************************* //

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