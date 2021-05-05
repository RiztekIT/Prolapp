import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Folio } from 'src/app/Models/direccion/folio-model';
import { environment } from 'src/environments/environment';

// export const APIUrl = environment.APIUrl;
 export const APIUrl = "https://localhost:44361/api";
//export const APIUrl = "http://riztekserver.ddns.net:44361/api";


@Injectable({
  providedIn: 'root'
})
export class FoliosService {

  constructor(private http:HttpClient) { }

  formData: Folio;

  getFolios(): Observable<Folio[]> {
    return this.http.get<Folio[]>(APIUrl + '/folio');
  }
  updateFolios(){
    return this.http.post(APIUrl + '/folio', null);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  
}
