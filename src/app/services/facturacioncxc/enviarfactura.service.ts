import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import { Observable, observable, throwError, Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import xml2js from 'xml2js';
import { pagoTimbre } from 'src/app/Models/ComplementoPago/pagotimbre';

// var js2xmlparser = require("js2xmlparser");


  
  const httpOptions = {
    headers: new HttpHeaders({
      'F-Api-Key':'JDJ5JDEwJEhCSnZrcnFVRFJrWU91U0hIRTBSdU9QeTIuWWlpaHo3ZHpqSy5OSTFmMGE0VWU5SDlSb3pD',
    //'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x', //Pruebas
      'F-Secret-Key':'JDJ5JDEwJDBDU1gzS3pMRnJBNFR1eC9VVUVhRS5jb0FpTEc5bXJtSDkyVHlFVC5FM3JUYlkzbUZENGZh',
      //'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t', //PRuebas
      'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    })
  }
  const httpOptions2 = {
    headers: new HttpHeaders({
      'F-Api-Key':'JDJ5JDEwJEhCSnZrcnFVRFJrWU91U0hIRTBSdU9QeTIuWWlpaHo3ZHpqSy5OSTFmMGE0VWU5SDlSb3pD',
      //'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x', //Pruebas
      'F-Secret-Key':'JDJ5JDEwJDBDU1gzS3pMRnJBNFR1eC9VVUVhRS5jb0FpTEc5bXJtSDkyVHlFVC5FM3JUYlkzbUZENGZh',
      //'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t', //Pruebas
      'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }),
    responseType: 'text' as 'json'
  }
 

  //Empresa 2
  
  const httpOptions3 = {
    headers: new HttpHeaders({
      'F-Api-Key':'JDJ5JDEwJEh1Y1RqWGRzdHNDYWxUUXlheWJ6WS4ueVp3dERQb1NtZjBFYnAweUJBdW04ZHlvVzRpcndD',
    //'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x', //Pruebas
      'F-Secret-Key':'JDJ5JDEwJEF3bXhKL2lXZVNqc3NNS0tUbWNoYS4uT0dKVS9mTHhtSE5idEQ2WjA5TUNsMTlTSENUYjZt',
      //'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t', //PRuebas
      'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    })
  }
  const httpOptions4 = {
    headers: new HttpHeaders({
      'F-Api-Key':'JDJ5JDEwJEh1Y1RqWGRzdHNDYWxUUXlheWJ6WS4ueVp3dERQb1NtZjBFYnAweUJBdW04ZHlvVzRpcndD',
      //'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x', //Pruebas
      'F-Secret-Key':'JDJ5JDEwJEF3bXhKL2lXZVNqc3NNS0tUbWNoYS4uT0dKVS9mTHhtSE5idEQ2WjA5TUNsMTlTSENUYjZt',
      //'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t', //Pruebas
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
  empresa;
  rfc;
  // parche: string = 'https://cors-anywhere.herokuapp.com/'
  // parche: string = ''
  // readonly rootURL = this.parche +  "http://devfactura.in/api/v3/cfdi33/create"
  // readonly rootURL = "/api/v3/cfdi33/create"
  readonly rootURL =  "/api/v3/cfdi33/create"
  // readonly rootURLxml = "/api/v3/cfdi33/5e06601d92802/xml"

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  saberRFC(){
    console.clear();
    console.log(this.empresa.RazonSocial);
    console.log(this.empresa.RFC);
  }

  enviarFactura(datos:string): Observable<any>{  
   
    // console.log(this.http.post(this.rootURL,datos,httpOptions));
    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.post(this.rootURL,datos,httpOptions);  
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.post(this.rootURL,datos,httpOptions3);  
    }
  }

  xml(url:string): Observable<any>{
    // let rootURLxml = "/api/v3/cfdi33/31ddcc3e-31cb-4dd0-bfdf-546ce903bd2b/xml"
    let rootURLxml = "/api/v3/cfdi33/"+ url  +"/xml";
    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.get(rootURLxml,httpOptions2);
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.get(rootURLxml,httpOptions4);
    }

    
    // let fileUrl:any;
    // const blob = new Blob([], { type: 'application/octet-stream' });    
  }
  xmlemail(url:string,folio:string): Observable<any>{

    let obs = new Observable((observer) =>{
      // console.log('entrar al obs');
      
    console.log(localStorage.getItem('pdf'+folio));
    
      // let rootURLxml = "/api/v3/cfdi33/31ddcc3e-31cb-4dd0-bfdf-546ce903bd2b/xml"
      if (localStorage.getItem('pdf'+folio)!=null){
        let rootURLxml = "/api/v3/cfdi33/"+ url  +"/xml";
        if (this.empresa.RFC==='PLA11011243A'){

          observer.next(this.http.get(rootURLxml,httpOptions2));
        }
        else if (this.empresa.RFC=='AIN140101ME3'){
          observer.next(this.http.get(rootURLxml,httpOptions4));
        }
        
        // return 
      }else{
        observer.error('error');
        // return throwError('error'); 
      }
    })

    return obs;
    
    // let fileUrl:any;
    // const blob = new Blob([], { type: 'application/octet-stream' });    
  }

  cancelar(url:string): Observable<any>{
    let rootURLxml = "/api/v3/cfdi33/"+ url  +"/cancel";

    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.get(rootURLxml,httpOptions2);
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.get(rootURLxml,httpOptions4);
    }
    

  }

  crearCliente(datos:string): Observable<any>{
    console.log(datos);
    console.log(httpOptions)
    
    let rootURLcliente = "/api/v1/clients/create";
    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.post(rootURLcliente,datos,httpOptions)
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.post(rootURLcliente,datos,httpOptions3)
    }
    
  }
  actualizarCliente(datos:string,id: string): Observable<any>{
    let rootURLcliente = "/api/v1/clients/"+id+"/update";
    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.post(rootURLcliente,datos,httpOptions)
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.post(rootURLcliente,datos,httpOptions3)
    }
    
  }
  
  unidadMedida(): Observable<any>{
    let rootURLUM = "/api/v3/catalogo/ClaveUnidad";
    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.get(rootURLUM,httpOptions2);
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.get(rootURLUM,httpOptions4);
    }
    
    
  }

  timbrarPago(pago: string): Observable<any>{
    let rootURLUM = "/api/v3/cfdi33/complemento/pagos/create";
    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.post(rootURLUM,pago,httpOptions);  
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.post(rootURLUM,pago,httpOptions3);  
    }
    
  }

  acuseCancelacion(uuid){
    if (this.empresa.RFC==='PLA11011243A'){

      return this.http.get('/api/v3/cfdi33/'+uuid+'/cancel',httpOptions)
    }
    else if (this.empresa.RFC=='AIN140101ME3'){
      return this.http.get('/api/v3/cfdi33/'+uuid+'/cancel',httpOptions3)
    }
    
    /* 
  */
  }
  


}
