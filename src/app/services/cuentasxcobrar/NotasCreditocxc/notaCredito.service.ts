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

    idNotaCredito: number;

    ClienteNombre: string;

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
    // readonly APIUrl = "https://localhost:44361/api";

     //Insertar nueva Nota Credito
  addNotaCredito(notaCredito: NotaCredito) {
    return this.http.post(this.APIUrl + '/NotaCredito', notaCredito);
  }
  //Insertar Detalle Nota Credito
  addDetalleNotaCredito(dnt: DetalleNotaCredito) {
    return this.http.post(this.APIUrl + '/NotaCredito/InsertDetalleNotaCredito', dnt);
  }
  //Actualizar Nota Credito
updateNotaCredito(notaCredito: NotaCredito){
  return this.http.put(this.APIUrl + '/NotaCredito', notaCredito)
}
  //Actualizar Detalle Nota Credito
updateDetalleNotaCredito(detalleNota: DetalleNotaCredito){
  return this.http.put(this.APIUrl + '/NotaCredito/UpdateDetalleNotaCredito', detalleNota)
}
  //Eliminar Nota Credito
  DeleteNotaCredito(id:number){
return this.http.delete(this.APIUrl + '/NotaCredito/'+ id)
  }
  //Eliminar Detalle Nota Credito
  DeleteDetalleNotaCredito(id: number){
    return this.http.delete(this.APIUrl + '/NotaCredito/DeleteDetalleNotaCredito/'+ id)
  }

  //Obtener ultima Nota Pago
  getUltimaNotaCredito(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/NotaCredito/UltimaNotaCredito');
  }
  //Obtener Detalles Nota Credito en base a Id Nota Credito
    getDetalleNotaCreditoList(id: number): Observable<DetalleNotaCredito[]> {
      return this.http.get<DetalleNotaCredito[]>(this.APIUrl + '/NotaCredito/DetalleNotaCreditoID/' + id);
    }


  private _listeners = new Subject<any>(); 
listen(): Observable<any> {
  return this._listeners.asObservable();
}
filter(filterBy: string) {
  this._listeners.next(filterBy);
}

}