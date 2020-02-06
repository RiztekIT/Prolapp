import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Cliente } from '../../Models/catalogos/clientes-model';
import { Producto } from "../../Models/catalogos/productos-model";
import { DetallePedido } from "../../Models/Pedidos/detallePedido-model";
import {Observable,Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Pedido } from '../../Models/Pedidos/pedido-model';
import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';



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
  formDataPedido = new Pedido();
  master = new Array<pedidoMaster>();
  Moneda: string;
  IdPedido: number;
  IdCliente : number;

  // readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";




  updateVentasPedido(pedido: any) {
    return this.http.put(this.APIUrl + '/Pedido', pedido);
  }

  GetCliente(id:number): Observable <Cliente[]>{
    return this.http.get<any>(this.APIUrl + '/Cliente/id/' + id);
  }

  //Get Pedido por IdPedido
  getPedidoId(id: number): Observable <Pedido[]>{
    return this.http.get<Pedido []>(this.APIUrl + '/Pedido/PedidoId/' + id);
  }

  //Get JOIN pedido-cliente
  getPedidoCliente(): Observable <any>{
    return this.http.get<any>(this.APIUrl + '/Pedido/PedidoCliente');
  }
  //Get Detalles Pedido en base a IdPedido
  getDetallePedidoId(id: number): Observable <any>{
    return this.http.get<any>(this.APIUrl + '/Pedido/DetallePedidoId/'+ id);
  }

  //Get Ultimo pedido
  getUltimoPedido(): Observable <any>{
    return this.http.get<any>(this.APIUrl + '/Pedido/UltimoPedido');
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

  getPedidoList(): Observable <Pedido[]> {
    return this.http.get<Pedido[]>(this.APIUrl + '/pedido');
  }

  //crear un pedido nuevo (insert)
  addPedido(pedido: Pedido){
    return this.http.post(this.APIUrl + '/Pedido', pedido);
  }

    //Get Detalle Pedido Por ID
    GetDetallePedidoId(id:number): Observable<any>{
      return this.http.get<DetallePedido[]>(this.APIUrl + '/pedido/DetallePedidoId/' + id)
    }
  

  onDelete(id:number){
    return this.http.delete(this.APIUrl + '/Pedido/' + id);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
}
