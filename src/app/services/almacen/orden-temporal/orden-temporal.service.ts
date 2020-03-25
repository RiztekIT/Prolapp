import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { OrdenTemporal } from '../../../Models/almacen/OrdenTemporal/ordenTemporal-model';
import { environment } from 'src/environments/environment';

export const APIUrl = environment.APIUrl;
//export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
  providedIn: 'root'
})
export class OrdenTemporalService {

  constructor(private http:HttpClient) { }

//Insertar Orden Temporal
addOrdenTemporal(oT: OrdenTemporal) {
  return this.http.post(APIUrl + '/OrdenTemporal', oT);
}
//Obtener Orden Temporal por ID Orden Carga, LOTE y Clave Producto
getDetalleOrdenCargaIdLoteClave(id: number, lote: string, clave: string): Observable <OrdenTemporal[]>{
  return this.http.get<OrdenTemporal[]>(APIUrl + '/OrdenTemporal/OrdenTemporal/'+ id + '/' + lote + '/' + clave);
}



  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }

}