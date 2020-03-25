import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { MasterOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/masterOrdenDescarga-model';
import { MasterDetalleOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/masterDetalleOrdenDescarga-model';


export const APIUrl = "http://riztekserver.ddns.net:44361/api";
// export const APIUrl = "https://localhost:44361/api";

@Injectable({
  providedIn: 'root'
})
export class OrdenDescargaService {

  constructor( private http:HttpClient) { }

  master = new Array<MasterOrdenDescarga>();


  getOrdenDescargaList(): Observable <OrdenDescarga[]> {
    return this.http.get<OrdenDescarga[]>(APIUrl + '/OrdenDescarga');
  }

  //JOIN DETALLES, TARIMA, TARIMA DETALLES
  getOrdenDescargaIDList(id: number): Observable <MasterDetalleOrdenDescarga[]>{
    return this.http.get<MasterDetalleOrdenDescarga[]>(APIUrl + '/OrdenCarga/MasterID/'+ id);
  }



  private _listeners = new Subject<any>(); 
        listen(): Observable<any> {
          return this._listeners.asObservable();
        }
        filter(filterBy: string) {
          this._listeners.next(filterBy);
        }
}