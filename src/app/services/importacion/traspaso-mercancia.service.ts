import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { TraspasoMercancia } from '../../Models/importacion/detalleTraspasoMercancia-model';
import { DetalleTraspasoMercancia } from '../../Models/importacion/traspasoMercancia-model';

 
 


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

  APIUrl = environment.APIUrl;

  constructor(private http:HttpClient) { }

  //^ Obtener  Traspaso Mercancia
  getTraspasoMercancia():Observable<TraspasoMercancia[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<TraspasoMercancia[]>(this.APIUrl + '/TraspasoMercancia');
  }
  // obtener traspaso Mercancia por id
  GetTraspasoMercanciaid(id: number):Observable<TraspasoMercancia[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<TraspasoMercancia[]>(this.APIUrl + '/TraspasoMercancia/GetTraspasoMercanciaid/' + id);
  }
  //^ Insert Traspaso Mercancia
addTraspasoMercancia(traspaso: TraspasoMercancia) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/TraspasoMercancia/PostTraspasoMercancia', traspaso);
}
//^Update Traspaso Mercancia
updateTraspasoMercancia(traspaso: TraspasoMercancia) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/TraspasoMercancia/PutTraspasoMercancia', traspaso);
  }
  //^Eliminar Traspaso Mercancia Id
  deleteTraspasoMercancia(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl+ '/TraspasoMercancia/DeleteTraspasoMercancia/' + id);
  }

   //^ Obtener  Detalle Traspaso Mercancia
getDetalleTraspasoMercancia(id):Observable<DetalleTraspasoMercancia[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<DetalleTraspasoMercancia[]>(this.APIUrl + '/TraspasoMercancia/GetDetalleTraspasoMercancia/'+id);
}
//^ Insert Detalle Traspaso Mercancia
addDetalleTraspasoMercancia(detalle: TraspasoMercancia) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/TraspasoMercancia/PostDetalleTraspasoMercancia', detalle);
}
//^Update  Detalle Traspaso Mercancia
updateDetalleTraspasoMercancia(detalle: TraspasoMercancia) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/TraspasoMercancia/PutDetalleTraspasoMercancia', detalle);
  }
  //^Eliminar Detalle Traspaso Mercancia Id
  deleteDetalleTraspasoMercancia(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl+ '/TraspasoMercancia/DeleteDetalleTraspasoMercancia/' + id);
  }

  //^ Consultas generales
getQuery(query) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/TraspasoMercancia/general', query);
}


// *******************   REPORTES  ************************* //

//Obtener traspasos por Bodega Origen => Destino
getReporteTraspasoBodegas(bodegaOrigen: string, bodegaDestino: string):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/reportes/GetTraspasoBodegas/'+bodegaOrigen+'/'+bodegaDestino);
}

//Obtener traspasos por Bodega Origen => Destino y Fecha de Expedicion
getReporteTraspasoBodegasFechas(bodegaOrigen: string, bodegaDestino: string, fecha1:string, fecha2:string):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/reportes/GetTraspasoBodegasFechas/'+bodegaOrigen+'/'+bodegaDestino+'/'+fecha1+'/'+fecha2);
}

//Obtener traspasos por Bodega Origen => Destino y Estatus
getReporteTraspasoBodegasEstatus(bodegaOrigen: string, bodegaDestino: string, estatus:string):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/reportes/GetTraspasoBodegasEstatus/'+bodegaOrigen+'/'+bodegaDestino+'/'+estatus);
}

//Obtener traspasos por Bodega Origen => Destino , Fecha de Expedicion y Estatus
getReporteTraspasoBodegasFechasEstatus(bodegaOrigen: string, bodegaDestino: string, fecha1:string, fecha2:string, estatus:string):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/reportes/GetTraspasoBodegasFechasEstatus/'+bodegaOrigen+'/'+bodegaDestino+'/'+fecha1+'/'+fecha2+'/'+estatus);
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
