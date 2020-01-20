import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Proceso } from '../../Models/proceso-model';
import {Observable } from 'rxjs';
import { procesoMasterDetalle } from "../../Models/procesomaster-model";

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  constructor(private http:HttpClient) { }
  formData: Proceso;
  master = new Array<procesoMasterDetalle>();

  // readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";;
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";


  getProcesoList(): Observable <Proceso[]> {
    return this.http.get<Proceso[]>(this.APIUrl + '/Proceso');
  }


  // GetProcesoArea(id:number){
  //   return this.http.get<Proceso[]>(this.APIUrl + '/Proceso/ProcesoPrivilegio/' + id);
  // }

  showAreaPrivilegio(id:number): Observable <Proceso[]>{
     return this.http.get<any>(this.APIUrl + '/proceso/ProcesoArea/');
  }

  GetProcesoNombre(area: any): Observable <any[]>{
    return this.http.get<any>(this.APIUrl + '/proceso/ProcesoNombre/' + area);
   }

   GetProcesoPrivilegio(id:number): Observable <Proceso[]>{
    return this.http.get<any>(this.APIUrl + '/proceso/ProcesoPrivilegio/' + id);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  
}

