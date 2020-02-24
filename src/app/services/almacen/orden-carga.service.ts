import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OrdenCarga } from '../../Models/almacen/ordencarga.model';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';

export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
    providedIn: 'root'
  })

  export class OrdenCargaService {

    constructor(private http:HttpClient) { }

    formData = new OrdenCarga;

    getOrdenCargaList(): Observable <OrdenCarga[]> {
        return this.http.get<OrdenCarga[]>(APIUrl + '/OrdenCarga');
      }
    getDetalleOrdenCargaList(id: number): Observable <OrdenCarga[]> {
        return this.http.get<OrdenCarga[]>(APIUrl + '/OrdenCarga/DetalleOrdenCarga/' + id);
      }

    updateOrdenCarga(ordencarga: OrdenCarga) {
        return this.http.put(APIUrl+ '/OrdenCarga', ordencarga);
        } 
    addOrdenCarga(ordencarga: OrdenCarga){
        return this.http.post(APIUrl + '/OrdenCarga', ordencarga )          
    }
    deleteOrdenCarga(id: number){
        return this.http.delete(APIUrl +'/OrdenCarga/BorrarOrdenCarga/'+ id)
      }
      
      private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }

  }