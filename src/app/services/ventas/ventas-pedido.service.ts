import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Cliente } from '../../Models/catalogos/clientes-model';
import { Producto } from "../../Models/catalogos/productos-model";
import { DetallePedido } from "../../Models/Pedidos/detallePedido-model";
import {Observable,Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Pedido } from '../../Models/Pedidos/pedido-model';



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
export class VentasPedidoService {

  
  

  constructor(private http:HttpClient, private sanitizer: DomSanitizer) { }
  formData= new Cliente();
  formProd= new Producto();
  formDataDP: DetallePedido;
  formDataP = new Pedido();
  Moneda: string;

  // readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";




  updateVentasPedido(reciboPago: any) {
    return this.http.put(this.APIUrl + '/ReciboPago', reciboPago);
  }

  GetCliente(id:number): Observable <Cliente[]>{
    return this.http.get<any>(this.APIUrl + '/Cliente/id/' + id);
  }

  getDepDropDownValues(): Observable<any> {
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
  }

  getDepDropDownValues2(): Observable<any> {
    return this.http.get<Cliente[]>(this.APIUrl + '/producto');
  }

  //Get Unidades De Medida
  unidadMedida(): Observable<any>{
    let rootURLUM = "/api/v3/catalogo/ClaveUnidad";
    return this.http.get(rootURLUM,httpOptions2);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
}
