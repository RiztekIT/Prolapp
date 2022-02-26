import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddsproductosService {
  APIUrl = environment.APIUrl;
  

  constructor(private http:HttpClient) { }


  getMarcas(producto){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get(this.APIUrl + '/addproductos/marcasproductos/'+producto)
    
  }
  getOrigen(){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get(this.APIUrl + '/addproductos/origenproductos/')
    
  }
  getPresentacion(){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get(this.APIUrl + '/addproductos/presentacionproductos/')
    
  }

  insertarMovimiento(movimiento){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Producto/Movimiento',movimiento)
  }
}
