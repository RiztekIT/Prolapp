
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Proveedor } from '../../Models/catalogos/proveedores-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private http:HttpClient) { }
  formData: Proveedor;

  readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:7002/api";


  getProveedoresList(): Observable <Proveedor[]> {
    return this.http.get<Proveedor[]>(this.APIUrl + '/proveedor');
  }

  addProveedor(proveedor: Proveedor) {
    return this.http.post(this.APIUrl + '/proveedor', proveedor);
 }

 deleteProveedor(id:number) {
   return this.http.delete(this.APIUrl + '/proveedor/' + id);

 }

 updateProveedor(proveedor: Proveedor) {
 return this.http.put(this.APIUrl+ '/proveedor', proveedor);
 }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }




}
