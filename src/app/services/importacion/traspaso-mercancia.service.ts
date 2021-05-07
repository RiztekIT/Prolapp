import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { TraspasoMercancia } from '../../Models/importacion/detalleTraspasoMercancia-model';
import { DetalleTraspasoMercancia } from '../../Models/importacion/traspasoMercancia-model';

 export const APIUrl = environment.APIUrl;
 


@Injectable({
  providedIn: 'root'
})
export class TraspasoMercanciaService {

  nuevoTraspaso: TraspasoMercancia;
  nuevoDetalle: Array<TraspasoMercancia> = [];
  folionuevo;
  idnuevo;
  selectTraspaso;
  
  formrow: any;

  constructor(private http:HttpClient) { }

  //^ Obtener  Traspaso Mercancia
  getTraspasoMercancia():Observable<TraspasoMercancia[]>{
    return this.http.get<TraspasoMercancia[]>(APIUrl + '/TraspasoMercancia');
  }
  // obtener traspaso Mercancia por id
  GetTraspasoMercanciaid(id: number):Observable<TraspasoMercancia[]>{
    return this.http.get<TraspasoMercancia[]>(APIUrl + '/TraspasoMercancia/GetTraspasoMercanciaid/' + id);
  }
  //^ Insert Traspaso Mercancia
addTraspasoMercancia(traspaso: TraspasoMercancia) {
  return this.http.post(APIUrl + '/TraspasoMercancia/PostTraspasoMercancia', traspaso);
}
//^Update Traspaso Mercancia
updateTraspasoMercancia(traspaso: TraspasoMercancia) {
  return this.http.put(APIUrl+ '/TraspasoMercancia/PutTraspasoMercancia', traspaso);
  }
  //^Eliminar Traspaso Mercancia Id
  deleteTraspasoMercancia(id: number){
    return this.http.delete(APIUrl+ '/TraspasoMercancia/DeleteTraspasoMercancia/' + id);
  }

   //^ Obtener  Detalle Traspaso Mercancia
getDetalleTraspasoMercancia(id):Observable<DetalleTraspasoMercancia[]>{
  return this.http.get<DetalleTraspasoMercancia[]>(APIUrl + '/TraspasoMercancia/GetDetalleTraspasoMercancia/'+id);
}
//^ Insert Detalle Traspaso Mercancia
addDetalleTraspasoMercancia(detalle: TraspasoMercancia) {
  return this.http.post(APIUrl + '/TraspasoMercancia/PostDetalleTraspasoMercancia', detalle);
}
//^Update  Detalle Traspaso Mercancia
updateDetalleTraspasoMercancia(detalle: TraspasoMercancia) {
  return this.http.put(APIUrl+ '/TraspasoMercancia/PutDetalleTraspasoMercancia', detalle);
  }
  //^Eliminar Detalle Traspaso Mercancia Id
  deleteDetalleTraspasoMercancia(id: number){
    return this.http.delete(APIUrl+ '/TraspasoMercancia/DeleteDetalleTraspasoMercancia/' + id);
  }

  //^ Consultas generales
getQuery(query) {
  return this.http.post(APIUrl + '/TraspasoMercancia/general', query);
}


// *******************   REPORTES  ************************* //

//Obtener traspasos por Bodega Origen => Destino
getReporteTraspasoBodegas(bodegaOrigen: string, bodegaDestino: string):Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegas/'+bodegaOrigen+'/'+bodegaDestino);
}

//Obtener traspasos por Bodega Origen => Destino y Fecha de Expedicion
getReporteTraspasoBodegasFechas(bodegaOrigen: string, bodegaDestino: string, fecha1:string, fecha2:string):Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegasFechas/'+bodegaOrigen+'/'+bodegaDestino+'/'+fecha1+'/'+fecha2);
}

//Obtener traspasos por Bodega Origen => Destino y Estatus
getReporteTraspasoBodegasEstatus(bodegaOrigen: string, bodegaDestino: string, estatus:string):Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegasEstatus/'+bodegaOrigen+'/'+bodegaDestino+'/'+estatus);
}

//Obtener traspasos por Bodega Origen => Destino , Fecha de Expedicion y Estatus
getReporteTraspasoBodegasFechasEstatus(bodegaOrigen: string, bodegaDestino: string, fecha1:string, fecha2:string, estatus:string):Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/reportes/GetTraspasoBodegasFechasEstatus/'+bodegaOrigen+'/'+bodegaDestino+'/'+fecha1+'/'+fecha2+'/'+estatus);
}

// *******************   REPORTES  ************************* //

  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }
}
