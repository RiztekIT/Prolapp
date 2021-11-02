import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { MasterOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/masterOrdenDescarga-model';
import { MasterDetalleOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/masterDetalleOrdenDescarga-model';
import { Tarima } from '../../../Models/almacen/Tarima/tarima-model';
import { environment } from 'src/environments/environment';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
// import { environment } from 'src/environments/environment';


//export const APIUrl = "http://riztekserver.ddns.net:44361/api";
// export const APIUrl = environment.APIUrl;
// export const APIUrl = "http://riztekserver.ddns.net:44361/api";

 


@Injectable({
  providedIn: 'root'
})
export class OrdenDescargaService {

  //form data que se llena con los datos de tarima
  formDataTarima = new Tarima();
  //form data que se llena con los datos de detalle tarima
  formDataTarimaDT = new DetalleTarima();
  APIUrl = environment.APIUrl;


  constructor(private http: HttpClient) { }

  master = new Array<MasterOrdenDescarga>();
  formrow: any;
  formData: any;
  formDTOD = new DetalleOrdenDescarga();


  getOrdenDescargaList(): Observable<OrdenDescarga[]> {
    return this.http.get<OrdenDescarga[]>(this.APIUrl + '/OrdenDescarga');
  }

  //trae los DOD dependiendo del ID de OD
  getOrdenDescargaIDList(id: number): Observable<DetalleOrdenDescarga[]> {
    return this.http.get<DetalleOrdenDescarga[]>(this.APIUrl + '/OrdenDescarga/MasterID/' + id);
  }

  getDetalleOrdenDescarga(): Observable<any> {
    return this.http.get<any[]>(this.APIUrl + '/OrdenDescarga/GetDetalleOrdenDescarga');
  }

  OnEditDetalleOrdenDescarga(dtod: DetalleOrdenDescarga) {
    return this.http.put(this.APIUrl + '/OrdenDescarga/UpdateDetalleOrdenDescarga', dtod)
  }

  getDetalleOrdenDescargaIdLoteClave(id: number, lote: string, clave: string): Observable<DetalleOrdenDescarga[]> {
    return this.http.get<DetalleOrdenDescarga[]>(this.APIUrl + '/OrdenDescarga/DetalleOrdenDescarga/' + id + '/' + lote + '/' + clave);
  }
  getDetalleOrdenDescargaIdClave(id: number, clave: string): Observable<DetalleOrdenDescarga[]> {
    return this.http.get<DetalleOrdenDescarga[]>(this.APIUrl + '/OrdenDescarga/DetalleOrdenDescargaIdClave/' + id + '/' + clave);
  }

  //get Orden Descarga por Id
  getOrdenDescargaID(id: number): Observable<OrdenDescarga> {
    return this.http.get<OrdenDescarga>(this.APIUrl + '/OrdenDescarga/GetOrdenDescargaID/' + id);
  }
  //get ultimo id Orden Descarga 
  getUltimoIdOrdenDescarga(): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/OrdenDescarga/GetUltimoIdOrdenDescarga');
  }
  //get folio y sumarle 1
  getFolioOrdenDescarga(): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/OrdenDescarga/OrdenDescargaFolio');
  }

  borrarOD(id): Observable<any>{
    return this.http.delete(this.APIUrl + '/OrdenDescarga/BorrarOrdenDescarga/'+id);
  }
  borrarDetallesOD(id): Observable<any>{
    return this.http.delete(this.APIUrl + '/OrdenDescarga/BorrarDetalleOrdenDescarga/'+id);
  }

  


  //Actualizar saldo de DetalleOrdenDescarga por ID
  updateDetalleOrdenDescargaSaldo(id: number, saldo: string) {
    return this.http.put(this.APIUrl + '/OrdenDescarga/UpdateSaldo/' + id + '/' + saldo, null);
  }
  //Agregar Orden Descarga
  addOrdenDescarga(od: OrdenDescarga) {
    return this.http.post(this.APIUrl + '/OrdenDescarga', od);
  }

  updateOrdenDescarga(od: OrdenDescarga) {
    return this.http.put(this.APIUrl + '/OrdenDescarga', od);
  }

  //Agregar Orden Descarga
  addDetalleOrdenDescarga(dod: DetalleOrdenDescarga) {
    return this.http.post(this.APIUrl + '/OrdenDescarga/AddDetalleOrdenDescarga', dod);
  }

  UpdateDtODIDLoteFechaCadFechaMFG(id: number, lote: string, fechacad: Date, fechamdf: Date) {
    return this.http.put(this.APIUrl + '/OrdenDescarga/UpdateDtODIDLoteFechaCadFechaMFG/' + id + '/' + lote + '/' + fechacad + '/' + fechamdf, null);
  }

  GetODOT(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/OrdenDescarga/GetODOT/' + id);
  }
  GetODOTQR(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/OrdenDescarga/GetODOTQR/' + id);
  }
  GetODOTTB(id: number, bodega: string): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/OrdenDescarga/GetODOTTB/' + id + '/' + bodega);
  }
  GetQROD(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/OrdenDescarga/GetQROD/' + id);
  }
  
  
  
  // *******************   REPORTES  ************************* //
  
  //Obtener reporte por Proveedor ID
  getReporteProveedorId(id: number):Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdenDescargaProveedor/'+id);
  }
  //obtener reporte  por Proveedor ID y por estatus
  getReporteProveedorIdEstatus(id:number, estatus:string):Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdeDescargaProveedorEstatus/'+id+'/'+estatus);
  }
  //obtener reporte  por Fecha Inicial / final y  Proveedor ID
  getReporteFechasProveedorId(fechaini, fechafinal, id:number):Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdenDescargaFechaProveedor/'+fechaini+'/'+fechafinal+'/'+id);
  }
  //obtener reporte  por Fecha Inicial / final ,  Proveedor ID y estatus
  getReporteFechasProveedorIdEstatus(fechaini, fechafinal, id:number, estatus: string):Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/reportes/GetReporteOrdenDescargaFechaProveedorEstatus/'+fechaini+'/'+fechafinal+'/'+id+'/'+estatus);
  }
  
  // *******************   REPORTES  ************************* //
  
  
  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
  
  private _listenersOrdenTemporal = new Subject<any>();
  listenOrdenTemporal(): Observable<any> {
    return this._listenersOrdenTemporal.asObservable();
  }
  filterOrdenTemporal(filterBy: string) {
    this._listenersOrdenTemporal.next(filterBy);
  }
  
  // *******************   COMPRAS  ************************* //
  
  GetODDOD(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/OrdenDescarga/GetODDOD/' + id);
  }




}