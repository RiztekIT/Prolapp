import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Producto } from '../../Models/catalogos/productos-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { Factura } from '../../Models/facturacioncxc/factura-model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http:HttpClient) { }
  formData: Producto;
  // formData1: Factura;


  readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:7002/api";


  getProductosList(): Observable <Producto[]> {
    return this.http.get<Producto[]>(this.APIUrl + '/producto');
  }

  addProducto(producto: Producto) {
    return this.http.post(this.APIUrl + '/producto', producto);
 }

 deleteProducto(id:number) {
   return this.http.delete(this.APIUrl + '/producto/' + id);

 }

 updateProducto(producto: Producto) {
 return this.http.put(this.APIUrl+ '/producto', producto);
 }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }


}
