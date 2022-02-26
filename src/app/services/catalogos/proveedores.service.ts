
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Proveedor } from '../../Models/catalogos/proveedores-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private http:HttpClient) { }
  formData: Proveedor;

  
  
  APIUrl = environment.APIUrl;
  
  


  getProveedoresList(): Observable <Proveedor[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Proveedor[]>(this.APIUrl + '/proveedor');
  }
  getProveedorId(id: number): Observable <Proveedor[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Proveedor[]>(this.APIUrl + '/proveedor/getProveedorId/'+id);
  }

  addProveedor(proveedor: Proveedor) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/proveedor', proveedor);
 }

  generarConsulta(consulta) {
    let query = {
      'consulta':consulta
    };
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/proveedor/consulta', query);
 }



 deleteProveedor(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
   return this.http.delete(this.APIUrl + '/proveedor/' + id);

 }

 updateProveedor(proveedor: Proveedor) {
  this.APIUrl = sessionStorage.getItem('API')
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
