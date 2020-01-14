import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';


import {Subject} from 'rxjs';
import { Empresa } from '../../Models/Empresas/empresa-model';

export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  

  constructor(private http:HttpClient) { }
  formData: Empresa;

  EmpresaFoto: Empresa;

  getEmpresaList(): Observable <Empresa[]> {
    return this.http.get<Empresa[]>(APIUrl + '/empresa');
  }

  getEmpresaFoto():Observable <any>{
    return this.http.get<any>(APIUrl + '/empresa/EmpresaFoto');
  }

  updateEmpresa(empresa: Empresa) {
    return this.http.put(APIUrl+ '/empresa', empresa);
    }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }




}

