import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Folio } from 'src/app/Models/direccion/folio-model';
import { environment } from 'src/environments/environment';


 



@Injectable({
  providedIn: 'root'
})
export class FoliosService {

  constructor(private http:HttpClient) { }

  formData: Folio;

  APIUrl = environment.APIUrl;

  getFolios(): Observable<Folio[]> {
    return this.http.get<Folio[]>(this.APIUrl + '/folio');
  }
  updateFolios(){
    return this.http.post(this.APIUrl + '/folio', null);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  
}
