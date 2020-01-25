import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Cliente } from '../../Models/catalogos/clientes-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasPedidoService {

  constructor(private http:HttpClient) { }
  formData: Cliente;

  // readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  updateVentasPedido(reciboPago: any) {
    return this.http.put(this.APIUrl + '/ReciboPago', reciboPago);
  }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
}
