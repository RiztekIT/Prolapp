import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { Pedido } from '../../Models/Pedidos/pedido-model';
import { environment } from 'src/environments/environment';

export const APIUrl = environment.APIUrl;
//export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
    providedIn: 'root'
})

export class PedidoService { 

    constructor(private http:HttpClient) { }

    formData: Pedido;

    getPedidoList(): Observable <Pedido[]> {
        return this.http.get<Pedido[]>(APIUrl + '/pedido');
      }

    private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
}