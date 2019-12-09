import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Producto } from '../../Models/catalogos/productos-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http:HttpClient) { }
  formData: Producto;


  readonly APIUrl = "https://localhost:44361/api";


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
 return this.http.put(this.APIUrl+ '/usuario', producto);
 }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }


}
