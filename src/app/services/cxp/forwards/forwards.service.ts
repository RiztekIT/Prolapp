import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Forwards } from '../../../Models/cxp/forwards-model';
import { environment } from 'src/environments/environment';





 

@Injectable({
  providedIn: 'root'
})
export class ForwardsService {

  formDataForwards = new Forwards();
  onadd: boolean;

  APIUrl = environment.APIUrl;

  constructor(private http: HttpClient) { }

  getForwardsList(): Observable<Forwards[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Forwards[]>(this.APIUrl + '/Forwards');
  }

  getForwardsIDList(id: number): Observable<Forwards[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Forwards[]>(this.APIUrl + '/Forwards/GetForwardID/' + id);
  }

  getUltimoForward(): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Forwards/getUltimoForward');
  }

  addForward(forward: Forwards) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Forwards', forward);
  }

  OnEditForward(forward: Forwards){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl + '/Forwards', forward)
  }

  deleteForward(id:number) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/Forwards/BorrarForward/' + id);
 
  }
 




  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }



}
