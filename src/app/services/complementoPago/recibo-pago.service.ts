import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable, Subject } from 'rxjs';
import { ReciboPago } from '../../Models/ComplementoPago/recibopago';
import { PagoCFDI } from '../../Models/ComplementoPago/pagocfdi';

@Injectable({
  providedIn: 'root'
})
export class ReciboPagoService {

  constructor(private http:HttpClient) { }

  //URL donde mandaremos el request al servidor para obtener los Datos de la DB
  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  //Obtener Lista de ReciboPago
  getRecibosPagoList(): Observable <ReciboPago[]> {
    return this.http.get<ReciboPago[]>(this.APIUrl + '/ReciboPago');
  }
  //Obtener Lista de PagoCFDI
  //Crear Recibo Pago
  //Crear PagoCFDI
  //Eliminar Recibo Pago
  //Eliminar PagoCFDI

}
