import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import xml2js from 'xml2js';

// var js2xmlparser = require("js2xmlparser");


  
  const httpOptions = {
    headers: new HttpHeaders({
      // 'F-Api-Key':'JDJ5JDEwJGZOWTRnNkdvSjBPTEdiRlRBNWZocE81d3dJRU52WUtNWU9SaU16MHcwbFV5MzIuVWVGTlBT',
      'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x',
      // 'F-Secret-Key':'JDJ5JDEwJGhVemxJbXUyTzhUREVTTEVvODkySk91aEI4a3Y0Rjhqd3ltWHo0a0QyTktTdkhldEp2c29X',
      'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t',
      'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    })
  }
  const httpOptions2 = {
    headers: new HttpHeaders({
      // 'F-Api-Key':'JDJ5JDEwJGZOWTRnNkdvSjBPTEdiRlRBNWZocE81d3dJRU52WUtNWU9SaU16MHcwbFV5MzIuVWVGTlBT',
      'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x',
      // 'F-Secret-Key':'JDJ5JDEwJGhVemxJbXUyTzhUREVTTEVvODkySk91aEI4a3Y0Rjhqd3ltWHo0a0QyTktTdkhldEp2c29X',
      'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t',
      'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }),
    responseType: 'text' as 'json'
  }
    
    


  
  


@Injectable({
  providedIn: 'root'
})


export class EnviarfacturaService {
  fileUrl;
  a = document.createElement('a');
  // parche: string = 'https://cors-anywhere.herokuapp.com/'
  // parche: string = ''
  // readonly rootURL = this.parche +  "http://devfactura.in/api/v3/cfdi33/create"
  // readonly rootURL = "/api/v3/cfdi33/create"
  readonly rootURL =  "/api/v3/cfdi33/create"
  // readonly rootURLxml = "/api/v3/cfdi33/5e06601d92802/xml"

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  enviarFactura(datos:string): Observable<any>{  
    // console.log(this.http.post(this.rootURL,datos,httpOptions));
    return this.http.post(this.rootURL,datos,httpOptions);  
  }

  xml(url:string): Observable<any>{
    // let rootURLxml = "/api/v3/cfdi33/31ddcc3e-31cb-4dd0-bfdf-546ce903bd2b/xml"
    let rootURLxml = "/api/v3/cfdi33/"+ url  +"/xml";


    return this.http.get(rootURLxml,httpOptions2);
    // let fileUrl:any;
    // const blob = new Blob([], { type: 'application/octet-stream' });    
  }

  cancelar(url:string): Observable<any>{
    let rootURLxml = "/api/v3/cfdi33/"+ url  +"/cancel";


    return this.http.get(rootURLxml,httpOptions2);

  }

  crearCliente(datos:string): Observable<any>{
    console.log(datos);
    
    let rootURLcliente = "/api/v1/clients/create";
    return this.http.post(rootURLcliente,datos,httpOptions)
  }
  actualizarCliente(datos:string,id: string): Observable<any>{
    let rootURLcliente = "/api/v1/clients/"+id+"/update";
    return this.http.post(rootURLcliente,datos,httpOptions)
  }
  
  unidadMedida(): Observable<any>{
    let rootURLUM = "/api/v3/catalogo/ClaveUnidad";
    return this.http.get(rootURLUM,httpOptions2);
  }
  


}
