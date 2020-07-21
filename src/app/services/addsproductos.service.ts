import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddsproductosService {
  readonly APIUrl = environment.APIUrl;

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
}
