import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import { Observable } from 'rxjs';


  const httpOptions = {
    headers: new HttpHeaders({
      'F-Api-Key':'JDJ5JDEwJGZOWTRnNkdvSjBPTEdiRlRBNWZocE81d3dJRU52WUtNWU9SaU16MHcwbFV5MzIuVWVGTlBT',
      'F-Secret-Key':'JDJ5JDEwJGhVemxJbXUyTzhUREVTTEVvODkySk91aEI4a3Y0Rjhqd3ltWHo0a0QyTktTdkhldEp2c29X',
      'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    })
  }
    
    


  
  


@Injectable({
  providedIn: 'root'
})


export class EnviarfacturaService {
  // parche: string = 'https://cors-anywhere.herokuapp.com/'
  // parche: string = ''
  // readonly rootURL = this.parche +  "http://devfactura.in/api/v3/cfdi33/create"
  readonly rootURL = "/api/v3/cfdi33/create"

  constructor(private http: HttpClient) { }

  enviarFactura(datos:string): Observable<any>{  
    console.log(this.http.post(this.rootURL,datos,httpOptions));
    return this.http.post(this.rootURL,datos,httpOptions);  
  }

  xml(url:string){
    return this.http.get(url)
  }

  


}
