import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Forwards } from '../../../Models/cxp/forwards-model';
import { environment } from 'src/environments/environment';




export const APIUrl = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class ForwardsService {

  formDataForwards = new Forwards();
  onadd: boolean;

  constructor(private http: HttpClient) { }

  getForwardsList(): Observable<Forwards[]> {
    return this.http.get<Forwards[]>(APIUrl + '/Forwards');
  }

  getForwardsIDList(id: number): Observable<Forwards[]> {
    return this.http.get<Forwards[]>(APIUrl + '/Forwards/GetForwardID/' + id);
  }

  getUltimoForward(): Observable<any> {
    return this.http.get<any>(APIUrl + '/Forwards/getUltimoForward');
  }

  addForward(forward: Forwards) {
    return this.http.post(APIUrl + '/Forwards', forward);
  }

  OnEditForward(forward: Forwards){
    return this.http.put(APIUrl + '/Forwards', forward)
  }

  deleteForward(id:number) {
    return this.http.delete(APIUrl + '/Forwards/BorrarForward/' + id);
 
  }
 




  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }



}
