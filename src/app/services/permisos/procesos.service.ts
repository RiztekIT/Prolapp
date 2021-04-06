import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Proceso } from '../../Models/proceso-model';
import {Observable } from 'rxjs';
import { procesoMasterDetalle } from "../../Models/procesomaster-model";

import {Subject} from 'rxjs';
import { Privilegio } from '../../Models/privilegio-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  constructor(private http:HttpClient) { }
  formData: Proceso;
  master = new Array<any>();
  privilegioData: Privilegio;

  // readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";;
  readonly APIUrl = environment.APIUrl;
  //readonly APIUrl = "http://riztekserver.ddns.net:44361/api";


  getProcesoList(): Observable <Proceso[]> {
    return this.http.get<Proceso[]>(this.APIUrl + '/Proceso');
  }


  // GetProcesoArea(id:number){
  //   return this.http.get<Proceso[]>(this.APIUrl + '/Proceso/ProcesoPrivilegio/' + id);
  // }

  showAreaPrivilegio(): Observable <Proceso[]>{
     return this.http.get<any>(this.APIUrl + '/proceso/ProcesoArea/');
  }

  GetProcesoNombre(area: any, id: number): Observable <any[]>{
    return this.http.get<any>(this.APIUrl + '/proceso/ProcesoNombre/' + area + '/'+ id);
   }
  GetProcesoIdProceso(id: number): Observable <Proceso[]>{
    return this.http.get<Proceso[]>(this.APIUrl + '/proceso/ProcesoIdProceso/'+ id);
   }

   GetProcesoPrivilegio(id:number): Observable <Proceso[]>{
    return this.http.get<any>(this.APIUrl + '/proceso/ProcesoPrivilegio/' + id);
  }

  PermisoDelete(id:number, id1:number){
    return this.http.delete(this.APIUrl + '/proceso/PermisoDelete/' + id + '/' + id1 );
  }

  PermisoPost(id:number, id1:number) {
    return this.http.post(this.APIUrl + '/proceso/PermisoPost/' + id + '/' + id1,null);
 }



  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  
}

