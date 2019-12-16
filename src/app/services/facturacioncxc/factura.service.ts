import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Cliente } from '../../Models/catalogos/clientes-model';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http:HttpClient) { }
   formData: Factura;


  readonly APIUrl = "https://localhost:44361/api";

  //Obtener Clientes de la Base de Datos
  getDepDropDownValues(): Observable<any>{
    return this.http.get<Cliente[]>(this.APIUrl+'/cliente');
  }
  
    private _listeners = new Subject<any>(); 
    listen(): Observable<any> {
      return this._listeners.asObservable();
    }
    filter(filterBy: string) {
      this._listeners.next(filterBy);
    }
}
