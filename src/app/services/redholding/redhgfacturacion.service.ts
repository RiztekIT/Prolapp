import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Cliente } from '../../Models/catalogos/clientes-model';
import { Factura } from '../../Models/facturacioncxc/factura-model';
import { DetalleFactura, redhgDetalleFactura } from '../../Models/facturacioncxc/detalleFactura-model';
import { Producto, redhgProducto } from '../../Models/catalogos/productos-model';
import { Saldos } from 'src/app/Models/cxc/saldos-model';


import {Observable, BehaviorSubject } from 'rxjs';

import {Subject} from 'rxjs';
import { facturaMasterDetalle } from 'src/app/Models/facturacioncxc/facturamasterdetalle';
import { environment } from 'src/environments/environment';
import { Vendedor } from 'src/app/Models/catalogos/vendedores.model';


const httpOptions2 = {
  headers: new HttpHeaders({
    'F-Api-Key':'JDJ5JDEwJDBoR093UjRjTkFtRkZ1REVYNFpuMnVBVHVPd1piN2xWMS5nMFVZLzguNElhZEhPTzU4d3p5',
    //'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x', //Pruebas
    'F-Secret-Key':'JDJ5JDEwJGVzUmdrSGUweXNZSkJqTTdPc3lyQXVKVVQvYTA2N2pERmZJSGt5SkV4VEh5by5DdWxJcFo2',
    //'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t', //Pruebas
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }),
  responseType: 'text' as 'json'
}

@Injectable({
  providedIn: 'root'
})
export class RedhgfacturacionService {

  APIUrl = environment.APIUrl;
  
  rfcempresa = 'RHG160808DV4';
  formData = new Factura();
  master = new Array<any>();
  empresa = {
    IdEmpresa: 3,
RFC: 'RHG160808DV4',
RazonSocial: 'RED HOLDING GROUP S.C.',
Calle: 'JM ANCHONDO',
NumeroInterior: 'B',
NumeroExterior: '207',
CP: '31203',
Colonia: 'SAN FELIPE VIEJO',
Ciudad: 'CHIHUAHUA',
Estado: 'CHIHUAHUA',
Pais: 'MEXICO',
Regimen: ' General de Ley Personas Morales',
Foto:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAAA8AQ3AAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxA'+
'AADsQBlSsOGwAAA59pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTe'+
'k5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nPgo8cmRmOlJERiB4bWxuczpyZGY9J2h0dHA6Ly93d3cudz'+
'Mub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMnPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6QXR0cmliPSdodHR'+
'wOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvJz4KICA8QXR0cmliOkFkcz4KICAgPHJkZjpTZXE+CiAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9'+
'J1Jlc291cmNlJz4KICAgICA8QXR0cmliOkNyZWF0ZWQ+MjAyMS0wNy0yNzwvQXR0cmliOkNyZWF0ZWQ+CiAgICAgPEF0dHJpYjpFeHRJZD5hODQ1MjRmZS0wY2'+
'Y2LTRmNjctODY4Yi0wMGEyMTNiMzNkYzQ8L0F0dHJpYjpFeHRJZD4KICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4'+
'KICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgPC9yZGY6bGk+CiAgIDwvcmRmOlNlcT4KICA8L0F0dHJpYjpBZHM+Ci'+
'A8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYv'+
'MS4zLyc+CiAgPHBkZjpBdXRob3I+SXZhbiBUYWxhbWFudGVzPC9wZGY6QXV0aG9yPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbi'+
'ByZGY6YWJvdXQ9JycKICB4bWxuczp4bXA9J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8nPgogIDx4bXA6Q3JlYXRvclRvb2w+Q2FudmE8L3htcDpD'+
'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'
  }

  Moneda: string;

  ClaveCliente;
  SaldoFacturaMXN: number;
  SaldoFacturaDLLS: number;
  SaldoFacturaMXNT: number;
  SaldoFacturaDLLST: number;

  formDataDF: redhgDetalleFactura;
  formDataDFTerceros: DetalleFactura;
  saldos = new Saldos();
  Pedido;

  readonly rootURL =  "/api/v3/cfdi33/create"



  /* CLIENTES */
  formDataClientes = new Cliente();
  formDataClientesV= new Vendedor();
  formDataProductos = new redhgProducto();

  titulo;
  Idclienteservicio


  constructor(
    private http:HttpClient
  ) { }

  consultaRedhg(query){

    let consulta = {
      'consulta': query
    };
    this.APIUrl = 'https://erpprolapp.ddns.net:44361/api'

    return this.http.post(this.APIUrl + '/General/Consulta', consulta);
    

    
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

  acuseCancelacion(uuid){
  

      return this.http.get('/api/v3/cfdi33/'+uuid+'/cancel',httpOptions2)
  
    
    /* 
  */
  }

  enviarFactura(datos:string): Observable<any>{  
   
    // console.log(this.http.post(this.rootURL,datos,httpOptions));
    

      return this.http.post(this.rootURL,datos,httpOptions2);  
  
  }

  crearCliente(datos:string): Observable<any>{
    //CLIENTE ABARROTODO
    /* console.log(datos);
    console.log(httpOptions) */
    
    let rootURLcliente = "/api/v1/clients/create";
      
  
    
      return this.http.post(rootURLcliente,datos,httpOptions2)
  
    
  }


}
