import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Bodega } from '../../Models/catalogos/bodegas-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  formData = new Bodega();

  constructor(private http:HttpClient) { }


 
  // readonly APIUrl = "http://192.168.1.67:32767/api";;
  APIUrl = environment.APIUrl;
  
  //readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  getBodegasList(): Observable <Bodega[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Bodega[]>(this.APIUrl + '/Bodega');
  }

  deleteBodega(id:number) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/Bodega/deletebodega/' + id);
 
  }

  editBodega(bodega: Bodega){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl + '/Bodega', bodega)
  }

addBodega(bodega: Bodega){
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Bodega', bodega );
}







  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }



}
