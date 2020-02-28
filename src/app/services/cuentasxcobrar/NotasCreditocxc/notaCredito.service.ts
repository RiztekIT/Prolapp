import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { NotaCredito } from '../../../Models/nota-credito/notaCredito-model';
import { NotaCreditoMaster } from '../../../Models/nota-credito/notaCreditoMaster-model';
import { DetalleNotaCredito } from '../../../Models/nota-credito/detalleNotaCredito-model';

export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
    providedIn: 'root'
  })

  export class NotaCreditoService {

    constructor(private http:HttpClient) { }

    //form Data Nota Credito
    formData = new NotaCredito();

    //form Data Detalle Nota Credito
    DetalleformData = new DetalleNotaCredito();
    
    DetalleFactura = new Array<any>();

    //Moneda
    Moneda: string;

    //Tipo de Cambio
    TipoCambio: string;

    readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

     //Insertar nueva Nota Credito
  addNotaCredito(notaCredito: NotaCredito) {
    return this.http.post(this.APIUrl + '/NotaCredito', notaCredito);
  }

  private _listeners = new Subject<any>(); 
listen(): Observable<any> {
  return this._listeners.asObservable();
}
filter(filterBy: string) {
  this._listeners.next(filterBy);
}

}