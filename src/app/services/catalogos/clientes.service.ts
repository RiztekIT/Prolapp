import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Cliente } from '../../Models/catalogos/clientes-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http:HttpClient) { }
  formData: Cliente;

  // readonly APIUrl = "https://localhost:44361/api";
  readonly APIUrl = "http://192.168.1.67:32767/api";


  getClientesList(): Observable <Cliente[]> {
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
  }

  addCliente(cliente: Cliente) {
    return this.http.post(this.APIUrl + '/cliente', cliente);
 }

 deleteCliente(id:number) {
   return this.http.delete(this.APIUrl + '/cliente/' + id);

 }

 updateCliente(cliente: Cliente) {
 return this.http.put(this.APIUrl+ '/cliente', cliente);
 }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
}
