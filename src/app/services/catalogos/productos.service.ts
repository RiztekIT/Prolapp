import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Producto } from '../../Models/catalogos/productos-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import { environment } from 'src/environments/environment';
import { MarcasProductos } from 'src/app/Models/catalogos/marcasproductos-model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http:HttpClient) { }
  formData: Producto;
  MarcasRelForm = new MarcasProductos();
  dataMarcas = new MarcasProductos();
  // formData1: Factura;




  APIUrl = environment.APIUrl;
  
  


  getProductosList(): Observable <Producto[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Producto[]>(this.APIUrl + '/producto');
  }

  addProducto(producto: Producto) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/producto', producto);
 }

 deleteProducto(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
   return this.http.delete(this.APIUrl + '/producto/' + id);

 }

 updateProducto(producto: Producto) {
  this.APIUrl = sessionStorage.getItem('API')
 return this.http.put(this.APIUrl+ '/producto', producto);
 }

//^ MARCASPRODUCTOS
GetMarcasProductos(): Observable <MarcasProductos[]> {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<MarcasProductos[]>(this.APIUrl + '/producto/GetMarcasProductos');
}

addMarcasProductos(marcasProductos: MarcasProductos) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/producto/MarcasProductos', marcasProductos);
}

deleteMarcasProductos(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.delete(this.APIUrl + '/producto/MarcasProductos/' + id);

}

updateMarcas(marcasProductos: MarcasProductos) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/producto/MarcasProductos', marcasProductos);
  }
 



  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }



}
