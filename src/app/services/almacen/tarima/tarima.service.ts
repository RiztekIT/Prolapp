import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';

export const APIUrl = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class TarimaService {

  constructor(private http:HttpClient) { }

  //Obtener Cierto detalle de Tarima por IdTarima
getDetalleTarimaID(id: number): Observable <DetalleTarima[]>{
  return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaID/'+ id);
}

  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }
}