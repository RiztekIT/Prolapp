import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fleteras } from 'src/app/Models/trafico/fleteras-model';

@Injectable({
  providedIn: 'root'
})
export class FleterasService {

  dataFleteras = new Fleteras();

  constructor(private http:HttpClient) { }

  
 APIUrl = environment.APIUrl;
  


  getFleterasList(): Observable <Fleteras[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Fleteras[]>(this.APIUrl + '/Trafico/fletera');
  }

  addfleteras(fleteras: Fleteras) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Trafico', fleteras);
 }

 deletefleteras(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
   return this.http.delete(this.APIUrl + '/Trafico/' + id);

 }

 updatefleteras(fleteras: Fleteras) {
  this.APIUrl = sessionStorage.getItem('API')
 return this.http.put(this.APIUrl+ '/Trafico', fleteras);
 }


 getQuery(query) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/TraspasoMercancia/general', query);
}






}
