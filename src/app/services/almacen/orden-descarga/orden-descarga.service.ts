import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { MasterOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/masterOrdenDescarga-model';
import { MasterDetalleOrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/masterDetalleOrdenDescarga-model';
import { Tarima } from '../../../Models/almacen/Tarima/tarima-model';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';


export const APIUrl = "http://riztekserver.ddns.net:44361/api";
// export const APIUrl = "https://localhost:44361/api";

@Injectable({
  providedIn: 'root'
})
export class OrdenDescargaService {

//form data que se llena con los datos de tarima
formDataTarima = new Tarima();
//form data que se llena con los datos de detalle tarima
formDataTarimaDT = new DetalleTarima();




  constructor( private http:HttpClient) { }

  master = new Array<MasterOrdenDescarga>();
  formrow: any;
  formData: any;


  getOrdenDescargaList(): Observable <OrdenDescarga[]> {
    return this.http.get<OrdenDescarga[]>(APIUrl + '/OrdenDescarga');
  }

  //JOIN DETALLES, TARIMA, TARIMA DETALLES
  getOrdenDescargaIDList(id: number): Observable <MasterDetalleOrdenDescarga[]>{
    return this.http.get<MasterDetalleOrdenDescarga[]>(APIUrl + '/OrdenDescarga/MasterID/'+ id);
  }

  private _listeners = new Subject<any>(); 
        listen(): Observable<any> {
          return this._listeners.asObservable();
        }
        filter(filterBy: string) {
          this._listeners.next(filterBy);
        }
}