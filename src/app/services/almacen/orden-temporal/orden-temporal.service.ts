import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { OrdenTemporal } from '../../../Models/almacen/OrdenTemporal/ordenTemporal-model';
import { environment } from 'src/environments/environment';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';

export const APIUrl = environment.APIUrl;
//export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
  providedIn: 'root'
})
export class OrdenTemporalService {

  constructor(private http:HttpClient) { }

   //Tabla previsualizacion
   preOrdenTemporal = new Array<OrdenTemporal>();
   //Tabla previsualizacion OD
   preOrdenTemporalOD = new Array<DetalleOrdenDescarga>();
   //Posicion del arreglo a editar
   posicionOrdenTemporal: number;
   //Concepto a editar
   ordenTemporalData = new OrdenTemporal();
   //formdata que guarda los datos de orden temporal para deplegar en pdf
   formDataOtPDF: any;
   //formdata que guarda los los datos de orden de carga para desplegar en pdf
   formDataOCPDF: any;
   //formdata que guarda los detalles de orden de carga para desplegar en pdf
   formDataOCDTPDF: any;

//Insertar Orden Temporal
addOrdenTemporal(oT: OrdenTemporal) {
  return this.http.post(APIUrl + '/OrdenTemporal', oT);
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

deleteOrdenTemporal(id:number){
  return this.http.delete(APIUrl + '/OrdenTemporal/BorrarOrdenTemporal/' + id)
}



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

}
