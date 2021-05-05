import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddsproductosService {
  // readonly APIUrl = environment.APIUrl;
  readonly APIUrl = "https://localhost:44361/api";

  constructor(private http:HttpClient) { }


  getMarcas(producto){

    return this.http.get(this.APIUrl + '/addproductos/marcasproductos/'+producto)
    
  }
  getOrigen(){

    return this.http.get(this.APIUrl + '/addproductos/origenproductos/')
    
  }
  getPresentacion(){

    return this.http.get(this.APIUrl + '/addproductos/presentacionproductos/')
    
  }

  insertarMovimiento(movimiento){
    return this.http.post(this.APIUrl + '/Producto/Movimiento',movimiento)
  }
}
