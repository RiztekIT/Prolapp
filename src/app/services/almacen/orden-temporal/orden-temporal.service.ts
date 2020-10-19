import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import {Observable, BehaviorSubject } from 'rxjs';
import {Subject} from 'rxjs';
import { OrdenTemporal } from '../../../Models/almacen/OrdenTemporal/ordenTemporal-model';
import { environment } from 'src/environments/environment';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { preOrdenTemporal } from '../../../Models/almacen/OrdenTemporal/preOrdenTemporal-model';
import { preOrdenTemporalOD } from '../../../Models/almacen/OrdenTemporal/preOrdenTemporalOD-model';
import { preOrdenTemporalODSacos } from 'src/app/Models/almacen/OrdenTemporal/preOrdenTemporalODSacos-model';

export const APIUrl = environment.APIUrl;
//export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
  providedIn: 'root'
})
export class OrdenTemporalService {

  constructor(private http:HttpClient) { }

   //Tabla previsualizacion
   preOrdenTemporal = new Array<preOrdenTemporal>();
   //Tabla previsualizacion OD
   preOrdenTemporalOD = new Array<preOrdenTemporalOD>();
   //Tabla previsualizacion OD
   preOrdenTemporalSacos = new Array<any>();
   //Posicion del arreglo a editar
   posicionOrdenTemporal: number;
   //Posicion del arreglo a editar en OD
   posicionOrdenTemporalOD: number;
   //Concepto a editar
   ordenTemporalData = new OrdenTemporal();
   //Concepto a editar en OD
   ordenTemporalDataOD = new OrdenTemporal();
   //formdata que guarda los datos de orden temporal para deplegar en pdf
   formDataOtPDF: any;
   //formdata que guarda los los datos de orden de carga para desplegar en pdf
   formDataOCPDF: any;
   //formdata que guarda los detalles de orden de carga para desplegar en pdf
   formDataOCDTPDF: any;
   //Variable para saber si el traspaso de hizo desde la tabla Orden Temporal en Orden Carga
   traspasoOrdenTemporal: boolean;
   //Objeto donde sera guardado el objeto a traspasar
   ordenTemporalt: OrdenTemporal;
   //Sacos a modificar en edit de OD
   sacosETOD: number;
   //obtener el peso del saco para sacar el peso total en edit de OD
   pesoETOD: number;


//Insertar Orden Temporal
addOrdenTemporal(oT: OrdenTemporal) {
  return this.http.post(APIUrl + '/OrdenTemporal', oT);
}
//update Orden Temporal
updateOrdenTemporal(ot: OrdenTemporal){
  return this.http.put(APIUrl + '/OrdenTemporal', ot);
}
//Obtener Orden Temporal por ID Orden Carga, LOTE y Clave Producto
getDetalleOrdenCargaIdLoteClave(id: number, lote: string, clave: string): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporal/'+ id + '/' + lote + '/' + clave);
}

//Obtener Orden Temporal por ID Orden Carga
GetOrdenTemporalID(id: number): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporalID/'+ id);
}
//Obtener Orden Temporal por ID Orden Descarga
GetOrdenTemporalIDOD(id: number): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporalIDOD/'+ id);
}
//Obtener Orden Temporal por ID Tarima
GetOrdenTemporalIdTarima(id: number): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporalIdTarima/'+ id);
}
GetOrdenTemporalIdTarimaOC(id: number, oc: number): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporalIdTarimaOC/'+ id+ '/'+oc);
}
//Obtener Orden Temporal por ID carga y qr
GetOrdenTemporalIdqr(id: number, qr: string): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporalIdqr/'+ id + '/' + qr);
}
GetOrdenTemporalIdqrOD(id: number, qr: string): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporalIdqrOD/'+ id + '/' + qr);
}
GetTracking(fechaini,fechafinal): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/tracking/' + fechaini+ '/' + fechafinal);
}
GetTrackingCliente(fechaini,fechafinal,id): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/trackingCliente/' + fechaini+ '/' + fechafinal+ '/' + id);
}

deleteOrdenTemporal(id:number){
  return this.http.delete(APIUrl + '/OrdenTemporal/BorrarOrdenTemporal/' + id)
}




  public _listeners = new BehaviorSubject<any>(1); 
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

  private _listenersOrdenTemporalSI = new Subject<any>(); 
      listenOrdenTemporalSI(): Observable<any> {
        return this._listenersOrdenTemporalSI.asObservable();
      }
      filterOrdenTemporalSI(filterBy: string) {
        this._listenersOrdenTemporalSI.next(filterBy);
      }

}
