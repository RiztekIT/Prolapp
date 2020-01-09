import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { Empresa } from '../../Models/Empresas/empresa-model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http:HttpClient) { }
  formData: Empresa;

  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  getEmpresaList(): Observable <Empresa[]> {
    return this.http.get<Empresa[]>(this.APIUrl + '/empresa');
  }

  updateEmpresa(empresa: Empresa) {
    return this.http.put(this.APIUrl+ '/empresa', Empresa);
    }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}
